// LEGACY: Unreferenced. Not included by any HTML. See LEGACY.md. Safe to remove or refactor.
// Function to get elements by matching part of the title attribute
function getElementsByTitlePattern(pattern) {
    return Array.from(document.querySelectorAll('area')).filter(area =>
        area.getAttribute('title').toLowerCase().includes(pattern.toLowerCase())
    );
}
