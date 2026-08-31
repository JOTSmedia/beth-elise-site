const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /\.hero__tagline-pill \{\n  margin-bottom: 30px;\n  display: inline-flex;\n  align-items: center;\n  gap: 0\.6rem;\n  background: rgba\(18, 0, 36, 0\.75\);\n  border: 1\.5px solid var\(--tiffany\);\n  color: #00FFC8;\n  font-family: var\(--font-sans\);\n  font-variant: all-small-caps;\n  text-transform: uppercase;\n  font-size: 0\.95rem;\n  font-weight: 800;\n  letter-spacing: 0\.22em;\n  text-shadow: 0 0 12px #00E5D4, 0 2px 5px rgba\(0, 0, 0, 0\.9\);\n  padding: 0\.5rem 1\.6rem;\n  border-radius: var\(--radius-pill\);\n  margin-bottom: 1\.5rem;/g,
  `.hero__tagline-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.6rem;\n  background: rgba(18, 0, 36, 0.75);\n  border: 1.5px solid var(--tiffany);\n  color: #00FFC8;\n  font-family: var(--font-sans);\n  font-variant: all-small-caps;\n  text-transform: uppercase;\n  font-size: 0.95rem;\n  font-weight: 800;\n  letter-spacing: 0.22em;\n  text-shadow: 0 0 12px #00E5D4, 0 2px 5px rgba(0, 0, 0, 0.9);\n  padding: 0.5rem 1.6rem;\n  border-radius: var(--radius-pill);\n  margin-bottom: 30px;`
);

fs.writeFileSync('css/style.css', code);
