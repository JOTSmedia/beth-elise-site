const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf-8');

css = css.replace('pointer-events: none; z-index: 50000; /* Highest layer', 'pointer-events: none; z-index: 999999; /* Highest layer');

fs.writeFileSync('css/style.css', css);
console.log("Fixed canvas z-index to be above modals");
