const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// Add white-space: nowrap to base pill bar
code = code.replace(
  /\.hero__tagline-pill \{\n  display: inline-flex;\n  align-items: center;\n  gap: 0\.6rem;\n  background: rgba\(18, 0, 36, 0\.75\);/g,
  `.hero__tagline-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(18, 0, 36, 0.75);
  white-space: nowrap;`
);

// Update gap in desktop override
code = code.replace(
  /top: calc\(var\(--nav-height\) \+ 40px\);/g,
  `top: calc(var(--nav-height) + 15px);`
);

fs.writeFileSync('css/style.css', code);
