(function () {

    /* ── Mobile menu ── */
    var hamburger  = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    var closeBtn   = document.getElementById('mobile-menu-close');

    function openMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileMenu.classList.contains('is-open') ? closeMenu() : openMenu();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (mobileMenu) {
        mobileMenu.querySelectorAll('.mobile-menu__link').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });
    }

    /* ── Counter animation ──
       Counts up from 0 to target when element scrolls into view.
       Supports: plain numbers, decimals, $ prefix, % suffix, ★ suffix, comma formatting
    ── */
    function animateCounter(el, target, duration, prefix, suffix, decimals) {
        var start     = 0;
        var startTime = null;

        function easeOut(t) {
            return 1 - Math.pow(1 - t, 3); // cubic ease-out — fast start, slow stop
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed  = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var current  = easeOut(progress) * target;

            // Format with commas and optional decimals
            var formatted = decimals > 0
                ? current.toFixed(decimals)
                : Math.floor(current).toLocaleString('en-US');

            el.textContent = prefix + formatted + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Ensure exact final value
                var final = decimals > 0
                    ? target.toFixed(decimals)
                    : target.toLocaleString('en-US');
                el.textContent = prefix + final + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    // Counter config: selector → { target, duration ms, prefix, suffix, decimals }
    var counters = [
        { selector: '.metric-card:nth-child(1) strong', target: 86,            duration: 1800, prefix: '',  suffix: '%',  decimals: 0 },
        { selector: '.metric-card:nth-child(2) strong', target: 1102,          duration: 2000, prefix: '$', suffix: '',   decimals: 0 },
        { selector: '.metric-card:nth-child(3) strong', target: 4.7,           duration: 1600, prefix: '',  suffix: ' ★', decimals: 1 },
        { selector: '.assessment-total__number',        target: 12365478962,   duration: 2500, prefix: '$', suffix: '',   decimals: 0 }
    ];

    if ('IntersectionObserver' in window) {
        counters.forEach(function (config) {
            var el = document.querySelector(config.selector);
            if (!el) return;

            var triggered = false;

            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && !triggered) {
                        triggered = true;
                        animateCounter(el, config.target, config.duration, config.prefix, config.suffix, config.decimals);
                        obs.unobserve(el); // run once, then stop
                    }
                });
            }, { threshold: 0.4 });

            obs.observe(el);
        });
    }

    /* ── Testimonials carousel ── */
    var tTrack = document.querySelector('.testimonials-new__track');
    var tCards = tTrack ? Array.from(tTrack.querySelectorAll('.tcard')) : [];
    var tDots  = Array.from(document.querySelectorAll('.tdot'));
    var tPrev  = document.querySelector('.tcard-arrow--prev');
    var tNext  = document.querySelector('.tcard-arrow--next');
    var tIndex = 0;

    function getVisibleCount() {
        return window.innerWidth <= 560 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    }

    function showTestimonial(index) {
        var visible = getVisibleCount();
        var max     = tCards.length - visible;
        tIndex      = Math.max(0, Math.min(index, max));

        tCards.forEach(function (card, i) {
            card.style.display = (i >= tIndex && i < tIndex + visible) ? 'flex' : 'none';
        });

        tDots.forEach(function (dot, i) {
            dot.classList.toggle('tdot--active', i === tIndex);
        });
    }

    if (tCards.length) {
        showTestimonial(0);
        if (tNext) tNext.addEventListener('click', function () { showTestimonial(tIndex + 1); });
        if (tPrev) tPrev.addEventListener('click', function () { showTestimonial(tIndex - 1); });
        tDots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { showTestimonial(i); });
        });
        window.addEventListener('resize', function () { showTestimonial(tIndex); });
    }

    /* ── Team carousel ── */
    var teamGrid  = document.querySelector('.team-grid');
    var teamCards = teamGrid ? Array.from(teamGrid.querySelectorAll('.team-card')) : [];
    var teamPrev  = document.querySelector('.team-arrow--prev');
    var teamNext  = document.querySelector('.team-arrow--next');
    var teamIndex = 0;

    function getTeamVisible() {
        return window.innerWidth <= 480 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    }

    function showTeam(index) {
        var visible = getTeamVisible();
        var max     = teamCards.length - visible;
        teamIndex   = Math.max(0, Math.min(index, max));

        teamCards.forEach(function (card, i) {
            card.style.display = (i >= teamIndex && i < teamIndex + visible) ? 'block' : 'none';
        });
    }

    if (teamCards.length) {
        showTeam(0);
        if (teamNext) teamNext.addEventListener('click', function () { showTeam(teamIndex + 1); });
        if (teamPrev) teamPrev.addEventListener('click', function () { showTeam(teamIndex - 1); });
        window.addEventListener('resize', function () { showTeam(teamIndex); });
    }

    /* ── Scroll animation observer ── */
    var animElements = document.querySelectorAll(
        '.service-card, .feature-card, .testimonial-card, .step-item, .faq-item'
    );
    if (animElements.length && 'IntersectionObserver' in window) {
        var obs2 = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) entry.target.classList.add('animate-in');
            });
        }, { threshold: 0.1 });
        animElements.forEach(function (el) { obs2.observe(el); });
    }

})();
