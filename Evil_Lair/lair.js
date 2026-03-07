/**
 * Maya's Lair — entrance animation and behavior.
 * Fades in the CTA overlay after a short delay so the video is seen first.
 */
(function () {
    const ctas = document.getElementById('lair-ctas');
    if (!ctas) return;

    function showCtas() {
        ctas.classList.remove('opacity-0');
        ctas.classList.add('opacity-100');
    }

    // Show CTAs after 1s so the lair video is visible first
    window.addEventListener('load', function () {
        setTimeout(showCtas, 1000);
    });
})();
