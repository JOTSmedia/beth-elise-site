import struct, zlib, math

def get_png_data(filepath):
    with open(filepath, 'rb') as f:
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
    return w, h, decomp, stride, bpp

w, h, decomp, stride, bpp = get_png_data('/tmp/hero-bg.png')
print(f"Image size: {w}x{h}")

# We want to find the inner contour of the tree opening.
# Let's find the center of the opening and cast rays outward at 36 angles (every 10 degrees)
# Center estimate: x=340, y=285 (u=340/1376=0.247, v=285/768=0.371)

# Let's test a range of centers and find where the bright hole meets the dark wood bark
# Inside the hole: lum is high (sky/stars/fog, lum > 70)
# Bark/trunk boundary: lum drops sharply below 45

center_x, center_y = 338, 290
print(f"Center in normalized coords: u={center_x/w:.4f}, v={center_y/h:.4f}")

contour_pts = []
num_rays = 48
for i in range(num_rays):
    angle = -math.pi * 0.5 + (i / num_rays) * math.pi * 2 # starting from 12 o'clock clockwise
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    
    # Raycast outward from center until we hit the dark bark (lum < 45 or sharp gradient)
    r_hit = 110 # default radius if not found
    for r in range(40, 180):
        rx = int(center_x + cos_a * r)
        ry = int(center_y + sin_a * r)
        if rx < 0 or rx >= w or ry < 0 or ry >= h:
            r_hit = r
            break
        off = ry * stride + 1 + rx * bpp
        lum = 0.299 * decomp[off] + 0.587 * decomp[off+1] + 0.114 * decomp[off+2]
        if lum < 40: # Hit dark tree bark!
            r_hit = r - 2 # Hug inner edge just inside bark
            break
    
    # Calculate point in 1920x1080 normalized or offset space
    pt_x = center_x + cos_a * r_hit
    pt_y = center_y + sin_a * r_hit
    u = pt_x / w
    v = pt_y / h
    contour_pts.append({
        'u': round(u, 4),
        'v': round(v, 4),
        'angle': round(angle, 4),
        'r': round(r_hit * (1920 / w), 1)
    })

print(f"Generated {len(contour_pts)} contour points tracing the natural tree opening!")
import json
print(json.dumps(contour_pts[:8], indent=2))
