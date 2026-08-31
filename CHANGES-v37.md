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

## 14. Beth's greeting bubble — comic style, mouth-anchored, timed

- **It now waits.** The bubble no longer appears on the landing frame; she gets 0.4s
  to settle first, and it clears 0.55s *before* she crouches to jump, so it is off
  screen by the time she moves.
- **It is anchored to her mouth.** Position is computed in JS from the aEYE button's
  rect at the moment it opens (that button is `position: fixed`, so its rect is already
  in viewport space). Her mouth sits ~36px above her ankle origin at this scale; the
  tail tip lands just above it.
- **It no longer covers her.** Measured: 19px of clearance between the tail tip and the
  top of her head.
- **Comic-book styling**, deliberately unlike the aEYE's dark violet glass bubbles:
  semi-transparent white (`rgba(255,255,255,.9)`), a 2.5px blue ink outline built off
  the Third Eye chakra blue already in the palette (`#7289DA` deepened to `#3E5FC4`),
  a pointed tail, and dark navy script text. Also made smaller — 186px max, 1.12rem.

## 15. Emoji replaced with rendered icons

The site used OS emoji for its pictographic icons, which render as flat cartoon glyphs
and sat badly next to the photoreal artwork. **132 of them across all 8 HTML pages** are
now `.pico` icons:

- **Two are genuinely photographic**, cut out of renders already in the project by
  `tools/build_icons.py` — the crystal orb (replaces 🔮) and the iris (replaces 👁).
  Both sources had their dark studio background baked in despite the filenames, so the
  sphere is masked with a feathered circle rather than trusting the alpha.
- **Ten are drawn as shaded vector objects** by `tools/build_icon_css.py` — gradients,
  a specular highlight and a grounded shadow, in the site palette. These are vector
  craft, not photography: no image generation was available, so a genuinely
  photorealistic bell or dove could not be produced here.

Typographic ornaments (✦ ★ ✧ ❖ → ✓) were left alone — they read as intentional glyphs
in the site's own colour, not as emoji.

Typographic ornaments (✦ ★ ✧ ❖ → ✓) are left alone — they read as intentional glyphs
in the site's own colour, not as emoji.

## 15b. The rest of the emoji — including the ones in JavaScript

The first pass covered markup only and stopped at 132, leaving 27 emoji in HTML and 46
in `js/main.js`. All of them are gone now: **zero pictographic emoji remain anywhere in
the project**, and the icon set has grown from 12 to 47.

Finishing the JS half was not optional. Several lines were actively re-inserting emoji
into elements the markup pass had already converted — `#sound-mute-icon` starts as a
`bell-off` icon and reverted to a flat 🔔 the moment you toggled sound, and the same
was true of both quiz prescription tiles.

**`setPico(el, icon, text)`** handles every label that JavaScript writes. The icon is a
real `<span>` and the label goes in as a text node, never `innerHTML`, so interpolated
values (an aEye search query, a product name) stay inert.

A first version put the icon on a `::before` instead, which was wrong twice over:
`.btn-primary::before` is already the hover shine, an element only ever gets one
`::before`, so on those buttons the icon inherited `position:absolute; left:-100%` and
rendered off-canvas **while also clobbering the shine**. Real elements have no such
collision.

**Eight moon phases are generated, and the card that shows them now works.**
`updateMoonUI()` computes the true phase from the synodic month, but wrote it into
`#live-moon-icon` / `#live-moon-phase-name` — ids that were never in the markup — so the
strip showed a hardcoded "Waxing Gibbous · 91%" whatever the sky was doing. The ids are
wired up now; today it reads First Quarter · 47%.

The phases are composed from a half-disc plus a terminator ellipse, all clipped to the
moon. An earlier attempt drew the limb and terminator as two arcs and got the sweep
flags wrong — quarters came out mirrored and crescents rendered as gibbous. Rectangles
and ellipses are unambiguous.

**Also fixed along the way:** the dove was redrawn twice (its wing first read as a
striped loaf, then swept forward into the beak, which on a right-facing bird reads as a
scratch rather than a wing); the baseball cap's crown was flattened after reading as a
dome lamp; and ☁️ ⚙️ ✍️ turned out to be emoji too — they sit in the dingbat block, so
the first sweep skipped them, but a trailing U+FE0F forces colour-emoji presentation.

