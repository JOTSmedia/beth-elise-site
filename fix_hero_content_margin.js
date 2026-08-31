const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /\.hero__content \{\n  position: relative;\n  z-index: 3;\n  max-width: 880px;\n  padding: 1\.5rem 1rem;/g,
  ".hero__content {\n  position: relative;\n  z-index: 3;\n  max-width: 880px;\n  padding: 1.5rem 1rem;\n  margin-top: -12vh;"
);

// We should also remove the extreme 22vh bottom padding and go back to a standard padding
// since margin-top does the heavy lifting of pulling it up without needing bottom padding tricks.
code = code.replace(
  /padding: calc\(var\(--nav-height\) - 1rem\) 2rem 22vh;/g,
  "padding: calc(var(--nav-height) - 1rem) 2rem 4rem;"
);

fs.writeFileSync('css/style.css', code);
