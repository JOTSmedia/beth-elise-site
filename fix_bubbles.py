import re

with open('js/main.js', 'r') as f:
    js = f.read()

# 1. Remove speech bubble from State 10 (PERCHED_ON_AEYE)
js = re.sub(
    r'const msg = heroTinkerbell\.isFastScrolled[^;]+;\s*showBethSpeechBubble\(msg,\s*targetX,\s*targetY,\s*\'auto\'\);',
    r'// Removed speech bubble at end of Vanna White sequence as requested by user',
    js
)
js = re.sub(
    r'if\s*\(!heroTinkerbell\.greetShown\)\s*\{\s*heroTinkerbell\.greetShown\s*=\s*true;\s*const msg = heroTinkerbell\.isFastScrolled[^;]+;\s*showBethSpeechBubble\(msg,\s*heroTinkerbell\.x,\s*heroTinkerbell\.y,\s*\'auto\'\);\s*\}',
    r'if (!heroTinkerbell.greetShown) { heroTinkerbell.greetShown = true; }',
    js
)

with open('js/main.js', 'w') as f:
    f.write(js)
print("Removed Vanna White ending bubble.")
