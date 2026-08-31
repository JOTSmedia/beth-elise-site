import json
import re

css = ""
with open('/Users/bethrooney/.gemini/antigravity/brain/29501e84-daff-4208-85a7-6e5bdabba949/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        obj = json.loads(line)
        content = obj.get('content', '')
        if '.beth-greeting {' in content and 'z-index' in content:
            # Maybe it's a file read output
            print("Found in subagent 1")
            # save it to a file for inspection
            with open('found_css_subagent1.txt', 'w') as out:
                out.write(content)
            break
