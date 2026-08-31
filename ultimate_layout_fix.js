const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// 1. Set .hero back to align-items: center so the logo is perfectly dead center in the viewport
code = code.replace(
  /\.hero \{\n  position: relative;\n  min-height: 100vh;\n  min-height: 100dvh;\n  height: 100dvh;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  text-align: center;\n  padding: calc\(var\(--nav-height\) \+ 80px\) 2rem 4rem;/g,
  `.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: calc(var(--nav-height) + 2rem) 2rem 4rem;`
);

// 2. Set .hero__bg to center center so the Tree Portal is perfectly dead center in the viewport
code = code.replace(
  /background-position: center bottom;/g,
  `background-position: center center;`
);

// 3. Make the pill bar absolute so it pins to the top nav regardless of where the logo is
code = code.replace(
  /\.hero__tagline-pill \{\n  display: inline-flex;/g,
  `.hero__tagline-pill {
  position: absolute;
  top: calc(var(--nav-height) + 40px); /* Just enough space for the Vanna White sequence */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: inline-flex;`
);

fs.writeFileSync('css/style.css', code);
