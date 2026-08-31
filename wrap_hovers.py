import re

with open('css/style.css', 'r') as f:
    css = f.read()

# We will just do a surgical fix for the major buttons the user interacts with that get stuck.
# .assistant-avatar-btn:hover, .back-to-top-btn:hover, .chakra-emblem-btn:hover, .merch__card:hover, .aura-scan-btn:hover

targets = ['.assistant-avatar-btn:hover', '.back-to-top-btn:hover', '.chakra-emblem-btn:hover', '.merch__card:hover', '.aura-scan-btn:hover', '.cta-btn:hover', '.hero-cta:hover']

for target in targets:
    # Match target { ... }
    pattern = r"(" + target.replace('.', r'\.') + r"\s*\{[^}]*?\})"
    
    def repl(m):
        return f"@media (hover: hover) and (pointer: fine) {{\n  {m.group(1)}\n}}"
    
    css = re.sub(pattern, repl, css)

with open('css/style.css', 'w') as f:
    f.write(css)

print("Hovers wrapped!")
