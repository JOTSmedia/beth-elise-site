const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/main.js', 'utf8');

const idRegex = /id=["']([^"']+)["']/g;
const classRegex = /class=["']([^"']+)["']/g;

const htmlIds = new Set();
let match;
while ((match = idRegex.exec(html)) !== null) {
  htmlIds.add(match[1]);
}

const htmlClasses = new Set();
while ((match = classRegex.exec(html)) !== null) {
  match[1].split(/\s+/).forEach(c => htmlClasses.add(c));
}

const getByIdRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
while ((match = getByIdRegex.exec(js)) !== null) {
  if (!htmlIds.has(match[1])) {
    console.log('Missing ID: ' + match[1]);
  }
}

