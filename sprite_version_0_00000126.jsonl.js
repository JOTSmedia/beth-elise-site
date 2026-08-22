function drawHeroTinkerbellSprite' in line and 'drawWingSide' in line or 'avatar_wing_left' in line:
                    obj = json.loads(line)
                    tcs = obj.get('tool_calls', [])
                    for tc in tcs:
                        content = tc.get('args', {}).get('CodeContent') or tc.get('args', {}).get('ReplacementContent') or ''
                        if 'function drawHeroTinkerbellSprite' in content and len(content) > 3000:
                            print(f"FOUND sprite in {fpath}, len {len(content)}")
                            with open('extracted_full_sprite_renderer.js', 'w', encoding='utf-8') as out:
                                out.write(content)
                            break
    except:
        pass
EOF
python3 get_full_sprite_fn.py
rm get_full_sprite_fn.py
ls -lh extracted_full_sprite_renderer.js
