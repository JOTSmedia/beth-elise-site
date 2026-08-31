const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetHtml = `<img src="images/logo.webp" onerror="this.onerror=null;this.src='images/logo.png'" alt="Beth Elise Psychic Medium" class="hero__logo-img"  loading="lazy" decoding="async" width="640" height="429">`;
const newHtml = `<div class="hero__logo-anchor" id="hero-logo-anchor"><img src="images/logo.webp" onerror="this.onerror=null;this.src='images/logo.png'" alt="Beth Elise Psychic Medium" class="hero__logo-img"  loading="lazy" decoding="async" width="640" height="429"></div>`;

html = html.replace(targetHtml, newHtml);
fs.writeFileSync('index.html', html);
console.log('HTML anchor fixed!');
