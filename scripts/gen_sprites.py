# -*- coding: utf-8 -*-
"""Generator for PoseArt v2 Art Nouveau pose sprite library.
Each sprite is a complete <svg viewBox="0 0 200 320"> element.
Uses reusable helpers for consistent styling.
"""

# --- Design system constants ---
BODY = "#0F3B3A"      # deep teal
GOLD = "#C9A24C"      # antique gold
EMERALD = "#1E7A74"   # emerald

SVG_OPEN = ('<svg width="200" height="280" viewBox="0 0 200 320" '
            'fill="none" xmlns="http://www.w3.org/2000/svg">')
SVG_CLOSE = '</svg>'


def halo(cx, cy, r=26):
    """Dashed gold arc around head."""
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke="{GOLD}" '
            f'stroke-width="0.8" stroke-dasharray="3 5" opacity="0.3" fill="none"/>')


def head(cx, cy, r=18, hair=True, hair_dx=0, hair_dy=-4, hair_rx=None, hair_ry=None):
    parts = []
    if hair:
        hrx = hair_rx if hair_rx else r + 3
        hry = hair_ry if hair_ry else r + 5
        parts.append(f'<ellipse cx="{cx+hair_dx}" cy="{cy+hair_dy}" rx="{hrx}" ry="{hry}" '
                     f'fill="{EMERALD}" opacity="0.5"/>')
    parts.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{BODY}" opacity="0.82"/>')
    return "".join(parts)


def limb(d, w=12, opacity=0.8, color=None):
    """Thick rounded stroke path for arms/legs."""
    c = color if color else BODY
    return (f'<path d="{d}" stroke="{c}" stroke-width="{w}" '
            f'stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="{opacity}"/>')


def torso(d, opacity=0.8):
    return f'<path d="{d}" fill="{BODY}" opacity="{opacity}"/>'


def gold_curve(d, w=1.0, opacity=0.35):
    """Thin decorative Art Nouveau line."""
    return (f'<path d="{d}" stroke="{GOLD}" stroke-width="{w}" fill="none" '
            f'opacity="{opacity}" stroke-linecap="round"/>')


def foot(cx, cy, rx=7, ry=4, opacity=0.8, rot=0):
    t = f' transform="rotate({rot} {cx} {cy})"' if rot else ''
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{BODY}" opacity="{opacity}"{t}/>'


def wrap(*parts):
    return SVG_OPEN + "".join(parts) + SVG_CLOSE


SPRITES = {}

# =====================================================================
# 1. standing-neutral
# =====================================================================
SPRITES['standing-neutral'] = wrap(
    halo(100, 35),
    head(100, 35),
    # torso: shoulders y68 -> waist -> hips
    torso("M78,66 C74,90 76,115 82,150 C86,168 114,168 118,150 "
          "C124,115 126,90 122,66 C114,58 86,58 78,66 Z"),
    # arms hanging slightly outward
    limb("M82,72 C72,100 68,128 66,158", 12),
    limb("M118,72 C128,100 132,128 134,158", 12),
    # legs
    limb("M90,152 C86,190 84,230 84,268", 13),
    limb("M110,152 C114,190 116,230 116,268", 13),
    foot(82, 270, 8, 4), foot(118, 270, 8, 4),
    # gold fabric folds + spine S-curve
    gold_curve("M100,66 C98,95 102,120 100,150", 1.0, 0.4),
    gold_curve("M88,80 C92,110 108,110 112,80", 1.0, 0.3),
)

# =====================================================================
# 2. scurve  (weight on right leg, hip pushed left, left knee bent)
# =====================================================================
SPRITES['scurve'] = wrap(
    halo(97, 36),
    head(97, 36, hair_dx=-2),
    # torso with S-curve, leaning: shoulders tilt, hip pushed left
    torso("M76,66 C70,92 74,118 72,150 C78,170 112,168 114,148 "
          "C118,116 122,92 118,66 C110,58 84,58 76,66 Z"),
    # right arm relaxed; left arm reaching up to hair
    limb("M116,72 C126,100 128,126 128,152", 12),
    limb("M80,72 C70,86 78,58 90,46", 11),  # hand toward hair
    # right leg straight (weight bearing), left knee bent forward
    limb("M92,150 C96,190 100,232 102,268", 13),      # right weight leg
    limb("M84,152 C70,180 78,206 74,238 C72,250 74,258 78,264", 13),  # bent left
    foot(103, 270, 8, 4), foot(80, 266, 8, 4),
    gold_curve("M97,66 C92,96 104,120 100,150", 1.0, 0.4),
    gold_curve("M84,84 C90,108 104,108 110,86", 0.9, 0.3),
)

