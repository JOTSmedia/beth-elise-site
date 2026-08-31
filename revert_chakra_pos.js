const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /top: auto;\n  bottom: 2%;\n  left: 50%;\n  transform: translateX\(-50%\) scale\(0\.92\);/g,
  "top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%) scale(0.92);"
);

code = code.replace(
  /transform: translateX\(-50%\) scale\(1\);/g,
  "transform: translate(-50%, -50%) scale(1);"
);

fs.writeFileSync('css/style.css', code);
