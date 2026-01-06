# Wedding Invitation Website - Project Specification

## Project Overview
A modern, interactive wedding invitation website with countdown timer, RSVP functionality, and Google Sheets integration for guest management.

---

## Core Features

### 1. Countdown Timer
- **Purpose**: Display time remaining until the wedding day
- **Location**: Hero section or prominent position on homepage
- **Display Format**: Days, Hours, Minutes, Seconds
- **Technical Implementation**:
  - JavaScript countdown using target wedding date/time
  - Real-time updates every second
  - Consider timezone handling if guests are international

### 2. Our Love Story Section
- **Content**: Narrative of how the couple met and their journey together
- **Format**: Timeline or story-based layout
- **Media**: Support for photos alongside story milestones
- **Styling**: Romantic, engaging design with smooth scrolling

### 3. Photo Gallery
- **Purpose**: Showcase couple's photos
- **Features**:
  - Responsive grid or carousel layout
  - Lightbox/modal for full-size viewing
  - Optimized image loading (lazy loading)
  - Support for 10-20+ photos
- **Image Optimization**: Use modern formats (WebP) with fallbacks

### 4. Wedding Details
- **Information to Display**:
  - Date: [To be filled]
  - Time: Ceremony start time
  - Venue Name: Ceremony location
  - Venue Address: Full address with map link
  - Reception Time: If different from ceremony
  - Reception Venue: If different location
  - Dress Code: Optional
  - Schedule Overview: Timeline of events
- **Map Integration**: Embed Google Maps or link to map service
- **Calendar Integration**: Add to Calendar button (iCal, Google Calendar)

### 5. Gift Registry / Wishlist
- **Purpose**: Inform guests about preferred gifts
- **Options**:
  - Link to external registry (Amazon, other services)
  - Custom wishlist with specific items
  - Cash fund information (honeymoon fund, etc.)
  - Bank account details (if culturally appropriate)
- **Presentation**: Tasteful, non-pushy design

### 6. RSVP Confirmation Form
- **Required Fields**:
  - Full Name (text input)
  - Email Address (email input, optional but recommended)
  - Phone Number (optional)
  - Attendance Confirmation (Yes/No radio buttons or dropdown)
  - Number of Guests (if +1s allowed)
  - Dietary Restrictions / Food Allergies (textarea)
  - Special Requests / Message to Couple (textarea, optional)
- **Validation**: Client-side and server-side validation
- **Submission**: Send to Google Sheets via Cloudflare Worker
- **Confirmation**: Success/error message after submission
- **Spam Protection**: Consider simple honeypot or CAPTCHA

---

## Technical Architecture

### Folder Structure
```
wedding_guest_confirmation/
├── _1spec/                          # Specifications & documentation
│   └── wedding-website-specification.md
├── _2pages/                         # Frontend static pages
│   ├── index.html                   # Main website
│   ├── css/
│   │   └── styles.css              # Main stylesheet
│   ├── js/
│   │   ├── countdown.js            # Countdown timer logic
│   │   ├── form.js                 # Form handling & validation
│   │   └── gallery.js              # Photo gallery functionality
│   ├── images/                     # Photo assets
│   │   ├── hero.jpg
│   │   ├── gallery/
│   │   └── story/
│   └── assets/                     # Other assets (fonts, icons)
├── _3workers/                      # Cloudflare Workers
│   ├── rsvp-handler.js            # Form submission handler
│   └── wrangler.toml              # Cloudflare Worker config
└── README.md                       # Project documentation
```

### Frontend Stack
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with:
  - CSS Grid & Flexbox for layout
  - CSS Variables for theming
  - Animations for enhanced UX
  - Mobile-first responsive design
- **Vanilla JavaScript**: No framework dependencies for better performance
- **Optional Libraries**:
  - Lightbox library for gallery (e.g., GLightbox, PhotoSwipe)
  - AOS (Animate On Scroll) for scroll animations

### Backend / Serverless
- **Cloudflare Workers**:
  - Serverless function to handle form submissions
  - Acts as middleware between frontend and Google Sheets API
  - Environment variables for API keys
- **Google Sheets API**:
  - Store RSVP responses in spreadsheet
  - Columns: Timestamp, Name, Email, Phone, Attendance, Guest Count, Dietary Restrictions, Message

---

## Google Sheets Integration

### Setup Requirements
1. **Google Cloud Project**:
   - Create project in Google Cloud Console
   - Enable Google Sheets API
   - Create Service Account
   - Generate JSON key for authentication

2. **Google Sheets Structure**:
   ```
   Sheet Name: "RSVP Responses"
   Columns:
   A: Timestamp
   B: Name
   C: Email
   D: Phone
   E: Attending (Yes/No)
   F: Number of Guests
   G: Dietary Restrictions
   H: Special Message
   ```