# =====================================================================
# 3. hip-shift  (hip strongly left, torso leans right, hand on hip)
# =====================================================================
SPRITES['hip-shift'] = wrap(
    halo(104, 35),
    head(104, 35, hair_dx=1),
    # torso leans right, hip protrudes left
    torso("M86,66 C88,92 84,116 72,148 C80,170 116,168 120,148 "
          "C126,118 126,92 122,66 C114,58 94,58 86,66 Z"),
    # right arm relaxed at side
    limb("M118,72 C130,98 134,126 136,156", 12),
    # left arm: elbow bent, hand on left hip
    limb("M86,72 C74,86 68,110 80,130", 11),  # forearm to hip
    # legs from shifted hips
    limb("M84,150 C80,190 82,230 82,266", 13),
    limb("M112,150 C116,190 116,230 116,266", 13),
    foot(80, 268, 8, 4), foot(116, 268, 8, 4),
    gold_curve("M104,66 C96,96 96,122 90,148", 1.0, 0.4),
    gold_curve("M92,86 C98,106 112,104 116,84", 0.9, 0.3),
)

# =====================================================================
# 4. arms-overhead
# =====================================================================
SPRITES['arms-overhead'] = wrap(
    halo(100, 42),
    head(100, 42),
    # torso with slight back arch (chest forward)
    torso("M80,72 C74,96 76,120 84,152 C88,170 112,170 116,152 "
          "C124,120 126,96 120,72 C112,64 88,64 80,72 Z"),
    # arms curving up above head
    limb("M84,76 C70,54 78,30 96,22", 12),
    limb("M116,76 C130,54 122,30 104,22", 12),
    # hands meeting near top
    foot(96, 20, 5, 5), foot(104, 20, 5, 5),
    # legs together
    limb("M92,154 C90,192 90,230 90,268", 13),
    limb("M108,154 C110,192 110,230 110,268", 13),
    foot(88, 270, 8, 4), foot(112, 270, 8, 4),
    gold_curve("M100,72 C104,100 96,124 100,152", 1.0, 0.4),
    gold_curve("M86,90 C92,112 108,112 114,90", 0.9, 0.3),
)

# =====================================================================
# 5. wind-pose  (hair flowing left, one arm out-forward, torso lean)
# =====================================================================
SPRITES['wind-pose'] = wrap(
    halo(102, 36),
    # flowing hair to the left
    head(102, 36, hair=False),
    torso("M84,66 C82,92 80,118 78,150 C84,170 118,168 120,148 "
          "C124,118 126,92 122,66 C114,58 92,58 84,66 Z"),
    # hair streaming left
    gold_curve("M92,26 C70,30 52,40 40,58", 2.0, 0.5),
    gold_curve("M94,34 C74,40 58,52 48,70", 1.6, 0.45),
    gold_curve("M96,42 C80,50 68,62 62,78", 1.3, 0.4),
    f'<ellipse cx="98" cy="30" rx="20" ry="18" fill="{EMERALD}" opacity="0.5"/>',
    head(102, 36, hair=False),
    # one arm extended out-forward (left), other slightly back
    limb("M86,74 C64,84 46,96 34,108", 12),
    limb("M120,74 C132,96 136,120 132,146", 11),
    # legs, slight lean
    limb("M88,152 C82,190 80,230 78,268", 13),
    limb("M112,152 C118,190 120,230 122,268", 13),
    foot(76, 270, 8, 4), foot(124, 270, 8, 4),
    gold_curve("M100,66 C94,96 98,122 96,150", 1.0, 0.4),
)

# =====================================================================
# 6. seated-upright  (seated, back straight, knees bent)
# =====================================================================
SPRITES['seated-upright'] = wrap(
    halo(100, 46),
    head(100, 46),
    # upright torso down to seated hips ~y=190
    torso("M82,78 C78,102 80,128 84,158 C88,182 112,182 116,158 "
          "C120,128 122,102 118,78 C110,70 90,70 82,78 Z"),
    # arms resting
    limb("M84,84 C74,110 72,140 74,168", 12),
    limb("M116,84 C126,110 128,140 126,168", 12),
    # hips at seated level, thighs forward then shins down
    limb("M86,178 C90,196 118,198 132,196", 14),   # thigh right-forward
    limb("M114,178 C116,196 138,198 150,196", 14),  # thigh
    limb("M138,196 C142,214 142,238 140,258", 13),  # shin down
    limb("M150,196 C154,214 154,238 152,258", 13),
    foot(140, 260, 8, 5), foot(152, 260, 8, 5),
    gold_curve("M100,78 C96,110 104,140 100,168", 1.0, 0.4),
    gold_curve("M88,96 C94,120 108,120 114,98", 0.9, 0.3),
)

