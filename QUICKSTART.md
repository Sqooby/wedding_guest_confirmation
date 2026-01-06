# Wedding Website - Quick Start

Get your wedding website running in 5 minutes!

## Preview Locally (Immediate)

```bash
cd _2pages
python3 -m http.server 8000
# Open http://localhost:8000 in browser
```

## 5-Minute Customization

### 1. Update Names & Date (2 minutes)

**File: `_2pages/index.html`**

Find and replace:
- `Sarah` → Your first name
- `Michael` → Your partner's name
- `June 15, 2026` → Your wedding date

**File: `_2pages/js/countdown.js` (line 4)**

```javascript
const weddingDate = new Date(2026, 5, 15, 16, 0, 0);
//                           (year, month-1, day, hour, min, sec)
// Change to your date! Months: 0=Jan, 1=Feb, ... 11=Dec
```

### 2. Update Venue Details (1 minute)

**File: `_2pages/index.html`** (search for "The Garden Estate")

Replace:
- Venue name
- Address
- Map link: `https://maps.google.com/?q=YOUR_VENUE_ADDRESS`

### 3. Update Registry Links (1 minute)

**File: `_2pages/index.html`** (search for "registry-link")

Replace `href="#"` with your actual registry URLs.

### 4. Customize Your Story (1 minute)

**File: `_2pages/index.html`** (search for "Our Story")

Edit the 4 story sections with your own dates and text.

---

## Deploy to Cloudflare Pages

### Quick Deploy

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy pages
wrangler pages deploy _2pages --project-name=wedding-website
```

Your site is now live at: `https://wedding-website.pages.dev`

---

## Setup RSVP Form (Optional - 30 minutes)

For full RSVP functionality with Google Sheets:

👉 **Follow the complete guide:** `_1spec/SETUP_GUIDE.md`

**Steps:**
1. Create Google Sheet
2. Set up Google Cloud Service Account
3. Deploy Cloudflare Worker
4. Connect everything

---

## Quick Customization Tips

### Change Colors

**File: `_2pages/css/styles.css`** (lines 8-17)

```css
:root {
    --color-terracotta: #C97C5D;  /* Change main accent color */
    --color-sage: #A4B494;        /* Change secondary color */
}
```

### Add Your Photos

1. Add photos to `_2pages/images/gallery/`
2. Edit HTML to reference them:

```html
<!-- Replace placeholders with: -->
<img src="images/gallery/your-photo.jpg" alt="Description">
```

---

## Project Structure

```
wedding_guest_confirmation/
├── _1spec/                    # 📚 Documentation
│   ├── SETUP_GUIDE.md        # Detailed setup instructions
│   └── wedding-website-specification.md
├── _2pages/                   # 🌐 Your website
│   ├── index.html            # Main page (edit this!)
│   ├── css/styles.css        # Styling
│   ├── js/                   # Interactivity
│   └── images/               # Your photos go here
├── _3workers/                 # ⚙️ Backend (for RSVP)
│   ├── rsvp-handler.js
│   └── wrangler.toml
├── README.md                  # Full documentation
└── QUICKSTART.md             # This file
```

---

## What Works Right Now

✅ Beautiful responsive design
✅ Countdown timer
✅ Photo gallery with lightbox
✅ Smooth animations
✅ Mobile navigation
✅ RSVP form (UI only - needs backend setup)

## What Needs Setup

⚙️ Google Sheets integration (30 min)
⚙️ Cloudflare Worker deployment (15 min)
📸 Adding your actual photos (30 min)
✏️ Writing your love story (15 min)

---

## Common Tasks

### Test Locally
```bash
cd _2pages
python3 -m http.server 8000
```

### Deploy Changes
```bash
wrangler pages deploy _2pages
```

### View Worker Logs
```bash
cd _3workers
wrangler tail
```

---

## Need Help?

- **Detailed setup:** Read `_1spec/SETUP_GUIDE.md`
- **Full documentation:** Read `README.md`
- **Specifications:** Read `_1spec/wedding-website-specification.md`

---

## Next Steps

1. ✅ Preview locally
2. ✅ Customize content
3. ✅ Add your photos
4. ✅ Deploy to Cloudflare
5. ✅ Share with guests!

**For RSVP functionality:** Follow `_1spec/SETUP_GUIDE.md` → Google Sheets Setup

---

**Your wedding website is ready to go! 💍**
