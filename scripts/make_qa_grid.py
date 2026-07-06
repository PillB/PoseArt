#!/usr/bin/env python3
"""Make a 2×3 grid from the 6 final QA screenshots."""
from PIL import Image, ImageDraw, ImageFont
import os

QA_DIR  = '/home/user/workspace/pose_qa/final_qa_screenshots'
OUT     = '/home/user/workspace/pose_qa/final_qa_grid.png'

FILES = [
  ('qa_reclining_prone-chin.png',         'Reclining — slideIn'),
  ('qa_couple_slow-dance.png',            'Couple — floatUp'),
  ('qa_dynamic_mid-jump.png',             'Dynamic — popIn'),
  ('qa_kneeling_kneeling-back-arch.png',  'Kneeling — dropDown'),
  ('qa_standing_warrior-lunge.png',       'Standing — riseUp'),
  ('qa_seated_throne-sit.png',            'Seated — settle'),
]

COLS, ROWS = 3, 2
LABEL_H = 28
PAD = 6
# Read first image to get cell size
first = Image.open(os.path.join(QA_DIR, FILES[0][0]))
CW, CH = first.width, first.height

canvas_w = COLS * (CW + PAD) + PAD
canvas_h = ROWS * (CH + LABEL_H + PAD) + PAD
canvas = Image.new('RGB', (canvas_w, canvas_h), (15, 59, 58))
draw = ImageDraw.Draw(canvas)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 14)
except:
    font = ImageFont.load_default()

for idx, (fname, label) in enumerate(FILES):
    row = idx // COLS
    col = idx % COLS
    x = PAD + col * (CW + PAD)
    y = PAD + row * (CH + LABEL_H + PAD)
    img = Image.open(os.path.join(QA_DIR, fname))
    canvas.paste(img, (x, y))
    draw.rectangle([x, y+CH, x+CW, y+CH+LABEL_H], fill=(15, 59, 58))
    draw.text((x+6, y+CH+7), label, fill=(201, 162, 76), font=font)

canvas.save(OUT, optimize=True)
print(f'Grid saved: {OUT}')
