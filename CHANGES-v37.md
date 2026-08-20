# bethElisePsychic_v37 — what changed

## 1. Loading eye — fixed, and now purple

**It wasn't animating because the script was broken.** The preloader's inline
`<script>` in `index.html` was missing its variable declarations and the opening of
`triggerRandomLook()` — the array of gaze angles started mid-air:

```js
var lidTop = document.getElementById('eyelid-top');
    { x: -7, y: -2 },   // <- no function, no `var angles = [`
```

That is a hard `SyntaxError: Unexpected token ':'`, so the **entire** block never ran:
no saccades, no blinks, and no preloader dismissal either (the page only still cleared
because `main.js` has its own fallback). Restored the missing state (`targetX/Y`,
`curX/Y`, `isBlinking`) and the function opening. Verified in-browser: the console is
clean, the iris eases between gaze targets, and the eyelids blink.

**Iris colour.** The preloader was already pointing at the same artwork as the aEYE
assistant (`photorealistic_purple_iris_orb.png`) — it just wasn't showing. Two things
were burying it:

- `.preloader__pupil` was an **opaque black disc** sitting on top. The artwork already
  contains its own galaxy pupil, which is exactly what aEYE displays, so the overlay is
  now transparent and only positions the specular glints.
- `.preloader__iris` carried `inset 0 0 6px rgba(0,0,0,.8)`, which crushed the violet to
  grey. Replaced with a thin limbal ring plus the existing outer glow, and the iris grew
  34px → 38px so more of it reads.

## 2. Avatar complexion — and what grading cannot do

Regraded to a fair Caucasian (Italian / German / Irish) complexion. Hair and outfit are
untouched, as asked.

The grade is a per-channel **gamma** curve rather than a flat lift, so shadows and midtones
rise hard while 255 stays fixed and the highlights on her cheekbones never clip to flat
white. Measured skin midtone:

| | midtone RGB | red/blue spread |
|---|---|---|
| source render | 149, 93, 79 | 70 (deep tan) |
| first attempt | 176, 138, 130 | 46 (still medium) |
| **now** | **199, 166, 151** | **48 (fair European)** |

Tunable at the top of `tools/build_avatar_layers.py` (`SKIN_GRADE`, `HAIR_GRADE`).

**The limitation, stated plainly.** This is a colour grade through a skin mask. It changes
skin *tone*, and nothing else. The facial **structure** — nose width, lip fullness, brow and
cheekbone shape — is baked into the source render and no amount of grading will change it.
If the likeness still reads wrong, that is why, and it is not fixable from this end.

To actually change the likeness, the character has to be re-rendered — same hair, same
dress, same pose, described as Italian/German/Irish — and dropped in at
`images/photorealistic_avatar_transparent.png`. Then:

```bash
python3 tools/build_avatar_layers.py
```

regenerates the body and both wing layers automatically. The pipeline is built around that
one source file, so a new render is a drop-in swap. I could not generate that image in this
session — no image generation was available to me here.

## 3. Wings now beat

`wingPhase` was being advanced every frame in every state and **then never used for
anything except an aura pulse** — the wings were painted into the single avatar PNG, so
they could not move.

`tools/build_avatar_layers.py` now lifts the wings onto their own layers
(`avatar_wing_left.png`, `avatar_wing_right.png`) and removes them from the body
(`avatar_body.png`). At runtime each wing rotates about its hinge and foreshortens
horizontally, which is what reads as a wing turning through air rather than rocking.
The original wing artwork is preserved — this is the real render, not a redraw.

The same pass also cleaned two artefacts baked into the source cutout: the grey
elliptical halo behind her, and the hard-edged ground shadow under her feet.

## 4. Size — back on the pill bar

Reverted to `AVATAR_SCALE = 0.12` (~53px) and back to walking along the top edge of
the "Intuitive Wisdom & Energy Healing" bar, exactly as it was originally, before she
launches into the dive at the aEYE.

The brief experiment at 0.22 is gone. It could not stay on the pill bar: the gap
between the nav bottom and the pill top is only ~34px, which caps the sprite at about
40px, so the larger figure had to be moved down off the bar to avoid walking behind the
nav. Small and on the bar is the better trade.

## 5. Her legs actually walk now

The legs are **drawn and articulated**, not photographed. Each leg is a two-segment
limb — thigh and shin with a knee — running a real gait cycle:

- the hip swings ±0.42 rad
- the knee only bends on the swing-through, never on the planted leg
- the heel and pointed toe carry the shin's angle
- the torso still bobs, leans, shifts weight and settles on the footfall

The photographed legs are stripped out of the source by
`tools/build_avatar_layers.py` (see `LEG_CUT_Y`) so the drawn ones have somewhere to
live. Legs are drawn *behind* the body, so the skirt overlaps the thighs and the front
leg reads through the slit exactly as it did in the render. Off the walk they rest in a
relaxed stance instead of freezing mid-stride.

Cutting the photographed legs out and rotating them was tried twice and abandoned both
times: the skirt panels interleave with both legs, so no cut separates them without
tearing a wedge of skirt away or opening a seam at the knee. Drawing them is what made a
real gait possible.

**She also faces the way she is going.** The source pose leads toward screen-left while
the strut travels left→right, so unmirrored she moonwalked. She is now mirrored during
the strut.

## 6. The ghost shoe

There was a severed shoe floating between her legs. The ground-shadow removal from the
previous round keyed on "cool, dark, desaturated" pixels — and her *shadowed back leg*
matched that description, so the leg was eaten and its shoe was left behind.

Measured, the back shoe and the ground shadow sit within a few points of each other
(rgb 39,43,54 vs 36,40,52), so no colour rule can separate them. The floor is now cut by
height instead (`FLOOR_Y`), which takes the shadow, the shoes and the stray skirt
fragments in one pass, and the runtime redraws the legs and shoes.

## 7. "A Love Note for Your Soul" header

Three separate problems, all from light-background rules landing on a dark purple
section:

- **"Notes by Beth"** inherited `-webkit-text-fill-color:#16002E` from `.section__title`
  and rendered near-black on dark purple.
- **The description** resolved to `rgb(45,0,82)` — dark purple on dark purple.
- **The tagline** was 38px gold script with a double gold glow, matching nothing else.

All three now follow the same treatment as "Daily Soul Guidance": white Dancing Script
title, readable `#F0FFF9` body copy, and the tagline demoted to a smaller mint script
subtitle in sentence case (the base rule was forcing it to uppercase, which is hard to
read in a script face).

## 8. "Touch to Reveal" no longer covers the crystal ball

The prompt was absolutely positioned at `bottom:24px` inside a stage only ~28px taller
than the sphere, so it sat across the lower third of the glass. The stage now reserves a
strip at its foot; the ball is flex-centred so it rides up, and the prompt lands in the
reserved space — measured 33px clear. The revealed message still sits over the sphere,
as intended.

## 9. Chakra map — nodes locked to the figure

The hotspots are positioned as a percentage of the container height, but the art was
`background-size: contain` in a container with a different aspect ratio (art 848×1264 =
0.67, container ≈ 0.86). `contain` letterboxes on whichever axis runs out first, so the
art shrank while the nodes did not and they drifted off the body.

- Art is now `auto 100%`, pinned to the full container height at every width, so the
  percentage mapping is exact. The watercolour is allowed to crop at the sides on very
  narrow screens — better than losing alignment.
- The seven `--chakra-y` values were re-read off the artwork: 22 / 28 / 34 / 42 / 49 /
  56 / 63 %, replacing 8 / 20 / 32 / 44 / 56 / 68 / 80 %.
- That tightened the rows, so the poster grew 680px → 860px (the most it can take before
  the art outgrows the container) and the labels were slimmed. Measured result: zero
  overlapping label pairs, 15px minimum gap.

## 10. Chakra reading window — small, docked, expandable

It used to open centred at 580px and cover the whole poster, so you had to close it
before reaching another chakra. It is now a 302px window docked top-left, with a
collapse toggle that reduces it to its title bar.

Measured with a chakra open: **zero of the seven nodes are covered**, and
`elementFromPoint` at each node still returns the node itself, so every chakra stays
clickable while the panel is up. On screens under 620px it goes full-width, where there
is no room to dodge.

## 11. The "tail" behind her legs — the train now flows

The tail was the dress train. Static, mirrored, and behind a pair of moving legs, it
read as something hanging off her. It is now its own layer (`avatar_train.png`) that
swings from her hip, **lagging the stride by ~0.9rad** the way heavy fabric does, with a
slight billow at the top of the swing. Trimming it off was tried first and rejected —
flowing keeps the dress intact.

## 12. Gait corrected

The knee was bending in the wrong half of the cycle: `sin(phase - 0.75)` peaked at phase
2.32, i.e. mid-**stance**, so the planted leg buckled while it was supposed to be
carrying her weight. It is now `cos(phase)`, which puts the bend at mid-swing and leaves
the planted leg straight. Also: hips moved up under the skirt hem, limbs thickened
(38→44 thigh, 26→30 shin), and the ankle now takes only 55% of the shin's angle so the
toe stops over-rotating.

## 13. Dive trail and Beth's greeting

**Trail.** The dive emitted dust only at the current position, which at dive speed left
gaps between frames. It now lays dust along the segment she just travelled, so it reads
as a ribbon streaming behind her rather than loose sparkles.

**Greeting, then the jump.** The landing beat now runs:

1. She lands from the dive and says *"Hi I'm Beth Elise, welcome!"* in her own gold
   script bubble, for 3 seconds. **The aEYE does not exist yet at this point.**
2. She crouches, then jumps in an arc — stretching in the air, sparks off her heels.
3. Partway through the arc the **aEYE materialises**, so she lands *into* it.
4. Impact: three expanding rings (teal / gold / teal) plus a white core flash, a
   60-particle burst, and she dissolves into the eye over the last third of the arc.
5. The aEYE takes over with its own message.

**Why the greeting was invisible at first.** It was written into the assistant's own
speech bubble — but `.sacred-assistant` sits at `opacity: 0; transform: scale(.5)` until
`activateSacredAssistantWidget()` runs, which happens *after* the greeting. The text and
class were being set correctly onto an element that could not be seen. Beth now has her
own `#beth-greeting-bubble`, deliberately outside that widget.

Two further bugs found on the way there, both fixed:
- The aEYE **tip rotator overwrote her greeting** about a second after it appeared.
- A **pending 8-second fade timer** hid the bubble mid-greeting.
- Her bubble also rendered as "HI I'M BETH ELISE, WELCOME!" — not `text-transform`,
  which was already `none`, but an inherited `font-variant-caps: all-small-caps`.

The 32-second "user scrolled past the hero" fallback that reveals the eye was pushed to
48 seconds, so it cannot fire mid-routine and give away the appearance.

## Files


```
tools/build_avatar_layers.py   regenerates the avatar layers (run after any grade change)
tools/serve.cjs                local preview server
images/avatar_body.png         figure: wings, train and legs lifted off; halo cleaned
images/avatar_wing_left.png    wing layers, same 1024x1024 canvas as the body
images/avatar_wing_right.png
images/avatar_train.png        dress train — swings from the hip with a lag
images/avatar_layers.json      hinge pivots
images/photorealistic_avatar_transparent.png   original render — kept as build input
```

Rebuild the layers:

```bash
python3 tools/build_avatar_layers.py
```

Preview locally:

```bash
node tools/serve.cjs
```

Then open <http://localhost:4530>. Requires `numpy`, `pillow` and `scipy` for the
layer build only — the site itself has no build step.
