const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// The start and end of drawOrganicEye in current main.js
const regex = /function drawOrganicEye\(ctx, cx, cy, r, gazeX, gazeY, blinkPhase, pupilRadius, colors, now, isLocked = false\) \{[\s\S]*?\n    \}/;

const backupEye = fs.readFileSync('PURE_V50_BACKUP/GITHUB_UPLOAD/js/main.js', 'utf8');
const backupRegex = /function drawOrganicEye\(ctx, cx, cy, r, gazeX, gazeY, blinkPhase, pupilRadius, colors, now, isLocked = false\) \{[\s\S]*?\n    \}/;
const backupEyeMatch = backupRegex.exec(backupEye);

if (backupEyeMatch) {
  mainJs = mainJs.replace(regex, backupEyeMatch[0]);
  
  // Also fix the speech bubble
  mainJs = mainJs.replace(
    /tipIndex = 0;\n\s*showThoughtBubble\(\);/g,
    "// tipIndex = 0; showThoughtBubble(); removed so she stays quiet until interacted with"
  );
  
  fs.writeFileSync('js/main.js', mainJs);
  console.log("Success");
} else {
  console.log("Failed to find backup eye");
}