**The honest caveat still stands.** Two icons are photographic; the other 45 are shaded
vector objects. No image generation was available, so a truly photorealistic bell or
dove was not possible here.

## 16. Two stray closing braces in the stylesheet

While chasing why `.pico` would not apply, the CSS turned out to have **two more `}`
than `{`**. A stray brace at top level makes the parser swallow the rule immediately
after it:

- One at line ~5849 was mine, left behind when I rewrote the greeting-bubble block.
- One at ~3078 is **pre-existing — it is in `bethElisePsychic_v2` too**: a declaration
  block whose selector was lost (`display:flex; flex-direction:column; gap:1.1rem;
  padding:1rem 0 0; flex:1; justify-content:space-around;`). Dead as written, and it was
  eating `.chakra-guidance-badge` behind it. Removed rather than guessed at, since the
  original selector is not recoverable from either version.

## 17. Performance — the homepage was 13.7 MB

The dominant problem with the site, and not a close contest: **12.9 MB of that
was images.** On a phone over average mobile data that is a half-minute stare
at a blank screen.

Dimensions were never really the issue — most sources are 1024px. Quality was:
1024x1024 JPEGs saved at ~900 KB each, RGBA PNGs at 1.5-2 MB. A few were also
oversized for their slot; `logo.png` is 1264x848 and renders at 54x36 in the
nav, 11.8x more pixels than a 2x display can use.

`tools/optimize_images.py` writes a WebP beside each source, capped at roughly
2x the largest place it renders. Originals stay: two are build inputs for the
avatar and icon pipelines, and they are the masters for any future resize.
Three files came out *bigger* as WebP — already small and well-compressed — so
the tool now discards those and leaves the reference on the original rather
than shipping the worse of the two.

    31.1 MB of source art  ->  4.6 MB of WebP   (85% smaller)

Then `loading="lazy"` and `decoding="async"` on everything below the fold, and
intrinsic `width`/`height` on all 39 images so nothing reflows as they arrive.

| | before | after |
|---|---|---|
| homepage | 13.70 MB | **2.10 MB** |
| all 7 pages | — | **7.49 MB** |
| layout shift (CLS) | — | **0** |

## 18. Font Awesome removed — 370 KB for six glyphs

Every page pulled a render-blocking stylesheet from `cdnjs.cloudflare.com` plus
`fa-solid-900.woff2` (153 KB) and `fa-brands-400.woff2` (114 KB). The whole
payload was drawing **six icons**: Instagram, TikTok, Facebook, YouTube,
Spotify and a star.

They are now `.sico` marks in the same generated stylesheet as the rest. These
use `mask-image` rather than `background-image`, so one shape inherits
`currentColor` and follows the link's hover state instead of needing a file per
colour — the gold rating star and the white footer icons are the same six
definitions.

That removes the site's only third-party asset dependency. Google Fonts is now
the sole external request.

## 19. Accessibility

- **`<main>` and a skip link on all 7 pages.** There was no `main` landmark
  anywhere, so a screen-reader user had no way past the nav — and on the
  homepage that means past the entire fairy sequence. The skip link is the
  first tab stop and visible only when focused.
- **Focus was invisible.** Three `:focus` rules in 6,000 lines of CSS, and
  several controls are custom elements whose own backgrounds swallowed the UA
  outline. There is now a consistent `:focus-visible` ring that holds on both
  the deep purple and the pale sections.
- **`prefers-reduced-motion` was not honoured at all.** The page runs five
  independent `requestAnimationFrame` loops plus a scripted sequence that
  walks, dives and lands a fairy. Each loop now paints one frame and stops, so
  the artwork is all still there, just still.

  The fairy sequence is *skipped* rather than frozen, which matters: it is what
  hands over to the aEYE assistant at the end, so freezing it would have left
  the assistant unreachable for 48 seconds. With reduced motion the assistant
  appears immediately instead.
- **Unlabelled controls.** The aEYE search input had only a placeholder; six
  more labels sat next to their field without a `for` binding.

## 20. SEO and launch-readiness

`tools/build_meta.py` writes the block between markers on every page, with the
domain in one constant.

