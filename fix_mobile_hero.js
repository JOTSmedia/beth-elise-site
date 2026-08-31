const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// For max-width: 992px
code = code.replace(
  /margin: clamp\(0\.15rem, 0\.5vh, 0\.4rem\) auto clamp\(0\.35rem, 1\.0vh, 0\.85rem\) !important;/g,
  "margin: -40px auto clamp(0.85rem, 2.0vh, 1.25rem) !important;"
);

// For max-width: 480px
code = code.replace(
  /margin: clamp\(0\.10rem, 0\.4vh, 0\.3rem\) auto clamp\(0\.25rem, 0\.8vh, 0\.65rem\) !important;/g,
  "margin: -30px auto clamp(0.65rem, 1.5vh, 1.0rem) !important;"
);

fs.writeFileSync('css/style.css', code);
