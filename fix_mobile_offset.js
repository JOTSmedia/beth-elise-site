const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /margin: -40px auto clamp\(0\.85rem, 2\.0vh, 1\.25rem\) !important;/g,
  "margin: -20px auto clamp(0.85rem, 2.0vh, 1.25rem) !important;"
);

code = code.replace(
  /margin: -30px auto clamp\(0\.65rem, 1\.5vh, 1\.0rem\) !important;/g,
  "margin: -15px auto clamp(0.65rem, 1.5vh, 1.0rem) !important;"
);

fs.writeFileSync('css/style.css', code);