# =====================================================================
# 7. seated-crossleg  (cross-legged, diamond of legs)
# =====================================================================
SPRITES['seated-crossleg'] = wrap(
    halo(100, 60),
    head(100, 60),
    # back straight torso down to floor-level hips ~210
    torso("M82,92 C78,118 80,148 84,178 C88,202 112,202 116,178 "
          "C120,148 122,118 118,92 C110,84 90,84 82,92 Z"),
    # crossed legs: diamond, knees out to sides
    limb("M88,198 C64,206 52,230 60,248 C82,254 100,244 100,232", 15),  # left leg out & in
    limb("M112,198 C136,206 148,230 140,248 C118,254 100,244 100,232", 15),  # right leg
    # feet tucked in center
    foot(88, 250, 9, 5, rot=-20), foot(112, 250, 9, 5, rot=20),
    # arms, hands on knees
    limb("M84,98 C72,124 66,150 62,180", 12),
    limb("M116,98 C128,124 134,150 138,180", 12),
    foot(60, 184, 7, 6), foot(140, 184, 7, 6),  # hands on knees
    gold_curve("M100,92 C96,124 104,156 100,186", 1.0, 0.4),
    gold_curve("M100,232 C80,244 76,258 84,268", 1.0, 0.3),
    gold_curve("M100,232 C120,244 124,258 116,268", 1.0, 0.3),
)

# =====================================================================
# 8. seated-lean-forward  (elbows on knees, torso tilt ~30)
# =====================================================================
SPRITES['seated-lean-forward'] = wrap(
    halo(84, 66),
    head(84, 66),
    # torso tilted forward (top-left leaning)
    torso("M78,86 C82,110 88,134 96,162 C104,182 128,176 122,152 "
          "C116,124 104,100 96,80 C88,74 82,78 78,86 Z"),
    # seated hips/thighs forward, knees where elbows rest
    limb("M112,164 C124,178 146,182 158,180", 14),   # thigh right
    limb("M100,168 C112,184 134,188 148,186", 14),
    limb("M156,180 C160,200 158,226 156,250", 13),   # shins down
    limb("M148,186 C152,204 150,228 148,250", 13),
    foot(156, 252, 8, 5), foot(148, 252, 8, 5),
    # arms from shoulders down to knees (elbows on knees)
    limb("M88,92 C104,120 130,150 150,176", 12),
    limb("M96,88 C112,116 138,144 158,170", 12),
    gold_curve("M84,86 C90,116 104,140 116,164", 1.0, 0.4),
)

# =====================================================================
# 9. elbow-prop  (elbows on knees, chin in hands)
# =====================================================================
SPRITES['elbow-prop'] = wrap(
    halo(88, 78),
    head(88, 78),
    # torso leaning forward significantly
    torso("M82,98 C86,122 92,146 100,172 C108,190 130,184 124,160 "
          "C118,134 106,110 98,92 C90,86 86,90 82,98 Z"),
    # thighs forward, knees up where elbows rest
    limb("M116,174 C128,186 148,188 160,186", 14),
    limb("M104,178 C116,192 136,194 150,192", 14),
    limb("M158,186 C162,206 160,230 158,252", 13),
    limb("M150,192 C154,210 152,232 150,252", 13),
    foot(158, 254, 8, 5), foot(150, 254, 8, 5),
    # arms bent: elbows on knees (~155,185), forearms UP to chin (~88,86)
    limb("M92,104 C110,130 140,168 152,184", 12),   # upper arm down to elbow
    limb("M152,184 C130,160 104,120 90,90", 11),    # forearm up to chin
    gold_curve("M88,98 C94,124 106,150 116,174", 1.0, 0.4),
)

# =====================================================================
# 10. wall-lean  (lean right, ankles crossed)
# =====================================================================
SPRITES['wall-lean'] = wrap(
    halo(112, 38),
    head(112, 38, hair_dx=2),
    # body leans right (shoulders toward right)
    torso("M96,68 C100,94 98,118 100,150 C106,170 132,166 130,146 "
          "C132,116 130,92 124,70 C118,62 104,60 96,68 Z"),
    # right arm relaxed at side, left arm to hip/pocket
    limb("M124,74 C136,100 138,128 136,156", 12),
    limb("M98,74 C86,92 84,116 96,134", 11),
    # legs: crossing at ankles at bottom
    limb("M104,150 C110,190 104,230 92,264", 13),   # crosses to left
    limb("M124,150 C128,190 118,232 106,262", 13),  # crosses to right
    foot(90, 266, 9, 4, rot=15), foot(108, 264, 9, 4, rot=-15),
    # implied wall line (gold, right edge)
    gold_curve("M148,40 L148,280", 1.2, 0.3),
    gold_curve("M112,68 C106,98 110,124 106,150", 1.0, 0.4),
)

