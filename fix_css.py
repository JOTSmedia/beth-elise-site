import re

with open('css/style.css', 'r') as f:
    css = f.read()

# I will find the #assistant-avatar-canvas and add border-radius: 50%
if '#assistant-avatar-canvas {' in css:
    css = re.sub(r'(#assistant-avatar-canvas \{[\s\S]*?z-index:\s*10;)', r'\1\n  border-radius: 50%;', css)

# Fix the duplicate assistant-sparkle-dot and pulse-ring
# I will just write a regex to find all of them and unify them at the bottom.

