// Countdown Timer
// Set your wedding date here (YYYY, MM-1, DD, HH, MM, SS)
// Note: Month is 0-indexed (0 = January, 11 = December)
const weddingDate = new Date(2026, 5, 15, 16, 0, 0); // June 15, 2026 at 4:00 PM

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate.getTime() - now;

    // Calculate time units
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

    // Check if countdown is finished
    if (distance < 0) {
        if (daysEl) daysEl.textContent = '000';
        if (hoursEl) hoursEl.textContent = '00';
        if (minutesEl) minutesEl.textContent = '00';
        if (secondsEl) secondsEl.textContent = '00';

        // Optional: Display a message when the wedding day arrives
        const countdownSection = document.querySelector('.countdown-section .section-header h2');
        if (countdownSection) {
            countdownSection.textContent = 'Today is the day!';
        }
    }
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Observe story items
    const storyItems = document.querySelectorAll('.story-item');
    storyItems.forEach(el => observer.observe(el));

    // Observe detail cards
    const detailCards = document.querySelectorAll('.detail-card');
    detailCards.forEach(el => observer.observe(el));

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(el => observer.observe(el));

    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(el => observer.observe(el));

    // Observe registry cards
    const registryCards = document.querySelectorAll('.registry-card');
    registryCards.forEach(el => observer.observe(el));
}

// Navigation scroll effect
function initNavScroll() {
    const nav = document.getElementById('mainNav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// Mobile navigation toggle
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }
}

// Smooth scroll with offset for fixed nav
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 80; // Offset for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavScroll();
    initMobileNav();
    initSmoothScroll();
});
