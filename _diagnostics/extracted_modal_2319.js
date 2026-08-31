# Walkthrough: Living aEYE & Avatar Beth Synchronized Menu Race & Return Dive

We have implemented the synchronized companion flight and racing choreography for the **aEYE Sacred Assistant Menu**:

---

## 1. Removed Static Eyeball from Menu Header
- **Removed Static Asset**: Removed `<img src="images/photorealistic_purple_iris_orb.webp">` from the top of the modal window.
- **Dynamic Landing Dais**: Transformed `.assistant-modal-icon-orb` into a sacred circular dais that serves as the target landing portal for the **living animated aEYE**.

---

## 2. Synchronized Takeoff & Race to the Menu
When the user clicks the floating assistant trigger:
1. **Simultaneous Launch**:
   - **Avatar Beth**: Takes off from the home base corner and flies in an arched trajectory towards the **top-right corner of the menu card**.
   - **The Living aEYE**: Takes off from the home base corner and races alongside Beth in a separate high-speed arc towards the **top-center dais** of the menu.
2. **Companion Particle Trails**: Both entities leave ribbon glitter and stardust trails as they cross the screen.
3. **Menu Perched State**:
   - **Avatar Beth**: Perches at the top-right corner, flutters her wings, sways, and displays her greeting bubble: `"✦ How may we help you? ✦"`.
   - **The Living aEYE**: Hovers inside the top-center dais, looking around with natural gaze tracking, biological blinking, and 12 orbiting stardust sparkles.

---

## 3. Return Flight & Dive Sequence on Menu Close
When the menu is closed (via button, backdrop click, Escape key, or navigation link):
1. **aEYE Returns to Home Base**: The living aEYE swiftly races back down to the bottom-right home base corner (~0.65s).
2. **Beth's Acrobatic Dive**: Avatar Beth follows in a graceful sweeping arc (~0.85s), arriving just as the aEYE settles into the home base dais.
3. **Explosive Dive & Splash**: Beth dives directly into the center of the living aEYE with an explosive **60-particle stardust splash burst** and expanding shockwaves.
4. **Seamless Transition**: Once Beth disappears inside, the home base corner widget resumes its normal idle state.

---

## Verification
- **JS Syntax**: Validated with `node -c js/main.js` (0 errors).
- **Smooth 60fps Animation**: Responsive coordinates tracked live during window resize and scroll events.
