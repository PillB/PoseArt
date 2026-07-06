# PoseArt v2 — Subagent Context

## App Identity
- Name: PoseArt — "Move like art."
- Platform: Mobile-first static web app (430×932px)
- Palette "Peacock Fresco": Deep Teal #0F3B3A, Emerald #1E7A74, Cobalt #2B5FAD, Antique Gold #C9A24C, Parchment #F6F0E1
- Typography: Cormorant Garamond (display) + Inter (body) + Cinzel Decorative (wordmark)
- Navigation v2: 5-tab — Home | Poses | Gallery (center gold pill) | Progress | Profile
- CRITICAL: NEVER use localStorage/sessionStorage/cookies — in-memory only
- Static web app: pure HTML + CSS + JS, no Node.js/npm

## Files Structure
/home/user/workspace/poseart-app-v2/
  css/tokens.css  (175 lines, Art Nouveau CSS variables)
  js/poses-data.js  (674 lines, 75 poses across 10 categories)
  js/pose-sprites.js  (45 lines, 26 SVG sprites)
  js/camera.js  (601 lines, complete ghost overlay camera engine)
  js/app.js  (968 lines, complete app controller)

## Pose Categories (10 total)
- standing: 10 → need 30+ (add 20+)
- seated: 8 → need 30+ (add 22+)
- leaning: 6 → need 30+ (add 24+)
- lean-seat: 5 → need 30+ (add 25+)
- kneeling: 4 → need 30+ (add 26+)
- reclining: 5 → need 30+ (add 25+)
- dynamic: 8 → need 30+ (add 22+)
- eccentric: 6 → need 30+ (add 24+)
- couple: 8 → need 30+ (add 22+)
- accessible: 5 → need 30+ (add 25+)

## Figure types used in app.js renderPoseFigureSVG (already has inline SVG):
scurve, standing-front, arm-reach, seated-side, seated-floor, hip-shift, 
elbow-prop, kneeling, side-recline, couple-embrace, upper-body, dynamic-reach, 
wall-lean, default

## Pose data structure (EXACT FORMAT — must match):
'pose-id': {
  id: 'pose-id', category: 'standing', name: 'Display Name',
  difficulty: 'Beginner'|'Intermediate'|'Advanced', 
  angle: 'Front'|'3/4 View'|'Side'|'Back',
  intent: 'Photography'|'Editorial'|'Artistic'|'Social', 
  effort: 'Static'|'Active'|'Sudden-Free',
  instructions: 'Clear step-by-step instruction text.',
  tip: 'Single actionable photography tip.',
  joints: { rightKnee: -15, leftHip: 8, ... },  // joint angle offsets for ghost overlay
  color: 'var(--color-teal-100)',  // CSS variable or rgba
  figure: 'scurve',  // one of the figure keys above
  tags: ['tag1', 'tag2', ...]
}

## Available CSS color vars (from tokens.css):
--color-teal-100: rgba(30,122,116,0.15)
--color-teal-200: rgba(30,122,116,0.25)  
--color-cobalt-200: rgba(43,95,173,0.15)
--color-gold-300: rgba(201,162,76,0.15)
--color-parchment-200: rgba(246,240,225,0.25)

## Joint keys for ghost overlay:
leftShoulder, rightShoulder, leftElbow, rightElbow,
leftHip, rightHip, leftKnee, rightKnee, spine, neck

