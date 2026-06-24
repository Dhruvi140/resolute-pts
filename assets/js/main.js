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
       Uses requestAnimationFrame with a fast-scramble then settle effect.
       Numbers spin through random digits before landing on the real value.
    ── */
    function animateCounter(el, target, duration, prefix, suffix, decimals) {
        var startTime  = null;
        var scrambleMs = duration * 0.6;   // first 60% of time: scramble
        var settleMs   = duration * 0.4;   // last 40%: count up smoothly

        function randomInt(max) {
            return Math.floor(Math.random() * max);
        }

        function formatNum(val, dec) {
            return dec > 0
                ? parseFloat(val).toFixed(dec)
                : Math.floor(val).toLocaleString('en-US');
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;

            if (elapsed < scrambleMs) {
                // Scramble phase: show random numbers
                var scrambled = randomInt(Math.ceil(target));
                el.textContent = prefix + formatNum(scrambled, decimals) + suffix;
                el.style.opacity = '0.7';
                requestAnimationFrame(step);

            } else if (elapsed < duration) {
                // Settle phase: ease-out count up to target
                var progress = (elapsed - scrambleMs) / settleMs;
                var eased    = 1 - Math.pow(1 - progress, 2); // ease-out quad
                var current  = eased * target;
                el.textContent = prefix + formatNum(current, decimals) + suffix;
                el.style.opacity = '0.7' + String(0.3 * progress).slice(1); // fade to 1
                requestAnimationFrame(step);

            } else {
                // Final — lock to exact value
                el.textContent = prefix + formatNum(target, decimals) + suffix;
                el.style.opacity = '1';
            }
        }

        el.style.opacity = '0.5';
        requestAnimationFrame(step);
    }

    var counters = [
        { selector: '.metric-card:nth-child(1) strong', target: 86,          duration: 2000, prefix: '',  suffix: '%',  decimals: 0 },
        { selector: '.metric-card:nth-child(2) strong', target: 1102,        duration: 2200, prefix: '$', suffix: '',   decimals: 0 },
        { selector: '.metric-card:nth-child(3) strong', target: 4.7,         duration: 1800, prefix: '',  suffix: ' ★', decimals: 1 },
        { selector: '.assessment-total__number',        target: 12365478962, duration: 2800, prefix: '$', suffix: '',   decimals: 0 }
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
                        obs.unobserve(el);
                        animateCounter(el, config.target, config.duration, config.prefix, config.suffix, config.decimals);
                    }
                });
            }, { threshold: 0.5 });
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
