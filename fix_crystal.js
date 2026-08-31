const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /#oracle-crystal-ball-canvas \{\n  width: 280px;\n  height: 280px;\n  display: block;\n  border-radius: 50%;/g,
  "#oracle-crystal-ball-canvas {\n  width: 280px;\n  height: 280px;\n  display: block;"
);

fs.writeFileSync('css/style.css', code);
