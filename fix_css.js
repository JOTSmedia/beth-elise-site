const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// 1. Revert hero padding
code = code.replace(
  /padding: calc\(var\(--nav-height\) \+ 0\.5rem\) 2rem 6rem;/g,
  "padding: calc(var(--nav-height) + 2rem) 2rem 4rem;"
);

// 2. Reduce nav__links a padding
code = code.replace(
  /padding: 0\.5rem 1\.05rem;/g,
  "padding: 0.35rem 0.85rem;"
);

fs.writeFileSync('css/style.css', code);
