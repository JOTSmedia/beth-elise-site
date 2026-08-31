const fs = require('fs');
let css = fs.readFileSync('css/style.css', 'utf-8');

const start_idx = css.indexOf('.beth-greeting {\n');
const end_idx = css.indexOf('/* ===== PICO ICONS:');

const replacement = `.beth-greeting {
  position: fixed;
  z-index: 9999999 !important;
  width: max-content;
  max-width: 320px;
  padding: 0.85rem 1.6rem 0.9rem 1.35rem;
  background: rgba(16, 3, 30, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1.5px solid rgba(0, 229, 212, 0.90);
  border-radius: 22px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.9),
              0 0 28px rgba(0, 229, 212, 0.55),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
  opacity: 0;
  transform: translateY(8px) scale(0.94);
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
  -webkit-font-smoothing: antialiased;
}
.beth-greeting.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.beth-greeting[hidden] {
  display: none;
}

.beth-greeting--single-line {
  max-width: min(94vw, 440px) !important;
  white-space: nowrap !important;
}

.beth-greeting__close {
  position: absolute;
  top: 5px;
  right: 8px;
  background: none;
  border: none;
  color: rgba(0, 255, 200, 0.85);
  font-size: 1.25rem;
  line-height: 1;
  padding: 2px 6px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 5;
}

.beth-greeting__close:hover {
  opacity: 1;
  transform: scale(1.1);
}

.beth-greeting__text {
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1.4;
  color: #FFFFFF;
  text-align: center;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9);
  text-transform: uppercase !important;
  font-variant-caps: all-small-caps;
  letter-spacing: 0.06em;
  margin: 0;
  text-wrap: balance;
}

.beth-greeting--single-line .beth-greeting__text {
  white-space: nowrap !important;
  text-wrap: nowrap !important;
}

/* Dynamic pointed bubble tail */
.beth-greeting__arrow {
  position: absolute;
  width: 0;
  height: 0;
}

.beth-greeting--bottom .beth-greeting__arrow,
.beth-greeting:not([class*="beth-greeting--"]) .beth-greeting__arrow {
  bottom: -16px;
  top: auto;
  left: var(--arrow-pos, 50%);
  right: auto;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 16px solid rgba(0, 229, 212, 0.90);
  border-bottom: none;
}
.beth-greeting--bottom .beth-greeting__arrow::after,
.beth-greeting:not([class*="beth-greeting--"]) .beth-greeting__arrow::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: -8px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 14px solid rgba(16, 3, 30, 0.95);
  border-bottom: none;
}

.beth-greeting--right .beth-greeting__arrow {
  right: -16px;
  left: auto;
  top: var(--arrow-pos, 50%);
  bottom: auto;
  transform: translateY(-50%);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid rgba(0, 229, 212, 0.90);
  border-right: none;
}
.beth-greeting--right .beth-greeting__arrow::after {
  content: '';
  position: absolute;
  right: 3px;
  top: -8px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 14px solid rgba(16, 3, 30, 0.95);
  border-right: none;
}

.beth-greeting--left .beth-greeting__arrow {
  left: -16px;
  right: auto;
  top: var(--arrow-pos, 50%);
  bottom: auto;
  transform: translateY(-50%);
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 16px solid rgba(0, 229, 212, 0.90);
  border-left: none;
}
.beth-greeting--left .beth-greeting__arrow::after {
  content: '';
  position: absolute;
  left: 3px;
  top: -8px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 14px solid rgba(16, 3, 30, 0.95);
  border-left: none;
}

.beth-greeting--top .beth-greeting__arrow {
  top: -16px;
  bottom: auto;
  left: var(--arrow-pos, 50%);
  right: auto;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 16px solid rgba(0, 229, 212, 0.90);
  border-top: none;
}
.beth-greeting--top .beth-greeting__arrow::after {
  content: '';
  position: absolute;
  top: 3px;
  left: -8px;
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

css = css.slice(0, start_idx) + replacement + '\n' + css.slice(end_idx);
fs.writeFileSync('css/style.css', css);
console.log("Reverted speech bubble style.");
