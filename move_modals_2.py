import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Match the location modal
loc_match = re.search(r'(\s*<!-- ✦ CELESTIAL LOCATION POP-UP MODAL ✦ -->\s*<div id="location-modal-backdrop".*?</div>\s*</div>\s*</div>\s*)', html, flags=re.DOTALL)
if loc_match:
    loc_str = loc_match.group(1)
    html = html.replace(loc_str, '\n')
    html = html.replace('<!-- ✦ SACRED CART DRAWER ✦ -->', loc_str + '\n  <!-- ✦ SACRED CART DRAWER ✦ -->')
    print("Location moved")

# Match the testimonial modal
test_match = re.search(r'(\s*<!-- ✦ TESTIMONIAL VIDEO MODAL ✦ -->\s*<div id="testimonial-modal".*?</div>\s*</div>\s*)', html, flags=re.DOTALL)
if test_match:
    test_str = test_match.group(1)
    html = html.replace(test_str, '\n')
    html = html.replace('<!-- ✦ SACRED CART DRAWER ✦ -->', test_str + '\n  <!-- ✦ SACRED CART DRAWER ✦ -->')
    print("Testimonial moved")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
