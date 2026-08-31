const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

code = code.replace(
  /\/\/ Ensure Tree Portal still fires if user scrolls early\n\s*heroTinkerbell\.startX = heroTinkerbell\.x;/g,
  `// Ensure Tree Portal still fires if user scrolls early
          if (typeof window.startTreePortalSequence === 'function') window.startTreePortalSequence();
          heroTinkerbell.startX = heroTinkerbell.x;`
);

fs.writeFileSync('js/main.js', code);