# =====================================================================
# 11. doorframe-lean  (both arms up gripping top frame)
# =====================================================================
SPRITES['doorframe-lean'] = wrap(
    # doorframe hint
    gold_curve("M56,18 L56,300", 1.4, 0.3),
    gold_curve("M144,18 L144,300", 1.4, 0.3),
    gold_curve("M56,18 L144,18", 1.4, 0.3),
    halo(100, 54),
    head(100, 54),
    # body hangs slightly forward, chest-forward arch
    torso("M80,84 C74,108 78,134 86,166 C90,186 114,186 118,166 "
          "C126,134 128,108 122,84 C114,76 88,76 80,84 Z"),
    # both arms raised high, elbows bent, hands at top frame
    limb("M84,88 C66,66 60,40 62,22", 12),
    limb("M116,88 C134,66 140,40 138,22", 12),
    foot(62, 20, 6, 5), foot(138, 20, 6, 5),  # hands gripping frame
    # legs
    limb("M90,168 C88,204 88,238 88,272", 13),
    limb("M110,168 C112,204 112,238 112,272", 13),
    foot(86, 274, 8, 4), foot(114, 274, 8, 4),
    gold_curve("M100,84 C104,114 96,140 100,166", 1.0, 0.4),
)

# =====================================================================
# 12. back-wall-prop  (back on wall right, one knee bent foot on wall)
# =====================================================================
SPRITES['back-wall-prop'] = wrap(
    gold_curve("M150,20 L150,300", 1.4, 0.3),  # wall on right
    halo(112, 40),
    head(112, 40, hair_dx=2),
    # body upright/flat against wall (right side)
    torso("M100,70 C102,96 100,122 102,154 C108,174 132,170 130,150 "
          "C132,120 130,94 126,72 C120,64 108,62 100,70 Z"),
    # arms crossed / at sides
    limb("M102,76 C90,98 88,124 98,146", 11),
    limb("M126,76 C136,100 138,128 130,150", 12),
    # one leg straight down, other knee bent w/ foot against wall
    limb("M108,154 C112,192 114,232 114,268", 13),  # straight leg
    limb("M124,154 C138,168 148,180 148,196 C148,206 140,208 132,204", 13),  # bent, foot on wall
    foot(112, 270, 8, 4),
    foot(146, 196, 5, 8),  # foot flat on wall (vertical)
    gold_curve("M112,70 C108,100 112,126 108,154", 1.0, 0.4),
)

# =====================================================================
# 13. kneeling-one  (right knee down, left leg bent 90, upright torso)
# =====================================================================
SPRITES['kneeling-one'] = wrap(
    halo(96, 66),
    head(96, 66),
    torso("M80,96 C76,120 78,146 84,176 C88,196 110,196 114,176 "
          "C120,148 122,122 118,96 C110,88 88,88 80,96 Z"),
    # left leg: foot flat x~78 knee up
    limb("M88,186 C78,206 74,224 78,238", 14),      # thigh forward-down
    limb("M78,238 C74,252 76,264 82,270", 13),      # shin to floor
    foot(78, 272, 9, 4),  # left foot flat
    # right leg: knee on ground x~112, shin back
    limb("M108,186 C118,206 122,224 120,238", 14),  # thigh to knee
    limb("M120,238 C124,254 130,266 138,270", 13),  # shin back on ground
    foot(140, 270, 9, 4),
    f'<ellipse cx="120" cy="240" rx="8" ry="6" fill="{BODY}" opacity="0.8"/>',  # knee on ground
    # arms: one on raised knee
    limb("M84,102 C74,128 72,156 78,180", 11),      # left hand to knee area
    limb("M114,102 C126,128 130,156 128,182", 12),  # right arm at side
    gold_curve("M96,96 C92,126 100,152 96,176", 1.0, 0.4),
)

# =====================================================================
# 14. kneeling-both  (both knees down, upright, hands in lap)
# =====================================================================
SPRITES['kneeling-both'] = wrap(
    halo(100, 68),
    head(100, 68),
    torso("M82,98 C78,122 80,150 86,182 C90,202 112,202 116,182 "
          "C122,150 124,122 120,98 C112,90 90,90 82,98 Z"),
    # both thighs down to knees on ground
    limb("M88,192 C84,214 82,238 84,256", 14),
    limb("M114,192 C118,214 120,238 118,256", 14),
    # shins tucked back
    limb("M84,254 C82,266 88,272 98,272", 13),
    limb("M118,254 C120,266 114,272 104,272", 13),
    f'<ellipse cx="84" cy="256" rx="8" ry="6" fill="{BODY}" opacity="0.8"/>',
    f'<ellipse cx="118" cy="256" rx="8" ry="6" fill="{BODY}" opacity="0.8"/>',
    # arms, hands in lap
    limb("M86,104 C76,132 78,162 96,182", 11),
    limb("M116,104 C126,132 124,162 106,182", 11),
    foot(100, 186, 8, 5),  # hands in lap
    gold_curve("M100,98 C96,130 104,158 100,184", 1.0, 0.4),
)

