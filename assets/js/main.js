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
       Odometer-style: numbers tick up with a strong ease-out curve.
       Fast at the start, dramatically slows down as it locks onto the final value.
       Each frame only increments by a small step so individual digits visibly roll.
    ── */
    function animateCounter(el, target, duration, prefix, suffix, decimals) {

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function formatNum(val, dec) {
            if (dec > 0) return parseFloat(val).toFixed(dec);
            return Math.floor(val).toLocaleString('en-US');
        }

        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed  = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased    = easeOutCubic(progress);
            var current  = eased * target;

            el.textContent = prefix + formatNum(current, decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = prefix + formatNum(target, decimals) + suffix;
            }
        }

        /* Brief pause then fire — gives the user a moment to notice before it starts */
        setTimeout(function () {
            el.textContent = prefix + formatNum(0, decimals) + suffix;
            requestAnimationFrame(step);
        }, 200);
    }

    var counters = [
        { selector: '.metric-card:nth-child(1) strong', target: 86,          duration: 6200, prefix: '',  suffix: '%',  decimals: 0 },
        { selector: '.metric-card:nth-child(2) strong', target: 1102,        duration: 8200, prefix: '$', suffix: '',   decimals: 0 },
        { selector: '.metric-card:nth-child(3) strong', target: 4.7,         duration: 6200, prefix: '',  suffix: ' ★', decimals: 1 },
        { selector: '.assessment-total__number',        target: 12365478962, duration: 12500, prefix: '$', suffix: '',   decimals: 0 }
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
            }, { threshold: 0.4 });
            obs.observe(el);
        });
    }

    /* ── Testimonials carousel ── */
    var tWrapper  = document.querySelector('.testimonials-new__track-wrapper');
    var tTrack    = document.querySelector('.testimonials-new__track');
    var tDotsWrap = document.querySelector('.testimonials-new__dots');
    var tCards    = tTrack ? Array.from(tTrack.querySelectorAll('.tcard')) : [];
    var tPrev     = document.querySelector('.tcard-arrow--prev');
    var tNext     = document.querySelector('.tcard-arrow--next');
    var tIndex    = 0;
    var tDots     = [];
    var GAP       = 20; // must match CSS gap

    function getVisibleCount() {
        return window.innerWidth <= 560 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    }

    function buildDots() {
        if (!tDotsWrap) return;
        var visible = getVisibleCount();
        var count   = tCards.length - visible + 1;
        tDotsWrap.innerHTML = '';
        tDots = [];
        for (var i = 0; i < count; i++) {
            var dot = document.createElement('span');
            dot.className = 'tdot' + (i === tIndex ? ' tdot--active' : '');
            dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            (function(idx) {
                dot.addEventListener('click', function () { showTestimonial(idx); });
            })(i);
            tDotsWrap.appendChild(dot);
            tDots.push(dot);
        }
    }

    function setCardWidths() {
        if (!tWrapper || !tCards.length) return;
        var visible   = getVisibleCount();
        var totalGap  = GAP * (visible - 1);
        var cardWidth = (tWrapper.offsetWidth - totalGap) / visible;
        tCards.forEach(function (card) {
            card.style.width = cardWidth + 'px';
        });
    }

    function showTestimonial(index) {
        if (!tTrack || !tCards.length) return;
        var visible = getVisibleCount();
        var max     = tCards.length - visible;
        tIndex      = Math.max(0, Math.min(index, max));

        var cardWidth   = tCards[0].offsetWidth;
        var slideAmount = tIndex * (cardWidth + GAP);
        tTrack.style.transform = 'translateX(-' + slideAmount + 'px)';

        tDots.forEach(function (dot, i) {
            dot.classList.toggle('tdot--active', i === tIndex);
        });

        // Update arrow opacity
        if (tPrev) tPrev.style.opacity = tIndex === 0 ? '0.45' : '1';
        if (tNext) tNext.style.opacity = tIndex >= max ? '0.45' : '1';
    }

    if (tCards.length) {
        requestAnimationFrame(function () {
            setCardWidths();
            buildDots();
            showTestimonial(0);
        });
        if (tNext) tNext.addEventListener('click', function () { showTestimonial(tIndex + 1); });
        if (tPrev) tPrev.addEventListener('click', function () { showTestimonial(tIndex - 1); });
        window.addEventListener('resize', function () {
            setCardWidths();
            buildDots();
            showTestimonial(tIndex);
        });
    }

    /* ── Team carousel ── */
    var teamWrapper = document.querySelector('.team-track-wrapper');
    var teamGrid    = document.querySelector('.team-grid');
    var teamCards   = teamGrid ? Array.from(teamGrid.querySelectorAll('.team-card')) : [];
    var teamPrev    = document.querySelector('.team-arrow--prev');
    var teamNext    = document.querySelector('.team-arrow--next');
    var teamIndex   = 0;
    var TEAM_GAP    = 14; // must match CSS gap

    function getTeamVisible() {
        return window.innerWidth <= 480 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    }

    function setTeamCardWidths() {
        if (!teamWrapper || !teamCards.length) return;
        var visible   = getTeamVisible();
        var totalGap  = TEAM_GAP * (visible - 1);
        var cardWidth = (teamWrapper.offsetWidth - totalGap) / visible;
        teamCards.forEach(function (card) {
            card.style.width = cardWidth + 'px';
        });
    }

    function showTeam(index) {
        if (!teamGrid || !teamCards.length) return;
        var visible  = getTeamVisible();
        var max      = teamCards.length - visible;
        teamIndex    = Math.max(0, Math.min(index, max));

        var cardWidth   = teamCards[0].offsetWidth;
        var slideAmount = teamIndex * (cardWidth + TEAM_GAP);
        teamGrid.style.transform = 'translateX(-' + slideAmount + 'px)';

        // Update arrow opacity
        if (teamPrev) teamPrev.style.opacity = teamIndex === 0 ? '0.45' : '1';
        if (teamNext) teamNext.style.opacity = teamIndex >= max ? '0.45' : '1';
    }

    if (teamCards.length) {
        requestAnimationFrame(function () {
            setTeamCardWidths();
            showTeam(0);
        });
        if (teamNext) teamNext.addEventListener('click', function () { showTeam(teamIndex + 1); });
        if (teamPrev) teamPrev.addEventListener('click', function () { showTeam(teamIndex - 1); });
        window.addEventListener('resize', function () {
            setTeamCardWidths();
            showTeam(teamIndex);
        });
    }

    /* ── FAQ accordion ── */
    var faqItems = Array.from(document.querySelectorAll('.faq-item'));

    faqItems.forEach(function (item) {
        var btn    = item.querySelector('.faq-banner__item');
        var answer = item.querySelector('.faq-answer');
        if (!btn || !answer) return;

        btn.addEventListener('click', function () {
            var isOpen = item.classList.contains('is-open');

            // Close all others
            faqItems.forEach(function (other) {
                other.classList.remove('is-open');
                var otherBtn = other.querySelector('.faq-banner__item');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked item
            if (!isOpen) {
                item.classList.add('is-open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

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
