from PIL import Image
img = Image.open('images/logo.webp')
print(f"Size: {img.size}")
bbox = img.getbbox()
print(f"Bounding box (non-transparent): {bbox}")
