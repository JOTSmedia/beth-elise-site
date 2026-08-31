const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /bgOffsetY = cH - 1080 \* bgS; \/\/ background-position: center bottom/g,
  `bgOffsetY = (cH - 1080 * bgS) * 0.5; // background-position: center center`
);

code = code.replace(
  /bgOffsetY = cH - 1080 \* bgS;\n        \}/g,
  `bgOffsetY = (cH - 1080 * bgS) * 0.5;\n        }`
);

fs.writeFileSync('js/main.js', code);
