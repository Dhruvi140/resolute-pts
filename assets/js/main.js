(function () {

    /* ── Mobile menu ── */
    var hamburger   = document.getElementById('hamburger');
    var mobileMenu  = document.getElementById('mobile-menu');
    var closeBtn    = document.getElementById('mobile-menu-close');

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

    /* ── Testimonials carousel ── */
    var tTrack   = document.querySelector('.testimonials-new__track');
    var tCards   = tTrack ? Array.from(tTrack.querySelectorAll('.tcard')) : [];
    var tDots    = Array.from(document.querySelectorAll('.tdot'));
    var tPrev    = document.querySelector('.tcard-arrow--prev');
    var tNext    = document.querySelector('.tcard-arrow--next');
    var tIndex   = 0;
    var tVisible = 3;

    function getVisibleCount() {
        return window.innerWidth <= 560 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    }

    function showTestimonial(index) {
        tVisible = getVisibleCount();
        var max = tCards.length - tVisible;
        tIndex  = Math.max(0, Math.min(index, max));

        tCards.forEach(function (card, i) {
            card.style.display = (i >= tIndex && i < tIndex + tVisible) ? 'flex' : 'none';
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
    var teamVisible = 3;

    function getTeamVisible() {
        return window.innerWidth <= 480 ? 1 : window.innerWidth <= 860 ? 2 : 3;
    }

    function showTeam(index) {
        teamVisible = getTeamVisible();
        var max = teamCards.length - teamVisible;
        teamIndex = Math.max(0, Math.min(index, max));

        teamCards.forEach(function (card, i) {
            card.style.display = (i >= teamIndex && i < teamIndex + teamVisible) ? 'block' : 'none';
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
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) entry.target.classList.add('animate-in');
            });
        }, { threshold: 0.1 });
        animElements.forEach(function (el) { observer.observe(el); });
    }

})();
