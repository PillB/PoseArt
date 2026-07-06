from PIL import Image, ImageDraw, ImageFont
import os

GIFS_DIR = '/home/user/workspace/pose_qa/animated_gifs'
OUT = '/home/user/workspace/pose_qa/refined_gifs_contact_sheet.png'

picks = [
    ('gif-boudoir-recline.gif', 'Boudoir Recline'),
    ('gif-boudoir-drape.gif', 'Boudoir Drape'),
    ('gif-editorial-angular.gif', 'Editorial Angular'),
    ('gif-editorial-twist.gif', 'Editorial Twist'),
    ('gif-fine-art-arabesque.gif', 'Fine Art Arabesque'),
    ('gif-fine-art-odalisque.gif', 'Fine Art Odalisque'),
    ('gif-fashion-power.gif', 'Fashion Power'),
    ('gif-fashion-stomp.gif', 'Fashion Stomp'),
    ('gif-low-high-crouch.gif', 'Low→High Crouch'),
    ('gif-high-low-descent.gif', 'High→Low Descent'),
]

COLS = 5
ROWS = 2
W, H = 200, 280
LABEL = 26
PAD = 8
HEADER = 52
BG = (245, 240, 232)

TOTAL_W = COLS * (W + PAD) + PAD
TOTAL_H = HEADER + ROWS * (H + LABEL + PAD) + PAD

canvas = Image.new('RGB', (TOTAL_W, TOTAL_H), BG)
draw = ImageDraw.Draw(canvas)

try:
    fh = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
    fs = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
    fx = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 10)
except:
    fh = fs = fx = ImageFont.load_default()

draw.text((TOTAL_W//2, 12), "PoseArt — 25 Refined Figures · Animated GIF Preview", fill='#0F3B3A', font=fh, anchor='mt')
draw.text((TOTAL_W//2, 34), "13 frames · 100ms/frame · loop=0 · 200×280px", fill='#4a6b6a', font=fs, anchor='mt')

for i, (fname, label) in enumerate(picks):
    col = i % COLS
    row = i // COLS
    x = PAD + col * (W + PAD)
    y = HEADER + PAD + row * (H + LABEL + PAD)
    
    gif_path = os.path.join(GIFS_DIR, fname)
    if os.path.exists(gif_path):
        gif = Image.open(gif_path)
        frame = gif.convert('RGB').resize((W, H), Image.LANCZOS)
        draw.rectangle([x-1, y-1, x+W, y+H], outline='#C9A24C', width=1)
        canvas.paste(frame, (x, y))
        # GIF badge
        draw.rectangle([x+2, y+2, x+32, y+16], fill='#C9A24C')
        draw.text((x+17, y+9), 'GIF', fill='#0F3B3A', font=fx, anchor='mm')
    else:
        draw.rectangle([x, y, x+W, y+H], fill='#e8e0d0', outline='#aaa')
        draw.text((x+W//2, y+H//2), 'MISSING', fill='#999', font=fs, anchor='mm')
    
    draw.text((x+W//2, y+H+3), label, fill='#0F3B3A', font=fx, anchor='mt')

canvas.save(OUT)
print(f"GIF sheet: {OUT} ({canvas.size[0]}×{canvas.size[1]})")
