const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// 992px breakpoint
code = code.replace(
  /\.hero__tagline-pill \{\n    font-size: clamp\(0\.70rem, 2\.2vw, 0\.82rem\) !important;/g,
  `.hero__tagline-pill {\n    margin-top: -15px !important;\n    font-size: clamp(0.70rem, 2.2vw, 0.82rem) !important;`
);
code = code.replace(
  /\.hero__lead \{\n    font-size: clamp\(0\.85rem, 2\.4vw, 1\.05rem\) !important;/g,
  `.hero__lead {\n    margin-top: 15px !important;\n    font-size: clamp(0.85rem, 2.4vw, 1.05rem) !important;`
);

// 480px breakpoint
code = code.replace(
  /\.hero__tagline-pill \{\n    font-size: clamp\(0\.66rem, 2\.1vw, 0\.74rem\) !important;/g,
  `.hero__tagline-pill {\n    margin-top: -10px !important;\n    font-size: clamp(0.66rem, 2.1vw, 0.74rem) !important;`
);
code = code.replace(
  /\.hero__lead \{\n    font-size: clamp\(0\.82rem, 2\.3vw, 0\.90rem\) !important;/g,
  `.hero__lead {\n    margin-top: 10px !important;\n    font-size: clamp(0.82rem, 2.3vw, 0.90rem) !important;`
);

fs.writeFileSync('css/style.css', code);
