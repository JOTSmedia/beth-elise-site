import json

found_css = ""
with open('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        obj = json.loads(line)
        content = obj.get('content', '')
        if '/* =====================================================\n   BETH ELISE' in content:
            # We probably found a full cat of the file!
            print("Found full CSS!")
            with open('found_css_full.txt', 'w') as out:
                out.write(content)
            break
