import re

with open('js/main.js', 'r') as f:
    js = f.read()

# Find the block where `gTxt.innerHTML = ...` adds the ✦ symbols
js = re.sub(
    r"let\s+cleanText\s*=\s*text\.replace\(/✦/g,\s*''\)\.trim\(\);\s*cleanText\s*=\s*formatAeyeBrandHtml\(cleanText\);\s*gTxt\.innerHTML\s*=\s*'✦\s*'\s*\+\s*cleanText\s*\+\s*'\s*✦';",
    r"let cleanText = formatAeyeBrandHtml(text.trim());\n        gTxt.innerHTML = cleanText;",
    js
)

with open('js/main.js', 'w') as f:
    f.write(js)
print("Reverted speech bubble text wrapping")
