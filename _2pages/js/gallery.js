// Gallery Lightbox Functionality

class GalleryLightbox {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.lightbox = null;
        this.currentIndex = 0;
        this.images = [];

        this.init();
    }

    init() {
        // Create lightbox element
        this.createLightbox();

        // Add click listeners to gallery items
        this.galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openLightbox(index);
            });

            // Store image data (for when real images are added)
            this.images.push({
                element: item,
                placeholder: item.querySelector('.gallery-placeholder')
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox && this.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.prevImage();
                if (e.key === 'ArrowRight') this.nextImage();
            }
        });
    }

    createLightbox() {
        // Create lightbox HTML
        const lightboxHTML = `
            <div class="lightbox" id="galleryLightbox">
                <div class="lightbox-overlay"></div>
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close lightbox">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <button class="lightbox-prev" aria-label="Previous image">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button class="lightbox-next" aria-label="Next image">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                    <div class="lightbox-image-container">
                        <div class="lightbox-image"></div>
                    </div>
                    <div class="lightbox-counter">
                        <span class="current">1</span> / <span class="total">${this.images.length}</span>
                    </div>
                </div>
            </div>
        `;

        // Add to document
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);

        // Get lightbox reference
        this.lightbox = document.getElementById('galleryLightbox');

        // Add event listeners
        this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
        this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.prevImage());
        this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.nextImage());
        this.lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => this.closeLightbox());

        // Add lightbox styles
        this.addLightboxStyles();
    }

    addLightboxStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lightbox {
                position: fixed;
                inset: 0;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .lightbox.active {
                opacity: 1;
                pointer-events: all;
            }

            .lightbox-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
            }

            .lightbox-content {
                position: relative;
                width: 90%;
                max-width: 1200px;
                height: 90vh;
                z-index: 10001;
            }

            .lightbox-image-container {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 60px 100px;
            }

            .lightbox-image {
                max-width: 100%;
                max-height: 100%;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                background: linear-gradient(135deg, #D4A5A5 0%, #A4B494 100%);
                aspect-ratio: 3/4;
                width: 500px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Mrs Saint Delafield', cursive;
                font-size: 2rem;
                color: white;
            }

            .lightbox-image::after {
                content: 'Gallery Image';
            }

            .lightbox-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
                z-index: 10002;
            }

            .lightbox-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }

            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                width: 60px;
                height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
                z-index: 10002;
            }

            .lightbox-prev {
                left: 20px;
            }

            .lightbox-next {
                right: 20px;
            }

            .lightbox-prev:hover,
            .lightbox-next:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-50%) scale(1.1);
            }

            .lightbox-counter {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 1.1rem;
                background: rgba(0, 0, 0, 0.5);
                padding: 10px 25px;
                border-radius: 25px;
                backdrop-filter: blur(10px);
            }

            @media (max-width: 768px) {
                .lightbox-image-container {
                    padding: 60px 20px;
                }

                .lightbox-prev {
                    left: 10px;
                }

                .lightbox-next {
                    right: 10px;
                }

                .lightbox-prev,
                .lightbox-next {
                    width: 50px;
                    height: 50px;
                }

                .lightbox-image {
                    width: 300px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    openLightbox(index) {
        this.currentIndex = index;
        this.updateLightboxImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateLightboxImage() {
        const imageContainer = this.lightbox.querySelector('.lightbox-image');
        const counter = this.lightbox.querySelector('.lightbox-counter .current');

        // Update counter
        counter.textContent = this.currentIndex + 1;

        // Note: When you add real images, replace this with:
        // const imgSrc = this.images[this.currentIndex].element.querySelector('img')?.src;
        // imageContainer.style.backgroundImage = `url(${imgSrc})`;

        // Add animation
        imageContainer.style.opacity = '0';
        imageContainer.style.transform = 'scale(0.9)';

        setTimeout(() => {
            imageContainer.style.opacity = '1';
            imageContainer.style.transform = 'scale(1)';
        }, 50);
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.gallery-grid')) {
        new GalleryLightbox();
    }
});

// Lazy loading for images (when real images are added)
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
});
