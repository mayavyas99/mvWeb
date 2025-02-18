document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    const loadingOverlay = document.querySelector('.loading-overlay');

    if (hero) {
        const images = [
            '/Users/kasevyas/Documents/Personal/MayaWeb/Maya Images/cars.jpg',
            '/Users/kasevyas/Documents/Personal/MayaWeb/Maya Images/legallybrown.jpg',
            '/Users/kasevyas/Documents/Personal/MayaWeb/Maya Images/leverageredemption.jpg',
            '/Users/kasevyas/Documents/Personal/MayaWeb/Maya Images/nosmalltalk.jpg',
            '/Users/kasevyas/Documents/Personal/MayaWeb/Maya Images/walker.jpg'
        ];

        const randomImage = images[Math.floor(Math.random() * images.length)];

        function hideLoadingOverlay() {
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 300);
            }
        }

        const img = new Image();

        img.onload = function() {
            hero.style.backgroundImage = `url(${randomImage})`;
            hero.style.backgroundSize = 'cover';
            hero.style.backgroundPosition = 'center';
            hideLoadingOverlay();
        };

        img.onerror = function() {
            console.error('Failed to load background image:', randomImage);
            hideLoadingOverlay();
        };

        img.src = randomImage;

        // Fallback to hide loading overlay if image takes too long
        setTimeout(hideLoadingOverlay, 3000);
    } else {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
});
