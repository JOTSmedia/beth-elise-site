const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// Revert the extreme -12vh pull up
code = code.replace(
  /margin-top: -12vh;/g,
  "margin-top: -4vh;"
);

// Tweak the logo offset so the star perfectly tucks 35% under the nav
code = code.replace(
  /\.hero__logo-img \{\n  width: min\(540px, 96\%\);\n  height: auto;\n  margin: -40px auto 30px;/g,
  `.hero__logo-img {\n  width: min(540px, 96%);\n  height: auto;\n  margin: -25px auto 30px;`
);

fs.writeFileSync('css/style.css', code);
