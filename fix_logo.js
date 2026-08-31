const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');
code = code.replace(
  /width: min\(480px, 96%\);\n  max-height: 38vh;\n  object-fit: contain;\n  height: auto;/g,
  `max-width: min(640px, 90vw);
  max-height: 48vh;
  object-fit: contain;
  height: auto;
  width: auto;`
);
fs.writeFileSync('css/style.css', code);
