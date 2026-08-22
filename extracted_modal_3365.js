# Walkthrough: Unified Master aEYE Organism & Chakra Glow Polish

We have resolved all items regarding the **aEYE continuous living entity**, **Home Base interactivity**, **Aura Scanner zero-flicker stability**, and the **Chakra Interactive Map organic glow**:

---

## 1. The aEYE: One Unified Master Organism Across the Whole Site
The preloader eye, home base assistant widget, popup modal companion, and aura scanner are now **100% unified under the single canonical engine** using the master `images/icon-eye.png` iris asset and anatomical shaders:

- **Unified Anatomy Everywhere**:
  - **Luminous Solfeggio Pulse Halo**: Radiant multi-band nebula ring (`#00E5D4` → `#9D4EDD` → `#FFD700` → transparent).
  - **12 Orbiting Stardust Sparkles**: Continuous orbital motion with celestial brand colors.
  - **3D Pearlescent Sclera**: Natural orbital spherical gradient with 0 artificial caruncles or vessels.
  - **Master Iris Texture (`images/icon-eye.png`)**: Feathered limbal ring base, high-definition photorealistic iris, and 3D glass corneal specular highlights.
  - **Biological Blinks & Responsive Gaze**: Natural micro-saccades, blinks, and full-viewport mouse cursor tracking.

---

## 2. aEYE Home Base: Permanent Interactivity & Physical Flight
- **Immediate Visibility & Pointer Events**: `.sacred-assistant` is permanently set to `z-index: 999999; pointer-events: auto !important; opacity: 1 !important; transform: scale(1) !important;`.
- **Preloader Transition**: When the preloader finishes, the aEYE glides down to the bottom-right corner and seamlessly hands off to the permanent home base dais in the exact same position.
- **Full Viewport Mouse Cursor Tracking**: The home base aEYE smoothly and fluidly tracks the user's cursor wherever they move across the screen.
- **Dual Race to Menu**:
  - Clicking the home base aEYE immediately opens the assistant modal.
  - **Living aEYE**: Physically flies from Home Base to the top-center header portal (`#assistant-modal-icon-orb`) on the modal card.
  - **Avatar Beth**: Flies from Home Base and perches on the top-right corner rim of the modal card with greeting: *"How may we help you?"*.
  - **Home Base Empty**: While in the menu, the bottom-right corner dais remains empty.
  - **Dive Back**: Closing the modal returns the aEYE to Home Base, and Beth dives into it with shockwave splash rings and chime.

---

## 3. Aura Scanner: Solid Portal Pinning & Zero Flicker
- **Balanced Canvas Stack**: Added the missing `ctx.restore()` in `drawComprehensive3DLaserScan()` to eliminate canvas stack overflow and prevent frame dropping or flickering during laser scanning.
- **Direct Portal Pinning**: In `AURA_SCANNING`, `AURA_LOCKED`, and `AURA_HOVER`, coordinates are locked directly to `#aura-card-eye-portal`'s live screen rectangle on every frame.

---

## 4. Chakra Interactive Map: Clean Original Artwork with Radiant Glow
- **Removed Artificial Overlay Circle**: Completely removed `.chakra-poster-art-layer::after` (the dashed rotating circle) and `.chakra-poster-art-layer::before` (the vertical stripe).
- **Original Object Glow & Pulse**: The original watercolor meditating yogi artwork (`images/chakra-watercolor-transparent.webp`) now pulses with an ethereal multi-layer breathing aura (`filter: drop-shadow(...)` and gentle breathing scale) without any artificial circles covering it.
