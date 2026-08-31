# Walkthrough: Restored Layer Stacking & Modal Companion Flight

We have resolved the layer occlusion and stacking bugs that were blocking visibility and interaction:

---

## 1. Resolved Z-Index Stacking Architecture
Previous conflicts had the modal overlay (`z-index: 100,000`) trapped behind the hero avatar canvas (`z-index: 1,000,000`), and pointer events on the assistant button intercepted by child decorations.

### Correct Layer Hierarchy:
| Layer | Element | Z-Index | Purpose |
|---|---|---|---|
| **Top** | `#hero-avatar-canvas` | `35000000` | Renders Beth & Living aEYE flying and perching on top of modal |
| **Interactive** | `#sacred-assistant-widget` | `32000000` | Home base assistant dais with canvas & speech bubble |
| **Overlay** | `.assistant-modal-overlay` | `30000000` | Quick actions assistant menu & header portal |
| **Preloader** | `#site-preloader` | `20000000` | Initial loading aEYE frequency tuner |
| **Page** | DOM sections & hero | `1 – 1000` | Body content, cards, and celestial background |

---

## 2. Guaranteed Interactive Click Handlers
- Isolated `.assistant-sparkle-dot` and `.assistant-pulse-ring` with `pointer-events: none !important;` so every click registers directly on the button and canvas.
- Bound global click dispatching across `#sacred-assistant-widget`, `#assistant-avatar-btn`, and `#assistant-avatar-canvas` to open `#assistant-modal` immediately.
- Calling `handleOpenAssistantMenu()` launches the synchronized dual flight race of Beth and the living aEYE to the modal header portal and top corner rim.
