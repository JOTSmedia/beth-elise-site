const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');

// 1. Add cachedScrollY
code = code.replace("let cachedNavBottom = 75;", "let cachedNavBottom = 75;\n      let cachedScrollY = window.scrollY;\n      window.addEventListener('scroll', () => { cachedScrollY = window.scrollY; }, { passive: true });");

// 2. Add visualViewport
code = code.replace("const treePortalCache = { rawPts: [], pts: [] };", `      const treePortalCache = { rawPts: [], pts: [], anchorDocX: 0, anchorDocY: 0, needsRemeasure: true };
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
      }`);

// 3. Flag remeasure on resize
code = code.replace("updateHeroLayoutTargets(true);", "updateHeroLayoutTargets(true);\n        treePortalCache.needsRemeasure = true;");

// 4. Also flag remeasure on logo image load
code = code.replace("let cachedNavBottom = 75;", `let cachedNavBottom = 75;
      const logoImg = document.getElementById('hero-logo-img');
      if (logoImg) {
        logoImg.addEventListener('load', () => { treePortalCache.needsRemeasure = true; });
      }`);

// 5. Replace the target positioning block
const oldBlock = `        const isMobile = (w || window.innerWidth) < 600;
        const isTablet = (w || window.innerWidth) >= 600 && (w || window.innerWidth) < 1024;

        let targetCenterX = rawAvgX;
        let targetCenterY = rawAvgY;
        let portalScale = 1.0;

        if (isMobile) {
          // On mobile phones: place portal on top of the logo, exactly in the center!
          targetCenterX = (w || window.innerWidth) * 0.5;
          targetCenterY = (h || window.innerHeight) * 0.22;
          const heroLogo = cachedDOM.heroLogo;
          if (heroLogo) {
            const rect = heroLogo.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              targetCenterX = rect.left + (rect.width * 0.5);
              targetCenterY = rect.top + (rect.height * 0.5);
            }
          }
          portalScale = 0.68; // Gracefully scaled to fit mobile center
        } else if (isTablet) {
          // On portrait tablets: ensure comfortable padding from the left edge
          targetCenterX = Math.max(115, Math.min(rawAvgX, w * 0.26));
          targetCenterY = Math.max(180, Math.min(rawAvgY, h * 0.35));
          portalScale = 0.85;
        } else {
          // Desktop: ensure at least 75px margin from screen edges
          targetCenterX = Math.max(85, Math.min(rawAvgX, w - 85));
          targetCenterY = Math.max(100, Math.min(rawAvgY, h - 100));
          portalScale = 1.0;
        }`;

const newBlock = `        /* 
           7F TWO COORDINATE SYSTEMS:
           - Desktop uses background-image space (bgOffsetX / bgOffsetY / bgS from cover-fit).
           - Mobile uses document space anchored to the logo.
        */
        const isMobile = (w || window.innerWidth) < 600;
        const isTablet = (w || window.innerWidth) >= 600 && (w || window.innerWidth) < 1024;

        let targetCenterX = rawAvgX;
        let targetCenterY = rawAvgY;
        let portalScale = 1.0;

        // Option A: Hide on pinch zoom
        if (isMobile && typeof portalViewport.scale === 'number' && portalViewport.scale > 1.02) {
           return;
        }

        if (isMobile) {
          if (treePortalCache.needsRemeasure) {
             const anchor = document.getElementById('hero-logo-anchor');
             if (anchor) {
                const rect = anchor.getBoundingClientRect();
                if (rect.width > 0) {
                   treePortalCache.anchorDocX = rect.left + rect.width * 0.5 + window.scrollX;
                   treePortalCache.anchorDocY = rect.top + rect.height * 0.5 + window.scrollY;
                }
             }
             treePortalCache.needsRemeasure = false;
          }
          const sy = cachedScrollY;
          targetCenterX = treePortalCache.anchorDocX; // No horizontal scroll on mobile
          targetCenterY = treePortalCache.anchorDocY - sy;
          portalScale = 0.68;
        } else if (isTablet) {
          targetCenterX = Math.max(115, Math.min(rawAvgX, w * 0.26));
          targetCenterY = Math.max(180, Math.min(rawAvgY, h * 0.35));
          portalScale = 0.85;
        } else {
          targetCenterX = Math.max(85, Math.min(rawAvgX, w - 85));
          targetCenterY = Math.max(100, Math.min(rawAvgY, h - 100));
          portalScale = 1.0;
        }`;

code = code.replace(oldBlock, newBlock);

fs.writeFileSync('js/main.js', code);
console.log('Portal fixed!');
