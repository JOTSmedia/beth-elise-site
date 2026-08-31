const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code += `
width: 0;
height: 0;
border-left: 8px solid transparent;
border-right: 8px solid transparent;
border-bottom: 14px solid rgba(16, 3, 30, 0.95);
border-top: none;
}

@media (max-width: 620px) {
  .beth-greeting {
    max-width: 210px;
    padding: 0.6rem 1rem 0.7rem;
  }
  .beth-greeting__text {
    font-size: 1.15rem;
  }
}
`;

fs.writeFileSync('css/style.css', code);
