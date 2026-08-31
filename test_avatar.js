const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let style = fs.readFileSync('css/style.css', 'utf8');
let main = fs.readFileSync('js/main.js', 'utf8');

const regex = /updateAndRenderHeroTinkerbell/;
global.console.log("updateAndRenderHeroTinkerbell present in main.js?", regex.test(main));

const aCtxRegex = /const aCtx = heroAvatarCanvas.getContext\('2d', \{ alpha: true \}\);/;
global.console.log("aCtx present in main.js?", aCtxRegex.test(main));

const canvasHtmlRegex = /<canvas id="hero-avatar-canvas" aria-hidden="true"><\/canvas>/;
global.console.log("hero-avatar-canvas HTML present?", canvasHtmlRegex.test(html));
