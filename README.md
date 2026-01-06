# Wedding Invitation Website

A beautiful, modern wedding invitation website with countdown timer, photo gallery, RSVP form, and Google Sheets integration.

## Features

- **Countdown Timer**: Real-time countdown to the wedding day
- **Love Story Timeline**: Share your journey together
- **Photo Gallery**: Interactive gallery with lightbox viewer
- **Wedding Details**: Ceremony and reception information with schedule
- **Gift Registry**: Links to registries and honeymoon fund
- **RSVP Form**: Comprehensive form with dietary restrictions tracking
- **Google Sheets Integration**: Automatic RSVP collection via Cloudflare Workers
- **Responsive Design**: Mobile-first, works on all devices
- **Elegant Animations**: Smooth scroll animations and transitions

## Project Structure

```
wedding_guest_confirmation/
├── _1spec/                          # Project documentation
│   └── wedding-website-specification.md
├── _2pages/                         # Frontend website
│   ├── index.html                   # Main website file
│   ├── css/
│   │   └── styles.css              # All styling
│   ├── js/
│   │   ├── countdown.js            # Timer & scroll animations
│   │   ├── gallery.js              # Photo gallery & lightbox
│   │   └── form.js                 # Form validation & submission
│   └── images/                     # Photo assets (to be added)
│       ├── gallery/
│       └── story/
├── _3workers/                      # Cloudflare Workers
│   ├── rsvp-handler.js            # Form submission handler
│   └── wrangler.toml              # Worker configuration
└── README.md                       # This file
```

## Quick Start

### 1. Customize Your Website

#### Update Wedding Information
Edit `_2pages/index.html` and replace:
- Names: "Sarah & Michael"
- Date: "June 15, 2026"
- Venue details
- Gift registry links

#### Set Wedding Date for Countdown
Edit `_2pages/js/countdown.js`:
```javascript
// Line 3: Set your wedding date (year, month-1, day, hour, minute)
const weddingDate = new Date(2026, 5, 15, 16, 0, 0); // June 15, 2026 at 4:00 PM
```

#### Add Your Photos
1. Add photos to `_2pages/images/gallery/`
2. Add story photos to `_2pages/images/story/`
3. Update HTML to reference your images

#### Customize Colors
Edit `_2pages/css/styles.css` root variables (lines 8-17):
```css
:root {
    --color-ivory: #FAF7F2;
    --color-terracotta: #C97C5D;
    --color-sage: #A4B494;
    /* ... adjust colors to your preference */
}
```

### 2. Test Locally

Simply open `_2pages/index.html` in your web browser to preview the website.

For a local server (recommended):
```bash
# Using Python
cd _2pages
python3 -m http.server 8000

# Using Node.js
npx serve _2pages

# Then visit: http://localhost:8000
```

## Google Sheets Setup

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Wedding RSVP Responses"
3. Create a sheet named "RSVP Responses"
4. Add headers in row 1:
   ```
   A: Timestamp
   B: Name
   C: Email
   D: Phone
   E: Attending
   F: Number of Guests
   G: Dietary Restrictions
   H: Special Message
   ```
5. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```

### Step 2: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project: "Wedding Website"
3. Enable Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in details:
   - Name: "wedding-rsvp-handler"
   - Description: "Service account for RSVP form submissions"
4. Click "Create and Continue"
5. Skip optional steps, click "Done"

### Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose JSON format
5. Save the JSON file securely (NEVER commit to git!)

### Step 5: Share Sheet with Service Account

1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (found in JSON file: `client_email`)
4. Give "Editor" permissions
5. Uncheck "Notify people"
6. Click "Share"

## Cloudflare Pages Deployment

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

### Step 3: Configure Worker

1. Edit `_3workers/wrangler.toml`
2. Add your Google Sheet ID:
   ```toml
   [vars]
   SHEET_ID = "your-google-sheet-id-here"
   ```

### Step 4: Set Secret (Service Account Key)

```bash
cd _3workers
wrangler secret put GOOGLE_SERVICE_ACCOUNT_KEY
```

Paste the entire contents of your service account JSON file when prompted.

### Step 5: Deploy Worker

```bash
wrangler deploy
```

Note the worker URL provided after deployment.

### Step 6: Deploy Website to Cloudflare Pages

#### Option A: Via Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select "Pages" from the left menu
3. Click "Create a project"
4. Connect your Git repository (GitHub/GitLab)
5. Configure build settings:
   - Build command: (leave empty)
   - Build output directory: `_2pages`
   - Root directory: `/`
6. Click "Save and Deploy"

#### Option B: Via Wrangler CLI

```bash
wrangler pages deploy _2pages --project-name=wedding-website
```

### Step 7: Connect Worker to Pages

1. In Cloudflare Dashboard, go to your Pages project
2. Go to "Settings" > "Functions"
3. Add route: `/api/rsvp` → `wedding-rsvp-worker`

### Step 8: Update Form Endpoint

Edit `_2pages/js/form.js` (line 13):
```javascript
this.workerEndpoint = 'https://your-worker-url.workers.dev'; // or '/api/rsvp' if using Pages Functions
```

## Configuration Options

### Custom Domain

1. Go to Cloudflare Pages > Your Project > Custom Domains
2. Add your domain
3. Update DNS records as instructed

### CORS Configuration

For production, update `_3workers/rsvp-handler.js` (line 7):
```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://yourwedding.com', // Your domain
    // ...
};
```

### Rate Limiting

Add rate limiting to prevent spam (optional):

```javascript
// In rsvp-handler.js, add:
const RATE_LIMIT = 5; // Max submissions per IP per hour
```

## Customization Guide

### Changing Fonts

Edit the Google Fonts import in `_2pages/index.html` (line 8):
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@300;400&display=swap" rel="stylesheet">
```

Update CSS variables in `styles.css`:
```css
--font-display: 'YourFont', serif;
```

### Adding Sections

1. Add HTML section in `index.html`
2. Add corresponding styles in `styles.css`
3. Add navigation link in nav menu

### Modifying Colors

All colors are defined as CSS variables at the top of `styles.css`. Change them to match your wedding theme.

## Analytics (Optional)

### Add Google Analytics

Add to `<head>` in `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Troubleshooting

### RSVP Form Not Submitting

1. Check browser console for errors
2. Verify Worker is deployed: `wrangler tail`
3. Check Google Sheets API is enabled
4. Verify service account has access to sheet

### Countdown Not Working

1. Check date format in `countdown.js`
2. Ensure JavaScript is enabled in browser
3. Check browser console for errors

### Styles Not Loading

1. Verify file paths are correct
2. Check CSS file exists at `_2pages/css/styles.css`
3. Clear browser cache

## Performance Optimization

### Image Optimization

1. Compress images before uploading
2. Use WebP format with JPG fallback
3. Implement lazy loading (already included)

### Caching

Cloudflare Pages automatically handles caching. For custom cache rules, use Page Rules.

## Security

- Never commit service account keys to git
- Use environment variables for secrets
- Update CORS headers for production
- Consider adding CAPTCHA for spam prevention
- Regularly review RSVP submissions for spam

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

This is a personal wedding website. Feel free to use as inspiration for your own project.

## Support

For technical issues:
- Check the specification document in `_1spec/`
- Review Cloudflare Pages documentation
- Check Google Sheets API documentation

## Credits

- Design: Custom romantic editorial aesthetic
- Icons: Inline SVG
- Fonts: Google Fonts (Cormorant Garamond, Jost, Mrs Saint Delafield)
- Hosting: Cloudflare Pages
- Backend: Cloudflare Workers

---

**Made with love for your special day** ❤️
