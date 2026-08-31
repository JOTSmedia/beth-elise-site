const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /\.hero \{\n  position: relative;\n  min-height: 100vh;\n  min-height: 100dvh;\n  height: 100dvh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: calc\(var\(--nav-height\) \+ 1rem\) 2rem 4rem;/g,
  `.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-align: center;
  padding: calc(var(--nav-height) + 80px) 2rem 4rem;`
);

fs.writeFileSync('css/style.css', code);
