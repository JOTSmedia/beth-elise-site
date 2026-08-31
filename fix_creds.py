with open('css/style.css', 'r') as f:
    css = f.read()

mobile_media = "@media (max-width: 768px) {\n"

# Hide credential dividers on mobile so flex-wrap works neatly
if ".credential-divider { display: none; }" not in css:
    css = css.replace('@media (max-width: 768px) {', '@media (max-width: 768px) {\n  .credential-divider { display: none; }\n  .hero__credentials { flex-direction: column; gap: 0.8rem; }', 1)

with open('css/style.css', 'w') as f:
    f.write(css)

print("Fixed credentials for mobile.")
