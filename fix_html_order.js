const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const taglinePill = `      <div class="hero__tagline-pill">
        <span>✦</span> Intuitive Wisdom & Energy Healing <span>✦</span>
      </div>`;

const logo = `      <h1 class="hero__title">
        <img src="images/logo.webp" onerror="this.onerror=null;this.src='images/logo.png'" alt="Beth Elise Psychic Medium" class="hero__logo-img"  loading="lazy" decoding="async" width="640" height="429">
      </h1>`;

// Remove tagline pill
code = code.replace(taglinePill + '\n\n', '');

// Insert it right after the logo
code = code.replace(logo, logo + '\n\n' + taglinePill);

fs.writeFileSync('index.html', code);
