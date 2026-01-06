# Wedding Website - Complete Setup Guide

This guide will walk you through every step needed to get your wedding website live.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Customization](#initial-customization)
3. [Google Sheets Setup](#google-sheets-setup)
4. [Cloudflare Setup](#cloudflare-setup)
5. [Testing](#testing)
6. [Going Live](#going-live)

---

## Prerequisites

### What You Need

- [ ] Google Account (for Google Sheets)
- [ ] Cloudflare Account (free tier works)
- [ ] Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Your wedding photos
- [ ] Wedding details (date, venue, schedule)
- [ ] Text editor (VS Code, Sublime, or any)
- [ ] Node.js installed (for Wrangler CLI)

### Estimated Setup Time

- Basic customization: 1-2 hours
- Google Sheets setup: 30 minutes
- Cloudflare deployment: 30 minutes
- **Total: 2-3 hours**

---

## Initial Customization

### Step 1: Personalize Content

#### 1.1 Update Names and Date

Open `_2pages/index.html` and find/replace:

```html
<!-- Line 30-34: Hero section -->
<span class="ampersand">Sarah</span>   <!-- Change to your names -->
<span class="ampersand">Michael</span>

<p class="hero-date">June 15, 2026</p>  <!-- Change date -->
```

Also update:
- Line 278: `<title>Sarah & Michael - Our Wedding</title>`
- Line 411: Footer names

#### 1.2 Set Countdown Timer Date

Open `_2pages/js/countdown.js`:

```javascript
// Line 4: Format: (year, month-1, day, hour, minute, second)
const weddingDate = new Date(2026, 5, 15, 16, 0, 0);
// Note: Months are 0-indexed! (0=Jan, 1=Feb, ..., 11=Dec)
// Example: March 20, 2026 at 3:30 PM = (2026, 2, 20, 15, 30, 0)
```

#### 1.3 Update Love Story

Open `_2pages/index.html` and edit the story section (lines 65-125):

```html
<div class="story-date">Spring 2019</div>  <!-- Your date -->
<h3>The First Hello</h3>                    <!-- Your title -->
<p>Your story text here...</p>              <!-- Your story -->
```

Repeat for all 4 story milestones (or add/remove as needed).

#### 1.4 Update Wedding Details

Find and update (lines 160-200):

```html
<!-- When -->
<p class="detail-main">Saturday, June 15, 2026</p>
<p class="detail-sub">Ceremony begins at 4:00 PM</p>

<!-- Where -->
<p class="detail-main">The Garden Estate</p>
<p class="detail-sub">1234 Meadow Lane</p>
<p class="detail-sub">Hillsborough, CA 94010</p>
<a href="https://maps.google.com/?q=YOUR_ADDRESS" target="_blank">View on Map</a>

<!-- Dress Code -->
<p class="detail-main">Formal Attire</p>
```

#### 1.5 Update Schedule

Find the schedule section (lines 220-245) and adjust times:

```html
<span class="timeline-time">3:30 PM</span>
<span class="timeline-event">Guest Arrival</span>
<!-- Update all timeline items -->
```

#### 1.6 Update Gift Registry

Find registry section (lines 260-285):

```html
<a href="https://www.amazon.com/wedding/your-registry" class="registry-link">
    View Amazon Registry
</a>
<!-- Update with your actual registry URLs -->
```

### Step 2: Add Your Photos

#### 2.1 Prepare Photos

1. Collect 15-20 high-quality photos
2. Resize to reasonable dimensions:
   - Gallery photos: 1200x1600px (portrait) or 1600x1200px (landscape)
   - Story photos: 800x1066px
3. Compress using TinyPNG or similar tool
4. Name files clearly: `photo-01.jpg`, `photo-02.jpg`, etc.

#### 2.2 Add Photos to Project

```bash
# Copy your photos
cp ~/path/to/photos/* _2pages/images/gallery/
cp ~/path/to/story-photos/* _2pages/images/story/
```

#### 2.3 Update HTML to Use Photos

Replace gallery placeholders (around line 140):

```html
<!-- Before (placeholder) -->
<div class="gallery-item tall fade-in" data-delay="0">
    <div class="gallery-placeholder">
        <span>Photo 1</span>
    </div>
</div>

<!-- After (with your photo) -->
<div class="gallery-item tall fade-in" data-delay="0">
    <img src="images/gallery/photo-01.jpg" alt="Sarah and Michael at the beach" loading="lazy">
</div>
```

Add CSS for images in `styles.css`:

```css
.gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.gallery-item:hover img {
    transform: scale(1.05);
}
```

Update story image placeholders similarly (around lines 80-120).

### Step 3: Customize Colors (Optional)

Open `_2pages/css/styles.css` and edit color variables (lines 8-17):

```css
:root {
    /* Current: Terracotta & Sage theme */
    --color-ivory: #FAF7F2;
    --color-terracotta: #C97C5D;
    --color-sage: #A4B494;

    /* Example: Navy & Blush theme */
    /* --color-ivory: #FFF9F5;
    --color-terracotta: #1F3A5F;  (navy)
    --color-sage: #F4C2C2;         (blush) */

    /* Example: Burgundy & Gold theme */
    /* --color-terracotta: #800020;  (burgundy)
    --color-sage: #D4AF37;         (gold) */
}
```

Save and refresh to see changes immediately!

### Step 4: Test Locally

```bash
# Navigate to pages folder
cd _2pages

# Start local server (choose one):
python3 -m http.server 8000
# OR
npx serve .

# Open browser to: http://localhost:8000
```

**Test checklist:**
- [ ] Countdown is working
- [ ] All photos load correctly
- [ ] Navigation works smoothly
- [ ] Form fields are functional
- [ ] Mobile view looks good (use browser dev tools)

---

## Google Sheets Setup

### Step 1: Create the Spreadsheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click "Blank" to create new spreadsheet
3. Name it: "Wedding RSVP Responses"
4. Rename Sheet1 to: "RSVP Responses"

### Step 2: Add Column Headers

In row 1, add these headers:

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Timestamp | Name | Email | Phone | Attending | Number of Guests | Dietary Restrictions | Special Message |

**Optional formatting:**
- Bold the header row
- Freeze row 1: View → Freeze → 1 row
- Add alternating colors: Format → Alternating colors

### Step 3: Get Sheet ID

Copy the Sheet ID from the URL:
```
https://docs.google.com/spreadsheets/d/[COPY_THIS_PART]/edit
Example: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

Save this ID—you'll need it later!

### Step 4: Set Up Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click project dropdown at top
3. Click "New Project"
4. Project name: "Wedding Website"
5. Click "Create"
6. Wait for project creation (30 seconds)

### Step 5: Enable Google Sheets API

1. In the search bar, type "Google Sheets API"
2. Click on "Google Sheets API" result
3. Click "Enable" button
4. Wait for API to be enabled

### Step 6: Create Service Account

1. Click "Credentials" in left sidebar
2. Click "Create Credentials" at top
3. Select "Service Account"
4. Fill in details:
   - **Name**: `wedding-rsvp-handler`
   - **ID**: (auto-filled)
   - **Description**: `Handles RSVP form submissions to Google Sheets`
5. Click "Create and Continue"
6. Skip role assignment (click "Continue")
7. Skip user access (click "Done")

### Step 7: Generate Service Account Key

1. Find your service account in the list
2. Click on it to open details
3. Go to "Keys" tab
4. Click "Add Key" → "Create New Key"
5. Choose "JSON" format
6. Click "Create"
7. Save the downloaded JSON file securely!

**⚠️ SECURITY WARNING:**
- Never commit this file to git
- Never share it publicly
- Store it securely (password manager, encrypted folder)
- Name it something like: `wedding-service-account-key.json`

### Step 8: Share Sheet with Service Account

1. Open the downloaded JSON file
2. Find and copy the `client_email` value (looks like: `name@project.iam.gserviceaccount.com`)
3. Go back to your Google Sheet
4. Click "Share" button (top right)
5. Paste the service account email
6. Change permissions to "Editor"
7. **UNCHECK** "Notify people"
8. Click "Share"

**You should see the service account listed in "People with access"**

### Step 9: Verify Setup

Create a test entry manually in the sheet to ensure columns work:

| Timestamp | Name | Email | Phone | Attending | Number of Guests | Dietary Restrictions | Special Message |
|-----------|------|-------|-------|-----------|------------------|---------------------|----------------|
| 2026-01-06T12:00:00Z | Test User | test@example.com | 555-1234 | yes | 2 | None | Testing! |

---

## Cloudflare Setup

### Step 1: Create Cloudflare Account

1. Go to [cloudflare.com](https://cloudflare.com)
2. Click "Sign Up" (free tier is sufficient)
3. Verify your email

### Step 2: Install Wrangler CLI

```bash
# Install globally
npm install -g wrangler

# Verify installation
wrangler --version
```

If you don't have Node.js/npm:
- Download from [nodejs.org](https://nodejs.org)
- Install the LTS version
- Then run npm install command above

### Step 3: Login to Cloudflare

```bash
# This opens a browser for authentication
wrangler login
```

Allow access when prompted in the browser.

### Step 4: Configure Worker

1. Open `_3workers/wrangler.toml`
2. Find the `[vars]` section
3. Add your Google Sheet ID:

```toml
[vars]
SHEET_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"  # Your actual Sheet ID
```

4. Save the file

### Step 5: Set Service Account Secret

```bash
# Navigate to workers folder
cd _3workers

# Set the secret
wrangler secret put GOOGLE_SERVICE_ACCOUNT_KEY
```

When prompted:
1. Open your `wedding-service-account-key.json` file
2. Copy the **ENTIRE contents** (from `{` to `}`)
3. Paste into terminal
4. Press Enter twice

You should see: "✅ Successfully created secret GOOGLE_SERVICE_ACCOUNT_KEY"

### Step 6: Deploy Worker

```bash
# Still in _3workers folder
wrangler deploy
```

Expected output:
```
⛅️ wrangler 3.x.x
-------------------
✨ Compiled Worker successfully
✨ Uploaded wedding-rsvp-worker
✨ Published wedding-rsvp-worker
  https://wedding-rsvp-worker.your-account.workers.dev
```

**Copy and save this Worker URL!**

### Step 7: Test Worker

```bash
# Test the worker
curl -X POST https://wedding-rsvp-worker.your-account.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-1234",
    "attendance": "yes",
    "guests": "2",
    "dietary": "None",
    "message": "Test message"
  }'
```

Check your Google Sheet—you should see a new row!

### Step 8: Deploy Website to Cloudflare Pages

#### Option A: Via Git (Recommended)

1. **Push your code to GitHub:**

```bash
# Initialize git (if not already)
git init

# Add files
git add .

# Commit
git commit -m "Initial wedding website"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/yourusername/wedding-website.git

# Push
git push -u origin main
```

2. **Connect to Cloudflare Pages:**

- Go to [dash.cloudflare.com](https://dash.cloudflare.com)
- Click "Workers & Pages" in left menu
- Click "Create application" → "Pages" tab
- Click "Connect to Git"
- Choose your repository
- Configure:
  - **Build command**: (leave empty)
  - **Build output directory**: `_2pages`
  - **Root directory**: `/`
- Click "Save and Deploy"

#### Option B: Direct Upload

```bash
# From project root
wrangler pages deploy _2pages --project-name=wedding-website
```

### Step 9: Connect Worker to Pages

1. Go to your Pages project in Cloudflare Dashboard
2. Click "Settings" → "Functions"
3. Scroll to "Routes"
4. Add route:
   - **Path**: `/api/rsvp`
   - **Service**: `wedding-rsvp-worker`
5. Click "Save"

### Step 10: Update Form Endpoint

Edit `_2pages/js/form.js` (line 13):

```javascript
// Change from:
this.workerEndpoint = '/api/rsvp';

// To your actual worker URL (if not using Pages Functions):
this.workerEndpoint = 'https://wedding-rsvp-worker.your-account.workers.dev';

// OR keep as '/api/rsvp' if using Pages Functions routing
```

**Commit and push this change if using Git deployment.**

---

## Testing

### Test Checklist

1. **Homepage:**
   - [ ] Page loads without errors
   - [ ] Names and date are correct
   - [ ] Countdown shows correct time
   - [ ] Navigation works smoothly

2. **Love Story:**
   - [ ] All dates and text are correct
   - [ ] Photos load properly
   - [ ] Section animates on scroll

3. **Gallery:**
   - [ ] All photos load
   - [ ] Clicking photo opens lightbox
   - [ ] Navigation arrows work
   - [ ] ESC key closes lightbox

4. **Details Section:**
   - [ ] Date, time, venue are correct
   - [ ] Map link works
   - [ ] Schedule is accurate

5. **RSVP Form:**
   - [ ] All fields are present
   - [ ] Validation works
   - [ ] Test submission succeeds
   - [ ] Entry appears in Google Sheet
   - [ ] Success message displays

6. **Mobile:**
   - [ ] Open on your phone
   - [ ] Navigation menu works
   - [ ] All sections readable
   - [ ] Form is usable
   - [ ] Photos display correctly

### Test RSVP Submission

1. Fill out the form completely
2. Submit
3. Check for success message
4. Open your Google Sheet
5. Verify new row with your test data

**If submission fails:**
- Check browser console (F12) for errors
- Run `wrangler tail` to see Worker logs
- Verify Sheet ID in `wrangler.toml`
- Confirm service account has Sheet access

---

## Going Live

### Step 1: Add Custom Domain (Optional)

1. Go to your Cloudflare Pages project
2. Click "Custom domains"
3. Click "Set up a custom domain"
4. Enter your domain: `www.yourdomain.com`
5. Follow DNS instructions provided
6. Wait for SSL certificate (automatic, ~24 hours)

### Step 2: Update CORS Settings

For production, update `_3workers/rsvp-handler.js` (line 7):

```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://yourwedding.com', // Your actual domain
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};
```

Then redeploy:
```bash
cd _3workers
wrangler deploy
```

### Step 3: Set RSVP Deadline

Update in `_2pages/index.html` (line 300):

```html
<p class="section-subtitle">Please respond by April 15, 2026</p>
```

### Step 4: Add Analytics (Optional)

Add Google Analytics to `_2pages/index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Step 5: Share with Guests

Your website is live! Share the URL:
- Add to invitations
- Share via email
- Post on social media
- Add QR code to printed materials

### Step 6: Monitor Responses

- Check Google Sheet regularly
- Export as backup: File → Download → CSV
- Respond to special messages from guests

---

## Troubleshooting

### Issue: Countdown shows "000:00:00:00"

**Solution:** Check the date format in `countdown.js`. Remember months are 0-indexed!

### Issue: RSVP form doesn't submit

**Possible causes:**
1. Worker not deployed correctly
2. Sheet ID incorrect in `wrangler.toml`
3. Service account doesn't have access to sheet
4. CORS headers blocking request

**Debug steps:**
```bash
# Check Worker logs
cd _3workers
wrangler tail

# Then submit form and watch for errors
```

### Issue: Photos not loading

**Causes:**
- File path incorrect in HTML
- Images not uploaded to repository
- Image files too large (>5MB)

**Solution:**
- Check file paths match exactly (case-sensitive)
- Compress images before uploading
- Use browser dev tools Network tab to see 404 errors

### Issue: Mobile menu not working

**Solution:**
- Clear browser cache
- Check `countdown.js` loaded correctly
- Verify no JavaScript errors in console

### Issue: Google Sheet not receiving data

**Debug checklist:**
1. Service account email listed in Sheet's "Share" settings?
2. Sheet name exactly "RSVP Responses"?
3. Sheet ID correct in `wrangler.toml`?
4. Worker secret set correctly?

**Test command:**
```bash
# List secrets
wrangler secret list

# Should show: GOOGLE_SERVICE_ACCOUNT_KEY
```

---

## Maintenance

### Regularly Check:
- Google Sheet for new RSVPs
- Respond to guests with questions
- Update information if venues/times change

### Before Wedding Day:
- Download Sheet as backup (CSV)
- Print final guest list
- Consider hiding RSVP section after deadline

### After Wedding:
- Update website with thank you message
- Add wedding photos
- Keep site live as a memory

---

## Need Help?

### Documentation Links:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler)

### Common Resources:
- [TinyPNG](https://tinypng.com) - Image compression
- [Google Fonts](https://fonts.google.com) - Font selection
- [Coolors](https://coolors.co) - Color palette generator

---

**Congratulations on your wedding! 🎉**

This setup guide should have you up and running. The website will serve you well for your special day.
