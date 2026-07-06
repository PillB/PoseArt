#!/usr/bin/env python3
"""Stitch GIF frames for 25 refined figures. 13 frames = 10 captured + 3 hold on last."""
from PIL import Image
import os, json

FRAMES_DIR = '/home/user/workspace/pose_qa/gif_frames_refined'
GIFS_DIR = '/home/user/workspace/pose_qa/animated_gifs'
os.makedirs(GIFS_DIR, exist_ok=True)

target_size = (200, 280)
results = {}

figures = [d for d in sorted(os.listdir(FRAMES_DIR)) if os.path.isdir(os.path.join(FRAMES_DIR, d))]
print(f"Stitching {len(figures)} figures...")

for fig in figures:
    fig_dir = os.path.join(FRAMES_DIR, fig)
    frame_files = sorted([f for f in os.listdir(fig_dir) if f.endswith('.png')])
    
    if len(frame_files) < 5:
        print(f"  ✗ {fig}: only {len(frame_files)} frames")
        results[fig] = 'too_few_frames'
        continue
    
    frames = []
    for fname in frame_files:
        img = Image.open(os.path.join(fig_dir, fname)).convert('RGBA')
        if img.size != target_size:
            img = img.resize(target_size, Image.LANCZOS)
        frames.append(img)
    
    # Add 3 hold frames (copy last frame)
    for _ in range(3):
        frames.append(frames[-1].copy())
    
    # Convert to P mode for GIF
    gif_frames = []
    for frame in frames:
        bg = Image.new('RGB', frame.size, (255, 255, 255))
        if frame.mode == 'RGBA':
            bg.paste(frame, mask=frame.split()[3])
        else:
            bg.paste(frame)
        p_frame = bg.quantize(colors=256, method=Image.Quantize.MEDIANCUT)
        gif_frames.append(p_frame)
    
    out_path = os.path.join(GIFS_DIR, f'gif-{fig}.gif')
    gif_frames[0].save(
        out_path,
        save_all=True,
        append_images=gif_frames[1:],
        duration=100,
        loop=0,
        optimize=True
    )
    size_kb = os.path.getsize(out_path) // 1024
    print(f"  ✓ {fig}: {len(gif_frames)} frames → {size_kb}KB")
    results[fig] = f'{size_kb}KB'

with open('/home/user/workspace/pose_qa/gif_stitch_results.json', 'w') as f:
    json.dump(results, f, indent=2)

ok = sum(1 for v in results.values() if 'KB' in str(v))
print(f"\nGIFs stitched: {ok}/{len(figures)}")
