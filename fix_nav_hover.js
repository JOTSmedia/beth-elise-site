const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /\.nav__links a:hover,\n\.nav__links a\.active \{\n  color: #FFFFFF !important;\n  text-shadow: 0 0 14px #00E5D4, 0 0 28px #00FFC8, 0 0 40px rgba\(0, 229, 212, 0\.95\) !important;\n  background: rgba\(0, 229, 212, 0\.28\);\n  border-color: #00FFC8;\n  transform: translateY\(-2px\);\n  box-shadow: 0 0 25px rgba\(0, 229, 212, 0\.6\), 0 6px 20px rgba\(0, 0, 0, 0\.5\);\n\}/g,
  `.nav__links a:hover,\n.nav__links a.active {\n  color: #FFFFFF !important;\n  text-shadow: 0 0 14px #00E5D4, 0 0 28px #00FFC8, 0 0 40px rgba(0, 229, 212, 0.95) !important;\n  transform: translateY(-2px);\n}`
);

fs.writeFileSync('css/style.css', code);
