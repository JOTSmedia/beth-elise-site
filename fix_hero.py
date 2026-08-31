import re

with open('css/style.css', 'r') as f:
    css = f.read()

replacement = """.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: calc(var(--nav-height) + 2rem) 2rem 4rem;
  overflow: hidden;
  z-index: 2;
  background: #090014;
}"""

css = re.sub(r'\.hero\s*\{[^}]*z-index:\s*2;\s*background:\s*#090014;\s*\}', replacement, css)

with open('css/style.css', 'w') as f:
    f.write(css)