- **No canonical URL** existed anywhere; now on all 7.
- **Open Graph** was three tags on the homepage and nothing on the six
  subpages, with no `og:image` — shared to iMessage, WhatsApp or Slack the site
  was a bare URL with no picture. All 7 now carry full OG plus a Twitter
  `summary_large_image`.
- **No share image existed.** `tools/build_og_image.py` composites a 1200x630
  card: the hero forest darkened, with the *light* wordmark over it. The
  default `logo.png` is deep purple and disappeared into the trees.
- **No structured data.** The homepage now carries a `ProfessionalService` +
  `Person` graph with the three services as an offer catalog.
- **No favicon file, robots.txt or sitemap.** All generated by
  `tools/build_site_files.py`, favicons cut from the iris orb so the tab icon
  matches the preloader. They are written as PNG, not WebP — some browsers
  ignore a WebP favicon outright, and a favicon is the one place where the
  safest format wins.

Two things are deliberately **absent** from the structured data, because
asserting them would be asserting something false:

- `telephone` — the published number is `(201) 555-0194`, a 555 placeholder.
- `sameAs` — every social link points at a bare platform root
  (`https://instagram.com`), not at a profile.

Both should be added to `tools/build_meta.py` once the real values exist, along
with `SITE` if the domain is not `bethelisepsychic.com`.

## 21. Three bugs found while doing the above

- **`<span>` inside `<option>`.** The emoji sweep put icon spans into four
  `<option>` elements on the contact form. An `option` may only contain text,
  so the parser dropped them — harmless in the end, but invalid, and it made
  the select look unlabelled to the audit. Reverted to plain text.
- **The booking date was hardcoded** to a fixed day, which quietly becomes a
  date in the past. It now defaults to tomorrow with a matching `min`.
- **…and the first fix for that had a timezone bug of its own.**
  `toISOString().slice(0, 10)` converts to UTC first, which lands on the wrong
  day for anyone west of Greenwich during their evening — New Jersey, every day
  after 8pm. Caught it live at 20:02 local: UTC gave Aug 22 where the answer
  was Aug 21. Now built from local date parts.

## 22. Type — six families requested, two ever used

Every page linked a stylesheet from `fonts.googleapis.com` asking for **six**
families: Alex Brush, Cormorant Garamond (eight weights plus italics), Dancing
Script, Great Vibes, Plus Jakarta Sans and Satisfy.

The stylesheet only ever resolves to two. `--font-script` lists Alex Brush,
Satisfy and Great Vibes purely as fallbacks behind Dancing Script, which always
loads, so none of the three can ever render — and Cormorant Garamond is not
referenced anywhere at all. `--font-serif` is also byte-for-byte identical to
`--font-sans`, so the "serif" token has never produced a serif.

**And it was all being requested twice.** `style.css` opened with an `@import`
of the same six-family URL, on top of the `<link>` in every page's head. An
`@import` is the worse of the two: it cannot be preloaded, and it blocks
rendering until the imported sheet resolves.

`tools/build_fonts.py` now self-hosts the two real families, latin and
latin-ext, under the SIL Open Font License (see `fonts/OFL.txt`).

| | before | after |
|---|---|---|
| font payload | 138 KB | **69 KB** |
| external hosts | 2 | **0** |
| round trips before text paints in its real face | 2, cross-origin | 0 |

The site now makes **no third-party requests at all** — no CDN, no Google, so
loading a page does not tell anyone else that a visitor was here.

## 23. Accessibility, round two

Measured at a real 375px viewport, not a resized desktop window:

- **Five controls were under the 24x24 minimum** WCAG 2.5.8 requires — the
  smallest being the aEYE bubble's close at 17x18 and the chakra popup's
  collapse toggle at 20x23. Icon buttons simply grew to 44x44. Inline footer
  links cannot grow without moving the layout, so they get an invisible
  `::after` that extends the hit area to 44px while the text stays put.
- **Privacy and Terms both linked to the contact page.** Neither page existed.

## 24. Privacy, Terms, and a 404

The contact form collects a name, an email, a phone number and a free-text
message where people often describe a bereavement or a health worry. A site
doing that needs a privacy policy, and it had none.

Both new pages are written to be read rather than skimmed past, and both are
honest about what the site actually does — there are no analytics, no
advertising pixels and no third-party requests, so the policy says exactly
that. The terms carry a plain statement that readings, Reiki and Tapping are
for guidance and wellbeing and are not medical, psychological or financial
advice, with a crisis line.

