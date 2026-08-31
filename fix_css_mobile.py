import re

with open('css/style.css', 'r') as f:
    css = f.read()

# 1. Touch Target Violations
css = re.sub(r'(\.nav__links a\s*\{[^}]*padding:\s*)(0\.35rem 0\.6rem)([^}]*\})', r'\1\2; min-height: 44px; display: inline-flex; align-items: center\3', css)
css = re.sub(r'(\.back-to-top-btn\s*\{[^}]*width:\s*)38px([^}]*height:\s*)38px', r'\144px\244px', css)
css = re.sub(r'(width:\s*)36px(\s*!important;\s*height:\s*)36px(\s*!important;)', r'\g<1>44px\244px\3', css)
css = re.sub(r'(\.product-modal-close\s*\{[^}]*width:\s*)38px([^}]*height:\s*)38px', r'\144px\244px', css)
css = re.sub(r'(\.loc-modal-close\s*\{[^}]*width:\s*)38px([^}]*height:\s*)38px', r'\144px\244px', css)

# 2. Double Safe-Area Addition Bugs
css = css.replace(
    'calc(calc(112px + env(safe-area-inset-bottom, 0px)) + env(safe-area-inset-bottom, 0px))', 
    'calc(112px + env(safe-area-inset-bottom, 0px))'
)
css = css.replace(
    'calc(calc(84px + env(safe-area-inset-bottom, 0px)) !important + env(safe-area-inset-bottom, 0px))', 
    'calc(84px + env(safe-area-inset-bottom, 0px)) !important'
)
css = css.replace(
    'calc(calc(24px + env(safe-area-inset-bottom, 0px)) + env(safe-area-inset-bottom, 0px))', 
    'calc(24px + env(safe-area-inset-bottom, 0px))'
)
css = css.replace(
    'calc(calc(24px + env(safe-area-inset-right, 0px)) + env(safe-area-inset-right, 0px))', 
    'calc(24px + env(safe-area-inset-right, 0px))'
)

# 3. Overflow and Layout Traps
# Remove overflow-x: hidden from body
css = re.sub(r'(body\s*\{[^}]*)overflow-x:\s*hidden;([^}]*\})', r'\1\2', css)
# Add overflow-x to #main-content
css = css.replace('#main-content {', '#main-content {\n  overflow-x: hidden;')

css = css.replace('width: calc(100vw - 20px);', 'width: calc(100% - 20px);')

# 4. Modal Overflow
css = re.sub(r'(\.location-modal\s*\{)', r'\1\n  max-height: 90vh;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;', css)

with open('css/style.css', 'w') as f:
    f.write(css)

print("CSS fixes applied.")
