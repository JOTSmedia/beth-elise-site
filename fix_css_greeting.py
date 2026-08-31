with open('css/style.css', 'r') as f:
    lines = f.readlines()

greeting_lines = []
new_lines = []
in_greeting = False

for i, line in enumerate(lines):
    # Lines 6253 to 6424 (0-indexed 6252 to 6423)
    if 6252 <= i <= 6423:
        # dedent by 2 spaces if it starts with them
        if line.startswith("  "):
            greeting_lines.append(line[2:])
        else:
            greeting_lines.append(line)
    else:
        new_lines.append(line)

new_lines.extend(["\n/* RESTORED BETH GREETING CSS */\n"])
new_lines.extend(greeting_lines)

with open('css/style.css', 'w') as f:
    f.writelines(new_lines)
