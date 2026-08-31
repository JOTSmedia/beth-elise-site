import re

with open('css/style.css', 'r') as f:
    css = f.read()

# Replace #hero-avatar-canvas block
avatar_pattern = r"(#hero-avatar-canvas\s*\{[^}]*?)(?=\})"
def avatar_repl(m):
    block = m.group(1)
    if "will-change" not in block:
        block += "  will-change: transform;\n  transform: translateZ(0);\n"
    return block
css = re.sub(avatar_pattern, avatar_repl, css)

# Replace .assistant-avatar-btn base class block
btn_pattern = r"(\.assistant-avatar-btn\s*\{[^}]*?)(?=\})"
def btn_repl(m):
    block = m.group(1)
    # only add if it's the main block and doesn't have it
    if "pointer-events: auto;" in block and "will-change" not in block:
        block += "  will-change: transform;\n  transform: translateZ(0);\n"
    return block
css = re.sub(btn_pattern, btn_repl, css)

with open('css/style.css', 'w') as f:
    f.write(css)

print("GPU Compositing added!")
