/**
 * APEX PERFORMANCE ARENA - ANIMATION ENGINE JAVASCRIPT (V2)
 * Features:
 * 1. Preloader & Telemetry Progression
 * 2. RE-TRIGGERING Bi-directional Scroll-Reveal (Animates Down and Up again & again)
 * 3. Rolling Number Odometer Counters with Reset & Replay
 * 4. Shutter Curtain Image Reveal (Re-triggerable)
 * 5. 3D Perspective Card Tilt
 * 6. Live Biometric Fluctuations
 */

(function () {
    'use strict';

    // ---------------------------------------------------------
    // 1. PRELOADER & TELEMETRY PROGRESSION
    // ---------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const preloaderFill = document.getElementById('preloaderFill');
    const loaderCounter = document.getElementById('loaderCounter');
    const loaderStatusMsg = document.getElementById('loaderStatusMsg');

    const statusMessages = [
        "CALIBRATING NEURAL METRICS...",
        "INITIALIZING ELEIKO SENSORS...",
        "SYNCHRONIZING TELEMETRY HUB...",
        "TUNING RECOVERY HYDROSUITES...",
        "ARENA CALIBRATION COMPLETE"
    ];

    let progress = 0;
    const progressInterval = setInterval(() => {
        const increment = Math.floor(Math.random() * 8) + 4;
        progress = Math.min(progress + increment, 100);

        if (preloaderFill) preloaderFill.style.width = progress + '%';
        if (loaderCounter) loaderCounter.textContent = (progress < 10 ? '0' : '') + progress + '%';

        if (loaderStatusMsg) {
            const msgIndex = Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1);
            loaderStatusMsg.textContent = statusMessages[msgIndex];
        }

        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                finishPreloader();
            }, 300);
        }
    }, 40);

    function finishPreloader() {
        if (!preloader) return;
        preloader.classList.add('loaded');
        document.body.classList.remove('loading-state');

        // Trigger hero grand stage curtain and text animations
        setTimeout(() => {
            const heroWrap = document.getElementById('heroPhotoWrap');
            if (heroWrap) heroWrap.classList.add('revealed');

            const heroContent = document.querySelector('.vision-hero-content-box');
            if (heroContent) heroContent.classList.add('revealed');

            // Trigger hero live counters
            animateHeroCounters();
        }, 300);

        // Remove from DOM after shutter wipe completes
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1200);
    }

    // ---------------------------------------------------------
    // 2. RE-TRIGGERING BIDIRECTIONAL SCROLL-REVEAL ENGINE
    // Animates elements when scrolling DOWN, and re-triggers when scrolling UP!
    // ---------------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When element enters viewport (scrolling down OR scrolling up)
                entry.target.classList.add('revealed');

                // Trigger counters inside
                const counters = entry.target.querySelectorAll('[data-counter]');
                counters.forEach(counter => triggerCounter(counter));

                // If element itself is curtain wrap
                if (entry.target.classList.contains('mask-reveal-wrap')) {
                    entry.target.classList.add('revealed');
                }
            } else {
                // When element leaves viewport: remove revealed class so that
                // scrolling in the reverse direction RE-TRIGGERS the animation!
                entry.target.classList.remove('revealed');

                // Reset counters so they count up fresh when visible again
                const counters = entry.target.querySelectorAll('[data-counter]');
                counters.forEach(counter => {
                    counter.dataset.animated = "";
                });
            }
        });
    }, observerOptions);

    document.addEventListener('DOMContentLoaded', () => {
        const revealItems = document.querySelectorAll('.reveal-item, .section-title, .mask-reveal-wrap, .facility-box');
        revealItems.forEach(el => scrollObserver.observe(el));
    });

    // ---------------------------------------------------------
    // 3. ROLLING NUMBER ODOMETER ANIMATION (REPLAYABLE)
    // ---------------------------------------------------------
    function triggerCounter(el) {
        if (el.dataset.animated === "true") return;
        el.dataset.animated = "true";

        const targetValue = parseFloat(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = targetValue % 1 !== 0;
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quart curve
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const currentNum = easeProgress * targetValue;

            if (isDecimal) {
                el.textContent = currentNum.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(currentNum).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                if (isDecimal) {
                    el.textContent = targetValue.toFixed(1) + suffix;
                } else {
                    el.textContent = Math.floor(targetValue).toLocaleString() + suffix;
                }
            }
        }

        requestAnimationFrame(updateCounter);
    }

    function animateHeroCounters() {
        const heroCounters = document.querySelectorAll('.hero-live-strip-wide [data-counter]');
        heroCounters.forEach(c => triggerCounter(c));
    }

    // ---------------------------------------------------------
    // 4. 3D CARD PERSPECTIVE TILT
    // ---------------------------------------------------------
    const tiltCards = document.querySelectorAll('.kpi-card, .trainer-card, .pricing-card, .facility-box');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ---------------------------------------------------------
    // 5. HEADER SCROLL DETECTION & BIOMETRIC FLUCTUATION
    // ---------------------------------------------------------
    const siteHeader = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
        if (!siteHeader) return;
        if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    }, { passive: true });

    // Subtle heart rate variation
    const liveBpm = document.getElementById('liveBpm');
    if (liveBpm) {
        setInterval(() => {
            const randomVariation = Math.floor(Math.random() * 7) - 3;
            let current = parseInt(liveBpm.textContent) || 164;
            let updated = Math.min(Math.max(current + randomVariation, 158), 172);
            liveBpm.textContent = updated;
        }, 2200);
    }

    // Floor capacity live fluctuations
    const floorCount = document.getElementById('liveFloorCount');
    if (floorCount) {
        setInterval(() => {
            const change = Math.floor(Math.random() * 3) - 1;
            let count = parseInt(floorCount.textContent) || 142;
            floorCount.textContent = count + change;
        }, 5000);
    }

})();
