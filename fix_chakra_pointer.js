const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /\.chakra-hotspot-node \{\n  position: absolute;/g,
  ".chakra-hotspot-node {\n  pointer-events: auto;\n  position: absolute;"
);

fs.writeFileSync('css/style.css', code);
