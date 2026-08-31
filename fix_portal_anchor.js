const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace logo image
const targetHtml = `<img src="images/beth_elise_brand_logo_gold_hero.webp" alt="Beth Elise Psychic Medium" class="hero__logo-img" width="600" height="200" id="hero-logo-img">`;
const newHtml = `<div class="hero__logo-anchor" id="hero-logo-anchor"><img src="images/beth_elise_brand_logo_gold_hero.webp" alt="Beth Elise Psychic Medium" class="hero__logo-img" width="600" height="200" id="hero-logo-img"></div>`;
html = html.replace(targetHtml, newHtml);

fs.writeFileSync('index.html', html);
console.log('HTML anchor added!');
