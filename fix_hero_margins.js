const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// Revert the -80px to a smaller, more normal offset for the star
code = code.replace(
  /\.hero__logo-img \{\n  width: min\(540px, 96\%\);\n  height: auto;\n  margin: -80px auto 35px;/g,
  `.hero__logo-img {\n  width: min(540px, 96%);\n  height: auto;\n  margin: -40px auto 30px;`
);

// Make the tagline pill gap equal
code = code.replace(
  /\.hero__tagline-pill \{\n  margin-bottom: 35px;\n  display: inline-flex;/g,
  `.hero__tagline-pill {\n  margin-bottom: 30px;\n  display: inline-flex;`
);

fs.writeFileSync('css/style.css', code);
