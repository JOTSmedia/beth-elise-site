import json
import glob

files = glob.glob('/Users/bethrooney/.gemini/antigravity/brain/*/.system_generated/logs/transcript_full.jsonl')
for file in files:
    with open(file, 'r') as f:
        for line in f:
            obj = json.loads(line)
            content = obj.get('content', '')
            if '.beth-greeting__text' in content and 'font-size' in content and '16, 3, 30' in content:
                print("FOUND TEXT!")
                idx = content.find('.beth-greeting__text')
                print(content[max(0, idx-50):idx+500])
                break
