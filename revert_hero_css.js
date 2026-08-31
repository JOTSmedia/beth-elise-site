const fs = require('fs');

let currentCSS = fs.readFileSync('css/style.css', 'utf8');
let backupCSS = fs.readFileSync('PURE_V50_BACKUP/GITHUB_UPLOAD/css/style.css', 'utf8');

function extractBlock(css, selector) {
  const regex = new RegExp(selector.replace(/\./g, '\\.') + '\\s*\\{([\\s\\S]*?)\\}');
  const match = css.match(regex);
  return match ? match[0] : null;
}

const blocksToRevert = [
  '.hero',
  '.hero__content',
  '.hero__logo-img',
  '.hero__tagline-pill'
];

for (const block of blocksToRevert) {
  const currentBlock = extractBlock(currentCSS, block);
  const backupBlock = extractBlock(backupCSS, block);
  
  if (currentBlock && backupBlock) {
    currentCSS = currentCSS.replace(currentBlock, backupBlock);
  }
}

// Revert mobile blocks manually with regex replacements for safety
// 992px breakpoint
currentCSS = currentCSS.replace(
  /\.hero \{\s*min-height: 100dvh !important;[\s\S]*?padding-right: clamp\(0\.75rem, 3vw, 1\.5rem\) !important;\s*\}/,
  `.hero { \n    min-height: 100dvh !important;\n    min-height: 100vh !important;\n    display: flex !important;\n    flex-direction: column !important;\n    align-items: center !important;\n    justify-content: flex-start !important;\n    padding-top: calc(var(--nav-height) + clamp(0.4rem, 1.8vh, 1.25rem)) !important; \n    padding-bottom: clamp(1.5rem, 4vh, 3rem) !important;\n    padding-left: clamp(0.75rem, 3vw, 1.5rem) !important;\n    padding-right: clamp(0.75rem, 3vw, 1.5rem) !important;\n  }`
);

currentCSS = currentCSS.replace(
  /\.hero__logo-img \{\s*max-width: clamp\(280px, 78vw, 420px\) !important;\s*width: 88vw !important;\s*margin: -20px auto clamp\(0\.85rem, 2\.0vh, 1\.25rem\) !important;\s*\}/,
  `.hero__logo-img {\n    max-width: clamp(280px, 78vw, 420px) !important;\n    width: 88vw !important;\n    margin: clamp(0.15rem, 0.5vh, 0.4rem) auto clamp(0.35rem, 1.0vh, 0.85rem) !important;\n  }`
);

// 480px breakpoint
currentCSS = currentCSS.replace(
  /\.hero \{\s*padding-top: calc\(var\(--nav-height\) - 1\.5rem\) !important; \s*padding-bottom: clamp\(1\.25rem, 3vh, 2\.5rem\) !important;\s*\}/,
  `.hero { \n    padding-top: calc(var(--nav-height) + clamp(0.30rem, 1.5vh, 0.85rem)) !important; \n    padding-bottom: clamp(1.25rem, 3vh, 2.5rem) !important;\n  }`
);

currentCSS = currentCSS.replace(
  /\.hero__logo-img \{\s*max-width: clamp\(250px, 84vw, 320px\) !important;\s*width: 86vw !important;\s*margin: -15px auto clamp\(0\.65rem, 1\.5vh, 1\.0rem\) !important;\s*\}/,
  `.hero__logo-img {\n    max-width: clamp(250px, 84vw, 320px) !important;\n    width: 86vw !important;\n    margin: clamp(0.10rem, 0.4vh, 0.3rem) auto clamp(0.25rem, 0.8vh, 0.65rem) !important;\n  }`
);

fs.writeFileSync('css/style.css', currentCSS);