`404.html` is on-brand and routes back into the site. All its paths are
absolute, since a 404 is served from any depth, and it carries
`robots: noindex` with no canonical.

## 25. Deployment configuration

`_headers` (Netlify / Cloudflare Pages) and `.htaccess` (Apache) split caching
the way it needs to be split: **HTML must revalidate** so an edit goes live,
while fingerprinted fonts, images, CSS and JS get a year and `immutable`. Both
also set `nosniff`, `Referrer-Policy`, `X-Frame-Options` and a
`Permissions-Policy` that denies camera, microphone and payment.

## 26. Housekeeping — 8.4 MB of orphaned art

Twenty-one files were referenced by nothing: alternate crystal-ball renders,
two `channeling-light` merch colourways, a spare portrait. Moved to
`images/_unused/` with a README rather than deleted, so nothing is lost.

The optimizer was also generating WebP for two masters that are only ever build
inputs — `crystal_ball_transparent.png` and
`photorealistic_avatar_transparent.png`, consumed by the icon and avatar
pipelines and never served. That was ~700 KB of files nothing requests; it now
skips them.

## 27. One thing I got wrong

I reported clipped text on mobile from headless screenshots at 360 and 390px —
"INTUITIVE WISDOM & ENERGY HEALIN", "EXPERIENCE GRO". **The site was fine; the
screenshots were not.** Chrome clamps a headless window to a 500px minimum on
this platform, so `--window-size=360` laid the page out at 500px and cropped
the image to 360. The mobile layout, checked at a real emulated 375px, has no
horizontal overflow and wraps correctly.

Worth recording because the artefact is convincing: it looks exactly like a
real overflow bug.

## 28. The icons are rendered now, not drawn

The set was honest vector craft — gradients, a highlight, a grounded shadow —
but it still read as clip art beside the photographic artwork. They are now
**rendered as lit objects**: a blurred, eroded copy of each shape's own alpha
becomes a height field, which is shaded with real `feDiffuseLighting` and
`feSpecularLighting` from a key light and a point light, then hard-clipped back
to the original alpha so the silhouette stays crisp. Without that final clip
the bevel smears past the edge and everything looks like a smudge.

Materials carry their own rig (`tools/icon_materials.py`): gold takes a tight
bright highlight and a warm bounce, fabric a broad dim one, porcelain sits
between, glass gets the tightest and brightest of all.

The lighting is **baked at build time** rather than shipped as live SVG
filters. Seventy filtered elements is real compositor work on every page load,
filter support differs subtly between engines, and at a 19px render size the
browser computes the whole chain for almost no visible detail. Rendered once at
2x and downsampled: 45 icons, 350 KB total, and `style.css` drops from 226 KB
to 163 KB now that the data URIs are gone.

**Two bugs surfaced during the render.** All 45 icons are composed into one
document so the whole set can be captured in a single screenshot — which meant
their ids collided, and every `mask="url(#mshadow)"` resolved to the first one
on the page. That silently gave all eight moon phases first-quarter's
terminator. Ids are namespaced per icon now. Separately, the gibbous shadow
used even-odd on a rect-plus-ellipse, which filled a dark lens straight across
the *lit* side, because a point inside only the ellipse still counts as odd. It
uses a mask, which states the intersection directly.

**The honest limit, unchanged:** no image generation was available in this
session. Two icons are genuine photography, cut from renders already in the
project. The other 45 are rendered geometry — real lighting maths over
hand-authored shapes, which is a large step past flat vector and still not a
photograph.

## 29. The scroll reveal never actually revealed on scroll

`.fade-in` carried `animation: forceContentVisible 0.4s ease 0.8s forwards`, so
every element on the page became visible 1.2s after load whether it had been
scrolled to or not. The IntersectionObserver below it was doing nothing, and
the page had no choreography at all. It was presumably a safety hatch against
content never appearing if something failed.

The hatch is now a `js` class set by an inline script in the head, so a visitor
without JavaScript is never served hidden content in the first place. Sections
stage in as they arrive, and siblings within a group stagger 78ms apart so a
grid assembles rather than appearing as a slab.

Removing a safety net needs a better one, not none:

