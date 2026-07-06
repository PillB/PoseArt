#!/usr/bin/env python3
"""
Create a contact sheet PNG showing frame 5 (mid-animation) of all 36 poses
in a 6×6 grid with labels, for quick visual QA.
"""
from PIL import Image, ImageDraw, ImageFont
import os

FRAMES_DIR = '/home/user/workspace/pose_qa/gif_frames'
OUT_PATH = '/home/user/workspace/pose_qa/gif_contact_sheet.png'

POSES = [
  ('prone-chin',           'Prone Chin'),
  ('side-fetal',           'Side Fetal'),
  ('back-angel',           'Back Angel'),
  ('sphinx-pose',          'Sphinx'),
  ('starfish',             'Starfish'),
  ('back-to-back',         'Back-to-Back'),
  ('slow-dance',           'Slow Dance'),
  ('forehead-touch',       'Forehead Touch'),
  ('piggyback',            'Piggyback'),
  ('mid-jump',             'Mid Jump'),
  ('warrior-lunge',        'Warrior Lunge'),
  ('dance-arms-up',        'Dance Arms Up'),
  ('run-stride',           'Run Stride'),
  ('spin-pose',            'Spin Turn'),
  ('hip-hop-lean',         'Hip-Hop Lean'),
  ('both-knees',           'Both Knees'),
  ('sitting-on-heels',     'Seiza'),
  ('kneeling-back-arch',   'Kneeling Arch'),
  ('kneeling-lean-forward','Kneeling Fwd'),
  ('matrix-lean',          'Matrix Lean'),
  ('superhero-land',       'Superhero Land'),
  ('ragdoll-hang',         'Ragdoll Hang'),
  ('catwalk-extreme',      'Catwalk Stride'),
  ('crossed-arms-stand',   'Crossed Arms'),
  ('tiptoe-reach',         'Tiptoe Reach'),
  ('profile-stand',        'Profile Stand'),
  ('throne-sit',           'Throne Sit'),
  ('floor-hug-knees',      'Floor Hug'),
  ('feet-up',              'Feet Up'),
  ('forearm-wall',         'Forearm Wall'),
  ('back-arch-wall',       'Back Arch Wall'),
  ('two-hands-wall',       'Two Hands Wall'),
  ('chin-rest',            'Chin Rest'),
  ('face-frame-hands',     'Face Frame'),
  ('chair-triumphant-arms','Chair Triumph'),
  ('chair-reach-diagonal', 'Chair Reach'),
]

COLS = 6
ROWS = 6
CELL_W, CELL_H = 200, 300
LABEL_H = 20
PAD = 8

canvas_w = COLS * (CELL_W + PAD) + PAD
canvas_h = ROWS * (CELL_H + PAD) + PAD

canvas = Image.new('RGB', (canvas_w, canvas_h), (248, 245, 236))  # warm cream bg
draw = ImageDraw.Draw(canvas)

# Use default font
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
except:
    font = ImageFont.load_default()

for idx, (pose_id, label) in enumerate(POSES):
    row = idx // COLS
    col = idx % COLS
    x = PAD + col * (CELL_W + PAD)
    y = PAD + row * (CELL_H + PAD)

    # Load frame 5 (mid-animation)
    frame_path = os.path.join(FRAMES_DIR, f'{pose_id}_f05.png')
    if os.path.exists(frame_path):
        img = Image.open(frame_path).convert('RGBA')
        bg = Image.new('RGB', img.size, (220, 240, 238))  # teal bg hint
        bg.paste(img, mask=img.split()[3])
        bg = bg.resize((CELL_W, CELL_H - LABEL_H), Image.LANCZOS)
        canvas.paste(bg, (x, y))
    else:
        # Placeholder
        draw.rectangle([x, y, x+CELL_W, y+CELL_H-LABEL_H], fill=(200, 200, 200))

    # Label background
    draw.rectangle([x, y+CELL_H-LABEL_H, x+CELL_W, y+CELL_H], fill=(15, 59, 58))
    # Label text
    draw.text((x+4, y+CELL_H-LABEL_H+4), label, fill=(201, 162, 76), font=font)

canvas.save(OUT_PATH, optimize=True)
print(f'Contact sheet saved: {OUT_PATH} ({canvas_w}×{canvas_h}px)')
