import json

with open('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        obj = json.loads(line)
        if 'tool_responses' in line or ('type' in obj and obj['type'] == 'TOOL_RESPONSE'):
            content = obj.get('content', '')
            if 'heroTinkerbell.edgePauseTime >=' in content and 'heroTinkerbell.state = \'FLYING_TO_AEYE\';' in content:
                print(content[max(0, content.find('heroTinkerbell.edgePauseTime >=')-100):content.find('heroTinkerbell.edgePauseTime >=')+500])