# =====================================================================
# 15. side-recline  (lying on side, propped on right elbow)
# horizontal orientation, head/elbow at right, body extends left
# =====================================================================
SPRITES['side-recline'] = wrap(
    halo(158, 120, 24),
    head(158, 120, r=17, hair_dx=6, hair_dy=0),
    # torso horizontal: shoulders near right, hips toward center-left
    torso("M150,138 C126,132 100,136 78,146 C60,152 60,178 78,182 "
          "C100,190 128,186 150,178 C166,170 168,146 150,138 Z"),
    # propping right arm: elbow down to ground, forearm up to head
    limb("M150,150 C158,168 162,190 160,208", 12),  # upper arm down
    limb("M160,208 C158,186 156,150 156,134", 11),  # forearm up to head (prop)
    foot(160, 210, 8, 6),  # elbow/hand on ground
    # top arm resting along body
    limb("M144,146 C120,150 96,152 76,158", 11, opacity=0.7),
    # legs extending left-downward (both straight)
    limb("M74,166 C50,176 30,190 18,204", 14),      # bottom leg
    limb("M76,176 C52,188 32,204 20,220", 13, opacity=0.85),  # top leg
    foot(16, 206, 8, 5, rot=30), foot(18, 222, 8, 5, rot=30),
    gold_curve("M150,158 C124,160 98,162 78,166", 1.0, 0.4),
    # ground line
    gold_curve("M20,232 L172,232", 1.0, 0.25),
)

# =====================================================================
# 16. back-prop  (leaning back on both hands, legs extended forward)
# =====================================================================
SPRITES['back-prop'] = wrap(
    halo(84, 62),
    head(84, 62, hair_dx=-2),
    # torso leaning back ~45 (top-left up, hips center)
    torso("M78,82 C82,104 90,126 100,150 C110,166 128,158 120,138 "
          "C110,116 96,96 88,78 C82,72 78,76 78,82 Z"),
    # both arms behind: hands on ground at lower sides
    limb("M84,90 C70,120 58,160 52,196", 12),       # left arm back to ground
    limb("M92,86 C102,118 100,158 100,196", 12),    # right arm back to ground
    foot(50, 200, 9, 5), foot(100, 200, 9, 5),      # hands on ground
    # legs extended forward/outward from hips (~115,150)
    limb("M112,150 C136,160 160,168 178,168", 14),  # right leg forward
    limb("M108,156 C132,170 156,182 174,190", 13),  # left leg forward
    foot(180, 168, 8, 5, rot=80), foot(176, 192, 8, 5, rot=80),
    gold_curve("M84,84 C90,110 98,132 108,150", 1.0, 0.4),
    gold_curve("M50,210 L184,210", 1.0, 0.25),  # ground
)

# =====================================================================
# 17. prone  (face down, propped on elbows, chin lifted)
# horizontal: head/chest lifted at left, legs extend right
# =====================================================================
SPRITES['prone'] = wrap(
    halo(44, 92, 22),
    head(44, 92, r=16, hair_dx=-4, hair_dy=-2),
    # neck arched up, torso horizontal extending right
    torso("M56,106 C78,100 104,104 128,112 C146,118 148,142 130,146 "
          "C106,152 78,150 58,140 C46,134 44,112 56,106 Z"),
    # elbows on ground at front (left), forearms down
    limb("M58,110 C50,128 46,150 48,168", 12),
    limb("M66,116 C60,134 58,154 60,170", 11),
    foot(48, 170, 9, 5), foot(60, 172, 9, 5),  # forearms/hands on ground
    # legs extending back (right), slightly bent
    limb("M126,128 C150,134 172,140 188,146", 14),
    limb("M124,136 C148,146 170,154 186,162", 13),
    foot(190, 146, 8, 5, rot=75), foot(188, 164, 8, 5, rot=75),
    gold_curve("M60,120 C86,124 112,126 132,130", 1.0, 0.4),
    gold_curve("M46,184 L192,184", 1.0, 0.25),  # ground
)

# =====================================================================
# 18. dynamic-reach  (one arm up to top, other down-back, weight one foot)
# =====================================================================
SPRITES['dynamic-reach'] = wrap(
    halo(104, 44),
    head(104, 44, hair_dx=2),
    # torso leaning toward raised arm (right/up)
    torso("M84,72 C80,96 82,120 90,152 C94,172 118,170 120,150 "
          "C126,120 126,96 122,72 C114,64 92,64 84,72 Z"),
    # right arm fully extended UP to top of svg
    limb("M118,78 C132,52 138,28 136,10", 12),
    foot(136, 8, 5, 5),
    # left arm down and back
    limb("M86,78 C70,100 58,128 52,158", 12),
    foot(50, 160, 8, 4),
    # legs: weight on right, left slightly lifted
    limb("M94,154 C98,194 100,232 100,266", 13),    # weight leg
    limb("M112,154 C118,188 118,222 112,252", 13),  # lifted (foot higher)
    foot(100, 268, 8, 4), foot(110, 254, 8, 4),
    gold_curve("M104,72 C110,100 96,126 100,152", 1.0, 0.4),
)

