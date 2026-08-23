#!/usr/bin/env python3
import os
import glob
import subprocess

SRC_DIR = "/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678"
DST_DIR = "/Users/bethrooney/Desktop/JOTS.MEDIA_AG/clients/bethElisePsychic_v37/images/icons"
FFMPEG = "/opt/homebrew/bin/ffmpeg"

ICON_MAP = {
    "hand": "icon_reiki_hand_*.jpg",
    "leaf": "icon_healing_leaf_*.jpg",
    "candle": "icon_altar_candle_*.jpg",
    "bell": "icon_celestial_bell_*.jpg",
    "dove": "icon_spirit_dove_*.jpg",
    "letter": "icon_parchment_letter_*.jpg",
    "sparkle": "icon_celestial_sparkle_*.jpg",
    "moon": "icon_crescent_moon_*.jpg",
    "ghost": "icon_ghost_spirit_*.jpg",
    "bag": "icon_sacred_bag_*.jpg",
    "pin": "icon_crystal_pin_*.jpg",
    "comet": "icon_shooting_comet_*.jpg",
    "star": "icon_gold_star_*.jpg",
    "ticket": "icon_sacred_ticket_*.jpg",
    "speaker": "icon_sound_speaker_*.jpg",
    "refresh": "icon_refresh_ouroboros_*.jpg",
    "search": "icon_magnifying_search_*.jpg",
    "blossom": "icon_lotus_blossom_*.jpg",
    "mountain": "icon_mountain_peak_*.jpg",
    "hibiscus": "icon_tropical_hibiscus_*.jpg",
    "desert": "icon_golden_desert_*.jpg",
    "cloud": "icon_ethereal_cloud_*.jpg",
    "pen": "icon_quill_pen_*.jpg",
    "phone": "icon_direct_phone_*.jpg",
    "mail": "icon_direct_mail_*.jpg",
    "meditate": "icon_meditate_lotus_*.jpg",
    "doll": "icon_porcelain_doll_*.jpg",
    "clock": "icon_astrolabe_clock_*.jpg",
    "tshirt": "icon_sacred_tshirt_*.jpg",
    "jacket": "icon_sacred_jacket_*.jpg",
    "cap": "icon_sacred_cap_*.jpg",
    "warning": "icon_warning_rune_*.jpg",
    "trash": "icon_trash_relic_*.jpg",
    "gear": "icon_golden_gear_*.jpg",
    "globe": "icon_celestial_globe_*.jpg",
    "satellite": "icon_satellite_celestial_*.jpg"
}

MOON_PHASES = [
    "moon-full", "moon-new", "moon-first-quarter", "moon-last-quarter",
    "moon-waxing-crescent", "moon-waxing-gibbous", "moon-waning-crescent", "moon-waning-gibbous"
]

os.makedirs(DST_DIR, exist_ok=True)

for name, pattern in ICON_MAP.items():
    matches = sorted(glob.glob(os.path.join(SRC_DIR, pattern)), key=os.path.getmtime, reverse=True)
    if not matches:
        print(f"Skipping {name}: no match for {pattern}")
        continue
    src_file = matches[0]
    dst_file = os.path.join(DST_DIR, f"{name}.png")
    
    if name in ["desert", "mountain"]:
        filter_str = "scale=256:256,format=rgba"
    else:
        filter_str = "colorkey=0x000000:0.18:0.14,scale=256:256,format=rgba"
    
    cmd = [
        FFMPEG, "-y", "-i", src_file,
        "-vf", filter_str,
        dst_file
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"✓ Converted {name}.png ({os.path.getsize(dst_file)} bytes)")
    else:
        print(f"✗ Failed {name}: {res.stderr[:200]}")

bell_file = os.path.join(DST_DIR, "bell.png")
bell_off_file = os.path.join(DST_DIR, "bell-off.png")
if os.path.exists(bell_file):
    subprocess.run(["cp", bell_file, bell_off_file])
    print("✓ Created bell-off.png")

moon_file = os.path.join(DST_DIR, "moon.png")
if os.path.exists(moon_file):
    for mp in MOON_PHASES:
        mp_file = os.path.join(DST_DIR, f"{mp}.png")
        subprocess.run(["cp", moon_file, mp_file])
    print("✓ Created moon phase PNGs")

print("All photorealistic icons processed successfully!")
