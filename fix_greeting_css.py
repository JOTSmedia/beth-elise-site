import re

with open('css/style.css', 'r') as f:
    css = f.read()

# For .beth-greeting
pattern = r"(\.beth-greeting\s*\{[^}]*?)(?=\})"
def repl(m):
    block = m.group(1)
    block = re.sub(r'transform:\s*[^;]+;', '', block)
    block = re.sub(r'transition:\s*[^;]+;', 'transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);', block)
    return block
css = re.sub(pattern, repl, css)

# For .beth-greeting.is-visible
pattern2 = r"(\.beth-greeting\.is-visible\s*\{[^}]*?)(?=\})"
def repl2(m):
    block = m.group(1)
    block = re.sub(r'transform:\s*[^;]+;', '', block)
    return block
css = re.sub(pattern2, repl2, css)

with open('css/style.css', 'w') as f:
    f.write(css)

print("Greeting CSS fixed!")
