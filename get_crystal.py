import json

with open('/Users/bethrooney/.gemini/antigravity/brain/29501e84-daff-4208-85a7-6e5bdabba949/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        obj = json.loads(line)
        if 'tool_calls' in line:
            for call in obj.get('tool_calls', []):
                if call['function']['name'] == 'replace_file_content' or call['function']['name'] == 'run_command':
                    args = call['function']['arguments']
                    if 'crystal' in args:
                        print("FOUND CRYSTAL CHANGE!")
                        print(args)
