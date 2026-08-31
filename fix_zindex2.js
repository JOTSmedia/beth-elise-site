const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf-8');

css = css.replace('z-index: 95000;\n  background: transparent;\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;\n  z-index: 20000;', 'z-index: 95000;\n  background: transparent;\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;');

fs.writeFileSync('css/style.css', css);
console.log("Fixed double z-index");