- The observer stages the reveal.
- A scroll-driven backstop guarantees it. Chrome does **not** deliver
  IntersectionObserver callbacks to a hidden document, so a tab opened in the
  background and read later could otherwise sit on content that never appears.
- The backstop reveals anything whose top has passed the reveal line,
  *including what is now above the viewport*. Testing "currently in view"
  instead stranded every element the reader scrolled straight past — a fast
  flick or an anchor jump left holes that never filled in. Caught by testing
  with deliberately coarse scroll jumps.

## 30. Motion polish

The icons are lit objects with a consistent key light, so hovering their
control nudges them toward it: a 1.5px lift, slightly more exposure, and a
shadow that tightens as they rise. Buttons gained a press state — without one,
clicking a large gradient button read as nothing happening until the toast
arrived. The chakra nodes breathe on a slow 3.4s cycle, offset per node, so the
one part of the page that asks to be explored looks live.

All of it is transform and filter only, and all of it is off under
`prefers-reduced-motion`.

## 31. Two more measurement traps

Both cost real time, and both looked exactly like site bugs:

- **Headless Chrome froze the animation clock.** Screenshots of any section
  below the hero came back blank, which read as "content is invisible on the
  live site". It was `--virtual-time-budget`: the document is hidden, so the
  animation timeline barely advances — 33ms of progress against 4s of wall
  clock. In a real browser the same element reported `playState: "finished"`,
  `opacity: 1`.
- **`window.scrollTo` did nothing**, in the pane and in headless, which looked
  like a broken scroll container. The site sets `scroll-behavior: smooth`, and
  a smooth scroll is driven by rAF — which is throttled in a hidden document.
  Forcing `scroll-behavior: auto` first made every scroll test work.

The screenshot harness that grew out of this is kept at
`tools/shot-harness.html`, with the traps documented at the top of it.

## Files


```
tools/build_photoreal_icons.py renders the icon set with real lighting -> images/icons/
tools/icon_materials.py        material gradients + lighting rigs
tools/icon_shapes.py           icon geometry and material assignments
tools/shot-harness.html        screenshot harness for visual checks (not part of the site)
tools/build_fonts.py           self-hosts the two typefaces actually used
tools/optimize_images.py       generates the WebP the site serves (85% smaller)
tools/build_og_image.py        composites the 1200x630 social share card
tools/build_meta.py            canonical + Open Graph + Twitter + JSON-LD on every page
tools/build_site_files.py      favicons, robots.txt, sitemap.xml, web manifest
tools/build_avatar_layers.py   regenerates the avatar layers (run after any grade change)
tools/build_icons.py           cuts the photoreal orb + iris icons out of the renders
tools/build_icon_css.py        generates the .pico icon CSS (re-runnable, marker-delimited)
tools/serve.cjs                local preview server
images/avatar_body.png         figure: wings, train and legs lifted off; halo cleaned
images/avatar_wing_left.png    wing layers, same 1024x1024 canvas as the body
images/avatar_wing_right.png
images/avatar_train.png        dress train — swings from the hip with a lag
images/avatar_layers.json      hinge pivots
images/icon-orb.png            photoreal crystal orb icon (replaces the 🔮 emoji)
images/icon-eye.png            photoreal iris icon (replaces the 👁 emoji)
images/photorealistic_avatar_transparent.png   original render — kept as build input
```

Rebuild everything generated (safe to re-run; all of it is idempotent).
`build_photoreal_icons.py` drives headless Chrome against the local preview,
so start `node tools/serve.cjs` first:

```bash
python3 tools/build_fonts.py && python3 tools/optimize_images.py && python3 tools/build_og_image.py && python3 tools/build_photoreal_icons.py && python3 tools/build_icon_css.py && python3 tools/build_meta.py && python3 tools/build_site_files.py
```

Before launch, three values need replacing in `tools/build_meta.py`: `SITE` if
the domain is not `bethelisepsychic.com`, and the `telephone` and `sameAs`
entries in the structured data, which are left out on purpose while the phone
number is a 555 placeholder and the social links point at bare platform roots.

Rebuild the avatar layers (only needed after a new source render or a grade change):

```bash
python3 tools/build_avatar_layers.py
```

Preview locally:

```bash
node tools/serve.cjs
```

Then open <http://localhost:4530>. Requires `numpy`, `pillow` and `scipy` for the
layer build only — the site itself has no build step.
