# Deployment Status

## ✅ Cloudflare Worker Deployed

**Worker URL**: `https://wedding-rsvp-worker.michal-basznianin.workers.dev`

**Status**: Live and ready to receive requests

**Deployed**: 2026-01-06

### What's Working
✅ Worker is deployed and accessible
✅ CORS headers configured
✅ Form submission endpoint ready
✅ Frontend connected to worker

### What Still Needs Setup

⚠️ **Google Sheets Integration** (Required for RSVP to work)

The worker is deployed but needs Google Sheets configuration to actually save RSVP data:

1. **Create Google Sheet** (5 min)
   - Create new sheet named "Wedding RSVP Responses"
   - Add headers: Timestamp, Name, Email, Phone, Attending, Number of Guests, Dietary Restrictions, Special Message

2. **Set up Google Cloud** (15 min)
   - Create Google Cloud Project
   - Enable Google Sheets API
   - Create Service Account
   - Download JSON key

3. **Configure Worker Secrets** (5 min)
   ```bash
   cd _3workers

   # Set Sheet ID
   npx wrangler secret put SHEET_ID
   # Paste your Google Sheet ID

   # Set Service Account credentials
   npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_KEY
   # Paste entire JSON key contents
   ```

4. **Share Sheet with Service Account**
   - Copy `client_email` from JSON key
   - Share your Google Sheet with that email
   - Give "Editor" permissions

### Testing Worker

Test if worker is responding:

```bash
curl -X POST https://wedding-rsvp-worker.michal-basznianin.workers.dev \
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

Without Google Sheets setup, this will return an error. After setup, it should succeed and add a row to your sheet.

## Website Deployment Options

### Option 1: Cloudflare Pages (Recommended)

```bash
# Deploy frontend
npx wrangler pages deploy _2pages --project-name=wedding-website
```

Your site will be live at: `https://wedding-website.pages.dev`

### Option 2: GitHub Pages

1. Push to GitHub (already done ✅)
2. Go to repository Settings → Pages
3. Source: Deploy from branch `main`
4. Folder: `/_2pages`
5. Save

Site will be at: `https://sqooby.github.io/wedding_guest_confirmation/`

### Option 3: Netlify

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import from Git"
3. Choose your repository
4. Build settings:
   - Base directory: `_2pages`
   - Build command: (leave empty)
   - Publish directory: `.`
5. Deploy

## Current URLs

- **Worker API**: https://wedding-rsvp-worker.michal-basznianin.workers.dev
- **GitHub Repo**: https://github.com/Sqooby/wedding_guest_confirmation
- **Website**: (Deploy using one of the options above)

## Next Steps

1. ⚠️ **Complete Google Sheets setup** (see above)
2. 🚀 **Deploy website** using one of the options
3. ✏️ **Customize content** (names, dates, photos, story)
4. 🧪 **Test RSVP form** end-to-end
5. 📢 **Share with guests!**

## Monitoring

### View Worker Logs

```bash
cd _3workers
npx wrangler tail
```

This shows real-time logs of form submissions and errors.

### View Worker Stats

Visit: https://dash.cloudflare.com/

- Go to "Workers & Pages"
- Click "wedding-rsvp-worker"
- View analytics, logs, and request stats

## Troubleshooting

### RSVP submissions fail

**Symptom**: Form shows error message
**Cause**: Google Sheets not configured
**Fix**: Complete Google Sheets setup (see above)

### CORS errors in browser

**Symptom**: Console shows CORS error
**Cause**: Worker CORS headers need update
**Fix**: Edit `_3workers/rsvp-handler.js` line 7, change `'*'` to your domain

### Worker not responding

**Symptom**: Network timeout
**Cause**: Worker may be sleeping (unlikely) or misconfigured
**Fix**: Check deployment status, redeploy if needed

## Security Notes

⚠️ **Important**:
- Never commit Google Service Account JSON to git
- Secrets are set via `wrangler secret put` and stored securely
- Worker environment variables are encrypted
- CORS should be restricted to your domain in production

## Support

- **Detailed setup**: See `_1spec/SETUP_GUIDE.md`
- **Worker logs**: `npx wrangler tail`
- **Cloudflare Docs**: https://developers.cloudflare.com/workers/

---

Last updated: 2026-01-06
