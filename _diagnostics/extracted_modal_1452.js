# Walkthrough: Restored Master aEYE Organism on Home Base Canvas

We have aligned the home base canvas renderer with the canonical preloader eye engine:

---

## 1. Canonical aEYE Engine Alignment
- **Eliminated Artificial Dark Fill**: Removed the solid dark purple circle (`sphereGrad`) that was covering the halo and obscuring the eye.
- **Pure Almond Aperture Shaders**:
  - **Solfeggio Pulse Halo**: Multi-band cyan, violet, and gold ring.
  - **12 Orbiting Stardust Sparkles**: 360-degree celestial orbit with brand tokens.
  - **Volumetric 3D Sclera**: Pearlescent orbital gradient.
  - **Photorealistic Purple Iris Orb**: Rendered from `images/photorealistic_purple_iris_orb.png` with feathered limbal ring and 3D cornea reflection.
  - **Photorealistic Skin Eyelids & Curved Lashes**: Smooth 220ms biological blinks, wet waterline, natural crease, and 28 upper / 14 lower curved lashes.
- **Calibrated Scale (`eyeRadius = 46px`)**: The eye and orbiting stardust sparkles fit within the 152×152px Retina canvas with zero edge clipping.

---

## 2. Interactive Gaze Tracking & Clickability
- **Full Viewport Gaze Tracking**: The iris smoothly and fluidly tracks the user's cursor across the entire screen (`targetGazeX = ±20px`, `targetGazeY = ±16px`).
- **Instant Click Handlers**: Clicking anywhere on the button or canvas immediately opens `#assistant-modal` and triggers the dual flight race of Beth and the living aEYE to the header portal.
