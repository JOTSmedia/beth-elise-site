# Walkthrough: Restored Avatar Sequence & Layer Stack

We have directly eliminated all state blockers and refined the CSS layer stacking:

---

## 1. Direct State Initialization
- `heroTinkerbell.state` is now initialized directly to `'SPAWNING'`, completely eliminating any dependency on event listeners, timeout races, or callback timing.
- **Polaris (True North Star)** renders continuously from frame 1 at the top of the glade.
- The moment the preloader begins its smooth fade-out, the **Glinda Starlight Bubble Orb** begins its iridescent descent carrying Avatar Beth down from Polaris across the glade.

---

## 2. Updated Layer Hierarchy (`z-index`)
- `50000000`: `.preloader` (Guaranteed to sit on top of all canvas layers during initial load, cleanly dissolving on fade-out)
- `40000000`: `.beth-greeting` (Speech bubbles above avatar and UI elements)
- `35000000`: `#hero-avatar-canvas` (Canvas 2: Foreground 60fps avatar & flying aEYE)
- `32000000`: `#sacred-assistant-widget` (Corner home base dais button & canvas)
- `30000000`: `.assistant-modal-overlay` (Pop-up assistant menu & header portal)
- `24000000`: `.back-to-top-btn` (Floating scroll-up arrow)
- `1 – 1000`: DOM sections, `#hero-celestial-canvas` (Canvas 1: Background tree portal, sky moon, butterflies, meteors)

---

## 3. Full Story Arc Runs Automatically on Load
1. **Polaris (True North Star)** radiates celestial starlight at the top of the glade.
2. **Glinda Starlight Bubble Orb** descends from Polaris carrying Avatar Beth down across the glade.
3. **Crescent Moon Landing**: Beth steps out, and the empty bubble returns to Polaris; Beth stands atop the crescent moon with *"Hi, I'm Beth Elise!"* and the fairy-yellow glitter stardust glow.
4. **Tagline Catwalk & Vanna White Reveal**: Runway strut across the tagline pill, flipping the 3D Jeopardy letter tiles, and striking the Vanna White reveal pose.
5. **Olympic Somersault Dive**: Flips down to the corner perch with greeting 2.
6. **High Leap Plunge**: Dives headfirst into home base, triggering the shockwave splash, 963Hz chime, and activating the live interactive aEYE assistant.
