const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const js = fs.readFileSync('js/main.js', 'utf8');

const classRegex = /class=["']([^"']+)["']/g;
const htmlClasses = new Set();
let match;
while ((match = classRegex.exec(html)) !== null) {
  match[1].split(/\s+/).forEach(c => htmlClasses.add(c));
}

const querySelRegex = /querySelector\(['"]\.([^'"]+)['"]\)/g;
while ((match = querySelRegex.exec(js)) !== null) {
  const cls = match[1].split(/[ .:]+/)[0]; 
  if (!htmlClasses.has(cls)) {
    console.log('Missing Class: ' + cls);
  }
}
