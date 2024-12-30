// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const mainImage = document.getElementById('/Users/kasevyas/Documents/Personal/MayaWeb/Maya Images/mayo-evil-lair.webp');

    // Ensure the image has loaded before doing any calculations
    mainImage.onload = function () {
        const originalWidth = mainImage.naturalWidth;
        const originalHeight = mainImage.naturalHeight;
        const rect = mainImage.getBoundingClientRect();
        const displayedWidth = rect.width;
        const displayedHeight = rect.height;

        // Scale factor based on the original and displayed sizes
        const scaleX = displayedWidth / originalWidth;
        const scaleY = displayedHeight / originalHeight;

        // Glowing Elements Configuration for Spirals and Orbs
        const glowingElements = {
            orbs: { elements: getElementsByTitlePattern('Orb'), color: '#00ff00' }, // Green
            spirals: { elements: getElementsByTitlePattern('Spiral'), color: '#ff00ff' } // Purple
        };

        // Apply glowing effects to elements based on their title
        Object.entries(glowingElements).forEach(([key, config]) => {
            config.elements.forEach(element => {
                // Extract coordinates for positioning
                const coords = element.getAttribute('coords').split(',').map(Number);
                const shape = element.getAttribute('shape');

                if (shape === 'circle' && coords.length === 3) {
                    let [left, top, radius] = coords;

                    // Scale the coordinates to match the displayed image size
                    left = left * scaleX;
                    top = top * scaleY;
                    radius = radius * ((scaleX + scaleY) / 2); // Average scaling factor for radius

                    // Create a glowing effect overlay (positioned absolutely on top of the map)
                    const glowOverlay = document.createElement('div');
                    glowOverlay.classList.add('glow-overlay');

                    // Set size and position based on the scaled coordinates
                    glowOverlay.style.left = `${left - radius}px`;
                    glowOverlay.style.top = `${top - radius}px`;
                    glowOverlay.style.width = `${radius * 2}px`;
                    glowOverlay.style.height = `${radius * 2}px`;

                    // Apply the initial glow style
                    glowOverlay.style.boxShadow = `0 0 40px ${config.color}`;
                    glowOverlay.style.background = `${config.color}33`; // Semi-transparent background

                    document.body.appendChild(glowOverlay);

                    // GSAP pulsing glow animation with stronger effects
                    gsap.to(glowOverlay, {
                        boxShadow: `0 0 100px 50px ${config.color}`, // Very intense glow
                        opacity: 0.4, // Higher opacity shift for more noticeable effect
                        scale: 1.5,  // Larger scaling to make the pulsing bigger
                        duration: 1.5,
                        repeat: -1,
                        yoyo: true,
                        ease: "power3.inOut"  // Smooth easing for noticeable pulse
                    });
                }
            });
        });
    };
});

// Function to get elements by matching part of the title attribute
function getElementsByTitlePattern(pattern) {
    return Array.from(document.querySelectorAll('area')).filter(area =>
        area.getAttribute('title').toLowerCase().includes(pattern.toLowerCase())
    );
}
