import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

test_match = re.search(r'(\s*<!-- ✦ SUBMIT TESTIMONIAL MODAL ✦ -->\s*<div id="testimonial-modal".*?</div>\s*</div>\s*)', html, flags=re.DOTALL)
if test_match:
    test_str = test_match.group(1)
    html = html.replace(test_str, '\n')
    html = html.replace('<!-- ✦ SACRED CART DRAWER ✦ -->', test_str + '\n  <!-- ✦ SACRED CART DRAWER ✦ -->')
    print("Testimonial moved")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
