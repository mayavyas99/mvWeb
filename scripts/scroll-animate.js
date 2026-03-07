/**
 * Lightweight scroll-triggered animations: fade-in / slide-up for sections.
 * Use data-animate="fade-up" or data-animate="fade-in" on elements.
 */
(function () {
    const animated = document.querySelectorAll('[data-animate]');
    if (!animated.length) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const kind = (el.getAttribute('data-animate') || 'fade-up').toLowerCase();
                el.classList.add('animate-done');
                if (kind === 'fade-up') {
                    el.classList.add('opacity-100', 'translate-y-0');
                } else {
                    el.classList.add('opacity-100');
                }
            });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0.1 }
    );

    animated.forEach(function (el) {
        const kind = (el.getAttribute('data-animate') || 'fade-up').toLowerCase();
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.classList.add('opacity-0');
        if (kind === 'fade-up') {
            el.classList.add('translate-y-8');
        }
        observer.observe(el);
    });
})();
