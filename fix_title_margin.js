const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

// Add a spacer margin to the top of the title to ensure it clears the absolute pill bar on short screens
code = code.replace(
  /\.hero__title \{ \n    font-size: clamp\(2\.2rem, 6\.5vw, 3\.4rem\) !important; \n    margin: 0 0 clamp\(0\.2rem, 0\.6vh, 0\.5rem\) !important; \n  \}/g,
  `.hero__title { 
    font-size: clamp(2.2rem, 6.5vw, 3.4rem) !important; 
    margin: 80px 0 clamp(0.2rem, 0.6vh, 0.5rem) !important; 
  }`
);

// We need to find all instances of .hero__title margin and add a top margin.
// Actually, earlier I saw there was NO base styling for .hero__title!
// Let's just add it to .hero__content as padding-top!
code = code.replace(
  /\.hero__content \{\n  position: relative;\n  z-index: 3;\n  max-width: 880px;\n  padding: 1\.5rem 1rem;/g,
  `.hero__content {
  position: relative;
  z-index: 3;
  max-width: 880px;
  padding: 6rem 1rem 1.5rem; /* Large top padding to clear absolute pill bar */`
);

fs.writeFileSync('css/style.css', code);
