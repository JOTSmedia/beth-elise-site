const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace("const eyeRadius = 31.0; // PART 3B: we will change this later", "const eyeRadius = aw * 0.41;");

fs.writeFileSync('js/main.js', code);
console.log('Eye radius fixed!');
