#!/usr/bin/env python3
"""
Stitch Playwright animation frames into animated GIFs.
10 frames per pose, 100ms per frame, loop forever.
"""
from PIL import Image
import os, glob, sys

FRAMES_DIR = '/home/user/workspace/pose_qa/gif_frames'
OUT_DIR    = '/home/user/workspace/pose_qa/animated_gifs'
os.makedirs(OUT_DIR, exist_ok=True)

POSES = [
  'prone-chin', 'side-fetal', 'back-angel', 'sphinx-pose', 'starfish',
  'back-to-back', 'slow-dance', 'forehead-touch', 'piggyback',
  'mid-jump', 'warrior-lunge', 'dance-arms-up', 'run-stride', 'spin-pose', 'hip-hop-lean',
  'both-knees', 'sitting-on-heels', 'kneeling-back-arch', 'kneeling-lean-forward',
  'matrix-lean', 'superhero-land', 'ragdoll-hang',
  'catwalk-extreme', 'crossed-arms-stand', 'tiptoe-reach', 'profile-stand',
  'throne-sit', 'floor-hug-knees', 'feet-up',
  'forearm-wall', 'back-arch-wall', 'two-hands-wall',
  'chin-rest', 'face-frame-hands',
  'chair-triumphant-arms', 'chair-reach-diagonal'
]

FRAME_COUNT  = 10
FRAME_DELAY  = 100   # ms per frame (matches Playwright capture interval)
HOLD_FRAMES  = 3     # extra copies of final frame to "hold" the finished pose

def make_gif(pose_id):
    frames = []
    for i in range(FRAME_COUNT):
        path = os.path.join(FRAMES_DIR, f'{pose_id}_f{i:02d}.png')
        if not os.path.exists(path):
            print(f'  MISSING: {path}')
            return False
        img = Image.open(path).convert('RGBA')
        frames.append(img)

    # Append hold frames (duplicate of last frame) so pose "rests"
    for _ in range(HOLD_FRAMES):
        frames.append(frames[-1].copy())

    # Also add a fade-out pause: duplicate frame 0 at end (restart loop)
    # Actually, keep it simple: just loop 0 (infinite) with the hold
    out_path = os.path.join(OUT_DIR, f'{pose_id}.gif')

    # Convert to palette for smaller GIF
    palette_frames = []
    for f in frames:
        # White background for transparent PNGs
        bg = Image.new('RGBA', f.size, (255, 255, 255, 255))
        bg.paste(f, mask=f.split()[3])
        palette_frames.append(bg.convert('P', palette=Image.ADAPTIVE, colors=128))

    palette_frames[0].save(
        out_path,
        save_all=True,
        append_images=palette_frames[1:],
        duration=FRAME_DELAY,
        loop=0,
        optimize=True,
        disposal=2  # restore to background between frames
    )
    size_kb = os.path.getsize(out_path) / 1024
    print(f'  ✓ {pose_id}.gif ({len(frames)} frames, {size_kb:.1f} KB)')
    return True

ok = 0
fail = 0
for pose_id in POSES:
    success = make_gif(pose_id)
    if success:
        ok += 1
    else:
        fail += 1

print(f'\nDone: {ok} GIFs created, {fail} failed')
print(f'Output: {OUT_DIR}')
