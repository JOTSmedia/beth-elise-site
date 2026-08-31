import re

with open('css/style.css', 'r') as f:
    css = f.read()

# Make aura reading modal safe for mobile scrolling
css = re.sub(
    r'(\.aura-reading-modal\s*\{[^}]*)align-items:\s*center;([^}]*\})',
    r'\1align-items: center; overflow-y: auto; -webkit-overflow-scrolling: touch;\2',
    css
)

# Replace 'align-items: center;' with 'align-items: flex-start;' on mobile if it overflows?
# Or just ensure the padding top is respected by doing 'align-items: safe center;' ? 'safe center' is not supported in all older browsers.
# Let's change `align-items: center` to just standard block layout with auto margins, or flex-start with margin: auto.
css = css.replace('align-items: center;\n  justify-content: center;', 'align-items: center;\n  justify-content: center;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch;')

with open('css/style.css', 'w') as f:
    f.write(css)

print("Aura modal overflow fixed")
