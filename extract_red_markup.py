import struct, zlib, math, json

with open('/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/.user_uploaded/media_1787384657222.png', 'rb') as f:
    data = f.read()

pos = 8
idat = b''
w, h = 0, 0
while pos < len(data):
    length = struct.unpack('>I', data[pos:pos+4])[0]
    chunk_type = data[pos+4:pos+8]
    chunk_data = data[pos+8:pos+8+length]
    pos += 8 + length + 4
    if chunk_type == b'IHDR':
        w, h, bitd, colort, compm, filterm, interm = struct.unpack('>IIBBBBB', chunk_data)
    elif chunk_type == b'IDAT':
        idat += chunk_data

decomp = zlib.decompress(idat)
bpp = 3 if colort == 2 else 4
stride = 1 + w * bpp
print(f"Screenshot dimensions: {w}x{h}")

# The user drew a red marker loop!
# Red color characteristics: High Red (r > 150), Low Green (g < 60), Low Blue (b < 60)
red_pixels = []
for y in range(h):
    for x in range(w):
        off = y * stride + 1 + x * bpp
        r, g, b = decomp[off], decomp[off+1], decomp[off+2]
        if r > 160 and g < 65 and b < 65:
            red_pixels.append((x, y))

print(f"Found {len(red_pixels)} red markup pixels!")

# Find bounding box of red markup in screenshot
min_x = min(p[0] for p in red_pixels)
max_x = max(p[0] for p in red_pixels)
min_y = min(p[1] for p in red_pixels)
max_y = max(p[1] for p in red_pixels)

center_x = (min_x + max_x) / 2
center_y = (min_y + max_y) / 2
rx = (max_x - min_x) / 2
ry = (max_y - min_y) / 2

print(f"Red Markup Bounding Box in Screenshot:")
print(f"X: [{min_x}, {max_x}] (Width: {max_x - min_x}px)")
print(f"Y: [{min_y}, {max_y}] (Height: {max_y - min_y}px)")
print(f"Center: ({center_x:.1f}, {center_y:.1f})")
print(f"Radius X: {rx:.1f}px, Radius Y: {ry:.1f}px")

# Normalized relative to screenshot:
print(f"Normalized Center: u = {center_x / w:.4f}, v = {center_y / h:.4f}")
print(f"Normalized Radii: rx = {rx / w:.4f}, ry = {ry / h:.4f}")

# Now let's calculate the exact contour points along the red markup!
# Let's group red pixels by angle from center
num_nodes = 64
contour_pts = []
for i in range(num_nodes):
    angle = -math.pi * 0.5 + (i / num_nodes) * math.pi * 2
    # Find red pixels along this angular sector (+/- 0.08 rad)
    sector_pts = []
    for px, py in red_pixels:
        ang = math.atan2(py - center_y, px - center_x)
        # Normalize angle diff
        diff = (ang - angle + math.pi) % (math.pi * 2) - math.pi
        if abs(diff) < 0.08:
            dist = math.hypot(px - center_x, py - center_y)
            sector_pts.append(dist)
    if sector_pts:
        avg_r = sum(sector_pts) / len(sector_pts)
    else:
        avg_r = (rx + ry) * 0.5
    
    pt_x = center_x + math.cos(angle) * avg_r
    pt_y = center_y + math.sin(angle) * avg_r
    contour_pts.append({
        'u': round(pt_x / w, 4),
        'v': round(pt_y / h, 4)
    })

print(f"Generated {len(contour_pts)} exact contour nodes from user's red loop!")
with open('extracted_user_contour.json', 'w') as out_f:
    json.dump(contour_pts, out_f)
print("Saved extracted_user_contour.json")
