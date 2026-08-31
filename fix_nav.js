const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// Global desktop nav height
code = code.replace(/--nav-height: 80px;/g, '--nav-height: 64px;');
// Tablet nav height
code = code.replace(/--nav-height: 72px;/g, '--nav-height: 60px;');
// Mobile nav height
code = code.replace(/--nav-height: 70px;/g, '--nav-height: 60px;');

fs.writeFileSync('css/style.css', code);
