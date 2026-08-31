const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// Restore the inline-flex to base
code = code.replace(
  /\.hero__tagline-pill \{\n  position: absolute;\n  top: calc\(var\(--nav-height\) \+ 40px\); \/\* Just enough space for the Vanna White sequence \*\/\n  left: 50%;\n  transform: translateX\(-50%\);\n  z-index: 10;\n  display: inline-flex;/g,
  `.hero__tagline-pill {
  display: inline-flex;`
);

// We need to add the absolute positioning ONLY inside a media query for desktop (e.g. min-width: 1025px)
code = code.replace(
  /\.hero__content \{\n  position: relative;\n  z-index: 3;\n  max-width: 880px;\n  padding: 6rem 1rem 1\.5rem; \/\* Large top padding to clear absolute pill bar \*\//g,
  `.hero__content {
  position: relative;
  z-index: 3;
  max-width: 880px;
  padding: 1.5rem 1rem;`
);

// Append the desktop-only override at the bottom of the hero section
const desktopOverride = `
@media (min-width: 1025px) {
  .hero__content {
    padding-top: 8rem; /* Large top padding to clear absolute pill bar */
  }
  .hero__tagline-pill {
    position: absolute;
    top: calc(var(--nav-height) + 20px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
}
`;

code = code.replace(
  /\/\* ─── CRISP STANDALONE LOGO \(Hero\) — Signature Celestial Blue Glow ─── \*\//g,
  `${desktopOverride}\n/* ─── CRISP STANDALONE LOGO (Hero) — Signature Celestial Blue Glow ─── */`
);

fs.writeFileSync('css/style.css', code);
