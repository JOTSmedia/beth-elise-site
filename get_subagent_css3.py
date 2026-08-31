import json
import glob

files = glob.glob('/Users/bethrooney/.gemini/antigravity/brain/*/.system_generated/logs/transcript_full.jsonl')
for file in files:
    with open(file, 'r') as f:
        for line in f:
            obj = json.loads(line)
            if 'tool_responses' in line or ('type' in obj and obj['type'] == 'TOOL_RESPONSE'):
                content = obj.get('content', '')
                if '.beth-greeting__text {' in content:
                    idx = content.find('.beth-greeting__text {')
                    print(content[max(0, idx-100):idx+500])
                    print("---")
