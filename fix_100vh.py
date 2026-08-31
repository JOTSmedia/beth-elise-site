import re

with open('css/style.css', 'r') as f:
    css = f.read()

# Replace all occurrences of height: 100vh;
css = re.sub(r'height:\s*100vh\s*;', 'height: 100vh;\n  height: 100dvh;', css)
css = re.sub(r'min-height:\s*100vh\s*;', 'min-height: 100vh;\n  min-height: 100dvh;', css)

with open('css/style.css', 'w') as f:
    f.write(css)

print("100vh fixed!")
