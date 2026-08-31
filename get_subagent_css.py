import json

found = False
with open('/Users/bethrooney/.gemini/antigravity/brain/29501e84-daff-4208-85a7-6e5bdabba949/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        obj = json.loads(line)
        if 'tool_calls' in line and 'view_file' in line:
            pass
        if 'tool_responses' in line or ('type' in obj and obj['type'] == 'TOOL_RESPONSE'):
            content = obj.get('content', '')
            if 'beth-greeting' in content and 'z-index' in content:
                with open('subagent_css_block.txt', 'w') as out:
                    out.write(content)
                found = True
                break

if not found:
    with open('/Users/bethrooney/.gemini/antigravity/brain/cf4ee06e-75e5-433a-8aee-2b0428465559/.system_generated/logs/transcript_full.jsonl', 'r') as f:
        for line in f:
            obj = json.loads(line)
            content = obj.get('content', '')
            if 'beth-greeting' in content and 'z-index' in content:
                with open('subagent_css_block.txt', 'w') as out:
                    out.write(content)
                found = True
                break

if found:
    print("Found CSS in subagent transcript!")
