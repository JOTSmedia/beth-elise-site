import re

with open('js/main.js', 'r') as f:
    js = f.read()

# Fix Cart state splice mutation
js = re.sub(
    r'window\.cartState\.splice\(idx,\s*1\);',
    r'window.cartState = window.cartState.filter((_, i) => i !== idx);',
    js
)

# Throttle visualViewport events
js = re.sub(
    r'function\s+onVV\(\)\s*\{\s*updateSacredAssistantSafeArea\(\);\s*\}',
    r'let vvTicking = false;\n    function onVV() {\n      if (!vvTicking) {\n        window.requestAnimationFrame(() => {\n          updateSacredAssistantSafeArea();\n          vvTicking = false;\n        });\n        vvTicking = true;\n      }\n    }',
    js
)

with open('js/main.js', 'w') as f:
    f.write(js)
print("Applied remaining JS Perf fixes")
