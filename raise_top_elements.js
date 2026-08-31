const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// Raise the pill bar, which naturally raises the logo (North Star)
code = code.replace(
  /\.hero__tagline-pill \{\n  display: inline-flex;/g,
  `.hero__tagline-pill {\n  margin-top: -30px;\n  display: inline-flex;`
);

// Keep the lead text (and anything below it) from moving up
code = code.replace(
  /\.hero__lead \{\n  font-family: var\(--font-body\);/g,
  `.hero__lead {\n  margin-top: 30px;\n  font-family: var(--font-body);`
);

fs.writeFileSync('css/style.css', code);