# =====================================================================
# 19. mid-jump  (both feet off ground, arms raised, body arc)
# =====================================================================
SPRITES['mid-jump'] = wrap(
    halo(100, 46),
    head(100, 46),
    # torso with joyful arc
    torso("M82,74 C78,98 80,120 86,150 C90,168 112,168 116,150 "
          "C122,120 124,98 120,74 C112,66 90,66 82,74 Z"),
    # arms raised overhead/out
    limb("M84,80 C66,58 58,34 60,18", 12),
    limb("M118,80 C136,58 144,34 142,18", 12),
    foot(60, 16, 5, 5), foot(142, 16, 5, 5),
    # legs bent, feet OFF ground (gap below ~y=250, frame to 320)
    limb("M90,152 C82,178 74,198 68,214", 13),
    limb("M112,152 C122,176 132,196 140,212", 13),
    foot(66, 216, 8, 5, rot=-25), foot(142, 214, 8, 5, rot=25),
    # gap shown with motion lines below
    gold_curve("M60,250 C90,244 110,244 140,250", 1.0, 0.25),
    gold_curve("M70,266 C95,260 108,260 132,266", 1.0, 0.2),
    gold_curve("M100,74 C104,102 96,126 100,152", 1.0, 0.4),
)

# =====================================================================
# 20. spin  (one foot down, other leg out, dancer arms)
# =====================================================================
SPRITES['spin'] = wrap(
    halo(98, 40),
    head(98, 40, hair_dx=-2),
    torso("M82,70 C78,94 80,116 84,146 C88,166 110,166 114,146 "
          "C120,116 122,94 118,70 C110,62 90,62 82,70 Z"),
    # arms: one up, one out (dancer)
    limb("M116,76 C132,54 140,34 140,18", 12),      # one up
    foot(140, 16, 5, 5),
    limb("M84,78 C62,84 42,92 26,100", 12),         # one out to side
    foot(24, 102, 8, 4),
    # one leg on ground (right), other kicked out to side (left)
    limb("M100,148 C104,190 106,230 106,266", 13),  # support leg
    foot(106, 268, 8, 4),
    limb("M92,150 C68,158 46,168 28,180", 14),      # extended leg out
    foot(24, 182, 9, 5, rot=40),
    # motion swirl
    gold_curve("M60,140 C40,160 40,200 64,220", 1.4, 0.35),
    gold_curve("M98,70 C104,98 92,124 96,148", 1.0, 0.4),
)

# =====================================================================
# 21. editorial-reach  (profile facing left, arm forward-up diagonal)
# =====================================================================
SPRITES['editorial-reach'] = wrap(
    halo(92, 40),
    # profile head facing left: hair mass to the right/back
    f'<ellipse cx="100" cy="36" rx="20" ry="20" fill="{EMERALD}" opacity="0.5"/>',
    f'<circle cx="90" cy="40" r="17" fill="{BODY}" opacity="0.82"/>',
    # nose hint
    f'<path d="M74,40 C70,42 70,46 74,48" stroke="{BODY}" stroke-width="4" fill="none" opacity="0.82" stroke-linecap="round"/>',
    # torso profile, slight forward lean (leaning left)
    torso("M84,66 C80,92 82,118 88,150 C92,170 114,168 114,148 "
          "C118,116 116,92 110,68 C102,60 90,58 84,66 Z"),
    # front arm reaching forward-up diagonally (to upper-left)
    limb("M88,74 C68,58 50,40 38,22", 12),
    foot(36, 20, 5, 5),
    # trailing arm back framing torso
    limb("M108,76 C118,100 116,128 106,150", 11, opacity=0.7),
    # legs, slight forward lean
    limb("M92,152 C88,190 84,230 80,266", 13),
    limb("M110,152 C112,190 112,230 112,266", 13),
    foot(78, 268, 8, 4), foot(112, 268, 8, 4),
    gold_curve("M90,66 C86,96 96,122 94,150", 1.0, 0.4),
)

# =====================================================================
# 22. face-touch  (both hands framing face, fingers spread)
# =====================================================================
SPRITES['face-touch'] = wrap(
    halo(100, 56),
    head(100, 56),
    torso("M82,86 C78,110 80,134 86,164 C90,184 112,184 116,164 "
          "C122,134 124,110 120,86 C112,78 90,78 82,86 Z"),
    # both arms bent up, hands at face level (y~50-70)
    limb("M84,90 C68,84 58,72 66,58", 12),
    limb("M82,64 C74,58 72,50 78,44", 9),    # forearm/hand to face left
    limb("M116,90 C132,84 142,72 134,58", 12),
    limb("M118,64 C126,58 128,50 122,44", 9),  # hand to face right
    # spread fingers hints (gold)
    gold_curve("M78,46 L74,38", 1.2, 0.5), gold_curve("M82,45 L80,36", 1.2, 0.5),
    gold_curve("M122,46 L126,38", 1.2, 0.5), gold_curve("M118,45 L120,36", 1.2, 0.5),
    # legs
    limb("M90,166 C88,204 88,240 88,272", 13),
    limb("M110,166 C112,204 112,240 112,272", 13),
    foot(86, 274, 8, 4), foot(114, 274, 8, 4),
    gold_curve("M100,86 C96,116 104,142 100,166", 1.0, 0.4),
)

