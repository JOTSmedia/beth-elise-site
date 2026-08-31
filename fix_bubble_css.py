import re

with open('css/style.css', 'r') as f:
    css = f.read()

# I will replace everything from `.beth-greeting {` down to right before `/* ===== PICO ICONS`
start_idx = css.find('.beth-greeting {\n  position: fixed;\n  z-index: 40000 !important;')
if start_idx == -1:
    start_idx = css.find('.beth-greeting {\n  position: fixed;')

end_idx = css.find('/* ===== PICO ICONS')

if start_idx != -1 and end_idx != -1:
    new_bubble_css = """
.beth-greeting {
  --beth-bubble-ink: #3E5FC4;
  --beth-bubble-fill: rgba(255, 255, 255, 0.90);

  position: fixed;
  z-index: 40000 !important;
  width: max-content;
  max-width: 186px;
  padding: 0.55rem 0.8rem 0.6rem;
  background: var(--beth-bubble-fill);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 2.5px solid var(--beth-bubble-ink);
  border-radius: 18px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.55),
              0 10px 30px rgba(31, 0, 56, 0.45),
              0 0 26px rgba(114, 137, 218, 0.45);
  opacity: 0;
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
}
.beth-greeting.is-visible {
  opacity: 1;
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
  top: 2px;
  right: 5px;
  background: none;
  border: none;
  color: var(--beth-bubble-ink);
  font-size: 1.2rem;
  line-height: 1;
  padding: 2px 6px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 5;
}

.beth-greeting__close:hover {
  opacity: 1;
  transform: scale(1.2);
}

.beth-greeting__text {
  font-family: 'Patrick Hand', var(--font-handwriting, sans-serif);
  font-size: 1.25rem;
  color: var(--beth-bubble-ink);
  font-weight: 400;
  line-height: 1.15;
  text-transform: none !important;
  font-variant: normal !important;
  font-variant-caps: normal !important;
  letter-spacing: 0.01em;
  text-shadow: none;
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
  border-top: 16px solid var(--beth-bubble-ink);
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
  border-top: 14px solid #FFFFFF;
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
  border-left: 16px solid var(--beth-bubble-ink);
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
  border-left: 14px solid #FFFFFF;
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
  border-right: 16px solid var(--beth-bubble-ink);
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
  border-right: 14px solid #FFFFFF;
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
  border-bottom: 16px solid var(--beth-bubble-ink);
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
  border-bottom: 14px solid #FFFFFF;
  border-top: none;
}

@media (max-width: 620px) {
  .beth-greeting {
    max-width: 180px;
    padding: 0.5rem 0.75rem;
  }
  .beth-greeting__text {
    font-size: 1.05rem;
  }
}
"""
    css = css[:start_idx] + new_bubble_css + css[end_idx:]
    with open('css/style.css', 'w') as f:
        f.write(css)
    print("Reverted .beth-greeting CSS")
else:
    print("Could not find start or end block")
