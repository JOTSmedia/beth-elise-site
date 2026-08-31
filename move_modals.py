import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Match the product modal
prod_match = re.search(r'(\s*<!-- ✦ SACRED PRODUCT DETAIL LIGHTBOX MODAL ✦ -->\s*<div class="product-modal-backdrop".*?<!-- ✦ UPCOMING SACRED EVENTS & LIVE APPEARANCES ✦ -->)', html, flags=re.DOTALL)
if prod_match:
    prod_html = re.search(r'(\s*<!-- ✦ SACRED PRODUCT DETAIL LIGHTBOX MODAL ✦ -->.*?</div>\s*</div>\s*</div>\s*</div>\s*)', html, flags=re.DOTALL)
    if prod_html:
        prod_str = prod_html.group(1)
        html = html.replace(prod_str, '\n')
        # Insert before Cart Drawer
        html = html.replace('<!-- ✦ SACRED CART DRAWER ✦ -->', prod_str + '\n  <!-- ✦ SACRED CART DRAWER ✦ -->')

# Match the location modal
loc_match = re.search(r'(\s*<!-- ✦ LOCATION MODAL ✦ -->\s*<div id="location-modal-backdrop".*?<!-- ✦ SACRED SERVICES & OFFERINGS ✦ -->)', html, flags=re.DOTALL)
if loc_match:
    loc_html = re.search(r'(\s*<!-- ✦ LOCATION MODAL ✦ -->\s*<div id="location-modal-backdrop".*?</div>\s*</div>\s*</div>\s*)', html, flags=re.DOTALL)
    if loc_html:
        loc_str = loc_html.group(1)
        html = html.replace(loc_str, '\n')
        html = html.replace('<!-- ✦ SACRED CART DRAWER ✦ -->', loc_str + '\n  <!-- ✦ SACRED CART DRAWER ✦ -->')

# Match the testimonial modal
test_match = re.search(r'(\s*<!-- ✦ TESTIMONIAL VIDEO MODAL ✦ -->\s*<div id="testimonial-modal".*?<!-- ✦ CONNECT & BOOK ✦ -->)', html, flags=re.DOTALL)
if test_match:
    test_html = re.search(r'(\s*<!-- ✦ TESTIMONIAL VIDEO MODAL ✦ -->\s*<div id="testimonial-modal".*?</div>\s*</div>\s*)', html, flags=re.DOTALL)
    if test_html:
        test_str = test_html.group(1)
        html = html.replace(test_str, '\n')
        html = html.replace('<!-- ✦ SACRED CART DRAWER ✦ -->', test_str + '\n  <!-- ✦ SACRED CART DRAWER ✦ -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Modals moved successfully.")
