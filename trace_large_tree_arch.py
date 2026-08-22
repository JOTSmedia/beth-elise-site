import struct, zlib, math, json

with open('/tmp/hero-bg.png', 'rb') as f:
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

# Center of the large ancient tree circular loop:
# In 1376x768:
# The tree arch spans x from ~200 to ~510 (center ~355 = u: 0.258)
# and y from ~180 to ~410 (center ~295 = v: 0.384)
# Radius is ~105-120px in 1376 space = ~150-170px in 1920 space.

center_x = 356
center_y = 295

# Let's generate 64 high-precision contour points tracing the exact organic inner boundary
contour = []
num_pts = 64

for i in range(num_pts):
    angle = -math.pi * 0.5 + (i / num_pts) * math.pi * 2 # clockwise from 12 o'clock
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    
    # Trace along ray to find inner wood boundary
    r_found = 112
    for r in range(50, 160):
        rx = int(center_x + cos_a * r)
        ry = int(center_y + sin_a * r)
        if 0 <= rx < w and 0 <= ry < h:
            off = ry * stride + 1 + rx * bpp
            lum = 0.299 * decomp[off] + 0.587 * decomp[off+1] + 0.114 * decomp[off+2]
            # When we encounter the dark outer tree wood (lum < 35) or reach edge of aperture
            if lum < 35:
                r_found = r - 1
                break
    
    # Store normalized (u, v) relative to 1920x1080 canvas space
    u = (center_x + cos_a * r_found) / w
    v = (center_y + sin_a * r_found) / h
    contour.append({
        'u': round(u, 4),
        'v': round(v, 4),
        'dx': round(cos_a * r_found * (1920 / w), 2),
        'dy': round(sin_a * r_found * (1080 / h), 2)
    })

print(f"Generated {len(contour)} organic tree-contour nodes.")
with open('tree_contour.json', 'w') as out_f:
    json.dump(contour, out_f)
print("Saved tree_contour.json")