3. **Cloudflare Worker Implementation**:
   - Use Google Sheets API v4
   - Authenticate using Service Account credentials
   - Store credentials in Cloudflare Worker secrets
   - Handle API requests with proper error handling
   - Return success/failure to frontend

### API Flow
```
User fills form → Submit → Cloudflare Worker → Google Sheets API → Append row → Return success → Show confirmation
```

---

## Cloudflare Pages Deployment

### Configuration
1. **Repository Setup**:
   - Connect GitHub/GitLab repository to Cloudflare Pages
   - Set `_2pages` as the build output directory

2. **Build Settings**:
   - Framework preset: None (static site)
   - Build command: (none needed for static site)
   - Build output directory: `_2pages`
   - Root directory: `/`

3. **Custom Domain** (Optional):
   - Add custom domain in Cloudflare Pages settings
   - Configure DNS records

4. **Environment Variables**:
   - Set in Cloudflare Pages dashboard
   - Required for Worker: Google Sheets API credentials

### Cloudflare Worker Deployment
1. **Install Wrangler CLI**: `npm install -g wrangler`
2. **Configure wrangler.toml**:
   ```toml
   name = "wedding-rsvp-worker"
   main = "_3workers/rsvp-handler.js"
   compatibility_date = "2024-01-01"

   [vars]
   SHEET_ID = "your-google-sheet-id"

   # Secrets (set via CLI):
   # wrangler secret put GOOGLE_SERVICE_ACCOUNT_KEY
   ```
3. **Deploy**: `wrangler deploy`
4. **Connect to Pages**: Link worker to Pages project as Function

---

## Design Considerations

### Color Scheme
- Romantic & elegant palette
- Examples:
  - Soft pastels (blush pink, sage green, cream)
  - Classic (white, gold, burgundy)
  - Modern (navy, copper, ivory)

### Typography
- Elegant serif for headings (Playfair Display, Cormorant)
- Clean sans-serif for body text (Montserrat, Open Sans)
- Script font for decorative elements (Great Vibes, Dancing Script)

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Performance
- Optimize images (compress, use WebP)
- Minimize CSS/JS
- Lazy load images
- CDN delivery via Cloudflare

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Alt text for all images

---

## Development Phases

### Phase 1: Specification & Planning ✓
- Define requirements
- Create folder structure
- Document architecture

### Phase 2: Frontend Development
- Create HTML structure
- Implement styling (CSS)
- Build countdown timer
- Create photo gallery
- Design RSVP form
- Add responsive behavior

### Phase 3: Backend Integration
- Set up Google Cloud Project
- Create Google Sheet
- Develop Cloudflare Worker
- Implement form submission handler
- Test API integration

### Phase 4: Deployment & Testing
- Deploy to Cloudflare Pages
- Deploy Cloudflare Worker
- End-to-end testing
- Mobile device testing
- Fix bugs and optimize

### Phase 5: Content Population
- Add couple's photos
- Write love story
- Fill in wedding details
- Add gift registry information

### Phase 6: Launch
- Final testing
- Share URL with guests
- Monitor submissions

---

## Content Checklist

### To Be Provided by Couple
- [ ] Wedding date and time
- [ ] Ceremony venue details
- [ ] Reception venue details (if different)
- [ ] Couple's photos (10-20 high-quality images)
- [ ] Love story text/milestones
- [ ] Gift registry links or preferences
- [ ] Dress code information
- [ ] Event schedule/timeline
- [ ] Special instructions for guests
- [ ] Contact information for questions

---

## Security & Privacy

### Data Protection
- HTTPS only (enforced by Cloudflare)
- Secure API key storage (Cloudflare secrets)
- Input sanitization to prevent XSS
- Rate limiting on form submissions
- Google Sheets sharing: Private, only accessible via Service Account

### GDPR Considerations (if applicable)
- Privacy policy if collecting personal data
- Consent checkbox if required by jurisdiction
- Data retention policy
- Right to deletion process

---

## Future Enhancements (Optional)
- Guest login system with unique codes
- Live wedding streaming link
- Photo upload functionality for guests
- Guestbook/message board
- Multi-language support
- Wedding hashtag integration with social media
- Post-wedding thank you page

---

## Support & Maintenance
- Monitor Google Sheets for responses
- Check for form errors or failed submissions
- Update wedding details as needed
- Keep site live for 3-6 months post-wedding

---

## Contact & Questions
For technical issues during development:
- Check Cloudflare Pages deployment logs
- Review Cloudflare Worker logs
- Test Google Sheets API connectivity

---

**Last Updated**: 2026-01-06
**Version**: 1.0
