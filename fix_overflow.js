const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(/  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;\n/g, "");

fs.writeFileSync('css/style.css', code);
