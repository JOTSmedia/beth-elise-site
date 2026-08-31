const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// 1. Tighter nav height on desktop (64px -> 56px)
code = code.replace(/--nav-height: 64px;/g, '--nav-height: 56px;');

// 2. Move hero section up ~15% by increasing bottom padding (safe top padding)
code = code.replace(
  /padding: calc\(var\(--nav-height\) \+ 2rem\) 2rem 4rem;/g,
  "padding: calc(var(--nav-height) + 2rem) 2rem 15vh;"
);

// 3. Add border-radius: 50% to crystal-ball-wrapper to fix hover boundary
code = code.replace(
  /\.crystal-ball-wrapper \{\n  position: relative;\n  width: 280px;\n  height: 280px;\n  margin: 0 auto;\n  display: flex;/g,
  ".crystal-ball-wrapper {\n  position: relative;\n  width: 280px;\n  height: 280px;\n  margin: 0 auto;\n  display: flex;\n  border-radius: 50%;"
);

fs.writeFileSync('css/style.css', code);