# =====================================================================
# 23. look-away  (strict profile facing left, chin up, long neck)
# =====================================================================
SPRITES['look-away'] = wrap(
    halo(96, 38),
    # profile head, chin elevated (tilted up), hair back
    f'<ellipse cx="106" cy="32" rx="19" ry="19" fill="{EMERALD}" opacity="0.5"/>',
    f'<circle cx="94" cy="36" r="16" fill="{BODY}" opacity="0.82"/>',
    # chin up: jaw/nose pointing up-left
    f'<path d="M80,34 C74,32 72,28 76,24" stroke="{BODY}" stroke-width="4" fill="none" opacity="0.82" stroke-linecap="round"/>',
    # long elegant neck line
    limb("M96,52 C94,60 96,66 100,72", 9),
    gold_curve("M88,54 C88,62 90,68 94,72", 1.0, 0.45),  # neck accent
    # body straight, near shoulder visible
    torso("M86,74 C82,100 84,126 90,158 C94,178 116,176 116,156 "
          "C120,124 118,100 112,76 C104,68 92,66 86,74 Z"),
    limb("M112,80 C124,106 126,134 124,164", 12),  # near arm
    # far arm hidden - subtle
    limb("M90,80 C82,104 82,132 92,158", 10, opacity=0.6),
    limb("M94,160 C90,198 88,236 86,272", 13),
    limb("M112,160 C114,198 114,236 114,272", 13),
    foot(84, 274, 8, 4), foot(114, 274, 8, 4),
    gold_curve("M100,76 C96,106 104,132 100,160", 1.0, 0.4),
)

# =====================================================================
# 24. peek-shoulder  (3/4 back view, head turned back over shoulder)
# =====================================================================
SPRITES['peek-shoulder'] = wrap(
    halo(94, 40),
    # back of head (hair mass forward/left since turned), face peeking right
    f'<ellipse cx="94" cy="36" rx="20" ry="21" fill="{EMERALD}" opacity="0.55"/>',
    f'<circle cx="98" cy="40" r="15" fill="{BODY}" opacity="0.82"/>',
    # face peeking to the right (nose hint right)
    f'<path d="M112,40 C116,42 116,46 112,48" stroke="{BODY}" stroke-width="4" fill="none" opacity="0.82" stroke-linecap="round"/>',
    # torso: back visible, slight twist
    torso("M80,68 C76,94 80,120 84,152 C88,172 112,172 116,150 "
          "C120,120 122,94 118,68 C110,60 88,60 80,68 Z"),
    # back detail line (spine down center of back)
    gold_curve("M100,70 C102,100 98,128 100,154", 1.2, 0.45),
    # shoulder blades hint
    gold_curve("M88,84 C92,96 96,96 98,86", 0.9, 0.35),
    gold_curve("M102,86 C104,96 108,96 112,84", 0.9, 0.35),
    # arms at sides
    limb("M84,74 C72,100 70,128 72,158", 12),
    limb("M116,74 C128,100 130,128 128,158", 12),
    # legs (twist)
    limb("M90,154 C88,192 86,230 88,268", 13),
    limb("M110,154 C114,192 116,230 114,268", 13),
    foot(88, 270, 8, 4), foot(114, 270, 8, 4),
)

# =====================================================================
# 25. couple-embrace  (two figures, one behind other, arms wrapped)
# =====================================================================
SPRITES['couple-embrace'] = wrap(
    # ---- BACK person (opacity 0.55), shifted right/behind ----
    halo(118, 40),
    f'<ellipse cx="120" cy="34" rx="20" ry="22" fill="{EMERALD}" opacity="0.4"/>',
    f'<circle cx="118" cy="40" r="17" fill="{BODY}" opacity="0.55"/>',
    torso("M104,70 C100,96 102,122 108,154 C112,174 138,172 138,150 "
          "C142,120 142,96 138,70 C130,62 112,60 104,70 Z", opacity=0.55),
    # back person legs
    limb("M112,156 C110,194 110,232 112,268", 13, opacity=0.55),
    limb("M132,156 C136,194 138,230 136,268", 13, opacity=0.55),
    foot(110, 270, 8, 4, opacity=0.55), foot(138, 270, 8, 4, opacity=0.55),
    # ---- FRONT person (opacity 0.85), shifted left, angled ----
    halo(82, 46),
    head(82, 46),
    torso("M64,76 C60,102 62,128 68,158 C72,178 98,176 98,154 "
          "C102,124 102,100 98,76 C90,68 72,66 64,76 Z", opacity=0.85),
    # front person legs
    limb("M74,160 C72,198 70,234 70,270", 13, opacity=0.85),
    limb("M92,160 C94,198 94,234 92,270", 13, opacity=0.85),
    foot(70, 272, 8, 4), foot(92, 272, 8, 4),
    # ---- BACK person arms wrapping around FRONT person's waist ----
    limb("M136,90 C118,120 96,138 74,146", 11, opacity=0.6),
    limb("M108,92 C96,118 82,134 66,146", 11, opacity=0.6),
    # front person near arm resting
    limb("M96,82 C108,106 110,132 104,156", 11, opacity=0.85),
    gold_curve("M82,76 C78,106 84,132 82,156", 1.0, 0.4),
    gold_curve("M118,70 C120,100 116,126 118,154", 1.0, 0.3),
)

