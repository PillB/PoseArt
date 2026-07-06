// ============================================================
// PoseArt v2 — Pose Library Data
// 60+ poses across 10 categories. Auto-computed category counts.
// In-memory storage only (no localStorage — iframe-blocked).
// ============================================================

// ── RAW CATEGORY DEFINITIONS (counts recomputed below) ──
const POSE_CATEGORIES_RAW = [
  { id: 'standing',   name: 'Standing',           emoji: '🧍', color: 'linear-gradient(135deg,#0F3B3A,#1E7A74)', description: 'Upright poses using weight shifts and S-curves' },
  { id: 'seated',     name: 'Seated',             emoji: '💺', color: 'linear-gradient(135deg,#1E7A74,#2E958E)', description: 'Floor, chair, and edge-seated positions' },
  { id: 'leaning',    name: 'Leaning — Standing', emoji: '🧱', color: 'linear-gradient(135deg,#2B5FAD,#4A79C4)', description: 'Wall, surface, and doorframe leans' },
  { id: 'lean-seat',  name: 'Leaning — Seated',   emoji: '🤲', color: 'linear-gradient(135deg,#4A79C4,#5CB3AC)', description: 'Elbow props and chin rests while seated' },
  { id: 'kneeling',   name: 'Kneeling',           emoji: '🙏', color: 'linear-gradient(135deg,#9C7B34,#C9A24C)', description: 'One and two-knee positions' },
  { id: 'reclining',  name: 'Reclining',          emoji: '🛋️', color: 'linear-gradient(135deg,#C9A24C,#D4B368)', description: 'Side, back, and prone lying poses' },
  { id: 'dynamic',    name: 'Dynamic',            emoji: '🕺', color: 'linear-gradient(135deg,#6D4A72,#9C5F80)', description: 'In-motion, dance, and action poses' },
  { id: 'eccentric',  name: 'Eccentric',          emoji: '✨', color: 'linear-gradient(135deg,#4a2f6d,#6D4A72)', description: 'Editorial, creative, and high-concept' },
  { id: 'couple',     name: 'Couple',             emoji: '💑', color: 'linear-gradient(135deg,#C96A4C,#D4884C)', description: 'Two-person interaction sequences' },
  { id: 'accessible', name: 'Accessible',         emoji: '♿', color: 'linear-gradient(135deg,#4CAF7D,#2E958E)', description: 'Wheelchair and limited-mobility adaptations' },
];

