const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /padding-top: calc\(var\(--nav-height\) \+ clamp\(0\.4rem, 1\.8vh, 1\.25rem\)\) !important;/g,
  "padding-top: calc(var(--nav-height) - 1rem) !important;"
);

code = code.replace(
  /padding-top: calc\(var\(--nav-height\) \+ clamp\(0\.30rem, 1\.5vh, 0\.85rem\)\) !important;/g,
  "padding-top: calc(var(--nav-height) - 1.5rem) !important;"
);

fs.writeFileSync('css/style.css', code);
