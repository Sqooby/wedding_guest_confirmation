# Image Assets

This folder contains all images for your wedding website.

## Folder Structure

```
images/
├── gallery/          # Gallery photos (15-20 photos)
├── story/           # Love story photos (4 photos)
└── hero-bg.jpg      # Hero section background (optional)
```

## Image Guidelines

### Gallery Photos (`gallery/`)

**Dimensions:**
- Portrait: 1200×1600px (3:4 ratio)
- Landscape: 1600×1200px (4:3 ratio)
- Square: 1200×1200px (1:1 ratio)

**Format:** JPG or WebP
**File size:** < 500KB each (use compression)
**Quantity:** 15-20 photos recommended

**Naming convention:**
```
gallery-01.jpg
gallery-02.jpg
gallery-03.jpg
...
```

### Story Photos (`story/`)

**Dimensions:** 800×1066px (3:4 ratio portrait)
**Format:** JPG or WebP
**File size:** < 300KB each
**Quantity:** 4 photos (one per story milestone)

**Naming convention:**
```
story-first-meeting.jpg
story-distance.jpg
story-adventures.jpg
story-proposal.jpg
```

## Image Optimization

### Before Uploading

1. **Resize** to recommended dimensions
2. **Compress** using one of these tools:
   - [TinyPNG](https://tinypng.com) - Web-based
   - [ImageOptim](https://imageoptim.com) - Mac app
   - [Squoosh](https://squoosh.app) - Web-based, advanced
   - `npm install -g sharp-cli` - Command line

3. **Convert to WebP** (optional, for better performance):
   ```bash
   # Using sharp-cli
   sharp -i gallery-01.jpg -o gallery-01.webp --webp
   ```

### Compression Examples

**Using TinyPNG (easiest):**
1. Visit tinypng.com
2. Drag and drop all photos
3. Download compressed versions
4. Replace originals

**Using ImageMagick (command line):**
```bash
# Install ImageMagick first
brew install imagemagick  # Mac
apt install imagemagick   # Ubuntu

# Compress and resize
mogrify -resize 1200x1600 -quality 85 gallery/*.jpg
```

## Adding Images to Website

### Gallery Images

Edit `_2pages/index.html`, find the gallery section and replace:

```html
<!-- OLD (placeholder) -->
<div class="gallery-item tall fade-in" data-delay="0">
    <div class="gallery-placeholder">
        <span>Photo 1</span>
    </div>
</div>

<!-- NEW (with your photo) -->
<div class="gallery-item tall fade-in" data-delay="0">
    <img src="images/gallery/gallery-01.jpg"
         alt="Sarah and Michael at the beach"
         loading="lazy">
</div>
```

### Story Images

Replace story placeholders:

```html
<!-- OLD -->
<div class="story-image-placeholder">
    <div class="image-frame"></div>
</div>

<!-- NEW -->
<div class="story-image-placeholder">
    <img src="images/story/story-first-meeting.jpg"
         alt="Our first meeting at the coffee shop"
         loading="lazy">
</div>
```

Then add CSS for story images in `styles.css`:

```css
.story-image-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}
```

## Performance Tips

1. **Use lazy loading** (already implemented):
   ```html
   <img src="..." loading="lazy">
   ```

2. **Provide WebP with fallback**:
   ```html
   <picture>
       <source srcset="images/gallery/photo-01.webp" type="image/webp">
       <img src="images/gallery/photo-01.jpg" alt="...">
   </picture>
   ```

3. **Use responsive images**:
   ```html
   <img srcset="photo-small.jpg 600w,
                photo-medium.jpg 1200w,
                photo-large.jpg 1800w"
        sizes="(max-width: 600px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
        src="photo-medium.jpg" alt="...">
   ```

## Image Checklist

Before going live, verify:

- [ ] All images compressed (< 500KB each)
- [ ] Appropriate alt text for accessibility
- [ ] Images display correctly on mobile
- [ ] Gallery images are high quality
- [ ] No personal/sensitive photos unintentionally included
- [ ] Images load quickly (test on slow connection)
- [ ] All placeholder divs replaced with actual images

## Copyright & Credits

Remember to:
- Only use photos you own or have permission to use
- Credit photographers if required
- Obtain model releases for photos with identifiable people
- Respect your guests' privacy preferences

## Backup

Keep backups of original, uncompressed photos:
- External hard drive
- Cloud storage (Google Drive, Dropbox)
- Multiple locations for important memories!

---

**Need more help?** See the main README.md or SETUP_GUIDE.md
