const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /padding: calc\(var\(--nav-height\) \+ 2rem\) 2rem 4rem;/g,
  "padding: calc(var(--nav-height) + 0.5rem) 2rem 6rem;"
);

fs.writeFileSync('css/style.css', code);
