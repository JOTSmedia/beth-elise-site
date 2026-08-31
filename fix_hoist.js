const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

const cacheStr = `            const treePortalCache = { rawPts: [], pts: [], anchorDocX: 0, anchorDocY: 0, needsRemeasure: true };
      const portalViewport = { scale: 1.0, offsetLeft: 0, offsetTop: 0 };
      if (window.visualViewport) {
        const onVV = () => {
          portalViewport.scale = window.visualViewport.scale;
          portalViewport.offsetLeft = window.visualViewport.offsetLeft;
          portalViewport.offsetTop = window.visualViewport.offsetTop;
          treePortalCache.needsRemeasure = true;
        };
        window.visualViewport.addEventListener('resize', onVV, { passive: true });
        window.visualViewport.addEventListener('scroll', onVV, { passive: true });
        onVV();
      }`;

code = code.replace(cacheStr, "");

code = code.replace("const meteors = [];", "const meteors = [];\n" + cacheStr);

fs.writeFileSync('js/main.js', code);
console.log('Hoisted!');
