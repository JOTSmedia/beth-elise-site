import json

found = []
with open('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        if '.beth-greeting' in line and '{' in line:
            obj = json.loads(line)
            content = obj.get('content', '')
            if content and '.beth-greeting' in content:
                # print a snippet
                idx = content.find('.beth-greeting')
                snippet = content[max(0, idx-50):idx+500]
                if "border:" in snippet or "font-family" in snippet or "color:" in snippet:
                    found.append(snippet)

# print the first 3 unique snippets
seen = set()
for s in found:
    if s not in seen:
        print("--- SNIPPET ---")
        print(s)
        seen.add(s)
        if len(seen) > 5:
            break