// ── POSE LIBRARY (60+ poses) ──
const POSES_LIBRARY = {
  // ══════════════ STANDING (10) ══════════════
  'scurve-stand': {
    id: 'scurve-stand', category: 'standing', name: 'S-Curve Stand',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand with feet hip-width apart. Shift your weight onto your back leg, letting your front leg bend naturally at the knee. Create an S-curve through your spine by tilting your hips, arching slightly, and elongating your neck.',
    tip: 'Avoid squaring your shoulders to the camera — angle your torso for visual depth.',
    joints: { rightKnee: -15, leftHip: 8, spine: 5, neck: -10 },
    color: 'var(--color-teal-100)', figure: 'scurve',
    tags: ['portrait', 'beginner', 'standing', 'classic']
  },
  'power-stance': {
    id: 'power-stance', category: 'standing', name: 'Power Stance',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand with feet shoulder-width apart, weight evenly distributed. Shoulders relaxed and back. Arms slightly away from body, hands loose. Chin level, gaze direct.',
    tip: 'Relaxed hands are key — shake them out before the shot to release tension.',
    joints: { leftShoulder: -5, rightShoulder: -5, neck: 0 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['confident', 'beginner', 'standing', 'front']
  },
  'hip-shift': {
    id: 'hip-shift', category: 'standing', name: 'Hip Shift',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand with feet slightly apart. Shift your hip to one side to create a "C" shape in your spine. One hand on hip, opposite arm relaxed. Weight on the foot opposite the shifted hip.',
    tip: 'The triangle negative space between arm and waist visually slims the torso.',
    joints: { leftHip: 15, rightHip: -8, leftElbow: 45 },
    color: 'var(--color-teal-100)', figure: 'hip-shift',
    tags: ['flattering', 'beginner', 'standing']
  },
  'model-walk': {
    id: 'model-walk', category: 'standing', name: 'Model Walk',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Capture yourself mid-stride, one foot in front of the other. Let one arm swing naturally forward and the other trail back. Shift your weight onto the leading leg for a confident runway feel.',
    tip: 'Take a real step just before the shutter — motion looks far more natural than a held pose.',
    joints: { leftHip: 12, rightHip: -12, leftShoulder: 15, rightShoulder: -15, spine: 4 },
    color: 'var(--color-teal-200)', figure: 'dynamic-reach',
    tags: ['editorial', 'intermediate', 'standing', 'motion']
  },
  'crossed-arms-stand': {
    id: 'crossed-arms-stand', category: 'standing', name: 'Crossed Arms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand tall and cross your arms at chest height, resting them lightly rather than gripping. Add a slight head tilt for warmth. Keep shoulders relaxed and down.',
    tip: 'Let your hands rest gently — a tense grip reads as defensive rather than confident.',
    joints: { leftElbow: 100, rightElbow: 100, neck: -6 },
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['confident', 'beginner', 'standing', 'front']
  },
  'hand-in-pocket': {
    id: 'hand-in-pocket', category: 'standing', name: 'Hand in Pocket',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Slip one hand deep into a pocket, letting the shoulder drop naturally. Keep the opposite arm loose at your side. Angle your body three-quarters to the camera.',
    tip: 'Leave the thumb out of the pocket — it keeps the hand looking relaxed, not stuffed.',
    joints: { leftShoulder: -12, leftElbow: 40, spine: 3 },
    color: 'var(--color-teal-200)', figure: 'hip-shift',
    tags: ['casual', 'beginner', 'standing', 'social']
  },
  'shoulder-drop': {
    id: 'shoulder-drop', category: 'standing', name: 'Shoulder Drop',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Raise one shoulder slightly while dropping the opposite one, shifting your weight onto the back foot. This asymmetry creates a relaxed, editorial line through the upper body.',
    tip: 'The diagonal from a raised shoulder to a dropped hip creates elegant visual tension.',
    joints: { leftShoulder: -18, rightShoulder: 8, spine: 6, rightHip: -6 },
    color: 'var(--color-teal-100)', figure: 'scurve',
    tags: ['editorial', 'intermediate', 'standing']
  },
  'arms-overhead': {
    id: 'arms-overhead', category: 'standing', name: 'Arms Overhead',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Raise both arms above your head, letting your spine arch gently backward. Lengthen through the ribs and keep the chin lifted. Creates a bold, open silhouette.',
    tip: 'Keep a soft bend in the elbows — locked-straight arms look stiff and photograph harshly.',
    joints: { leftShoulder: -150, rightShoulder: -150, spine: -12, neck: -18 },
    color: 'var(--color-teal-200)', figure: 'arm-reach',
    tags: ['artistic', 'intermediate', 'standing', 'expressive']
  },
  'wind-pose': {
    id: 'wind-pose', category: 'standing', name: 'Wind Pose',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Sudden-Free',
    instructions: 'Imagine a breeze catching your hair and clothes. Lean slightly into the wind, extend one arm outward, and let the other cross the body. Turn your face toward the imagined gust.',
    tip: 'A real motion — a small sway or a hand through the hair — sells the illusion of wind.',
    joints: { leftShoulder: -70, rightShoulder: 30, spine: 10, neck: -12 },
    color: 'rgba(30,122,116,0.15)', figure: 'arm-reach',
    tags: ['editorial', 'advanced', 'standing', 'motion']
  },
  'contrapposto': {
    id: 'contrapposto', category: 'standing', name: 'Contrapposto',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Shift nearly all your weight onto one leg, letting the other bend and relax. Allow your hips and shoulders to tilt in opposite directions, forming the classical S-curve of the spine.',
    tip: 'One arm engaged, one arm relaxed — the classical sculptors always balanced tension with ease.',
    joints: { rightKnee: -20, leftHip: 14, spine: 8, leftShoulder: -8 },
    color: 'var(--color-teal-100)', figure: 'scurve',
    tags: ['artistic', 'intermediate', 'standing', 'classic']
  },

  // ══════════════ SEATED (8) ══════════════
  'soft-sit': {
    id: 'soft-sit', category: 'seated', name: 'Soft Sit',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on the edge of a chair or surface, not the full depth. Lean slightly forward with a straight back. Angle your knees to one side rather than square to camera.',
    tip: 'Sitting on the edge prevents slouching and keeps the silhouette elegant.',
    joints: { spine: -5, leftKnee: 90, rightKnee: 95, neck: -8 },
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['portrait', 'beginner', 'seated']
  },
  'floor-cross-leg': {
    id: 'floor-cross-leg', category: 'seated', name: 'Cross-Legged',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the floor with your legs crossed and your back straight. Rest your hands lightly on your knees. Lengthen through the crown of the head for a grounded, calm posture.',
    tip: 'Sit on the front edge of your sit bones — it lifts the spine and prevents a rounded back.',
    joints: { spine: 0, leftKnee: 120, rightKnee: 120, neck: -4 },
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['calm', 'beginner', 'seated', 'floor']
  },
  'chair-lean-forward': {
    id: 'chair-lean-forward', category: 'seated', name: 'Chair Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on a chair and lean forward, resting your elbows on your knees. Keep the spine long even as you tip forward from the hips. Clasp your hands or let them hang loosely.',
    tip: 'Hinge from the hips, not the upper back — it keeps the chest open and confident.',
    joints: { spine: -18, leftElbow: 85, rightElbow: 85, neck: -6 },
    color: 'var(--color-teal-200)', figure: 'elbow-prop',
    tags: ['thoughtful', 'beginner', 'seated', 'chair']
  },
  'side-straddle': {
    id: 'side-straddle', category: 'seated', name: 'Side Straddle',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Straddle a chair sideways so the backrest sits beside you. Drape both arms over the top of the backrest and turn your torso toward the camera for a casual, confident line.',
    tip: 'Turning your torso away from the chair back adds a flattering twist to the pose.',
    joints: { spine: 8, leftElbow: 70, rightElbow: 70, neck: -8 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'chair']
  },
  'window-seat': {
    id: 'window-seat', category: 'seated', name: 'Window Seat',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Draw your knees up toward your chest and wrap your arms around them. Rest your chin or cheek on your knees. Creates an intimate, cozy, contemplative mood.',
    tip: 'Let one shoulder drop toward the knees — it softens the pose and adds a gentle curve.',
    joints: { spine: -20, leftKnee: 45, rightKnee: 45, neck: -14 },
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['cozy', 'beginner', 'seated', 'intimate']
  },
  'throne-sit': {
    id: 'throne-sit', category: 'seated', name: 'Throne Sit',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit upright and regal with both forearms resting on the armrests. Square your shoulders, lift the chin, and hold a poised, commanding posture.',
    tip: 'Keep both feet planted and knees slightly apart — it reads as grounded authority.',
    joints: { spine: 0, leftElbow: 90, rightElbow: 90, neck: -2 },
    color: 'var(--color-gold-300)', figure: 'seated-side',
    tags: ['regal', 'beginner', 'seated', 'editorial']
  },
  'feet-up': {
    id: 'feet-up', category: 'seated', name: 'Feet Up',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Recline casually with your feet propped on a nearby surface. Let your body sink back and one arm rest behind your head for a relaxed, off-duty vibe.',
    tip: 'A slight smile and relaxed shoulders complete the effortless, casual look.',
    joints: { spine: 12, leftKnee: 130, rightKnee: 130, neck: 6 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['casual', 'beginner', 'seated', 'social']
  },
  'cross-ankle-sit': {
    id: 'cross-ankle-sit', category: 'seated', name: 'Ankle Cross',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit with both feet flat, then cross one ankle over the opposite knee in a figure-four. Rest a hand on the raised ankle and keep the torso open and tall.',
    tip: 'Angle the raised knee slightly away from camera to avoid blocking your torso.',
    joints: { spine: 4, leftKnee: 95, rightKnee: 60, neck: -4 },
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['relaxed', 'beginner', 'seated', 'chair']
  },

  // ══════════════ LEANING — STANDING (6) ══════════════
  'wall-lean': {
    id: 'wall-lean', category: 'leaning', name: 'Wall Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand with your side against a wall and lean your shoulder against it. Cross one ankle over the other. Keep arms relaxed — one can rest in a pocket.',
    tip: 'The diagonal line from feet to shoulder creates visual interest. Play with weight distribution.',
    joints: { leftShoulder: -10, spine: 8, rightAnkle: 15 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning']
  },
  'doorframe-lean': {
    id: 'doorframe-lean', category: 'leaning', name: 'Doorframe Lean',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Reach both hands up to grip a doorframe above your head. Let your body curve gently through, weight settling into the hips. Creates a long, elegant vertical line.',
    tip: 'Do not fully hang — keep tension in the arms so the shoulders stay open and lifted.',
    joints: { leftShoulder: -140, rightShoulder: -140, spine: 8, leftElbow: 20, rightElbow: 20 },
    color: 'var(--color-cobalt-200)', figure: 'arm-reach',
    tags: ['editorial', 'intermediate', 'leaning', 'front']
  },
  'shoulder-lean': {
    id: 'shoulder-lean', category: 'leaning', name: 'Shoulder Lean',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Press both shoulders back against a wall while keeping the hips slightly forward. Cross your arms or let them hang at your sides for a relaxed, grounded stance.',
    tip: 'Walking the feet a step away from the wall creates a flattering slight recline.',
    joints: { leftShoulder: -6, rightShoulder: -6, spine: -4, leftElbow: 95, rightElbow: 95 },
    color: 'var(--color-cobalt-200)', figure: 'standing-front',
    tags: ['relaxed', 'beginner', 'leaning', 'front']
  },
  'hip-lean': {
    id: 'hip-lean', category: 'leaning', name: 'Hip Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Rest one hip against a table or ledge, arms relaxed at your sides. Let the supported leg take your weight while the other stays loose. Casual and effortless.',
    tip: 'Keep the free hand busy — resting on the surface or in a pocket — to avoid stiff arms.',
    joints: { leftHip: 12, spine: 5, rightKnee: -8 },
    color: 'var(--color-cobalt-200)', figure: 'hip-shift',
    tags: ['casual', 'beginner', 'leaning', 'social']
  },
  'back-wall-prop': {
    id: 'back-wall-prop', category: 'leaning', name: 'Back Wall Prop',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Rest your full back against a wall, then bend one knee and plant that foot flat against the wall behind you. Keep the torso open and gaze off-camera.',
    tip: 'The bent knee adds a strong geometric shape — angle it slightly toward the lens.',
    joints: { spine: 2, leftKnee: 70, rightKnee: 0, neck: -6 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning']
  },
  'elbow-ledge': {
    id: 'elbow-ledge', category: 'leaning', name: 'Elbow Ledge',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest both elbows on a ledge or shelf and let your weight settle forward. Keep the back long and the chin lifted for a relaxed, engaged expression.',
    tip: 'Leaning forward onto the ledge naturally opens the chest and lengthens the neckline.',
    joints: { spine: -10, leftElbow: 100, rightElbow: 100, neck: -4 },
    color: 'var(--color-cobalt-200)', figure: 'elbow-prop',
    tags: ['relaxed', 'beginner', 'leaning']
  },

  // ══════════════ LEANING — SEATED (5) ══════════════
  'elbow-prop': {
    id: 'elbow-prop', category: 'lean-seat', name: 'Elbow Prop',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on a surface, lean forward, and rest one or both elbows on your knees. Lean your chin into your hand or let the hands hang naturally.',
    tip: 'Prop your chin gently on fingers — gripping the face reads as tension.',
    joints: { spine: -15, leftElbow: 90, rightElbow: 75, neck: -12 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['thoughtful', 'beginner', 'seated', 'leaning']
  },
  'chin-rest': {
    id: 'chin-rest', category: 'lean-seat', name: 'Chin Rest',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest a single elbow on your knee and delicately balance your chin in your open palm. Keep the fingers soft along the jaw for a gentle, contemplative portrait.',
    tip: 'Rest the jaw on the side of the index finger, not the full hand, to avoid squishing the cheek.',
    joints: { spine: -12, leftElbow: 95, neck: -14 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['portrait', 'beginner', 'seated', 'leaning']
  },
  'double-elbow': {
    id: 'double-elbow', category: 'lean-seat', name: 'Double Elbow',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Rest both elbows on a table and clasp your hands beneath your chin. Lean forward slightly, engaging the camera with a direct, warm gaze.',
    tip: 'Keep the shoulders down and away from the ears — leaning in can hunch them upward.',
    joints: { spine: -14, leftElbow: 100, rightElbow: 100, neck: -8 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['editorial', 'beginner', 'seated', 'leaning']
  },
  'side-lean-seated': {
    id: 'side-lean-seated', category: 'lean-seat', name: 'Side Lean',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Seated, lean to one side and extend that arm along the surface behind or beside you. Let the opposite shoulder lift, creating a long diagonal through the torso.',
    tip: 'The extended arm should look relaxed and draped, never rigid or propping stiffly.',
    joints: { spine: 14, leftElbow: 30, neck: -6 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['relaxed', 'intermediate', 'seated', 'leaning']
  },
  'backward-lean-chair': {
    id: 'backward-lean-chair', category: 'lean-seat', name: 'Chair Reach',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Reach one arm back over the top of the chair as your torso twists to follow. The opposite hand can rest on your thigh. A dynamic, editorial seated twist.',
    tip: 'Lead the twist with your gaze — where the eyes go, the elegant line follows.',
    joints: { spine: 18, rightShoulder: -60, neck: 10 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'advanced', 'seated', 'leaning']
  },

  // ══════════════ KNEELING (4) ══════════════
  'knights-kneel': {
    id: 'knights-kneel', category: 'kneeling', name: "Knight's Kneel",
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One knee on the floor, the other leg bent at 90° with foot flat. Upright torso, chest open, one hand resting on the raised knee.',
    tip: 'Keep the down-knee directly under your hip — this prevents an awkward backward lean.',
    joints: { leftKnee: 90, rightKnee: 0, spine: -3, neck: -5 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['strong', 'beginner', 'kneeling']
  },
  'both-knees': {
    id: 'both-knees', category: 'kneeling', name: 'Both Knees',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel with both knees on the ground and an upright torso. Let your arms rest naturally at your sides or on your thighs. A grounded, symmetrical base.',
    tip: 'Lengthen up through the crown to avoid sitting back onto the heels and collapsing.',
    joints: { leftKnee: 0, rightKnee: 0, spine: 0, neck: -2 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['grounded', 'beginner', 'kneeling', 'front']
  },
  'sitting-on-heels': {
    id: 'sitting-on-heels', category: 'kneeling', name: 'Seiza',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit back gently onto your heels with knees together and hands folded in your lap. A calm, meditative kneeling posture with a straight spine.',
    tip: 'Relax the shoulders and soften the gaze — serenity is the whole point of this pose.',
    joints: { leftKnee: 20, rightKnee: 20, spine: 0, neck: -6 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['calm', 'beginner', 'kneeling', 'artistic']
  },
  'kneeling-reach': {
    id: 'kneeling-reach', category: 'kneeling', name: 'Kneeling Reach',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Sudden-Free',
    instructions: 'From one knee down, extend the opposite arm dramatically forward as if reaching toward something. Let the torso follow the reach for a dynamic diagonal.',
    tip: 'Extend from the shoulder blade, not just the hand — it makes the reach look powerful.',
    joints: { leftKnee: 90, rightKnee: 0, leftShoulder: -90, spine: 8 },
    color: 'var(--color-gold-300)', figure: 'arm-reach',
    tags: ['editorial', 'advanced', 'kneeling', 'motion']
  },

  // ══════════════ RECLINING (5) ══════════════
  'side-recline': {
    id: 'side-recline', category: 'reclining', name: 'Side Recline',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Lie on your side propped up on one elbow. Top leg straight or bent slightly forward, bottom leg straight. Head rested in your hand or lifted.',
    tip: 'Arch your back slightly and lift your head high — this elongates the neck and accentuates curves.',
    joints: { spine: 5, leftElbow: 90, neck: -15 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['elegant', 'beginner', 'reclining', 'side']
  },
  'back-prop': {
    id: 'back-prop', category: 'reclining', name: 'Backyard Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit and lean back onto both hands with your legs extended forward. Let the chest open toward the sky and the head tilt back slightly for a relaxed, sun-soaked feel.',
    tip: 'Point or flex the feet intentionally — dangling feet weaken the long line of the legs.',
    joints: { spine: 20, leftElbow: 10, rightElbow: 10, neck: 8 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['relaxed', 'beginner', 'reclining', 'social']
  },
  'prone-chin': {
    id: 'prone-chin', category: 'reclining', name: 'Prone Chin',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Lie face down and prop yourself up on both elbows, lifting the chin and chest. Let the lower legs bend up behind you for a playful, youthful portrait.',
    tip: 'Cross the ankles behind you and let them sway — it adds charm and movement.',
    joints: { spine: -22, leftElbow: 80, rightElbow: 80, neck: -18 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['playful', 'beginner', 'reclining', 'front']
  },
  'starfish': {
    id: 'starfish', category: 'reclining', name: 'Starfish',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie on your back and spread your arms and legs wide into a relaxed star shape. Let everything soften into the ground for an open, carefree composition.',
    tip: 'Shot from directly above, the symmetry becomes striking — vary limb angles slightly for interest.',
    joints: { spine: 0, leftShoulder: -60, rightShoulder: -60, leftHip: 30, rightHip: 30 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['carefree', 'beginner', 'reclining', 'artistic']
  },
  'side-fetal': {
    id: 'side-fetal', category: 'reclining', name: 'Side Curl',
    difficulty: 'Beginner', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Curl onto your side with knees drawn up toward the chest and hands tucked near the face. A soft, vulnerable, intimate composition.',
    tip: 'Keep a little space between chin and knees so the neck line stays visible and elegant.',
    joints: { spine: 10, leftKnee: 40, rightKnee: 40, neck: -10 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['intimate', 'beginner', 'reclining', 'side']
  },

  // ══════════════ DYNAMIC (8) ══════════════
  'dynamic-reach': {
    id: 'dynamic-reach', category: 'dynamic', name: 'Dynamic Reach',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Sudden-Free',
    instructions: 'From a natural stance, extend one arm powerfully upward while the opposite arm comes down and back. Slight lean toward the reaching arm, weight shifting to one foot.',
    tip: 'This works best mid-motion — set a 3-second timer and let the app auto-capture at peak.',
    joints: { leftShoulder: -110, rightShoulder: 40, leftHip: -8, spine: 12 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['editorial', 'intermediate', 'dynamic', 'motion']
  },
  'mid-jump': {
    id: 'mid-jump', category: 'dynamic', name: 'Mid Jump',
    difficulty: 'Advanced', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Jump with both feet off the ground and both arms raised in a burst of pure joy. Tuck the knees slightly and let the whole body express energy.',
    tip: 'Jump straight up rather than forward — it keeps you in focus and framed by the lens.',
    joints: { leftShoulder: -140, rightShoulder: -140, leftKnee: 40, rightKnee: 40 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['joyful', 'advanced', 'dynamic', 'motion']
  },
  'spin-pose': {
    id: 'spin-pose', category: 'dynamic', name: 'Spin',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Extend both arms out and rotate mid-spin, weight balanced on one foot. Let clothing and hair trail the motion for a swirling, kinetic frame.',
    tip: 'Spot a fixed point between spins to stay balanced and keep your expression composed.',
    joints: { leftShoulder: -80, rightShoulder: -80, spine: 12, leftHip: 10 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['editorial', 'advanced', 'dynamic', 'motion']
  },
  'run-stride': {
    id: 'run-stride', category: 'dynamic', name: 'Power Stride',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Freeze an exaggerated running stride with arms pumping and one knee driving high. Lean the torso slightly forward into the motion for athletic energy.',
    tip: 'Opposite arm to opposite leg — matching sides looks unnatural and awkward.',
    joints: { leftHip: 30, rightHip: -30, leftShoulder: 25, rightShoulder: -25, spine: 8 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'motion']
  },
  'leap-forward': {
    id: 'leap-forward', category: 'dynamic', name: 'Leap Forward',
    difficulty: 'Advanced', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Take one large forward stride, leaning your torso into it with arms swept back behind you. Captures the peak of a powerful leap.',
    tip: 'Sweeping the arms back exaggerates the sense of speed and forward momentum.',
    joints: { leftHip: 40, rightHip: -35, leftShoulder: 50, rightShoulder: 50, spine: 14 },
    color: 'rgba(109,74,114,0.2)', figure: 'arm-reach',
    tags: ['editorial', 'advanced', 'dynamic', 'motion']
  },
  'arm-throw': {
    id: 'arm-throw', category: 'dynamic', name: 'Arm Throw',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Sudden-Free',
    instructions: 'Throw both arms wide open and tilt your head back with abandon. An expansive, celebratory shape radiating freedom.',
    tip: 'Let the exhale and the head-tilt happen together — the release should feel genuine.',
    joints: { leftShoulder: -120, rightShoulder: -120, spine: -10, neck: 16 },
    color: 'rgba(109,74,114,0.2)', figure: 'arm-reach',
    tags: ['expressive', 'intermediate', 'dynamic', 'motion']
  },
  'dance-step': {
    id: 'dance-step', category: 'dynamic', name: 'Dance Step',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Raise one leg into a dance position while the arms frame the body in a graceful line. Point the toe and lengthen through the raised leg.',
    tip: 'Softly curved arms and a pointed toe transform a plain step into a dancer\u2019s line.',
    joints: { leftKnee: 60, leftShoulder: -40, rightShoulder: -70, spine: 6 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['graceful', 'intermediate', 'dynamic', 'motion']
  },
  'freeze-frame': {
    id: 'freeze-frame', category: 'dynamic', name: 'Freeze Frame',
    difficulty: 'Advanced', angle: 'Front', intent: 'Editorial', effort: 'Active',
    instructions: 'Hit a sharp, angular frozen pose like a street dancer catching a beat. Create hard geometric angles at the elbows and knees and hold it perfectly still.',
    tip: 'Sharp, deliberate angles read as intentional — soft or rounded shapes lose the effect.',
    joints: { leftElbow: 90, rightElbow: 45, leftKnee: 100, spine: 10 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['street', 'advanced', 'dynamic', 'motion']
  },

  // ══════════════ ECCENTRIC (6) ══════════════
  'editorial-arm-reach': {
    id: 'editorial-arm-reach', category: 'eccentric', name: 'Editorial Arm Reach',
    difficulty: 'Intermediate', angle: 'Profile', intent: 'Editorial', effort: 'Sudden-Free',
    instructions: 'Stand in profile and extend one arm forward and upward as if reaching toward something just out of frame. Slight lean forward from the hips.',
    tip: 'Let your gaze follow the direction of the reaching arm for visual continuity.',
    joints: { leftShoulder: -80, leftElbow: -20, spine: 10, neck: -15 },
    color: 'rgba(109,74,114,0.2)', figure: 'arm-reach',
    tags: ['editorial', 'intermediate', 'eccentric', 'profile']
  },
  'face-touch': {
    id: 'face-touch', category: 'eccentric', name: 'Face Touch',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Frame your face with both hands, fingers gently spread along the cheeks and jaw. Keep the touch light and the expression soft for a striking beauty shot.',
    tip: 'Let fingertips barely graze the skin — pressing in distorts the face and looks tense.',
    joints: { leftElbow: 120, rightElbow: 120, neck: -4 },
    color: 'rgba(109,74,114,0.2)', figure: 'standing-front',
    tags: ['beauty', 'intermediate', 'eccentric', 'front']
  },
  'hair-flip': {
    id: 'hair-flip', category: 'eccentric', name: 'Hair Flip',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Sudden-Free',
    instructions: 'Tilt your head and run one hand up into your hair as if mid-flip. Let the motion lift the hair and open the neckline for a candid, glamorous moment.',
    tip: 'Capture just after the flip begins — the hair in motion beats a static held pose.',
    joints: { leftShoulder: -100, leftElbow: 40, neck: 12, spine: 6 },
    color: 'rgba(109,74,114,0.2)', figure: 'arm-reach',
    tags: ['glamour', 'intermediate', 'eccentric', 'motion']
  },
  'look-away': {
    id: 'look-away', category: 'eccentric', name: 'Look Away',
    difficulty: 'Beginner', angle: 'Profile', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn to a sharp profile, lift the chin, and direct your eyes away from the camera. A cool, aloof, editorial expression.',
    tip: 'A clean profile depends on a lengthened neck — lead with the chin, not the nose.',
    joints: { neck: 20, spine: 2 },
    color: 'rgba(109,74,114,0.2)', figure: 'standing-front',
    tags: ['editorial', 'beginner', 'eccentric', 'profile']
  },
  'cross-body-arm': {
    id: 'cross-body-arm', category: 'eccentric', name: 'Cross Body',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Bring one arm across the body to rest the hand on the opposite shoulder. The forearm creates a strong diagonal line across the torso.',
    tip: 'Drop the elbow of the crossing arm slightly to keep the shoulders from hunching.',
    joints: { leftShoulder: 30, leftElbow: 120, neck: -6, spine: 4 },
    color: 'rgba(109,74,114,0.2)', figure: 'standing-front',
    tags: ['artistic', 'intermediate', 'eccentric']
  },
  'peek-over-shoulder': {
    id: 'peek-over-shoulder', category: 'eccentric', name: 'Peek Over Shoulder',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn three-quarters away to show the back, then rotate the head to peek back over one shoulder toward the camera. A classic mysterious, over-the-shoulder look.',
    tip: 'Drop the near shoulder and lift the chin over it — this slims the jaw and adds allure.',
    joints: { neck: 30, spine: 6 },
    color: 'rgba(109,74,114,0.2)', figure: 'standing-front',
    tags: ['editorial', 'intermediate', 'eccentric', 'back']
  },

  // ══════════════ COUPLE (8) ══════════════
  'couple-embrace': {
    id: 'couple-embrace', category: 'couple', name: 'Close Embrace',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand facing each other, very close. One person wraps their arms around the other, or both embrace. Heads can touch or turn to the camera.',
    tip: 'The person in front should angle their body slightly — full front-facing couples look static.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['romantic', 'beginner', 'couple']
  },
  'back-to-back': {
    id: 'back-to-back', category: 'couple', name: 'Back to Back',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Both partners stand back-to-back, arms crossed or relaxed at the sides. Turn heads slightly toward the camera for a playful, confident duo shot.',
    tip: 'Match your postures — mirrored height and attitude make the pairing feel intentional.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['playful', 'beginner', 'couple', 'front']
  },
  'forehead-touch': {
    id: 'forehead-touch', category: 'couple', name: 'Forehead Touch',
    difficulty: 'Beginner', angle: 'Profile', intent: 'Photography', effort: 'Static',
    instructions: 'Face each other and gently touch foreheads, eyes closed or downcast. Hands can rest on shoulders or waists. A tender, intimate connection.',
    tip: 'Leave a sliver of space between noses — pressing together flattens both faces.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['romantic', 'beginner', 'couple', 'intimate']
  },
  'waltz-hold': {
    id: 'waltz-hold', category: 'couple', name: 'Waltz Hold',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Take a classic waltz frame — one hand clasped and lifted, the other on the partner\u2019s back and shoulder. Hold an elegant, poised dance line.',
    tip: 'Lift through the joined hands and keep both spines long for a graceful ballroom silhouette.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['elegant', 'intermediate', 'couple', 'dance']
  },
  'piggyback': {
    id: 'piggyback', category: 'couple', name: 'Piggyback',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'One partner climbs onto the other\u2019s back for a piggyback ride. Both lean into the moment and laugh naturally for a joyful, candid frame.',
    tip: 'Genuine laughter beats a posed smile — crack a joke right before the shutter.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['joyful', 'intermediate', 'couple', 'candid']
  },
  'hand-in-hand-walk': {
    id: 'hand-in-hand-walk', category: 'couple', name: 'Walk Together',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Walk side by side with hands linked, both mid-stride. Turn slightly toward each other or the camera for a warm, storytelling frame.',
    tip: 'Actually walk a few steps — a real gait always beats a frozen fake one.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['candid', 'beginner', 'couple', 'motion']
  },
  'over-shoulder-look': {
    id: 'over-shoulder-look', category: 'couple', name: 'Over Shoulder',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands in front, the other just behind resting a chin near their shoulder. Both look toward the camera for a layered, connected portrait.',
    tip: 'Stagger heights slightly so both faces are clearly visible and neither is hidden.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['portrait', 'beginner', 'couple']
  },
  'side-hug': {
    id: 'side-hug', category: 'couple', name: 'Side Hug',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand side by side and wrap your arms around each other\u2019s shoulders or waists as if walking. Lean your heads gently together.',
    tip: 'Angle the outer feet forward — it suggests movement even in a still side hug.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['warm', 'beginner', 'couple', 'front']
  },

  // ══════════════ ACCESSIBLE (5) ══════════════
  'wheelchair-arms': {
    id: 'wheelchair-arms', category: 'accessible', name: 'Arms Expressive',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'From a seated position, focus entirely on expressive arm and hand placement — extending outward, framing the face, or reaching upward dramatically.',
    tip: 'The upper body contains infinite pose variety — lower body position doesn\u2019t define the pose.',
    joints: { leftShoulder: -45, rightShoulder: -20, leftElbow: 15, rightElbow: 80 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['expressive', 'beginner', 'accessible', 'front']
  },
  'seated-power': {
    id: 'seated-power', category: 'accessible', name: 'Seated Power',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit tall and proud with hands resting on the wheels or armrests. Square the shoulders, lift the chin, and hold a strong, commanding presence.',
    tip: 'Rolling the shoulders back and down instantly reads as confidence and authority.',
    joints: { spine: 0, leftShoulder: -8, rightShoulder: -8, neck: -2 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['confident', 'beginner', 'accessible', 'editorial']
  },
  'upper-reach': {
    id: 'upper-reach', category: 'accessible', name: 'Sky Reach',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Raise both arms upward with a joyful, open expression. Let the chest lift and the face brighten for an uplifting, celebratory frame.',
    tip: 'A genuine upward gaze following the hands adds real energy to the reach.',
    joints: { leftShoulder: -140, rightShoulder: -140, neck: 12 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['joyful', 'beginner', 'accessible', 'artistic']
  },
  'side-arm-drape': {
    id: 'side-arm-drape', category: 'accessible', name: 'Arm Drape',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Drape one arm elegantly over the chair back or wheel while the other rests in the lap. Turn the torso slightly for a relaxed, graceful line.',
    tip: 'A draped arm should look weightless and fluid — never gripping or stiff.',
    joints: { leftShoulder: -30, leftElbow: 40, spine: 5, neck: -6 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['graceful', 'beginner', 'accessible']
  },
  'forward-lean-power': {
    id: 'forward-lean-power', category: 'accessible', name: 'Forward Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean forward slightly with elbows resting on the knees, gaze direct and determined. An engaged, dynamic seated posture full of intent.',
    tip: 'Leaning in toward the camera creates connection and a sense of forward drive.',
    joints: { spine: -14, leftElbow: 90, rightElbow: 90, neck: -4 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['determined', 'beginner', 'accessible', 'editorial']
  }
};

// ── AUTO-COMPUTE CATEGORY COUNTS FROM ACTUAL DATA ──
const POSE_CATEGORIES = POSE_CATEGORIES_RAW.map(cat => ({
  ...cat,
  count: Object.values(POSES_LIBRARY).filter(p => p.category === cat.id).length
}));

// ════════════════════════════════════════════════════════════
// IN-MEMORY STORAGE (localStorage-free for iframe compatibility)
// ════════════════════════════════════════════════════════════

// ── GALLERY — captured images ──
// item shape: { id, dataUrl, poseId, poseName, score, timestamp, filters, favorite }
const _gallery = [];

function addToGallery(item) {
  _gallery.unshift(item);
  if (_gallery.length > 100) _gallery.length = 100;
}
function getGallery() { return _gallery.slice(); }
function removeFromGallery(id) {
  const i = _gallery.findIndex(g => g.id == id);
  if (i > -1) _gallery.splice(i, 1);
}
function toggleGalleryFavorite(id) {
  const g = _gallery.find(g => g.id == id);
  if (g) g.favorite = !g.favorite;
  return g ? g.favorite : false;
}

// ── SESSION HISTORY ──
const _sessionHistory = [];
function getSessionHistory() { return _sessionHistory.slice(); }
function saveSession(session) {
  _sessionHistory.unshift(session);
  if (_sessionHistory.length > 50) _sessionHistory.length = 50;
}

// ── FAVORITES (pose favorites) ──
const _favorites = [];
function getFavorites() { return _favorites.slice(); }
function toggleFavorite(poseId) {
  const idx = _favorites.indexOf(poseId);
  if (idx > -1) _favorites.splice(idx, 1); else _favorites.push(poseId);
  return idx === -1; // true if now favorited
}
function isFavorite(poseId) { return _favorites.includes(poseId); }
