import re

with open('css/style.css', 'r') as f:
    css = f.read()

# For .sacred-assistant
pattern = r"(\.sacred-assistant\s*\{[^}]*?)(?=\})"
def repl(m):
    block = m.group(1)
    block = re.sub(r'bottom:\s*([^;]+);', r'bottom: calc(\1 + env(safe-area-inset-bottom, 0px));', block)
    block = re.sub(r'right:\s*([^;]+);', r'right: calc(\1 + env(safe-area-inset-right, 0px));', block)
    return block
css = re.sub(pattern, repl, css)

# For .back-to-top-btn
pattern2 = r"(\.back-to-top-btn\s*\{[^}]*?)(?=\})"
def repl2(m):
    block = m.group(1)
    block = re.sub(r'bottom:\s*([^;]+);', r'bottom: calc(\1 + env(safe-area-inset-bottom, 0px));', block)
    return block
css = re.sub(pattern2, repl2, css)

with open('css/style.css', 'w') as f:
    f.write(css)

print("Safe area fixed!")
