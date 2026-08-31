const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// 1. Remove pill/button styling from nav links so they look like sleek text
code = code.replace(
  /\.nav__links a \{\n  font-family: var\(--font-sans\);\n  font-size: 1\.02rem;\n  font-weight: 800;\n  letter-spacing: 0\.09em;\n  text-transform: uppercase;\n  color: #FFFFFF !important;\n  position: relative;\n  padding: 0\.35rem 0\.85rem;\n  border-radius: var\(--radius-pill\);\n  transition: all 0\.25s cubic-bezier\(0\.16, 1, 0\.3, 1\);\n  text-shadow: 0 1px 3px rgba\(0, 0, 0, 0\.9\);\n  background: rgba\(255, 255, 255, 0\.06\);\n  border: 1\.5px solid rgba\(0, 229, 212, 0\.35\);\n  box-shadow: 0 4px 15px rgba\(0, 0, 0, 0\.4\);\n  white-space: nowrap;\n  backdrop-filter: blur\(8px\);\n  -webkit-backdrop-filter: blur\(8px\);\n\}/g,
  `.nav__links a {\n  font-family: var(--font-sans);\n  font-size: 0.9rem;\n  font-weight: 800;\n  letter-spacing: 0.12em;\n  text-transform: uppercase;\n  color: #FFFFFF !important;\n  position: relative;\n  padding: 0.2rem 0.5rem;\n  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);\n  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);\n  white-space: nowrap;\n}`
);

// Remove the ::after underline to match sleeker style, or just keep it thin
code = code.replace(
  /\.nav__links a::after \{[\s\S]*?\}/g,
  `.nav__links a::after {\n  content: '';\n  position: absolute;\n  bottom: -4px; left: 50%;\n  transform: translateX(-50%);\n  width: 0; height: 1.5px;\n  background: #00FFC8;\n  transition: width 0.3s ease;\n  box-shadow: 0 0 8px #00E5D4;\n}`
);

// 2. Adjust hero layout to pull logo star behind nav and equalize spacing
code = code.replace(
  /\.hero__logo-img \{\n  width: min\(540px, 96\%\);\n  height: auto;\n  margin: 0 auto 1\.25rem;/g,
  `.hero__logo-img {\n  width: min(540px, 96%);\n  height: auto;\n  margin: -80px auto 35px;`
);

// Ensure the tagline pill has matching margin below it to space from lead text
code = code.replace(
  /\.hero__tagline-pill \{\n  display: inline-flex;/g,
  `.hero__tagline-pill {\n  margin-bottom: 35px;\n  display: inline-flex;`
);

// Adjust hero padding to push everything up by 15% overall
code = code.replace(
  /padding: calc\(var\(--nav-height\) \+ 2rem\) 2rem 15vh;/g,
  "padding: calc(var(--nav-height) - 1rem) 2rem 22vh;"
);

fs.writeFileSync('css/style.css', code);
