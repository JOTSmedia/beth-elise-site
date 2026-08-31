import json
import glob

files = glob.glob('/Users/bethrooney/.gemini/antigravity/brain/*/.system_generated/logs/transcript_full.jsonl')
for file in files:
    with open(file, 'r') as f:
        for line in f:
            obj = json.loads(line)
            content = obj.get('content', '')
            if '.beth-greeting' in content and 'color:' in content:
                print("FOUND!")
                idx = content.find('.beth-greeting')
                print(content[max(0, idx-50):idx+500])
                break
