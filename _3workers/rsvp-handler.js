/**
 * Cloudflare Worker - RSVP Form Handler
 * This worker receives form submissions and sends them to Google Sheets
 */

// CORS headers for allowing requests from your website
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Change to your domain in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
    async fetch(request, env) {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders
            });
        }

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({
                success: false,
                message: 'Method not allowed'
            }), {
                status: 405,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        try {
            // Parse form data
            const formData = await request.json();

            // Validate required fields
            if (!formData.name || !formData.attendance) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Missing required fields'
                }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }

            // Send to Google Sheets
            const sheetResponse = await appendToGoogleSheets(formData, env);

            if (sheetResponse.success) {
                // Optional: Send confirmation email using Cloudflare Email Workers
                // await sendConfirmationEmail(formData, env);

                return new Response(JSON.stringify({
                    success: true,
                    message: 'RSVP received successfully'
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            } else {
                throw new Error('Failed to save to Google Sheets');
            }

        } catch (error) {
            console.error('Error processing RSVP:', error);

            return new Response(JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.message
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }
    }
};

/**
 * Append form data to Google Sheets using Google Sheets API
 */
async function appendToGoogleSheets(formData, env) {
    try {
        // Get credentials from environment variables
        const SHEET_ID = env.SHEET_ID;
        const SERVICE_ACCOUNT_KEY = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_KEY);

        // Get access token
        const accessToken = await getGoogleAccessToken(SERVICE_ACCOUNT_KEY);

        // Prepare row data
        const rowData = [
            formData.timestamp || new Date().toISOString(),
            formData.name,
            formData.email,
            formData.phone,
            formData.attendance,
            formData.guests,
            formData.dietary,
            formData.message
        ];

        // Google Sheets API endpoint
        const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/RSVP Responses:append?valueInputOption=RAW`;

        // Make request to Google Sheets API
        const response = await fetch(sheetsUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [rowData]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Google Sheets API error:', errorData);
            throw new Error('Failed to append to Google Sheets');
        }

        return { success: true };

    } catch (error) {
        console.error('Error in appendToGoogleSheets:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get Google OAuth2 access token using Service Account credentials
 */
async function getGoogleAccessToken(serviceAccount) {
    const jwtHeader = {
        alg: 'RS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const jwtClaimSet = {
        iss: serviceAccount.client_email,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
    };

    // Create JWT
    const jwt = await createJWT(jwtHeader, jwtClaimSet, serviceAccount.private_key);

    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        })
    });

    if (!tokenResponse.ok) {
        throw new Error('Failed to get access token');
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}

/**
 * Create JWT for Google Service Account authentication
 */
async function createJWT(header, payload, privateKey) {
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;

    // Import private key
    const key = await crypto.subtle.importKey(
        'pkcs8',
        pemToArrayBuffer(privateKey),
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
        },
        false,
        ['sign']
    );

    // Sign the token
    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        key,
        new TextEncoder().encode(unsignedToken)
    );

    const encodedSignature = base64UrlEncode(signature);
    return `${unsignedToken}.${encodedSignature}`;
}

/**
 * Convert PEM private key to ArrayBuffer
 */
function pemToArrayBuffer(pem) {
    const b64 = pem
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s/g, '');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Base64 URL encode
 */
function base64UrlEncode(data) {
    let base64;
    if (typeof data === 'string') {
        base64 = btoa(data);
    } else if (data instanceof ArrayBuffer) {
        base64 = btoa(String.fromCharCode(...new Uint8Array(data)));
    } else {
        throw new Error('Unsupported data type');
    }
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Optional: Send confirmation email to guest
 * Requires Cloudflare Email Workers or external email service
 */
async function sendConfirmationEmail(formData, env) {
    // Implement email sending logic here
    // Options:
    // 1. Use Cloudflare Email Workers
    // 2. Use SendGrid API
    // 3. Use Mailgun API
    // 4. Use AWS SES

    // Example structure:
    /*
    const emailData = {
        to: formData.email,
        from: 'noreply@yourwedding.com',
        subject: 'RSVP Confirmation - Sarah & Michael Wedding',
        text: `Dear ${formData.name},\n\nThank you for your RSVP...`,
        html: `<p>Dear ${formData.name},</p><p>Thank you for your RSVP...</p>`
    };
    */

    return { success: true };
}