# =====================================================================
# 26. seated-expressive  (seated, arms wide/overhead, joyful)
# =====================================================================
SPRITES['seated-expressive'] = wrap(
    halo(100, 50),
    head(100, 50),
    # chair/seat hint (gold)
    gold_curve("M64,196 L136,196", 1.4, 0.3),
    gold_curve("M70,196 L70,262", 1.2, 0.3),
    gold_curve("M130,196 L130,262", 1.2, 0.3),
    # seated torso
    torso("M82,82 C78,106 80,132 86,164 C90,188 112,188 116,164 "
          "C122,132 124,106 120,82 C112,74 90,74 82,82 Z"),
    # arms extended WIDE (expressive)
    limb("M84,88 C60,78 40,66 26,50", 12),
    limb("M116,88 C140,78 160,66 174,50", 12),
    foot(24, 48, 6, 5), foot(176, 48, 6, 5),
    # legs parallel to seat (thighs forward, sitting)
    limb("M88,182 C92,196 116,198 132,196", 14),
    limb("M112,182 C116,196 140,198 152,196", 14),
    limb("M132,196 C136,214 136,236 134,252", 13),
    limb("M152,196 C156,214 156,236 154,252", 13),
    foot(134, 254, 8, 5), foot(154, 254, 8, 5),
    gold_curve("M100,82 C96,114 104,142 100,168", 1.0, 0.4),
    gold_curve("M88,100 C94,124 108,124 114,102", 0.9, 0.3),
)

# ---- write JS file ----
import os
os.makedirs('/home/user/workspace/poseart-app-v2/js', exist_ok=True)

order = ['standing-neutral','scurve','hip-shift','arms-overhead','wind-pose',
         'seated-upright','seated-crossleg','seated-lean-forward','elbow-prop',
         'wall-lean','doorframe-lean','back-wall-prop','kneeling-one','kneeling-both',
         'side-recline','back-prop','prone','dynamic-reach','mid-jump','spin',
         'editorial-reach','face-touch','look-away','peek-shoulder','couple-embrace',
         'seated-expressive']

assert len(order) == 26, len(order)
assert set(order) == set(SPRITES.keys()), set(order) ^ set(SPRITES.keys())

lines = []
lines.append('// PoseArt \u2014 Pose Sprite Library v2')
lines.append('// 26 anatomically-accurate Art Nouveau pose silhouettes')
lines.append('// viewBox: 0 0 200 320 for all sprites')
lines.append('')
lines.append('const POSE_SPRITES = {')
for k in order:
    svg = SPRITES[k]
    lines.append(f"  '{k}': `{svg}`,")
lines.append('};')
lines.append('')
lines.append('// Helper: get sprite SVG for a pose, with size override')
lines.append('function getPoseSprite(figureKey, opts = {}) {')
lines.append('  const { width = 200, height = 280 } = opts;')
lines.append("  const base = POSE_SPRITES[figureKey] || POSE_SPRITES['standing-neutral'];")
lines.append('  return base')
lines.append('    .replace(/width="\\d+"/, `width="${width}"`)')
lines.append('    .replace(/height="\\d+"/, `height="${height}"`);')
lines.append('}')
lines.append('')
lines.append('if (typeof module !== "undefined" && module.exports) {')
lines.append('  module.exports = { POSE_SPRITES, getPoseSprite };')
lines.append('}')
lines.append('')

with open('/home/user/workspace/poseart-app-v2/js/pose-sprites.js', 'w') as f:
    f.write('\n'.join(lines))

print("Wrote", len(SPRITES), "sprites")
# Also dump individual SVG files for preview
os.makedirs('/home/user/workspace/sprite_preview', exist_ok=True)
for k in order:
    with open(f'/home/user/workspace/sprite_preview/{k}.svg','w') as f:
        f.write(SPRITES[k])
print("Preview SVGs written")
