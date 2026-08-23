# Walkthrough: Verified Z-Index Stacking, Hero Location Switcher, & Cache Busting

We have updated the CSS z-index stacking order and activated the interactive Celestial Location selector in the hero section:

---

## 1. Verified Z-Index Stacking Hierarchy
- `50000000`: `.preloader` (Guaranteed to sit on top of all canvas layers during initial load, cleanly dissolving on fade-out)
- `45000000`: `.location-modal-backdrop` (Pop-up location switcher modal dialog)
- `40000000`: `.beth-greeting` (Speech bubbles above avatar and UI elements)
- `35000000`: `#hero-avatar-canvas` (Canvas 2: Foreground 60fps avatar & flying aEYE)
- `32000000`: `#sacred-assistant-widget` (Corner home base dais button & canvas)
- `30000000`: `.assistant-modal-overlay` (Pop-up assistant menu & header portal)
- `24000000`: `.back-to-top-btn` (Floating scroll-up arrow)
- `10000`: `.nav` (Main navigation header)
- `3`: `.hero__content` (Hero logo, tagline pill, CTA buttons, credentials, and location badge)
- `1`: `#hero-celestial-canvas` (Canvas 1: Background tree portal, sky moon, butterflies, meteors)
- `0`: `.hero__bg` (Hero glade background image)

---

## 2. Interactive Celestial Location Selector
- **Activated Badge**: Removed the `display: none` constraint on `.hero__loc-badge-wrap`. The celestial location badge is now visible directly below the credentials in the hero section.
- **Default Energy Node**: **Chapel in the Clouds, Costa Rica** (`10.00°N, 83.85°W`).
- **Interactive Modal**: Clicking the badge opens the high-vibe pop-up modal (`z-index: 45,000,000`), allowing users to choose between *Sedona*, *Glastonbury*, *Mt. Shasta*, *Maui*, and *Live GPS*.
- Selecting a new node dynamically recalculates the live astronomical sky moon position and hemisphere tilt with an attunement chime.

---

## 3. Cache-Buster Versioning
- Updated script and stylesheet queries in `index.html` to `v=38.0` (`js/main.js?v=38.0` and `css/style.css?v=38.0`) to ensure all browsers immediately load the freshest code without stale cache artifacts.
