const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// Remove widget.classList...('aeye-splash-active') completely
code = code.replace(/widget\.classList\.remove\('aeye-splash-active'\);/g, '');
code = code.replace(/widget\.classList\.add\('aeye-splash-active'\);/g, '');

// Rename all remaining aeye-splash-active to splash-active
code = code.replace(/'aeye-splash-active'/g, "'splash-active'");

fs.writeFileSync('js/main.js', code);
console.log('Splash active fixed!');
