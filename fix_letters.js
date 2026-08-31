const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// Draw letters closer to the pill bar so they don't hit the nav
code = code.replace(
  /ctx\.fillText\(l\.char, l\.x, badgeTopY - 24\);/g,
  `ctx.fillText(l.char, l.x, badgeTopY - 14);`
);

fs.writeFileSync('js/main.js', code);
