import json
import glob

files = glob.glob('/Users/bethrooney/.gemini/antigravity/brain/*/.system_generated/logs/transcript_full.jsonl')
for file in files:
    with open(file, 'r') as f:
        for line in f:
            obj = json.loads(line)
            content = obj.get('content', '')
            if '.beth-greeting__arrow {' in content and '16, 3, 30' not in content:
                # The arrow styles might not have the background color explicitly in that snippet.
                idx = content.find('.beth-greeting__arrow {')
                print("FOUND!")
                print(content[max(0, idx-50):idx+2500])
                break
