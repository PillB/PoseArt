#!/usr/bin/env python3
"""Build a 5×5 contact sheet of all 25 refined figure PNGs with labels."""
from PIL import Image, ImageDraw, ImageFont
import os, json

PNG_DIR = '/home/user/workspace/pose_qa/refined_pngs'
OUT_PATH = '/home/user/workspace/pose_qa/final_25_contact_sheet.png'

# Layout: 5 cols × 5 rows
COLS = 5
ROWS = 5
THUMB_W = 200
THUMB_H = 280
LABEL_H = 28
PAD = 6
BG = (245, 240, 232)  # warm cream
HEADER_H = 52

figures = [
    # Row 1: Boudoir
    'boudoir-recline','boudoir-drape','boudoir-seated-knee','boudoir-prone-elbow','boudoir-lying-arch',
    # Row 2: Editorial
    'editorial-angular','editorial-lean-far','editorial-floor-reach','editorial-twist','editorial-contort',
    # Row 3: Fine Art
    'fine-art-arabesque','fine-art-contrapposto','fine-art-odalisque','fine-art-pietà','fine-art-balance',
    # Row 4: Fashion
    'fashion-power','fashion-turn','fashion-stomp','fashion-overshoot',
    # Row 5: Low-High / High-Low
    'low-high-crouch','low-high-kneel-rise','high-low-descent','low-high-floor','high-low-over-shoulder',
]
# Add missing fashion + high-low-floor-reach to fill row 4/5
figures_order = [
    'boudoir-recline','boudoir-drape','boudoir-seated-knee','boudoir-prone-elbow','boudoir-lying-arch',
    'editorial-angular','editorial-lean-far','editorial-floor-reach','editorial-twist','editorial-contort',
    'fine-art-arabesque','fine-art-contrapposto','fine-art-odalisque','fine-art-pietà','fine-art-balance',
    'fashion-power','fashion-turn','fashion-stomp','fashion-overshoot','low-high-crouch',
    'low-high-kneel-rise','high-low-descent','low-high-floor','high-low-over-shoulder','high-low-floor-reach'
]

TOTAL_W = COLS * (THUMB_W + PAD) + PAD
TOTAL_H = HEADER_H + ROWS * (THUMB_H + LABEL_H + PAD) + PAD

canvas = Image.new('RGB', (TOTAL_W, TOTAL_H), BG)
draw = ImageDraw.Draw(canvas)

# Header
try:
    font_h = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
    font_sm = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
    font_xs = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 10)
except:
    font_h = ImageFont.load_default()
    font_sm = font_h
    font_xs = font_h

draw.text((TOTAL_W//2, 14), "PoseArt — 25 Refined Figure Types (3-Pass QA)", fill='#0F3B3A', font=font_h, anchor='mt')
draw.text((TOTAL_W//2, 36), "480 poses · 16 categories · Forensic 3-pass SVG refinement · Improved coaching text", fill='#4a6b6a', font=font_sm, anchor='mt')

row_labels = {0: 'Boudoir', 1: 'Editorial', 2: 'Fine Art', 3: 'Fashion / Low-to-High', 4: 'Low-to-High / High-to-Low'}

for i, fig in enumerate(figures_order[:25]):
    col = i % COLS
    row = i // COLS
    
    x = PAD + col * (THUMB_W + PAD)
    y = HEADER_H + PAD + row * (THUMB_H + LABEL_H + PAD)
    
    # Row label on first column
    if col == 0:
        draw.text((x, y - 2), row_labels.get(row, ''), fill='#0F3B3A', font=font_sm)
    
    png_path = os.path.join(PNG_DIR, f'{fig}.png')
    if os.path.exists(png_path):
        thumb = Image.open(png_path).convert('RGB')
        if thumb.size != (THUMB_W, THUMB_H):
            thumb = thumb.resize((THUMB_W, THUMB_H), Image.LANCZOS)
        # Subtle border
        draw.rectangle([x-1, y-1, x+THUMB_W, y+THUMB_H], outline='#C9A24C', width=1)
        canvas.paste(thumb, (x, y))
    else:
        draw.rectangle([x, y, x+THUMB_W, y+THUMB_H], fill='#e8e0d0', outline='#C9A24C')
        draw.text((x+THUMB_W//2, y+THUMB_H//2), 'MISSING', fill='#999', font=font_sm, anchor='mm')
    
    # Label below
    label = fig.replace('-', ' ').title()
    label = label[:22] + '…' if len(label) > 22 else label
    draw.text((x + THUMB_W//2, y + THUMB_H + 2), label, fill='#0F3B3A', font=font_xs, anchor='mt')

canvas.save(OUT_PATH, quality=95)
print(f"Contact sheet saved: {OUT_PATH}")
print(f"Size: {canvas.size[0]}×{canvas.size[1]}px")
