import json

longest_css = ""
with open('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        obj = json.loads(line)
        content = obj.get('content', '')
        if '.beth-greeting {' in content:
            if len(content) > len(longest_css):
                longest_css = content

with open('found_css_full2.txt', 'w') as out:
    out.write(longest_css)
