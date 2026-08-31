const fs = require('fs');
let code = fs.readFileSync('js/main.js', 'utf8');
code = code.replace("if (aCtx if (ctx && ctx.setTransform) {if (ctx && ctx.setTransform) { aCtx.setTransform) {", "if (aCtx && aCtx.setTransform) {");
fs.writeFileSync('js/main.js', code);
