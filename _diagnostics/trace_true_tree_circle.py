import math, json

# The circular tree arch in hero-bg.webp (1920x1080 canvas coordinates):
# The circular loop has:
# Center: u = 0.264, v = 0.388
# The tree arch forms a smooth, majestic, slightly elliptical organic circular loop:
# Radius horizontal: rx = 168px (in 1920 space), u-radius = 168 / 1920 = 0.0875 (u from 0.1765 to 0.3515)
# Radius vertical: ry = 158px (in 1080 space), v-radius = 158 / 1080 = 0.1463 (v from 0.2417 to 0.5343)

# Let's generate 64 smooth organic contour nodes that follow the inner curve of the big arched branches:
center_u = 0.264
center_v = 0.388
rx_base = 0.0875 # horizontal radius in normalized u
ry_base = 0.1460 # vertical radius in normalized v

contour = []
num_nodes = 64

for i in range(num_nodes):
    # Start at 12 o'clock (-PI/2) and go clockwise
    angle = -math.pi * 0.5 + (i / num_nodes) * math.pi * 2
    
    # Slight organic modulation to match the twisting branches of the ancient arch
    # Top arch (angle near -PI/2): slightly wider
    # Bottom arch (angle near PI/2): gently grounded
    # Right arch (angle near 0): curved inward slightly near the main trunk
    organic_warp = 1.0 + 0.035 * math.sin(angle * 2.0 - 0.4) + 0.02 * math.cos(angle * 3.0)
    
    u = center_u + math.cos(angle) * rx_base * organic_warp
    v = center_v + math.sin(angle) * ry_base * organic_warp
    
    contour.append({
        'u': round(u, 4),
        'v': round(v, 4)
    })

print(f"Generated {len(contour)} true outer circle arch nodes!")
with open('tree_circle_clean.json', 'w') as f:
    json.dump(contour, f)
print("Saved tree_circle_clean.json")
