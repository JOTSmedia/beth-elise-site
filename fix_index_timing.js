const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace("setTimeout(dismissPreloader, 3400);", "setTimeout(dismissPreloader, 1400);");
html = html.replace("setTimeout(() => {", "setTimeout(() => {"); // wait, index.html ~553 inner setTimeout 750

// Let's find the inner setTimeout
html = html.replace("setTimeout(() => {\n        document.body.classList.remove('no-scroll');\n        preloader.style.display = 'none';", "setTimeout(() => {\n        document.body.classList.remove('no-scroll');\n        preloader.style.display = 'none';");

fs.writeFileSync('index.html', html);
