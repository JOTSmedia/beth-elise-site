const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /\.hero \{\n  position: relative;\n  min-height: 100vh;\n  min-height: 100dvh;\n  height: 100dvh;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n  text-align: center;\n  padding: calc\(var\(--nav-height\) \+ 1\.5rem\) 2rem 4rem;/g,
  `.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: calc(var(--nav-height) + 1rem) 2rem 4rem;`
);

// Remove the margin: auto 0; from .hero__content
code = code.replace(
  /padding: 1\.5rem 1rem;\n  margin: auto 0;/g,
  `padding: 1.5rem 1rem;`
);

fs.writeFileSync('css/style.css', code);
