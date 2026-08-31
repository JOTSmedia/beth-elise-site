const fs = require('fs');
let code = fs.readFileSync('css/style.css', 'utf8');

code = code.replace(
  /\.chakra-reading-popup \{\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate\(-50%, -50%\) scale\(0\.92\);\n  width: min\(92%, 580px\);\n  max-height: 88%;\n  overflow-y: auto; -webkit-overflow-scrolling: touch;\n  background: rgba\(14, 4, 30, 0\.92\);\n  backdrop-filter: blur\(20px\);\n  -webkit-backdrop-filter: blur\(20px\);\n  border-radius: 24px 6px 24px 6px;\n  border: 1\.5px solid rgba\(0, 229, 212, 0\.85\);\n  outline: 1\.5px solid rgba\(255, 215, 0, 0\.65\);\n  outline-offset: 4px;\n  box-shadow: 0 25px 70px rgba\(0, 0, 0, 0\.95\), 0 0 50px rgba\(0, 229, 212, 0\.65\);\n  padding: 1\.8rem 2rem;\n  display: flex;\n  flex-direction: column;\n  gap: 1\.1rem;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n  z-index: 50;\n  opacity: 0;\n  transition: opacity 0\.35s ease, transform 0\.35s cubic-bezier\(0\.16, 1, 0\.3, 1\);\n\}/g,
  `.chakra-reading-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.92);
  width: min(92%, 580px);
  max-height: 88%;
  overflow-y: auto; -webkit-overflow-scrolling: touch;
  background: rgba(14, 4, 30, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px 6px 24px 6px;
  border: 1.5px solid rgba(0, 229, 212, 0.85);
  outline: 1.5px solid rgba(255, 215, 0, 0.65);
  outline-offset: 4px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 229, 212, 0.65);
  padding: 1.8rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  z-index: 50;
  opacity: 0;
  pointer-events: none; /* FIX: Prevent invisible popup from swallowing clicks */
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}`
);

fs.writeFileSync('css/style.css', code);
