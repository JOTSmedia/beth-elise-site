import json, glob, os

files = sorted(glob.glob('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/.system_generated/logs/chunks/transcript_full/*.jsonl'), key=os.path.getmtime, reverse=True)

found_step = None
for fpath in files:
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            for line in f:
                if 'STRUT_ON_BADGE' in line and 'OLYMPIC_DIVE' in line and 'hero-speech-bubble-1' in line:
                    print(f"Found match in {fpath}")
                    obj = json.loads(line)
                    # Let's inspect content or tool calls
                    c_str = json.dumps(obj)
                    if 'updateAndRenderHeroTinkerbell' in c_str and len(c_str) > 10000:
                        found_step = obj
                        break
        if found_step:
            break
    except Exception as e:
        pass

if found_step:
    print("Found complete step with all choreography!")
    with open('extracted_choreography_step.json', 'w', encoding='utf-8') as out:
        json.dump(found_step, out)
else:
    print("Not found in chunks, searching main transcript.jsonl...")
    with open('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if 'STRUT_ON_BADGE' in line and 'OLYMPIC_DIVE' in line and 'PERCHED_ON_AEYE' in line:
                print("Found match in transcript.jsonl!")
                with open('extracted_choreography_step.json', 'w', encoding='utf-8') as out:
                    out.write(line)
                break
