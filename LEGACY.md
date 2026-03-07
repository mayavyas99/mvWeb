# Legacy / unreferenced files

These files are not linked from any current page. They are safe to remove or refactor.

## Root

| File | Reason |
|------|--------|
| `styles.css` | Replaced by Tailwind CSS on all main pages. Contains custom nav, hero, carousel, and loading overlay styles that no longer apply. |
| `script.js` | Written for an old hero that used a random background image and loading overlay. No page references it; it also uses absolute local paths that will not work in deployment. |

## Helpers/

| File | Reason |
|------|--------|
| `Helpers/helper.js` | Defines `getElementsByTitlePattern()` for image maps. Not included by any HTML. |
| `Helpers/gsapAnimations.js` | GSAP-based glow effects for image-map areas (orbs/spirals). No page includes GSAP or this script; it also uses an invalid `getElementById()` with a file path and would need to be rewired to work. |

## Optional cleanup

- To **remove**: Delete the files above and this LEGACY.md.
- To **refactor**: Rewire `script.js` to use relative asset paths and a hero element if you restore the old home design; fix `gsapAnimations.js` to use a valid element selector and include GSAP on the page that uses it.
