const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /readingModal\.classList\.add\('active', 'is-scanning-mode'\);\n          window\.lockBodyScroll\(\);\n/g,
  "readingModal.classList.add('active', 'is-scanning-mode');\n          // window.lockBodyScroll(); removed per user request\n"
);

code = code.replace(
  /readingModal\.classList\.remove\('active', 'is-scanning-mode', 'is-results-mode'\);\n          window\.unlockBodyScroll\(\);\n/g,
  "readingModal.classList.remove('active', 'is-scanning-mode', 'is-results-mode');\n          // window.unlockBodyScroll(); removed per user request\n"
);

fs.writeFileSync('js/main.js', code);
