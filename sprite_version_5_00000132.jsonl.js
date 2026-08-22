function drawHeroTinkerbellSprite' in line:
                try:
                    obj = json.loads(line)
                    tcs = obj.get('tool_calls', [])
                    for tc in tcs:
                        content = tc.get('args', {}).get('CodeContent', '') or tc.get('args', {}).get('ReplacementContent', '') or tc.get('args', {}).get('CommandLine', '')
                        if 'function drawHeroTinkerbellSprite' in content:
                            s = content.find('function drawHeroTinkerbellSprite')
                            e = content.find('