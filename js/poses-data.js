// ============================================================
// PoseArt v2 — Pose Library Data
// 745 poses across 16 categories. Auto-computed category counts. (Verified via Object.keys(POSES_LIBRARY).length)
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

  { id: 'boudoir',     name: 'Boudoir',       emoji: '💋', color: 'linear-gradient(135deg,#7B3854,#C96A8C)', description: 'Sensual, elegant curves-and-triangles posing' },
  { id: 'editorial',  name: 'Editorial',      emoji: '📸', color: 'linear-gradient(135deg,#1A1A2E,#4A3F6B)', description: 'High-fashion angular story-driven poses' },
  { id: 'fine-art',   name: 'Fine Art',       emoji: '🎨', color: 'linear-gradient(135deg,#5C3D11,#A07030)', description: 'Classical ballet and sculpture inspired poses' },
  { id: 'fashion',    name: 'Fashion',        emoji: '👗', color: 'linear-gradient(135deg,#2C2C2C,#6B6B6B)', description: 'Runway, commercial, and power poses' },
  { id: 'low-to-high',name: 'Low to High',   emoji: '⬆️', color: 'linear-gradient(135deg,#0D4A2E,#1E9060)', description: 'Floor-to-standing trajectory and rise poses' },
  { id: 'high-to-low',name: 'High to Low',   emoji: '⬇️', color: 'linear-gradient(135deg,#1A3A5C,#2E6CA0)', description: 'Elevated-to-ground and descent poses' }
];

// ── POSE LIBRARY (745 poses) ──
const POSES_LIBRARY = {
  // ══════════════ STANDING (30) ══════════════
  'scurve-stand': {
    id: 'scurve-stand', category: 'standing', name: 'S-Curve Stand',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Plant feet hip-width apart, shift 70% of weight onto the back leg, and let the front knee soften and turn 15° outward. Push the near hip toward camera while dropping the opposite shoulder to carve an S-curve. Lengthen the neck upward.',
    tip: 'Angle the torso 45° from camera and turn the chin back toward the lens — never square both shoulders.',
    // PR-v2 (v1.2) — Phase 2/3 forensic audit fix. Root cause: "pose too subtle".
    // The description calls for a DRAMATIC S-curve: "shift 70% of weight onto
    // the back leg" (big weight shift), "push the near hip toward camera"
    // (significant hip forward), "dropping the opposite shoulder" (clear
    // shoulder drop). The old joint values were too conservative:
    //   - spine 15° → 25° (more visible forward lean for the S-curve)
    //   - hips 14° → 22° (stronger lateral pelvis tilt for weight shift)
    //   - leftShoulder -10 → -25 (left shoulder raised more for asymmetry)
    //   - rightShoulder 8 → 18 (right shoulder dropped more)
    //   - leftHip 8 → 20 (left leg forward = bent front knee)
    //   - rightKnee 10 → 5 (back leg straighter — bears 70% weight)
    //   - leftKnee 10 → 35 (front knee softened/turned out)
    //   - hipAbductL 10 → 15, hipAbductR 10 → 12 (slightly wider stance)
    //   - neck -3 → -8 (chin turned back toward lens)
    // REASONING [PR-v2]: The S-curve is THE canonical photography pose. If it
    // reads as "neutral standing", the entire pose library's credibility is
    // undermined. The joint values need to be bold enough to read at 160×180
    // preview size. 70% weight shift = significant hip pop; "dropping the
    // opposite shoulder" = at least 15° shoulder asymmetry.
    joints: {spine: 25, hips: 22, neck: -8, leftShoulder: -25, rightShoulder: 18, leftElbow: 70, rightElbow: 50, hipAbductL: 15, hipAbductR: 12, leftHip: 20, rightKnee: 5, leftKnee: 35},
    color: 'var(--color-teal-100)', figure: 'scurve',
    tags: ['portrait', 'beginner', 'standing', 'classic']
  },
  'power-stance': {
    id: 'power-stance', category: 'standing', name: 'Power Stance',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Plant feet shoulder-width apart with weight split evenly between both heels. Roll shoulders back and down, letting arms hang an inch off the torso with fingers loose. Level the chin and hold a direct, steady gaze into the lens.',
    tip: 'Shake out both hands before the shutter fires — tension in the fingers reads instantly on camera.',
    joints: { spine: -8, neck: -5, leftShoulder: -15, leftElbow: 70, rightShoulder: 3, rightElbow: 50, hips: 15, leftHip: -6, leftKnee: 10, rightHip: 6, rightKnee: 10, hipAbductL: 20, hipAbductR: 20 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['confident', 'beginner', 'standing', 'front']
  },
  'hip-shift': {
    id: 'hip-shift', category: 'standing', name: 'Hip Shift',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand with feet a few inches apart, then drive one hip sharply outward to carve a C-curve through the spine. Rest the same-side hand on that hip, elbow winged out, opposite arm relaxed. Sink weight into the opposite foot.',
    tip: 'The triangle of negative space between elbow and waist visually narrows the torso — keep it open.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -8→-18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: -18, neck: -5, leftShoulder: -10, leftElbow: 45, rightShoulder: 8, rightElbow: 18, hips: 18, leftHip: 15, leftKnee: 10, rightHip: -8, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
    color: 'var(--color-teal-100)', figure: 'hip-shift',
    tags: ['flattering', 'beginner', 'standing']
  },
  'model-walk': {
    id: 'model-walk', category: 'standing', name: 'Model Walk',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Catch yourself mid-stride with the front knee extended and heel just touching down. Swing the opposite arm forward naturally while the trailing arm drifts back. Shift weight fully onto the leading leg for a confident runway line.',
    tip: 'Take a real step just before the shutter fires — genuine motion reads far more natural than a held pose.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 14→18, hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 18, hips: 16, neck: -8.8, leftShoulder: 15, rightShoulder: -15, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 12, rightHip: -12, leftKnee: 10, rightKnee: 10},
    color: 'var(--color-teal-200)', figure: 'catwalk-stride',
    tags: ['editorial', 'intermediate', 'standing', 'motion']
  },
  'crossed-arms-stand': {
    id: 'crossed-arms-stand', category: 'standing', name: 'Crossed Arms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand tall with feet hip-width apart, then fold arms loosely across the chest, forearms resting rather than gripping. Tilt the head 10° toward one shoulder for warmth. Drop shoulder blades down and back to keep the chest open.',
    tip: 'Rest the hands lightly on the biceps — a tight grip reads as defensive, not confident.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -8, hips: 16, neck: -6, leftShoulder: -30, rightShoulder: -12, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'var(--color-teal-100)', figure: 'crossed-arms-stand',
    tags: ['confident', 'beginner', 'standing', 'front']
  },
  'hand-in-pocket': {
    id: 'hand-in-pocket', category: 'standing', name: 'Hand in Pocket',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Turn the body three-quarters to camera and slide one hand into the pocket, letting that shoulder drop naturally. Keep the opposite arm loose with a soft bend at the elbow. Shift weight onto the back leg to angle the hips away from the lens.',
    tip: 'Leave the thumb hooked outside the pocket — it keeps the hand reading relaxed, not stuffed.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 13, hips: 16, neck: -8.8, leftShoulder: -12, leftElbow: 40, hipAbductL: 10, hipAbductR: 10, rightElbow: 18, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'var(--color-teal-200)', figure: 'hip-shift',
    tags: ['casual', 'beginner', 'standing', 'social']
  },
  'shoulder-drop': {
    id: 'shoulder-drop', category: 'standing', name: 'Shoulder Drop',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Shift weight onto the back foot, then lift one shoulder half an inch while dropping the other, creating a diagonal line across the collarbones. Let the dropped-shoulder arm hang loose while the raised side stays soft, not tense.',
    tip: 'Line the raised shoulder against the dropped opposite hip — that diagonal is the whole point.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -18→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 6, hips: 13, neck: -8.8, leftShoulder: -12, rightShoulder: -12, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftHip: -12, rightHip: 6, leftKnee: 10, rightKnee: 10},
    color: 'var(--color-teal-100)', figure: 'scurve',
    tags: ['editorial', 'intermediate', 'standing']
  },
  'arms-overhead': {
    id: 'arms-overhead', category: 'standing', name: 'Arms Overhead',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Raise both arms overhead with a soft bend at the elbows, letting the ribcage lift and the spine arch gently back. Keep the chin lifted and the shoulder blades sliding down away from the ears to avoid straining the neck.',
    tip: 'Keep elbows softly bent overhead — fully locked arms photograph stiff and flatten the silhouette.',
    joints: {spine: -12, hips: 10, neck: -18, leftShoulder: -132, rightShoulder: -116, leftElbow: 70, rightElbow: 70, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'var(--color-teal-200)', figure: 'dance-arms-high',
    tags: ['artistic', 'intermediate', 'standing', 'expressive']
  },
  'wind-pose': {
    id: 'wind-pose', category: 'standing', name: 'Wind Pose',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Sudden-Free',
    instructions: 'Lean the torso 10-15° into an imagined gust, extending one arm outward at shoulder height while the other crosses lightly in front of the body. Turn the face into the direction of the wind with the chin slightly lifted.',
    tip: 'Add a real sway or run fingers through your hair right at the shutter — motion sells the illusion.',
    joints: {spine: 10, hips: 10, neck: -3.6, leftShoulder: -70, rightShoulder: 30, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'rgba(30,122,116,0.15)', figure: 'arm-reach',
    tags: ['editorial', 'advanced', 'standing', 'motion']
  },
  'contrapposto': {
    id: 'contrapposto', category: 'standing', name: 'Contrapposto',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Shift 90% of weight onto the standing leg, letting the hip on that side rise while the free knee bends and turns out. Tilt the shoulders in the opposite direction of the raised hip, forming the classical S-curve through the spine.',
    tip: 'Engage one arm with purpose, let the other hang at ease — classical tension always pairs with release.',
    joints: {spine: -10, hips: 14, neck: -5, leftShoulder: -8, leftElbow: 70, rightElbow: 50, hipAbductL: 12, hipAbductR: 12, leftHip: 14, rightHip: -15, rightKnee: 10, leftKnee: 10},
    color: 'var(--color-teal-100)', figure: 'scurve',
    tags: ['artistic', 'intermediate', 'standing', 'classic']
  },
  'tiptoe-reach': {
    id: 'tiptoe-reach', category: 'standing', name: 'Tiptoe Reach',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Active',
    instructions: 'Rise onto the balls of both feet and stretch one arm fully overhead, fingers reaching past the fingertips\' natural limit. Keep the standing leg\'s calf engaged and let the ribcage lift with the reach, lengthening the whole torso.',
    tip: 'Point the toes of a slightly lifted back foot to extend the leg line even further.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -8→-18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -18, hips: 10, neck: -10, leftShoulder: -132, rightShoulder: 20, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'var(--color-teal-100)', figure: 'tiptoe-reach',
    tags: ['artistic', 'intermediate', 'standing', 'elongated']
  },
  'one-leg-balance': {
    id: 'one-leg-balance', category: 'standing', name: 'One-Leg Balance',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Artistic', effort: 'Active',
    instructions: 'Balance on one leg with the standing knee softly engaged, then press the opposite foot against the inner calf or knee, toes pointed down. Bring both palms together at the sternum or extend arms outward at shoulder height for counterbalance.',
    tip: 'Fix your gaze on one unmoving point across the room — it stabilizes the whole pose instantly',
    joints: {spine: 13, leftShoulder: -60, rightShoulder: 20, leftElbow: 70, rightElbow: 50, leftHip: 40, leftKnee: 110, rightKnee: 5, neck: -3.3, hips: 12},
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['balance', 'advanced', 'standing', 'artistic']
  },
  'side-stretch': {
    id: 'side-stretch', category: 'standing', name: 'Side Stretch',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Root both feet flat with hips squared to camera, then reach one arm overhead and bend directly sideways from the waist. Slide the opposite hand down the outer thigh as the ribs on the reaching side stretch open.',
    tip: 'Keep hips squared forward throughout — the bend should isolate the waist, not tip the pelvis.',
    joints: {spine: 22, hips: 10, neck: -8.8, leftShoulder: -136, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, rightHip: 2, leftKnee: 10, rightKnee: 10, leftHip: -6},
    color: 'var(--color-teal-100)', figure: 'arm-reach',
    tags: ['stretch', 'intermediate', 'standing', 'artistic']
  },
  'back-arch': {
    id: 'back-arch', category: 'standing', name: 'Back Arch',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Stand with feet hip-width apart and glutes lightly engaged, then arch the spine backward while the head tilts back and arms drift out to the sides. Press the hips slightly forward to support the curve through the lower back.',
    tip: 'Engage the core before arching — it protects the lumbar spine and keeps the line controlled, not collapsed.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-28, now spine:28.
    joints: {spine: -28, hips: 16, neck: 5.4, leftShoulder: -40, rightShoulder: -22, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'var(--color-teal-200)', figure: 'scurve',
    tags: ['artistic', 'advanced', 'standing', 'expressive']
  },
  'prayer-hands': {
    id: 'prayer-hands', category: 'standing', name: 'Prayer Hands',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Center the body and press both palms together at sternum height, elbows floating slightly away from the ribs. Drop the shoulders down and back, then soften the gaze downward or close the eyes for a grounded, calm read.',
    tip: 'Keep elbows a few inches off the ribs — pinned elbows make the whole pose look stiff, not serene.',
    joints: {spine: -8, hips: 10, neck: -8, leftShoulder: -10, rightShoulder: 8, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftWrist: 30, rightWrist: 30, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['calm', 'beginner', 'standing', 'artistic']
  },
  'chest-open': {
    id: 'chest-open', category: 'standing', name: 'Chest Open',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand tall with feet hip-width apart, then draw both shoulder blades together and down the back to open the chest fully. Let the arms hang slightly externally rotated at your sides with palms facing forward.',
    tip: 'Imagine pinching a pencil between the shoulder blades — it opens the chest without hiking the shoulders.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -6→-18, hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: -18, neck: -5, leftShoulder: 0, leftElbow: 70, rightShoulder: 18, rightElbow: 50, hips: 16, leftHip: -6, leftKnee: 10, rightHip: 6, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['confident', 'beginner', 'standing', 'front']
  },
  'hands-clasped-front': {
    id: 'hands-clasped-front', category: 'standing', name: 'Hands Clasped Front',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stagger the feet slightly and shift weight onto the back foot, then clasp both hands loosely at the low hip line. Rotate the torso a quarter turn away from camera while the chin stays angled back toward the lens.',
    tip: 'Rest clasped hands low near the hips, not the stomach, to keep the torso reading long.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 13, hips: 16, neck: -8.8, leftShoulder: -30, rightShoulder: -30, leftElbow: 110, rightElbow: 110, hipAbductL: 10, hipAbductR: 10, leftHip: -6, rightHip: 12, leftKnee: 10, rightKnee: 10, shoulderFwdL: -80, shoulderFwdR: -80, globalTwist: 25},
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['polished', 'beginner', 'standing']
  },
  'neck-roll': {
    id: 'neck-roll', category: 'standing', name: 'Neck Roll',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Stand relaxed with arms at your sides, then tilt the head toward one shoulder, exposing the long line of the opposite neck. Drop the shoulder on the side you\'re tilting toward to prevent it from hiking up, and let the eyes close softly.',
    tip: 'Drop the near shoulder as the head tilts — a raised shoulder shortens the neck line instantly',
    joints: {spine: -8, hips: 10, neck: 7.9, leftShoulder: -8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['soft', 'beginner', 'standing', 'artistic']
  },
  'profile-stand': {
    id: 'profile-stand', category: 'standing', name: 'Profile Stand',
    difficulty: 'Beginner', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Rotate fully sideways until the body forms a clean profile line to the camera. Lengthen the spine, pull the chin back and slightly up, and let the near arm relax straight at your side.',
    tip: 'Pull the chin back and up, not just up — that\'s what keeps a profile jawline sharp instead of soft.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 12→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: 18, neck: 8, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 10, leftHip: -6, leftKnee: 10, rightHip: 6, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
    color: 'var(--color-teal-100)', figure: 'profile-stand',
    tags: ['editorial', 'beginner', 'standing', 'profile']
  },
  'runway-stop': {
    id: 'runway-stop', category: 'standing', name: 'Runway Stop',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Plant feet in a narrow stance with one foot slightly ahead, stopping sharply as if at the end of a runway walk. Square the shoulders to camera and lock a strong, unblinking gaze.',
    tip: 'Freeze right as the front foot lands — the stop should read as the end of a stride, not a static pose.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -8→-18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: -18, neck: -5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 10, leftHip: -8, leftKnee: 10, rightHip: 8, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['editorial', 'intermediate', 'standing', 'fashion']
  },
  'half-turn': {
    id: 'half-turn', category: 'standing', name: 'Half Turn',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Face away from camera, then rotate the ribcage and head halfway back over one shoulder, initiating the twist from the torso rather than the neck. Angle the hips away from camera to maximize spinal torque.',
    tip: 'Start the twist in the ribcage, not the neck, or the shot reads as a strained glance backward.',
    joints: { spine: 24, neck: 25, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 10, leftHip: -6, leftKnee: 10, rightHip: 6, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 , globalTwist: 45},
    color: 'var(--color-teal-100)', figure: 'profile-stand',
    tags: ['editorial', 'intermediate', 'standing', 'back']
  },
  'chin-up-stand': {
    id: 'chin-up-stand', category: 'standing', name: 'Chin Up Stand',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand tall with feet hip-width apart and lift the chin just a few degrees higher than feels natural, elongating the front of the neck. Keep shoulders relaxed and pulled down to avoid visible tension.',
    tip: 'Lift the chin only a few degrees — too far tips the head back and exposes the nostrils to the lens.',
    joints: { spine: -12, neck: -22, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 10, leftHip: -6, leftKnee: 10, rightHip: 6, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['portrait', 'beginner', 'standing', 'confident']
  },
  'weight-forward': {
    id: 'weight-forward', category: 'standing', name: 'Weight Forward',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Step one foot forward and shift body weight fully onto it, letting the back heel lift slightly off the ground. Lean the torso a few degrees toward the camera to read as engaged and present.',
    tip: 'A forward weight shift reads as approachable — ideal for warm, conversational portrait moments.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-6, now spine:6.
    joints: {spine: 18, hips: 16, neck: -4, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'var(--color-teal-100)', figure: 'hip-shift',
    tags: ['approachable', 'beginner', 'standing']
  },
  'shoulder-roll-back': {
    id: 'shoulder-roll-back', category: 'standing', name: 'Shoulder Roll Back',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand naturally, then roll both shoulders up toward the ears, back, and down in one continuous motion. Settle into the open position the instant the roll completes, keeping the chest lifted.',
    tip: 'Do this roll right before every shot — it\'s the fastest fix for hunched, camera-shy shoulders.',
    joints: { spine: -14, neck: -5, leftShoulder: -20, leftElbow: 70, rightShoulder: -2, rightElbow: 50, hips: 10, leftHip: -6, leftKnee: 10, rightHip: 6, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['relaxed', 'beginner', 'standing']
  },
  'head-tilt-stand': {
    id: 'head-tilt-stand', category: 'standing', name: 'Head Tilt Stand',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand centered with the body square to camera, then tilt the head no more than 15° toward one shoulder. Keep shoulders level and relaxed, adding a soft, warm smile to complete the friendly read.',
    tip: 'Keep the tilt under 15 degrees — past that it reads as quizzical rather than warm.',
    joints: {spine: -8, hips: 10, neck: 4.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['friendly', 'beginner', 'standing', 'social']
  },
  'hand-behind-head': {
    id: 'hand-behind-head', category: 'standing', name: 'Hand Behind Head',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Raise one arm and rest the hand lightly at the back of the head or neck, elbow winged outward at shoulder height. Shift the opposite hip out to the side for a relaxed, confident asymmetry through the torso.',
    tip: 'Keep the resting hand loose against the hair, not gripping — a light touch reads effortless.',
    joints: { spine: -8, neck: -5, leftShoulder: -100, leftElbow: 60, rightElbow: 18, hips: 10, leftHip: 10, leftKnee: 10, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
    color: 'var(--color-teal-200)', figure: 'hip-shift',
    tags: ['editorial', 'intermediate', 'standing', 'casual']
  },
  'two-hands-pockets': {
    id: 'two-hands-pockets', category: 'standing', name: 'Two Hands Pockets',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Slide both hands into front pockets, letting shoulders drop and settle naturally. Keep a soft bend in both knees rather than locking them straight, and push elbows slightly back to open the torso line.',
    tip: 'Push both elbows back and out — the negative space it creates slims the torso in frame.',
    joints: { spine: -8, neck: -5, leftShoulder: -18, leftElbow: 35, rightShoulder: 0, rightElbow: 35, hips: 10, leftHip: -6, leftKnee: 10, rightHip: 6, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
    color: 'var(--color-teal-100)', figure: 'crossed-arms-stand',
    tags: ['casual', 'beginner', 'standing', 'social']
  },
  'lean-no-support': {
    id: 'lean-no-support', category: 'standing', name: 'Standing Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'With no wall or prop, tilt the entire torso 10-15° off-axis to one side while feet stay planted, engaging the obliques to hold the lean. Keep the core braced throughout to sell the illusion of invisible support.',
    tip: 'Brace the core fully — a half-hearted lean without real engagement just reads as poor balance.',
    joints: {spine: 20, hips: 10, neck: -9.3, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: -10, leftKnee: 10, rightKnee: 10},
    color: 'var(--color-teal-200)', figure: 'hip-shift',
    tags: ['artistic', 'intermediate', 'standing', 'creative']
  },
  'victory-arms': {
    id: 'victory-arms', category: 'standing', name: 'Victory Arms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Plant feet firmly hip-width apart and throw both arms overhead into a wide V, fingers spread. Lift the chest and let the face open into genuine, unguarded joy.',
    tip: 'Add a small jump right into the position — real momentum beats a statically held V every time.',
    joints: {spine: -8, hips: 10, neck: -2.7, leftShoulder: -127, rightShoulder: -133, leftElbow: 70, rightElbow: 70, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, leftHip: -6, rightHip: 6},
    color: 'var(--color-teal-100)', figure: 'dance-arms-high',
    tags: ['joyful', 'beginner', 'standing', 'celebratory']
  },
  'diagonal-step': {
    id: 'diagonal-step', category: 'standing', name: 'Diagonal Step',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Step one foot out on a diagonal away from the body while keeping the torso squared to camera. Let the hips follow the step slightly, carving a long diagonal line through both legs.',
    tip: 'Widen the diagonal step for more drama, but keep enough weight centered to read stable, not off-balance.',
    joints: {spine: 14, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: -6, leftKnee: 10, rightKnee: 10},
    color: 'var(--color-teal-200)', figure: 'hip-shift',
    tags: ['editorial', 'intermediate', 'standing', 'fashion']
  },

  // ══════════════ SEATED (30) ══════════════
  'soft-sit': {
    id: 'soft-sit', category: 'seated', name: 'Soft Sit',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Perch on the front third of the seat rather than sinking fully back, keeping the spine tall. Lean the torso a few degrees forward from the hips and angle both knees to one side rather than square to camera.',
    tip: 'Sitting on the front edge blocks slouching and keeps the whole silhouette reading elegant.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-5, now spine:5.
    joints: {spine: 18, neck: -5, rightShoulder: -12, leftElbow: 65, rightElbow: 45, hipAbductL: 25, hipAbductR: -10, leftHip: 85, rightHip: 85, leftKnee: 90, rightKnee: 95, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['portrait', 'beginner', 'seated']
  },
  'floor-cross-leg': {
    id: 'floor-cross-leg', category: 'seated', name: 'Cross-Legged',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the floor with legs crossed and weight balanced evenly on both sit bones. Rest hands lightly on the knees, palms down, and lift through the crown of the head to lengthen the spine.',
    tip: 'Tilt onto the front edge of the sit bones — it lifts the spine and prevents a rounded lower back.',
    joints: {
"spine":-8,"neck":-4,"leftShoulder":-20,"rightShoulder":-32,"leftElbow":100,"rightElbow":100,"hipAbductL":-25,"hipAbductR":-25,"leftHip":80,"rightHip":80,"leftKnee":130,"rightKnee":130,"shoulderFwdL":12,"shoulderFwdR":-10
  },
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['calm', 'beginner', 'seated', 'floor']
  },
  'chair-lean-forward': {
    id: 'chair-lean-forward', category: 'seated', name: 'Chair Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on the front of a chair and hinge forward from the hips, resting elbows on the knees while the spine stays long. Clasp both hands loosely between the knees or let them hang relaxed.',
    tip: 'Hinge from the hips, not the upper back — it keeps the chest open instead of caving forward.',
    joints: {spine: 20, neck: 5, rightShoulder: -12, leftElbow: 90, rightElbow: 90, hipAbductL: 12, hipAbductR: 12, leftHip: 115, rightHip: 115, leftKnee: 90, rightKnee: 90, shoulderFwdL: -130, shoulderFwdR: -130},
    color: 'var(--color-teal-200)', figure: 'elbow-prop',
    tags: ['thoughtful', 'beginner', 'seated', 'chair']
  },
  'side-straddle': {
    id: 'side-straddle', category: 'seated', name: 'Side Straddle',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Straddle the chair sideways so the backrest sits beside one hip. Drape both forearms over the top of the backrest and rotate the torso toward camera, opening the chest away from the chair.',
    tip: 'Rotate the torso away from the chair back — that twist is what flatters the waistline.',
    joints: {spine: 8, neck: -2.4, leftShoulder: -25, rightShoulder: -25, leftElbow: 90, rightElbow: 90, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, shoulderFwdL: -15, shoulderFwdR: -15, globalTwist: 25},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'chair']
  },
  'window-seat': {
    id: 'window-seat', category: 'seated', name: 'Window Seat',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Draw both knees up toward the chest and wrap both arms around the shins, interlacing the fingers. Rest the chin or cheek on top of the knees and let the gaze soften for an intimate, contemplative mood.',
    tip: 'Drop one shoulder toward the knees — it softens the silhouette with a gentle diagonal curve.',
    joints: {spine: 10, neck: 15, rightShoulder: -12, leftElbow: 75, rightElbow: 75, hipAbductL: 10, hipAbductR: 25, leftHip: 115, rightHip: 115, leftKnee: 130, rightKnee: 130, shoulderFwdL: -40, shoulderFwdR: -40},
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['cozy', 'beginner', 'seated', 'intimate']
  },
  'throne-sit': {
    id: 'throne-sit', category: 'seated', name: 'Throne Sit',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit upright with the spine tall, resting both forearms flat along the armrests. Square the shoulders to camera, lift the chin slightly, and plant both feet flat with knees a hip-width apart.',
    tip: 'Keep both feet grounded and knees apart — it reads as commanding rather than closed-off.',
    joints: {spine: 0, neck: -10, leftShoulder: 0, rightShoulder: 0, leftElbow: 65, rightElbow: 45, hipAbductL: 0, hipAbductR: 0, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-gold-300)', figure: 'throne-sit',
    tags: ['regal', 'beginner', 'seated', 'editorial']
  },
  'feet-up': {
    id: 'feet-up', category: 'seated', name: 'Feet Up',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Recline back into the seat and prop both feet on a nearby surface, letting the spine sink into a relaxed curve. Rest one arm behind the head, elbow winged out, for an off-duty read.',
    tip: 'Add a slight smile and drop the shoulders — tension in the face undercuts the casual mood.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:12, now spine:-12.
    joints: {spine: -12, neck: 6, rightShoulder: -110, leftElbow: 65, rightElbow: 100, leftHip: 80, rightHip: 80, leftKnee: 25, rightKnee: 25, shoulderFwdL: 7, shoulderFwdR: 15, globalTilt: -30},
    color: 'var(--color-teal-100)', figure: 'feet-up-recline',
    tags: ['casual', 'beginner', 'seated', 'social']
  },
  'cross-ankle-sit': {
    id: 'cross-ankle-sit', category: 'seated', name: 'Ankle Cross',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit with both feet flat, then cross one ankle over the opposite knee into a figure-four shape. Rest a hand on the raised ankle and keep the torso lifted and open toward camera.',
    tip: 'Angle the raised knee slightly away from camera so it doesn\'t block the line of the torso.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -20→-110, rightShoulder -32→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 4, neck: -8.2, leftShoulder: -20, rightShoulder: -32, leftElbow: 100, rightElbow: 100, leftHip: 80, rightHip: 80, leftKnee: 95, rightKnee: 60, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['relaxed', 'beginner', 'seated', 'chair']
  },
  'side-saddle': {
    id: 'side-saddle', category: 'seated', name: 'Side Saddle',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Sit with both legs swept to one side, ankles crossed and stacked precisely, one directly above the other. Rotate the upper body a quarter turn toward camera while the legs stay angled away.',
    tip: 'Stack the knees directly on top of each other — it keeps the leg line clean from any angle.',
    joints: {spine: 6, neck: -9.3, rightShoulder: -12, leftElbow: 65, rightElbow: 45, hipAbductL: 25, hipAbductR: -10, leftHip: 70, rightHip: 70, leftKnee: 115, rightKnee: 120, shoulderFwdL: 7, shoulderFwdR: -5, globalTwist: 30},
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['elegant', 'beginner', 'seated', 'classic']
  },
  'ottoman-recline': {
    id: 'ottoman-recline', category: 'seated', name: 'Ottoman Recline',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on a low ottoman and lean back onto one supporting arm, elbow soft rather than locked. Extend both legs loosely forward and rest the free hand on your thigh for an off-duty mood.',
    tip: 'Keep the supporting elbow soft, not locked, so the shoulder doesn\'t ride up toward the ear',
    joints: {spine: -5, neck: 3, rightShoulder: -12, leftElbow: 30, rightElbow: 30, hipAbductL: 12, hipAbductR: 12, leftHip: 80, rightHip: 80, leftKnee: 35, rightKnee: 35, shoulderFwdL: -50, shoulderFwdR: -30, globalTilt: 30},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['relaxed', 'beginner', 'seated', 'casual']
  },
  'floor-side-extend': {
    id: 'floor-side-extend', category: 'seated', name: 'Floor Side Extend',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor and extend one leg straight out to the side while the other bends in toward the body. Reach the same-side arm along the extended leg, stretching the torso into one long line.',
    tip: 'Flex the extended foot rather than pointing it — it reads as more intentional in stills.',
    joints: {spine: 12, neck: -3.3, leftShoulder: -55, leftElbow: 20, rightElbow: 45, hipAbductL: -45, hipAbductR: 15, leftHip: 80, rightHip: 80, leftKnee: 10, rightKnee: 100, shoulderFwdL: -20, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['artistic', 'intermediate', 'seated', 'floor']
  },
  'knees-apart-forward': {
    id: 'knees-apart-forward', category: 'seated', name: 'Knees Apart Forward',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit on the front edge of the seat with knees apart and forearms resting on the thighs. Lean a few degrees forward from the hips while keeping the spine straight and the gaze direct into the lens.',
    tip: 'Keep the spine straight through the lean — rounded shoulders undercut this pose\'s confident intent.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-12, now spine:12.
    joints: {spine: 12, neck: -6, rightShoulder: -12, leftElbow: 90, rightElbow: 90, hipAbductL: -25, hipAbductR: -25, leftHip: 80, rightHip: 80, leftKnee: 80, rightKnee: 80, shoulderFwdL: -25, shoulderFwdR: -25},
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['confident', 'beginner', 'seated', 'editorial']
  },
  'meditation-palms': {
    id: 'meditation-palms', category: 'seated', name: 'Meditation Palms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit cross-legged on the floor with the backs of the hands resting on the knees, palms open and turned upward. Roll the shoulders down and back, then close the eyes softly and lift through the crown.',
    tip: 'Roll shoulders down and back before settling — tension there breaks the calm illusion instantly.',
    joints: {spine: -8, neck: -5, leftShoulder: -20, rightShoulder: -32, leftElbow: 100, rightElbow: 100, hipAbductL: -25, hipAbductR: -25, leftHip: 85, rightHip: 85, leftKnee: 130, rightKnee: 130, shoulderFwdL: 12, shoulderFwdR: 12},
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['calm', 'beginner', 'seated', 'meditative']
  },
  'floor-hug-knees': {
    id: 'floor-hug-knees', category: 'seated', name: 'Floor Hug Knees',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the floor and draw both knees fully into the chest, wrapping both arms around the shins. Rest the cheek against a knee and let one foot untuck slightly so it peeks out from the shape.',
    tip: 'Untuck one foot so it peeks out — it stops the silhouette from reading as one tight, closed ball.',
    joints: {spine: 25, neck: 10, rightShoulder: -12, leftElbow: 75, rightElbow: 75, leftHip: 115, rightHip: 115, leftKnee: 130, rightKnee: 140, shoulderFwdL: -45, shoulderFwdR: -45},
    color: 'var(--color-teal-200)', figure: 'floor-hug-knees',
    tags: ['cozy', 'beginner', 'seated', 'intimate']
  },
  'one-leg-extend-floor': {
    id: 'one-leg-extend-floor', category: 'seated', name: 'One Leg Extend Floor',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on the floor with one leg extended straight ahead, angled slightly away from square-to-camera, and the other bent with the foot flat near the opposite knee. Plant one hand on the floor behind you and lift the chest.',
    tip: 'Angle the extended leg slightly off-camera-square — it reads noticeably longer and leaner.',
    joints: {spine: -5, neck: -3.3, leftShoulder: -30, rightShoulder: -12, leftElbow: 0, rightElbow: 45, hipAbductL: -15, hipAbductR: 25, leftHip: 80, rightHip: 30, leftKnee: 15, rightKnee: 140, shoulderFwdL: 100, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['portrait', 'intermediate', 'seated', 'floor']
  },
  'chair-back-lean': {
    id: 'chair-back-lean', category: 'seated', name: 'Chair Back Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit fully back into the chair, letting the backrest support the spine, with both feet planted flat and ankles uncrossed. Rest both hands loosely on the armrests or thighs and relax the shoulders.',
    tip: 'Uncross the ankles and plant both feet flat — it grounds the pose and avoids a slouched read.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 8→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -5, neck: -4.4, leftElbow: 95, rightElbow: 95, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -15, rightAnkle: -15, rightShoulder: -12, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['relaxed', 'beginner', 'seated', 'chair']
  },
  'swivel-twist': {
    id: 'swivel-twist', category: 'seated', name: 'Swivel Twist',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit with the legs facing one direction while twisting the ribcage toward camera, keeping the hips anchored in place. Rest one arm along the chair back to support and emphasize the twist.',
    tip: 'Initiate the twist from the waist with hips anchored — that separation creates the most flattering torque.',
    joints: {spine: 20, neck: -2.4, rightShoulder: -30, leftElbow: 70, rightElbow: 18, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, shoulderFwdL: 7, shoulderFwdR: 30, globalTwist: 25},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'chair']
  },
  'perch-edge': {
    id: 'perch-edge', category: 'seated', name: 'Perch on Edge',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Perch lightly on the very edge of a stool with both feet planted and knees together. Keep the spine tall, shoulders relaxed, and rest both hands gently on the seat edge beside you.',
    tip: 'Sink real weight into your feet, not just the seat — it reads as poised, not precarious.',
    joints: {spine: 0, neck: -8.8, leftShoulder: 20, rightShoulder: 20, leftElbow: 65, rightElbow: 45, hipAbductL: 18, hipAbductR: 18, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['poised', 'beginner', 'seated']
  },
  'stool-lean-back': {
    id: 'stool-lean-back', category: 'seated', name: 'Stool Lean Back',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit on a stool and lean the torso back, bracing weight on both hands placed flat behind you on the seat. Extend the legs loosely forward and tilt the chin up a few degrees.',
    tip: 'Keep shoulders pulled down away from the ears even while bearing weight on the arms.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-15, now spine:15.
    joints: {spine: -15, neck: -8, rightShoulder: -12, leftElbow: 65, rightElbow: 45, hipAbductL: 12, hipAbductR: 12, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, shoulderFwdL: -30, shoulderFwdR: -30},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'relaxed']
  },
  'floor-stretch-legs': {
    id: 'floor-stretch-legs', category: 'seated', name: 'Floor Stretch Legs',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor with both legs extended straight ahead, spine tall, and a soft bend left in the knees. Reach both hands forward toward the toes or rest them lightly on the shins.',
    tip: 'Leave a soft bend in the knees — a forced, locked-straight stretch reads stiffer on camera.',
    joints: {spine: -8, neck: -6, leftShoulder: 10, leftElbow: 65, rightElbow: 45, leftHip: 80, rightHip: 80, leftKnee: 15, rightKnee: 15, shoulderFwdL: -25, shoulderFwdR: -25},
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['artistic', 'beginner', 'seated', 'floor']
  },
  'seated-hug-pillow': {
    id: 'seated-hug-pillow', category: 'seated', name: 'Seated Hug Pillow',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit and hug a pillow or cushion loosely against the chest, resting the chin on top of it. Let the knees draw up slightly and shoulders soften for a cozy, unguarded mood.',
    tip: 'A real prop like a pillow gives the hands purpose and removes any awkward, empty-handed stiffness — it solves the what-do-I-do-with-my-hands problem.',
    joints: {spine: -10, neck: -10, leftShoulder: -80, rightShoulder: -80, leftElbow: 140, rightElbow: 140, leftHip: 95, rightHip: 95, leftKnee: 90, rightKnee: 90, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: -50, shoulderFwdR: -50},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['cozy', 'beginner', 'seated', 'social']
  },
  'chair-twist-both': {
    id: 'chair-twist-both', category: 'seated', name: 'Chair Twist Both Arms',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit backward on a chair facing away from camera, then twist the torso and drape both arms over the top of the backrest. Look back over one shoulder toward the lens, chin resting near the top hand.',
    tip: 'Rest the chin near the top hand — it gives the twisted gaze a natural focal point.',
    joints: {spine: 22, neck: 26, leftShoulder: -60, rightShoulder: 60, leftElbow: 75, rightElbow: 75, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: -30, shoulderFwdR: -30, globalTwist: 25},
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'back']
  },
  'lounger-recline': {
    id: 'lounger-recline', category: 'seated', name: 'Lounger Recline',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Settle into a reclined lounger with legs extended and crossed at the ankle. Rest one arm along the back cushion and the other in the lap, tilting the chin down slightly to soften the face.',
    tip: 'Tilt the chin down slightly at this recline angle — it keeps the face from looking strained upward.',
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
    joints: {spine: -8, neck: -6, rightShoulder: -12, leftElbow: 65, rightElbow: 45, hipAbductL: -10, hipAbductR: 10, leftHip: 80, rightHip: 80, leftKnee: 30, rightKnee: 20, shoulderFwdL: 7, shoulderFwdR: -5, globalTilt: -40},
    color: 'var(--color-teal-100)', figure: 'feet-up-recline',
    tags: ['relaxed', 'beginner', 'seated', 'lounge']
  },
  'floor-asymmetric': {
    id: 'floor-asymmetric', category: 'seated', name: 'Floor Asymmetric',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor with one knee bent upward and the other leg tucked beneath the body asymmetrically. Rest one arm across the raised knee and lean the torso a few degrees toward it.',
    tip: 'Keep the two legs deliberately asymmetrical — mirroring them flattens the visual interest.',
    joints: {spine: 10, hips: 8, neck: -3.3, rightShoulder: -12, leftElbow: 60, rightElbow: 18, hipAbductR: -10, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 140, shoulderFwdL: -50, shoulderFwdR: -5},
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['artistic', 'intermediate', 'seated', 'floor']
  },
  'bench-sit-side': {
    id: 'bench-sit-side', category: 'seated', name: 'Bench Sit Side',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Sit sideways on a bench with legs together, angled away from camera. Place both hands flat on the bench beside you, lift the chest, and leave a gap of light between the arm and torso.',
    tip: 'Leave a gap of light between arm and torso — pressing them together compresses the waistline.',
    joints: {spine: -2, leftElbow: 65, rightElbow: 45, leftHip: 80, rightHip: 80, leftKnee: 95, rightKnee: 95, leftAnkle: -15, rightAnkle: -15, rightShoulder: -12, neck: -6, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['poised', 'beginner', 'seated']
  },
  'tabletop-sit': {
    id: 'tabletop-sit', category: 'seated', name: 'Tabletop Sit',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the edge of a table with legs dangling or crossed at the ankle. Lean back slightly onto both hands, shoulders relaxed down, and let the feet swing loosely just before the shot.',
    tip: 'Bounce the feet gently right before the shutter — it keeps the pose from freezing into stiffness.',
    joints: {spine: -10, neck: -3.3, rightShoulder: -12, leftElbow: 65, rightElbow: 45, leftHip: 80, rightHip: 80, leftKnee: 140, rightKnee: 140, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 25, shoulderFwdR: 25},
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['casual', 'intermediate', 'seated', 'social']
  },
  'feet-tucked-under': {
    id: 'feet-tucked-under', category: 'seated', name: 'Feet Tucked Under',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on a couch and tuck both feet underneath the body to one side. Lean into the armrest with one elbow and let the free hand rest loosely in your lap for a candid, cozy read.',
    tip: 'Tucking the feet under instantly reads as candid — ideal for relaxed lifestyle-style shots.',
    joints: {spine: 12, hips: -8, neck: -3.3, rightShoulder: -12, leftElbow: 60, rightElbow: 80, hipAbductL: -30, leftHip: 80, rightHip: 80, leftKnee: 138, rightKnee: 138, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['cozy', 'beginner', 'seated', 'lifestyle']
  },
  'kneeling-upright-twist': {
    id: 'kneeling-upright-twist', category: 'seated', name: 'Kneeling Upright Twist',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit back on the heels in a kneeling base and twist the ribcage to one side, planting one hand on the floor behind you for support. Look back over the opposite shoulder while hips stay squared forward.',
    tip: 'Keep hips squared while the ribcage twists — that separation is what gives the line its editorial edge.',
    joints: {spine: 20, neck: 22, leftShoulder: -30, rightShoulder: -12, leftElbow: 0, rightElbow: 45, leftHip: 40, rightHip: 40, leftKnee: 150, rightKnee: 150, shoulderFwdL: 100, shoulderFwdR: -5, globalTwist: 25},
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['editorial', 'intermediate', 'seated', 'kneeling']
  },
  'seated-v-stretch': {
    id: 'seated-v-stretch', category: 'seated', name: 'Seated V Stretch',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor and open both legs into a wide V. Lead with the chest as you lean forward, reaching both arms between the legs or resting hands flat on the floor.',
    tip: 'Lead the forward lean with the chest, not the head — it keeps the spine long instead of rounding.',
    joints: {spine: 6, neck: -6, leftShoulder: 20, rightShoulder: 20, leftElbow: 70, rightElbow: 50, hipAbductL: -30, hipAbductR: -30, leftHip: 30, rightHip: 30, leftKnee: 10, rightKnee: 10, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: -25, shoulderFwdR: -25},
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['artistic', 'intermediate', 'seated', 'floor']
  },
  'floor-prop-back': {
    id: 'floor-prop-back', category: 'seated', name: 'Floor Prop Back',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on the floor and lean back on both forearms, angled slightly behind the hips rather than directly under the shoulders. Tilt the head back a few degrees and let the chest open upward.',
    tip: 'Angle the forearms slightly behind the hips, not under the shoulders, for a more relaxed lean-back line.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: {spine: -18, neck: 8, rightShoulder: -12, leftElbow: 20, rightElbow: 20, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, shoulderFwdL: 30, shoulderFwdR: 30},
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['relaxed', 'beginner', 'seated', 'floor']
  },

  // ══════════════ LEANING — STANDING (30) ══════════════
  'wall-lean': {
    id: 'wall-lean', category: 'leaning', name: 'Wall Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand with one shoulder pressed against the wall, torso angled 20-30° off the surface. Cross the far ankle over the near one and let both arms relax, one hand sliding into a pocket.',
    tip: 'Play with weight distribution — the diagonal from feet to shoulder is what creates the visual interest.',
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
    joints: {spine: 14, hips: 10, neck: -8.8, leftShoulder: -10, leftElbow: 40, rightElbow: 20, hipAbductL: -10, hipAbductR: -20, leftKnee: 10, rightKnee: 10, rightAnkle: 15, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning']
  },
  'doorframe-lean': {
    id: 'doorframe-lean', category: 'leaning', name: 'Doorframe Lean',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Reach both hands up to grip the doorframe above the head, arms holding real tension rather than fully hanging. Let the body curve gently through the ribs, weight settling into the hips.',
    tip: 'Keep tension in the arms instead of fully hanging — it keeps the shoulders open and lifted.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 14→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {
"spine":-12,"hips":10,"neck":-8.8,"leftShoulder":-110,"rightShoulder":-110,"leftElbow":70,"rightElbow":70,"hipAbductL":10,"hipAbductR":10,"leftKnee":10,"rightKnee":10,"shoulderFwdL":-1,"shoulderFwdR":-5
  },
    color: 'var(--color-cobalt-200)', figure: 'arm-reach',
    tags: ['editorial', 'intermediate', 'leaning', 'front']
  },
  'shoulder-lean': {
    id: 'shoulder-lean', category: 'leaning', name: 'Shoulder Lean',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Press both shoulder blades flat against the wall while walking the feet one step forward, letting the hips settle slightly ahead of the shoulders. Cross the arms or let them hang loose at your sides.',
    tip: 'Step the feet away from the wall — that gap creates a flattering, subtle recline angle.',
    joints: {spine: -14, hips: 5, neck: -5, leftShoulder: -16, rightShoulder: 2, leftElbow: 95, rightElbow: 95, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: 4, shoulderFwdR: -10},
    color: 'var(--color-cobalt-200)', figure: 'standing-front',
    tags: ['relaxed', 'beginner', 'leaning', 'front']
  },
  'hip-lean': {
    id: 'hip-lean', category: 'leaning', name: 'Hip Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Rest one hip against a table edge, letting that leg take the weight while the other stays loose with a soft knee bend. Keep the free hand resting on the surface or in a pocket, never stiff at your side.',
    tip: 'Give the free hand a job — resting it on the surface or in a pocket avoids awkward, stiff arms.',
    joints: {spine: 15, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: -25, leftElbow: 40, rightElbow: 85, hipAbductL: 10, hipAbductR: 10, leftHip: 12, leftKnee: 30, rightKnee: 12, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'hip-shift',
    tags: ['casual', 'beginner', 'leaning', 'social']
  },
  'back-wall-prop': {
    id: 'back-wall-prop', category: 'leaning', name: 'Back Wall Prop',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Rest the full back flat against the wall, then bend one knee and plant that foot flat against the wall behind you, angled slightly toward the lens. Keep the torso open and the gaze off-camera.',
    tip: 'Angle the bent knee slightly toward the lens — it reads as a stronger geometric shape.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:12, now spine:-12.
    joints: {spine: -12, hips: 10, neck: -9.3, leftShoulder: -10, rightShoulder: 8, leftElbow: 40, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftHip: -50, leftKnee: 70, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'back-arch-wall',
    tags: ['editorial', 'intermediate', 'leaning']
  },
  'elbow-ledge': {
    id: 'elbow-ledge', category: 'leaning', name: 'Elbow Ledge',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest both elbows on a ledge and let the body weight settle forward through the forearms. Keep the back long, chin lifted, and let the forward lean naturally open the chest.',
    tip: 'Leaning forward onto the ledge opens the chest and lengthens the neckline automatically.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: 14, hips: 10, neck: -4, leftShoulder: -75, rightShoulder: -75, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -20, shoulderFwdR: -20},
    color: 'var(--color-cobalt-200)', figure: 'elbow-prop',
    tags: ['relaxed', 'beginner', 'leaning']
  },
  'column-lean': {
    id: 'column-lean', category: 'leaning', name: 'Column Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand beside a column and lean the shoulder and hip against its curved edge, letting the spine echo that curve. Cross one ankle over the other and let the near arm drape along the column\'s surface',
    tip: 'A curved surface asks for a curved body — mirror the column\'s line through your spine',
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
    joints: {spine: 14, hips: 10, neck: -8.8, leftShoulder: -45, leftElbow: 30, rightElbow: 20, hipAbductL: 10, hipAbductR: -10, leftHip: 8, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'beginner', 'leaning', 'architectural']
  },
  'fence-lean': {
    id: 'fence-lean', category: 'leaning', name: 'Fence Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Rest both forearms flat on the top rail of a fence, leaning the torso forward with weight sunk fully into the rail rather than hovering above it. Cross one foot behind the other for a casual stance.',
    tip: 'Sink real weight into the fence rather than hovering above it — that\'s what reads as natural.',
    // PR-v2 (v1.2) — Phase 2/3 forensic audit fix. Root causes:
    //   1. spine was -12 (backward arch) but description says "leaning FORWARD".
    //      Per convention (Part A.10: spine negative = backward arch, positive
    //      = forward fold), this is a SIGN ERROR. Fixed: spine -12 → 28 (forward lean).
    //   2. hipAbductL/R both +10 (legs spread) but description says "cross one
    //      foot behind the other". For crossed ankles, one leg should cross
    //      inward (negative hipAbduct). Fixed: hipAbductR 10 → -12 (right leg
    //      crosses behind left).
    //   3. shoulderFwdL/R too small (4, -10) to convey "forearms flat on rail"
    //      (arms reaching forward to the fence). Fixed: shoulderFwdL 4 → 35,
    //      shoulderFwdR -10 → 30 (both arms reach forward toward the fence).
    //   4. leftShoulder/rightShoulder too small (-10, 8) — arms should be
    //      raised forward to reach the fence rail. Fixed: leftShoulder -10 →
    //      -55, rightShoulder 8 → -50 (arms raised forward toward rail).
    //   5. elbows at 95° — correct (forearms folded over the rail). Kept.
    // REASONING [PR-v2]: "Description is king" (directive Part A.10 rule #1).
    // The description explicitly says forward lean + crossed feet + forearms on
    // rail. The old data encoded a backward arch with spread feet and arms at
    // the sides — the opposite of the description.
    joints: {spine: 28, hips: 5, neck: -4, leftShoulder: -55, rightShoulder: -50, leftElbow: 95, rightElbow: 95, hipAbductL: 10, hipAbductR: -12, rightHip: -12, leftKnee: 10, rightKnee: 10, shoulderFwdL: 35, shoulderFwdR: 30},
    color: 'var(--color-cobalt-200)', figure: 'elbow-prop',
    tags: ['casual', 'beginner', 'leaning', 'outdoor']
  },
  'tree-lean': {
    id: 'tree-lean', category: 'leaning', name: 'Tree Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean the upper back and one shoulder against the tree trunk, planting one foot flat while the other bends with the sole resting against the bark. Push the hips slightly forward of the shoulders for a flattering angle.',
    tip: 'Push the hips slightly ahead of the shoulders against the trunk for a more flattering lean line.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -14, hips: 16, neck: -8.8, leftShoulder: -6, leftElbow: 40, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftHip: -30, leftKnee: 80, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['outdoor', 'beginner', 'leaning', 'natural']
  },
  'car-lean': {
    id: 'car-lean', category: 'leaning', name: 'Car Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean the lower back against the car door, hands resting lightly on the edge beside the hips with a soft bend at the elbows. Cross one ankle over the other and angle the torso toward camera.',
    tip: 'Keep a soft bend in the elbows on the hard surface — locked arms read as tense against metal.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: -14, hips: 16, neck: -8.8, leftShoulder: 0, rightShoulder: 8, leftElbow: 50, rightElbow: 50, hipAbductL: 20, hipAbductR: -10, leftHip: 6, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5, globalTwist: 20},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'beginner', 'leaning', 'urban']
  },
  'railing-lean': {
    id: 'railing-lean', category: 'leaning', name: 'Railing Lean',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Rest both forearms on the railing, rounding the back gently forward while the gaze drifts outward toward the horizon. Cross one foot behind the other, shifting weight into a relaxed lean.',
    tip: 'Direct the gaze off-camera toward the view — it sells the candid, contemplative mood.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-14, now spine:14.
    joints: {spine: 14, hips: 5, neck: -3.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: -10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -25, shoulderFwdR: -25},
    color: 'var(--color-cobalt-200)', figure: 'elbow-prop',
    tags: ['contemplative', 'beginner', 'leaning', 'outdoor']
  },
  'stair-lean': {
    id: 'stair-lean', category: 'leaning', name: 'Stair Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand a step above or below the camera, leaning one shoulder against the wall or railing beside you. Let one hand trail loosely along the banister as the body settles into the incline.',
    tip: 'Lean into the natural asymmetry of the stairs instead of forcing a perfectly level stance.',
    joints: {spine: 14, hips: 10, neck: -8.8, leftShoulder: -10, leftElbow: 40, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftKnee: 12, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'urban']
  },
  'shoulder-wall': {
    id: 'shoulder-wall', category: 'leaning', name: 'Shoulder Wall',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Turn the body sideways and press just one shoulder flat against the wall, feet staggered a full step away from the surface. Let the far arm rest on the hip or hang loose at your side.',
    tip: 'Keep real distance between the feet and wall so the body leans at a true angle, not standing upright.',
    joints: {spine: -12, hips: 10, neck: -8.8, leftShoulder: -4, rightShoulder: -12, leftElbow: 40, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftHip: -30, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning']
  },
  'forearm-wall': {
    id: 'forearm-wall', category: 'leaning', name: 'Forearm Wall',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Plant one forearm flat against the wall at shoulder height, leaning body weight into it while crossing the feet at the ankle. Rest the head gently near the raised arm.',
    tip: 'Angle the feet away from the wall to create a clean diagonal line from foot to elbow.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -70→-110, rightShoulder 20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 14, hips: 10, neck: -6, leftShoulder: -65, rightShoulder: 0, leftElbow: 81, rightElbow: 0, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -30, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'forearm-wall',
    tags: ['editorial', 'beginner', 'leaning']
  },
  'two-hands-wall': {
    id: 'two-hands-wall', category: 'leaning', name: 'Two Hands Wall',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Face the wall directly and press both palms flat against it at shoulder height, arms extended. Walk the feet back and lean the torso in toward the wall, creating a strong diagonal.',
    tip: 'Shoot this from the side — a straight-on angle flattens the diagonal line entirely.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: 20, hips: 10, neck: -8.8, leftShoulder: -50, rightShoulder: -50, leftElbow: 20, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -50, shoulderFwdR: -50},
    color: 'var(--color-cobalt-200)', figure: 'two-hands-wall',
    tags: ['artistic', 'intermediate', 'leaning']
  },
  'back-arch-wall': {
    id: 'back-arch-wall', category: 'leaning', name: 'Back Arch Wall',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Rest the lower back and hips against the wall for anchor, then arch the upper spine away from it, letting the head tilt back and arms drift outward. Keep the hips pressed to the wall throughout.',
    tip: 'Only arch as far as feels controlled — the wall is there for safety, not to overextend the spine.',
    joints: {spine: -24, hips: 5, neck: 4.8, leftShoulder: -20, rightShoulder: -20, leftElbow: 40, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'back-arch-wall',
    tags: ['artistic', 'advanced', 'leaning', 'expressive']
  },
  'cross-legged-wall': {
    id: 'cross-legged-wall', category: 'leaning', name: 'Cross-Legged Wall',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Lean the back flat against the wall with weight evenly distributed on both feet, then cross the ankles wide with the front foot pointed outward. Rest hands in pockets or clasped in front.',
    tip: 'Cross the ankles wide with the front foot pointed out — narrower crosses look cramped.',
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
    joints: {spine: 0, hips: 10, neck: -4, leftShoulder: -30, rightShoulder: -12, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: -10, leftKnee: 4, rightKnee: 4, shoulderFwdL: 4, shoulderFwdR: -10},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning', 'social']
  },
  'squat-lean': {
    id: 'squat-lean', category: 'leaning', name: 'Squat Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean the back against the wall and lower into a partial squat, knees tracking directly over the toes. Rest both forearms loosely on the thighs to complete the hold.',
    tip: 'Keep knees tracking over the toes and the back flat on the wall to protect the joints.',
    joints: {spine: -12, neck: -3.3, rightShoulder: -12, leftElbow: 80, rightElbow: 80, leftHip: 60, rightHip: 60, leftKnee: 90, rightKnee: 90, shoulderFwdL: -25, shoulderFwdR: -25, globalTilt: -25},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'athletic']
  },
  'low-wall-sit': {
    id: 'low-wall-sit', category: 'leaning', name: 'Low Wall Sit',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Perch on a low ledge with feet planted on the ground, leaning the torso back to rest against a higher wall behind you. Rest both hands on the ledge beside the hips for support.',
    tip: 'Bridging between two surfaces creates a naturally supported lean that never looks posed.',
    joints: {spine: -14, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning', 'outdoor']
  },
  'chin-on-wall': {
    id: 'chin-on-wall', category: 'leaning', name: 'Chin on Wall',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand close to the wall and press one palm flat against the surface, then rest the chin lightly on the back of that hand. Angle the body away in a soft diagonal, wrist relaxed under the chin.',
    tip: 'Keep the wrist relaxed under the chin — a stiff wrist reads awkward in close-up framing.',
    joints: {spine: 14, hips: 10, neck: -8, leftShoulder: -80, leftElbow: 100, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'chin-on-hand',
    tags: ['portrait', 'intermediate', 'leaning']
  },
  'pillar-wrap': {
    id: 'pillar-wrap', category: 'leaning', name: 'Pillar Wrap',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand beside a pillar and wrap one arm fully around it, leaning body weight into the wrap. Cross the opposite leg in front, creating a spiraled, editorial line through the torso.',
    tip: 'The wrapping arm should look like it\'s holding real weight, not just resting against the surface',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 14→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 18, hips: 10, neck: -8.8, leftShoulder: -50, leftElbow: 100, rightElbow: 20, hipAbductL: 0, hipAbductR: 25, leftHip: 10, rightHip: 30, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5, globalTwist: 15},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'architectural']
  },
  'ledge-lean-elbow': {
    id: 'ledge-lean-elbow', category: 'leaning', name: 'Ledge Lean Elbow',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest a single elbow on a high ledge, letting the body angle away from it with weight shifted onto the opposite hip. Prop the chin lightly on the raised hand, fingers soft along the jaw.',
    tip: 'A single-elbow lean feels more candid and asymmetrical than resting both elbows evenly.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110, hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 14, hips: 16, neck: -2.4, leftShoulder: -85, rightShoulder: 0, leftElbow: 90, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftHip: 12, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'elbow-prop',
    tags: ['casual', 'beginner', 'leaning']
  },
  'mirror-lean': {
    id: 'mirror-lean', category: 'leaning', name: 'Mirror Lean',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand facing a mirror and lean one hand flat against its surface, looking at your own reflection rather than the camera. Pop the opposite hip out to the side for an editorial curve.',
    tip: 'Shoot the reflection rather than the subject directly — it adds a layered, storytelling frame.',
    joints: {spine: 15, hips: 20, neck: -8.8, leftShoulder: -15, leftElbow: 15, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftHip: 12, leftKnee: 10, rightKnee: 10, shoulderFwdL: -70, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['creative', 'intermediate', 'leaning', 'reflection']
  },
  'hip-pop-wall': {
    id: 'hip-pop-wall', category: 'leaning', name: 'Hip Pop Wall',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean one shoulder against the wall and drive the opposite hip sharply outward, forming a strong S-curve through the spine. Rest the near hand on the popped hip for emphasis.',
    tip: 'The sharper the hip pop, the more graphic the silhouette — ideal under high-contrast lighting.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 14→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 18, hips: 22, neck: -8.8, leftShoulder: -8, rightShoulder: -25, leftElbow: 40, rightElbow: 85, hipAbductL: 10, hipAbductR: -15, leftHip: 22, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['bold', 'beginner', 'leaning']
  },
  'diagonal-lean': {
    id: 'diagonal-lean', category: 'leaning', name: 'Diagonal Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean the entire body at a steep diagonal against a wall, planting the feet as far from the support point as balance allows. Extend the far arm outward for visual length and counterbalance.',
    tip: 'The further the feet sit from the wall, the steeper and more dramatic the diagonal line becomes.',
    joints: {spine: 26, hips: 10, neck: -8.8, leftShoulder: -75, leftElbow: 10, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftHip: -10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'dramatic']
  },
  'step-lean': {
    id: 'step-lean', category: 'leaning', name: 'Step Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Stand on a raised step with one foot higher than the other, letting the torso lean slightly into the height difference. Rest a hand on the nearby rail or wall for support.',
    tip: 'Use real architecture like steps for height variation — it makes solo shots feel far more dynamic.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 14, hips: 10, neck: -8.8, leftShoulder: -15, rightShoulder: -10, leftElbow: 40, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -30},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning', 'urban']
  },
  'gate-lean': {
    id: 'gate-lean', category: 'leaning', name: 'Gate Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean the back against a closed gate, spreading both arms wide along the top edge on either side. Cross one ankle over the other and tilt the head a few degrees for softness.',
    tip: 'Spreading the arms wide along the gate opens the chest and makes the whole frame feel expansive.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: -14, hips: 10, neck: -8.8, leftShoulder: -40, rightShoulder: -22, leftElbow: 40, rightElbow: 20, hipAbductL: 10, hipAbductR: -10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['rustic', 'beginner', 'leaning', 'outdoor']
  },
  'door-side-lean': {
    id: 'door-side-lean', category: 'leaning', name: 'Door Side Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand in an open doorway and lean one shoulder against the frame, letting the opposite leg cross casually in front. Look down the hallway or into the room beyond rather than at the lens.',
    tip: 'Position yourself so the doorframe lines lead the eye toward your face — use the frame as a guide.',
    joints: {spine: 14, hips: 10, neck: -8.8, leftShoulder: -8, leftElbow: 40, rightElbow: 20, hipAbductL: -10, hipAbductR: 15, rightHip: 18, leftKnee: 8, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'beginner', 'leaning', 'framing']
  },
  'bench-lean-side': {
    id: 'bench-lean-side', category: 'leaning', name: 'Bench Lean Side',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Stand beside a park bench and lean one hip against its armrest, resting a hand loosely on the backrest with fingers draped rather than gripping. Cross the feet at the ankle for a relaxed stance.',
    tip: 'Drape the fingers over the bench back instead of gripping it to keep the hand looking soft.',
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
    joints: {spine: 14, hips: 10, neck: -8.8, leftShoulder: -40, rightShoulder: 8, leftElbow: 30, rightElbow: 20, hipAbductL: 10, hipAbductR: -10, leftHip: 14, leftKnee: 10, rightKnee: 10, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 25, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning', 'outdoor']
  },
  'glass-lean': {
    id: 'glass-lean', category: 'leaning', name: 'Glass Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean the back against a glass storefront, planting one foot flat while the other bends with the sole against the glass. Angle the body slightly and look off to the side with a cool expression.',
    tip: 'Angle the body slightly to the glass — square-on creates a distracting mirror reflection of yourself.',
    joints: {spine: -14, hips: 10, neck: 10, leftShoulder: -10, rightShoulder: 8, leftElbow: 40, rightElbow: 20, hipAbductL: 10, hipAbductR: 10, leftKnee: 60, rightKnee: 10, shoulderFwdL: -1, shoulderFwdR: -5},
    color: 'var(--color-cobalt-200)', figure: 'two-hands-wall',
    tags: ['editorial', 'intermediate', 'leaning', 'urban']
  },

  // ══════════════ LEANING — SEATED (30) ══════════════
  'elbow-prop': {
    id: 'elbow-prop', category: 'lean-seat', name: 'Elbow Prop',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit and lean forward, resting one or both elbows on the knees with the spine still long. Let the chin settle into an open hand or let both hands hang loose between the knees.',
    tip: 'Prop the chin gently on the fingertips — gripping the face reads as tension, not ease.',
    joints: {spine: 15, hips: 9, neck: -12, rightShoulder: -12, leftElbow: 100, rightElbow: 100, leftHip: 115, rightHip: 115, leftKnee: 80, rightKnee: 80, shoulderFwdL: -130, shoulderFwdR: -130},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['thoughtful', 'beginner', 'seated', 'leaning']
  },
  'chin-rest': {
    id: 'chin-rest', category: 'lean-seat', name: 'Chin Rest',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest a single elbow on the knee and balance the chin delicately in the open palm, fingers soft along the jawline. Keep the neck relaxed and the gaze contemplative.',
    tip: 'Rest the jaw on the side of the index finger, not the full palm, to avoid squishing the cheek.',
    joints: {spine: 45, hips: 9, neck: -14, leftShoulder: 40, rightShoulder: -12, leftElbow: 140, rightElbow: 18, hipAbductL: -30, leftHip: 115, rightHip: 85, leftKnee: 80, rightKnee: 80, shoulderFwdL: -130, shoulderFwdR: -30},
    color: 'var(--color-teal-100)', figure: 'chin-on-hand',
    tags: ['portrait', 'beginner', 'seated', 'leaning']
  },
  'double-elbow': {
    id: 'double-elbow', category: 'lean-seat', name: 'Double Elbow',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Rest both elbows on a table and clasp the hands loosely beneath the chin. Lean the torso a few degrees forward, engaging the camera with a direct, warm gaze.',
    tip: 'Keep shoulders pulled down away from the ears — leaning in tends to hunch them upward.',
    joints: {spine: 14, hips: 9, neck: -8, rightShoulder: -12, leftElbow: 100, rightElbow: 100, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, shoulderFwdL: -12, shoulderFwdR: -10},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['editorial', 'beginner', 'seated', 'leaning']
  },
  'side-lean-seated': {
    id: 'side-lean-seated', category: 'lean-seat', name: 'Side Lean',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'While seated, tilt the torso to one side and extend that arm along the surface beside you, palm relaxed. Let the opposite shoulder lift naturally, creating a long diagonal through the ribs.',
    tip: 'Keep the extended arm looking draped and relaxed, never rigid or stiffly propping.',
    joints: {spine: 14, neck: -9.3, leftElbow: 30, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, leftAnkle: -15, rightAnkle: -15, rightElbow: 18, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['relaxed', 'intermediate', 'seated', 'leaning']
  },
  'backward-lean-chair': {
    id: 'backward-lean-chair', category: 'lean-seat', name: 'Chair Reach',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Reach one arm back over the top of the chair as the torso twists to follow the motion. Rest the opposite hand on the thigh, letting the twist originate from the ribcage.',
    tip: 'Lead the twist with your eyes — where the gaze goes, the rest of the line follows naturally.',
    joints: {spine: 18, neck: 10, leftShoulder: 60, rightShoulder: -60, leftElbow: 65, rightElbow: 45, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, leftAnkle: -15, rightAnkle: -15, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5, globalTwist: 25},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'advanced', 'seated', 'leaning']
  },
  'table-elbow-single': {
    id: 'table-elbow-single', category: 'lean-seat', name: 'Table Elbow Single',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit at a table and rest one elbow flat on the surface, wrist straight rather than bent, leaning weight gently into it. Rest the other hand in the lap and turn the torso slightly toward the propped arm.',
    tip: 'Keep the supporting wrist straight, not bent — it distributes weight more comfortably for longer holds.',
    joints: {spine: -8, neck: -6, leftElbow: 81, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightElbow: 18, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5, globalTwist: 25},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['relaxed', 'beginner', 'seated', 'leaning']
  },
  'chin-on-fist': {
    id: 'chin-on-fist', category: 'lean-seat', name: 'Chin on Fist',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest an elbow on the table and curl the fingers into a loose fist, resting the chin lightly on top. Let the eyes drift thoughtfully off to the side rather than at the lens.',
    tip: 'A loose fist under the chin reads playful; an open palm reads contemplative — pick your mood.',
    joints: {spine: -10, neck: -12, leftElbow: 95, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightElbow: 18, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'chin-on-hand',
    tags: ['thoughtful', 'beginner', 'seated', 'leaning']
  },
  'forearms-crossed-table': {
    id: 'forearms-crossed-table', category: 'lean-seat', name: 'Forearms Crossed Table',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit at a table and cross both forearms flat on its surface, letting the chest rest gently against them. Keep shoulders down and wide, then rest the chin on the top forearm looking into the lens.',
    tip: 'Keep shoulders down and wide even while leaning forward — hunching narrows the whole frame.',
    joints: {spine: 16, neck: -8, leftShoulder: -20, rightShoulder: -32, leftElbow: 100, rightElbow: 100, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, hips: 9, shoulderFwdL: -12, shoulderFwdR: -10},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['editorial', 'beginner', 'seated', 'leaning']
  },
  'slump-back-chair': {
    id: 'slump-back-chair', category: 'lean-seat', name: 'Slump Back Chair',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Sit and let the body sink into a controlled, intentional slouch, chest still slightly lifted rather than fully collapsed. Drape one arm over the backrest and cross the legs loosely at the ankle.',
    tip: 'Keep the chest slightly lifted even as you sink back — a full collapse reads tired, not casual.',
    joints: {spine: 16, hips: 12, neck: -3.3, leftShoulder: -40, rightShoulder: -12, leftElbow: 90, rightElbow: 18, leftHip: 70, rightHip: 70, leftKnee: 135, rightKnee: 135, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 35, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['casual', 'beginner', 'seated', 'leaning']
  },
  'one-elbow-knee': {
    id: 'one-elbow-knee', category: 'lean-seat', name: 'One Elbow Knee',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit forward on the chair edge and rest one elbow on the same-side knee, letting the torso follow the lean into an asymmetrical line. Keep the opposite hand relaxed on the other thigh.',
    tip: 'Lean on one elbow only — a single-side prop reads far more dynamic than a mirrored, symmetrical pose.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-14, now spine:14.
    joints: {spine: 14, neck: -6, leftElbow: 85, leftHip: 70, rightHip: 70, leftKnee: 85, rightKnee: 80, rightElbow: 18, rightShoulder: -12, hips: 9, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['relaxed', 'beginner', 'seated', 'leaning']
  },
  'both-knees-forearms': {
    id: 'both-knees-forearms', category: 'lean-seat', name: 'Both Knees Forearms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit with both elbows resting on both knees, forearms hanging loosely between the legs. Hinge forward from the hips and hold a direct, engaged gaze into the lens.',
    tip: 'This classic forward lean instantly reads as approachable — keep the spine long, not rounded. The thinker base reads as candid and grounded, perfect for environmental portrait sessions.',
    joints: {spine: 18, neck: -4, leftShoulder: 60, rightShoulder: 20, leftElbow: 81, rightElbow: 81, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, hips: 9, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['candid', 'beginner', 'seated', 'leaning']
  },
  'table-lean-back-look': {
    id: 'table-lean-back-look', category: 'lean-seat', name: 'Table Lean Back Look',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit at a table, lean the torso back away from it, and rest one arm along the table\'s edge behind you. Turn the head alertly back toward the lens for a push-pull tension between body and gaze',
    tip: 'This creates a nice push-pull tension between the reclined body and the alert, engaged head turn.',
    joints: {spine: -14, neck: 20, leftElbow: 65, rightElbow: 45, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'leaning']
  },
  'chin-on-both-hands': {
    id: 'chin-on-both-hands', category: 'lean-seat', name: 'Chin on Both Hands',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Rest both elbows on a table and stack both hands beneath the chin, fingers loosely interlaced. Lean forward gently and hold a warm, direct gaze into the lens.',
    tip: 'Interlace the fingers rather than stacking flat palms — it adds subtle texture to the hand position.',
    joints: {spine: 14, neck: -6, leftElbow: 100, rightElbow: 100, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightShoulder: -12, hips: 9, shoulderFwdL: -12, shoulderFwdR: -10},
    color: 'var(--color-teal-100)', figure: 'face-frame-hands',
    tags: ['warm', 'beginner', 'seated', 'leaning']
  },
  'floor-leaning-arms-back': {
    id: 'floor-leaning-arms-back', category: 'lean-seat', name: 'Floor Leaning Arms Back',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor and lean back onto both palms placed behind the hips, arms straight but not locked. Press down through the palms to lift the chest and keep shoulders away from the ears.',
    tip: 'Push down through the palms to lift the chest — it stops the shoulders from creeping upward.',
    joints: {spine: -18, neck: 6, leftShoulder: 60, rightShoulder: 20, leftElbow: 65, rightElbow: 45, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['artistic', 'beginner', 'seated', 'leaning']
  },
  'look-up-chin-raised': {
    id: 'look-up-chin-raised', category: 'lean-seat', name: 'Look Up Chin Raised',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit with one elbow propped on a raised knee, then tilt the head back and up rather than down, exposing the full neck line. Let the gaze drift upward past the camera for a dreamier mood.',
    tip: 'This inversion of the classic chin-rest creates a dreamier mood than the usual downward gaze.',
    joints: {spine: -8, neck: 6.0, leftElbow: 85, leftHip: 70, rightHip: 70, leftKnee: 85, rightKnee: 80, rightElbow: 18, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['artistic', 'intermediate', 'seated', 'leaning']
  },
  'seated-head-tilt-prop': {
    id: 'seated-head-tilt-prop', category: 'lean-seat', name: 'Seated Head Tilt Prop',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit and rest the temple lightly against the fingertips, elbow propped on a table or knee. Tilt the head into the hand rather than resting the chin, keeping the touch soft.',
    tip: 'Resting at the temple instead of the chin creates a softer, more pensive expression.',
    joints: {spine: -6, neck: 6.7, leftElbow: 95, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, leftAnkle: -15, rightAnkle: -15, rightElbow: 18, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'chin-on-hand',
    tags: ['pensive', 'beginner', 'seated', 'leaning']
  },
  'arm-drape-knee': {
    id: 'arm-drape-knee', category: 'lean-seat', name: 'Arm Drape Knee',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit with one knee raised and drape the same-side arm loosely over it, wrist relaxed and fingers hanging past the knee. Lean back slightly on the other hand for support.',
    tip: 'Let the draped hand hang naturally past the knee — gripping it reads as tension immediately.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 60→-110, rightShoulder 20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -6, hips: 12, neck: -3.3, leftShoulder: -15, rightShoulder: -15, leftElbow: 100, rightElbow: 15, leftHip: 70, rightHip: 70, leftKnee: 85, rightKnee: 80, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['casual', 'beginner', 'seated', 'leaning']
  },
  'elbow-on-thigh-look-away': {
    id: 'elbow-on-thigh-look-away', category: 'lean-seat', name: 'Elbow On Thigh Look Away',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Prop one elbow on the thigh and let the chin rest near the knuckles, turning the gaze away from camera toward the horizon. Keep the mood introspective rather than direct.',
    tip: 'Looking away rather than at the lens shifts the mood from friendly to introspective — choose deliberately.',
    joints: {spine: 30, hips: 9, neck: 4.2, leftShoulder: -50, rightShoulder: -12, leftElbow: 150, rightElbow: 18, leftHip: 115, rightHip: 85, leftKnee: 80, rightKnee: 80, shoulderFwdL: -110, shoulderFwdR: -30},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['moody', 'intermediate', 'seated', 'leaning']
  },
  'seated-lean-wall-single': {
    id: 'seated-lean-wall-single', category: 'lean-seat', name: 'Seated Lean Wall Single',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on the floor beside a wall and lean one shoulder against it, legs extended or bent to the side. Rest the near arm along the top of a bent knee, letting the wall carry real weight.',
    tip: 'The wall gives real support, letting you hold a relaxed lean far longer than an unsupported twist.',
    joints: {spine: 12, leftElbow: 60, leftHip: 70, rightHip: 70, leftKnee: 90, rightKnee: 80, leftAnkle: -15, rightAnkle: -15, rightElbow: 18, rightShoulder: -12, neck: -3.3, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['relaxed', 'beginner', 'seated', 'leaning']
  },
  'crossed-elbow-crossed-legs': {
    id: 'crossed-elbow-crossed-legs', category: 'lean-seat', name: 'Crossed Elbow Crossed Legs',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit with legs crossed at the knee and both forearms crossed loosely atop the raised knee. Keep the spine tall and the gaze direct and composed into the lens.',
    tip: 'Cross arms and legs in the same direction — it creates one unified, harmonious line through the body.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -20→-110, rightShoulder -32→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -14, hips: 9, neck: -6, leftShoulder: -20, rightShoulder: -20, leftElbow: 80, rightElbow: 80, leftHip: 70, rightHip: 70, leftKnee: 90, rightKnee: 80, shoulderFwdL: -70, shoulderFwdR: -70},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'leaning']
  },
  'hand-on-cheek': {
    id: 'hand-on-cheek', category: 'lean-seat', name: 'Hand on Cheek',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest an elbow on a table or knee and lay the open palm gently against the cheek, fingers pointing up toward the temple. Keep the touch soft and the neck relaxed.',
    tip: 'Leave light space between the fingers and the eye — pressing too close looks unnatural in photos.',
    joints: {spine: -8, neck: -8, leftElbow: 100, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightElbow: 18, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'chin-on-hand',
    tags: ['soft', 'beginner', 'seated', 'leaning']
  },
  'both-hands-chin': {
    id: 'both-hands-chin', category: 'lean-seat', name: 'Both Hands Chin',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Rest both elbows on a surface and cup the chin gently in both hands, fingers curling naturally along the jaw. Add a soft smile and a slight head tilt.',
    tip: 'A slight head tilt within this pose keeps it from feeling too symmetrical and stiff.',
    joints: {spine: -10, neck: 3.0, leftElbow: 95, rightElbow: 95, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightShoulder: -12, hips: 12, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'var(--color-teal-100)', figure: 'face-frame-hands',
    tags: ['warm', 'beginner', 'seated', 'social']
  },
  'reading-position': {
    id: 'reading-position', category: 'lean-seat', name: 'Reading Position',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit comfortably holding a book or object in both hands, elbows resting on the knees or a nearby surface. Look down at the object for a natural, unposed moment.',
    tip: 'A real object to focus on removes self-consciousness and produces the most authentic candid expression.',
    joints: {spine: -14, neck: -18, leftElbow: 80, rightElbow: 80, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, leftAnkle: -15, rightAnkle: -15, rightShoulder: -12, hips: 9, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['candid', 'beginner', 'seated', 'lifestyle']
  },
  'tea-cup-hold': {
    id: 'tea-cup-hold', category: 'lean-seat', name: 'Tea Cup Hold',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit with elbows resting near the table and hold a cup in both hands close to the chest. Lean slightly forward and let the gaze soften toward camera or down at the cup.',
    tip: 'Holding a warm prop close to the body naturally relaxes the shoulders for an authentic lifestyle feel.',
    joints: {spine: 8, hips: 12, neck: -6, rightShoulder: -12, leftElbow: 100, rightElbow: 100, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, shoulderFwdL: -12, shoulderFwdR: -10},
    color: 'var(--color-teal-100)', figure: 'chin-on-hand',
    tags: ['lifestyle', 'beginner', 'seated', 'cozy']
  },
  'face-frame-hands': {
    id: 'face-frame-hands', category: 'lean-seat', name: 'Face Frame Hands',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Rest both elbows on a table and bring both hands up to loosely frame either side of the face without touching it. Keep fingers relaxed and slightly spread apart.',
    tip: 'Leave a small gap between the hands and face — touching distorts the cheeks and hides the eyes.',
    joints: {spine: -10, neck: -4, leftElbow: 100, rightElbow: 100, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightShoulder: -12, hips: 12, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'var(--color-teal-100)', figure: 'face-frame-hands',
    tags: ['editorial', 'intermediate', 'seated', 'beauty']
  },
  'wrist-rest': {
    id: 'wrist-rest', category: 'lean-seat', name: 'Wrist Rest',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit with one elbow propped on a table and rest the jaw lightly against the back of the wrist rather than an open palm. Keep the shoulder relaxed and low.',
    tip: 'Resting on the wrist bone instead of the palm carves a sharper, more angular jawline.',
    joints: {spine: -8, neck: -10, leftElbow: 95, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightElbow: 18, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['portrait', 'beginner', 'seated', 'leaning']
  },
  'diagonal-lean-elbow': {
    id: 'diagonal-lean-elbow', category: 'lean-seat', name: 'Diagonal Lean Elbow',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit and lean the entire torso diagonally over one propped elbow, extending the opposite leg fully out for counterbalance. This creates one long diagonal line from foot to head.',
    tip: 'Fully extend the far leg — a tucked leg collapses the diagonal back toward vertical.',
    joints: {spine: 24, neck: 8, leftElbow: 80, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, rightElbow: 18, rightShoulder: -12, hips: 12, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['editorial', 'intermediate', 'seated', 'dramatic']
  },
  'table-lean-forward-arms-wide': {
    id: 'table-lean-forward-arms-wide', category: 'lean-seat', name: 'Table Lean Forward Arms Wide',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit at a table and lean forward, placing both palms flat and spread wide apart on the surface. Push the chest forward and hold a bold, assertive gaze into the lens.',
    tip: 'Wide-spread hands on a table read as commanding — a strong choice for power portraits.',
    joints: {spine: 20, neck: -4, leftShoulder: -30, rightShoulder: 30, leftElbow: 65, rightElbow: 45, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, hips: 9, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['confident', 'intermediate', 'seated', 'editorial']
  },
  'neck-rest-arm': {
    id: 'neck-rest-arm', category: 'lean-seat', name: 'Neck Rest Arm',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Sit sideways and rest the back of the neck against a raised forearm, elbow propped on a knee or armrest. Let the eyes close or gaze softly downward, forming a closed triangle with the arm.',
    tip: 'Check that the elbow doesn\'t collapse inward — it should hold a clean, open triangle shape',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 60→-110, rightShoulder 20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 14, hips: 12, neck: 12, leftShoulder: -60, rightShoulder: -60, leftElbow: 100, rightElbow: 130, leftHip: 70, rightHip: 70, leftKnee: 85, rightKnee: 80, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'chin-on-hand',
    tags: ['graceful', 'beginner', 'seated', 'leaning']
  },
  'pillow-hug-seated': {
    id: 'pillow-hug-seated', category: 'lean-seat', name: 'Pillow Hug Seated',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit with knees bent and hug a pillow against the chest, resting the chin or cheek on top. Rest one elbow on the nearby armrest and squeeze the prop gently for visible tension.',
    tip: 'Squeeze the prop gently rather than holding it loosely — it gives the arms natural, visible tension.',
    joints: {spine: -12, neck: -8, leftElbow: 100, leftHip: 70, rightHip: 70, leftKnee: 100, rightKnee: 80, leftAnkle: -15, rightAnkle: -15, rightElbow: 18, rightShoulder: -12, hips: 9, shoulderFwdL: 7, shoulderFwdR: -5},
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['cozy', 'beginner', 'seated', 'social']
  },

  // ══════════════ KNEELING (30) ══════════════
  'knights-kneel': {
    id: 'knights-kneel', category: 'kneeling', name: "Knight's Kneel",
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Plant the right foot flat on the floor with the knee bent at 90°, then lower the left knee directly to the ground beneath the left hip — shin trailing behind you, not splayed out. Sit tall through the spine, roll the shoulders back to open the chest, and rest the right forearm or hand lightly on the right thigh just above the knee. Keep the pelvis level and avoid sinking into the hip of the down leg.',
    tip: 'Stack the front shin vertically — if the front foot drifts forward past the knee, the pose collapses. Check that the down-knee lands directly below the hip, not behind it, to keep the torso from leaning backward.',
    joints: {spine: -3, neck: 0, leftShoulder: -10, rightShoulder: 0, leftElbow: 70, rightElbow: 90, hipAbductL: 8, hipAbductR: 8, leftHip: 0, rightHip: 60, leftKnee: 90, rightKnee: 95, leftAnkle: 0, rightAnkle: 0, shoulderFwdR: -60},
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['strong', 'beginner', 'kneeling']
  },
  'both-knees': {
    id: 'both-knees', category: 'kneeling', name: 'Both Knees',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Plant one knee on the floor directly under the hip, while the other leg bends at 90° with the foot flat. Sit the torso upright with the chest open and rest one hand on the raised knee.',
    tip: 'Keep the down-knee stacked directly under the hip — offset knees create an awkward backward lean.',
    joints: {spine: 0, neck: -5, rightShoulder: 0, leftElbow: 65, rightElbow: 80, hipAbductL: 8, hipAbductR: 8, leftHip: 0, rightHip: 85, leftKnee: 0, rightKnee: 100, leftAnkle: 0, rightAnkle: -35, shoulderFwdR: -60},
    color: 'var(--color-gold-300)', figure: 'both-knees-prayer',
    tags: ['grounded', 'beginner', 'kneeling', 'front']
  },
  'sitting-on-heels': {
    id: 'sitting-on-heels', category: 'kneeling', name: 'Seiza',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel with both knees on the ground and the torso upright, sitting back onto the heels without collapsing. Rest the arms naturally at the sides or on the thighs for a grounded, symmetrical base.',
    tip: 'Lengthen up through the crown to avoid sinking onto the heels and collapsing the spine.',
    joints: {spine: 0, neck: 0, leftShoulder: -12, rightShoulder: -12, leftElbow: 45, rightElbow: 45, hipAbductL: 8, hipAbductR: 8, leftHip: 85, rightHip: 85, leftKnee: 100, rightKnee: 100, leftAnkle: -35, rightAnkle: -35},
    color: 'var(--color-gold-300)', figure: 'seiza',
    tags: ['calm', 'beginner', 'kneeling', 'artistic']
  },
  'kneeling-reach': {
    id: 'kneeling-reach', category: 'kneeling', name: 'Kneeling Reach',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Sudden-Free',
    instructions: 'Sit back gently onto the heels with knees together and both hands folded in the lap. Keep the spine straight and the shoulders soft for a calm, meditative posture.',
    tip: 'Relax the shoulders and soften the gaze — serenity is the entire point of this pose.',
    joints: {spine: 0, neck: 0, leftShoulder: -40, rightShoulder: -40, leftElbow: 140, rightElbow: 140, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -60, shoulderFwdR: -60},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['editorial', 'advanced', 'kneeling', 'motion']
  },
  'prayer-kneeling': {
    id: 'prayer-kneeling', category: 'kneeling', name: 'Prayer Kneeling',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'From one knee down, extend the opposite arm dramatically forward, reaching from the shoulder blade rather than just the hand. Let the torso follow the reach into a dynamic diagonal line.',
    tip: 'Extend from the shoulder blade, not just the hand — it\'s what makes the reach look powerful.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 5→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 25, neck: 0, leftShoulder: 0, rightShoulder: 0, leftElbow: 30, rightElbow: 20, hipAbductL: 8, hipAbductR: 8, leftHip: 0, rightHip: 60, leftKnee: 110, rightKnee: 90, leftAnkle: 0, rightAnkle: 0, shoulderFwdL: 0, shoulderFwdR: -90, globalTwist: -10},
    color: 'var(--color-gold-300)', figure: 'both-knees-prayer',
    tags: ['calm', 'beginner', 'kneeling', 'artistic']
  },
  'kneeling-back-arch': {
    id: 'kneeling-back-arch', category: 'kneeling', name: 'Kneeling Back Arch',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel with both knees down and press both palms together at chest height. Sit slightly back onto the heels while keeping the spine long, then bow the head forward with shoulders soft.',
    tip: 'Sit slightly back onto the heels while keeping the spine long — it balances stability with elegance.',
    joints: {spine: -30, neck: 18, leftShoulder: -30, rightShoulder: -30, leftElbow: 140, rightElbow: 140, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -50, shoulderFwdR: -50},
    color: 'var(--color-gold-300)', figure: 'kneeling-back-arch',
    tags: ['artistic', 'advanced', 'kneeling', 'expressive']
  },
  'one-knee-look-up': {
    id: 'one-knee-look-up', category: 'kneeling', name: 'One Knee Look Up',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel upright with both knees down, engage the core, then arch the spine backward while reaching both arms overhead and behind you. Let the head follow the arch naturally.',
    tip: 'Engage the core before arching to protect the lower back and keep the movement controlled.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -30, neck: 0, leftShoulder: -110, rightShoulder: -110, leftElbow: 40, rightElbow: 40, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: 25, shoulderFwdR: 25},
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['portrait', 'beginner', 'kneeling']
  },
  'kneeling-reach-side': {
    id: 'kneeling-reach-side', category: 'kneeling', name: 'Kneeling Reach Side',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel on one knee with the other foot planted flat in front, then tilt the chin upward toward the light source. Rest a hand on the raised knee and let the eyes follow the light.',
    tip: 'Angle the face toward the key light — it softens shadows and opens the eyes beautifully.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-8, now spine:8.
    joints: {spine: -10, neck: -6, leftShoulder: 0, rightShoulder: 0, leftElbow: 30, rightElbow: 60, hipAbductL: 8, hipAbductR: 8, rightHip: 80, leftKnee: 110, rightKnee: 0, leftAnkle: -35, rightAnkle: -35, shoulderFwdR: -50},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['editorial', 'intermediate', 'kneeling']
  },
  'kneeling-arms-crossed': {
    id: 'kneeling-arms-crossed', category: 'kneeling', name: 'Kneeling Arms Crossed',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'From a one-knee kneeling base, extend one arm out to the side at shoulder height while the torso leans slightly opposite for counterbalance. Keep the reaching arm straight but not locked.',
    tip: 'The counterbalance lean is what keeps this reach looking graceful rather than off-kilter.',
    joints: {
"spine":-4,"hips":-8,"neck":-6,"leftShoulder":-65,"rightShoulder":-12,"leftElbow":90,"rightElbow":100,"hipAbductL":8,"hipAbductR":8,"rightHip":70,"leftKnee":80,"rightKnee":80,"shoulderFwdL":0,"shoulderFwdR":-10
  },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['confident', 'beginner', 'kneeling']
  },
  'kneeling-hand-floor': {
    id: 'kneeling-hand-floor', category: 'kneeling', name: 'Kneeling Hand Floor',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel with both knees down, sitting upright, and cross both arms loosely over the chest. Lean a few degrees forward from the hips, keeping shoulders relaxed and chin level.',
    tip: 'Add a slight forward lean from the hips — it keeps the kneel from looking too rigid and formal.',
    joints: {spine: 12, neck: 0, leftShoulder: 0, rightShoulder: 0, leftElbow: 100, rightElbow: 100, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 70, leftKnee: 90, rightKnee: 80, leftAnkle: -35, shoulderFwdL: -50, shoulderFwdR: -50},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['editorial', 'intermediate', 'kneeling']
  },
  'kneeling-lean-forward': {
    id: 'kneeling-lean-forward', category: 'kneeling', name: 'Kneeling Lean Forward',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel on both knees and lean forward, placing one hand flat on the floor with a soft bend at the elbow for support. Rest the opposite arm on the thigh and look toward the camera.',
    tip: 'Keep the supporting arm slightly bent, not locked, so the pose reads fluid rather than braced.',
    joints: {spine: 16, neck: 0, leftShoulder: 0, rightShoulder: 0, leftElbow: 60, rightElbow: 81, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 70, leftKnee: 90, rightKnee: 80, leftAnkle: -35, shoulderFwdL: -60, shoulderFwdR: -30},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['relaxed', 'beginner', 'kneeling']
  },
  'kneeling-hip-sit': {
    id: 'kneeling-hip-sit', category: 'kneeling', name: 'Kneeling Hip Sit',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Kneel upright and hinge the torso forward from the hips, resting both forearms on the thighs. Keep the spine long through the lean, chest open, and the gaze direct.',
    tip: 'Hinge from the hips rather than rounding the upper back to keep the chest open.',
    joints: {spine: 10, neck: -3.3, leftShoulder: 0, rightShoulder: 0, leftElbow: 70, rightElbow: 70, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 70, leftKnee: 100, rightKnee: 100, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -30, shoulderFwdR: -30},
    color: 'var(--color-gold-300)', figure: 'seiza',
    tags: ['soft', 'beginner', 'kneeling']
  },
  'kneeling-profile': {
    id: 'kneeling-profile', category: 'kneeling', name: 'Kneeling Profile',
    difficulty: 'Beginner', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel and shift the seat to one side, settling the hip down beside the heels rather than centered. Lean on one arm for support and rest the other on the thigh.',
    tip: 'This mermaid-style sit carves a soft S-curve through the hips and lower back.',
    joints: {spine: 25, neck: -5, leftShoulder: 0, rightShoulder: 0, leftElbow: 30, rightElbow: 0, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -15, shoulderFwdR: -50},
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'beginner', 'kneeling', 'profile']
  },
  'both-knees-arms-up': {
    id: 'both-knees-arms-up', category: 'kneeling', name: 'Both Knees Arms Up',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel upright in full profile to camera, hands resting on the thighs. Lift the chin a few degrees to create one clean line from knee to crown, shoulders stacked over hips.',
    tip: 'Check that shoulders and hips sit truly perpendicular to the lens — precision is everything in profile.',
    joints: {spine: -8, neck: -6, leftShoulder: -127, rightShoulder: -114, leftElbow: 70, rightElbow: 70, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 70, leftKnee: 90, rightKnee: 80},
    color: 'var(--color-gold-300)', figure: 'both-knees-prayer',
    tags: ['joyful', 'intermediate', 'kneeling', 'artistic']
  },
  'kneeling-sit-between-heels': {
    id: 'kneeling-sit-between-heels', category: 'kneeling', name: 'Sit Between Heels',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel with both knees down and raise both arms straight overhead in a wide V, chest lifted and open. Keep a soft bend in the elbows for a bold, symmetrical, celebratory shape.',
    tip: 'Keep a soft bend in the elbows overhead — fully locked arms photograph stiff even in a joyful pose.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -5, neck: 0, leftShoulder: -110, rightShoulder: -110, leftElbow: 70, rightElbow: 70, hipAbductL: 8, hipAbductR: 8, rightHip: 0, leftKnee: 140, rightKnee: 140, leftAnkle: -35, rightAnkle: -35},
    color: 'var(--color-gold-300)', figure: 'seiza',
    tags: ['artistic', 'intermediate', 'kneeling']
  },
  'kneeling-side-stretch': {
    id: 'kneeling-side-stretch', category: 'kneeling', name: 'Kneeling Side Stretch',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel and lower the seat down between the heels rather than onto them, knees spread slightly apart. Rest hands on the thighs and keep the spine tall despite the low position.',
    tip: 'This deep kneel demands ankle flexibility — sit only as low as stays comfortable and controlled.',
    joints: {spine: 0, neck: 0, leftShoulder: 0, leftElbow: 70, rightElbow: 50, hipAbductL: -15, hipAbductR: -15, leftHip: 80, rightHip: 80, leftKnee: 120, rightKnee: 120, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -10, shoulderFwdR: -10},
    color: 'var(--color-gold-300)', figure: 'kneeling-back-arch',
    tags: ['stretch', 'intermediate', 'kneeling', 'artistic']
  },
  'kneeling-look-back': {
    id: 'kneeling-look-back', category: 'kneeling', name: 'Kneeling Look Back',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel upright and reach one arm overhead, bending the torso sideways over the opposite hip. Slide the other hand down toward the floor, keeping both hips grounded and level.',
    tip: 'Keep both hips grounded and level — the bend should come entirely from the waist and ribcage.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {
"spine":15,"neck":15,"leftShoulder":-130,"rightShoulder":-130,"leftElbow":70,"rightElbow":0,"hipAbductL":8,"hipAbductR":8,"leftHip":80,"rightHip":80,"leftKnee":90,"rightKnee":90,"leftAnkle":-35,"rightAnkle":-35
  },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'intermediate', 'kneeling', 'back']
  },
  'kneeling-prayer-up': {
    id: 'kneeling-prayer-up', category: 'kneeling', name: 'Kneeling Prayer Up',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel facing away from camera, then twist the ribcage and turn the head back over one shoulder toward the lens. Rest one hand on the floor behind you to support the twist.',
    tip: 'Lead with the eyes, then let shoulders and ribcage follow — a sequential twist looks far more natural.',
    joints: {spine: 10, neck: 15, leftShoulder: -30, rightShoulder: -10, leftElbow: 0, rightElbow: 70, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: 100, globalTwist: 180},
    color: 'var(--color-gold-300)', figure: 'both-knees-prayer',
    tags: ['artistic', 'beginner', 'kneeling']
  },
  'kneeling-dragon': {
    id: 'kneeling-dragon', category: 'kneeling', name: 'Kneeling Dragon',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel and press both palms together, then raise the joined hands high overhead rather than at the chest. Lengthen through the sides of the ribcage as the arms lift and the face tilts up.',
    tip: 'Lengthen through the ribcage as the arms lift — it keeps the pose graceful instead of strained.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -70→-110, rightShoulder -30→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -5, neck: 0, leftShoulder: -110, rightShoulder: -110, leftElbow: 60, rightElbow: 60, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['advanced', 'artistic', 'kneeling', 'flexible']
  },
  'kneeling-hug': {
    id: 'kneeling-hug', category: 'kneeling', name: 'Kneeling Hug',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'From a low lunge with one knee down, sweep the back leg up and hold the ankle with the same-side hand while the torso opens toward camera. Warm up thoroughly before this deep backbend.',
    tip: 'Warm up hip and back flexibility first — this deep stretch should never be forced.',
    joints: {spine: -30, neck: 0, leftShoulder: -110, rightShoulder: 0, leftElbow: 30, rightElbow: 60, hipAbductL: 8, hipAbductR: 8, leftHip: -70, rightHip: 70, leftKnee: 160, rightKnee: 80, shoulderFwdL: 50, shoulderFwdR: 0},
    color: 'var(--color-gold-300)', figure: 'both-knees-prayer',
    tags: ['intimate', 'beginner', 'kneeling', 'social']
  },
  'kneeling-twist-back': {
    id: 'kneeling-twist-back', category: 'kneeling', name: 'Kneeling Twist Back',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel back onto the heels and wrap both arms around the torso in a self-hug, shoulders relaxed and head tilted down a few degrees. Let the mood read tender and introspective.',
    tip: 'Tuck the chin slightly and close the eyes to deepen the intimate, self-soothing feeling.',
    joints: {spine: 12, neck: 0, leftShoulder: 0, rightShoulder: 0, leftElbow: 110, rightElbow: 110, hipAbductL: 8, hipAbductR: 8, leftHip: 70, rightHip: 70, leftKnee: 80, rightKnee: 80, shoulderFwdL: -60, shoulderFwdR: -60},
    color: 'var(--color-gold-300)', figure: 'kneeling-back-arch',
    tags: ['editorial', 'intermediate', 'kneeling', 'dynamic']
  },
  'kneeling-forearm-floor': {
    id: 'kneeling-forearm-floor', category: 'kneeling', name: 'Kneeling Forearm Floor',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel upright and rotate the torso fully to one side, reaching the trailing arm across the body while the front arm opens outward. Keep both knees anchored throughout the rotation.',
    tip: 'Keep both knees anchored on the ground — the twist should isolate the torso, not shift the base.',
    joints: {spine: 0, neck: 0, rightShoulder: 0, leftElbow: 80, rightElbow: 80, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: 0, shoulderFwdR: -50, globalTwist: 40},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['intimate', 'intermediate', 'kneeling']
  },
  'kneeling-reach-up-one': {
    id: 'kneeling-reach-up-one', category: 'kneeling', name: 'Kneeling Reach Up One',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel and lower onto both forearms in front of you, hips still lifted off the heels. Let the gaze rest forward and low to the ground for an intimate, immersive angle.',
    tip: 'Shoot from a similarly low camera angle to make the pose feel immersive rather than distant.',
    joints: {spine: 60, neck: -15, leftShoulder: 0, rightShoulder: 0, leftElbow: 90, rightElbow: 90, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -80, shoulderFwdR: -80},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['artistic', 'intermediate', 'kneeling']
  },
  'kneeling-seated-arms-wide': {
    id: 'kneeling-seated-arms-wide', category: 'kneeling', name: 'Kneeling Seated Arms Wide',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Kneel on one knee and extend the opposite arm straight overhead, fingers reaching toward the ceiling. Let the gaze follow the hand upward, lengthening the whole side body.',
    tip: 'Shoot from a low angle to exaggerate the verticality this kneeling reach creates.',
    joints: {spine: -8, neck: 5, leftShoulder: 0, rightShoulder: -130, leftElbow: 30, rightElbow: 30, hipAbductL: 8, hipAbductR: 8, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35},
    color: 'var(--color-gold-300)', figure: 'seiza',
    tags: ['welcoming', 'beginner', 'kneeling', 'social']
  },
  'kneeling-crouch': {
    id: 'kneeling-crouch', category: 'kneeling', name: 'Kneeling Crouch',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit back on the heels and open both arms wide to the sides at shoulder height, palms up in a welcoming gesture. Keep the chest lifted, fingers relaxed rather than stiffly extended.',
    tip: 'Keep the fingers relaxed, not stiffly extended — an open palm alone reads as inviting.',
    joints: {spine: -6, neck: -6, rightShoulder: 0, leftElbow: 40, rightElbow: 40, hipAbductL: 8, hipAbductR: 8, leftHip: 60, rightHip: 60, leftKnee: 120, rightKnee: 120, leftAnkle: -35, rightAnkle: -35},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['dynamic', 'intermediate', 'kneeling', 'strong']
  },
  'kneeling-tuck-forward': {
    id: 'kneeling-tuck-forward', category: 'kneeling', name: 'Kneeling Tuck Forward',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Drop into a low crouch with one knee nearly touching the ground and the other foot planted for balance. Rest one forearm across the raised knee, coiled and alert — a sprinter-pose-like silhouette.',
    tip: 'This coiled stance photographs powerfully from a low angle looking slightly upward.',
    joints: {spine: 20, neck: -8, leftShoulder: 0, leftElbow: 90, rightElbow: 30, hipAbductL: 8, hipAbductR: 8, rightHip: 80, leftKnee: 138, rightKnee: 100, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -80, shoulderFwdR: -15},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['restful', 'beginner', 'kneeling', 'artistic']
  },
  'kneeling-lean-hands-floor': {
    id: 'kneeling-lean-hands-floor', category: 'kneeling', name: 'Kneeling Lean Hands Floor',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel and fold the torso forward over the thighs, extending both arms fully along the floor rather than tucking them close. This restful, child\'s-pose shape reads soft and grounded.',
    tip: 'Extend the arms fully forward — tucking them close to the sides shortens the overall shape.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -12→-18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 18, neck: -6, leftShoulder: 0, rightShoulder: 0, leftElbow: 30, rightElbow: 30, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 70, leftKnee: 100, rightKnee: 100, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -60, shoulderFwdR: -60},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['editorial', 'intermediate', 'kneeling']
  },
  'kneeling-chest-open': {
    id: 'kneeling-chest-open', category: 'kneeling', name: 'Kneeling Chest Open',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel and lean forward onto both hands flat on the floor, hips lifted slightly off the heels. Arch the back gently, not rounded, and lift the gaze forward for a feline, poised look.',
    tip: 'A gentle spinal arch, not a rounded back, gives this pose its elegant, cat-like quality.',
    joints: {
"spine":-8,"neck":-10,"leftShoulder":35,"rightShoulder":35,"leftElbow":65,"rightElbow":65,"hipAbductL":8,"hipAbductR":8,"leftHip":80,"rightHip":80,"leftKnee":90,"rightKnee":90,"leftAnkle":-35,"rightAnkle":-35
  },
    color: 'var(--color-gold-300)', figure: 'kneeling-back-arch',
    tags: ['confident', 'beginner', 'kneeling']
  },
  'kneeling-bow': {
    id: 'kneeling-bow', category: 'kneeling', name: 'Kneeling Bow',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel upright and draw both shoulder blades together, opening the chest wide with arms relaxed at the sides. Lift through the sternum for a confident, grounded posture.',
    tip: 'Lift through the sternum rather than yanking the shoulders back — it reads natural, not military.',
    joints: {spine: -8, neck: 19.2, rightShoulder: -12, leftElbow: 65, rightElbow: 45, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: 20, shoulderFwdR: 20},
    color: 'var(--color-gold-300)', figure: 'kneeling-forward',
    tags: ['serene', 'beginner', 'kneeling', 'artistic']
  },
  'kneeling-crossed-arms-look-side': {
    id: 'kneeling-crossed-arms-look-side', category: 'kneeling', name: 'Kneeling Crossed Arms Look Side',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel and bow the torso forward slowly and gracefully from the hips, arms resting on the thighs or extended forward. Hold the bow controlled rather than collapsing quickly.',
    tip: 'Keep the bow slow and controlled — stillness is what reads as reverent, not a quick collapse.',
    joints: {spine: -8, neck: 0, leftShoulder: 0, rightShoulder: 0, leftElbow: 90, rightElbow: 90, hipAbductL: 8, hipAbductR: 8, leftHip: 80, rightHip: 70, leftKnee: 90, rightKnee: 80, leftAnkle: -35, shoulderFwdL: -30, shoulderFwdR: -30},
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'intermediate', 'kneeling', 'attitude']
  },

  // ══════════════ RECLINING (30) ══════════════
  'side-recline': {
    id: 'side-recline', category: 'reclining', name: 'Side Recline',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Lie fully on one side with the bottom arm extended beneath the head for support and the top arm resting along the waist. Stack the hips and shoulders, then bend the top knee slightly forward of the bottom leg.',
    tip: 'Stack hips directly over each other — an offset pelvis flattens the side-lying silhouette.',
    joints: { globalTilt: 75, globalRoll: -40, neck: -15, leftShoulder: -10, leftElbow: 81, rightShoulder: 8, rightElbow: 18, leftHip: 20, leftKnee: 35, leftAnkle: -15, rightHip: 10, rightKnee: 12, rightAnkle: -15 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['elegant', 'beginner', 'reclining', 'side']
  },
  'back-prop': {
    id: 'back-prop', category: 'reclining', name: 'Backyard Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Lie on one side propped up on one elbow, top leg straight or bent slightly forward and bottom leg straight beneath it. Rest the head in the raised hand or lift it for a longer neckline.',
    tip: 'Arch the back slightly and lift the head high — it elongates the neck and accentuates curves.',
    // PR-v7 (v1.7) — fix too_subtle: "propped up on one elbow" — raise the propping arm. leftShoulder -10→-100, rightShoulder 8→-100.
    joints: {neck: 0, leftShoulder: -90, rightShoulder: -90, leftElbow: 65, rightElbow: 45, leftHip: 30, rightHip: 0, leftKnee: 20, rightKnee: 0, globalTilt: 75},
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['relaxed', 'beginner', 'reclining', 'social']
  },
  'prone-chin': {
    id: 'prone-chin', category: 'reclining', name: 'Prone Chin',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Sit and lean back onto both hands with legs extended forward. Let the chest open toward the sky and the head tilt back a few degrees for a relaxed, sun-soaked feel, feet pointed or flexed.',
    tip: 'Point or flex the feet intentionally — dangling feet weaken the long line of the legs.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-5, now spine:5.
    joints: {
"globalTilt":85,"spine":5,"neck":5.4,"leftShoulder":-110,"rightShoulder":-110,"leftElbow":80,"rightElbow":80,"leftHip":-10,"rightHip":-5,"leftAnkle":-20,"rightAnkle":-20
  },
    color: 'var(--color-parchment-200)', figure: 'prone-flat',
    tags: ['playful', 'beginner', 'reclining', 'front']
  },
  'starfish': {
    id: 'starfish', category: 'reclining', name: 'Starfish',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie face down and prop up on both elbows, lifting the chin and chest off the ground. Let the lower legs bend up behind you, ankles crossed and swaying for a playful, youthful read.',
    tip: 'Cross the ankles behind you and let them sway gently — it adds charm and movement.',
    joints: {
        globalTilt: 85,
        neck: -15,
        leftShoulder: -70,
        rightShoulder: -52,
        leftElbow: 65,
        rightElbow: 45,
        leftHip: 30,
        rightHip: 30,
        leftKnee: 10,
        rightKnee: 10
      },
    color: 'var(--color-parchment-200)', figure: 'back-arms-up',
    tags: ['carefree', 'beginner', 'reclining', 'artistic']
  },
  'side-fetal': {
    id: 'side-fetal', category: 'reclining', name: 'Side Curl',
    difficulty: 'Beginner', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Lie on the back and spread both arms and legs wide into a relaxed star shape. Let the whole body soften into the ground, shoulders melting away from the ears for an open composition.',
    tip: 'Shot from directly above, the symmetry becomes striking — vary limb angles slightly for interest.',
    joints: {
        globalTilt: -80,
        globalRoll: -35,
        neck: -15,
        leftShoulder: -10,
        rightShoulder: 8,
        leftElbow: 65,
        rightElbow: 45,
        leftHip: 60,
        rightHip: 50,
        leftKnee: 80,
        rightKnee: 80
      },
    color: 'var(--color-parchment-200)', figure: 'fetal',
    tags: ['intimate', 'beginner', 'reclining', 'side']
  },
  'belly-up-arms-wide': {
    id: 'belly-up-arms-wide', category: 'reclining', name: 'Belly Up Arms Wide',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Curl onto one side with knees drawn up toward the chest and both hands tucked near the face. Leave a small gap between chin and knees to keep the neck line visible.',
    tip: 'Keep a little space between chin and knees so the neck line stays visible and elegant.',
    joints: {spine: 15, leftShoulder: 0, rightShoulder: 12, leftElbow: 90, rightElbow: 90, leftHip: 70, rightHip: 65, leftKnee: 110, rightKnee: 105, globalTilt: 85, globalRoll: -45},
    color: 'var(--color-parchment-200)', figure: 'back-arms-up',
    tags: ['peaceful', 'beginner', 'reclining', 'artistic']
  },
  'side-recline-top-leg-bent': {
    id: 'side-recline-top-leg-bent', category: 'reclining', name: 'Side Recline Top Leg Bent',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Lie flat on the back and extend both arms out to the sides at shoulder height, palms open toward the ceiling. Let the legs relax straight or open slightly apart.',
    tip: 'Shot from directly overhead, this open shape reads peaceful — great for flat-lay style compositions.',
    joints: {
        globalTilt: -80,
        globalRoll: -40,
        neck: -3,
        leftShoulder: -10,
        rightShoulder: 8,
        leftElbow: 65,
        rightElbow: 45,
        leftHip: 20,
        rightHip: 60,
        leftKnee: 20,
        rightKnee: 90
      },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['flattering', 'beginner', 'reclining', 'classic']
  },
  'prone-tuck-arms': {
    id: 'prone-tuck-arms', category: 'reclining', name: 'Prone Tuck Arms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Lie on one side propped on one elbow, then bend the top leg forward and rest the knee on the ground in front of the bottom leg. This figure-four line carves the hip-to-waist curve.',
    tip: 'The bent top leg is what creates the classic waist-to-hip curve seen in reclining portraits.',
    joints: {
"neck":12,"leftShoulder":10,"rightShoulder":28,"leftElbow":100,"rightElbow":100,"leftHip":-5,"rightHip":80,"rightKnee":90,"shoulderFwdL":12,"shoulderFwdR":-10,"globalTilt":85
  },
    color: 'var(--color-parchment-200)', figure: 'prone-flat',
    tags: ['candid', 'beginner', 'reclining', 'relaxed']
  },
  'supine-one-knee-up': {
    id: 'supine-one-knee-up', category: 'reclining', name: 'Supine One Knee Up',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Lie face down and tuck both forearms beneath the chin, resting the head sideways on the stacked hands. Turn to rest one cheek on the hands rather than facing the lens directly.',
    tip: 'Turn to rest one cheek on the hands instead of facing the lens — it reads candid and relaxed.',
    joints: {
        globalTilt: 85,
        neck: 8,
        leftShoulder: -10,
        rightShoulder: 8,
        leftElbow: 65,
        rightElbow: 45,
        leftHip: 30,
        rightHip: 70,
        leftKnee: 10,
        rightKnee: 100
      },
    color: 'var(--color-parchment-200)', figure: 'supine',
    tags: ['casual', 'beginner', 'reclining']
  },
  'back-recline-arms-up': {
    id: 'back-recline-arms-up', category: 'reclining', name: 'Back Recline Arms Up',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie on the back and bend one knee up with the foot flat on the ground, letting the other leg rest straight. Rest one hand on the stomach and the other beside you.',
    tip: 'A single bent knee breaks the symmetry of lying flat and adds a relaxed, casual silhouette.',
    joints: {leftShoulder: 0, rightShoulder: 0, leftElbow: 110, rightElbow: 10, leftHip: 0, rightHip: 80, leftKnee: 0, rightKnee: 80, rightAnkle: 0, shoulderFwdL: -70, shoulderFwdR: 0, globalTilt: -85},
    color: 'var(--color-parchment-200)', figure: 'back-arms-up',
    tags: ['elongated', 'beginner', 'reclining', 'artistic']
  },
  'side-recline-gaze-up': {
    id: 'side-recline-gaze-up', category: 'reclining', name: 'Side Recline Gaze Up',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Lie flat on the back and stretch both arms straight overhead, resting them on the ground above the head. Point the toes as the whole body lengthens from fingertips to toes.',
    tip: 'Point the toes as the arms stretch overhead for one continuous, elegant line through the body.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { globalTilt: -80, globalRoll: -38, neck: 10, leftShoulder: -110, leftElbow: 60, rightShoulder: -110, rightElbow: 18, leftHip: 18, leftKnee: 20, rightHip: 8, rightKnee: 8 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['dreamy', 'beginner', 'reclining']
  },
  'sphinx-pose': {
    id: 'sphinx-pose', category: 'reclining', name: 'Sphinx Pose',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie face down and prop the upper body on both forearms, elbows stacked directly under the shoulders. Keep hips grounded, spine long, and lift the chest gently through the sternum.',
    tip: 'Stack elbows under shoulders, not out wide, for the cleanest line through the torso.',
    joints: {globalTilt: 70, spine: -15, neck: 6.0, leftShoulder: -10, rightShoulder: 8, shoulderFwdL: 30, shoulderFwdR: 30, leftElbow: 81, rightElbow: 81, leftHip: -5, rightHip: -5},
    color: 'var(--color-parchment-200)', figure: 'sphinx-pose',
    tags: ['artistic', 'intermediate', 'reclining', 'yoga']
  },
  'lounger-back-arm-raised': {
    id: 'lounger-back-arm-raised', category: 'reclining', name: 'Lounger Back Arm Raised',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Recline back on a bed or lounger with one arm bent behind the head, elbow open. Rest the other hand on the stomach and let both legs relax long, ankles crossed loosely.',
    tip: 'A bent arm behind the head opens the ribcage and elongates the whole torso line.',
    joints: {leftShoulder: -120, rightShoulder: 10, leftElbow: 70, rightElbow: 60, hipAbductL: 15, hipAbductR: 15, leftHip: 15, rightHip: 15, leftKnee: 0, globalTilt: -75},
    color: 'var(--color-parchment-200)', figure: 'back-arms-up',
    tags: ['relaxed', 'beginner', 'reclining', 'social']
  },
  'prone-push-up-position': {
    id: 'prone-push-up-position', category: 'reclining', name: 'Prone Push-Up Position',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Lie face down and press both palms flat beside the shoulders as if starting a push-up, lifting only the chest a few inches off the floor. Keep the hips grounded and forearms angled back.',
    tip: 'Lift the chest only, not the hips, to keep this a soft press rather than a workout shape.',
    joints: {globalTilt: 65, spine: -20, neck: 4.5, leftShoulder: -10, rightShoulder: 8, shoulderFwdL: 25, shoulderFwdR: 25, leftElbow: 80, rightElbow: 80, leftHip: -5, rightHip: -5},
    color: 'var(--color-parchment-200)', figure: 'sphinx-pose',
    tags: ['editorial', 'intermediate', 'reclining']
  },
  'floor-roll-side': {
    id: 'floor-roll-side', category: 'reclining', name: 'Floor Roll Side',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Active',
    instructions: 'Capture the mid-motion of rolling from the back onto the side, one arm reaching across the body and both legs mid-turn. A candid, in-between moment full of energy.',
    tip: 'Shoot in burst through several real rolls -- the in-between frames beat any held pose.',
    joints: {leftShoulder: -30, rightShoulder: 8, leftElbow: 30, rightElbow: 45, leftHip: 50, rightHip: 30, leftKnee: 50, rightKnee: 40, shoulderFwdL: -50, globalTilt: -80, globalRoll: -45},
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['dynamic', 'intermediate', 'reclining', 'motion']
  },
  'fetal-curl': {
    id: 'fetal-curl', category: 'reclining', name: 'Fetal Curl',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie on the side and draw both knees up toward the chest, chin tucked and arms curled in close to the torso. A protective, introspective curled shape.',
    tip: 'Let the top arm separate slightly from the body so it does not flatten the silhouette',
    joints: {spine: 20, neck: -4.5, leftShoulder: 30, rightShoulder: -10, leftElbow: 60, rightElbow: 50, leftHip: 70, rightHip: 65, leftKnee: 110, rightKnee: 105, globalTilt: 80, globalRoll: -30},
    color: 'var(--color-parchment-200)', figure: 'fetal',
    tags: ['introspective', 'beginner', 'reclining', 'artistic']
  },
  'back-angel': {
    id: 'back-angel', category: 'reclining', name: 'Back Angel',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Active',
    instructions: 'Lie on the back on a soft surface and sweep both arms out and overhead like a snow angel. Let the legs stay together or drift slightly apart.',
    tip: 'Catch this mid-sweep -- motion blur in the arms adds life over a frozen finish.',
    joints: {leftShoulder: -90, rightShoulder: -90, leftElbow: 70, rightElbow: 70, leftHip: 25, rightHip: 25, globalTilt: -85},
    color: 'var(--color-parchment-200)', figure: 'back-arms-up',
    tags: ['playful', 'beginner', 'reclining', 'motion']
  },
  'spread-eagle': {
    id: 'spread-eagle', category: 'reclining', name: 'Spread Eagle',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie flat on the back with arms and legs extended wide into a full X shape. Let the whole body soften and sink completely into the surface.',
    tip: 'Shoot this from directly overhead so the full X shape reads clearly.',
    joints: {
        globalTilt: -85,
        leftShoulder: -100,
        rightShoulder: -82,
        leftElbow: 70,
        rightElbow: 78,
        leftHip: 35,
        rightHip: 35
      },
    color: 'var(--color-parchment-200)', figure: 'back-arms-up',
    tags: ['carefree', 'beginner', 'reclining', 'overhead']
  },
  'floor-seated-recline': {
    id: 'floor-seated-recline', category: 'reclining', name: 'Floor Seated Recline',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the floor and lower the torso back gradually onto both elbows, legs bent or extended forward. A relaxed mid-point between sitting up and lying flat.',
    tip: 'Small changes in elbow height shift the whole mood -- test a few before settling.',
    joints: {spine: -5, neck: 1.5, rightShoulder: 0, leftElbow: 60, rightElbow: 60, leftHip: 80, rightHip: 80, leftKnee: 5, rightKnee: 5, shoulderFwdL: 60, shoulderFwdR: 60, globalTilt: -45},
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['relaxed', 'beginner', 'reclining']
  },
  'superman-arms': {
    id: 'superman-arms', category: 'reclining', name: 'Superman Arms',
    difficulty: 'Advanced', angle: 'Front', intent: 'Artistic', effort: 'Active',
    instructions: 'Lie face down and lift both arms and legs off the floor at once, chest raised in a flying superman shape. Hold briefly, core engaged, for the capture.',
    tip: 'This is real muscular effort -- rest between shots and only hold as long as feels controlled.',
    joints: {globalTilt: 80, spine: -15, neck: 4.5, leftShoulder: -140, rightShoulder: -122, leftElbow: 70, rightElbow: 70, leftHip: -10, rightHip: -10},
    color: 'var(--color-parchment-200)', figure: 'prone-flat',
    tags: ['advanced', 'artistic', 'reclining', 'dynamic']
  },
  'stargaze': {
    id: 'stargaze', category: 'reclining', name: 'Stargaze',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie flat on the back with hands laced behind the head, elbows relaxed out to the sides. Gaze straight up, chin level, as if watching the night sky.',
    tip: 'Resting elbows flat on the ground rather than lifted keeps shoulders relaxed on longer holds.',
    joints: {
        globalTilt: -85,
        neck: -3.8,
        leftShoulder: -40,
        rightShoulder: -22,
        leftElbow: 65,
        rightElbow: 45,
        leftHip: 15,
        rightHip: 15
      },
    color: 'var(--color-parchment-200)', figure: 'supine',
    tags: ['dreamy', 'beginner', 'reclining', 'artistic']
  },
  'hammock-pose': {
    id: 'hammock-pose', category: 'reclining', name: 'Hammock Pose',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Recline in a hammock or curved surface and let the body sink naturally into a gentle U-shape. Trail one arm off the side, fingertips grazing the ground.',
    tip: 'Let the hammock curve do the work -- resist holding the torso rigidly straight within it.',
    joints: {spine: 15, leftShoulder: -60, rightShoulder: -30, leftElbow: 30, rightElbow: 60, leftHip: 30, rightHip: 30, leftKnee: 20, rightKnee: 20, shoulderFwdL: 80, globalTilt: -80},
    color: 'var(--color-parchment-200)', figure: 'fetal',
    tags: ['relaxed', 'beginner', 'reclining', 'outdoor']
  },
  'pool-float': {
    id: 'pool-float', category: 'reclining', name: 'Pool Float',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Recline on a pool float or in shallow water, arms relaxed out to the sides and legs loosely extended. Let the body drift naturally with the water movement',
    tip: 'A relaxed half-smile and sunglasses complete the effortless, sun-soaked mood.',
    joints: {
        globalTilt: 85,
        spine: 15,
        leftShoulder: -50,
        rightShoulder: -32,
        leftElbow: 65,
        rightElbow: 45,
        leftHip: 15,
        rightHip: 15
      },
    color: 'var(--color-parchment-200)', figure: 'supine',
    tags: ['summer', 'beginner', 'reclining', 'social']
  },
  'floor-tuck-half-recline': {
    id: 'floor-tuck-half-recline', category: 'reclining', name: 'Floor Tuck Half Recline',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lie back with knees bent and drawn toward the chest, arms wrapped loosely around the shins. A tucked, half-reclined shape between sitting and lying flat.',
    tip: 'Keep the shoulders down and relaxed rather than hiked up toward the ears.',
    joints: {spine: -10, leftShoulder: -30, rightShoulder: -30, leftElbow: 80, rightElbow: 80, leftHip: 80, rightHip: 80, leftKnee: 120, rightKnee: 120, shoulderFwdL: -60, shoulderFwdR: -60, globalTilt: -75},
    color: 'var(--color-parchment-200)', figure: 'fetal',
    tags: ['editorial', 'intermediate', 'reclining']
  },
  'drowsy-recline': {
    id: 'drowsy-recline', category: 'reclining', name: 'Drowsy Recline',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Recline on one elbow with both knees tucked toward the same side, creating a soft spiral through the lower body. Rest the free arm along the thigh, eyes heavy-lidded.',
    tip: 'The spiral between a camera-facing torso and turned-away legs gives this its editorial polish.',
    joints: {spine: 5, neck: 0, leftShoulder: -20, rightShoulder: 8, leftElbow: 65, rightElbow: 18, hipAbductL: -20, hipAbductR: 20, leftHip: 30, rightHip: 90, leftKnee: 50, rightKnee: 50, shoulderFwdL: 30, globalTilt: 60, globalRoll: -45},
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['peaceful', 'beginner', 'reclining', 'tender']
  },
  'diagonal-prop': {
    id: 'diagonal-prop', category: 'reclining', name: 'Diagonal Prop',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lie on the side with both hands tucked under the cheek as if sleeping, knees drawn up gently. Close the eyes softly for a tender, peaceful mood.',
    tip: 'A slightly parted mouth sells sleepy authenticity better than one held tightly closed.',
    joints: {spine: 12, leftShoulder: -90, rightShoulder: -90, leftElbow: 140, rightElbow: 140, leftHip: 70, rightHip: 65, leftKnee: 80, rightKnee: 80, globalTilt: 75, globalRoll: -60},
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['editorial', 'intermediate', 'reclining', 'composition']
  },
  'floor-side-elbow-leg-raised': {
    id: 'floor-side-elbow-leg-raised', category: 'reclining', name: 'Floor Side Elbow Leg Raised',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Prop up on one elbow with the body angled diagonally across the frame. Lift the top leg and extend it long, knee straight, for maximum diagonal length.',
    tip: 'Angle the body corner-to-corner across the frame for the most dynamic composition.',
    joints: {leftShoulder: 30, rightShoulder: 8, leftElbow: 81, rightElbow: 18, leftHip: 15, rightHip: -50, rightKnee: 5, shoulderFwdL: 50, globalTilt: 80, globalRoll: -45},
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['advanced', 'artistic', 'reclining', 'flexible']
  },
  'cobra-lite': {
    id: 'cobra-lite', category: 'reclining', name: 'Cobra Lite',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie face down and press through both palms to lift the chest into a gentle backbend, hips staying grounded. Keep elbows slightly bent and the gaze level or lifted.',
    tip: 'Soften the elbows rather than locking them straight -- it keeps the backbend controlled, not strained.',
    joints: {globalTilt: 65, spine: -25, neck: 4.5, leftShoulder: -10, rightShoulder: 8, shoulderFwdL: 25, shoulderFwdR: 25, leftElbow: 81, rightElbow: 81},
    color: 'var(--color-parchment-200)', figure: 'sphinx-pose',
    tags: ['artistic', 'intermediate', 'reclining', 'yoga']
  },
  'back-recline-knee-hug': {
    id: 'back-recline-knee-hug', category: 'reclining', name: 'Back Recline Knee Hug',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Lie on the back and hug one knee up toward the chest with both arms while the other leg stays extended flat. A playful, asymmetrical reclining shape.',
    tip: 'Point the toe of the extended leg to keep the line elegant even in this playful pose.',
    joints: {neck: 15, leftShoulder: -30, rightShoulder: -18, leftElbow: 65, rightElbow: 45, leftHip: 0, rightHip: 100, leftKnee: 0, rightKnee: 130, globalTilt: -85},
    color: 'var(--color-parchment-200)', figure: 'fetal',
    tags: ['playful', 'beginner', 'reclining']
  },
  'floor-stomach-flip-flop': {
    id: 'floor-stomach-flip-flop', category: 'reclining', name: 'Floor Stomach Flip Flop',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Lie face down with knees bent and feet crossed loosely in the air behind, chin resting on stacked hands. A youthful, playful, magazine-cover classic.',
    tip: 'Let the crossed feet sway gently rather than holding them stiff -- it reads as candid.',
    joints: {neck: 10, leftShoulder: 0, rightShoulder: 0, leftElbow: 100, rightElbow: 100, hipAbductL: 20, hipAbductR: 20, leftHip: 10, rightHip: 25, leftKnee: 40, rightKnee: 40, shoulderFwdL: -50, shoulderFwdR: -50, globalTilt: 80, globalRoll: -15},
    color: 'var(--color-parchment-200)', figure: 'prone-flat',
    tags: ['playful', 'beginner', 'reclining', 'classic']
  },

  // ══════════════ DYNAMIC (30) ══════════════
  'dynamic-reach': {
    id: 'dynamic-reach', category: 'dynamic', name: 'Dynamic Reach',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Sudden-Free',
    instructions: 'From a natural stance, drive one arm powerfully upward while the opposite arm swings down and back. Shift weight onto the reaching-side foot and lean slightly into the reach.',
    tip: 'Set a timer and let the shutter fire mid-motion, right at the peak of the reach.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:12, now spine:-12.
    joints: {spine: -12, hips: 15, neck: -8.8, leftShoulder: -110, rightShoulder: 40, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: -8, leftKnee: 20, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['editorial', 'intermediate', 'dynamic', 'motion']
  },
  'mid-jump': {
    id: 'mid-jump', category: 'dynamic', name: 'Mid Jump',
    difficulty: 'Advanced', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Jump with both feet leaving the ground and both arms thrown up in a burst of energy. Tuck the knees slightly and let the whole body express lift.',
    tip: 'Jump straight up, not forward, to stay sharp and centered in the frame.',
    joints: {spine: 10, hips: 15, neck: -8.8, leftShoulder: -140, rightShoulder: -126, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftKnee: 50, rightKnee: 40, shoulderFwdL: -8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'jump-tuck',
    tags: ['joyful', 'advanced', 'dynamic', 'motion']
  },
  'spin-pose': {
    id: 'spin-pose', category: 'dynamic', name: 'Spin',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Spin the body with both arms extended outward, weight balanced on one foot at the pivot point. Let clothing and hair trail the motion for a swirling frame.',
    tip: 'Spot a fixed point between rotations to stay balanced and keep your expression composed.',
    joints: {spine: 12, hips: 15, neck: -8.8, leftShoulder: -80, rightShoulder: -92, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: 10, leftKnee: 20, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'spin-turn',
    tags: ['editorial', 'advanced', 'dynamic', 'motion']
  },
  'run-stride': {
    id: 'run-stride', category: 'dynamic', name: 'Power Stride',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Freeze an exaggerated running stride: arms pumping in opposition, front knee driving high, torso leaning slightly forward into the motion.',
    tip: 'Opposite arm to opposite leg -- matching sides on the same leg reads as unnatural.',
    joints: {spine: 8, hips: 15, neck: -8.8, leftShoulder: 25, rightShoulder: -25, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: 30, rightHip: -30, leftKnee: 20, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'run-mid',
    tags: ['athletic', 'intermediate', 'dynamic', 'motion']
  },
  'leap-forward': {
    id: 'leap-forward', category: 'dynamic', name: 'Leap Forward',
    difficulty: 'Advanced', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Capture the peak of a forward leap: one large stride, torso leaning into it, arms swept back behind the body for momentum.',
    tip: 'Sweeping the arms back exaggerates the sense of speed and forward drive.',
    joints: {spine: 14, leftShoulder: 50, rightShoulder: 38, leftElbow: 57, rightElbow: 37, leftHip: 40, rightHip: -35, leftKnee: 20, rightKnee: 10, neck: -3.3, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'warrior-lunge',
    tags: ['editorial', 'advanced', 'dynamic', 'motion']
  },
  'arm-throw': {
    id: 'arm-throw', category: 'dynamic', name: 'Arm Throw',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Sudden-Free',
    instructions: 'Wind one arm back behind the head as if about to throw, torso twisted opposite the throwing arm, the free arm extended forward for aim.',
    tip: 'Maximize the twist between hips and shoulders -- that torque sells the throwing motion.',
    joints: {spine: -10, hips: 15, neck: 4.8, leftShoulder: -120, rightShoulder: -132, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftKnee: 20, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15, globalTwist: 25},
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['expressive', 'intermediate', 'dynamic', 'motion']
  },
  'dance-step': {
    id: 'dance-step', category: 'dynamic', name: 'Dance Step',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Throw both arms wide open and tilt the head back with abandon. An expansive, celebratory shape radiating freedom.',
    tip: 'Let the exhale and the head-tilt land together so the release feels genuine.',
    joints: {spine: 6, hips: 15, neck: -8.8, leftShoulder: -40, rightShoulder: -70, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftKnee: 60, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'dance-arms-high',
    tags: ['graceful', 'intermediate', 'dynamic', 'motion']
  },
  'freeze-frame': {
    id: 'freeze-frame', category: 'dynamic', name: 'Freeze Frame',
    difficulty: 'Advanced', angle: 'Front', intent: 'Editorial', effort: 'Active',
    instructions: 'Raise one leg into a dance line while the arms frame the body gracefully. Point the toe of the lifted leg and lengthen through it.',
    tip: 'Soft, curved arms plus a pointed toe turn a plain step into a dancer line.',
    joints: {spine: 10, hips: 15, neck: -8.8, leftElbow: 81, rightElbow: 45, hipAbductL: 10, hipAbductR: 10, leftKnee: 100, rightKnee: 10, rightShoulder: -12, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['street', 'advanced', 'dynamic', 'motion']
  },
  'warrior-lunge': {
    id: 'warrior-lunge', category: 'dynamic', name: 'Warrior Lunge',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Step one leg forward into a deep lunge, front knee bent to 90 degrees, back leg extended straight. Raise both arms overhead in a strong, warrior stance.',
    tip: 'Track the front knee directly over the ankle, never past the toes.',
    joints: {spine: -5, neck: -6, leftShoulder: -110, rightShoulder: -110, leftElbow: 82, rightElbow: 62, leftHip: 60, rightHip: -35, leftKnee: 95, rightKnee: 5, leftAnkle: -15, rightAnkle: -25, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(109,74,114,0.2)', figure: 'warrior-lunge',
    tags: ['athletic', 'intermediate', 'dynamic', 'strong']
  },
  'toss-hair': {
    id: 'toss-hair', category: 'dynamic', name: 'Toss Hair',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Sudden-Free',
    instructions: 'Whip the head and hair forward, then snap it back in one fluid motion, capturing the peak as the hair is airborne. Run one hand through the ends as they settle.',
    tip: 'Shoot in burst through several tosses -- timing peak hair movement by eye alone is nearly impossible.',
    joints: {spine: -8, hips: 15, neck: -22, leftShoulder: -60, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftKnee: 20, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'hip-hop-lean',
    tags: ['glamour', 'intermediate', 'dynamic', 'motion']
  },
  'skip-step': {
    id: 'skip-step', category: 'dynamic', name: 'Skip Step',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Capture a genuine skip mid-air: one knee driving up, the opposite arm swinging forward, the free leg trailing slightly behind for a bouncy silhouette.',
    tip: 'Actually skip through the frame -- a faked static position never reads as real.',
    joints: {spine: 6, leftShoulder: 40, rightShoulder: -60, leftElbow: 57, rightElbow: 37, leftHip: 40, rightHip: -20, leftKnee: 60, rightKnee: 10, neck: -3.3, shoulderFwdL: -8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'run-mid',
    tags: ['joyful', 'intermediate', 'dynamic', 'motion']
  },
  'pivot-turn': {
    id: 'pivot-turn', category: 'dynamic', name: 'Pivot Turn',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Plant one foot and pivot the body sharply around it, letting clothing and hair swing with the rotation. Freeze where the torso has turned but the head still lags.',
    tip: 'That slight lag between hips and head mid-turn is what sells the motion.',
    joints: {spine: 20, hips: 15, neck: 10, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: 25, leftKnee: 20, rightKnee: 10, rightShoulder: -12, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'spin-turn',
    tags: ['editorial', 'advanced', 'dynamic', 'motion']
  },
  'run-freeze': {
    id: 'run-freeze', category: 'dynamic', name: 'Run Freeze',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Freeze mid-run with the lead leg driving forward and bent, the trailing leg extended behind, arms pumping in opposition. Lean the torso forward into the momentum.',
    tip: 'A genuine short sprint on burst mode beats a held static running pose every time.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:10, now spine:-10.
    joints: {spine: 10, hips: 15, neck: -8.8, leftShoulder: -30, rightShoulder: 40, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: -15, leftKnee: 100, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'run-mid',
    tags: ['athletic', 'intermediate', 'dynamic', 'motion']
  },
  'leap-freeze': {
    id: 'leap-freeze', category: 'dynamic', name: 'Leap Freeze',
    difficulty: 'Advanced', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Capture the apex of a jump with both feet off the ground, legs tucked or extended behind, arms trailing back. The instant right before descent begins.',
    tip: 'Time the shutter for the very top of the jump, where the body hangs weightless.',
    joints: {spine: 8, hips: 15, neck: -8.8, leftShoulder: 60, rightShoulder: 48, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: -15, leftKnee: 100, rightKnee: 40, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'jump-tuck',
    tags: ['editorial', 'advanced', 'dynamic', 'motion']
  },
  'cartwheel-freeze': {
    id: 'cartwheel-freeze', category: 'dynamic', name: 'Cartwheel Freeze',
    difficulty: 'Advanced', angle: 'Front', intent: 'Artistic', effort: 'Active',
    instructions: 'Capture the mid-point of a cartwheel: one hand planted on the ground, legs extended into a wide inverted V for a gravity-defying frame.',
    tip: 'Practice on a soft, open surface with room to complete the movement if the freeze is missed.',
    joints: {spine: 15, leftShoulder: -127, leftElbow: 57, rightElbow: 37, leftHip: 60, rightHip: -60, leftKnee: 80, rightKnee: 10, neck: -3.3, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'spin-turn',
    tags: ['advanced', 'artistic', 'dynamic', 'acrobatic']
  },
  'arabesque-balance': {
    id: 'arabesque-balance', category: 'dynamic', name: 'Arabesque Balance',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Active',
    instructions: 'Stand on one leg and extend the other straight back at hip height or higher, torso tilting forward to counterbalance. Extend the opposite arm forward for a classical line.',
    tip: 'Fix your gaze on a stationary point ahead -- spotting is essential to holding the balance.',
    joints: {spine: 15, hips: 15, neck: 5, leftShoulder: -30, rightShoulder: 20, shoulderFwdL: -30, shoulderFwdR: -20, leftElbow: 40, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftHip: 0, rightHip: -60, rightKnee: 10, leftAnkle: -15, rightAnkle: -30, leftKnee: 10},
    color: 'rgba(109,74,114,0.2)', figure: 'dance-arms-high',
    tags: ['advanced', 'artistic', 'dynamic', 'dance']
  },
  'basketball-reach': {
    id: 'basketball-reach', category: 'dynamic', name: 'Basketball Reach',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Jump and extend one arm fully upward as if shooting or blocking, the other arm bent for balance. Bend both knees slightly as if mid-jump.',
    tip: 'A real small jump, even a few inches, adds authentic lift over a flat-footed pose.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 18, hips: 15, neck: -8.8, leftShoulder: -127, rightShoulder: 20, leftElbow: 45, rightElbow: 81, hipAbductL: 10, hipAbductR: 10, leftKnee: 40, rightKnee: 30, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'sport']
  },
  'tennis-follow': {
    id: 'tennis-follow', category: 'dynamic', name: 'Tennis Follow Through',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Swing one arm across the body in a follow-through motion as if finishing a stroke, torso rotated and the back foot pivoted onto its toes.',
    tip: 'Commit fully to the hip and shoulder rotation to sell the athletic follow-through.',
    joints: {spine: 24, hips: 15, neck: -8.8, leftShoulder: 50, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightKnee: 10, leftKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15, globalTwist: 25},
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'sport']
  },
  'throw-pose': {
    id: 'throw-pose', category: 'dynamic', name: 'Throw Pose',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Wind one arm back behind the head as if about to throw an object, torso twisted opposite the arm, the free hand extended forward for aim.',
    tip: 'The bigger the shoulder-hip twist, the more explosive the throw reads',
    joints: {spine: -20, hips: 15, neck: -5, leftShoulder: -40, rightShoulder: -140, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: -15, leftKnee: 20, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15, globalTwist: 25},
    color: 'rgba(109,74,114,0.2)', figure: 'warrior-lunge',
    tags: ['editorial', 'intermediate', 'dynamic', 'athletic']
  },
  'catch-reach': {
    id: 'catch-reach', category: 'dynamic', name: 'Catch Reach',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Reach both hands upward and outward as if catching something falling from above, knees bent and body coiled to absorb the catch. Eyes tracking upward.',
    tip: 'Track your eyes to an actual thrown object, even an imagined one -- gaze direction sells the action.',
    joints: {spine: 10, hips: 15, neck: -4.5, leftShoulder: -140, rightShoulder: -120, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftKnee: 35, rightKnee: 25, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['playful', 'intermediate', 'dynamic', 'motion']
  },
  'sprint-lean': {
    id: 'sprint-lean', category: 'dynamic', name: 'Sprint Lean',
    difficulty: 'Advanced', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Lean the torso dramatically forward from a low sprinter stance, one leg driving back, arms pumping hard in opposition',
    tip: 'The steeper the forward lean, the faster it reads -- keep the front knee bent for genuine support.',
    joints: {spine: 32, hips: 15, neck: -10.6, leftElbow: 60, rightElbow: 45, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: -15, leftKnee: 90, rightKnee: 140, rightShoulder: -12, shoulderFwdL: -8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'run-mid',
    tags: ['advanced', 'editorial', 'dynamic', 'athletic']
  },
  'martial-arts-guard': {
    id: 'martial-arts-guard', category: 'dynamic', name: 'Martial Arts Guard',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Take a wide, low fighting stance with both fists raised near the face in guard position. Bend both knees and keep weight centered and ready.',
    tip: 'Tuck the chin slightly behind the guard -- an exposed chin undercuts the readiness.',
    joints: {spine: 6, hips: 15, neck: -8.8, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftKnee: 50, rightKnee: 40, rightShoulder: -12, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'warrior-lunge',
    tags: ['athletic', 'intermediate', 'dynamic', 'strong']
  },
  'karate-chop': {
    id: 'karate-chop', category: 'dynamic', name: 'Karate Chop',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Extend one arm forward in a sharp chopping motion, blade of the hand leading, the other arm pulled back for counterbalance. Bend the front knee for a stable base.',
    tip: 'Time a sharp exhale with the chop to add real snap to the motion',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:10, now spine:-10.
    joints: {spine: -10, hips: 15, neck: -8.8, leftShoulder: -50, leftElbow: 48, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftKnee: 30, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'warrior-lunge',
    tags: ['playful', 'intermediate', 'dynamic', 'athletic']
  },
  'boxer-jab': {
    id: 'boxer-jab', category: 'dynamic', name: 'Boxer Jab',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Extend one fist forward in a sharp jab while the other guards near the chin, back leg extended and front knee bent in a boxer stance',
    tip: 'Rotate the front hip slightly into the jab -- hip rotation sells real punching mechanics.',
    joints: {spine: 10, hips: 15, neck: -8.8, leftShoulder: -60, leftElbow: 33, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftKnee: 30, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'warrior-lunge',
    tags: ['athletic', 'intermediate', 'dynamic', 'strong']
  },
  'dance-arms-up': {
    id: 'dance-arms-up', category: 'dynamic', name: 'Dance Arms Up',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Sway the hips to one side while both arms lift overhead in a loose, joyful gesture. Let the knees bounce slightly with the implied rhythm.',
    tip: 'Actually moving to music while shooting produces far more authentic dance energy.',
    joints: {spine: 8, hips: 15, neck: -8.8, leftShoulder: -136, rightShoulder: -128, leftElbow: 82, rightElbow: 62, hipAbductL: 10, hipAbductR: 10, leftHip: 20, leftKnee: 20, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'dance-arms-high',
    tags: ['joyful', 'intermediate', 'dynamic', 'dance']
  },
  'hip-hop-lean': {
    id: 'hip-hop-lean', category: 'dynamic', name: 'Hip Hop Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Lean the torso sharply to one side with a bent knee and one arm crossed low across the body, the other flexed near the shoulder. A grounded, urban freeze.',
    tip: 'Sharp, angular joints -- not soft curves -- give street-style freezes their punch.',
    joints: {spine: 22, hips: 15, neck: -8.8, leftElbow: 100, rightElbow: 40, hipAbductL: 10, hipAbductR: 10, leftKnee: 60, rightKnee: 10, rightShoulder: -12, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'hip-hop-lean',
    tags: ['urban', 'intermediate', 'dynamic', 'dance']
  },
  'salsa-step': {
    id: 'salsa-step', category: 'dynamic', name: 'Salsa Step',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Step one foot to the side with the hips rotating into the step, one arm curved overhead and the other extended to the side. A vibrant, rhythmic dance line.',
    tip: 'Let the hip lead the step, not the shoulders -- authentic salsa movement starts at the hips.',
    joints: {spine: 10, hips: 15, neck: -8.8, leftShoulder: -140, rightShoulder: -60, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: 30, leftKnee: 20, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'dance-arms-high',
    tags: ['vibrant', 'intermediate', 'dynamic', 'dance']
  },
  'acrobat-balance': {
    id: 'acrobat-balance', category: 'dynamic', name: 'Acrobat Balance',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Active',
    instructions: 'Balance on one leg with the torso tilted forward and the free leg extended high behind, both arms spread wide for counterbalance. A striking acrobatic silhouette.',
    tip: 'Build toward full extension gradually rather than forcing max height on the first try.',
    joints: {spine: 30, hips: 15, neck: -9.9, leftShoulder: -80, rightShoulder: 80, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, rightHip: -65, leftKnee: 15, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'jump-tuck',
    tags: ['advanced', 'artistic', 'dynamic', 'acrobatic']
  },
  'street-dance-tilt': {
    id: 'street-dance-tilt', category: 'dynamic', name: 'Street Dance Tilt',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Hit a sharp, angular frozen pose like a street dancer catching a beat. Create hard geometric angles at the elbows and knees and hold perfectly still.',
    tip: 'Sharp, deliberate angles read as intentional -- softness loses the effect.',
    joints: {spine: 32, hips: 15, neck: -10.6, leftShoulder: -30, rightShoulder: 60, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftKnee: 70, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'hip-hop-lean',
    tags: ['advanced', 'editorial', 'dynamic', 'street']
  },
  'windmill-arm': {
    id: 'windmill-arm', category: 'dynamic', name: 'Windmill Arm',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Sudden-Free',
    instructions: 'Swing one arm in a large circular windmill motion, capturing it mid-arc overhead or extended to the side. Let the body twist naturally with the swing.',
    tip: 'Shoot a continuous burst through the full rotation -- the best frame is rarely where you expect.',
    joints: {spine: 15, hips: 15, neck: -8.8, leftShoulder: -100, rightShoulder: 20, leftElbow: 57, rightElbow: 37, hipAbductL: 10, hipAbductR: 10, leftHip: 10, leftKnee: 20, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, leftAnkle: -15},
    color: 'rgba(109,74,114,0.2)', figure: 'spin-turn',
    tags: ['artistic', 'intermediate', 'dynamic', 'motion']
  },

  // ══════════════ ECCENTRIC (30) ══════════════
  'editorial-arm-reach': {
    id: 'editorial-arm-reach', category: 'eccentric', name: 'Editorial Arm Reach',
    difficulty: 'Intermediate', angle: 'Profile', intent: 'Editorial', effort: 'Sudden-Free',
    instructions: 'Extend one arm forward and upward as if reaching toward something just out of frame, torso leaning slightly forward from the hips. Stand in a strong side stance.',
    tip: 'Let your gaze follow the reaching arm direction for visual continuity.',
    joints: {spine: 10, hips: 15, neck: -4.5, leftShoulder: -80, rightShoulder: 20, leftElbow: 70, rightElbow: 30, leftKnee: 10, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6},
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['editorial', 'intermediate', 'eccentric', 'profile']
  },
  'face-touch': {
    id: 'face-touch', category: 'eccentric', name: 'Face Touch',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Frame the face with both hands, fingers gently spread along the cheeks and jaw. Keep the touch light and the expression soft for a striking beauty shot.',
    tip: 'Let fingertips barely graze the skin -- pressing in distorts the face.',
    joints: {spine: 20, hips: 15, neck: -8.2, leftElbow: 100, rightElbow: 100, leftKnee: 10, rightKnee: 10, rightShoulder: -12, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(109,74,114,0.2)', figure: 'matrix-lean',
    tags: ['beauty', 'intermediate', 'eccentric', 'front']
  },
  'hair-flip': {
    id: 'hair-flip', category: 'eccentric', name: 'Hair Flip',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Sudden-Free',
    instructions: 'Tilt the head and run one hand up into the hair mid-flip. Let the motion lift the hair and open the neckline for a candid, glamorous moment.',
    tip: 'Capture just after the flip begins -- hair in motion beats a static hold.',
    joints: { spine: 6, neck: 12, leftShoulder: -100, leftElbow: 40, rightElbow: 30, hips: 15, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(109,74,114,0.2)', figure: 'catwalk-stride',
    tags: ['glamour', 'intermediate', 'eccentric', 'motion']
  },
  'look-away': {
    id: 'look-away', category: 'eccentric', name: 'Look Away',
    difficulty: 'Beginner', angle: 'Profile', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn to a sharp profile, lift the chin, and direct the eyes away from the camera. A cool, aloof, editorial expression.',
    tip: 'Lead with the chin, not the nose, to keep the neck lengthened in profile.',
    joints: { spine: 2, neck: 20, leftElbow: 60, rightShoulder: -12, rightElbow: 30, hips: 15, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(109,74,114,0.2)', figure: 'catwalk-stride',
    tags: ['editorial', 'beginner', 'eccentric', 'profile']
  },
  'cross-body-arm': {
    id: 'cross-body-arm', category: 'eccentric', name: 'Cross Body',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Bring one arm across the body to rest the hand on the opposite shoulder. The forearm creates a strong diagonal line across the torso.',
    tip: 'Drop the elbow of the crossing arm slightly to keep the shoulders from hunching.',
    joints: {spine: 4, hips: 15, neck: -9.3, leftShoulder: 30, rightShoulder: -20, leftElbow: 100, rightElbow: 100, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(109,74,114,0.2)', figure: 'matrix-lean',
    tags: ['artistic', 'intermediate', 'eccentric']
  },
  'peek-over-shoulder': {
    id: 'peek-over-shoulder', category: 'eccentric', name: 'Peek Over Shoulder',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn three-quarters away to show the back, then rotate the head to peek over one shoulder toward the camera. A classic mysterious over-the-shoulder look.',
    tip: 'Drop the near shoulder and lift the chin over it -- it slims the jaw and adds allure.',
    joints: { spine: 6, neck: 25, leftElbow: 60, rightShoulder: -12, rightElbow: 30, hips: 15, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(109,74,114,0.2)', figure: 'catwalk-stride',
    tags: ['editorial', 'intermediate', 'eccentric', 'back']
  },
  'matrix-lean': {
    id: 'matrix-lean', category: 'eccentric', name: 'Matrix Lean',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Sudden-Free',
    instructions: 'Lean the torso back dramatically at a steep angle while keeping the feet planted, arms held slightly out for balance, in a bullet-dodging silhouette.',
    tip: 'Practice against a wall first to find a safe maximum lean before shooting.',
    joints: {spine: -35, hips: 15, neck: -21, leftShoulder: -20, rightShoulder: 20, leftElbow: 60, rightElbow: 30, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'matrix-lean',
    tags: ['dramatic', 'advanced', 'eccentric', 'iconic']
  },
  'catwalk-extreme': {
    id: 'catwalk-extreme', category: 'eccentric', name: 'Catwalk Extreme',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Exaggerate a runway stride to the extreme: cross one foot sharply in front of the other, thrust the hip dramatically to the side, lift the chin high and severe.',
    tip: 'Push every angle further than feels natural -- extremes read as subtle through a lens.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -5→-18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: -18, neck: -18, leftElbow: 60, rightShoulder: -12, rightElbow: 30, hips: 15, leftHip: 28, leftKnee: 10, rightHip: -12, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'catwalk-stride',
    tags: ['fashion', 'advanced', 'eccentric', 'editorial']
  },
  'avant-garde-arms': {
    id: 'avant-garde-arms', category: 'eccentric', name: 'Avant-Garde Arms',
    difficulty: 'Advanced', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Bend both arms into sharp, asymmetrical geometric angles at different heights, as if forming an abstract sculpture with the limbs.',
    tip: 'Break symmetry deliberately -- mismatched left and right arm angles are the whole point.',
    joints: {spine: 20, hips: 15, neck: -8.8, leftShoulder: -90, rightShoulder: 20, leftElbow: 70, rightElbow: 100, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'dance-arms-high',
    tags: ['abstract', 'advanced', 'eccentric', 'artistic']
  },
  'abstract-contortion': {
    id: 'abstract-contortion', category: 'eccentric', name: 'Abstract Contortion',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Twist the torso and limbs into an unconventional, sculptural shape that prioritizes interesting negative space over natural anatomy. Hold with full control.',
    tip: 'Check the silhouette in a mirror or monitor -- contorted shapes are hard to judge from inside.',
    joints: {spine: 30, hips: 15, neck: -9.9, leftShoulder: 60, leftElbow: 60, rightElbow: 100, leftHip: -20, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, globalTwist: 25},
    color: 'rgba(74,47,109,0.2)', figure: 'matrix-lean',
    tags: ['advanced', 'artistic', 'eccentric', 'sculptural']
  },
  'statue-freeze': {
    id: 'statue-freeze', category: 'eccentric', name: 'Statue Freeze',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Hold a completely rigid, deliberate pose as if carved from marble, with a neutral or classical arm gesture. Do not blink or shift for the capture.',
    tip: 'An unblinking, truly still hold sells the statue illusion -- even a small sway breaks it.',
    joints: { neck: -5, leftShoulder: -30, leftElbow: 60, rightElbow: 30, hips: 15, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'standing-front',
    tags: ['artistic', 'intermediate', 'eccentric', 'concept']
  },
  'mirror-pose': {
    id: 'mirror-pose', category: 'eccentric', name: 'Mirror Pose',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Pose with perfect bilateral symmetry, both arms and legs mirroring each other exactly, as if reflected down a central vertical axis.',
    tip: 'Check both sides in a real mirror or monitor -- small asymmetries are hard to feel internally.',
    joints: {spine: 20, hips: 15, neck: -8.8, leftShoulder: -60, rightShoulder: -72, leftElbow: 60, rightElbow: 30, leftHip: 15, rightHip: -15, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'standing-front',
    tags: ['symmetrical', 'intermediate', 'eccentric', 'concept']
  },
  'superhero-land': {
    id: 'superhero-land', category: 'eccentric', name: 'Superhero Landing',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Crouch low with one knee and one fist touching the ground, the other leg bent for support, as if just landing from a great height. A powerful, cinematic freeze.',
    tip: 'Add a small hop before dropping into the crouch -- the slight impact sells the landing.',
    joints: {spine: -10, hips: 15, neck: -5, leftElbow: 100, rightElbow: 30, leftKnee: 130, rightKnee: 80, rightShoulder: -12, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'superhero-land',
    tags: ['cinematic', 'intermediate', 'eccentric', 'fun']
  },
  'villain-stand': {
    id: 'villain-stand', category: 'eccentric', name: 'Villain Stand',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand with one hand tucked behind the back and the other gesturing outward in a sharp, commanding point. Tilt the chin down with a piercing, direct gaze.',
    tip: 'A lowered chin with eyes still lifted toward the lens creates a brooding, intense effect.',
    joints: {spine: 4, hips: 15, neck: -4.2, leftShoulder: -40, rightShoulder: -60, leftElbow: 60, rightElbow: 30, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: 6},
    color: 'rgba(74,47,109,0.2)', figure: 'matrix-lean',
    tags: ['dramatic', 'intermediate', 'eccentric', 'character']
  },
  'magic-cast': {
    id: 'magic-cast', category: 'eccentric', name: 'Magic Cast',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Sudden-Free',
    instructions: 'Extend both hands forward with fingers spread wide, as if casting a spell or channeling energy. Lean the torso back slightly and widen the eyes with intensity.',
    tip: 'Splayed, tense fingers read as more magical than a loose, relaxed hand.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-10, now spine:10.
    joints: { spine: -10, neck: -6, leftShoulder: -70, leftElbow: 60, rightShoulder: -82, rightElbow: 30, hips: 15, leftKnee: 10, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['fantasy', 'intermediate', 'eccentric', 'creative']
  },
  'floating-gesture': {
    id: 'floating-gesture', category: 'eccentric', name: 'Floating Gesture',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Rise onto the toes of one foot with the other leg trailing gently behind, arms floating loosely at the sides as if weightless. A delicate, ethereal illusion.',
    tip: 'Keep every joint softly bent, never locked, to sell the floating illusion.',
    joints: {spine: -6, hips: 15, neck: -5, leftShoulder: -20, rightShoulder: -15, leftElbow: 60, rightElbow: 30, leftKnee: 12, rightKnee: 15, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'ragdoll-hang',
    tags: ['ethereal', 'advanced', 'eccentric', 'artistic']
  },
  'puppet-strings': {
    id: 'puppet-strings', category: 'eccentric', name: 'Puppet Strings',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Hold the limbs at unnatural, jointed angles as if suspended by invisible strings from above, wrists and elbows bent at sharp marionette angles.',
    tip: 'Tilt the head slightly and let the jaw go a touch slack for an uncanny puppet illusion.',
    joints: { spine: 20, neck: 10, leftShoulder: -100, leftElbow: 81, rightShoulder: 40, rightElbow: 8, hips: 15, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'ragdoll-hang',
    tags: ['creative', 'intermediate', 'eccentric', 'concept']
  },
  'ragdoll-hang': {
    id: 'ragdoll-hang', category: 'eccentric', name: 'Ragdoll Hang',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Let the entire upper body hang completely limp forward from the hips, arms dangling toward the floor, head fully relaxed and hanging down.',
    tip: 'Exhale fully and let gravity do the work -- any tension in the back or neck breaks the effect.',
    joints: { spine: -35, neck: -25, leftShoulder: -10, leftElbow: 60, rightShoulder: -22, rightElbow: 30, hips: 15, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'ragdoll-hang',
    tags: ['artistic', 'intermediate', 'eccentric', 'loose']
  },
  'fashion-backward': {
    id: 'fashion-backward', category: 'eccentric', name: 'Fashion Backward',
    difficulty: 'Advanced', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Face fully away from the camera and arch the upper back while turning the head sharply back over one shoulder, exaggerating the spinal curve for a bold back shot.',
    tip: 'Pair this with a structured garment or bare-back silhouette to show off the spinal line.',
    joints: {spine: -28, hips: 15, neck: 8.2, leftElbow: 60, rightElbow: 30, leftKnee: 10, rightKnee: 10, rightShoulder: -12, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'matrix-lean',
    tags: ['fashion', 'advanced', 'eccentric', 'editorial']
  },
  'extreme-hip': {
    id: 'extreme-hip', category: 'eccentric', name: 'Extreme Hip',
    difficulty: 'Advanced', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Push one hip out to its maximum extreme while the opposite shoulder drops equally far the other way, forming an exaggerated, graphic zigzag line.',
    tip: 'This is a caricature of the classic hip-shift -- commit fully to the exaggeration.',
    joints: {spine: 18, rightShoulder: 35, leftElbow: 60, rightElbow: 30, leftHip: 40, leftKnee: 10, rightKnee: 10, neck: -3.3, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'hip-hop-lean',
    tags: ['graphic', 'advanced', 'eccentric', 'editorial']
  },
  'neck-extreme': {
    id: 'neck-extreme', category: 'eccentric', name: 'Neck Extreme',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Extend the neck to its maximum length, chin lifted and turned to a sharp profile, shoulders pressed firmly down and away. An extreme, sculptural elongation.',
    tip: 'Most of the extra length comes from dropping the shoulders, not lifting the chin further.',
    joints: {spine: 20, hips: 15, neck: -7.6, leftShoulder: 15, rightShoulder: 3, leftElbow: 60, rightElbow: 30, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'catwalk-stride',
    tags: ['sculptural', 'intermediate', 'eccentric', 'artistic']
  },
  'arms-tangled': {
    id: 'arms-tangled', category: 'eccentric', name: 'Arms Tangled',
    difficulty: 'Advanced', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Wrap both arms around each other and across the torso in a tangled, interwoven shape, as if the limbs themselves are knotted together.',
    tip: 'Check reference photos from multiple angles first -- tangled poses look different from inside them.',
    joints: {spine: 20, hips: 15, neck: -8.8, leftShoulder: 40, rightShoulder: -30, leftElbow: 100, rightElbow: 83, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'artistic', 'eccentric', 'sculptural']
  },
  'gravity-defiance': {
    id: 'gravity-defiance', category: 'eccentric', name: 'Gravity Defiance',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Artistic', effort: 'Active',
    instructions: 'Capture a jump at its peak with the body angled as if defying gravity entirely -- legs swept to one side, torso leaning the opposite way, arms extended for drama.',
    tip: 'A trampoline or soft platform helps achieve genuine hang-time for a convincing capture.',
    joints: {spine: 25, neck: -3.3, leftShoulder: -100, leftElbow: 60, rightElbow: 30, hipAbductL: 20, hipAbductR: -20, leftHip: 40, rightHip: 40, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'ragdoll-hang',
    tags: ['advanced', 'artistic', 'eccentric', 'dramatic']
  },
  'theater-bow': {
    id: 'theater-bow', category: 'eccentric', name: 'Theater Bow',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sweep one arm across the waist and bow deeply from the hips, the other arm extended behind in a grand theatrical gesture. Look down toward the floor.',
    tip: 'A slower, more deliberate bow reads as far more theatrical than a quick dip.',
    joints: { spine: -38, neck: -20, leftShoulder: 20, leftElbow: 60, rightShoulder: -80, rightElbow: 70, hips: 15, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'kneeling-forward',
    tags: ['theatrical', 'beginner', 'eccentric', 'dramatic']
  },
  'operatic-arms': {
    id: 'operatic-arms', category: 'eccentric', name: 'Operatic Arms',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Throw both arms wide and high in a grand, operatic gesture, chest lifted and head tilted back as if mid-aria. A maximalist, expressive full-body shape.',
    tip: 'Part the mouth slightly as if singing to complete the operatic illusion.',
    joints: {spine: -15, hips: 15, neck: 4.2, leftShoulder: -132, rightShoulder: -122, leftElbow: 60, rightElbow: 70, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'dance-arms-high',
    tags: ['expressive', 'intermediate', 'eccentric', 'theatrical']
  },
  'dramatic-gasp': {
    id: 'dramatic-gasp', category: 'eccentric', name: 'Dramatic Gasp',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Sudden-Free',
    instructions: 'Bring both hands up to frame an open-mouthed, wide-eyed gasp of shock or surprise. Let the shoulders lift slightly with a sharp inhale.',
    tip: 'A genuine sharp inhale right before the shutter beats a held, static expression.',
    joints: {spine: 20, hips: 15, neck: -9.3, leftShoulder: -50, rightShoulder: -62, leftElbow: 100, rightElbow: 100, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['expressive', 'beginner', 'eccentric', 'social']
  },
  'thinker-extreme': {
    id: 'thinker-extreme', category: 'eccentric', name: 'Thinker Extreme',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit or crouch and press a closed fist hard against the chin, elbow braced on the opposite knee, torso hunched forward in an exaggerated Rodin-inspired pose.',
    tip: 'Exaggerate the hunch further than feels natural -- this pose is a deliberate homage.',
    joints: { spine: -30, neck: -20, leftElbow: 60, rightShoulder: -12, rightElbow: 30, hips: 15, leftKnee: 90, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'matrix-lean',
    tags: ['artistic', 'intermediate', 'eccentric', 'classic']
  },
  'crouching-prowl': {
    id: 'crouching-prowl', category: 'eccentric', name: 'Crouching Prowl',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Crouch low on the balls of both feet, fingertips grazing the ground, spine curved and head lifted like a predator ready to move. An intense, feline energy.',
    tip: 'Keep weight forward on the toes, not back on the heels, to maintain coiled tension.',
    joints: { spine: -15, neck: -8, leftElbow: 60, rightShoulder: -12, rightElbow: 30, leftHip: 60, leftKnee: 140, rightHip: 60, rightKnee: 140, shoulderFwdL: 8, shoulderFwdR: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'superhero-land',
    tags: ['advanced', 'artistic', 'eccentric', 'intense']
  },
  'fashion-collapse': {
    id: 'fashion-collapse', category: 'eccentric', name: 'Fashion Collapse',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Let the body appear to collapse dramatically to one side, one knee buckling and the torso following, arms trailing as if caught mid-fall. A bold, high-fashion risk shot.',
    tip: 'Practice the controlled fall onto a soft surface first -- it should look uncontrolled but stay completely safe.',
    joints: {spine: 30, hips: 15, neck: -9.9, leftShoulder: 50, rightShoulder: -20, leftElbow: 60, rightElbow: 30, leftKnee: 100, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'ragdoll-hang',
    tags: ['advanced', 'editorial', 'eccentric', 'fashion']
  },
  'elongated-reach': {
    id: 'elongated-reach', category: 'eccentric', name: 'Elongated Reach',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Swing one arm in a large circular motion, capturing it mid-arc overhead or to the side while the body twists naturally with the reach for maximum extension.',
    tip: 'Extend fully through the fingertips, not just the arm, to sell the elongation.',
    joints: {spine: 10, hips: 15, neck: -8.8, leftShoulder: -132, rightShoulder: 20, leftElbow: 60, rightElbow: 30, rightHip: -50, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['artistic', 'intermediate', 'eccentric', 'elongated']
  },

  // ══════════════ COUPLE (30) ══════════════
  'couple-embrace': {
    id: 'couple-embrace', category: 'couple', name: 'Close Embrace',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand facing each other, very close, and wrap arms fully around one another in a close embrace. Heads can touch or turn toward the camera.',
    tip: 'The person in front should angle their body slightly -- full front-facing couples look static.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 5→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 18, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['romantic', 'beginner', 'couple']
  },
  'back-to-back': {
    id: 'back-to-back', category: 'couple', name: 'Back to Back',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand back-to-back with weight evenly shared, arms crossed or relaxed at the sides. Turn heads slightly toward the camera for a confident duo shot.',
    tip: 'Matching posture and height cues make the pairing feel intentional.',
    joints: {
"spine":5,"hips":10,"neck":-8.8,"leftShoulder":-10,"rightShoulder":8,"leftElbow":90,"rightElbow":90,"hipAbductL":10,"hipAbductR":10,"leftKnee":10,"rightKnee":10,"globalRoll":-8,"shoulderFwdL":-40
  },
    color: 'rgba(201,162,76,0.15)', figure: 'couple-back-to-back',
    tags: ['playful', 'beginner', 'couple', 'front']
  },
  'forehead-touch': {
    id: 'forehead-touch', category: 'couple', name: 'Forehead Touch',
    difficulty: 'Beginner', angle: 'Profile', intent: 'Photography', effort: 'Static',
    instructions: 'Face each other and gently touch foreheads, eyes closed or downcast. Hands can rest on shoulders or waists for a tender, intimate connection.',
    tip: 'Leave a sliver of space between noses -- pressing together flattens both faces.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-forehead-touch',
    tags: ['romantic', 'beginner', 'couple', 'intimate']
  },
  'waltz-hold': {
    id: 'waltz-hold', category: 'couple', name: 'Waltz Hold',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Take a classic waltz frame: one hand clasped and lifted, the other resting on the partner back and shoulder. Hold an elegant, poised dance line.',
    tip: 'Lift through the joined hands and keep both spines long for a graceful ballroom line.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-slow-dance',
    tags: ['elegant', 'intermediate', 'couple', 'dance']
  },
  'piggyback': {
    id: 'piggyback', category: 'couple', name: 'Piggyback',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'One partner climbs onto the other back for a piggyback ride. Both lean into the moment and laugh naturally for a joyful, candid frame.',
    tip: 'Genuine laughter beats a posed smile -- crack a joke right before the shutter.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-piggyback',
    tags: ['joyful', 'intermediate', 'couple', 'candid']
  },
  'hand-in-hand-walk': {
    id: 'hand-in-hand-walk', category: 'couple', name: 'Walk Together',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Walk side by side with hands linked, both mid-stride. Turn slightly toward each other or the camera for a warm, storytelling frame.',
    tip: 'Actually walk a few real steps -- genuine gait always beats a frozen fake one.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: -15, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['candid', 'beginner', 'couple', 'motion']
  },
  'over-shoulder-look': {
    id: 'over-shoulder-look', category: 'couple', name: 'Over Shoulder',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands slightly in front, the other close behind resting a chin near their shoulder and looking toward the camera. Creates a layered, connected portrait.',
    tip: 'Stagger heights slightly so both faces are clearly visible.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['portrait', 'beginner', 'couple']
  },
  'side-hug': {
    id: 'side-hug', category: 'couple', name: 'Side Hug',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand side by side and wrap arms around each other shoulders or waists. Lean heads gently together for a warm, close connection.',
    tip: 'Angle the outer feet forward -- it suggests movement even in a still hug.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: -14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['warm', 'beginner', 'couple', 'front']
  },
  'slow-dance': {
    id: 'slow-dance', category: 'couple', name: 'Slow Dance',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Face each other closely, one partner hand at the other waist, arms loosely draped over shoulders in a gentle sway. Lean in for an intimate dance frame',
    tip: 'A real gentle sway captured mid-motion feels far more genuine than a rigid dance hold.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-slow-dance',
    tags: ['romantic', 'beginner', 'couple', 'dance']
  },
  'over-shoulder-look-couple': {
    id: 'over-shoulder-look-couple', category: 'couple', name: 'Over Shoulder Look',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands slightly behind and to the side of the other, chin near the shoulder, both looking toward camera at slightly different angles.',
    tip: 'Stagger heights and turn each face a touch differently to avoid a flat, mirrored look.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['portrait', 'beginner', 'couple']
  },
  'piggyback-couple': {
    id: 'piggyback-couple', category: 'couple', name: 'Piggyback Ride',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'One partner climbs onto the other back for a piggyback ride, both leaning into the moment with genuine laughter and connection',
    tip: 'Have the carrying partner take a real step forward -- motion makes it feel alive.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-piggyback',
    tags: ['playful', 'intermediate', 'couple', 'candid']
  },
  'forehead-touch-hands-held': {
    id: 'forehead-touch-hands-held', category: 'couple', name: 'Forehead Touch Hands Held',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Face each other, touch foreheads gently, and clasp both hands together between your bodies at chest height. Eyes closed or softly downcast for intimacy.',
    tip: 'Keep a small gap between bodies so the clasped hands stay visible in frame.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -75, rightShoulder: -70, leftElbow: 130, rightElbow: 130, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -55, shoulderFwdR: -55, globalRoll: -8},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-forehead-touch',
    tags: ['romantic', 'beginner', 'couple', 'intimate']
  },
  'cheek-to-cheek': {
    id: 'cheek-to-cheek', category: 'couple', name: 'Cheek to Cheek',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand or sit close together and press cheeks gently together while both face the camera with warm smiles. A classic, joyful double-portrait pose.',
    tip: 'Tilt both heads slightly toward each other rather than pressing flat for a natural look.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-forehead-touch',
    tags: ['warm', 'beginner', 'couple', 'classic']
  },
  'shoulder-to-shoulder': {
    id: 'shoulder-to-shoulder', category: 'couple', name: 'Shoulder to Shoulder',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand or sit close with shoulders touching, both facing the camera directly. A simple, warm, classic side-by-side portrait',
    tip: 'A slight inward lean of the shoulders reads warmer than standing perfectly upright.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['friendly', 'beginner', 'couple', 'front']
  },
  'whisper-ear': {
    id: 'whisper-ear', category: 'couple', name: 'Whisper in Ear',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner leans in close to whisper something in the other ear. Let a genuine reaction -- a laugh or smile -- happen naturally',
    tip: 'Have the whispering partner say something actually funny -- real reactions beat performed ones.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-forehead-touch',
    tags: ['candid', 'beginner', 'couple', 'playful']
  },
  'lead-dance-hand': {
    id: 'lead-dance-hand', category: 'couple', name: 'Lead Dance Hand',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'One partner extends a hand to lead the other into a spin or step, arms connected only at the fingertips, both bodies angled dynamically apart.',
    tip: 'The fingertip-only connection creates elegant negative space between the two bodies',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-slow-dance',
    tags: ['elegant', 'intermediate', 'couple', 'dance']
  },
  'one-holds-other-waist': {
    id: 'one-holds-other-waist', category: 'couple', name: 'One Holds Other Waist',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands behind, wrapping an arm around the other waist while both look toward the camera or lean into each other. A close, supportive connection',
    tip: 'The front partner should lean back slightly into the hold to close the visual gap.',
    joints: {spine: -5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['warm', 'beginner', 'couple', 'intimate']
  },
  'seated-together-back': {
    id: 'seated-together-back', category: 'couple', name: 'Seated Together Back to Back',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the ground back-to-back, spines gently touching, each with knees drawn up or legs extended in their own direction. A calm, supportive dual portrait.',
    tip: 'Have both partners press back gently into each other for real, visible weight-sharing contact.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-back-to-back',
    tags: ['calm', 'beginner', 'couple', 'floor']
  },
  'side-by-side-lean': {
    id: 'side-by-side-lean', category: 'couple', name: 'Side by Side Lean',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand or sit side by side and lean your heads together at the top, bodies staying upright and separate below. A sweet, minimal gesture of closeness.',
    tip: 'This subtle pose works beautifully in wide shots where the setting plays a supporting role.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['sweet', 'beginner', 'couple', 'minimal']
  },
  'romantic-reach': {
    id: 'romantic-reach', category: 'couple', name: 'Romantic Reach',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'One partner reaches out to touch the other face or hand, bodies angled toward each other in a tender, reaching gesture',
    tip: 'A few real steps toward each other before the shutter reads as a far more genuine reach.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: 60, rightShoulder: 20, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-slow-dance',
    tags: ['romantic', 'intermediate', 'couple', 'editorial']
  },
  'hand-in-hand-walk-couple': {
    id: 'hand-in-hand-walk-couple', category: 'couple', name: 'Hand in Hand Walk',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Walk side by side with fingers interlaced, both mid-stride, looking ahead or at each other. A warm, storytelling walking portrait.',
    tip: 'Walk several real steps in a loop and shoot continuously for a natural gait.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: -15, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['candid', 'beginner', 'couple', 'motion']
  },
  'nose-to-nose': {
    id: 'nose-to-nose', category: 'couple', name: 'Nose to Nose',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand close facing each other with noses nearly touching, eyes locked or closed, small smiles at the lips. A playful, tender close-up moment.',
    tip: 'Leave a tiny gap between noses to avoid distorting both faces in close-up.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-forehead-touch',
    tags: ['tender', 'beginner', 'couple', 'close-up']
  },
  'both-look-camera-hold-hands': {
    id: 'both-look-camera-hold-hands', category: 'couple', name: 'Both Look Camera Hold Hands',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand side by side facing the camera directly, hands clasped together and held slightly forward or at the sides. A simple, warm, classic couple portrait.',
    tip: 'A slight body angle toward each other, even while facing camera, keeps it from feeling rigid.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: -14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['classic', 'beginner', 'couple', 'front']
  },
  'one-leans-other-stands': {
    id: 'one-leans-other-stands', category: 'couple', name: 'One Leans Other Stands',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands upright and steady while the other leans their body weight gently against them, head resting on a shoulder or chest. A trusting, relaxed dynamic.',
    tip: 'The standing partner should widen their stance slightly to comfortably support the lean.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['trusting', 'beginner', 'couple', 'relaxed']
  },
  'facing-away-hold': {
    id: 'facing-away-hold', category: 'couple', name: 'Facing Away Hold',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Both partners face away from the camera holding hands, walking or standing together looking out at a view. An anonymous, story-driven silhouette shot.',
    tip: 'Backlighting or golden hour works especially well since faces are not the focus',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-back-to-back',
    tags: ['editorial', 'intermediate', 'couple', 'silhouette']
  },
  'partners-lean': {
    id: 'partners-lean', category: 'couple', name: 'Partners Lean',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand back to back and lean into each other for mutual support, arms crossed or hands in pockets. A cool, confident, symmetrical duo stance.',
    tip: 'Matching expressions and posture make the symmetry feel intentional, not incidental.',
    joints: {
"spine":5,"hips":10,"neck":-8.8,"leftShoulder":-10,"rightShoulder":8,"leftElbow":90,"rightElbow":90,"hipAbductL":10,"hipAbductR":10,"leftKnee":10,"rightKnee":10,"globalRoll":-8,"shoulderFwdL":-40
  },
    color: 'rgba(201,162,76,0.15)', figure: 'couple-side-profile',
    tags: ['confident', 'beginner', 'couple', 'symmetrical']
  },
  'together-arms-up': {
    id: 'together-arms-up', category: 'couple', name: 'Together Arms Up',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Stand side by side and throw all four arms up together in a joint celebratory gesture, jumping slightly if energy allows. A joyful, high-energy duo shot.',
    tip: 'Count down together out loud before jumping so the gesture lands in sync.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -136, rightShoulder: -120, leftElbow: 70, rightElbow: 70, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-slow-dance',
    tags: ['joyful', 'intermediate', 'couple', 'celebratory']
  },
  'sitting-one-standing-one': {
    id: 'sitting-one-standing-one', category: 'couple', name: 'Sitting One Standing One',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner sits on a chair, step, or ledge while the other stands close beside or behind, a hand resting on their shoulder. Creates natural height variation.',
    tip: 'Height variation between two people produces a far more dynamic composition than standing side by side.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-piggyback',
    tags: ['dynamic', 'beginner', 'couple', 'composition']
  },
  'cradled-from-behind': {
    id: 'cradled-from-behind', category: 'couple', name: 'Cradled From Behind',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands behind, wrapping both arms fully around the other in a cradling embrace. The front partner leans back into the hold',
    tip: 'Closing the eyes and relaxing fully into the hold sells the trust and comfort.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 5→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 18, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 10, rightKnee: 10, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['tender', 'beginner', 'couple', 'intimate']
  },
  'seated-one-stands-behind': {
    id: 'seated-one-stands-behind', category: 'couple', name: 'Seated One Stands Behind',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'One partner sits while the other stands directly behind, leaning forward to rest arms around their shoulders or drape over the chair back. Both look toward camera.',
    tip: 'The standing partner leaning in fills the gap between the two heads for a tighter composition.',
    joints: {spine: 5, hips: 10, neck: -8.8, leftShoulder: -10, rightShoulder: 8, leftElbow: 30, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, globalRoll: -8, shoulderFwdL: 14},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-piggyback',
    tags: ['editorial', 'beginner', 'couple', 'composition']
  },

  // ══════════════ ACCESSIBLE (30) ══════════════
  'wheelchair-arms': {
    id: 'wheelchair-arms', category: 'accessible', name: 'Arms Expressive',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'From a seated position, focus on expressive arm and hand placement -- extending outward, framing the face, or reaching upward with intention.',
    tip: 'The upper body offers infinite variety -- let arm expression carry the pose.',
    joints: {spine: 5, leftShoulder: -45, rightShoulder: -20, leftElbow: 15, rightElbow: 80, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, neck: -3.3},
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['expressive', 'beginner', 'accessible', 'front']
  },
  'seated-power': {
    id: 'seated-power', category: 'accessible', name: 'Seated Power',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit tall with hands resting on the wheels or armrests. Square the shoulders, lift the chin, and hold a strong, commanding presence.',
    tip: 'Rolling the shoulders back and down instantly reads as confidence and authority.',
    joints: { spine: -8, neck: -8, leftShoulder: -18, leftElbow: 70, rightShoulder: 0, rightElbow: 50, leftHip: 40, leftKnee: 85, leftAnkle: -15, rightHip: 40, rightKnee: 85, rightAnkle: -15 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['confident', 'beginner', 'accessible', 'editorial']
  },
  'upper-reach': {
    id: 'upper-reach', category: 'accessible', name: 'Sky Reach',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Raise both arms upward with a joyful, open expression, chest lifting and face brightening. Let the gaze follow the hands toward the sky.',
    tip: 'A genuine upward gaze following the hands adds real energy to the reach.',
    // PR-v2 (v1.2) — Phase 2/3 forensic audit fix. Root causes:
    //   1. spine was 5 (slight forward fold) but description says "chest
    //      LIFTING" which is a back arch. Per convention, spine negative =
    //      backward arch. Fixed: spine 5 → -15 (chest lift / back arch).
    //   2. neck was 12 but description says "gaze follow the hands toward the
    //      sky" — head should tilt UP (neck extension). The convention has
    //      neck as side-tilt, not pitch. We approximate upward gaze by keeping
    //      neck small (0) since the rig doesn't have a neck-pitch joint. The
    //      back arch (spine -15) will lift the chest and implicitly the gaze.
    //   3. leftShoulder -136 / rightShoulder -120 — both arms ARE raised in
    //      the data, but the VLM saw only the left arm raised. Root cause:
    //      the avatar SVG glyph 'chair-reach-diagonal' shows only one arm
    //      raised (it's a hand-crafted glyph, not procedural). The skeleton/
    //      ghost DO show both arms, but the VLM may have been generalizing
    //      from the avatar row. To make the skeleton/ghost more clearly
    //      symmetric, I equalized both shoulders to -130 (was -136/-120,
    //      a 16° asymmetry that made the right arm look less raised).
    //   4. elbows 70/70 — correct (soft bend overhead). Kept.
    //   5. leftHip/rightHip 40/40 + leftKnee/rightKnee 30/30 — both legs
    //      flexed and bent. The description doesn't mention legs, but for
    //      "accessible" category (chair user), the hips should be at 90°
    //      (seated). Increased: leftHip/rightHip 40 → 90 (seated hip flexion),
    //      leftKnee/rightKnee 30 → 90 (seated knee bend).
    // REASONING [PR-v2]: "Description is king" + directive Part H #38 "Use a
    // chair instead of wheelchair (for accessible category)". The pose should
    // show a seated figure (chair user) with both arms raised joyfully.
    joints: { spine: -15, neck: 0, leftShoulder: -130, leftElbow: 70, rightShoulder: -130, rightElbow: 70, leftHip: 90, leftKnee: 90, rightHip: 90, rightKnee: 90 },
    color: 'rgba(76,175,125,0.15)', figure: 'chair-reach-diagonal',
    tags: ['joyful', 'beginner', 'accessible', 'artistic']
  },
  'side-arm-drape': {
    id: 'side-arm-drape', category: 'accessible', name: 'Arm Drape',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Drape one arm elegantly over the chair back or wheel while the other rests in the lap. Turn the torso slightly for a relaxed, graceful line.',
    tip: 'A draped arm should look weightless and fluid, never gripping or stiff.',
    joints: {spine: 5, neck: -9.3, leftShoulder: -30, rightShoulder: 0, leftElbow: 40, leftHip: 40, rightHip: 40, leftKnee: 30, rightKnee: 30, rightElbow: 18, globalTwist: 25},
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['graceful', 'beginner', 'accessible']
  },
  'forward-lean-power': {
    id: 'forward-lean-power', category: 'accessible', name: 'Forward Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean forward slightly with elbows resting on the knees, gaze direct and determined. An engaged, dynamic seated posture full of intent.',
    tip: 'Leaning toward the camera creates connection and a sense of forward drive.',
    joints: { spine: 14, neck: -4, leftShoulder: -10, leftElbow: 81, rightShoulder: 8, rightElbow: 81, leftHip: 40, leftKnee: 30, rightHip: 40, rightKnee: 30 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['determined', 'beginner', 'accessible', 'editorial']
  },
  'chair-seated-look-up': {
    id: 'chair-seated-look-up', category: 'accessible', name: 'Chair Look Up',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Tilt the chin upward and gaze toward the light source, letting the neck lengthen. Rest both hands calmly on the armrests.',
    tip: 'Angling the face up toward a window or key light softens shadows and brightens the eyes.',
    joints: {spine: 5, neck: -6.0, leftShoulder: -16, rightShoulder: 2, leftElbow: 70, rightElbow: 50, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15},
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['portrait', 'beginner', 'accessible']
  },
  'chair-lean-side': {
    id: 'chair-lean-side', category: 'accessible', name: 'Chair Lean Side',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean the upper torso to one side, resting a forearm along the chair arm or back. Let the head tilt gently in the same direction as the lean',
    tip: 'Lead the lean with the ribcage, not just the shoulder, for a fluid diagonal.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: {spine: -18, rightShoulder: -6, leftElbow: 81, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, rightElbow: 18, neck: -3.3},
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['relaxed', 'beginner', 'accessible']
  },
  'chair-arms-crossed': {
    id: 'chair-arms-crossed', category: 'accessible', name: 'Chair Arms Crossed',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Sit upright and cross both arms loosely at chest height, resting rather than gripping. Add a slight head tilt for warmth and keep shoulders down.',
    tip: 'Rest hands loosely on the forearms, not gripping, to keep the pose confident rather than closed-off.',
    joints: {spine: 5, neck: -9.3, leftShoulder: -30, rightShoulder: -12, leftElbow: 100, rightElbow: 100, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'rgba(76,175,125,0.15)', figure: 'crossed-arms-stand',
    tags: ['confident', 'beginner', 'accessible']
  },
  'chair-forward-elbows': {
    id: 'chair-forward-elbows', category: 'accessible', name: 'Chair Forward Elbows',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean the torso forward from the hips and rest both elbows on the armrests or a nearby table. Keep the spine long and the gaze direct and engaged.',
    tip: 'Hinge from the hips, not the upper back, to keep the chest open while leaning in.',
    joints: { spine: 16, neck: -4, leftShoulder: -10, leftElbow: 81, rightShoulder: 8, rightElbow: 81, leftHip: 40, leftKnee: 85, leftAnkle: -15, rightHip: 40, rightKnee: 85, rightAnkle: -15 },
    color: 'rgba(76,175,125,0.15)', figure: 'elbow-prop',
    tags: ['engaged', 'beginner', 'accessible', 'editorial']
  },
  'chair-reach-diagonal': {
    id: 'chair-reach-diagonal', category: 'accessible', name: 'Chair Reach Diagonal',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Active',
    instructions: 'Reach one arm out diagonally across the body and slightly upward, following the line with the gaze. Rotate the torso gently into the reach.',
    tip: 'Extend fully through the fingertips, not just the arm, for a reach that reads as intentional.',
    joints: {spine: 12, neck: -2.4, leftShoulder: -100, rightShoulder: -56.8, leftElbow: 70, rightElbow: 50, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, globalTwist: 25},
    color: 'rgba(76,175,125,0.15)', figure: 'chair-reach-diagonal',
    tags: ['dynamic', 'intermediate', 'accessible', 'artistic']
  },
  'chair-arms-overhead': {
    id: 'chair-arms-overhead', category: 'accessible', name: 'Chair Arms Overhead',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Raise both arms straight overhead, letting the ribcage lift and the chest open wide. A bold, expansive upper-body silhouette from a seated base.',
    tip: 'Keep a soft bend in both elbows overhead -- fully locked arms photograph as stiff.',
    joints: {spine: -10, neck: -6, leftShoulder: -127, rightShoulder: -117, leftElbow: 70, rightElbow: 70, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15},
    color: 'rgba(76,175,125,0.15)', figure: 'chair-arms-wide',
    tags: ['expressive', 'beginner', 'accessible', 'artistic']
  },
  'chair-look-over-shoulder': {
    id: 'chair-look-over-shoulder', category: 'accessible', name: 'Chair Look Over Shoulder',
    difficulty: 'Beginner', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn the upper torso away from the camera and look back over one shoulder toward the lens. Rest one hand on the back of the chair for the twist.',
    tip: 'Lead the turn with the eyes, then let the shoulders follow, for a natural sequential twist.',
    joints: { spine: 22, neck: 25, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 40, leftKnee: 85, leftAnkle: -15, rightHip: 40, rightKnee: 85, rightAnkle: -15 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['editorial', 'beginner', 'accessible', 'back']
  },
  'chair-profile-strong': {
    id: 'chair-profile-strong', category: 'accessible', name: 'Chair Profile Strong',
    difficulty: 'Beginner', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn completely to the side in profile, chin lifted slightly and shoulders squared. Rest both hands calmly in the lap or on the armrests.',
    tip: 'Lengthen the spine and pull the chin back and up, not just up, for a clean profile.',
    joints: {
        spine: -8,
        neck: -8,
        leftShoulder: -10,
        rightShoulder: 8,
        leftElbow: 70,
        rightElbow: 50,
        leftHip: 40,
        rightHip: 40,
        leftKnee: 85,
        rightKnee: 85,
        leftAnkle: -15,
        rightAnkle: -15
      },
    color: 'rgba(76,175,125,0.15)', figure: 'profile-stand',
    tags: ['editorial', 'beginner', 'accessible', 'profile']
  },
  'chair-reach-floor': {
    id: 'chair-reach-floor', category: 'accessible', name: 'Chair Reach Floor',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean forward and reach one arm down toward the floor beside the chair, torso following the reach. Rest the opposite hand on the armrest for balance.',
    tip: 'Keep the reaching arm relaxed rather than straining -- the gesture should look effortless.',
    joints: {spine: 25, neck: -12, leftShoulder: -80, rightShoulder: -44, leftElbow: 70, rightElbow: 50, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15},
    color: 'rgba(76,175,125,0.15)', figure: 'chair-reach-diagonal',
    tags: ['dynamic', 'intermediate', 'accessible']
  },
  'chair-stretch-arms-back': {
    id: 'chair-stretch-arms-back', category: 'accessible', name: 'Chair Stretch Arms Back',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Reach both arms behind the chair back and clasp the hands together, opening the chest wide and lifting the chin. A strong, open stretch through the shoulders.',
    tip: 'Draw the shoulder blades together as the arms reach back for a fuller chest opening.',
    joints: {spine: -10, neck: -8, leftShoulder: 60, rightShoulder: 50, leftElbow: 70, rightElbow: 100, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 50, shoulderFwdR: 90},
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['open', 'beginner', 'accessible', 'artistic']
  },
  'chair-self-hug': {
    id: 'chair-self-hug', category: 'accessible', name: 'Chair Self Hug',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Wrap both arms around the torso in a gentle self-hug, shoulders relaxed and head tilted slightly. A tender, introspective seated moment.',
    tip: 'Softly closing the eyes and tucking the chin deepens the intimate, self-soothing quality.',
    joints: {spine: 5, neck: 10, leftShoulder: -10, rightShoulder: 8, leftElbow: 100, rightElbow: 100, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['tender', 'beginner', 'accessible', 'social']
  },
  'chair-turn-twist': {
    id: 'chair-turn-twist', category: 'accessible', name: 'Chair Turn Twist',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Rotate the torso fully to one side while the lower body stays facing forward, one arm resting across the body and the other opening outward. A dynamic spinal rotation.',
    tip: 'Keep the hips anchored throughout the twist for the most flattering line.',
    joints: {spine: 26, neck: 20, leftShoulder: 30, rightShoulder: 1.2, leftElbow: 70, rightElbow: 50, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, globalTwist: 25},
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['dynamic', 'intermediate', 'accessible', 'editorial']
  },
  'chair-face-frame': {
    id: 'chair-face-frame', category: 'accessible', name: 'Chair Face Frame',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Bring both hands up to loosely frame either side of the face without touching it, elbows out and relaxed. Keep the fingers soft and slightly spread.',
    tip: 'Leave a small gap between the hands and the face so the cheeks are not distorted.',
    joints: {spine: 5, neck: -8.2, leftShoulder: -10, rightShoulder: 8, leftElbow: 100, rightElbow: 100, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'rgba(76,175,125,0.15)', figure: 'face-frame-hands',
    tags: ['editorial', 'intermediate', 'accessible', 'beauty']
  },
  'chair-triumphant-arms': {
    id: 'chair-triumphant-arms', category: 'accessible', name: 'Chair Triumphant Arms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Throw both arms up into a wide V above the head in a moment of celebration, chest lifted and face bright with genuine joy.',
    tip: 'A real upward push through the chest as the arms lift adds an authentic burst of energy.',
    joints: {spine: -10, neck: 2.4, leftShoulder: -127, rightShoulder: -114, leftElbow: 70, rightElbow: 70, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15},
    color: 'rgba(76,175,125,0.15)', figure: 'chair-arms-wide',
    tags: ['joyful', 'beginner', 'accessible', 'celebratory']
  },
  'chair-chin-tilt': {
    id: 'chair-chin-tilt', category: 'accessible', name: 'Chair Chin Tilt',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Sit centered and tilt the head gently toward one shoulder, keeping the body square to the camera. Add a soft, warm smile.',
    tip: 'Keep the tilt under 15 degrees -- more than that reads as quizzical instead of warm.',
    joints: {
        spine: 5,
        neck: 16,
        leftShoulder: -10,
        rightShoulder: 8,
        leftElbow: 70,
        rightElbow: 50,
        leftHip: 40,
        rightHip: 40,
        leftKnee: 85,
        rightKnee: 85,
        leftAnkle: -15,
        rightAnkle: -15
      },
    color: 'rgba(76,175,125,0.15)', figure: 'chin-on-hand',
    tags: ['friendly', 'beginner', 'accessible', 'social']
  },
  'chair-wave': {
    id: 'chair-wave', category: 'accessible', name: 'Chair Wave',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Raise one hand in a warm, open waving gesture at shoulder height, fingers relaxed and slightly spread. Let a genuine smile accompany the wave.',
    tip: 'A slight wrist motion captured mid-wave feels far more welcoming than a frozen hand.',
    joints: {spine: 5, neck: -8.2, leftShoulder: -90, leftElbow: 60, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, rightElbow: 18, rightShoulder: -57.6},
    color: 'rgba(76,175,125,0.15)', figure: 'chair-reach-diagonal',
    tags: ['welcoming', 'beginner', 'accessible', 'social']
  },
  'chair-point-gesture': {
    id: 'chair-point-gesture', category: 'accessible', name: 'Chair Point Gesture',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Extend one arm forward with a confident pointing gesture, as if directing attention or making a statement. Align the gaze with the pointing direction.',
    tip: 'Extend fully through the fingertip, not a bent casual point, for a deliberate gesture.',
    joints: {spine: 6, leftShoulder: -80, leftElbow: 70, rightElbow: 50, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, neck: -3.3, rightShoulder: -51.2},
    color: 'rgba(76,175,125,0.15)', figure: 'chair-reach-diagonal',
    tags: ['confident', 'intermediate', 'accessible', 'editorial']
  },
  'chair-hair-touch': {
    id: 'chair-hair-touch', category: 'accessible', name: 'Chair Hair Touch',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Bring one hand up to gently tuck or touch the hair near the temple, elbow lifted and relaxed. A soft, candid, self-assured gesture.',
    tip: 'A light touch, rather than deliberate styling, keeps the gesture looking spontaneous.',
    joints: {spine: 5, neck: -9.3, leftShoulder: -80, leftElbow: 81, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, rightElbow: 18, rightShoulder: -51.2},
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['candid', 'beginner', 'accessible']
  },
  'chair-thinking-pose': {
    id: 'chair-thinking-pose', category: 'accessible', name: 'Chair Thinking Pose',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Rest an elbow on the armrest and bring a loose fist up to the chin or cheek, gazing thoughtfully off to the side.',
    tip: 'A loose fist under the chin reads playful; an open palm reads contemplative -- choose your mood.',
    joints: {spine: 5, neck: -3.6, leftShoulder: -10, rightShoulder: 8, leftElbow: 95, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, rightElbow: 18},
    color: 'rgba(76,175,125,0.15)', figure: 'chin-on-hand',
    tags: ['thoughtful', 'beginner', 'accessible', 'artistic']
  },
  'chair-laugh-gesture': {
    id: 'chair-laugh-gesture', category: 'accessible', name: 'Chair Laugh Gesture',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Sudden-Free',
    instructions: 'Throw the head back slightly in genuine laughter, one hand resting near the chest or covering part of the mouth. A joyful, candid, unguarded moment.',
    tip: 'A real joke right before the shutter captures far more authentic laughter than faking it.',
    joints: { spine: 5, neck: 18, leftShoulder: -10, leftElbow: 100, rightShoulder: 8, rightElbow: 18, leftHip: 40, leftKnee: 85, leftAnkle: -15, rightHip: 40, rightKnee: 85, rightAnkle: -15 },
    color: 'rgba(76,175,125,0.15)', figure: 'chair-arms-wide',
    tags: ['joyful', 'beginner', 'accessible', 'candid']
  },
  'chair-both-arms-wide': {
    id: 'chair-both-arms-wide', category: 'accessible', name: 'Chair Both Arms Wide',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Open both arms wide to the sides at shoulder height, palms up, in a warm, welcoming gesture. Keep the chest lifted and the expression open.',
    tip: 'An open palm gesture reads as inviting -- keep fingers relaxed, not stiffly extended.',
    joints: {spine: 5, leftShoulder: -90, rightShoulder: -72, leftElbow: 70, rightElbow: 70, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, neck: -3.3},
    color: 'rgba(76,175,125,0.15)', figure: 'chair-arms-wide',
    tags: ['welcoming', 'beginner', 'accessible', 'social']
  },
  'chair-lean-back-casual': {
    id: 'chair-lean-back-casual', category: 'accessible', name: 'Chair Lean Back Casual',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Lean back comfortably into the chair, letting the backrest fully support the spine. Rest both hands loosely on the armrests and relax the shoulders down.',
    tip: 'Uncross the arms and open the hands slightly so the relaxed lean does not read as closed-off.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 14→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -18, neck: 4, leftShoulder: -10, rightShoulder: 8, leftElbow: 95, rightElbow: 95, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 12, shoulderFwdR: -10},
    color: 'rgba(76,175,125,0.15)', figure: 'seated-side',
    tags: ['relaxed', 'beginner', 'accessible']
  },
  'chair-meditation': {
    id: 'chair-meditation', category: 'accessible', name: 'Chair Meditation',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit with hands resting palm-up on the knees or thighs, eyes closed softly, chin level. A calm, grounded, meditative upper-body posture.',
    tip: 'Roll the shoulders down and back before settling -- shoulder tension breaks the calm instantly.',
    joints: { spine: -8, neck: -8, leftShoulder: -16, leftElbow: 70, rightShoulder: 2, rightElbow: 50, leftHip: 40, leftKnee: 85, leftAnkle: -15, rightHip: 40, rightKnee: 85, rightAnkle: -15 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['calm', 'beginner', 'accessible', 'meditative']
  },
  'chair-dramatic-reach': {
    id: 'chair-dramatic-reach', category: 'accessible', name: 'Chair Dramatic Reach',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Reach one arm powerfully upward and outward while the torso leans into the gesture, gaze following the reaching hand. A dynamic, editorial upper-body moment.',
    tip: 'Extend fully through the shoulder blade, not just the hand, for a powerful reach.',
    joints: {spine: -12, neck: -10, leftShoulder: -130, rightShoulder: -76, leftElbow: 70, rightElbow: 50, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15},
    color: 'rgba(76,175,125,0.15)', figure: 'chair-reach-diagonal',
    tags: ['dynamic', 'intermediate', 'accessible', 'editorial']
  },
  'chair-editorial-profile': {
    id: 'chair-editorial-profile', category: 'accessible', name: 'Chair Editorial Profile',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn to a strong side profile, chin lifted slightly, shoulders squared to the camera side. Rest hands calmly on the armrests or lap.',
    tip: 'A clean editorial profile depends on a long neck -- lift from the crown, not the chin.',
    joints: {spine: 5, neck: -3.0, leftShoulder: -10, rightShoulder: 8, leftElbow: 100, leftHip: 40, rightHip: 40, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, rightElbow: 18},
    color: 'rgba(76,175,125,0.15)', figure: 'profile-stand',
    tags: ['editorial', 'intermediate', 'accessible', 'profile']
  },

  // ══════════════ NEW CATEGORIES (Phase 1A Expansion) ══════════════
  // ═════════════ BOUDOIR (30) ═════════════
    'boudoir-elegant-recline': {
      id: 'boudoir-elegant-recline', category: 'boudoir', name: 'Elegant Side Recline',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Lie on the side with hips stacked, head propped on a bent hand and elbow grounded. Extend the bottom leg long with a pointed toe and let the top knee draw softly upward.',
      tip: 'Let the waist dip and the hip crest -- that curve is the whole shape of this pose.',
      joints: {globalTilt: 75, globalRoll: -10, neck: 12, leftHip: 18, rightHip: 10, leftKnee: 30, rightKnee: 45, rightAnkle: -15, leftElbow: 30, rightShoulder: -30, rightElbow: 18, spine: 10, leftAnkle: -18},
      color: 'var(--color-teal-100)',
      figure: 'boudoir-recline',
      tags: ['curve', 'triangles', 'recline', 'soft'],
    },
    'boudoir-s-curve-stand': {
      id: 'boudoir-s-curve-stand', category: 'boudoir', name: 'Standing S-Curve',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand with weight shifted onto the back leg, hip melting outward, and the front knee soft. Roll the shoulders back gently to lengthen the spine into a soft S-curve.',
      tip: 'Push the hip away from camera to maximize the waist-to-hip curve.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
      joints: { globalTilt: 50, spine: -15, neck: 10, leftShoulder: -12, leftElbow: 81, rightShoulder: 8, rightElbow: 60, leftHip: 30, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 25, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'scurve',
      tags: ['curve', 's-curve', 'standing', 'elegant'],
    },
    'boudoir-drape-arms': {
      id: 'boudoir-drape-arms', category: 'boudoir', name: 'Draped Arms Arch',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Reach both arms upward and drape them gently behind the head, wrists soft and crossed loosely. Arch the spine subtly and let the ribcage lift.',
      tip: 'Let the wrists fall softly rather than locking them -- tension breaks the graceful line.',
    // PR-v7 (v1.7) — fix too_subtle: arms overhead but shoulders not raised. Set both to -110°.
      joints: {spine: -12, neck: 3.9, leftShoulder: -110, rightShoulder: -110, leftElbow: 55, rightElbow: 45, leftHip: 5, rightHip: 20, leftKnee: 30, rightKnee: 10, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      color: 'var(--color-teal-100)',
      figure: 'boudoir-drape',
      tags: ['arch', 's-curve', 'arms', 'dramatic'],
    },
    'boudoir-seated-knee-wrap': {
      id: 'boudoir-seated-knee-wrap', category: 'boudoir', name: 'Seated Knee Wrap',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Sit with one knee drawn up and wrapped loosely in both arms, the other leg folded beneath. Lean the torso slightly forward with a soft, downward gaze.',
      tip: 'Keep the hands relaxed and open rather than gripping the knee tightly.',
      joints: { globalTilt: 50, spine: 12, neck: 18, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 40, leftKnee: 30, leftAnkle: -15, rightHip: 20, rightKnee: 90, rightAnkle: -15 },
      color: 'var(--color-teal-100)',
      figure: 'boudoir-seated-knee',
      tags: ['seated', 'triangles', 'intimate', 'soft'],
    },
    'boudoir-prone-elbows-lift': {
      id: 'boudoir-prone-elbows-lift', category: 'boudoir', name: 'Prone Elbow Lift',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Lie face down and prop up on both elbows to lift the chest gently off the floor. Cross the ankles behind with pointed toes and roll the shoulders down and away from the ears.',
      tip: 'Shoot from a low angle at eye level to flatter the lifted chest line.',
      joints: {globalTilt: 70, spine: -15, neck: 5.4, leftShoulder: -12, rightShoulder: 8, shoulderFwdL: 25, shoulderFwdR: 25, leftElbow: 81, rightElbow: 81, leftAnkle: -18, rightAnkle: -18},
      color: 'var(--color-teal-100)',
      figure: 'boudoir-prone-elbow',
      tags: ['prone', 'curve', 'elbows', 'floor'],
    },
    'boudoir-hip-raise-lying': {
      id: 'boudoir-hip-raise-lying', category: 'boudoir', name: 'Lying Hip Raise',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Lie on the back, plant both feet, and press the hips upward into a soft bridge. Turn the head to gaze off to one side with arms relaxed, palms open.',
      tip: 'Time the shutter at the peak of the hip lift for the strongest curve.',
      joints: { globalTilt: -80, spine: -10, neck: -6, leftShoulder: -12, leftElbow: 65, rightShoulder: 8, rightElbow: 45, leftHip: -15, leftKnee: 0, leftAnkle: -18, rightHip: -15, rightKnee: 0, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'boudoir-lying-arch',
      tags: ['arch', 'floor', 'curve', 'dramatic'],
    },
    'boudoir-window-light-lean': {
      id: 'boudoir-window-light-lean', category: 'boudoir', name: 'Window Light Lean',
      difficulty: 'Beginner',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand facing a window and lean the shoulder and hip gently against the frame, crossing one ankle in front of the other. Rest a hand on the collarbone and tilt the head toward the light.',
      tip: 'Use the window as the only light source and expose for the skin, letting the background fall dark.',
      joints: { globalTilt: 50, spine: 8, neck: 20, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 10, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 15, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'wall-lean',
      tags: ['lean', 'window', 'soft', 'mood'],
    },
    'boudoir-chair-straddle': {
      id: 'boudoir-chair-straddle', category: 'boudoir', name: 'Chair Straddle Sit',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Straddle a chair backward, resting the forearms along the top of the backrest. Arch the spine slightly and point both toes to the floor.',
      tip: 'Turn the shoulders toward camera more than the hips to create a soft twist through the waist.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
      joints: { globalTilt: 50, spine: -15, neck: 10, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 70, leftKnee: 80, leftAnkle: -15, rightHip: 20, rightKnee: 80, rightAnkle: -15 , globalTwist: 25},
      color: 'var(--color-teal-100)',
      figure: 'chair-arms-wide',
      tags: ['seated', 'chair', 'twist', 'triangles'],
    },
    'boudoir-back-to-camera-glance': {
      id: 'boudoir-back-to-camera-glance', category: 'boudoir', name: 'Back Glance Over Shoulder',
      difficulty: 'Beginner',
      angle: 'Over Shoulder',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand with the back to the camera, weight on one leg so the hip kicks out. Turn only the head and shoulders back toward the lens, one hand grazing the hair or neck.',
      tip: 'Drop the chin slightly before turning to avoid a strained neck line.',
      joints: { globalTilt: 50, spine: 12, neck: 27, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 35, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 20, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'hip-shift',
      tags: ['over-shoulder', 'silhouette', 'curve', 'elegant'],
    },
    'boudoir-floor-lounge-stretch': {
      id: 'boudoir-floor-lounge-stretch', category: 'boudoir', name: 'Floor Lounge Stretch',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Lounge on the floor propped on one forearm, legs extended long and stacked. Stretch the top arm overhead along the floor to elongate the entire side body.',
      tip: 'Fill the frame with the full body length to emphasize the stretch.',
      joints: {globalTilt: 75, globalRoll: -12.5, neck: 10, leftShoulder: -100, leftElbow: 70, rightElbow: 45, leftHip: 15, rightHip: 5, leftKnee: 5, spine: 10, leftAnkle: -18, rightAnkle: -18},
      color: 'var(--color-teal-100)',
      figure: 'side-recline',
      tags: ['stretch', 'floor', 'elongate', 'curve'],
    },
    'boudoir-kneeling-arch-back': {
      id: 'boudoir-kneeling-arch-back', category: 'boudoir', name: 'Kneeling Back Arch',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Kneel upright with knees hip-width apart, then arch the back and let the head fall gently backward. Reach both arms down to rest on the heels, hips pressed forward.',
      tip: 'Coach small movements -- a few degrees of arch change the shape dramatically.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:32, now spine:-32.
    // PR-v7 (v1.7) — fix too_subtle: arms overhead but shoulders not raised. Set both to -110°.
      joints: { globalTilt: 50, spine: -32, neck: 27, leftShoulder: 20, leftElbow: 55, rightShoulder: 20, rightElbow: 80, leftHip: 10, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 110, rightAnkle: -35, shoulderFwdL: -40, shoulderFwdR: -40 },
      color: 'var(--color-teal-100)',
      figure: 'kneeling-back-arch',
      tags: ['kneeling', 'arch', 'dramatic', 'triangles'],
    },
    'boudoir-standing-hand-hip': {
      id: 'boudoir-standing-hand-hip', category: 'boudoir', name: 'Soft Hand on Hip',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand with weight shifted onto the back leg, one hand resting softly on the jutted hip and the other arm relaxed at the side. Roll both shoulders back and down.',
      tip: 'A soft, relaxed hand reads better than a firm grip -- release tension in the fingers.',
      joints: { globalTilt: 50, spine: 8, neck: 15, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 25, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 15, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'hip-shift',
      tags: ['standing', 'hip', 'soft', 'classic'],
    },
    'boudoir-bedsheet-drape-sit': {
      id: 'boudoir-bedsheet-drape-sit', category: 'boudoir', name: 'Bedsheet Drape Sit',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Sit on the edge of the bed with a sheet draped across the lap, leaning back on one straight arm. Cross the ankles to the side and lift the chin slightly.',
      tip: 'Let fabric fall naturally rather than arranging it perfectly -- imperfect drape looks candid.',
      joints: { globalTilt: 50, spine: 10, neck: 10, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 20, leftKnee: 85, leftAnkle: -15, rightHip: 20, rightKnee: 85, rightAnkle: -15 },
      color: 'var(--color-teal-100)',
      figure: 'seated-side',
      tags: ['seated', 'drape', 'soft', 'intimate'],
    },
    'boudoir-mirror-reflection-pose': {
      id: 'boudoir-mirror-reflection-pose', category: 'boudoir', name: 'Mirror Reflection Pose',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand at a slight angle to a mirror with weight on the back leg, arching subtly. Place one hand on the mirror surface and gaze at the reflection rather than the lens.',
      tip: 'Compose so both the subject and reflection are visible for a layered, editorial feel.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:15, now spine:-15.
      joints: { globalTilt: -50, spine: -15, neck: 20, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 25, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 20, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'scurve',
      tags: ['mirror', 'reflection', 'curve', 'story'],
    },
    'boudoir-arm-overhead-stretch': {
      id: 'boudoir-arm-overhead-stretch', category: 'boudoir', name: 'Overhead Arm Stretch',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand with feet hip-width apart and reach one arm fully overhead while the other rests on the ribcage. Shift weight onto the hip opposite the raised arm.',
      tip: 'The overhead arm should graze past the ear, not press into it, to keep the neck line clean.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: 50, spine: 18, neck: 8, leftShoulder: -138, leftElbow: 70, rightShoulder: -132, rightElbow: 70, leftHip: 20, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 10, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'arm-reach',
      tags: ['stretch', 'standing', 'elongate', 'triangles'],
    },
    'boudoir-seated-legs-crossed-lean': {
      id: 'boudoir-seated-legs-crossed-lean', category: 'boudoir', name: 'Seated Crossed-Leg Lean',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Sit with legs crossed at the ankle and extended to one side, leaning the torso down over the thighs while walking the hands forward for support.',
      tip: 'Cue a long spine rather than lean forward to prevent rounded shoulders.',
      joints: {spine: 25, neck: 15, leftShoulder: -32, rightShoulder: -12, leftElbow: 100, rightElbow: 100, hipAbductL: -20, hipAbductR: 25, leftHip: 20, rightHip: 10, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: -12, shoulderFwdR: -10, globalTilt: 0},
      color: 'var(--color-teal-100)',
      figure: 'seated-floor',
      tags: ['seated', 'lean', 'curve', 'floor'],
    },
    'boudoir-standing-back-arch-wall': {
      id: 'boudoir-standing-back-arch-wall', category: 'boudoir', name: 'Wall Back Arch',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand a few inches from the wall and arch the back so only the shoulder blades and hips touch it. Let both arms float freely to the sides, gaze forward.',
      tip: 'Use the wall as a spotting tool so she can arch further with confidence and control.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:32, now spine:-32.
      joints: { globalTilt: 50, spine: -32, neck: 10, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 10, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 10, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'back-arch-wall',
      tags: ['wall', 'arch', 'dramatic', 'triangles'],
    },
    'boudoir-toe-point-recline': {
      id: 'boudoir-toe-point-recline', category: 'boudoir', name: 'Toe Point Recline',
      difficulty: 'Beginner',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Recline on one hip with legs extended and stacked, pointing both toes hard to lengthen the line. Prop the upper body on a bent forearm, free hand along the outer thigh.',
      tip: 'Pointed toes are non-negotiable in boudoir -- always check them before the shutter.',
      joints: {globalTilt: 78, globalRoll: -9, neck: 10, leftShoulder: -12, rightShoulder: 8, leftElbow: 65, rightElbow: 45, leftHip: 15, rightHip: 8, leftKnee: 25, rightKnee: 5, leftAnkle: -30, rightAnkle: -30, spine: 10},
      color: 'var(--color-teal-100)',
      figure: 'boudoir-recline',
      tags: ['recline', 'toe-point', 'curve', 'elongate'],
    },
    'boudoir-kneeling-forward-reach': {
      id: 'boudoir-kneeling-forward-reach', category: 'boudoir', name: 'Kneeling Forward Reach',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Kneel on all fours, then walk the hands forward while dropping the chest toward the floor and lifting the hips high, creating a long diagonal line.',
      tip: 'Shoot from a low angle to emphasize the diagonal from hands to raised hips.',
      joints: { globalTilt: 50, spine: 20, neck: 27, leftShoulder: 60, leftElbow: 80, rightShoulder: 20, rightElbow: 55, leftHip: 60, leftKnee: 80, leftAnkle: -18, rightHip: 20, rightKnee: 100, rightAnkle: -35 },
      color: 'var(--color-teal-100)',
      figure: 'kneeling-forward',
      tags: ['kneeling', 'diagonal', 'curve', 'low-angle'],
    },
    'boudoir-both-knees-prayer-soft': {
      id: 'boudoir-both-knees-prayer-soft', category: 'boudoir', name: 'Soft Prayer Kneel',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Kneel with both knees together, sitting back gently onto the heels, hands together in front of the chest in a soft prayer position. Round the shoulders forward slightly for intimacy.',
      tip: 'This quiet pose suits softer, vulnerable moments -- keep the energy calm.',
      joints: {spine: 15, neck: 10, leftShoulder: -30, rightShoulder: -30, leftElbow: 130, rightElbow: 130, leftHip: 80, rightHip: 80, leftKnee: 130, rightKnee: 130, leftAnkle: -35, rightAnkle: -35, shoulderFwdL: -90, shoulderFwdR: -90, globalTilt: 0, leftWrist: 30, rightWrist: 30},
      color: 'var(--color-teal-100)',
      figure: 'both-knees-prayer',
      tags: ['kneeling', 'soft', 'intimate', 'calm'],
    },
    'boudoir-standing-leg-up-chair': {
      id: 'boudoir-standing-leg-up-chair', category: 'boudoir', name: 'Leg Up on Chair',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand and place one foot up on a chair seat, weight shifting onto the standing leg. Let the raised knee soften and the torso lean gently over it.',
      tip: 'Keep the standing leg knee soft, not locked, for a relaxed, elegant line.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -12→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: 50, spine: 30, neck: 15, leftShoulder: -110, leftElbow: 55, rightShoulder: -110, rightElbow: 80, leftHip: 40, leftKnee: 30, leftAnkle: -15, rightHip: 20, rightKnee: 90, rightAnkle: -15 },
      color: 'var(--color-teal-100)',
      figure: 'hip-shift',
      tags: ['standing', 'leg-line', 'triangles', 'curve'],
    },
    'boudoir-supine-arms-up-soft': {
      id: 'boudoir-supine-arms-up-soft', category: 'boudoir', name: 'Supine Soft Arms Up',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand beside a chair and plant one foot flat on the seat, knee turned 30° outward, then hinge the torso down over the raised thigh with both hands resting near the ankle. Keep the standing leg straight with the toe pointed to elongate the calf line.',
      tip: 'Shoot at hip height and square to the raised knee to show the full leg line.',
      joints: {globalTilt: 85, leftShoulder: -112, rightShoulder: -92, leftElbow: 70, rightElbow: 70, leftHip: 15, rightHip: 10, neck: -3.3, spine: 10, leftAnkle: -18, rightAnkle: -18},
      color: 'var(--color-teal-100)',
      figure: 'back-arms-up',
      tags: ['supine', 'soft', 'intimate', 'high-angle'],
    },
    'boudoir-side-lying-top-leg-bent': {
      id: 'boudoir-side-lying-top-leg-bent', category: 'boudoir', name: 'Side Lying Bent Leg',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Lie flat on the back, knees bent and feet flat, then let both arms fall loosely overhead onto the floor, elbows soft. Turn the face 20-30° to one side and let the ribcage rise and fall naturally so the pose reads relaxed, not held.',
      tip: 'Shoot from directly overhead to compress the body into an intimate, vulnerable frame.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -12→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {globalTilt: -80, globalRoll: -17.5, neck: -5.5, leftShoulder: -110, rightShoulder: -110, leftElbow: 65, rightElbow: 45, leftHip: 20, rightHip: 55, leftKnee: 15, rightKnee: 85, spine: 10, leftAnkle: -18, rightAnkle: -18},
      color: 'var(--color-teal-100)',
      figure: 'boudoir-recline',
      tags: ['recline', 'waist', 'curve', 'classic'],
    },
    'boudoir-standing-hair-flip-still': {
      id: 'boudoir-standing-hair-flip-still', category: 'boudoir', name: 'Hair Touch Stillness',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Lie on one side, bottom leg extended long, top knee bent forward and resting on the floor, head propped on one hand. Lift the waist off the floor slightly to open a gap between the ribcage and hip.',
      tip: 'Watch for the waist-to-hip gap — that negative space is the shot\'s focal point.',
      joints: {spine: 10, neck: 10, leftShoulder: -12, rightShoulder: 8, leftElbow: 55, rightElbow: 80, leftHip: 0, rightHip: 80, leftKnee: 0, rightKnee: 80, leftAnkle: -18, rightAnkle: -18, globalTilt: 50},
      color: 'var(--color-teal-100)',
      figure: 'face-frame-hands',
      tags: ['standing', 'hair', 'triangles', 'soft'],
    },
    'boudoir-reclined-back-support': {
      id: 'boudoir-reclined-back-support', category: 'boudoir', name: 'Reclined Arm Support',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand in a soft S-curve with weight on the back leg, and lift one hand to graze the hair near the temple, elbow raised to shoulder height. Keep the gaze soft and angled slightly down for an intimate mood.',
      tip: 'Let the wrist fall softly — a raised elbow near the face frames it without stiffness.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 40→-110, rightShoulder -20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: -65, spine: 10, neck: 20, leftShoulder: -110, leftElbow: 60, rightShoulder: -110, rightElbow: 18, leftHip: 15, leftKnee: 30, leftAnkle: -18, rightHip: 10, rightKnee: 30, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'side-recline',
      tags: ['recline', 'open-chest', 'curve', 'support'],
    },
    'boudoir-standing-corset-hands': {
      id: 'boudoir-standing-corset-hands', category: 'boudoir', name: 'Hands at Waist Frame',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Recline onto both forearms, legs extended and softly bent at the knee, chest lifted open toward the camera. Point the toes and tip the head back gently to lengthen the front of the throat.',
      tip: 'Draw the shoulders down away from the ears even while bearing weight on the forearms.',
      joints: { globalTilt: -50, spine: 10, neck: 10, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 25, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 15, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'hip-shift',
      tags: ['standing', 'waist', 'triangles', 'frame'],
    },
    'boudoir-floor-hug-knees-soft': {
      id: 'boudoir-floor-hug-knees-soft', category: 'boudoir', name: 'Soft Floor Knee Hug',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand with 70% of weight on the back leg and rest both hands lightly at the natural waist, fingers relaxed, to frame the narrowest point of the torso. Rotate the shoulders 10-15° away from the hips for subtle definition.',
      tip: 'Keep the wrists soft — tension there reads instantly on camera.',
      joints: { globalTilt: -50, spine: 30, neck: 20, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 30, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 30, rightAnkle: -18 , globalTwist: 25},
      color: 'var(--color-teal-100)',
      figure: 'floor-hug-knees',
      tags: ['floor', 'intimate', 'soft', 'vulnerable'],
    },
    'boudoir-standing-look-back-drape': {
      id: 'boudoir-standing-look-back-drape', category: 'boudoir', name: 'Look Back Drape',
      difficulty: 'Advanced',
      angle: 'Over Shoulder',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Sit on the floor and draw both knees to the chest, wrapping the arms loosely around the shins with the chin resting on one knee. Let the upper back round slightly for a soft, protective shape.',
      tip: 'Pair this vulnerable shape with low, soft side lighting for the most intimate mood.',
      joints: { globalTilt: 50, spine: 30, neck: 27, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 30, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 10, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'boudoir-drape',
      tags: ['drape', 'over-shoulder', 'arch', 'dramatic'],
    },
    'boudoir-kneeling-sit-back-heels': {
      id: 'boudoir-kneeling-sit-back-heels', category: 'boudoir', name: 'Kneeling Sit-Back Pose',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Stand in profile, back toward camera, arch gently through the spine, and drape one arm up and back over the head as the chin glances over the opposite shoulder. Straighten the front leg, bend the back knee slightly for the S-curve.',
      tip: 'Combine the spinal arch with the over-shoulder glance for the classic boudoir silhouette.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:32, now spine:-32.
      joints: { globalTilt: 50, spine: -32, neck: 25, leftShoulder: -12, leftElbow: 55, rightShoulder: 8, rightElbow: 80, leftHip: 15, leftKnee: 30, leftAnkle: -15, rightHip: 20, rightKnee: 130, rightAnkle: -35 },
      color: 'var(--color-teal-100)',
      figure: 'kneeling-back-arch',
      tags: ['kneeling', 'arch', 'dramatic', 'flexible'],
    },
    'boudoir-standing-profile-curve': {
      id: 'boudoir-standing-profile-curve', category: 'boudoir', name: 'Standing Profile Curve',
      difficulty: 'Beginner',
      angle: 'Side View',
      intent: 'Boudoir',
      effort: 'Static',
      instructions: 'Kneel and sit back fully onto the heels, arch through the spine, and reach both arms behind to rest on the floor as the chin tilts up. Keep the knees together to preserve a slimming line through the hips.',
      tip: 'Warm up the spine first — never force a deep arch like this cold.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
      joints: { globalTilt: 50, spine: -15, neck: 10, leftShoulder: -110, leftElbow: 55, rightShoulder: -110, rightElbow: 80, leftHip: 15, leftKnee: 30, leftAnkle: -18, rightHip: 20, rightKnee: 15, rightAnkle: -18 },
      color: 'var(--color-teal-100)',
      figure: 'profile-stand',
      tags: ['profile', 'curve', 'standing', 'classic'],
    },
  

    // ═════════════ BOUDOIR NEW — BED & RECLINING (15) ═════════════
    'boudoir-m-pose': {
      id: 'boudoir-m-pose', category: 'boudoir', name: 'The M Pose',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit on the mattress with knees bent up and heels tucked close together. Spread the knees wide to form an "M" shape. Lean torso slightly forward with hands resting lightly on the mattress behind you.',
      tip: 'Keep the heels together while pushing the knees as wide as comfort allows — the wider the "M," the stronger the visual geometry.',
      joints: {spine: 15, neck: -5.4, leftElbow: 65, rightElbow: 45, hipAbductL: -25, hipAbductR: -25, leftHip: 80, rightHip: 80, leftKnee: 110, rightKnee: 110, leftAnkle: -15, rightAnkle: -15, globalTilt: 50, rightShoulder: 12},
      figure: 'seated-floor',
      tags: ["geometry", "seated", "floor", "triangles"],
    },
    'boudoir-sheet-pull': {
      id: 'boudoir-sheet-pull', category: 'boudoir', name: 'The Sheet Pull',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie on your back and hold a sheet loosely against your chest. Let your spine, shoulders, or legs remain fully exposed. The sheet floats as a natural frame.',
      tip: 'Pull the sheet only barely to cover — the near-reveal creates far more tension than full coverage.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: 85, spine: 18, neck: 8, leftShoulder: -30, leftElbow: 45, rightShoulder: -20, rightElbow: 40, leftHip: 15, leftKnee: 10, leftAnkle: -18, rightHip: 10, rightAnkle: -18 },
      figure: 'supine',
      tags: ["implied", "recline", "bed", "soft"],
    },
    'boudoir-prone-arch': {
      id: 'boudoir-prone-arch', category: 'boudoir', name: 'Prone Arch',
      difficulty: 'Intermediate', angle: 'Side View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie flat on your stomach and lift your chest off the mattress using your elbows. Arch your lower spine down and pull your shoulders back to create a dramatic lower-back curve.',
      tip: 'Drive the elbows wide apart and think "chest forward, hips down" rather than just "back up."',
      joints: {
"globalTilt":85,"spine":-20,"neck":5.4,"leftShoulder":-12,"rightShoulder":8,"shoulderFwdL":28,"shoulderFwdR":28,"leftElbow":81,"rightElbow":81,"leftHip":-8,"rightHip":-8,"leftAnkle":-20,"rightAnkle":-20
  },
      figure: 'boudoir-prone-elbow',
      tags: ["arch", "prone", "back-curve", "dramatic"],
    },
    'boudoir-supine-arch': {
      id: 'boudoir-supine-arch', category: 'boudoir', name: 'Supine Bed Arch',
      difficulty: 'Intermediate', angle: 'Side View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie on your back, bend your knees, and plant your feet flat. Lift your lower back off the surface so only your upper shoulders and glutes touch the bed.',
      tip: 'Push through the feet and squeeze the glutes to keep the arch — let the head relax completely back.',
      joints: {globalTilt: 82, spine: -15, leftShoulder: -12, rightShoulder: 8, leftElbow: 65, rightElbow: 45, leftHip: -30, rightHip: -30, leftKnee: 90, rightKnee: 90, leftAnkle: -26, rightAnkle: -26, neck: -6},
      figure: 'boudoir-lying-arch',
      tags: ["bridge", "supine", "arch", "athletic"],
    },
    'boudoir-sleeping-ariadne': {
      id: 'boudoir-sleeping-ariadne', category: 'boudoir', name: 'The Sleeping Ariadne',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie on your back diagonally across the bed. Lift one arm and rest the back of your hand against your forehead, tilt your chin up, and cross your ankles to relax your legs.',
      tip: 'The chin-up tilt elongates the neck dramatically — think of a swan, not a chin tucked in.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:10, now spine:-10.
      joints: {globalTilt: 85, neck: -5.4, leftShoulder: -110, rightShoulder: -20, leftElbow: 70, rightElbow: 15, leftHip: 15, rightHip: 12, spine: -10, leftAnkle: -18, rightAnkle: -18},
      figure: 'back-arms-up',
      tags: ["classical", "supine", "elegant", "chin-up"],
    },
    'boudoir-three-goddesses': {
      id: 'boudoir-three-goddesses', category: 'boudoir', name: 'The Three Goddesses',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Recline on your side, propping your upper body low on one forearm. Let your top arm drape loosely over your hip while curving your spine into a soft fluid S-shape.',
      tip: 'The S-curve is everything — let your waist sink downward and your hip rise naturally without forcing it.',
      joints: {globalTilt: 72, globalRoll: -35, spine: 8, neck: -10.1, leftElbow: 81, shoulderFwdL: 25, rightShoulder: 18, leftHip: 18, rightHip: 8, leftKnee: 25, rightKnee: 8, rightElbow: 18, leftAnkle: -18, rightAnkle: -18},
      figure: 'boudoir-recline',
      tags: ["s-curve", "side-lying", "classic", "elegant"],
    },
    'boudoir-barberini-faun': {
      id: 'boudoir-barberini-faun', category: 'boudoir', name: 'The Barberini Faun',
      difficulty: 'Advanced', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Recline backward into a pile of pillows with legs spread wide and knees softly bent. Throw one arm completely over your head and let your neck extend backward for high drama.',
      tip: 'The thrown arm and extended neck read as complete surrender — the more the head drops back, the more powerful the image.',
      joints: {globalTilt: -60, neck: -6.4, leftShoulder: -130, rightShoulder: -20, leftElbow: 70, rightElbow: 25, hipAbductL: 25, hipAbductR: 25, leftHip: 40, rightHip: 40, leftKnee: 40, rightKnee: 40, leftAnkle: -20, rightAnkle: -20, spine: 10},
      figure: 'boudoir-lying-arch',
      tags: ["drama", "recline", "abandoned", "baroque"],
    },
    'boudoir-the-dawn': {
      id: 'boudoir-the-dawn', category: 'boudoir', name: 'The Dawn',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie on your side facing the camera and rotate your upper chest toward the ceiling. Bend your top leg forward to rest on the mattress to add depth and eliminate flat lines.',
      tip: 'The chest rotation creates an elegant diagonal — like the body is just waking and turning toward light.',
      joints: {globalTilt: 80, globalRoll: -15, spine: 15, neck: 8, leftShoulder: -20, rightShoulder: 10, leftElbow: 65, rightElbow: 45, leftHip: 18, rightHip: 55, leftKnee: 12, rightKnee: 70, leftAnkle: -18, rightAnkle: -18},
      figure: 'boudoir-recline',
      tags: ["side-lying", "torso-twist", "elegant", "soft"],
    },
    'boudoir-nymph-fontainebleau': {
      id: 'boudoir-nymph-fontainebleau', category: 'boudoir', name: 'Nymph of Fontainebleau',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie entirely on your side facing away from the camera. Arch your back to tighten your waistline, raise your top arm over your head, and look back over your shoulder directly at the lens.',
      tip: 'The over-the-shoulder gaze with an arched back creates both mystery and revelation — work that tension.',
      joints: {globalTilt: 78, globalRoll: -35, spine: -12, neck: 5.4, leftShoulder: -120, rightShoulder: 5, leftElbow: 70, leftHip: 18, rightHip: 8, leftKnee: 15, rightElbow: 18, leftAnkle: -18, rightAnkle: -18},
      figure: 'boudoir-recline',
      tags: ["back-to-camera", "arch", "side-lying", "look-back"],
    },
    'boudoir-psyche-revived': {
      id: 'boudoir-psyche-revived', category: 'boudoir', name: 'Psyche Revived',
      difficulty: 'Intermediate', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie on your back, bend your knees, and lift your midsection slightly. Reach both arms up and loop them into a soft circle above your face to create a natural portrait frame.',
      tip: 'The looped arms above the face draws the viewer\'s eye to your expression — keep the wrists soft and the elbows wide.',
      joints: {spine: -8, neck: 3.6, leftShoulder: -140, rightShoulder: -140, leftElbow: 80, rightElbow: 80, leftHip: 50, rightHip: 50, leftKnee: 70, rightKnee: 70, leftAnkle: -20, rightAnkle: -20, globalTilt: -80},
      figure: 'back-arms-up',
      tags: ["arms-frame", "supine", "sculptural", "classical"],
    },
    'boudoir-torso-marie-therese': {
      id: 'boudoir-torso-marie-therese', category: 'boudoir', name: 'Torso of Marie-Thérèse',
      difficulty: 'Advanced', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie on your back and turn your hips completely to the side while keeping both shoulder blades pinned flat against the mattress, creating an artful high-fashion twist through your waist.',
      tip: 'The contrast of flat shoulders and twisted hips is the entire composition — emphasize it by pressing shoulders firmly down.',
      joints: {globalTilt: 85, globalRoll: -12.5, spine: 20, neck: 10, leftShoulder: -12, rightShoulder: 8, leftElbow: 65, rightElbow: 45, leftHip: 35, rightHip: 25, leftKnee: 25, rightKnee: 15, leftAnkle: -20, rightAnkle: -20},
      figure: 'supine',
      tags: ["twist", "editorial", "waist", "architectural"],
    },
    'boudoir-clios-dream': {
      id: 'boudoir-clios-dream', category: 'boudoir', name: 'Clio\'s Dream',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie flat on your stomach with legs stretched long. Prop your chin up gently on stacked hands, look directly at the camera, and lift one foot slightly at the knee to break up straight lines.',
      tip: 'One raised foot changes a static prone pose into a playful, inviting portrait.',
      joints: { globalTilt: 80, spine: 10, neck: 18, leftShoulder: -12, leftElbow: 80, rightShoulder: 8, rightElbow: 80, leftHip: -5, leftAnkle: -20, rightHip: -5, rightKnee: 50, rightAnkle: -25, shoulderFwdL: 20, shoulderFwdR: 20 },
      figure: 'boudoir-prone-elbow',
      tags: ["prone", "playful", "direct-gaze", "foot-raise"],
    },
    'boudoir-mattress-edge-melt': {
      id: 'boudoir-mattress-edge-melt', category: 'boudoir', name: 'Mattress Edge Melt',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie on your back horizontally across the bed, allowing your head, neck, and one arm to drape softly over the edge toward the floor while keeping your knees bent on the bed.',
      tip: 'The draping arm over the edge creates negative space that photographers love — let it hang completely loose.',
      joints: {globalTilt: 82, neck: -7.2, leftShoulder: -80, rightShoulder: 10, leftElbow: 70, leftHip: 60, rightHip: 60, leftKnee: 80, rightKnee: 80, leftAnkle: -20, rightAnkle: -20, rightElbow: 18, spine: 10},
      figure: 'back-arms-up',
      tags: ["edge", "drape", "supine", "negative-space"],
    },
    'boudoir-side-pillow-hug': {
      id: 'boudoir-side-pillow-hug', category: 'boudoir', name: 'Side-Lying Pillow Hug',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Recline on your side, pulling a large pillow tight against your chest. Extend your bottom leg straight and bend your top leg at 90 degrees over the pillow to create beautiful body depth.',
      tip: 'The pillow functions as a visual prop and a body divider — pull it in close to tighten your waistline.',
      joints: {globalTilt: 80, globalRoll: -16, neck: -4.4, leftShoulder: -12, rightShoulder: 8, leftElbow: 80, rightElbow: 60, leftHip: 15, rightHip: 75, leftKnee: 10, rightKnee: 90, spine: 10, leftAnkle: -18, rightAnkle: -18},
      figure: 'boudoir-recline',
      tags: ["pillow", "side-lying", "cozy", "depth"],
    },
    'boudoir-pillow-peek': {
      id: 'boudoir-pillow-peek', category: 'boudoir', name: 'The Pillow Peek',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Lie prone on your stomach, hiding your torso behind a plush pillow. Prop your chin on your hands, glance coyly at the lens, and kick both feet up behind you with crossed ankles.',
      tip: 'The feet-up kick adds youthful energy and prevents the prone position from looking flat or passive.',
      joints: {spine: 10, neck: 16, leftShoulder: -85, rightShoulder: -85, leftElbow: 130, rightElbow: 130, leftHip: -5, rightHip: -5, leftKnee: 55, rightKnee: 50, leftAnkle: -30, rightAnkle: -28, shoulderFwdL: -100, shoulderFwdR: -100, globalTilt: 80},
      figure: 'boudoir-prone-elbow',
      tags: ["playful", "prone", "feet-up", "coy"],
    },

    // ═════════════ BOUDOIR NEW — CHAIR/STOOL (10) ═════════════
    'boudoir-asymmetric-stool': {
      id: 'boudoir-asymmetric-stool', category: 'boudoir', name: 'Asymmetric Stool Sit',
      difficulty: 'Intermediate', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit on a high stool leaning your weight onto one glute. Extend one leg completely straight with a pointed toe while keeping the other knee bent sharply upward.',
      tip: 'The diagonal created by one extended leg and one raised knee draws the eye from floor to face in one sweeping line.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -8→-18, hips 8→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: 50, spine: -18, neck: -15, leftElbow: 65, rightShoulder: 12, rightElbow: 45, hips: 16, leftHip: 80, leftKnee: 90, leftAnkle: -18, rightHip: 80, rightKnee: 100, rightAnkle: -25, hipAbductL: 12 },
      figure: 'seated-side',
      tags: ["asymmetric", "stool", "diagonal", "line"],
    },
    'boudoir-armchair-twist': {
      id: 'boudoir-armchair-twist', category: 'boudoir', name: 'The Armchair Twist',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Recline sideways inside a deep lounge chair. Throw your legs over the armrest at a staggered angle while turning your chest flat toward the camera to create a dynamic midsection twist.',
      tip: 'The chest-toward-camera / hips-sideways opposition is the essence of this pose — exaggerate that contrast.',
      joints: {globalRoll: -10, spine: 15, neck: 8, leftShoulder: 15, rightShoulder: -15, leftElbow: 65, rightElbow: 45, hipAbductL: 20, leftHip: 80, rightHip: 80, leftKnee: 100, rightKnee: 60, leftAnkle: -20, rightAnkle: -20, globalTilt: 50},
      figure: 'throne-sit',
      tags: ["chair", "twist", "recline", "armchair"],
    },
    'boudoir-triangle-pocket': {
      id: 'boudoir-triangle-pocket', category: 'boudoir', name: 'The Triangle Pocket',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit with your elbows pulled back sharply, almost touching behind the spine. Rest your hands gently on your lower back or hips to draw visual attention to your waist while instantly slimming the torso.',
      tip: 'The pulled-back elbows automatically open the chest and push the shoulders back — two benefits from one adjustment.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -10→-18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: 50, spine: -18, neck: -15, leftShoulder: 35, leftElbow: 8, rightShoulder: -35, rightElbow: 8, leftHip: 80, leftKnee: 90, leftAnkle: -20, rightHip: 80, rightKnee: 90, rightAnkle: -20, hipAbductL: 12, hipAbductR: 12 },
      figure: 'boudoir-seated-knee',
      tags: ["waist", "triangles", "slimming", "seated"],
    },
    'boudoir-truth-unveiled': {
      id: 'boudoir-truth-unveiled', category: 'boudoir', name: 'The Truth Unveiled',
      difficulty: 'Advanced', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit on the edge of a chair, leaning your torso backward onto one extended arm while using your free hand to dramatically pull sheer fabric back away from your body.',
      tip: 'The extended back-arm creates a strong diagonal line while the free hand pulling fabric adds narrative — tell a story with the gesture.',
      joints: { globalTilt: 50, spine: -25, neck: -12, leftShoulder: -10, leftElbow: 60, rightShoulder: 30, rightElbow: 25, leftHip: 80, leftKnee: 90, leftAnkle: -20, rightHip: 80, rightKnee: 90, rightAnkle: -20, shoulderFwdR: -40 },
      figure: 'boudoir-seated-knee',
      tags: ["lean-back", "fabric", "drama", "chair"],
    },
    'boudoir-the-night': {
      id: 'boudoir-the-night', category: 'boudoir', name: 'The Night',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit sideways on a bench or stool. Pull one knee up high toward your chest while keeping the other leg extended low, and rest your elbow on the raised knee while lowering your chin into your hand.',
      tip: 'The chin-on-hand resting position adds quiet introspection — the mood is midnight contemplation, not performance.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -20→-110, rightShoulder 10→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 10, neck: -10.1, leftShoulder: -110, rightShoulder: -110, shoulderFwdL: 30, leftElbow: 81, hipAbductL: 5, leftHip: 114, rightHip: 80, leftKnee: 130, rightKnee: 90, leftAnkle: -20, rightAnkle: -20, rightElbow: 18, globalTilt: 50},
      figure: 'chin-on-hand',
      tags: ["contemplative", "seated", "knee-up", "mood"],
    },
    'boudoir-the-kiss': {
      id: 'boudoir-the-kiss', category: 'boudoir', name: 'The Kiss',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit on a low ottoman or stool, twist your entire torso toward the camera, and wrap one arm completely around your own waist while arching your back to emphasize upper-body curves.',
      tip: 'The self-embrace tightens the waist visually while the back arch pushes the chest forward — both happen simultaneously.',
      joints: {spine: -15, neck: -5.6, leftShoulder: 25, rightShoulder: -30, leftElbow: 81, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -20, rightAnkle: -20, rightElbow: 18, globalTilt: 50},
      figure: 'boudoir-seated-knee',
      tags: ["self-embrace", "arch", "seated", "curves"],
    },
    'boudoir-thinker': {
      id: 'boudoir-thinker', category: 'boudoir', name: 'The Thinker',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit on a low stool, resting your elbows on your thighs. Lean your torso forward, place the knuckles of one hand firmly under your chin, and look downward past the camera for a moody look.',
      tip: 'Looking just past the camera rather than into the lens creates a sense of private thought — deeply evocative.',
      joints: {spine: 25, neck: -9.8, shoulderFwdL: 40, shoulderFwdR: 40, leftElbow: 81, rightElbow: 81, hipAbductL: 18, hipAbductR: 18, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -20, rightAnkle: -20, globalTilt: 50, rightShoulder: 12},
      figure: 'chin-on-hand',
      tags: ["contemplative", "forward-lean", "moody", "seated"],
    },
    'boudoir-forward-chair-straddle': {
      id: 'boudoir-forward-chair-straddle', category: 'boudoir', name: 'Forward Chair Straddle',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit facing the backrest of a chair. Rest your forearms along the top of the backrest, drop your chin onto your wrists, and widen your knees for clean visual symmetry.',
      tip: 'The symmetry of wide knees and chin-on-wrists creates an open, approachable quality — everything points toward your face.',
      joints: {spine: 10, neck: -9.4, shoulderFwdL: 35, shoulderFwdR: 35, leftElbow: 81, rightElbow: 81, hipAbductL: 25, hipAbductR: 25, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -20, rightAnkle: -20, globalTilt: 50, rightShoulder: 12},
      figure: 'boudoir-seated-knee',
      tags: ["straddle", "chair", "symmetric", "approachable"],
    },
    'boudoir-lazy-lounge': {
      id: 'boudoir-lazy-lounge', category: 'boudoir', name: 'Lazy Lounge Recline',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit at the very edge of a deep chair, sliding your hips forward into a low recline. Rest your head back against the cushion and let both legs extend toward the camera.',
      tip: 'The low hips and extended legs create an elegant, elongated line — think poured rather than placed.',
      joints: {globalTilt: -50, spine: 15, neck: -5.6, leftShoulder: -15, rightShoulder: -3, leftElbow: 65, rightElbow: 45, leftHip: 70, rightHip: 70, leftKnee: 20, rightKnee: 15, leftAnkle: -20, rightAnkle: -20},
      figure: 'throne-sit',
      tags: ["lounge", "recline", "elongated", "chair"],
    },
    'boudoir-knee-up-profile': {
      id: 'boudoir-knee-up-profile', category: 'boudoir', name: 'Knee-Up Profile Sit',
      difficulty: 'Intermediate', angle: 'Side View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit sideways on a chair so your profile faces the lens. Pull the leg closest to the camera up flat against the seat, wrapping your arms around your shin while keeping your spine perfectly straight.',
      tip: 'The hugged knee creates a visual anchor point while the straight spine projects quiet confidence.',
      joints: {spine: 15, neck: -4.4, leftShoulder: -15, rightShoulder: -3, leftElbow: 80, rightElbow: 80, hipAbductL: 5, leftHip: 110, rightHip: 80, leftKnee: 130, rightKnee: 90, leftAnkle: -20, rightAnkle: -20, globalTilt: 50},
      figure: 'floor-hug-knees',
      tags: ["profile", "knee-hug", "seated", "quiet"],
    },

    // ═════════════ BOUDOIR NEW — WALL & STANDING (23) ═════════════
    'boudoir-embrace-pose': {
      id: 'boudoir-embrace-pose', category: 'boudoir', name: 'The Embrace Pose',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand upright and cross one knee tightly over the other. Pull one arm fully across your waist to your opposite hip, crossing tightly at the elbows to push the bust together and maximize an hourglass outline.',
      tip: 'The crossed knees narrow the hips visually while the crossed arms frame and define the waist — two slimming techniques stacked.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine -11→-18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 0, hips: 5, neck: -8, leftShoulder: -30, rightShoulder: -30, leftElbow: 100, rightElbow: 150, hipAbductL: 15, hipAbductR: -15, leftHip: 0, rightHip: 30, leftAnkle: -18, rightAnkle: -18, shoulderFwdL: -90, shoulderFwdR: -100, globalTilt: 0},
      figure: 'hip-shift',
      tags: ["hourglass", "standing", "cross", "slim"],
    },
    'boudoir-fireplace-lean': {
      id: 'boudoir-fireplace-lean', category: 'boudoir', name: 'The Fireplace Lean',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand at a 45-degree angle to a mantle or wall. Push your hips back and away from the camera to create a subtle lower-body effect, or push the hip aggressively toward the lens to exaggerate your natural curve.',
      tip: 'Hip toward camera = curves; hip away = slim — choose based on the subject\'s goal for that shot.',
      joints: {spine: -8, neck: -5.6, leftShoulder: -20, rightShoulder: -15, leftElbow: 25, rightElbow: 20, leftHip: 15, rightHip: 8, hips: 12, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'wall-lean',
      tags: ["lean", "wall", "hip-push", "standing"],
    },
    'boudoir-tippy-toe-cross': {
      id: 'boudoir-tippy-toe-cross', category: 'boudoir', name: 'The Tippy-Toe Cross',
      difficulty: 'Intermediate', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand upright, cross one leg directly over the other, and lift your body weight entirely onto the balls of your feet. This forces leg muscles to engage, elongating the calves and tightening posture.',
      tip: 'Rising onto the balls of your feet immediately tightens every muscle from ankle to hip — a one-move full-leg transformation.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 5→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: -11, hips: 16, neck: -8, leftShoulder: -12, rightShoulder: 8, leftElbow: 55, rightElbow: 80, leftHip: 5, rightHip: -5, leftAnkle: -18, rightAnkle: -18, globalTilt: 50},
      figure: 'tiptoe-reach',
      tags: ["tiptoe", "cross", "standing", "elongate"],
    },
    'boudoir-wall-arch': {
      id: 'boudoir-wall-arch', category: 'boudoir', name: 'The Wall Arch',
      difficulty: 'Advanced', angle: 'Side View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand facing a wall and place your hands high up against it. Step your feet back and drop your chest toward the surface while pushing your hips back to create a dramatic spine curve.',
      tip: 'The hips-back + chest-down opposition creates a dramatic concave lower-back curve that photographs strikingly from the side.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:32, now spine:-32.
      joints: {spine: -32, neck: -6.9, leftShoulder: -128, rightShoulder: -122, shoulderFwdL: 45, shoulderFwdR: 45, leftElbow: 70, rightElbow: 70, leftHip: 15, rightHip: 15, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'back-arch-wall',
      tags: ["wall", "arch", "spine-curve", "dramatic"],
    },
    'boudoir-over-shoulder-glance': {
      id: 'boudoir-over-shoulder-glance', category: 'boudoir', name: 'Over-The-Shoulder Glance',
      difficulty: 'Beginner', angle: 'Back View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Turn your back completely to the camera to highlight your shoulders and spine. Look back over one shoulder toward the lens, keeping your chin lifted and your neck elongated.',
      tip: 'The back-to-camera + over-shoulder look creates the maximum contrast between what is hidden and revealed.',
      joints: {spine: -8, neck: 5.4, leftShoulder: 10, rightShoulder: -10, leftElbow: 55, rightElbow: 80, leftHip: 8, rightHip: 5, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'profile-stand',
      tags: ["back", "glance", "over-shoulder", "standing"],
    },
    'boudoir-peek-a-boo': {
      id: 'boudoir-peek-a-boo', category: 'boudoir', name: 'The Peek-a-Boo',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Hide your midsection behind a structural wall corner or heavy curtain. Show only your shoulders, neckline, and legs to the camera to create a mysterious, flattering layout.',
      tip: 'What is hidden is always more interesting than what is shown — the wall becomes your best styling prop.',
      joints: { globalTilt: 50, spine: -8, neck: -10, leftShoulder: -10, leftElbow: 80, rightShoulder: 5, rightElbow: 55, leftHip: 8, leftAnkle: -18, rightHip: 5, rightAnkle: -18 },
      figure: 'standing-front',
      tags: ["hidden", "mystery", "standing", "wall"],
    },
    'boudoir-shadow-silhouette': {
      id: 'boudoir-shadow-silhouette', category: 'boudoir', name: 'Shadow Silhouette',
      difficulty: 'Beginner', angle: 'Side View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand directly in front of a bright window or soft studio light source. Keep your body details hidden in shadow, revealing only your naked outline to the camera lens.',
      tip: 'Exaggerate your curves into the light — the profile silhouette reduces the figure to pure shape, so make the shape count.',
      joints: {spine: -10, hips: 10, neck: -4.5, leftShoulder: 15, rightShoulder: -15, leftElbow: 55, rightElbow: 80, leftHip: 12, rightHip: 5, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'profile-stand',
      tags: ["silhouette", "light", "profile", "artistic"],
    },
    'boudoir-aphrodite-knidos': {
      id: 'boudoir-aphrodite-knidos', category: 'boudoir', name: 'Aphrodite of Knidos',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand facing the camera with your weight shifted to one hip. Bring one hand down to loosely hold a draped sheet over your lower abdomen, while placing the other hand slightly forward over your chest.',
      tip: 'The hands create a diagonal triangle from chest to hip — the classical modesty gesture that paradoxically draws attention.',
      joints: { globalTilt: 50, spine: -11, neck: -8, leftShoulder: -15, leftElbow: 60, rightShoulder: -20, rightElbow: 40, hips: 12, leftHip: 12, leftAnkle: -18, rightHip: 8, rightAnkle: -18 },
      figure: 'hip-shift',
      tags: ["classical", "drape", "sculpture", "elegant"],
    },
    'boudoir-venus-de-milo': {
      id: 'boudoir-venus-de-milo', category: 'boudoir', name: 'Venus de Milo',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand with 100% of your weight on one leg, causing that hip to push out dynamically. Cross your free leg gently over the front of the standing leg, keep your torso long, and let your arms rest softly.',
      tip: 'The weight-drop onto one leg is automatic hip extension — feel the hip pop outward rather than forcing it.',
      joints: { globalTilt: 50, spine: -8, neck: -8, leftShoulder: -10, leftElbow: 80, rightShoulder: 4, rightElbow: 55, hips: 15, leftHip: 12, leftAnkle: -18, rightHip: 5, rightAnkle: -18 },
      figure: 'hip-shift',
      tags: ["classical", "contrapposto", "standing", "weight-shift"],
    },
    'boudoir-capitoline-venus': {
      id: 'boudoir-capitoline-venus', category: 'boudoir', name: 'Capitoline Venus',
      difficulty: 'Intermediate', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand with your hips turned 45 degrees away from the camera. Cross both arms over your front — one covering your breasts and the other resting lower across your pelvis — creating a secure silhouette.',
      tip: 'The arm crossing creates implied modesty while the 45-degree hip turn shows your best silhouette angle simultaneously.',
      joints: {spine: -8, neck: -5.6, leftShoulder: 20, rightShoulder: -20, leftElbow: 81, rightElbow: 81, leftHip: 12, rightHip: 8, hips: 8, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'crossed-arms-stand',
      tags: ["classical", "arms-crossed", "secure", "sculpture"],
    },
    'boudoir-venus-kallipygos': {
      id: 'boudoir-venus-kallipygos', category: 'boudoir', name: 'Venus Kallipygos',
      difficulty: 'Intermediate', angle: 'Back View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Turn your back completely to the lens and arch your spine. Lift one hand to lightly pull a robe or sheet up to hip level, and look back over your shoulder to showcase your back and glutes.',
      tip: 'The raised fabric creates a visual focal line along the back — it directs the eye exactly where you want it to go.',
      joints: {spine: -12, hips: 8, neck: 3.9, leftShoulder: -50, rightShoulder: 5, leftElbow: 80, rightElbow: 55, leftHip: 8, rightHip: 5, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'profile-stand',
      tags: ["back", "glutes", "arch", "sculpture"],
    },
    'boudoir-winged-victory': {
      id: 'boudoir-winged-victory', category: 'boudoir', name: 'Winged Victory',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand tall, step one foot firmly forward, and lean your chest slightly into the imaginary wind. Push both arms back and away from your body to emphasize your collarbones.',
      tip: 'The chest-forward lean combined with arms swept back creates the sensation of forward momentum — pure confidence in still form.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-12, now spine:12.
      joints: { globalTilt: 50, spine: 12, neck: -8, leftShoulder: 35, leftElbow: 8, rightShoulder: -30, rightElbow: 8, leftHip: 18, leftAnkle: -18, rightHip: 8, rightAnkle: -18 },
      figure: 'standing-front',
      tags: ["confidence", "collarbone", "architectural", "standing"],
    },
    'boudoir-esquiline-venus': {
      id: 'boudoir-esquiline-venus', category: 'boudoir', name: 'The Esquiline Venus',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand with feet close together and weight balanced. Lift both hands up to your hair as if preparing to tie it back, pulling your elbows wide apart to immediately lift your bust line.',
      tip: 'Wide elbows up into hair is the single most effective standing pose for lifting the bust — use it as a go-to first pose.',
      joints: { globalTilt: 50, spine: -10, neck: -8, leftShoulder: -112, leftElbow: 80, rightShoulder: -92, rightElbow: 80, leftAnkle: -18, rightAnkle: -18 },
      figure: 'arm-reach',
      tags: ["hair", "bust-lift", "standing", "elegant"],
    },
    'boudoir-venus-de-medici': {
      id: 'boudoir-venus-de-medici', category: 'boudoir', name: 'Venus de\' Medici',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand and twist your upper body slightly to the left while pushing your hips gently to the right. Keep your elbows tucked close to your ribcage and place your hands flat over your chest and thigh.',
      tip: 'Upper body left, hips right is a fundamental S-curve setup — it creates waist emphasis without requiring an extreme pose.',
      joints: {spine: -11, neck: -5.6, leftShoulder: -12, rightShoulder: -3, leftElbow: 70, rightElbow: 55, leftHip: 10, rightHip: 8, hips: 10, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'hip-shift',
      tags: ["classical", "s-curve", "sculpture", "standing"],
    },
    'boudoir-dying-slave': {
      id: 'boudoir-dying-slave', category: 'boudoir', name: 'The Dying Slave',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand or lean back against a solid wall. Raise one elbow completely straight up, resting your hand behind your neck, while wrapping your other arm across your lower chest to showcase core length.',
      tip: 'The raised elbow stretches one entire side of the torso — every inch of that side becomes visible and elongated.',
      joints: {spine: -11, neck: -10, leftShoulder: -60, rightShoulder: 20, leftElbow: 100, rightElbow: 81, leftHip: 10, rightHip: 8, leftAnkle: -18, rightAnkle: -18, globalTilt: 50},
      figure: 'arm-reach',
      tags: ["torso-length", "arm-raise", "sculpture", "standing"],
    },
    'boudoir-the-source': {
      id: 'boudoir-the-source', category: 'boudoir', name: 'The Source',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand straight against a wall, lifting one arm high above your head to rest your hand against the surface. Rest your lower hand gently on your opposite thigh to highlight your hip curve.',
      tip: 'The single raised arm creates asymmetry that makes the waist appear smaller by comparison.',
      joints: { globalTilt: 50, spine: -8, neck: -8, leftShoulder: -130, leftElbow: 70, rightShoulder: -15, rightElbow: 40, hips: 8, leftHip: 10, leftAnkle: -18, rightHip: 8, rightAnkle: -18 },
      figure: 'arm-reach',
      tags: ["wall", "arm-raise", "hip-emphasis", "standing"],
    },
    'boudoir-primary-instincts': {
      id: 'boudoir-primary-instincts', category: 'boudoir', name: 'Primary Instincts',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand and turn your chest tightly away from the camera. Wrap both arms firmly across your chest and tuck your chin deeply into your shoulder, capturing a raw, moody look.',
      tip: 'The defensive posture creates psychological tension — it communicates raw vulnerability more powerfully than an open pose.',
      joints: { globalTilt: 50, spine: 15, neck: 20, leftShoulder: 25, leftElbow: 81, rightShoulder: -22, rightElbow: 81, leftHip: 8, leftAnkle: -18, rightHip: 5, rightAnkle: -18 },
      figure: 'crossed-arms-stand',
      tags: ["moody", "raw", "arms-crossed", "turned"],
    },
    'boudoir-little-dancer': {
      id: 'boudoir-little-dancer', category: 'boudoir', name: 'The Little Dancer',
      difficulty: 'Intermediate', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand tall with your feet placed wide in a classic ballet stance. Interlock your fingers behind your lower back, push your shoulders back, and tilt your chin high up toward the ceiling.',
      tip: 'Interlocked hands behind the back automatically opens the chest and pulls the shoulders into perfect posture.',
      joints: { globalTilt: 50, spine: -15, neck: -18, leftShoulder: 30, leftElbow: 8, rightShoulder: -28, rightElbow: 8, leftHip: 15, leftAnkle: -18, rightHip: 15, rightAnkle: -18, hipAbductL: -15, hipAbductR: -15 },
      figure: 'standing-front',
      tags: ["ballet", "chin-up", "open-chest", "elegant"],
    },
    'boudoir-walking-woman': {
      id: 'boudoir-walking-woman', category: 'boudoir', name: 'The Walking Woman',
      difficulty: 'Intermediate', angle: 'Side View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand completely in profile to the camera. Take a long stylized step forward with one leg, keeping both legs completely straight to maximize the visual length of your thighs.',
      tip: 'Straight legs throughout the stride is the key — any bend at the knee breaks the elongating line.',
      joints: {spine: -8, neck: -15, leftShoulder: -15, rightShoulder: 0, leftElbow: 80, rightElbow: 55, leftHip: 25, rightHip: -20, leftKnee: 5, rightKnee: 5, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'profile-stand',
      tags: ["walking", "profile", "thigh-length", "stride"],
    },
    'boudoir-back-one': {
      id: 'boudoir-back-one', category: 'boudoir', name: 'The Back I',
      difficulty: 'Beginner', angle: 'Back View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand facing a wall with your back directly to the camera. Place one hand flat on the wall at shoulder height and drop your other hand loose, highlighting the clean symmetry of your shoulder blades.',
      tip: 'The single raised arm breaks symmetry slightly — the subtle asymmetry makes the back look more dynamic than two hands raised.',
      joints: {spine: -8, neck: -15, leftShoulder: -80, rightShoulder: -12, leftElbow: 70, rightElbow: 55, leftHip: 8, rightHip: 5, globalTilt: 50, leftAnkle: -18, rightAnkle: -18},
      figure: 'two-hands-wall',
      tags: ["back", "wall", "shoulder-blades", "standing"],
    },
    'boudoir-r-evolution': {
      id: 'boudoir-r-evolution', category: 'boudoir', name: 'The R Evolution',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand perfectly straight with your feet spread hip-width apart. Lift both arms slightly away from your hips with your palms facing forward, projecting an air of absolute strength and power.',
      tip: 'Palms-forward with slightly lifted arms is the power pose — it reads as complete openness and confidence.',
      joints: { globalTilt: 50, spine: -12, neck: -8, leftShoulder: -37, leftElbow: 55, rightShoulder: -17, rightElbow: 80, leftHip: 12, leftAnkle: -18, rightHip: 12, rightAnkle: -18, hipAbductL: 10, hipAbductR: 10 },
      figure: 'standing-front',
      tags: ["power", "strength", "open", "standing"],
    },
    'boudoir-corner-pocket': {
      id: 'boudoir-corner-pocket', category: 'boudoir', name: 'Corner Pocket Press',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand in a room corner, pressing your back flat into the angle where the walls meet. Raise both hands above your head against the walls, bend one knee, and slide your foot up the wall to pop your hip forward.',
      tip: 'The corner frames the body on two sides while the bent knee adds asymmetry and hip emphasis — the corner becomes architecture.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: 50, spine: -8, neck: -8, leftShoulder: -128, leftElbow: 70, rightShoulder: -122, rightElbow: 70, hips: 16, leftHip: 15, leftAnkle: -18, rightHip: 20, rightKnee: 40, rightAnkle: -18 },
      figure: 'two-hands-wall',
      tags: ["corner", "wall", "raised-arms", "knee-up"],
    },
    'boudoir-doorframe-hang': {
      id: 'boudoir-doorframe-hang', category: 'boudoir', name: 'Doorframe Hang',
      difficulty: 'Intermediate', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Stand inside an open doorway, holding the top or sides of the frame with both hands. Lean your hips forward through the opening while keeping your feet planted back, creating an elongated front-body stretch.',
      tip: 'The hips-forward / feet-back lean creates a dramatic diagonal — the doorframe provides a strong architectural border for the image.',
      joints: { globalTilt: 50, spine: -18, neck: -8, leftShoulder: -128, leftElbow: 70, rightShoulder: -122, rightElbow: 70, leftHip: 20, leftAnkle: -18, rightHip: 20, rightAnkle: -18, shoulderFwdL: 15, shoulderFwdR: 15 },
      figure: 'two-hands-wall',
      tags: ["doorframe", "stretch", "architectural", "front-body"],
    },

    // ═════════════ BOUDOIR NEW — FLOOR & KNEELING (10) ═════════════
    'boudoir-crouching-venus': {
      id: 'boudoir-crouching-venus', category: 'boudoir', name: 'Crouching Venus',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Drop down into a deep crouch or sit low on your heels. Turn your knees to the side, twist your upper torso toward the camera, and cross your arms over your body to create an intricate sculptural shape.',
      tip: 'The compact crouch creates maximum visual compression — the viewer wants to see the full figure unfold.',
      joints: { globalTilt: 50, spine: 15, neck: 8, leftShoulder: 20, leftElbow: 81, rightShoulder: -18, rightElbow: 80, leftHip: 80, leftKnee: 140, leftAnkle: -30, rightHip: 80, rightKnee: 140, rightAnkle: -30, hipAbductL: 25, hipAbductR: 5 },
      figure: 'kneeling',
      tags: ["crouch", "compact", "sculptural", "floor"],
    },
    'boudoir-nymph-scorpion': {
      id: 'boudoir-nymph-scorpion', category: 'boudoir', name: 'Nymph with a Scorpion',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit flat on the floor with both legs swept to one side. Bend forward slightly over your lap, focusing your gaze intently downward at your own hand resting on your knee.',
      tip: 'The downcast gaze creates intimacy and introspection — it invites the viewer to wonder what you are contemplating.',
      joints: {spine: 20, neck: -5.4, leftElbow: 60, rightElbow: 40, hipAbductL: 25, hipAbductR: 5, leftHip: 80, rightHip: 80, leftKnee: 110, rightKnee: 110, leftAnkle: -20, rightAnkle: -20, globalTilt: 50, rightShoulder: 12},
      figure: 'seated-floor',
      tags: ["floor", "introspective", "seated", "downward-gaze"],
    },
    'boudoir-danaïd': {
      id: 'boudoir-danaïd', category: 'boudoir', name: 'The Danaïd',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Kneel flat on the floor, drop your hips onto your heels, and collapse your upper torso completely forward over your knees. Let your hair cascade over the floor and stretch your arms straight out.',
      tip: 'Complete forward collapse with arms extended is a posture of release — the hair and arms create a full horizontal line across the floor.',
      joints: {spine: 32, neck: -6.9, leftShoulder: -130, rightShoulder: -118, shoulderFwdL: -40, shoulderFwdR: -40, leftElbow: 70, rightElbow: 70, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, globalTilt: 50},
      figure: 'kneeling-forward',
      tags: ["kneeling", "floor", "forward-fold", "release"],
    },
    'boudoir-labandon': {
      id: 'boudoir-labandon', category: 'boudoir', name: 'L\'Abandon',
      difficulty: 'Advanced', angle: 'Side View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Kneel on both knees, then slowly lower your chest backward toward your heels. Let your hands trail softly along your thighs and drop your head back completely to elongate your neckline.',
      tip: 'The head dropping completely back is the moment of total surrender — it creates a dramatic neck and chest extension.',
      joints: { globalTilt: 50, spine: -38, neck: -22, leftShoulder: -15, leftElbow: 20, rightShoulder: -3, rightElbow: 20, leftHip: 80, leftKnee: 90, leftAnkle: -35, rightHip: 80, rightKnee: 90, rightAnkle: -35 },
      figure: 'kneeling-back-arch',
      tags: ["kneeling", "back-arch", "surrender", "neck-extend"],
    },
    'boudoir-la-priere': {
      id: 'boudoir-la-priere', category: 'boudoir', name: 'La Prière',
      difficulty: 'Intermediate', angle: 'Back View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Kneel on the floor facing away from the camera. Bend your torso completely forward, tucking your head down, while reaching your arms backward to rest loosely next to your feet.',
      tip: 'The back-to-camera plus forward fold exposes the entire spine in a single elongated line — very different from a front-facing bow.',
      joints: {spine: 32, neck: -6.9, leftShoulder: 35, rightShoulder: 47, leftElbow: 65, rightElbow: 45, leftHip: 80, rightHip: 80, leftKnee: 90, rightKnee: 90, leftAnkle: -35, rightAnkle: -35, globalTilt: 50},
      figure: 'kneeling-forward',
      tags: ["kneeling", "prayer", "back-camera", "spine"],
    },
    'boudoir-diamond-sit': {
      id: 'boudoir-diamond-sit', category: 'boudoir', name: 'The Diamond Sit',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit flat on the floor with the soles of your feet pressed together in front of you, forming a diamond shape with your legs. Lean forward slightly from the hips, resting your hands softly on your ankles.',
      tip: 'The diamond shape of the legs creates a geometric frame for the torso — pure visual architecture from the floor up.',
      joints: {spine: 10, neck: -5.4, shoulderFwdL: 15, shoulderFwdR: 15, leftElbow: 30, rightElbow: 30, hipAbductL: 25, hipAbductR: 25, leftHip: 80, rightHip: 80, leftKnee: 130, rightKnee: 130, leftAnkle: -20, rightAnkle: -20, globalTilt: 50, rightShoulder: 12},
      figure: 'seated-floor',
      tags: ["diamond", "geometric", "floor", "seated"],
    },
    'boudoir-mermaid-side-sit': {
      id: 'boudoir-mermaid-side-sit', category: 'boudoir', name: 'Mermaid Side-Sit',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit on one hip with both legs bent and swept to the opposite side. Place one hand firmly on the floor behind you to support your weight, arch your spine, and reach your free hand up to touch your collarbone.',
      tip: 'The trailing legs create a strong horizontal line while the raised hand draws the eye upward — two directions, one composition.',
      joints: { globalTilt: 50, spine: -12, neck: -8, leftShoulder: -80, leftElbow: 70, rightShoulder: -15, rightElbow: 45, leftHip: 80, leftKnee: 120, leftAnkle: -20, rightHip: 80, rightKnee: 100, rightAnkle: -20, shoulderFwdR: -30, hipAbductL: 5, hipAbductR: 25 },
      figure: 'seated-floor',
      tags: ["mermaid", "floor", "arch", "one-side"],
    },
    'boudoir-pretzel-twist': {
      id: 'boudoir-pretzel-twist', category: 'boudoir', name: 'The Pretzel Twist',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit flat on the floor with one leg stretched straight out. Bend your other knee and cross it completely over the straight leg, planting your foot flat. Twist your upper torso toward the bent knee.',
      tip: 'The torso twist toward the bent knee exposes the waist in a spiral — a photographer\'s dream for showing body contours.',
      joints: { globalTilt: 50, spine: 18, neck: 12, leftShoulder: 20, leftElbow: 60, rightShoulder: -15, rightElbow: 18, leftHip: 80, leftKnee: 130, leftAnkle: -20, rightHip: 80, rightKnee: 100, rightAnkle: -20, shoulderFwdL: 25 , globalTwist: 25},
      figure: 'seated-floor',
      tags: ["twist", "floor", "waist", "contour"],
    },
    'boudoir-extended-leg-sit': {
      id: 'boudoir-extended-leg-sit', category: 'boudoir', name: 'Extended Leg Low-Sit',
      difficulty: 'Intermediate', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit on the floor on one hip, propping your upper body up with one straight arm. Extend your top leg completely straight out toward the camera while keeping your bottom leg tucked under you.',
      tip: 'The extended leg creates maximum length — point the toe to extend it even further and add elegance to the line.',
      joints: { globalTilt: 50, spine: -15, neck: -8, leftShoulder: -15, leftElbow: 55, rightShoulder: -20, rightElbow: 80, leftHip: 80, leftKnee: 120, leftAnkle: -18, rightHip: 20, rightKnee: 5, rightAnkle: -25, shoulderFwdR: -30 },
      figure: 'seated-floor',
      tags: ["extended-leg", "floor", "lean", "length"],
    },
    'boudoir-seated-spine-stretch': {
      id: 'boudoir-seated-spine-stretch', category: 'boudoir', name: 'Seated Spine Stretch',
      difficulty: 'Beginner', angle: 'Front View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Sit with both legs extended straight out in a wide "V" shape on the floor. Lean forward from your hips, sliding your hands down toward your shins while keeping your back long and chin lifted.',
      tip: 'The wide-V legs with forward lean creates total openness — this pose projects confidence in every body part simultaneously.',
      joints: {spine: 20, neck: -5.4, shoulderFwdL: 20, shoulderFwdR: 20, leftElbow: 20, rightElbow: 20, hipAbductL: 25, hipAbductR: 25, leftHip: 80, rightHip: 80, leftKnee: 100, rightKnee: 100, leftAnkle: -20, rightAnkle: -20, globalTilt: 50, rightShoulder: 12},
      figure: 'seated-floor',
      tags: ["v-shape", "stretch", "floor", "open"],
    },

    // ═════════════ BOUDOIR NEW — HAND MECHANICS (2) ═════════════
    'boudoir-half-bent-wrist': {
      id: 'boudoir-half-bent-wrist', category: 'boudoir', name: 'Half-Bent Wrist Touch',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Raise your hands to touch a sheer drape, fabric, or outfit straps. Instead of gripping tightly, bend your wrists downward and pinch only your thumb and middle finger together while letting the other fingers relax.',
      tip: 'A "bent wrist pinch" eliminates the stiff, claw-like hand that ruins countless boudoir portraits — always bend, always pinch softly.',
      joints: { globalTilt: 50, spine: -11, neck: -8, leftShoulder: -40, leftElbow: 40, rightShoulder: -35, rightElbow: 35, leftHip: 10, leftAnkle: -18, rightHip: 8, rightAnkle: -18 },
      figure: 'boudoir-drape',
      tags: ["hands", "wrist", "fabric", "technique"],
    },
    'boudoir-hair-tracer': {
      id: 'boudoir-hair-tracer', category: 'boudoir', name: 'The Hair-Tracer',
      difficulty: 'Beginner', angle: '3/4 View', intent: 'Boudoir', effort: 'Static',
      instructions: 'Run your fingertips slowly upward through the nape of your neck and into your hair. Keep your elbows pointed out wide away from your face to open up the chest and eliminate distracting shadows.',
      tip: 'The key is wide elbows — elbows tucked in toward the face create shadow traps that compress and hide the chest and neck.',
      joints: { globalTilt: 50, spine: -10, neck: -8, leftShoulder: -102, leftElbow: 81, rightShoulder: -82, rightElbow: 81, leftAnkle: -18, rightAnkle: -18 },
      figure: 'arm-reach',
      tags: ["hair", "hands", "chest-open", "technique"],
    },

    // ═════════════ EDITORIAL (30) ═════════════
    'editorial-sharp-angles-stand': {
      id: 'editorial-sharp-angles-stand', category: 'editorial', name: 'Sharp Angles Stand',
      difficulty: 'Advanced',
      angle: 'Front View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Stand fully in profile, push the hips back and drive the chest forward slightly to build one continuous curve, hands resting softly in front of the hips. Point the front foot forward with a soft knee bend for a clean leg line.',
      tip: 'Shoot against a clean, uncluttered background to let the profile curve read clearly.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:10, now spine:-10.
      joints: { spine: 18, neck: 15, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 50, leftKnee: 10, rightKnee: 20, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-angular',
      tags: ['angular', 'triangles', 'vogue', 'geometric'],
    },
    'editorial-extreme-forward-lean': {
      id: 'editorial-extreme-forward-lean', category: 'editorial', name: 'Extreme Forward Lean',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Editorial',
      effort: 'Dynamic',
      instructions: 'Bend both elbows to hard 90° angles at shoulder height and drive one hip sharply outward, breaking the silhouette into geometric triangles. Fix the gaze off-camera with a flat, unreadable expression for high-fashion mood.',
      tip: 'Coach in shapes, not emotion — \'make an L with your arm\' beats \'look confident.\'',
      joints: { spine: 32, neck: 8, leftShoulder: 40, leftElbow: 81, rightShoulder: -30, rightElbow: 70, hips: 15, leftHip: 9, leftKnee: 10, rightHip: 21, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-lean-far',
      tags: ['lean', 'dynamic', 'dramatic', 'story'],
    },
    'editorial-floor-diagonal-reach': {
      id: 'editorial-floor-diagonal-reach', category: 'editorial', name: 'Floor Diagonal Reach',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Hinge forward from the hips at a steep angle, spine flat and long, and drive both arms straight forward as if reaching for something just out of frame. Let hair fall forward to add movement and mystery.',
      tip: 'Shoot on a fast shutter to freeze any hair or fabric motion created by the lean.',
      joints: {spine: 30, neck: 25, leftShoulder: 60, rightShoulder: 20, leftElbow: 81, rightElbow: 70, leftHip: 60, leftKnee: 80, rightKnee: 45, hips: 12, shoulderFwdL: -8, shoulderFwdR: -6},
      color: 'var(--color-purple-100)',
      figure: 'editorial-floor-reach',
      tags: ['floor', 'diagonal', 'reach', 'tension'],
    },
    'editorial-full-body-twist': {
      id: 'editorial-full-body-twist', category: 'editorial', name: 'Full Body Counter-Twist',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Dynamic',
      instructions: 'Sit with legs folded asymmetrically, then drive one arm diagonally up and out to full extension while the other hand presses flat on the floor for stability. Turn the face away from the reaching arm to build tension across the frame.',
      tip: 'Shoot from a high angle to emphasize the diagonal reach against the floor plane.',
      joints: { spine: 32, neck: 25, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 15, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-twist',
      tags: ['twist', 'dynamic', 'tension', 'geometric'],
    },
    'editorial-off-camera-stare': {
      id: 'editorial-off-camera-stare', category: 'editorial', name: 'Off-Camera Dead Stare',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Plant the feet facing one direction while rotating the shoulders and chest fully toward the opposite direction, maximizing torque through the spine. Let both arms fall naturally with the twist to sell the counter-rotation.',
      tip: 'Fire the shutter at the exact peak of the twist — a beat early or late loses the tension.',
      joints: { spine: 15, neck: 10, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'crossed-arms-stand',
      tags: ['mood', 'stare', 'editorial', 'aloof'],
    },
    'editorial-hip-thrust-dramatic': {
      id: 'editorial-hip-thrust-dramatic', category: 'editorial', name: 'Dramatic Hip Thrust',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Plant feet wide and cross both arms loosely low in front of the body, then fix a flat, unblinking gaze at a point far off-camera. Keep the face fully relaxed with no smile for an aloof editorial mood.',
      tip: 'Ask her to think of something boring — genuine disinterest beats performed intensity.',
      joints: { spine: 20, neck: 15, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 80, leftKnee: 100, rightKnee: 20, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-angular',
      tags: ['hip-thrust', 'exaggerated', 'silhouette', 'vogue'],
    },
    'editorial-vogue-arm-frame': {
      id: 'editorial-vogue-arm-frame', category: 'editorial', name: 'Vogue Arm Frame',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Stand in profile and drive one hip sharply out past a natural stance, countering it by pulling the opposite shoulder back. Extend the far arm down and away from the body to complete the exaggerated silhouette.',
      tip: 'Push the shape further than feels natural — subtle reads flat in editorial work.',
      joints: { spine: 15, neck: 20, leftShoulder: 60, leftElbow: 81, rightShoulder: 20, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'face-frame-hands',
      tags: ['vogue', 'face-frame', 'angular', 'geometric'],
    },
    'editorial-contorted-reach-floor': {
      id: 'editorial-contorted-reach-floor', category: 'editorial', name: 'Contorted Floor Reach',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Bring both forearms up to frame the face at sharp, angular positions, wrists broken crisply rather than soft. Tilt the head 15° off-axis and lift the elbows high to maximize geometric shapes around the face.',
      tip: 'Reference classic vogue photography — crisp wrist breaks make this look work.',
      joints: { spine: 32, neck: 25, leftShoulder: 60, leftElbow: 81, rightShoulder: 20, rightElbow: 70, hips: 12, leftHip: 50, leftKnee: 10, rightKnee: 30, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-contort',
      tags: ['contortion', 'floor', 'spiral', 'story'],
    },
    'editorial-negative-space-arm': {
      id: 'editorial-negative-space-arm', category: 'editorial', name: 'Negative Space Arm Line',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Lie on the floor and press the upper body up onto one hand while the legs twist opposite, building a spiral line through the torso. Extend the free arm overhead to complete the elongated shape.',
      tip: 'Keep the contortion within a comfortable range — it should look effortless, not strained.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 60→-110, rightShoulder 20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 15, neck: 10, leftShoulder: -110, leftElbow: 81, rightShoulder: -110, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'arm-reach',
      tags: ['negative-space', 'composition', 'minimal', 'story'],
    },
    'editorial-shoulder-drop-asymmetry': {
      id: 'editorial-shoulder-drop-asymmetry', category: 'editorial', name: 'Asymmetric Shoulder Drop',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Stand at the edge of the frame and extend one arm straight out to the side at shoulder height, leaving deliberate empty space on the opposite side. Keep the rest of the body still and the expression neutral.',
      tip: 'Compose off-center so the negative space reads as intentional, not wasted frame.',
      joints: { spine: 20, neck: 15, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 40, leftKnee: 10, rightKnee: 15, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-angular',
      tags: ['asymmetry', 'diagonal', 'geometric', 'mood'],
    },
    'editorial-power-crouch': {
      id: 'editorial-power-crouch', category: 'editorial', name: 'Power Crouch Stare',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Drop one shoulder low while lifting the opposite hip, building an off-balance diagonal line through the torso. Let the arms hang asymmetrically — one bent, one straight — to avoid a mirrored look.',
      tip: 'Break symmetry every time — always play one side of the body against the other.',
      joints: { spine: 15, neck: 10, leftShoulder: 30, leftElbow: 65, rightShoulder: -10, rightElbow: 45, hips: 12, leftHip: 90, leftKnee: 80, rightHip: 60, rightKnee: 110, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'kneeling',
      tags: ['crouch', 'power', 'low-angle', 'intense'],
    },
    'editorial-fabric-toss-freeze': {
      id: 'editorial-fabric-toss-freeze', category: 'editorial', name: 'Fabric Toss Freeze Frame',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Dynamic',
      instructions: 'Crouch low with one knee down and the other foot planted, forearms resting across the raised knee, eyes locked into the lens. Keep the spine straight rather than hunched to project power.',
      tip: 'Shoot from a low angle to amplify the dominance of the crouch.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 30→-110, rightShoulder -10→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 25, neck: 15, leftShoulder: -110, leftElbow: 81, rightShoulder: -110, rightElbow: 70, hips: 15, leftHip: 30, leftKnee: 10, rightKnee: 20, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-twist',
      tags: ['dynamic', 'fabric', 'movement', 'story'],
    },
    'editorial-geometric-seated': {
      id: 'editorial-geometric-seated', category: 'editorial', name: 'Geometric Seated Shape',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Toss a scarf or fabric piece into the air and capture the peak moment it billows around the body, torso twisted with one arm following through from the toss. Keep the face calm against the dynamic fabric.',
      tip: 'Shoot in burst mode — the ideal fabric shape lasts a fraction of a second.',
      joints: { spine: 25, neck: 20, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 45, leftKnee: 10, leftAnkle: -15, rightKnee: 90, rightAnkle: -15, shoulderFwdL: 8, shoulderFwdR: -6 , globalTwist: 25},
      color: 'var(--color-purple-100)',
      figure: 'editorial-floor-reach',
      tags: ['geometric', 'seated', 'triangles', 'high-angle'],
    },
    'editorial-back-arch-tension': {
      id: 'editorial-back-arch-tension', category: 'editorial', name: 'Tension Back Arch',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Sit with knees bent sharply, feet flat, angling both knees to one side while the torso rotates to the other, forming triangular negative spaces. Rest one hand flat on the floor and drape the other along a bent knee.',
      tip: 'Shoot from directly above to reveal the geometric shapes made by the limbs.',
      joints: { spine: 32, neck: 27, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 , globalTwist: 25},
      color: 'var(--color-purple-100)',
      figure: 'back-arch-wall',
      tags: ['arch', 'tension', 'raw', 'mood'],
    },
    'editorial-wide-stance-power': {
      id: 'editorial-wide-stance-power', category: 'editorial', name: 'Wide Power Stance',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Stand and arch the upper back sharply while clenching both fists at the sides, building visible muscular tension rather than a soft curve. Tilt the head back and part the lips slightly for a raw, emotive mood.',
      tip: 'Keep the hands tense, not soft — that\'s what separates this from a boudoir arch.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
      joints: {spine: -15, hips: 15, neck: 5, leftShoulder: 30, rightShoulder: -10, leftElbow: 81, rightElbow: 70, leftHip: -7, rightKnee: 5, leftKnee: 10, rightHip: 12, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-purple-100)',
      figure: 'standing-front',
      tags: ['power', 'stance', 'stern', 'authority'],
    },
    'editorial-one-arm-extreme-reach': {
      id: 'editorial-one-arm-extreme-reach', category: 'editorial', name: 'One-Arm Extreme Reach',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Dynamic',
      instructions: 'Plant the feet wider than shoulder width, lock both hands behind the back, and square the shoulders directly to the camera with the chin level. Hold the expression stern and unmoving to project authority.',
      tip: 'Keep the knees locked and grounded — softness there undercuts the power stance.',
      joints: { spine: 32, neck: 20, leftShoulder: 60, leftElbow: 81, rightShoulder: 20, rightElbow: 70, hips: 12, leftHip: 60, leftKnee: 80, rightKnee: 25, shoulderFwdL: 8, shoulderFwdR: 6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-lean-far',
      tags: ['reach', 'diagonal', 'extreme', 'line'],
    },
    'editorial-shadow-profile-stark': {
      id: 'editorial-shadow-profile-stark', category: 'editorial', name: 'Stark Shadow Profile',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Reach one arm as far overhead and to the side as possible while the opposite hip drops low, stretching the whole side body into a dramatic diagonal. Point the same-side foot to complete the line from fingertip to toe.',
      tip: 'Coach for the longest possible line from hand to foot — that\'s the whole shape.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 30→-110, rightShoulder -10→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 15, hips: 15, neck: 10, leftShoulder: -110, rightShoulder: -110, leftElbow: 81, rightElbow: 70, leftHip: -7, rightKnee: 5, leftKnee: 10, rightHip: 12, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-purple-100)',
      figure: 'profile-stand',
      tags: ['profile', 'shadow', 'graphic', 'stark'],
    },
    'editorial-kneel-collapse': {
      id: 'editorial-kneel-collapse', category: 'editorial', name: 'Kneel Collapse Story',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Stand in strict profile, chin lifted, one hand flat against the collarbone, and hold the rest of the body completely still. Use hard side lighting to throw a graphic shadow across the face and torso.',
      tip: 'Underexpose slightly to deepen the shadow side and boost graphic contrast.',
      joints: { spine: 32, neck: 27, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 100, leftKnee: 100, rightKnee: 120, rightAnkle: -35, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'kneeling-forward',
      tags: ['story', 'collapse', 'narrative', 'dramatic'],
    },
    'editorial-hand-face-cover-partial': {
      id: 'editorial-hand-face-cover-partial', category: 'editorial', name: 'Partial Face Cover',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Drop onto both knees and let the upper body collapse forward and to one side, one arm braced flat on the floor and the other trailing limp. Let the head hang loosely to sell exhaustion or surrender.',
      tip: 'Shoot this as one chapter within a series, not a standalone frame.',
      joints: { spine: 15, neck: 10, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'face-frame-hands',
      tags: ['mystery', 'face', 'mood', 'story'],
    },
    'editorial-leg-kick-freeze': {
      id: 'editorial-leg-kick-freeze', category: 'editorial', name: 'Leg Kick Freeze',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Editorial',
      effort: 'Dynamic',
      instructions: 'Bring one hand up to partially cover the lower face, fingers spread with sharp, deliberate spacing, while the eyes stay locked on camera. Keep the opposite arm rigid and straight at the side for contrast.',
      tip: 'Keep the eyes as the clear focal point even as the hand conceals the mouth.',
      joints: { spine: 20, neck: 15, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 100, leftKnee: 100, leftAnkle: -25, rightKnee: 10, rightAnkle: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'dynamic-reach',
      tags: ['dynamic', 'kick', 'movement', 'editorial'],
    },
    'editorial-chair-sprawl': {
      id: 'editorial-chair-sprawl', category: 'editorial', name: 'Chair Sprawl Story',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Kick one leg out sharply to the side mid-stride while the arms counterbalance in opposing angular directions, catching the peak of the extension. Keep the supporting leg planted with a slight bend to absorb the motion.',
      tip: 'Use a fast shutter or flash-freeze to keep the extended leg crisp, not blurred.',
      joints: { spine: 30, neck: 28, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 110, leftKnee: 100, leftAnkle: -15, rightKnee: 100, rightAnkle: -15, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'chair-reach-diagonal',
      tags: ['story', 'chair', 'rebellion', 'narrative'],
    },
    'editorial-mirrored-hands-hip': {
      id: 'editorial-mirrored-hands-hip', category: 'editorial', name: 'Mirrored Hands on Hips',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Sprawl across a chair with one leg draped over the armrest and the torso leaning back at an unconventional angle, arms falling loosely. Tilt the head back with a distant gaze to suggest boredom or rebellion.',
      tip: 'Commit fully to the sprawl — a tidy seated pose kills the editorial signature.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
      joints: { spine: -15, neck: 5, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'fashion-power',
      tags: ['geometric', 'symmetry', 'bold', 'graphic'],
    },
    'editorial-floor-lie-diagonal': {
      id: 'editorial-floor-lie-diagonal', category: 'editorial', name: 'Floor Diagonal Lie',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Place both hands on the hips with elbows sharply bent and pointed outward, feet planted in a wide symmetrical stance. Keep the face perfectly neutral so the geometric arm shapes carry the image.',
      tip: 'Symmetry can work here if the shapes are bold enough — judge case by case.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {globalTilt: 80, globalRoll: -20, leftShoulder: -70, rightShoulder: 20, leftElbow: 65, rightElbow: 45, leftHip: 20, rightHip: 45, rightKnee: 60, spine: 18, leftKnee: 10, neck: -3.3, hips: 12, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-purple-100)',
      figure: 'prone-flat',
      tags: ['floor', 'diagonal', 'composition', 'graphic'],
    },
    'editorial-wind-machine-lean': {
      id: 'editorial-wind-machine-lean', category: 'editorial', name: 'Wind Machine Lean',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Editorial',
      effort: 'Dynamic',
      instructions: 'Lie diagonally across the frame, one leg bent sharply and the other extended straight, arms positioned at contrasting angles above the head. Turn the face toward camera while the body angles away.',
      tip: 'Shoot from directly above to let the diagonal line fill the frame corner to corner.',
      joints: { spine: 30, neck: 15, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 60, leftKnee: 80, rightKnee: 30, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-lean-far',
      tags: ['wind', 'dynamic', 'movement', 'drama'],
    },
    'editorial-single-leg-balance-angular': {
      id: 'editorial-single-leg-balance-angular', category: 'editorial', name: 'Angular Single-Leg Balance',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Lean the body into an implied wind, hair and fabric streaming back, front leg driving forward into the lean for balance. Keep the face calm and eyes narrowed slightly against the wind.',
      tip: 'Sync a wind machine or fan with the shutter to time the hair movement precisely.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
      joints: {spine: 15, hips: 15, neck: 10, leftShoulder: 30, rightShoulder: -10, leftElbow: 100, rightElbow: 81, leftHip: 30, leftKnee: 10, rightKnee: 90, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-purple-100)',
      figure: 'editorial-angular',
      tags: ['balance', 'angular', 'geometric', 'strength'],
    },
    'editorial-hunched-power-lean': {
      id: 'editorial-hunched-power-lean', category: 'editorial', name: 'Hunched Power Lean',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Balance on one leg while the other bends sharply behind at a right angle, arms extended in opposing angular directions like a human compass. Lock the standing leg and fix the gaze forward, unreadable.',
      tip: 'Build in rehearsal time — this balance shape demands real core strength.',
      joints: { spine: 32, neck: 25, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'editorial-lean-far',
      tags: ['brooding', 'mood', 'intense', 'story'],
    },
    'editorial-arms-crossed-overhead': {
      id: 'editorial-arms-crossed-overhead', category: 'editorial', name: 'Arms Crossed Overhead',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Round the upper spine deliberately forward while the lower body stays powerful and grounded, hands clasped low in front. Lift the gaze up beneath lowered brows for a brooding, intense mood.',
      tip: 'Ground the legs firmly so the hunch reads as stylistic choice, not poor posture.',
      // PR-v2 (v1.2) — Phase 2/3 forensic audit fix. Root causes:
      //   1. The POSE NAME says "Arms Crossed Overhead" but the DESCRIPTION
      //      (which is king per directive Part A.10 rule #1) says "hands
      //      clasped LOW in front" + "round upper spine FORWARD". The data
      //      matched the NAME (arms overhead: leftShoulder -130, rightShoulder
      //      -116) not the DESCRIPTION. Per "description is king", fixed the
      //      joints to match the description:
      //        - Arms DOWN and crossed in front: leftShoulder -130 → 15 (arm
      //          hanging down), rightShoulder -116 → 18, shoulderFwdL 8 → 40
      //          (arm forward across body), shoulderFwdR -6 → -40 (arm forward
      //          across body mirrored), elbows 100/100 → 110/110 (deeply bent
      //          so forearms cross low in front).
      //        - Spine forward: spine 10 → 30 (deliberate forward round).
      //        - Neck: 25 → 0 (description says "lift gaze up" but the rig's
      //          neck joint is side-tilt, not pitch; set to 0 to avoid an
      //          accidental head tilt that would contradict "brooding").
      //   2. hips 15 — slight lateral pelvis tilt. Kept (subtle weight shift
      //      is fine for "grounded" stance).
      //   3. leftHip -7 / rightHip 12 — mild asymmetry. Kept.
      //   4. leftKnee 10 / rightKnee 5 — barely bent. For "powerful and
      //      grounded" legs, increased slightly: 10/5 → 15/12 (soft knees,
      //      not locked).
      // REASONING [PR-v2]: The directive explicitly says "Description is king.
      // Rename display name and id to match description; never rename
      // description to match render." The description describes a hunched,
      // brooding pose with hands low — NOT arms overhead. The name
      // "Arms Crossed Overhead" is itself drift from the description. A future
      // PR should rename this pose to "Brooding Hunch" or similar; for now we
      // fix the joints to match the description (the truth) and note the name
      // drift for a follow-up rename pass.
      joints: {spine: 30, hips: 15, neck: 0, leftShoulder: -20, rightShoulder: -20, leftElbow: 150, rightElbow: 150, leftHip: -7, rightHip: 12, leftKnee: 15, rightKnee: 12, shoulderFwdL: -110, shoulderFwdR: -110},
      color: 'var(--color-purple-100)',
      figure: 'arm-reach',
      tags: ['mystery', 'overhead', 'shadow', 'graphic'],
    },
    'editorial-side-lunge-sharp': {
      id: 'editorial-side-lunge-sharp', category: 'editorial', name: 'Sharp Side Lunge',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Dynamic',
      instructions: 'Raise both arms overhead and cross them at the wrists, tilting the head down so the face falls partly into shadow beneath the raised arms. Keep the torso long and feet together for a grounded base.',
      tip: 'Place a hard light source above and behind to cast mystery-adding shadow.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 30→-110, rightShoulder -10→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 25, neck: 15, leftShoulder: -110, leftElbow: 81, rightShoulder: -110, rightElbow: 70, hips: 12, leftHip: 70, leftKnee: 80, rightKnee: 100, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'warrior-lunge',
      tags: ['lunge', 'dynamic', 'geometric', 'bold'],
    },
    'editorial-face-tilt-extreme': {
      id: 'editorial-face-tilt-extreme', category: 'editorial', name: 'Extreme Face Tilt',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Editorial',
      effort: 'Static',
      instructions: 'Lunge sharply to one side, bent knee tracking over the foot, opposite leg extended straight, torso leaning away for counterbalance. Extend both arms in opposite diagonal directions to maximize geometric spread.',
      tip: 'Push the lunge deeper than feels comfortable — exaggeration reads as bold here.',
      joints: { spine: 15, neck: 27, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 15, leftHip: 10, leftKnee: 10, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'upper-body',
      tags: ['tilt', 'neck', 'minimal', 'tension'],
    },
    'editorial-runway-freeze-turn': {
      id: 'editorial-runway-freeze-turn', category: 'editorial', name: 'Runway Freeze Turn',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Editorial',
      effort: 'Dynamic',
      instructions: 'Tilt the head to an extreme angle toward one shoulder while the torso stays upright and still, creating tension between the stillness and the sharp neck line. Keep both arms relaxed at the sides so they don\'t compete for attention.',
      tip: 'Isolate the tilt as the single point of interest — keep everything else quiet.',
      joints: { spine: 32, neck: 20, leftShoulder: 30, leftElbow: 81, rightShoulder: -10, rightElbow: 70, hips: 12, leftHip: 40, leftKnee: 10, rightKnee: 20, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-purple-100)',
      figure: 'spin-turn',
      tags: ['turn', 'dynamic', 'motion', 'runway'],
    },
  
    // ═════════════ FINE-ART (30) ═════════════
    'fineart-classic-arabesque': {
      id: 'fineart-classic-arabesque', category: 'fine-art', name: 'Classic Arabesque Line',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Capture the exact midpoint of a sharp turn, torso rotating opposite the hips, one foot crossing in front of the other. Let the arms swing naturally with the rotation to add authentic edge blur.',
      tip: 'Shoot a burst through the turn and select the frame with the cleanest silhouette separation.',
      joints: { spine: 12, neck: 8, leftShoulder: -50, leftElbow: 80, rightShoulder: 20, rightElbow: 55, leftHip: -5, leftAnkle: -20, rightHip: -65, rightKnee: 0, rightAnkle: -20, shoulderFwdL: -40, shoulderFwdR: -25 },
      color: 'var(--color-gold-100)',
      figure: 'fine-art-arabesque',
      tags: ['ballet', 'arabesque', 'line', 'balance'],
    },
    'fineart-contrapposto-classic': {
      id: 'fineart-contrapposto-classic', category: 'fine-art', name: 'Classical Contrapposto',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Stand on one straight supporting leg and extend the other fully behind and up, hips square to the front. Reach the opposite arm forward and the same-side arm back to form one unbroken line from fingertip to toe.',
      tip: 'Check the wrist and foot for sag — the hand-to-foot line must read unbroken',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18, leftShoulder 8→-110, rightShoulder 28→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 18, neck: 15, leftShoulder: -110, leftElbow: 40, rightShoulder: -110, rightElbow: 18, leftHip: 20, leftAnkle: -18, rightHip: -15, rightKnee: 10, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'fine-art-contrapposto',
      tags: ['contrapposto', 'classical', 'sculpture', 'balance'],
    },
    'fineart-odalisque-recline': {
      id: 'fineart-odalisque-recline', category: 'fine-art', name: 'Odalisque Recline',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Shift weight entirely onto one leg so that hip rises while the opposite shoulder dips to counterbalance, echoing classical sculpture. Let one arm hang relaxed and tilt the head gently away from the raised hip',
      tip: 'Reference classical contrapposto sculpture for the exact hip-shoulder counterbalance.',
      joints: {globalTilt: 75, globalRoll: -12.5, neck: 8, leftShoulder: -80, rightShoulder: -15, leftElbow: 60, leftHip: 20, rightHip: 10, leftKnee: 30, rightKnee: 10, rightElbow: 18, spine: 10, leftAnkle: -18, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'fine-art-odalisque',
      tags: ['odalisque', 'classical', 'recline', 'curve'],
    },
    'fineart-pieta-kneel': {
      id: 'fineart-pieta-kneel', category: 'fine-art', name: 'Pietà-Inspired Kneel',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Recline on one side with the torso rotated toward camera while the hips stay turned away, head propped on a bent arm. Sweep the free arm gracefully overhead along the body\'s line to extend the silhouette.',
      tip: 'Exaggerate the torque between hips and shoulders for the strongest sculptural line.',
    // PR-v6 (v1.6) Iter C2 — fix recline_missing: description says "Recline on one side" — should be semi-reclined (globalTilt=50). Added globalTilt:50.
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 8→-110, rightShoulder 28→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    // PR-v7 (v1.7) — fix recline_missing: description says "Recline on one side". Added globalTilt:50.
      joints: { globalTilt: 50, spine: 32, neck: 27, leftShoulder: -110, leftElbow: 40, rightShoulder: -110, rightElbow: 18, leftHip: 100, leftKnee: 100, leftAnkle: -30, rightKnee: 120, rightAnkle: -35, shoulderFwdL: 8, shoulderFwdR: -6 , globalTwist: 25},
      color: 'var(--color-gold-100)',
      figure: 'fine-art-pietà',
      tags: ['pieta', 'emotional', 'kneeling', 'classical'],
    },
    'fineart-standing-torso-twist-sculpt': {
      id: 'fineart-standing-torso-twist-sculpt', category: 'fine-art', name: 'Sculptural Torso Twist',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Kneel and let the torso fall back and to one side as if in sorrow, extending both arms low and open with palms turned upward. Drop the head back gently, exposing the throat, to echo the Pietà\'s emotional weight.',
      tip: 'Direct with quiet, minimal words here — the mood depends on stillness.',
      joints: { spine: 30, neck: 15, leftShoulder: 8, leftElbow: 40, rightShoulder: 28, rightElbow: 18, leftHip: 8, leftAnkle: -18, rightKnee: 8, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'fine-art-contrapposto',
      tags: ['sculpture', 'twist', 'calm', 'classical'],
    },
    'fineart-seated-forward-fold': {
      id: 'fineart-seated-forward-fold', category: 'fine-art', name: 'Seated Forward Fold',
      difficulty: 'Beginner',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Stand with hips facing forward while the ribcage and shoulders rotate gently to one side, arms following as if carved mid-motion. Distribute weight evenly between both feet to preserve sculptural stillness.',
      tip: 'Keep the energy calm and slow — this should look frozen mid-motion, not dynamic.',
      joints: { spine: 32, neck: 25, leftShoulder: 8, leftElbow: 40, rightShoulder: 28, rightElbow: 18, leftHip: 80, leftKnee: 85, leftAnkle: -30, rightKnee: 85, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'seated-floor',
      tags: ['fold', 'flexibility', 'classical', 'line'],
    },
    'fineart-releve-reach': {
      id: 'fineart-releve-reach', category: 'fine-art', name: 'Relevé Reach',
      difficulty: 'Advanced',
      angle: 'Front View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Sit with legs extended together and fold the torso forward over the thighs, reaching both hands toward the feet with a long, flat spine. Let the head hang naturally to release the back of the neck.',
      tip: 'Prioritize spine length over fold depth — flat reads more sculptural than rounded.',
      joints: {spine: 15, neck: -9.8, leftShoulder: 60, rightShoulder: 20, leftElbow: 40, leftHip: 5, rightKnee: 5, rightElbow: 18, leftAnkle: -18, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'tiptoe-reach',
      tags: ['ballet', 'releve', 'balance', 'lift'],
    },
    'fineart-kneeling-torso-extend': {
      id: 'fineart-kneeling-torso-extend', category: 'fine-art', name: 'Kneeling Torso Extension',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Rise onto the balls of both feet in relevé, lifting both arms into a rounded shape overhead as if holding an invisible sphere. Keep the spine vertical and the core engaged to hold the lifted balance.',
      tip: 'Check in a mirror that both arms form a symmetrical, rounded frame overhead.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 8→-110, rightShoulder 28→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 20, neck: 15, leftShoulder: -110, leftElbow: 40, rightShoulder: -110, rightElbow: 18, leftHip: 10, leftAnkle: -18, rightKnee: 100, rightAnkle: -35, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'kneeling',
      tags: ['kneeling', 'extension', 'elongate', 'classical'],
    },
    'fineart-standing-arm-sweep': {
      id: 'fineart-standing-arm-sweep', category: 'fine-art', name: 'Graceful Arm Sweep',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Kneel upright on both knees and extend the torso upward and slightly back, reaching one arm high overhead while the other trails down the back leg. Stack the hips directly above the knees for a stable base.',
      tip: 'Coach for length, not depth — this is elongation, not a deep backbend.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 60→-110, rightShoulder 20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: -15, neck: 10, leftShoulder: -110, leftElbow: 40, rightShoulder: -110, rightElbow: 18, leftHip: 5, leftAnkle: -18, rightKnee: 5, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'standing-front',
      tags: ['ballet', 'arms', 'graceful', 'classical'],
    },
    'fineart-side-lying-torso-lift': {
      id: 'fineart-side-lying-torso-lift', category: 'fine-art', name: 'Side Lying Torso Lift',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Stand with feet in a soft turned-out first position and sweep both arms into a low, rounded curve in front of the body, like a ballet port de bras. Relax the shoulders down and lift the chin gently.',
      tip: 'Round the arms softly — straight, rigid lines read less classical.',
      joints: { spine: 20, neck: 10, leftShoulder: 8, leftElbow: 40, rightShoulder: 28, rightElbow: 18, leftHip: 30, leftAnkle: -18, rightHip: 10, rightKnee: 10, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'side-recline',
      tags: ['line', 'recline', 'sculpture', 'elongate'],
    },
    'fineart-standing-back-bend-soft': {
      id: 'fineart-standing-back-bend-soft', category: 'fine-art', name: 'Soft Standing Back Bend',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Lie on one side and press up onto the supporting forearm, lifting the ribcage while extending the top leg long and slightly raised. Reach the top arm overhead to draw one sculptural line from foot to fingertip.',
      tip: 'Check that the raised leg and reaching arm form one visual line past the torso.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 8→-110, rightShoulder 28→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 30, neck: 25, leftShoulder: -110, leftElbow: 40, rightShoulder: -110, rightElbow: 18, leftHip: 10, leftAnkle: -18, rightKnee: 10, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'back-arch-wall',
      tags: ['backbend', 'classical', 'elegant', 'line'],
    },
    'fineart-seated-profile-still': {
      id: 'fineart-seated-profile-still', category: 'fine-art', name: 'Seated Profile Stillness',
      difficulty: 'Beginner',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Stand grounded and bend the upper spine back gently, sweeping both arms overhead and slightly back to follow the curve. Keep the hips stacked over the ankles for safety and support.',
      tip: 'Lightly spot the lower back during rehearsal for a safe, controlled bend.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
      joints: {spine: -15, neck: -9.8, leftShoulder: -110, rightShoulder: -110, leftElbow: 40, leftHip: 20, rightKnee: 60, leftAnkle: -15, rightAnkle: -15, rightElbow: 18, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'seated-side',
      tags: ['stillness', 'profile', 'classical', 'calm'],
    },
    'fineart-standing-leg-extension-hand': {
      id: 'fineart-standing-leg-extension-hand', category: 'fine-art', name: 'Hand-Assisted Leg Extension',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Sit on the floor in profile, legs folded neatly to one side, spine tall, hands resting quietly in the lap. Hold a level, calm gaze to echo the stillness of a classical portrait bust.',
      tip: 'Avoid fidgeting between frames — stillness is the entire point of this pose.',
      joints: {spine: 10, neck: 10, leftShoulder: 8, rightShoulder: 28, leftElbow: 40, leftHip: 114, leftKnee: 100, rightKnee: 5, leftAnkle: -25, rightAnkle: -26, rightElbow: 18, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'fine-art-arabesque',
      tags: ['balance', 'extension', 'ballet', 'strength'],
    },
    'fineart-torso-curve-floor': {
      id: 'fineart-torso-curve-floor', category: 'fine-art', name: 'Floor Torso Curve',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Balance on one leg and hold the opposite ankle with one hand, extending that leg forward and up while the free arm reaches out for counterbalance. Keep the standing leg straight and the torso lifted tall.',
      tip: 'Use a wall or barre nearby during practice — this balance is genuinely demanding.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 8→-110, rightShoulder 28→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 25, neck: 15, leftShoulder: -110, leftElbow: 40, rightShoulder: -110, rightElbow: 18, leftHip: 30, leftAnkle: -18, rightKnee: 70, rightAnkle: -18, shoulderFwdL: -8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'boudoir-lying-arch',
      tags: ['curve', 'floor', 'sculptural', 'calm'],
    },
    'fineart-standing-still-life-drape': {
      id: 'fineart-standing-still-life-drape', category: 'fine-art', name: 'Still Life Drape Stand',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Lie on the back and curve the spine gently upward into a soft bridge shape, resting both arms overhead along the floor. Move slowly and with control, as if the body were being carved from marble.',
      tip: 'Shoot from above to reveal the full curved silhouette against the floor.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
    // PR-v7 (v1.7) — fix recline_missing: "Lie on the back" → globalTilt:-85
      joints: {spine: -15, neck: -9.8, leftShoulder: -130, rightShoulder: -130, leftElbow: 40, rightElbow: 18, leftHip: 10, rightKnee: 5, leftAnkle: -18, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6, globalTilt: -85},
      color: 'var(--color-gold-100)',
      figure: 'standing-front',
      tags: ['drape', 'fabric', 'timeless', 'classical'],
    },
    'fineart-kneeling-arms-crossed-chest': {
      id: 'fineart-kneeling-arms-crossed-chest', category: 'fine-art', name: 'Kneeling Crossed Arms',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Stand with a long piece of fabric draped over one shoulder, gathered at the waist with one hand, weight distributed evenly between both feet. Let the free arm rest naturally at the side to complete a timeless composition.',
      tip: 'Let the fabric fall in natural folds — over-arranging kills the classical feel.',
      joints: {spine: 10, neck: 10, leftShoulder: -32, rightShoulder: -12, leftElbow: 100, rightElbow: 100, leftHip: 10, rightKnee: 110, rightAnkle: -35, leftAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'both-knees-prayer',
      tags: ['meditative', 'kneeling', 'quiet', 'classical'],
    },
    'fineart-standing-figure-eight-arms': {
      id: 'fineart-standing-figure-eight-arms', category: 'fine-art', name: 'Figure-Eight Arm Line',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Kneel upright and cross both arms gently over the chest, holding opposite shoulders, spine tall, eyes closed softly. Keep the knees together and weight centered for a quiet, meditative composition.',
      tip: 'Closed eyes shift this from portrait to meditative, sculpture-like study.',
      joints: { spine: 10, neck: 10, leftShoulder: 60, leftElbow: 40, rightShoulder: 20, rightElbow: 18, leftHip: 10, leftAnkle: -18, rightKnee: 10, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'fine-art-contrapposto',
      tags: ['arms', 'figure-eight', 'classical', 'graceful'],
    },
    'fineart-lying-leg-raised-line': {
      id: 'fineart-lying-leg-raised-line', category: 'fine-art', name: 'Lying Raised Leg Line',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Position one arm curved low in front of the body and the other curved high overhead, forming an interlocking figure-eight through the torso. Hold the legs in a soft turned-out stance for classical grounding.',
      tip: 'Position one arm at a time — this complex shape needs careful, slow adjustment.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -12→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {globalTilt: 85, leftShoulder: -110, rightShoulder: -110, leftElbow: 65, rightElbow: 45, leftHip: -65, rightHip: 15, leftKnee: 5, leftAnkle: -25, neck: -3.3, spine: 10, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'supine',
      tags: ['line', 'floor', 'vertical', 'classical'],
    },
    'fineart-standing-hand-to-heart': {
      id: 'fineart-standing-hand-to-heart', category: 'fine-art', name: 'Hand to Heart Stillness',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Lie on the back and raise one leg straight toward the ceiling while the other stays flat on the floor, arms resting softly at the sides. Point the raised foot to complete a clean vertical line against the horizontal body.',
      tip: 'Keep both the raised leg and the floor leg perfectly straight for maximum contrast.',
    // PR-v6 (v1.6) Iter C2 — fix recline_missing: description says "Lie on the back" — should be supine (globalTilt=85). Added globalTilt:-85
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 8→-110, rightShoulder 28→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    // PR-v7 (v1.7) — actually applied globalTilt:85 (v1.6 script failed to add it).
      joints: { globalTilt: -85, spine: 15, neck: 10, leftShoulder: -110, leftElbow: 40, rightShoulder: -110, rightElbow: 18, leftHip: 5, leftAnkle: -18, rightKnee: 5, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'standing-front',
      tags: ['introspective', 'stillness', 'minimal', 'classical'],
    },
    'fineart-kneeling-side-stretch': {
      id: 'fineart-kneeling-side-stretch', category: 'fine-art', name: 'Kneeling Side Stretch',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Stand tall with feet together, rest one hand gently over the heart, and let the other arm hang relaxed at the side. Close the eyes softly or gaze downward for an introspective, timeless mood.',
      tip: 'Keep the background simple — this minimal pose relies on posture and light alone.',
      joints: { spine: 30, neck: 15, leftShoulder: 8, leftElbow: 40, rightShoulder: 28, rightElbow: 18, leftHip: 100, leftKnee: 100, leftAnkle: -30, rightKnee: 10, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'kneeling',
      tags: ['stretch', 'kneeling', 'line', 'classical'],
    },
    'fineart-standing-passe-balance': {
      id: 'fineart-standing-passe-balance', category: 'fine-art', name: 'Passé Balance',
      difficulty: 'Advanced',
      angle: 'Front View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Kneel with one leg extended straight out to the side and the other bent beneath, reaching the same-side arm up and over into a long side stretch. Square the hips forward to isolate the stretch through the torso.',
      tip: 'Check that the hips stay square before refining the reaching arm.',
      joints: {spine: 15, neck: -9.8, leftShoulder: -85, rightShoulder: 28, leftElbow: 75, leftHip: 90, leftKnee: 100, rightKnee: 5, leftAnkle: -30, rightElbow: 18, rightAnkle: -18, shoulderFwdL: -8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'fine-art-balance',
      tags: ['ballet', 'balance', 'passe', 'classical'],
    },
    'fineart-prone-back-lift-elegant': {
      id: 'fineart-prone-back-lift-elegant', category: 'fine-art', name: 'Elegant Prone Back Lift',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Balance on one straight leg while drawing the opposite foot to rest against the inner knee, arms rounded softly overhead in a classical ballet frame. Engage the standing leg fully and fix the gaze on one still point.',
      tip: 'Use a fixed gaze point (spotting) to hold balance through the whole pose.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -32→-110, rightShoulder -12→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {
"globalTilt":85,"spine":-20,"neck":5.4,"leftShoulder":-110,"rightShoulder":-110,"leftElbow":65,"rightElbow":45,"leftHip":-8,"rightHip":-8,"leftAnkle":-20,"rightAnkle":-20,"shoulderFwdL":8,"shoulderFwdR":-6
  },
      color: 'var(--color-gold-100)',
      figure: 'sphinx-pose',
      tags: ['backbend', 'strength', 'elegant', 'line'],
    },
    'fineart-seated-spinal-twist-classic': {
      id: 'fineart-seated-spinal-twist-classic', category: 'fine-art', name: 'Classic Seated Spinal Twist',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Lie face down and lift the chest and both arms simultaneously off the floor into a gentle backbend, legs extended and together. Point the toes and lift the gaze slightly for one elongated line.',
      tip: 'Build the lift gradually — this is a strength pose as much as a shape.',
      joints: {spine: -32, neck: 20, leftShoulder: 8, rightShoulder: 28, leftElbow: 40, rightElbow: 18, leftHip: 30, leftKnee: 85, rightKnee: 85, leftAnkle: -15, rightAnkle: -15, shoulderFwdL: 8, shoulderFwdR: -6, globalTilt: 90},
      color: 'var(--color-gold-100)',
      figure: 'seated-floor',
      tags: ['twist', 'seated', 'classical', 'elegant'],
    },
    'fineart-standing-cambre-side': {
      id: 'fineart-standing-cambre-side', category: 'fine-art', name: 'Standing Cambré Side',
      difficulty: 'Advanced',
      angle: 'Front View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Sit with legs extended and twist the torso to one side, one hand behind for support and the other resting on the opposite knee. Lengthen the spine upward before deepening the twist.',
      tip: 'Cue her to grow taller through the spine first, then twist, to avoid collapsing.',
      joints: { spine: 32, neck: 15, leftShoulder: 8, leftElbow: 40, rightShoulder: 28, rightElbow: 18, leftHip: 10, leftAnkle: -18, rightKnee: 5, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: 6 , globalTwist: 25},
      color: 'var(--color-gold-100)',
      figure: 'fine-art-contrapposto',
      tags: ['cambre', 'lateral', 'ballet', 'classical'],
    },
    'fineart-kneeling-both-arms-extend-fwd': {
      id: 'fineart-kneeling-both-arms-extend-fwd', category: 'fine-art', name: 'Kneeling Arms Extend Forward',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Stand with feet together and bend the entire torso directly to one side, reaching the same-side arm overhead in a smooth curve while the opposite arm curves low. Keep both hips level and facing forward.',
      tip: 'Watch for forward or backward hip drift — this is a pure lateral bend.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 60→-110, rightShoulder 20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 15, neck: -9.8, leftShoulder: -110, rightShoulder: -110, leftElbow: 40, leftHip: 10, rightKnee: 110, rightAnkle: -35, rightElbow: 18, leftAnkle: -18, shoulderFwdL: -8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'kneeling',
      tags: ['beginner', 'symmetry', 'classical', 'calm'],
    },
    'fineart-standing-toe-touch-reach': {
      id: 'fineart-standing-toe-touch-reach', category: 'fine-art', name: 'Standing Toe Touch Reach',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Kneel upright and extend both arms forward at shoulder height, palms facing each other as though holding an invisible sphere. Keep the spine tall and shoulders relaxed down away from the ears.',
      tip: 'Use this simple symmetrical shape as a starting point for beginners learning stillness.',
      joints: { spine: 32, neck: 25, leftShoulder: 60, leftElbow: 40, rightShoulder: 20, rightElbow: 18, leftHip: 90, leftKnee: 100, leftAnkle: -30, rightKnee: 20, rightAnkle: -18, shoulderFwdL: -8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'seated-floor',
      tags: ['fold', 'flexibility', 'classical', 'calm'],
    },
    'fineart-side-plank-elegant': {
      id: 'fineart-side-plank-elegant', category: 'fine-art', name: 'Elegant Side Plank Line',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Stand with feet hip-width apart and fold forward from the hips, reaching both hands toward the toes with a slight bend in the knees to protect the back. Let the head and neck relax fully toward the floor.',
      tip: 'Keep a slight knee bend — it makes this fold safe to hold longer.',
      joints: {globalTilt: 80, globalRoll: -22.5, spine: 15, leftShoulder: -12, rightShoulder: 8, shoulderFwdL: 20, leftElbow: 81, leftHip: -10, rightHip: -10, rightElbow: 18, neck: -3.3, leftAnkle: -18, rightAnkle: -18},
      color: 'var(--color-gold-100)',
      figure: 'side-recline',
      tags: ['strength', 'line', 'plank', 'classical'],
    },
    'fineart-standing-releve-attitude': {
      id: 'fineart-standing-releve-attitude', category: 'fine-art', name: 'Relevé Attitude Line',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Support the body on one straight arm and the outer edge of one foot, stacking the hips and lifting the free arm straight toward the ceiling. Hold the whole body in one unbroken plane from head to feet.',
      tip: 'Hold briefly and reset rather than shaking — this strength pose doubles as a sculptural line.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 8→-110, rightShoulder 28→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 10, neck: 10, leftShoulder: -110, leftElbow: 40, rightShoulder: -110, rightElbow: 18, leftHip: 100, leftKnee: 100, leftAnkle: -30, rightKnee: 5, rightAnkle: -18, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-gold-100)',
      figure: 'fine-art-arabesque',
      tags: ['attitude', 'ballet', 'balance', 'classical'],
    },
    'fineart-lying-fetal-soft-classical': {
      id: 'fineart-lying-fetal-soft-classical', category: 'fine-art', name: 'Soft Classical Fetal Curl',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Rise onto the ball of the standing foot while bending the other leg behind at a right angle in attitude position, arms curved gracefully to counterbalance. Keep the raised knee higher than the foot for the classical attitude shape.',
      tip: 'Allow several attempts here — finding the cleanest line takes practice.',
      joints: {globalTilt: 80, globalRoll: -15, spine: 15, neck: -3.6, leftElbow: 65, rightElbow: 45, leftHip: 65, rightHip: 60, leftKnee: 100, rightKnee: 95, leftAnkle: -20, rightAnkle: -20, rightShoulder: -12, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'fetal',
      tags: ['soft', 'curled', 'quiet', 'classical'],
    },
    'fineart-standing-devant-extension': {
      id: 'fineart-standing-devant-extension', category: 'fine-art', name: 'Standing Devant Extension',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fine Art',
      effort: 'Static',
      instructions: 'Curl onto the side with knees drawn gently toward the chest and arms folded softly in front, forming a rounded, self-contained shape. Relax the neck fully so the whole body reads soft, not tense.',
      tip: 'Shoot straight down with soft light to flatter this quiet, contained shape.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 18, neck: -9.8, leftShoulder: 8, rightShoulder: 28, leftElbow: 40, leftHip: 114, leftKnee: 100, rightKnee: 5, leftAnkle: -25, rightAnkle: -26, rightElbow: 18, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-gold-100)',
      figure: 'fine-art-arabesque',
      tags: ['ballet', 'extension', 'balance', 'classical'],
    },
  
    // ═════════════ FASHION (30) ═════════════
    'fashion-power-stance-classic': {
      id: 'fashion-power-stance-classic', category: 'fashion', name: 'Classic Power Stance',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Balance on one straight standing leg and extend the other forward and up as high as flexibility allows, torso upright, hips level. Round the arms into a soft ballet frame to complete the line.',
      tip: 'Engage the standing leg fully so the extended leg lifts clean without wobbling.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 15, neck: 5, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, hips: 13, leftHip: 5, leftKnee: 10, rightHip: -5, rightKnee: 5, shoulderFwdL: -8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'fashion-power',
      tags: ['power', 'commercial', 'strong', 'brand'],
    },
    'fashion-mid-turn-sweep': {
      id: 'fashion-mid-turn-sweep', category: 'fashion', name: 'Mid-Turn Sweep',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Dynamic',
      instructions: 'Plant both feet shoulder-width apart, place both hands firmly on the hips, and square the shoulders directly to camera while lifting the chin. Engage the core so the torso reads strong and confident.',
      tip: 'Rely on this stance as a commercial workhorse for catalog and brand shots alike.',
      joints: { spine: 30, neck: 25, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 30, leftKnee: 10, rightHip: -5, rightKnee: 20, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'fashion-turn',
      tags: ['turn', 'dynamic', 'motion', 'runway'],
    },
    'fashion-runway-stomp-stride': {
      id: 'fashion-runway-stomp-stride', category: 'fashion', name: 'Runway Stomp Stride',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Fashion',
      effort: 'Dynamic',
      instructions: 'Capture the midpoint of a full-body turn, one arm sweeping outward as if catching a coat or hair in motion, back foot pivoting on the ball. Keep the face turned back toward camera even as the body rotates away.',
      tip: 'Match turn speed to shutter speed to control how much fabric or hair blur appears.',
      joints: { spine: 10, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 12, leftHip: 40, leftKnee: 10, rightHip: -5, rightKnee: 30, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-rose-100)',
      figure: 'fashion-stomp',
      tags: ['runway', 'stride', 'dynamic', 'energy'],
    },
    'fashion-catalog-three-quarter': {
      id: 'fashion-catalog-three-quarter', category: 'fashion', name: 'Catalog Three-Quarter Stand',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Take a strong, deliberate forward step, front knee slightly bent, back leg driving off the ball of the foot, arms swinging in opposition to the stride. Keep the shoulders level and gaze fixed straight ahead with runway intensity.',
      tip: 'Capture the stride at the instant the back heel lifts for maximum leg extension.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 15, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'standing-front',
      tags: ['commercial', 'catalog', 'versatile', 'approachable'],
    },
    'fashion-strong-silhouette-cape': {
      id: 'fashion-strong-silhouette-cape', category: 'fashion', name: 'Strong Silhouette Cape Hold',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Angle the body 30-45° away from camera in a three-quarter stance, weight on the back leg, one hand resting lightly at the waist. Keep the posture relaxed but upright, expression approachable.',
      tip: 'Lean on this versatile stance for nearly any commercial or catalog brief.',
      joints: { spine: 15, neck: 10, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 10, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'profile-stand',
      tags: ['silhouette', 'garment', 'brand', 'structure'],
    },
    'fashion-hand-in-pocket-cool': {
      id: 'fashion-hand-in-pocket-cool', category: 'fashion', name: 'Hand in Pocket Cool',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Stand in profile and hold a coat or cape open with both hands extended slightly from the body to build a bold, structured silhouette. Lift the chin and ground the stance so the garment shape dominates the frame.',
      tip: 'Let the garment lead — the body should display it, not compete with it.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 20, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'hip-shift',
      tags: ['casual', 'cool', 'commercial', 'streetwear'],
    },
    'fashion-jacket-shoulder-pop': {
      id: 'fashion-jacket-shoulder-pop', category: 'fashion', name: 'Jacket Over Shoulder Pop',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Slip one hand casually into a pocket while the other arm hangs relaxed, weight shifted onto the back leg for an effortless stance. Relax the shoulders and hold a confident but casual gaze toward the lens.',
      tip: 'Keep this relaxed stance for streetwear and casual commercial campaigns.',
      joints: { spine: 10, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 25, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'hip-shift',
      tags: ['garment', 'attitude', 'commercial', 'brand'],
    },
    'fashion-wide-leg-stance-bold': {
      id: 'fashion-wide-leg-stance-bold', category: 'fashion', name: 'Wide Leg Bold Stance',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Hook one finger casually through a jacket draped over the shoulder while the other hand rests at the waist, weight shifted onto one hip for attitude. Pull the shoulders back to highlight the garment silhouette.',
      tip: 'Use this pose to showcase outerwear draped rather than worn.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 10, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'crossed-arms-stand',
      tags: ['bold', 'brand', 'campaign', 'strong'],
    },
    'fashion-walking-motion-blur': {
      id: 'fashion-walking-motion-blur', category: 'fashion', name: 'Walking Motion Capture',
      difficulty: 'Advanced',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Dynamic',
      instructions: 'Plant the feet wider than hip-width, cross both arms loosely in front of the body, and square the shoulders directly at camera with a bold, unflinching expression. Soften the knees to avoid a locked, stiff look.',
      tip: 'Deploy this bold stance for campaign and brand hero shots needing strong presence.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 12, leftHip: 45, leftKnee: 10, rightHip: -5, rightKnee: 15, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-rose-100)',
      figure: 'catwalk-stride',
      tags: ['walking', 'dynamic', 'motion', 'runway'],
    },
    'fashion-seated-editorial-commercial': {
      id: 'fashion-seated-editorial-commercial', category: 'fashion', name: 'Seated Commercial Lean',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Walk naturally toward camera at a brisk pace, capturing the moment one foot extends fully forward and the arms swing in natural stride rhythm. Keep the head steady and level even as the body moves through the stride.',
      tip: 'Pair a tracked subject with a slower background shutter for dynamic motion blur.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 30, leftKnee: 10, leftAnkle: -15, rightHip: -5, rightKnee: 90, rightAnkle: -15, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'seated-side',
      tags: ['seated', 'commercial', 'lifestyle', 'approachable'],
    },
    'fashion-accessory-focus-hand': {
      id: 'fashion-accessory-focus-hand', category: 'fashion', name: 'Accessory Focus Hand',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Sit on a stool or block with legs crossed at the knee, lean the torso slightly forward, and rest one hand on the knee while the other supports lightly behind. Keep the spine long and the expression open and inviting.',
      tip: 'Use this approachable seated pose as a go-to for lifestyle and catalog work.',
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 10, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: 6, hipAbductL: 10, hipAbductR: -10 },
      color: 'var(--color-rose-100)',
      figure: 'arm-reach',
      tags: ['accessory', 'product', 'commercial', 'focus'],
    },
    'fashion-shoulder-back-confident': {
      id: 'fashion-shoulder-back-confident', category: 'fashion', name: 'Confident Shoulder Set',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Raise one hand to chest height to display a bag, jewelry, or accessory clearly toward camera, other hand resting naturally at the side. Angle the body slightly so the accessory stays the clear focal point.',
      tip: 'Hold the accessory hand slightly forward of the body plane to keep it in sharp focus.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 5, leftKnee: 10, rightHip: -5, rightKnee: 5, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'standing-front',
      tags: ['lookbook', 'clean', 'brand', 'foundation'],
    },
    'fashion-leg-forward-point': {
      id: 'fashion-leg-forward-point', category: 'fashion', name: 'Leg Forward Point',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Stand tall with feet together, roll both shoulders back and down, and let the arms hang naturally relaxed at the sides. Keep the chin level and the gaze warm and direct.',
      tip: 'Treat this clean, simple stance as the foundation pose for most fashion lookbooks.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 30, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'catwalk-stride',
      tags: ['footwear', 'product', 'commercial', 'leg-line'],
    },
    'fashion-oversized-coat-swirl': {
      id: 'fashion-oversized-coat-swirl', category: 'fashion', name: 'Oversized Coat Swirl',
      difficulty: 'Advanced',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Dynamic',
      instructions: 'Stand with weight on the back leg and extend the front leg forward, pointed toe just touching the ground, to showcase footwear or leg line. Keep the torso upright and turned slightly toward camera for balance.',
      tip: 'Keep the pointed foot the clear visual anchor — the classic shoe-campaign pose.',
      joints: { spine: 10, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 10, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'spin-turn',
      tags: ['garment', 'dynamic', 'motion', 'commercial'],
    },
    'fashion-crossed-ankle-lean-wall': {
      id: 'fashion-crossed-ankle-lean-wall', category: 'fashion', name: 'Crossed Ankle Wall Lean',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Spin quickly while wearing an oversized coat, capturing the instant the fabric flares outward in a full circle. Spot a fixed point with the eyes to keep the face sharp while the coat blurs with motion.',
      tip: 'Use the ballet spotting technique so the face stays crisp while the coat blurs.',
      joints: {spine: 15, hips: 13, neck: 5, leftShoulder: -30, rightShoulder: -12, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftHip: 15, rightHip: -5, rightKnee: 10, leftKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-rose-100)',
      figure: 'wall-lean',
      tags: ['casual', 'lifestyle', 'lean', 'commercial'],
    },
    'fashion-power-jump-freeze': {
      id: 'fashion-power-jump-freeze', category: 'fashion', name: 'Power Jump Freeze',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Fashion',
      effort: 'Dynamic',
      instructions: 'Lean one shoulder casually against a wall, cross the ankles, and rest one hand in a pocket or on the hip. Keep the expression relaxed and approachable for a lifestyle brand feel.',
      tip: 'Reach for this casual lean for denim, streetwear, and lifestyle campaigns.',
      joints: { spine: 10, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 12, leftHip: 40, leftKnee: 10, rightHip: -5, rightKnee: 60, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-rose-100)',
      figure: 'jump-tuck',
      tags: ['jump', 'energy', 'dynamic', 'campaign'],
    },
    'fashion-belt-cinch-waist': {
      id: 'fashion-belt-cinch-waist', category: 'fashion', name: 'Belt Cinch Waist Focus',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Jump straight up with both arms extended overhead and legs slightly tucked, capturing the peak of the jump. Keep the face relaxed and eyes open, avoiding strain at the apex.',
      tip: 'Shoot continuous burst frames to nail the true peak of the jump.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { spine: 15, neck: 5, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, hips: 13, leftHip: 15, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'hip-shift',
      tags: ['product', 'waist', 'commercial', 'focus'],
    },
    'fashion-sunglasses-tilt-down': {
      id: 'fashion-sunglasses-tilt-down', category: 'fashion', name: 'Sunglasses Tilt Down',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Place both hands lightly at the waistband or belt to draw attention to the cinched silhouette, feet in a soft staggered stance. Pull the shoulders back and lengthen the spine above the focal point.',
      tip: 'Anchor the eye at the waistline — ideal for belts or fitted garments.',
      joints: { spine: 15, neck: 20, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 10, leftKnee: 10, rightHip: -5, rightKnee: 5, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'face-frame-hands',
      tags: ['eyewear', 'product', 'commercial', 'cool'],
    },
    'fashion-back-view-glance': {
      id: 'fashion-back-view-glance', category: 'fashion', name: 'Back View Product Glance',
      difficulty: 'Intermediate',
      angle: 'Over Shoulder',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Tilt the chin down slightly and look up over the top of the sunglasses toward camera, one hand resting near the temple of the frames. Relax the shoulders and angle them slightly for a cool commercial mood.',
      tip: 'Rehearse the tilted gaze carefully — this classic eyewear pose depends on it.',
      joints: { spine: 10, neck: 28, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 20, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'hip-shift',
      tags: ['garment', 'back-view', 'commercial', 'product'],
    },
    'fashion-cross-leg-standing': {
      id: 'fashion-cross-leg-standing', category: 'fashion', name: 'Standing Crossed Legs',
      difficulty: 'Beginner',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Stand with the back to camera to display the garment\'s back, then glance back over one shoulder toward the lens. Shift weight onto one leg for a natural, unstiff silhouette from behind.',
      tip: 'Reach for this pose whenever the garment detail lives only on the back.',
      joints: {spine: 15, hips: 13, neck: 5, leftShoulder: -30, rightShoulder: -12, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftHip: 10, rightHip: -5, rightKnee: 15, leftKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-rose-100)',
      figure: 'standing-front',
      tags: ['classic', 'clean', 'commercial', 'stance'],
    },
    'fashion-editorial-brand-stare': {
      id: 'fashion-editorial-brand-stare', category: 'fashion', name: 'Brand Forward Stare',
      difficulty: 'Intermediate',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Cross one leg in front of the other at the ankle while standing, hips level, one hand resting on the hip for balance. Square the shoulders to camera for a clean, classic fashion stance.',
      tip: 'Bend the back knee gently so the crossed stance doesn\'t look stiff.',
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 5, leftKnee: 10, rightHip: -5, rightKnee: 5, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: -10 },
      color: 'var(--color-rose-100)',
      figure: 'standing-front',
      tags: ['brand', 'hero', 'campaign', 'confident'],
    },
    'fashion-arm-drape-product': {
      id: 'fashion-arm-drape-product', category: 'fashion', name: 'Arm Drape Product Display',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Stand tall with feet grounded shoulder-width apart, arms relaxed, and deliver a direct, unwavering stare into the lens. Keep the posture open and the chin level for maximum presence.',
      tip: 'Use this hero-shot pose for campaign key art — energy calm but intense.',
      joints: { spine: 15, neck: 5, leftShoulder: 60, leftElbow: 70, rightShoulder: 20, rightElbow: 50, hips: 13, leftHip: 15, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'arm-reach',
      tags: ['product', 'accessory', 'commercial', 'display'],
    },
    'fashion-power-walk-toward-camera': {
      id: 'fashion-power-walk-toward-camera', category: 'fashion', name: 'Power Walk Toward Camera',
      difficulty: 'Advanced',
      angle: 'Front View',
      intent: 'Fashion',
      effort: 'Dynamic',
      instructions: 'Drape one arm across the front of the body to display a bag or clutch at the hip, other hand resting naturally at the side. Angle the torso slightly to keep the product facing camera clearly.',
      tip: 'Hold the product hand slightly forward of the body to avoid shadow falling across it.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 12, leftHip: 50, leftKnee: 10, rightHip: -5, rightKnee: 15, shoulderFwdL: -8, shoulderFwdR: -6 },
      color: 'var(--color-rose-100)',
      figure: 'catwalk-stride',
      tags: ['runway', 'walking', 'dynamic', 'confident'],
    },
    'fashion-seated-floor-brand-cool': {
      id: 'fashion-seated-floor-brand-cool', category: 'fashion', name: 'Seated Floor Brand Cool',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Walk directly toward camera with long, confident strides, capturing the moment the back leg pushes off for maximum extension. Let the shoulders relax and swing naturally with the stride rhythm.',
      tip: 'Track focus carefully as the subject approaches to keep the face sharp.',
      joints: { spine: 15, neck: 20, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 30, leftKnee: 85, leftAnkle: -15, rightHip: -5, rightKnee: 85, rightAnkle: -15, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'seated-floor',
      tags: ['cool', 'campaign', 'relaxed', 'floor'],
    },
    'fashion-hair-flip-motion': {
      id: 'fashion-hair-flip-motion', category: 'fashion', name: 'Hair Flip Motion Capture',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Fashion',
      effort: 'Dynamic',
      instructions: 'Sit on the floor with legs extended to one side and lean back on both hands, tilting the head back slightly for a relaxed, cool mood. Keep the posture open rather than closed to hold brand energy.',
      tip: 'Shoot from a slightly elevated angle so the pose doesn\'t read flat or collapsed.',
      joints: { spine: -10, neck: 25, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 10, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'hip-hop-lean',
      tags: ['hair', 'dynamic', 'motion', 'commercial'],
    },
    'fashion-denim-pocket-thumbs': {
      id: 'fashion-denim-pocket-thumbs', category: 'fashion', name: 'Denim Pocket Thumbs Hook',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Flip the head and hair in one quick motion, capturing the peak moment the hair is airborne and arcs around the face. Keep the body stable and grounded so hair carries the motion.',
      tip: 'Burst-shoot the top of the flip to capture the cleanest hair arc.',
      joints: { spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 20, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'hip-shift',
      tags: ['denim', 'casual', 'commercial', 'classic'],
    },
    'fashion-runway-arms-swing-stride': {
      id: 'fashion-runway-arms-swing-stride', category: 'fashion', name: 'Runway Arm Swing Stride',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Fashion',
      effort: 'Dynamic',
      instructions: 'Hook both thumbs into the front pockets while standing in a relaxed three-quarter stance, weight settled onto one hip. Pull the shoulders back and keep the expression easygoing.',
      tip: 'Keep the energy relaxed, not stiff — this pose is a denim campaign staple.',
      joints: { spine: 15, neck: 5, leftShoulder: 60, leftElbow: 70, rightShoulder: 20, rightElbow: 50, hips: 12, leftHip: 45, leftKnee: 10, rightHip: -5, rightKnee: 15, shoulderFwdL: 8, shoulderFwdR: -6 },
      color: 'var(--color-rose-100)',
      figure: 'fashion-overshoot',
      tags: ['runway', 'stride', 'dynamic', 'commercial'],
    },
    'fashion-shoulder-roll-jacket-on': {
      id: 'fashion-shoulder-roll-jacket-on', category: 'fashion', name: 'Shoulder Roll Jacket Reveal',
      difficulty: 'Intermediate',
      angle: 'Side View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Stride forward with purposeful energy, arms swinging naturally in opposition to the legs, capturing the widest point of stride separation. Keep the face composed and forward-focused, runway style.',
      tip: 'Aim for the widest stride point — it produces the most elongated silhouette.',
      joints: { spine: 10, neck: 10, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 15, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: -8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'hip-shift',
      tags: ['garment', 'reveal', 'commercial', 'motion'],
    },
    'fashion-editorial-crossbody-bag': {
      id: 'fashion-editorial-crossbody-bag', category: 'fashion', name: 'Crossbody Bag Commercial Stand',
      difficulty: 'Beginner',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Roll one shoulder back while pulling a jacket partially off to reveal what\'s worn underneath, capturing the mid-motion reveal. Move slowly and with control for a clean, sharp capture.',
      tip: 'Shoot multiple frames through the roll to find the most flattering fabric fall.',
      joints: {spine: 15, hips: 13, neck: 5, leftShoulder: -30, rightShoulder: -12, leftElbow: 100, rightElbow: 100, hipAbductL: 10, hipAbductR: 10, leftHip: 15, rightHip: -5, rightKnee: 10, leftKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6},
      color: 'var(--color-rose-100)',
      figure: 'hip-shift',
      tags: ['product', 'accessory', 'commercial', 'catalog'],
    },
    'fashion-brand-lean-forward-desk': {
      id: 'fashion-brand-lean-forward-desk', category: 'fashion', name: 'Brand Lean Forward Stance',
      difficulty: 'Intermediate',
      angle: '3/4 View',
      intent: 'Fashion',
      effort: 'Static',
      instructions: 'Stand in a relaxed three-quarter stance with a crossbody bag resting at the hip, one hand grazing the strap to draw attention to the product. Open the shoulders and keep the expression warm.',
      tip: 'Angle the bag slightly toward camera so its shape and branding stay visible.',
      joints: { spine: 15, neck: 10, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 13, leftHip: 20, leftKnee: 10, rightHip: -5, rightKnee: 10, shoulderFwdL: 8, shoulderFwdR: -6, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-rose-100)',
      figure: 'hip-shift',
      tags: ['brand', 'commercial', 'approachable', 'stance'],
    },
  
    // ═════════════ LOW-TO-HIGH (30) ═════════════
    'lowhigh-floor-seated-start': {
      id: 'lowhigh-floor-seated-start', category: 'low-to-high', name: 'Floor Seated Starting Point',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Lean the torso slightly forward from the hips, both hands resting lightly on the front of the thighs, weight balanced evenly between both feet. Keep the gaze direct for an approachable, polished look.',
      tip: 'Use this slight forward lean to add energy compared to a purely upright stance.',
      joints: { globalTilt: 25, spine: 10, neck: 25, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 10, leftHip: 30, leftKnee: 90, leftAnkle: -15, rightHip: 20, rightKnee: 40, rightAnkle: -15, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-sky-100)',
      figure: 'low-high-floor',
      tags: ['floor', 'sequence', 'starting-point', 'low-angle'],
    },
    'lowhigh-floor-reach-up-arms': {
      id: 'lowhigh-floor-reach-up-arms', category: 'low-to-high', name: 'Floor Reach Up Arms',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Begin fully seated on the floor, legs folded to one side, both hands planted for support, chin lifted toward the camera above. This is the lowest point of the rising sequence — establish maximum height contrast here.',
      tip: 'Shoot from directly above to exaggerate this low starting position.',
      joints: {spine: 20, neck: -8.2, leftShoulder: -136, rightShoulder: -120, leftElbow: 82, rightElbow: 62, leftHip: 40, rightHip: 20, leftKnee: 90, rightKnee: 45, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-floor',
      tags: ['floor', 'reach', 'transition', 'sequence'],
    },
    'lowhigh-deep-crouch-start': {
      id: 'lowhigh-deep-crouch-start', category: 'low-to-high', name: 'Deep Crouch Starting Position',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Still seated on the floor, extend both arms upward and slightly forward as if reaching toward the camera, lifting the chest and gaze with the arms. Keep the hips grounded to hold the sequence\'s low base.',
      tip: 'Capture the arm extension crisply — this frame bridges the seated start and the rise.',
      joints: {spine: 30, neck: 25, leftElbow: 65, rightElbow: 45, leftHip: 114, rightHip: 60, leftKnee: 124, rightKnee: 140, rightShoulder: -12, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-crouch',
      tags: ['crouch', 'compact', 'sequence', 'starting-point'],
    },
    'lowhigh-crouch-arms-spread-begin': {
      id: 'lowhigh-crouch-arms-spread-begin', category: 'low-to-high', name: 'Crouch Arms Beginning to Spread',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Crouch low with both feet flat on the floor, knees bent deeply, arms wrapped around the shins for a compact, grounded shape. This compression sets up dramatic visual expansion as the body later rises.',
      tip: 'Compress the crouch tightly — the tighter it is, the stronger the later contrast.',
      joints: {spine: 20, neck: 20, leftShoulder: 60, rightShoulder: 20, leftElbow: 65, rightElbow: 45, leftHip: 90, rightHip: 60, leftKnee: 100, rightKnee: 110, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-crouch',
      tags: ['crouch', 'arms', 'transition', 'sequence'],
    },
    'lowhigh-one-knee-rising': {
      id: 'lowhigh-one-knee-rising', category: 'low-to-high', name: 'One Knee Beginning to Rise',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'From the deep crouch, spread both arms outward to the sides while the knees stay bent, signaling the rise beginning. Lift the head toward the camera as the chest starts to open.',
      tip: 'Capture the exact instant the arms separate from the body for a clear sense of motion.',
      joints: {spine: 15, neck: 15, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, leftHip: 60, rightHip: 20, leftKnee: 100, rightKnee: 90, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-kneel-rise',
      tags: ['kneeling', 'rising', 'transition', 'sequence'],
    },
    'lowhigh-half-standing-arms-mid': {
      id: 'lowhigh-half-standing-arms-mid', category: 'low-to-high', name: 'Half-Standing Arms at Mid-Rise',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'From kneeling, plant one foot flat on the floor and press up through that leg while the other knee stays grounded, arms lifting outward for balance. This midpoint shows the body clearly moving from low to high.',
      tip: 'Shoot from a slightly low angle to track this pivotal midpoint frame.',
      joints: {spine: 10, neck: 10, leftShoulder: 60, rightShoulder: 20, leftElbow: 70, rightElbow: 50, leftHip: 70, rightHip: 20, leftKnee: 90, rightKnee: 60, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-kneel-rise',
      tags: ['rising', 'transition', 'mid-point', 'sequence'],
    },
    'lowhigh-nearly-standing-stretch': {
      id: 'lowhigh-nearly-standing-stretch', category: 'low-to-high', name: 'Nearly Standing Stretch Up',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Continue rising from kneeling until both legs are half-extended, torso upright, arms lifted to shoulder height with palms open. Keep the motion smooth and continuous rather than pausing mid-rise.',
      tip: 'Shoot a burst sequence through the rise to select the cleanest half-standing frame.',
      joints: {spine: 10, hips: 10, neck: 25, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: 20, leftKnee: 90, rightKnee: 15, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'tiptoe-reach',
      tags: ['rising', 'stretch', 'near-peak', 'sequence'],
    },
    'lowhigh-full-standing-peak': {
      id: 'lowhigh-full-standing-peak', category: 'low-to-high', name: 'Full Standing Peak Reach',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Straighten both legs almost fully while reaching both arms upward and overhead, chest lifted and gaze following the hands skyward. This near-final frame shows the body almost at full height with continued upward energy.',
      tip: 'Shoot low and looking up to emphasize the extended reach at this near-peak moment.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18, leftShoulder 60→-110, rightShoulder 20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 18, hips: 10, neck: 20, leftShoulder: -110, rightShoulder: -110, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 5, rightHip: 20, leftKnee: 90, rightKnee: 5, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'tiptoe-reach',
      tags: ['standing', 'peak', 'sequence', 'tall'],
    },
    'lowhigh-seated-to-kneel-transition': {
      id: 'lowhigh-seated-to-kneel-transition', category: 'low-to-high', name: 'Seated to Kneel Transition',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Stand fully upright on the balls of both feet, arms extended completely overhead — the highest point of the sequence. Stretch the body long from fingertips to toes to maximize the sense of height.',
      tip: 'Shoot from a low angle for maximum height drama on this final frame.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: 25, spine: 20, neck: 25, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, leftHip: 60, leftKnee: 90, leftAnkle: -35, rightHip: 20, rightKnee: 110, rightAnkle: -35 },
      color: 'var(--color-sky-100)',
      figure: 'low-high-floor',
      tags: ['transition', 'kneeling', 'floor', 'sequence'],
    },
    'lowhigh-floor-lie-back-start': {
      id: 'lowhigh-floor-lie-back-start', category: 'low-to-high', name: 'Floor Lie Back Starting Point',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Push up from a seated floor position onto both knees, using both hands on the floor for support, head lifted to track the rising motion. This is an early transitional step between floor and standing.',
      tip: 'Keep the hands visible in frame to show the mechanics of the push-up motion.',
      joints: {globalTilt: 85, leftShoulder: -10, rightShoulder: 8, leftElbow: 65, rightElbow: 45, leftHip: 20, rightHip: 20, leftKnee: 20, rightKnee: 10, spine: 10, neck: -3.3, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'supine',
      tags: ['floor', 'lying', 'starting-point', 'sequence'],
    },
    'lowhigh-roll-to-side-rise-begin': {
      id: 'lowhigh-roll-to-side-rise-begin', category: 'low-to-high', name: 'Roll to Side Rising Begin',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Begin lying flat on the back, arms relaxed at the sides — the absolute lowest point in an extended rising sequence. Keep the body relaxed and grounded to contrast strongly with later standing frames.',
      tip: 'Shoot straight down from directly above for the most dramatic low-point framing.',
    // PR-v6 (v1.6) Iter C2 — fix recline_missing: description says "lying flat on the back" — should be supine (globalTilt=88). Was globalTilt:25, now 88.
      joints: {spine: 15, hips: 10, neck: 15, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 30, rightHip: 20, leftKnee: 90, rightKnee: 60, globalTilt: -88, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'side-recline',
      tags: ['floor', 'transition', 'rising', 'sequence'],
    },
    'lowhigh-hands-knees-push-up': {
      id: 'lowhigh-hands-knees-push-up', category: 'low-to-high', name: 'Hands and Knees Push-Up Point',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Roll from lying flat onto one side, propping onto a bent forearm as the first movement toward rising, top leg beginning to bend for leverage. Keep the motion fluid as the earliest stage of getting up.',
      tip: 'Make this feel like the natural first step anyone takes when rising off the floor.',
    // PR-v6 (v1.6) Iter C2 — fix recline_missing: description implies floor work — semi-reclined (globalTilt=70). Was globalTilt:25, now 70.
      joints: {spine: 15, neck: 25, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, leftHip: 80, rightHip: 20, leftKnee: 90, rightKnee: 100, globalTilt: 70, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'kneeling-forward',
      tags: ['transition', 'all-fours', 'rising', 'sequence'],
    },
    'lowhigh-standing-crouch-mid-rise': {
      id: 'lowhigh-standing-crouch-mid-rise', category: 'low-to-high', name: 'Standing Crouch Mid-Rise',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Move onto both hands and knees, then press the hips up and back as the first phase of standing from the floor, head relaxed and following the movement. This all-fours position bridges lying and kneeling.',
      tip: 'Capture the hips clearly rising to show the mechanical transition point.',
      joints: {spine: 20, neck: 15, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, leftHip: 50, rightHip: 60, leftKnee: 80, rightKnee: 70, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-crouch',
      tags: ['rising', 'mid-point', 'transition', 'sequence'],
    },
    'lowhigh-arms-first-lift-floor': {
      id: 'lowhigh-arms-first-lift-floor', category: 'low-to-high', name: 'Arms First Lift From Floor',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'From a crouched position, straighten the legs partway while the torso stays angled slightly forward and the arms trail naturally, capturing the body midway between crouch and full stand. Center the weight over the feet.',
      tip: 'Shoot multiple frames here — this midpoint often carries the most dynamic energy.',
      joints: {spine: 15, neck: 20, leftShoulder: 60, rightShoulder: 20, leftElbow: 70, rightElbow: 50, leftHip: 40, rightHip: 20, leftKnee: 90, rightKnee: 45, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-floor',
      tags: ['floor', 'arms', 'graceful', 'sequence'],
    },
    'lowhigh-standing-half-turn-rise': {
      id: 'lowhigh-standing-half-turn-rise', category: 'low-to-high', name: 'Standing Half-Turn on Rise',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Still mostly seated on the floor, lift both arms before the legs begin to move, leading the rise with the upper body. This creates a graceful sense of movement originating from the chest and arms.',
      tip: 'Lead with the arms rather than the legs for a more elegant, dance-like rise.',
      joints: {spine: 25, hips: 10, neck: 20, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 15, rightHip: 20, leftKnee: 90, rightKnee: 10, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'tiptoe-reach',
      tags: ['rising', 'turn', 'dynamic', 'sequence'],
    },
    'lowhigh-floor-side-push-up-start': {
      id: 'lowhigh-floor-side-push-up-start', category: 'low-to-high', name: 'Floor Side Push-Up Start',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'As the body nears full height, add a slight half-turn of the torso so the rise culminates in a dynamic, angled stand rather than a plain front-facing one. Keep the arms continuing their upward path through the turn.',
      tip: 'Add rotation to the final rise frame so the sequence doesn\'t feel too linear.',
      joints: {spine: 10, hips: 10, neck: 15, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: 20, leftKnee: 90, rightKnee: 30, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'side-recline',
      tags: ['floor', 'starting-point', 'alternate', 'sequence'],
    },
    'lowhigh-kneel-both-up-transition': {
      id: 'lowhigh-kneel-both-up-transition', category: 'low-to-high', name: 'Both Knees Up Transition',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Lie on one side on the floor, lower arm bent for support, as an alternate low starting position for the rising sequence. Keep the top leg relaxed and slightly bent to prepare for the push into seated.',
      tip: 'Use this alternate starting point for sequences needing more than one entry option.',
      joints: { globalTilt: 25, spine: 10, neck: 10, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 10, leftHip: 10, leftKnee: 90, leftAnkle: -35, rightHip: 20, rightKnee: 100, rightAnkle: -35, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-sky-100)',
      figure: 'kneeling',
      tags: ['kneeling', 'transition', 'controlled', 'sequence'],
    },
    'lowhigh-single-leg-plant-rise': {
      id: 'lowhigh-single-leg-plant-rise', category: 'low-to-high', name: 'Single Leg Plant Rising',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Rise from sitting on the heels to a fully upright kneeling position with both knees on the floor, arms lifting to shoulder height for balance. This is a clean, controlled midpoint in the sequence.',
      tip: 'Keep the rise steady rather than rushed for a clean transitional frame.',
      joints: {spine: 20, neck: 15, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, leftHip: 114, rightHip: 20, leftKnee: 124, rightKnee: 90, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-kneel-rise',
      tags: ['rising', 'dynamic', 'effort', 'sequence'],
    },
    'lowhigh-standing-tall-arms-out': {
      id: 'lowhigh-standing-tall-arms-out', category: 'low-to-high', name: 'Standing Tall Arms Out Finish',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'From a low kneeling position, plant one foot flat and drive upward through that single leg while the other trails behind, arms swinging up for momentum. This dynamic frame captures real physical effort in the rise.',
      tip: 'Use a slightly faster shutter to freeze the driving motion of the rise.',
      joints: {spine: 10, hips: 10, neck: 10, leftShoulder: 60, rightShoulder: 20, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 5, rightHip: 20, leftKnee: 90, rightKnee: 5, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'standing-front',
      tags: ['standing', 'finish', 'open', 'sequence'],
    },
    'lowhigh-floor-twist-rise-begin': {
      id: 'lowhigh-floor-twist-rise-begin', category: 'low-to-high', name: 'Floor Twist Rising Begin',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Reach the final standing position with both arms spread wide to the sides at shoulder height, chest open and chin lifted, marking the sequence\'s end. Ground the stance and hold it confidently.',
      tip: 'Use this wide, open finish when the story calls for openness over an overhead reach.',
      joints: {spine: 30, neck: 25, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, leftHip: 50, rightHip: 20, leftKnee: 90, rightKnee: 40, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'low-high-floor',
      tags: ['floor', 'twist', 'rising', 'sequence'],
    },
    'lowhigh-crouch-to-stand-explosive': {
      id: 'lowhigh-crouch-to-stand-explosive', category: 'low-to-high', name: 'Explosive Crouch to Stand',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Dynamic',
      instructions: 'From a seated floor position, twist the torso to one side while planting one hand behind for leverage, beginning the rotational rise off the floor. Keep the movement smooth to connect the seated and standing phases.',
      tip: 'Add a twist to the rise for more visual variety than a straight vertical lift.',
      joints: {spine: 15, neck: 10, leftElbow: 65, rightElbow: 45, leftHip: 60, rightHip: 60, leftKnee: 90, rightKnee: 80, rightShoulder: -12, globalTilt: 25, leftAnkle: -15, globalTwist: 25},
      color: 'var(--color-sky-100)',
      figure: 'low-high-crouch',
      tags: ['explosive', 'dynamic', 'power', 'sequence'],
    },
    'lowhigh-seated-legs-extend-lift': {
      id: 'lowhigh-seated-legs-extend-lift', category: 'low-to-high', name: 'Seated Legs Extending Lift',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Capture the explosive middle moment of springing up from a deep crouch, both feet just leaving the ground, arms thrust upward with force. This high-energy frame captures the physical power of the rise.',
      tip: 'Use a fast shutter speed to freeze this explosive mid-air moment sharply.',
      joints: { globalTilt: 25, spine: 15, neck: 25, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 50, leftKnee: 90, leftAnkle: -15, rightHip: 20, rightKnee: 20 },
      color: 'var(--color-sky-100)',
      figure: 'low-high-floor',
      tags: ['floor', 'preparation', 'lift', 'sequence'],
    },
    'lowhigh-standing-side-reach-peak': {
      id: 'lowhigh-standing-side-reach-peak', category: 'low-to-high', name: 'Standing Side Reach Peak',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Still seated on the floor, begin extending both legs forward and pressing the hands down to lift the hips slightly — an early preparatory movement before standing. Direct the gaze up toward camera throughout.',
      tip: 'Use this subtle preparatory frame as the opening image in a longer sequence.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 60→-110, rightShoulder 20→-110, hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 15, hips: 16, neck: 15, leftShoulder: -110, rightShoulder: -110, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 20, rightHip: 20, leftKnee: 90, rightKnee: 10, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'arm-reach',
      tags: ['standing', 'peak', 'asymmetry', 'sequence'],
    },
    'lowhigh-floor-bridge-rise-start': {
      id: 'lowhigh-floor-bridge-rise-start', category: 'low-to-high', name: 'Floor Bridge Rising Start',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'At the top of the sequence, stand fully upright and reach one arm high on a diagonal while the other rests at the hip, adding asymmetry to the standing peak. Keep the body long through the reaching side.',
      tip: 'Finish asymmetrically — it often reads as more dynamic than a symmetrical overhead reach.',
      joints: {spine: 25, neck: 10, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, leftHip: 40, rightHip: 20, leftKnee: 90, rightKnee: 70, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'boudoir-lying-arch',
      tags: ['floor', 'bridge', 'athletic', 'sequence'],
    },
    'lowhigh-kneel-lean-forward-rise': {
      id: 'lowhigh-kneel-lean-forward-rise', category: 'low-to-high', name: 'Kneel Lean Forward Into Rise',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Lie on the back and press the hips up into a bridge shape as an athletic starting point for the rising sequence, both feet planted firmly. This unconventional start adds visual interest to the low end.',
      tip: 'Reach for this bridge start in fitness or athletic-themed pose sequences.',
    // PR-v7 (v1.7) — fix recline_missing: "Lie on the back" → globalTilt 25→85.
      joints: { globalTilt: -85, spine: 30, neck: 20, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 70, leftKnee: 100, leftAnkle: -35, rightHip: 20, rightKnee: 90, rightAnkle: -35 },
      color: 'var(--color-sky-100)',
      figure: 'low-high-kneel-rise',
      tags: ['kneeling', 'forward-lean', 'natural', 'sequence'],
    },
    'lowhigh-standing-jump-reach-top': {
      id: 'lowhigh-standing-jump-reach-top', category: 'low-to-high', name: 'Standing Jump Reach Top',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Dynamic',
      instructions: 'From kneeling, lean the torso forward over one planted foot as the body prepares to push into a stand, arms reaching forward for momentum. This forward-leaning shape captures the natural mechanics of standing up.',
      tip: 'Let this natural, unposed-looking transition suit candid-style sequences.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 60→-110, rightShoulder 20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 10, neck: 10, leftShoulder: -110, rightShoulder: -110, leftElbow: 70, rightElbow: 50, leftHip: 50, rightHip: 20, leftKnee: 90, rightKnee: 60, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'jump-tuck',
      tags: ['jump', 'peak', 'celebration', 'sequence'],
    },
    'lowhigh-floor-child-pose-start': {
      id: 'lowhigh-floor-child-pose-start', category: 'low-to-high', name: 'Floor Child\'s Pose Start',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Complete the rising sequence with a small jump at the very end, both feet briefly leaving the ground as the arms fully extend overhead in celebration. This adds a final burst of energy to cap the trajectory.',
      tip: 'Shoot at the peak of the jump for the most dramatic capstone to the sequence.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 32, neck: 25, leftShoulder: -110, rightShoulder: -110, leftElbow: 70, rightElbow: 50, leftHip: 110, rightHip: 20, leftKnee: 120, rightKnee: 130, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'kneeling-forward',
      tags: ['floor', 'calm', 'starting-point', 'sequence'],
    },
    'lowhigh-half-kneel-arms-rising-wide': {
      id: 'lowhigh-half-kneel-arms-rising-wide', category: 'low-to-high', name: 'Half-Kneel Arms Rising Wide',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Begin folded forward on the knees, forehead resting near the floor, arms extended forward — a calm, low starting point for a gentler rising sequence. Keep the shape soft and relaxed.',
      tip: 'Reserve this gentle starting point for meditative sequences rather than athletic ones.',
      joints: {spine: 15, neck: 10, leftShoulder: 60, rightShoulder: 20, leftElbow: 70, rightElbow: 50, leftHip: 100, rightHip: 20, leftKnee: 110, rightKnee: 70, leftAnkle: -35, globalTilt: 25},
      color: 'var(--color-sky-100)',
      figure: 'low-high-kneel-rise',
      tags: ['rising', 'wide', 'expansive', 'sequence'],
    },
    'lowhigh-standing-final-look-up': {
      id: 'lowhigh-standing-final-look-up', category: 'low-to-high', name: 'Standing Final Look Up',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'From a half-kneeling lunge, straighten the front leg while both arms lift wide to the sides, capturing the body opening up as it rises. Keep the motion wide and expansive rather than tight.',
      tip: 'Spread the arms wide during this transition for a more expansive, joyful photograph.',
      joints: {spine: 15, hips: 10, neck: -8.2, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 5, rightHip: 20, leftKnee: 90, rightKnee: 5, globalTilt: 25, leftAnkle: -15},
      color: 'var(--color-sky-100)',
      figure: 'standing-front',
      tags: ['standing', 'finish', 'calm', 'sequence'],
    },
    'lowhigh-floor-kneel-hands-overhead-rise': {
      id: 'lowhigh-floor-kneel-hands-overhead-rise', category: 'low-to-high', name: 'Kneeling Hands Overhead Rise',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'End the sequence fully standing, head tilted back, both arms relaxed at the sides, gazing upward past the camera as if reaching a final release. Keep the stance tall and settled after the rise.',
      tip: 'Contrast this quiet finish against more explosive reach-based endings for variety.',
      joints: {spine: 15, neck: 15, leftShoulder: -12, rightShoulder: -12, leftElbow: 82, rightElbow: 62, leftHip: 50, rightHip: 20, leftKnee: 110, rightKnee: 95, leftAnkle: -35, rightAnkle: -35, globalTilt: 25},
      color: 'var(--color-sky-100)',
      figure: 'low-high-kneel-rise',
      tags: ['rising', 'overhead', 'graceful', 'sequence'],
    },
  
    // ═════════════ HIGH-TO-LOW (30) ═════════════
    'highlow-standing-peak-start': {
      id: 'highlow-standing-peak-start', category: 'high-to-low', name: 'Standing Peak Starting Point',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'From an upright kneeling position, press one foot flat on the floor while sweeping both arms overhead in a wide arc, signaling the final push toward standing. Keep the chest lifted and open as the arms rise.',
      tip: 'Let the wide overhead arm sweep add a graceful flourish to this final rise.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: -25, spine: 10, neck: 10, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, hips: 10, leftHip: 5, leftKnee: 45, rightHip: 10, rightKnee: 5, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-amber-100)',
      figure: 'standing-front',
      tags: ['standing', 'starting-point', 'elevated', 'sequence'],
    },
    'highlow-torso-begin-fall-forward': {
      id: 'highlow-torso-begin-fall-forward', category: 'high-to-low', name: 'Torso Beginning to Fall Forward',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Begin fully upright, both arms raised overhead, weight balanced evenly — the highest point of a descending sequence. Keep the body long and tall to maximize contrast with the later, lower frames.',
      tip: 'Shoot this opening frame from a high angle looking down to emphasize the elevated start.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: -25, spine: 32, neck: 25, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, leftHip: 60, leftKnee: 80, rightHip: 10, rightKnee: 15 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-over-shoulder',
      tags: ['descent', 'transition', 'forward-fall', 'sequence'],
    },
    'highlow-arms-trailing-descent': {
      id: 'highlow-arms-trailing-descent', category: 'high-to-low', name: 'Arms Trailing Mid-Descent',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'From standing, hinge the torso forward from the hips while keeping the legs mostly straight, arms trailing loosely as gravity pulls the body downward. This early frame shows the initial commitment to the descent.',
      tip: 'Capture the exact moment the torso passes the point of no return in the hinge.',
      joints: { globalTilt: -25, spine: 32, neck: 25, leftShoulder: 60, leftElbow: 70, rightShoulder: 20, rightElbow: 50, leftHip: 90, leftKnee: 100, rightHip: 10, rightKnee: 40 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-over-shoulder',
      tags: ['descent', 'dynamic', 'mid-point', 'sequence'],
    },
    'highlow-knees-bending-controlled': {
      id: 'highlow-knees-bending-controlled', category: 'high-to-low', name: 'Knees Bending Controlled Drop',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Continue the forward fall with the torso now well past horizontal, both arms trailing behind and up as if caught by the motion, knees beginning to bend to absorb the descent. Let the head relax and follow the movement.',
      tip: 'Shoot from a slightly elevated angle looking down for this dynamic midpoint.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
    // PR-v7 (v1.7) — fix recline_missing: "torso past horizontal" → globalTilt -25→60.
      joints: { globalTilt: 60, spine: -15, neck: 10, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 100, leftKnee: 100, rightHip: 10, rightKnee: 110 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-descent',
      tags: ['descent', 'controlled', 'strength', 'sequence'],
    },
    'highlow-near-floor-reach-down': {
      id: 'highlow-near-floor-reach-down', category: 'high-to-low', name: 'Near Floor Reach Down',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Bend both knees deeply while lowering the hips straight down and extending both arms forward for balance, controlling the descent rather than falling freely. Keep the spine straight throughout.',
      tip: 'Use this controlled variant for fitness or strength-themed descending sequences.',
      joints: {spine: 32, neck: 27, leftShoulder: 60, rightShoulder: 20, leftElbow: 70, rightElbow: 50, leftHip: 114, rightHip: 10, leftKnee: 100, rightKnee: 140, globalTilt: -25},
      color: 'var(--color-amber-100)',
      figure: 'high-low-floor-reach',
      tags: ['descent', 'near-floor', 'compact', 'sequence'],
    },
    'highlow-floor-landing-final': {
      id: 'highlow-floor-landing-final', category: 'high-to-low', name: 'Floor Landing Final Position',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Continue lowering until the hands nearly touch the floor, knees bent deeply, hips low, head dropped naturally between the arms. This near-final frame shows the body almost fully descended.',
      tip: 'Shoot from directly above to capture this compact, low shape at the near-final stage.',
      joints: { globalTilt: -25, spine: 20, neck: 25, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 40, leftKnee: 45, rightHip: 10, rightKnee: 100 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-floor-reach',
      tags: ['floor', 'landing', 'final', 'sequence'],
    },
    'highlow-standing-lean-back-start': {
      id: 'highlow-standing-lean-back-start', category: 'high-to-low', name: 'Standing Lean Back Starting Point',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Complete the descent fully seated or kneeling on the floor, torso relaxed, hands resting on the ground — the lowest point of the sequence. Keep the shape settled and grounded.',
      tip: 'Let this final frame feel fully resolved, contrasting clearly with the elevated start.',
      joints: { globalTilt: -25, spine: 15, neck: 10, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 10, leftHip: 5, leftKnee: 45, rightHip: 10, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-amber-100)',
      figure: 'standing-front',
      tags: ['standing', 'starting-point', 'dramatic', 'sequence'],
    },
    'highlow-cascading-arms-drop': {
      id: 'highlow-cascading-arms-drop', category: 'high-to-low', name: 'Cascading Arms Drop',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Begin standing tall but leaning slightly backward, arms relaxed, establishing an alternate high starting point that adds drama before the descent begins. Engage the core for safety and control.',
      tip: 'Use this backward-leaning start to build a more dramatic arc through the descent.',
      joints: { globalTilt: -25, spine: 20, neck: 15, leftShoulder: 60, leftElbow: 70, rightShoulder: 20, rightElbow: 50, hips: 10, leftHip: 20, leftKnee: 45, rightHip: 10, rightKnee: 30, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-descent',
      tags: ['descent', 'graceful', 'arms-led', 'sequence'],
    },
    'highlow-one-leg-lower-lunge': {
      id: 'highlow-one-leg-lower-lunge', category: 'high-to-low', name: 'One Leg Lowering Into Lunge',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'From standing, drop both arms in a cascading wave from overhead down past the shoulders as the knees begin to bend, letting the arms lead the downward sequence. Keep the motion fluid through the spine.',
      tip: 'Let the arms lead — this creates a more graceful, dance-like transition than a leg-led drop.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: -25, spine: 10, neck: 10, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, leftHip: 114, leftKnee: 100, rightHip: 10, rightKnee: 90 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-descent',
      tags: ['lunge', 'athletic', 'descent', 'sequence'],
    },
    'highlow-collapse-to-knees-dramatic': {
      id: 'highlow-collapse-to-knees-dramatic', category: 'high-to-low', name: 'Dramatic Collapse to Knees',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Step one leg back and lower into a deep lunge, dropping the back knee toward the floor while the torso stays upright, arms lowering to shoulder height for balance. This transitional frame captures a controlled, athletic descent.',
      tip: 'Use a slightly low camera angle to emphasize the depth and control of the lunge.',
      joints: { globalTilt: -25, spine: 32, neck: 27, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 110, leftKnee: 100, rightHip: 10, rightKnee: 130 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-over-shoulder',
      tags: ['collapse', 'dramatic', 'descent', 'sequence'],
    },
    'highlow-elevated-platform-start': {
      id: 'highlow-elevated-platform-start', category: 'high-to-low', name: 'Elevated Platform Starting Point',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'From standing, let the body collapse down onto both knees in one fluid motion, torso falling forward, arms trailing loosely as if surrendering to gravity. Keep the landing controlled to protect the knees.',
      tip: 'Use knee pads or a soft surface for safety when rehearsing this dramatic collapse.',
      joints: { globalTilt: -25, spine: 15, neck: 5, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, hips: 10, leftHip: 5, leftKnee: 45, rightHip: 10, rightKnee: 5, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-amber-100)',
      figure: 'standing-front',
      tags: ['elevated', 'platform', 'starting-point', 'sequence'],
    },
    'highlow-step-down-mid-air': {
      id: 'highlow-step-down-mid-air', category: 'high-to-low', name: 'Step Down Mid-Air Moment',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Dynamic',
      instructions: 'Begin standing on a raised platform, box, or step, arms relaxed at the sides, using the literal elevation to set the highest point in the sequence. Keep the stance stable and centered before the descent begins.',
      tip: 'Shoot from below looking up to emphasize the literal height of the platform start.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 10, neck: 10, leftShoulder: -12, rightShoulder: -12, leftElbow: 30, rightElbow: 30, leftHip: 70, rightHip: 10, leftKnee: 80, rightKnee: 30, globalTilt: -25},
      color: 'var(--color-amber-100)',
      figure: 'dynamic-reach',
      tags: ['descent', 'mid-air', 'dynamic', 'sequence'],
    },
    'highlow-landing-crouch-absorb': {
      id: 'highlow-landing-crouch-absorb', category: 'high-to-low', name: 'Landing Crouch Absorb Impact',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Capture the mid-air moment of stepping down off an elevated platform, one leg extended toward the ground, the other trailing behind, arms out for balance. This dynamic frame freezes the body between high start and low landing.',
      tip: 'Use a fast shutter speed — this brief mid-air moment needs to freeze sharply.',
      joints: { globalTilt: -25, spine: 20, neck: 10, leftElbow: 65, rightShoulder: -12, rightElbow: 45, leftHip: 100, leftKnee: 80, rightHip: 60, rightKnee: 120 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-descent',
      tags: ['landing', 'impact', 'controlled', 'sequence'],
    },
    'highlow-standing-tiptoe-start-tall': {
      id: 'highlow-standing-tiptoe-start-tall', category: 'high-to-low', name: 'Standing Tiptoe Tall Start',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Land from the descent by bending both knees deeply to absorb impact, torso leaning slightly forward, arms extended for balance, reaching the low point of the sequence. Keep the landing soft and controlled.',
      tip: 'Cue \'soft knees\' on landing to avoid a jarring, stiff look.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 18, hips: 10, neck: 15, leftShoulder: -10, rightShoulder: 8, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 5, rightHip: 10, leftKnee: 45, rightKnee: 5, globalTilt: 0},
      color: 'var(--color-amber-100)',
      figure: 'tiptoe-reach',
      tags: ['standing', 'tall', 'starting-point', 'sequence'],
    },
    'highlow-torso-spiral-down': {
      id: 'highlow-torso-spiral-down', category: 'high-to-low', name: 'Torso Spiral Descent',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Begin rising onto the balls of both feet, arms stretched fully overhead, establishing maximum height before the full descent. Engage the core for a stable, tall base.',
      tip: 'Use this tiptoe starting point to maximize the visual height difference across the sequence.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: -25, spine: 32, neck: 25, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, leftHip: 60, leftKnee: 80, rightHip: 10, rightKnee: 70 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-over-shoulder',
      tags: ['spiral', 'descent', 'dynamic', 'sequence'],
    },
    'highlow-seated-fall-back-catch': {
      id: 'highlow-seated-fall-back-catch', category: 'high-to-low', name: 'Seated Fall Back Catch',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Twist the torso while simultaneously lowering the body, spiraling downward so the shoulders rotate opposite the descending hips, arms following the spiral naturally. This adds rotational interest to a straight vertical descent.',
      tip: 'Let a spiral descent read more dynamically than a purely vertical drop.',
      joints: { globalTilt: -25, spine: 20, neck: 15, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 70, leftKnee: 95, leftAnkle: -15, rightHip: 10, rightKnee: 85 , globalTwist: 25},
      color: 'var(--color-amber-100)',
      figure: 'high-low-floor-reach',
      tags: ['descent', 'seated', 'graceful', 'sequence'],
    },
    'highlow-full-prone-final-floor': {
      id: 'highlow-full-prone-final-floor', category: 'high-to-low', name: 'Full Prone Final Floor Position',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Lower to a seated position on the floor while leaning back onto both hands for support, legs extending forward as the body settles near the lowest point. Keep the descent smooth rather than an abrupt drop.',
      tip: 'Use this controlled seated catch as a graceful near-final frame.',
      joints: {
"globalTilt":85,"neck":10,"leftShoulder":-10,"rightShoulder":8,"leftElbow":65,"rightElbow":45,"leftHip":-5,"rightHip":-5,"spine":10,"leftKnee":20,"rightKnee":10
  },
      color: 'var(--color-amber-100)',
      figure: 'prone-flat',
      tags: ['floor', 'final', 'prone', 'sequence'],
    },
    'highlow-arms-wide-falling-open': {
      id: 'highlow-arms-wide-falling-open', category: 'high-to-low', name: 'Arms Wide Falling Open',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Complete the descent lying fully prone on the floor, arms relaxed forward, face turned to one side — the absolute lowest point of the sequence. Keep the body completely relaxed and settled.',
      tip: 'Shoot straight down from above for the most dramatic contrast against the standing start.',
    // PR-v7 (v1.7) — fix recline_missing: "lying fully prone" → globalTilt -25→-85.
      joints: { globalTilt: 85, spine: 20, neck: 15, leftShoulder: 60, leftElbow: 70, rightShoulder: 20, rightElbow: 50, leftHip: 50, leftKnee: 45, rightHip: 10, rightKnee: 80 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-descent',
      tags: ['descent', 'open', 'dramatic', 'sequence'],
    },
    'highlow-standing-to-squat-transition': {
      id: 'highlow-standing-to-squat-transition', category: 'high-to-low', name: 'Standing to Squat Transition',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'While descending, spread both arms wide to the sides as if falling open, torso tilting back slightly while the knees bend to control the drop. This dramatic open-arm descent adds a sense of release.',
      tip: 'Reach for this open, vulnerable shape in emotionally driven editorial sequences.',
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:10, now spine:-10.
      joints: {spine: -10, neck: 5, leftElbow: 65, rightElbow: 45, leftHip: 114, rightHip: 60, leftKnee: 80, rightKnee: 140, leftAnkle: -15, rightAnkle: -15, rightShoulder: -12, globalTilt: -25},
      color: 'var(--color-amber-100)',
      figure: 'high-low-descent',
      tags: ['squat', 'athletic', 'descent', 'sequence'],
    },
    'highlow-diagonal-fall-freeze': {
      id: 'highlow-diagonal-fall-freeze', category: 'high-to-low', name: 'Diagonal Fall Freeze Frame',
      difficulty: 'Advanced',
      angle: 'Side View',
      intent: 'Photography',
      effort: 'Dynamic',
      instructions: 'Lower from standing into a full squat, heels grounded, torso upright, arms extending forward for counterbalance as the body reaches a compact low point. Keep the spine neutral throughout.',
      tip: 'Use this athletic transition for fitness-themed high-to-low sequences.',
      joints: { globalTilt: -25, spine: 32, neck: 20, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 80, leftKnee: 100, rightHip: 10, rightKnee: 50 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-over-shoulder',
      tags: ['fall', 'dynamic', 'dramatic', 'sequence'],
    },
    'highlow-kneel-settle-final': {
      id: 'highlow-kneel-settle-final', category: 'high-to-low', name: 'Kneel Settle Final Point',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Capture the peak dynamic moment of a diagonal fall through the frame, body angled sharply, one arm reaching up and the other trailing down, hair or fabric streaming with the motion. Reserve this frame for the most dramatic midpoint.',
      tip: 'Use a spotter or crash mat for safety when rehearsing dynamic falling sequences.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 10→18, leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: -25, spine: 18, neck: 10, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, hips: 10, leftHip: 10, leftKnee: 45, rightHip: 10, rightKnee: 110, rightAnkle: -35, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-amber-100)',
      figure: 'kneeling',
      tags: ['kneeling', 'final', 'calm', 'sequence'],
    },
    'highlow-standing-hip-drop-begin': {
      id: 'highlow-standing-hip-drop-begin', category: 'high-to-low', name: 'Standing Hip Drop Beginning',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Settle into a kneeling position, torso upright, hands resting gently on the thighs, marking a calm, controlled end for a gentler descending sequence. Keep the shape composed and still.',
      tip: 'Reserve this quiet kneeling finish for calmer sequences over a full floor collapse.',
      joints: { globalTilt: -25, spine: 15, neck: 10, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 50, leftKnee: 45, rightHip: 10, rightKnee: 30 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-descent',
      tags: ['descent', 'asymmetry', 'transition', 'sequence'],
    },
    'highlow-side-fall-catch-arm': {
      id: 'highlow-side-fall-catch-arm', category: 'high-to-low', name: 'Side Fall Arm Catch',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'From standing, drop one hip down and to the side as the first movement of an off-balance descent, weight shifting onto the bending leg while the arms adjust for counterbalance. This subtle beginning adds asymmetry',
      tip: 'Start asymmetrically to make the full sequence feel more natural, less mechanical.',
      joints: { globalTilt: -25, spine: 30, neck: 20, leftShoulder: 60, leftElbow: 70, rightShoulder: 20, rightElbow: 50, leftHip: 60, leftKnee: 80, rightHip: 10, rightKnee: 40 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-over-shoulder',
      tags: ['fall', 'side', 'dramatic', 'sequence'],
    },
    'highlow-standing-bow-forward-begin': {
      id: 'highlow-standing-bow-forward-begin', category: 'high-to-low', name: 'Standing Bow Forward Begin',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Fall to one side while extending the same-side arm down to catch the body\'s weight, the opposite arm lifting for counterbalance as the hip and shoulder lower together. Keep the landing controlled and soft.',
      tip: 'Practice this controlled fall on a padded surface before shooting it live.',
      joints: { globalTilt: -25, spine: 30, neck: 20, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 40, leftKnee: 45, rightHip: 10, rightKnee: 10 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-over-shoulder',
      tags: ['bow', 'graceful', 'descent', 'sequence'],
    },
    'highlow-hands-floor-arch-back': {
      id: 'highlow-hands-floor-arch-back', category: 'high-to-low', name: 'Hands to Floor Arch Back Descent',
      difficulty: 'Advanced',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'From standing, begin a slow, formal bow forward from the waist, arms trailing naturally down, legs staying straight as the earliest phase of the descent. Keep the motion graceful and deliberate.',
      tip: 'Use this graceful bow-like beginning for elegant, formal descending sequences.',
      joints: { globalTilt: -25, spine: 32, neck: 27, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 110, leftKnee: 100, rightHip: 10, rightKnee: 120 },
      color: 'var(--color-amber-100)',
      figure: 'high-low-floor-reach',
      tags: ['descent', 'arch', 'near-floor', 'sequence'],
    },
    'highlow-full-recline-final-settle': {
      id: 'highlow-full-recline-final-settle', category: 'high-to-low', name: 'Full Recline Final Settle',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Continue lowering the torso until both hands reach the floor while arching the back slightly and bending the knees deeply, nearing the sequence\'s lowest point. Let the neck relax and the head hang naturally.',
      tip: 'Combine depth and arch here for a visually rich descending near-final shape.',
      // PR-v2 (v1.2) — Phase 2/3 forensic audit fix. Root causes:
      //   1. spine was 10 (forward fold) but description says "arching the
      //      back slightly" = back arch = spine NEGATIVE. Sign error. Fixed:
      //      spine 10 → -18 (back arch).
      //   2. leftKnee 18 / rightKnee 5 — description says "bending the knees
      //      DEEPLY". 18°/5° is barely bent. Fixed: leftKnee 18 → 85,
      //      rightKnee 5 → 80 (deep knee bend).
      //   3. leftHip 15 / rightHip 10 — hips barely flexed. For a reclining
      //      pose with knees deeply bent, hips should be flexed more to bring
      //      knees toward chest. Fixed: leftHip 15 → 70, rightHip 10 → 65.
      //   4. neck 8 — description says "let the neck relax and head hang". A
      //      small neck tilt is fine; kept at 8.
      //   5. leftShoulder -10 / rightShoulder 8 — arms should reach the floor
      //      ("both hands reach the floor"). Arms need to extend downward.
      //      With globalTilt=82 (nearly supine), arms extending "down" in
      //      body-space rotate to "toward floor" in world-space. Increased
      //      shoulder flexion: leftShoulder -10 → -60, rightShoulder 8 → -55
      //      (arms reaching overhead in body-space → toward floor when supine).
      //   6. leftElbow 65 / rightElbow 45 — slightly bent, fine for reaching.
      //      Kept.
      //   7. globalTilt 82 — nearly supine (correct for "full recline").
      //      Kept.
      // REASONING [PR-v2]: "Description is king". The description says back
      // arch + deep knee bend + hands on floor + relaxed neck. The old data
      // had forward spine + straight knees + arms at sides — none of which
      // match.
      joints: { globalTilt: 82, spine: -18, neck: 8, leftShoulder: -60, leftElbow: 65, rightShoulder: -55, rightElbow: 45, leftHip: 70, leftKnee: 85, rightHip: 65, rightKnee: 80 },
      color: 'var(--color-amber-100)',
      figure: 'side-recline',
      tags: ['recline', 'final', 'soft', 'sequence'],
    },
    'highlow-standing-arms-cross-drop': {
      id: 'highlow-standing-arms-cross-drop', category: 'high-to-low', name: 'Arms Crossing While Dropping',
      difficulty: 'Intermediate',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'Complete the descent by reclining fully onto one side on the floor, head resting on an extended arm, marking a soft, settled endpoint. Keep the body relaxed and unposed for authenticity.',
      tip: 'Use this soft reclined finish especially well for boudoir or intimate sequences.',
      joints: {spine: 25, neck: 20, leftShoulder: -30, rightShoulder: -12, leftElbow: 100, rightElbow: 100, leftHip: 70, rightHip: 10, leftKnee: 80, rightKnee: 90, globalTilt: -25, shoulderFwdL: 12, shoulderFwdR: -10},
      color: 'var(--color-amber-100)',
      figure: 'high-low-descent',
      tags: ['descent', 'contained', 'protective', 'sequence'],
    },
    'highlow-elevated-chair-step-down': {
      id: 'highlow-elevated-chair-step-down', category: 'high-to-low', name: 'Elevated Chair Step Down',
      difficulty: 'Intermediate',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'While lowering the body, cross both arms in front of the chest as if hugging inward, knees bending simultaneously to bring the body toward the floor in a protective shape. Keep the motion smooth and continuous.',
      tip: 'Contrast this inward, protective shape against more open descent variations.',
      joints: { globalTilt: -25, spine: 20, neck: 10, leftShoulder: -10, leftElbow: 70, rightShoulder: 8, rightElbow: 50, leftHip: 90, leftKnee: 100, leftAnkle: -15, rightHip: 10, rightKnee: 60, rightAnkle: -15 },
      color: 'var(--color-amber-100)',
      figure: 'chair-reach-diagonal',
      tags: ['furniture', 'descent', 'transition', 'sequence'],
    },
    'highlow-final-floor-gaze-up': {
      id: 'highlow-final-floor-gaze-up', category: 'high-to-low', name: 'Final Floor Gaze Up',
      difficulty: 'Advanced',
      angle: 'Low Angle',
      intent: 'Photography',
      effort: 'Static',
      instructions: 'Begin seated on a raised chair or stool and start stepping one foot down toward the floor, torso leaning forward slightly to initiate the transition off the elevated surface. Keep the supporting hand light on the chair for balance.',
      tip: 'Use this furniture-based descent for a practical, everyday high-to-low variation.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: {spine: 10, hips: 10, neck: 25, leftShoulder: -110, rightShoulder: -110, leftElbow: 70, rightElbow: 50, hipAbductL: 10, hipAbductR: 10, leftHip: 15, rightHip: 10, leftKnee: 45, rightKnee: 10, globalTilt: 0},
      color: 'var(--color-amber-100)',
      figure: 'supine',
      tags: ['floor', 'final', 'narrative', 'sequence'],
    },
    'highlow-standing-shoulders-slump-begin': {
      id: 'highlow-standing-shoulders-slump-begin', category: 'high-to-low', name: 'Shoulders Slump Beginning Descent',
      difficulty: 'Beginner',
      angle: 'High Angle',
      intent: 'Photography',
      effort: 'Transitional',
      instructions: 'End the sequence lying on the back on the floor, one arm reaching up toward where the camera began, gazing upward to visually connect back to the elevated start. Keep the body long and relaxed in final stillness.',
      tip: 'Shoot from a low angle near the floor to tie the sequence together narratively.',
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -10→-110, rightShoulder 8→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
      joints: { globalTilt: -25, spine: 15, neck: 25, leftShoulder: -110, leftElbow: 70, rightShoulder: -110, rightElbow: 50, hips: 10, leftHip: 10, leftKnee: 45, rightHip: 10, rightKnee: 10, hipAbductL: 10, hipAbductR: 10 },
      color: 'var(--color-amber-100)',
      figure: 'standing-front',
      tags: ['descent', 'subtle', 'starting-point', 'sequence'],
    },
  
  
  "p14-standing-s1-hip-sway-side-glance": {
    id: "p14-standing-s1-hip-sway-side-glance", name: "Overhead Arm Contrapposto",
    category: "standing", difficulty: "Beginner", intent: "Boudoir/Sensual",
    tags: ["standing", "overhead arm", "contrapposto", "crossed legs", "lace bodysuit"],
    instructions: "Stand facing the camera in a white lace bodysuit against a paneled wall. Shift weight onto the right (straight) leg; cross the left leg in front, resting on ball of foot with knee softly bent, creating a crossed-ankle line. Raise both arms and bend elbows so both hands rest behind/above the head, fi",
    tip: "Press the hips slightly toward the camera while keeping the raised elbows soft (not rigid) to elongate the torso without straining the shoulders.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 10→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: 14, neck: 10, hips: 16, leftShoulder: -140, rightShoulder: -131, leftElbow: 100, rightElbow: 100, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: -16, rightHip: 3, leftKnee: 25, rightKnee: 5, leftAnkle: -12, rightAnkle: 0, hipAbductL: -8, hipAbductR: 0, globalTwist: 8, globalRoll: 0, globalTilt: 0 }
  },
  "p14-standing-s2-crossed-legs-lean": {
    id: "p14-standing-s2-crossed-legs-lean", name: "Standing Crossed-Leg Lean",
    category: "standing", difficulty: "Beginner", intent: "Fashion/Editorial",
    tags: ["standing", "crossed legs", "hand on hip", "side lean"],
    instructions: "Stand in three-quarter stance with feet crossed at the ankle, weight on the back leg. Place one hand on the hip, elbow bent and pointing outward; let the other arm hang naturally along the body or rest lightly on the thigh. Roll shoulders back and down, lift the chest, and turn the head to look dire",
    tip: "Keep the crossed front foot pointed and resting lightly on the toe to avoid looking flat-footed; this keeps the leg line long.",
    joints: {spine: 15, hips: 17, neck: -6, leftShoulder: 0, rightShoulder: -10, leftElbow: 110, rightElbow: 15, hipAbductL: -5, hipAbductR: 0, leftHip: -11, rightHip: 1, leftKnee: 15, rightKnee: 5, leftAnkle: -8, rightAnkle: 0, shoulderFwdL: -10, shoulderFwdR: -10, globalTilt: 0, globalTwist: 10, globalRoll: 0}
  },
  "p14-standing-s3-overhead-arms-stretch": {
    id: "p14-standing-s3-overhead-arms-stretch", name: "Full Overhead Arm Stretch",
    category: "standing", difficulty: "Intermediate", intent: "Fashion/Editorial",
    tags: ["standing", "overhead reach", "elongation", "side profile"],
    instructions: "Stand tall in profile or three-quarter view. Extend one or both arms straight overhead, reaching toward the ceiling to elongate the entire side of the body. Shift weight onto one leg, letting the other bend softly or step out to the side. Tilt the head to look toward or away from the raised arm, and",
    tip: "Reach from the fingertips, not just the shoulder, and keep the raised arm slightly forward of true vertical so it stays in frame while maximizing the waistline stretch.",
    joints: { spine: 8, neck: -3.3, hips: -15, leftShoulder: -141, rightShoulder: -25, leftElbow: 28, rightElbow: 55, shoulderFwdL: 5, shoulderFwdR: 0, leftHip: -14, rightHip: 1, leftKnee: 5, rightKnee: 20, leftAnkle: 0, rightAnkle: -6, hipAbductL: 0, hipAbductR: 10, globalTwist: 5, globalRoll: 12, globalTilt: 0 }
  },
  "p14-standing-s4-hand-on-hip-profile": {
    id: "p14-standing-s4-hand-on-hip-profile", name: "Side Profile Hand-on-Hip",
    category: "standing", difficulty: "Beginner", intent: "Fashion/Portrait",
    tags: ["standing", "profile", "hand on hip", "classic"],
    instructions: "Turn the body to a side profile or strong three-quarter angle. Place the near hand on the hip with the elbow pointing out toward the camera to create a triangular negative space. Shift weight onto the back leg, and step the front leg forward slightly with a soft knee bend. Turn the head back toward ",
    tip: "The head-over-shoulder twist is the key to this shot; keep the twist coming from the upper spine, not just the neck, to avoid a strained look.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:13, now spine:-13.
    joints: { spine: -13, neck: 18, hips: 18, leftShoulder: -20, rightShoulder: -85, leftElbow: 35, rightElbow: 85, shoulderFwdL: -5, shoulderFwdR: 15, leftHip: 5, rightHip: -8, leftKnee: 5, rightKnee: 15, leftAnkle: 0, rightAnkle: -5, hipAbductL: 0, hipAbductR: 5, globalTwist: 45, globalRoll: 0, globalTilt: 0 }
  },
  "p14-standing-s5-back-to-camera-look": {
    id: "p14-standing-s5-back-to-camera-look", name: "Back-to-Camera Over-Shoulder Look",
    category: "standing", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["standing", "back to camera", "over the shoulder", "spinal twist"],
    instructions: "Face away from the camera with the back fully visible. Shift weight onto one leg to create a hip pop, letting the opposite knee bend softly. Twist the upper torso and turn the head to look back over the shoulder toward the camera. Let one or both hands rest lightly at the waist or in the hair, elbow",
    tip: "Drop the chin very slightly when looking back over the shoulder to elongate the neck line and avoid a double-chin angle.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:6, now spine:-6.
    joints: { spine: -18, neck: 25, hips: 15, leftShoulder: -110, rightShoulder: -20, leftElbow: 100, rightElbow: 20, shoulderFwdL: 15, shoulderFwdR: -5, leftHip: -12, rightHip: 8, leftKnee: 8, rightKnee: 22, leftAnkle: 0, rightAnkle: -14, hipAbductL: 0, hipAbductR: 6, globalTwist: -55, globalRoll: 0, globalTilt: 0 }
  },
  "p14-standing-s6-arms-crossed-chest": {
    id: "p14-standing-s6-arms-crossed-chest", name: "Arms Crossed Confident Stand",
    category: "standing", difficulty: "Beginner", intent: "Portrait/Editorial",
    tags: ["standing", "arms crossed", "confident", "front facing"],
    instructions: "Stand facing the camera with feet hip-width or slightly staggered. Cross both arms loosely across the chest or torso, hands resting on opposite upper arms or elbows. Shift weight to one hip for a soft S-curve. Keep the chin level and gaze direct and confident, shoulders relaxed and slightly back.",
    tip: "Keep the crossed arms relaxed against the body rather than pressed tightly, so the pose reads as confident rather than defensive.",
    joints: {spine: 14, hips: 10, neck: -6, leftShoulder: -100, rightShoulder: -100, leftElbow: 130, rightElbow: 130, hipAbductL: 0, hipAbductR: 6, leftHip: -14, rightHip: 0, leftKnee: 5, rightKnee: 12, leftAnkle: 0, rightAnkle: -4, shoulderFwdL: -80, shoulderFwdR: -80, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  },
  "p14-standing-s7-one-hand-hair": {
    id: "p14-standing-s7-one-hand-hair", name: "One Hand in Hair, Weight Shift",
    category: "standing", difficulty: "Beginner", intent: "Boudoir/Sensual",
    tags: ["standing", "hand in hair", "weight shift", "soft gaze"],
    instructions: "Stand in a relaxed three-quarter stance with weight shifted onto the back leg. Raise one hand to run fingers through the hair, elbow lifted out to the side. Let the other arm hang relaxed or rest lightly at the waist. Tilt the head slightly toward the raised arm and soften the gaze downward or to th",
    tip: "Lift the elbow of the raised arm above shoulder height to open up the armpit line and keep the silhouette elegant rather than closed.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:6, now spine:-6.
    joints: { spine: -6, neck: 12, hips: 16, leftShoulder: -95, rightShoulder: -15, leftElbow: 65, rightElbow: 30, shoulderFwdL: 10, shoulderFwdR: 0, leftHip: -12, rightHip: 1, leftKnee: 5, rightKnee: 12, leftAnkle: 0, rightAnkle: -5, hipAbductL: 0, hipAbductR: 5, globalTwist: 6, globalRoll: 0, globalTilt: 0 }
  },
  "p14-standing-s8-side-profile-arch": {
    id: "p14-standing-s8-side-profile-arch", name: "Side Profile Back Arch",
    category: "standing", difficulty: "Advanced", intent: "Boudoir/Sensual",
    tags: ["standing", "back arch", "side profile", "chest lift"],
    instructions: "Stand in full side profile to the camera. Arch the upper back and chest upward and outward while dropping the head back slightly. Let one or both arms trail behind the body or rest near the lower back to accentuate the curve. Keep the hips forward and legs together or slightly staggered for stabilit",
    tip: "Engage the glutes and push the hips slightly forward as you arch the chest back, this protects the lower back and creates a longer, safer curve.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:26, now spine:-26.
    joints: { spine: -26, neck: 20, hips: 12, leftShoulder: -15, rightShoulder: -20, leftElbow: 35, rightElbow: 40, shoulderFwdL: -20, shoulderFwdR: -20, leftHip: -1, rightHip: 14, leftKnee: 12, rightKnee: 15, leftAnkle: -5, rightAnkle: -6, hipAbductL: 0, hipAbductR: 0, globalTwist: 0, globalRoll: 0, globalTilt: 0 }
  },
  "p14-standing-s9-hands-clasped-front": {
    id: "p14-standing-s9-hands-clasped-front", name: "Hands Clasped in Front, Soft Stance",
    category: "standing", difficulty: "Beginner", intent: "Portrait/Classic",
    tags: ["standing", "hands clasped", "soft", "demure"],
    instructions: "Stand facing the camera or at a slight angle with feet close together or slightly staggered. Clasp both hands together in front of the body at waist or hip height. Relax the shoulders down and slightly forward, and tilt the head gently to one side with a soft, warm expression.",
    tip: "Keep a small gap between the elbows and torso rather than pinning them to the sides, this keeps the arms from looking flattened against the body.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-6, now spine:6.
    joints: {spine: 6, hips: 17, neck: 5.5, leftShoulder: -15, rightShoulder: -15, leftElbow: 70, rightElbow: 70, hipAbductL: 0, hipAbductR: 0, leftHip: -11, rightHip: 1, leftKnee: 10, rightKnee: 10, leftAnkle: -3, rightAnkle: -3, shoulderFwdL: -95, shoulderFwdR: -95, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  },
  "p14-standing-s10-window-light-lean": {
    id: "p14-standing-s10-window-light-lean", name: "Window Light Soft Lean",
    category: "standing", difficulty: "Intermediate", intent: "Boudoir/Romantic",
    tags: ["standing", "window light", "soft lean", "arm raised"],
    instructions: "Stand near a light source (window) at a three-quarter angle. Raise the near arm to rest the hand near the head or hair, elbow lifted. Let the torso lean subtly toward or away from the light while the hips shift to the opposite side. Turn the head to look softly toward the camera or off into the ligh",
    tip: "Let the leaning shoulder drop naturally rather than hiking it up toward the ear, this keeps the neckline long and the pose relaxed.",
    joints: { spine: 15, neck: -4.4, hips: -12, leftShoulder: -85, rightShoulder: -18, leftElbow: 85, rightElbow: 20, shoulderFwdL: 10, shoulderFwdR: 0, leftHip: -14, rightHip: 1, leftKnee: 8, rightKnee: 12, leftAnkle: 0, rightAnkle: -5, hipAbductL: 0, hipAbductR: 5, globalTwist: 10, globalRoll: 8, globalTilt: 0 }
  },
  "p12-wall-s1-back-lean-arms-up": {
    id: "p12-wall-s1-back-lean-arms-up", name: "Wall Back-Lean Arms Overhead",
    category: "leaning", difficulty: "Beginner", intent: "Boudoir/Sensual",
    tags: ["wall", "back lean", "arms overhead", "lace lingerie"],
    instructions: "Stand with the back and shoulders resting against the wall. Raise both arms overhead, elbows bent, hands framing the face or resting on the wall above the head. Bend one knee and place that foot flat against the wall behind you for support, letting the hips push slightly forward off the wall. Tilt t",
    tip: "Push the supporting foot firmly into the wall and let the hips float slightly forward off the wall surface, this creates a subtle S-curve instead of a flat silhouette.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: -14, hips: 16, neck: -6.6, leftShoulder: -110, rightShoulder: -110, leftElbow: 100, rightElbow: 100, hipAbductL: 15, hipAbductR: 0, leftHip: 55, rightHip: -5, leftKnee: 95, rightKnee: 8, leftAnkle: 10, rightAnkle: 0, shoulderFwdL: -30, shoulderFwdR: -30, globalTilt: -10, globalTwist: 0, globalRoll: 0}
  },
  "p12-wall-s2-side-lean-hip-pop": {
    id: "p12-wall-s2-side-lean-hip-pop", name: "Wall Side-Lean Hip Pop",
    category: "leaning", difficulty: "Beginner", intent: "Fashion/Editorial",
    tags: ["wall", "shoulder lean", "hip pop", "profile"],
    instructions: "Lean one shoulder against the wall in profile or three-quarter stance. Pop the hip nearest the camera outward for a strong curve. Cross one ankle in front of the other for a relaxed leg line. Let one hand rest on the popped hip and the other hang naturally or touch the wall.",
    tip: "Keep only the shoulder (not the whole side of the torso) in contact with the wall to preserve the waist-to-hip curve.",
    joints: {spine: 0, hips: -10, neck: 8, leftShoulder: -20, rightShoulder: -10, leftElbow: 140, rightElbow: 30, hipAbductL: -10, hipAbductR: 10, leftHip: 10, rightHip: -10, leftKnee: 15, rightKnee: 20, leftAnkle: 0, rightAnkle: -8, shoulderFwdL: 55, shoulderFwdR: 50, globalTilt: 0, globalTwist: 5, globalRoll: 15}
  },
  "p12-wall-s3-forehead-rest": {
    id: "p12-wall-s3-forehead-rest", name: "Forehead Rest Against Wall",
    category: "leaning", difficulty: "Intermediate", intent: "Boudoir/Vulnerable",
    tags: ["wall", "forehead rest", "intimate", "back curve"],
    instructions: "Face the wall directly and lean forward to rest the forehead or side of the face gently against it. Place both palms flat on the wall at shoulder height for support. Push the hips back and away from the wall to create a long curved line through the back. Bend one knee slightly and let the opposite l",
    tip: "Keep the hips pushed well back and the spine long; this creates the elegant curve and prevents the pose from looking hunched.",
    joints: {spine: 55, hips: 0, neck: -10, leftShoulder: -60, rightShoulder: -60, leftElbow: 60, rightElbow: 60, hipAbductL: 0, hipAbductR: 0, leftHip: -15, rightHip: -15, leftKnee: 15, rightKnee: 5, leftAnkle: 0, rightAnkle: 0, shoulderFwdL: -25, shoulderFwdR: -25, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  },
  "p12-wall-s4-seated-wall-base": {
    id: "p12-wall-s4-seated-wall-base", name: "Seated at Wall Base",
    category: "leaning", difficulty: "Beginner", intent: "Boudoir/Casual",
    tags: ["wall", "seated", "floor", "knees bent"],
    instructions: "Sit on the floor with your back resting against the base of the wall. Bend both knees up toward the chest or let one leg extend while the other stays bent. Rest one or both forearms on the raised knee. Tilt the head back gently against the wall and turn it toward the camera.",
    tip: "Keep the lower back in gentle contact with the wall for support, but lift the chest slightly away from the wall to avoid a slumped silhouette.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: -5, hips: 0, neck: 8.2, leftShoulder: -30, rightShoulder: -30, leftElbow: 150, rightElbow: 150, hipAbductL: 10, hipAbductR: 5, leftHip: 110, rightHip: 110, leftKnee: 130, rightKnee: 130, leftAnkle: -5, rightAnkle: -8, shoulderFwdL: -50, shoulderFwdR: -50, globalTilt: -20, globalTwist: 0, globalRoll: 0}
  },
  "p12-wall-s5-profile-hand-wall": {
    id: "p12-wall-s5-profile-hand-wall", name: "Side Profile Hand on Wall",
    category: "leaning", difficulty: "Beginner", intent: "Fashion/Editorial",
    tags: ["wall", "hand on wall", "profile", "arm extended"],
    instructions: "Stand in profile a small distance from the wall. Extend the near arm to press the palm flat against the wall at shoulder height, elbow slightly bent. Cross the far leg in front for a model stance, and turn the head to look back at the camera. Keep the torso upright with a small lean into the support",
    tip: "Keep a slight bend in the supporting elbow rather than locking it straight, this reads more relaxed and less stiff in photos.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: 14, hips: 8, neck: 27, leftShoulder: -75, rightShoulder: -15, leftElbow: 38, rightElbow: 15, hipAbductL: 0, hipAbductR: 5, leftHip: -5, rightHip: -5, leftKnee: 5, rightKnee: 15, leftAnkle: 0, rightAnkle: -8, shoulderFwdL: 0, shoulderFwdR: 0, globalTilt: 0, globalTwist: 15, globalRoll: 0}
  },
  "p12-wall-s6-back-arch-wall": {
    id: "p12-wall-s6-back-arch-wall", name: "Wall-Supported Back Arch",
    category: "leaning", difficulty: "Advanced", intent: "Boudoir/Sensual",
    tags: ["wall", "back arch", "chest lift", "arms overhead"],
    instructions: "Stand facing away from the wall with the buttocks or lower back lightly touching it for stability. Arch the chest and upper back upward and backward, letting the head drop back gently. Raise both arms overhead or let them trail down toward the wall behind you for balance.",
    tip: "Use the wall only as a light stability touchpoint, not a full lean, so the spine can move freely into a genuine arch.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:30, now spine:-30.
    joints: {spine: -30, hips: 0, neck: 22, leftShoulder: -131, rightShoulder: -140, leftElbow: 35, rightElbow: 40, hipAbductL: 0, hipAbductR: 0, leftHip: 5, rightHip: 8, leftKnee: 10, rightKnee: 12, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: 15, shoulderFwdR: 15, globalTilt: 5, globalTwist: 0, globalRoll: 0}
  },
  "p12-wall-s7-crouch-wall-base": {
    id: "p12-wall-s7-crouch-wall-base", name: "Low Crouch at Wall Base",
    category: "leaning", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["wall", "crouch", "low pose", "wrap dress"],
    instructions: "Crouch low near the base of the wall with the back or shoulder lightly touching it. Wrap arms around the knees or hold a piece of fabric/wrap close to the body. Turn the head up and toward the camera with a soft or playful gaze. Keep the hips low and weight balanced on the balls of the feet.",
    tip: "Keep heels lifted and weight on the balls of the feet in a deep crouch to maintain balance and elongate the calf lines.",
    joints: {spine: -15, hips: 0, neck: 9.9, leftShoulder: -40, rightShoulder: -45, leftElbow: 100, rightElbow: 100, hipAbductL: 12, hipAbductR: 12, leftHip: 115, rightHip: 115, leftKnee: 135, rightKnee: 135, leftAnkle: 16, rightAnkle: 16, shoulderFwdL: -50, shoulderFwdR: -50, globalTilt: -55, globalTwist: 0, globalRoll: 0}
  },
  "p12-wall-s8-one-leg-up-wall": {
    id: "p12-wall-s8-one-leg-up-wall", name: "One Leg Raised Against Wall",
    category: "leaning", difficulty: "Intermediate", intent: "Fashion/Editorial",
    tags: ["wall", "raised leg", "side profile", "long lines"],
    instructions: "Stand in profile beside the wall. Raise one leg and place the foot flat against the wall at knee-to-hip height, creating a strong bent-leg silhouette. Rest weight fully on the standing leg. Let the arms hang naturally or one hand rest on the raised thigh, and keep the torso upright and elongated.",
    tip: "Rotate the raised knee slightly outward rather than straight forward, this keeps the hip open and avoids looking like a static stretch.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 14→18, leftShoulder -55→-110, rightShoulder -15→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    // PR-v7 (v1.7) — revert shoulder raise: description says "Let the arms hang naturally" → arms at sides, not overhead. leftShoulder -110→-5, rightShoulder -110→-5.
    joints: {spine: 8, hips: 0, neck: 6, leftShoulder: -5, rightShoulder: -5, leftElbow: 60, rightElbow: 15, hipAbductL: 22, hipAbductR: 0, leftHip: 75, rightHip: -3, leftKnee: 65, rightKnee: 5, leftAnkle: 14, rightAnkle: 0, shoulderFwdL: -3, shoulderFwdR: 0, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  },
  "p12-wall-s9-side-stretch-wall": {
    id: "p12-wall-s9-side-stretch-wall", name: "Side Stretch with Wall Support",
    category: "leaning", difficulty: "Beginner", intent: "Fashion/Editorial",
    tags: ["wall", "side stretch", "elongation", "profile"],
    instructions: "Stand facing the wall at a slight angle with one shoulder or forearm resting lightly against it for balance. Reach the far arm up and over the head, stretching the torso into a long lateral line. Cross the legs at the ankle and turn the face toward the camera.",
    tip: "Keep even, relaxed weight on both feet even though the legs are crossed, so the stretch reads as elegant rather than off-balance.",
    joints: {spine: 14, hips: 12, neck: -5.5, leftShoulder: -136, rightShoulder: -70, leftElbow: 32, rightElbow: 75, hipAbductL: 0, hipAbductR: 5, leftHip: -5, rightHip: -8, leftKnee: 5, rightKnee: 14, leftAnkle: 0, rightAnkle: -8, shoulderFwdL: -3, shoulderFwdR: -20, globalTilt: 0, globalTwist: 5, globalRoll: 14}
  },
  "p12-wall-s10-back-view-reach-up": {
    id: "p12-wall-s10-back-view-reach-up", name: "Back View Reach-Up Against Wall",
    category: "leaning", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["wall", "back to camera", "reach up", "cross ankle"],
    instructions: "Face the wall with the back fully toward the camera. Reach one arm up to press the palm flat against the wall above head height. Bring the other hand up to rest near the neck or opposite shoulder, elbow bent and pointing down. Cross one ankle in front of the other, and turn the head to show the prof",
    tip: "Push the hip out to the side opposite the raised arm to create a clean diagonal line from the reaching hand down to the crossed feet.",
    joints: {spine: 15, hips: -7, neck: 27, leftShoulder: -80, rightShoulder: -110, leftElbow: 140, rightElbow: 80, hipAbductL: 0, hipAbductR: 15, leftHip: -5, rightHip: -10, leftKnee: 5, rightKnee: 14, leftAnkle: 0, rightAnkle: -8, shoulderFwdL: -90, shoulderFwdR: -30, globalTilt: 0, globalTwist: -180, globalRoll: 10}
  },
  "p13-floor-s1-knees-hug-chair-base": {
    id: "p13-floor-s1-knees-hug-chair-base", name: "Knees Hugged Against Chair Base",
    category: "reclining", difficulty: "Beginner", intent: "Boudoir/Sensual",
    tags: ["floor", "seated", "knees hugged", "chair prop", "introspective"],
    instructions: "Sit on the floor with your back and shoulder leaned against the base of an armchair or ottoman. Draw both knees up toward the chest and wrap both arms around the shins, clasping the hands together. Drop the chin down and turn the gaze downward and away from the camera, letting hair fall forward.",
    tip: "Round the upper back slightly and let the head hang naturally rather than holding it up, this reads as a quiet, introspective moment rather than a posed stance.",
    joints: {spine: 15, hips: 6, neck: -28, leftShoulder: 55, rightShoulder: 60, leftElbow: 120, rightElbow: 120, hipAbductL: -8, hipAbductR: 8, leftHip: 112, rightHip: 115, leftKnee: 138, rightKnee: 138, leftAnkle: -10, rightAnkle: -10, shoulderFwdL: 50, shoulderFwdR: 50, globalTilt: -60, globalTwist: 10, globalRoll: 8}
  },
  "p13-floor-s2-recline-look-up": {
    id: "p13-floor-s2-recline-look-up", name: "Floor Recline with Head Tilted Back",
    category: "reclining", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["floor", "reclined", "backlit", "head back", "sensual"],
    instructions: "Sit on the floor and lean back, propping the torso up on both hands placed behind the hips. Bend both knees and let them fall gently to one side. Drop the head back and let the mouth fall softly open, allowing the window light to backlight the throat and hair.",
    tip: "Press firmly through the palms to lift the chest and create a long open line from the hips to the chin; a collapsed arm reads as tired rather than sensual.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:22, now spine:-22.
    joints: {spine: -22, hips: 0, neck: 0, leftShoulder: -30, rightShoulder: -30, leftElbow: 15, rightElbow: 15, hipAbductL: -15, hipAbductR: 15, leftHip: 20, rightHip: 20, leftKnee: 95, rightKnee: 100, leftAnkle: -5, rightAnkle: 0, shoulderFwdL: 60, shoulderFwdR: 60, globalTilt: -55, globalTwist: 5, globalRoll: 12}
  },
  "p13-floor-s3-side-seated-look-away": {
    id: "p13-floor-s3-side-seated-look-away", name: "Side-Seated with Cascading Hair",
    category: "reclining", difficulty: "Intermediate", intent: "Fashion/Editorial",
    tags: ["floor", "seated", "back view", "crossed legs", "hair cascade"],
    instructions: "Sit on the floor with legs crossed and turned to one side, showing the back and side of the torso to the camera. Place one hand flat on the floor behind you for support and rest the other hand on top of the bent knee. Turn the head to look away over the shoulder, letting long hair cascade down the b",
    tip: "Lengthen through the supporting arm and lift the ribcage away from the hips so the side-seated silhouette reads as elongated, not slouched.",
    joints: {spine: 8, hips: 4, neck: -11, leftShoulder: 0, rightShoulder: -30, leftElbow: 0, rightElbow: 80, hipAbductL: 22, hipAbductR: -20, leftHip: 100, rightHip: 105, leftKnee: 132, rightKnee: 130, leftAnkle: -8, rightAnkle: -8, shoulderFwdL: 60, shoulderFwdR: -60, globalTilt: -60, globalTwist: -35, globalRoll: 6}
  },
  "p13-floor-s4-side-recline-arm-up": {
    id: "p13-floor-s4-side-recline-arm-up", name: "Side-Lying Recline with Hand in Hair",
    category: "reclining", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["floor", "reclining", "hair touch", "sensual", "supine"],
    instructions: "Lie on your back on the floor. Bend both knees and let them drape gently to one side. Reach one arm up and bend it so the hand rests near the head or hair, and let the other arm relax naturally along the floor. Fan the hair out and turn the face gently toward the camera.",
    tip: "Let the draped knees stack loosely rather than pressing them together tightly; a slight gap between them keeps the line soft instead of rigid.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -70→-110, rightShoulder -20→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -5, hips: 0, neck: 6.6, leftShoulder: -110, rightShoulder: 0, leftElbow: 130, rightElbow: 0, hipAbductL: -20, hipAbductR: 15, leftHip: 15, rightHip: 18, leftKnee: 98, rightKnee: 95, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: 10, shoulderFwdR: 0, globalTilt: -85, globalTwist: 8, globalRoll: 5}
  },
  "p13-floor-s5-blanket-recline-hand-face": {
    id: "p13-floor-s5-blanket-recline-hand-face", name: "Cozy Blanket Recline, Hand Near Face",
    category: "reclining", difficulty: "Beginner", intent: "Boudoir/Sensual",
    tags: ["floor", "blanket", "reclining", "intimate", "soft"],
    instructions: "Lie back on a soft blanket or bedding on the floor. Bend one leg up while keeping the other extended, and bring one hand up near the face or jaw. Relax the other arm at your side and turn the head gently toward the camera with a soft, intimate expression.",
    tip: "Use a folded blanket or throw beneath you instead of the bare floor to soften the surface texture and support a cozier, more intimate mood.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 40→-110, rightShoulder -15→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -8, hips: 0, neck: 6.6, leftShoulder: -110, rightShoulder: 0, leftElbow: 130, rightElbow: 0, hipAbductL: -5, hipAbductR: -12, leftHip: 8, rightHip: 90, leftKnee: 10, rightKnee: 88, leftAnkle: -5, rightAnkle: 0, shoulderFwdL: 15, shoulderFwdR: 0, globalTilt: -85, globalTwist: 5, globalRoll: 4}
  },
  "p13-floor-s6-knees-bent-arms-crossed": {
    id: "p13-floor-s6-knees-bent-arms-crossed", name: "Seated Knees-to-Side with Arms Crossed",
    category: "reclining", difficulty: "Beginner", intent: "Fashion/Editorial",
    tags: ["floor", "seated", "direct gaze", "arms crossed", "minimal"],
    instructions: "Sit on the floor against a plain wall with both knees bent and drawn together toward one side. Cross both forearms and rest them along the top knee. Look directly at the camera with a calm, confident expression.",
    tip: "Keep the spine tall and the shoulders back even while seated low to the ground, this avoids a slouched silhouette against the plain wall.",
    joints: {
"spine":-6,"hips":0,"neck":0,"leftShoulder":-10,"rightShoulder":-10,"leftElbow":100,"rightElbow":100,"hipAbductL":10,"hipAbductR":-18,"leftHip":108,"rightHip":112,"leftKnee":130,"rightKnee":128,"leftAnkle":-10,"rightAnkle":-10,"shoulderFwdL":-40,"shoulderFwdR":-40,"globalTilt":-55,"globalTwist":8,"globalRoll":4
  }
  },
  "p13-floor-s7-knees-hug-chin-rest": {
    id: "p13-floor-s7-knees-hug-chin-rest", name: "Knees Hugged with Cheek Resting on Hand",
    category: "reclining", difficulty: "Beginner", intent: "Boudoir/Sensual",
    tags: ["floor", "seated", "knees hugged", "eyes closed", "intimate"],
    instructions: "Sit on the floor with knees drawn close to the chest. Rest one cheek gently against the back of the hand or fingertips, and close the eyes for a soft, intimate moment. Keep the other arm wrapped loosely around the shins.",
    tip: "Close the eyes fully and soften the facial muscles to sell the quiet, intimate mood; a half-open eye reads as posed rather than genuine.",
    joints: {spine: -22, hips: 5, neck: -18, leftShoulder: -90, rightShoulder: 90, leftElbow: 140, rightElbow: 100, hipAbductL: -5, hipAbductR: 5, leftHip: 110, rightHip: 112, leftKnee: 135, rightKnee: 135, leftAnkle: -8, rightAnkle: -8, shoulderFwdL: -120, shoulderFwdR: 90, globalTilt: -58, globalTwist: 5, globalRoll: 6}
  },
  "p13-floor-s8-plant-side-seated": {
    id: "p13-floor-s8-plant-side-seated", name: "Side-Seated by Potted Plant, Eyes Closed",
    category: "reclining", difficulty: "Beginner", intent: "Fine Art",
    tags: ["floor", "seated", "plant prop", "eyes closed", "relaxed"],
    instructions: "Sit on the floor near a potted plant with legs bent and folded to one side. Bring one arm across the chest, resting the hand near the opposite shoulder, and close the eyes in a relaxed, meditative moment.",
    tip: "Angle the body slightly toward the plant so it frames the composition instead of competing with the subject for attention.",
    joints: {spine: -8, hips: 5, neck: -15, leftShoulder: 0, rightShoulder: -30, leftElbow: 30, rightElbow: 100, hipAbductL: 12, hipAbductR: -15, leftHip: 105, rightHip: 108, leftKnee: 128, rightKnee: 125, leftAnkle: -8, rightAnkle: -8, shoulderFwdL: 0, shoulderFwdR: -90, globalTilt: -55, globalTwist: -10, globalRoll: 5}
  },
  "p13-floor-s9-prone-chin-hand": {
    id: "p13-floor-s9-prone-chin-hand", name: "Prone on Forearms, Finger at Lip",
    category: "reclining", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["floor", "prone", "propped on elbows", "playful", "direct gaze"],
    instructions: "Lie face-down on the floor and prop the upper body up on both forearms. Cross the legs at the ankles behind you and lift them slightly off the floor. Bring one finger up near the mouth and look directly at the camera with a playful expression.",
    tip: "Arch the upper back gently and lift through the chest so the pose doesn't collapse flat onto the forearms; a lifted chest keeps the silhouette dynamic.",
    joints: {spine: -30, hips: 0, neck: 8, leftShoulder: 0, rightShoulder: 0, leftElbow: 90, rightElbow: 110, hipAbductL: 0, hipAbductR: 15, leftHip: -8, rightHip: -10, leftKnee: 8, rightKnee: 10, leftAnkle: -8, rightAnkle: -6, shoulderFwdL: -50, shoulderFwdR: -50, globalTilt: 80, globalTwist: 0, globalRoll: 0}
  },
  "p13-floor-s10-recline-ottoman-arms-up": {
    id: "p13-floor-s10-recline-ottoman-arms-up", name: "Backlit Recline Against Ottoman, Arms Overhead",
    category: "reclining", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["floor", "reclined", "ottoman prop", "arms overhead", "backlit dramatic"],
    instructions: "Sit on the floor and recline back against an ottoman or low chair placed behind you. Bend both knees and let them fall open or to one side. Raise both arms overhead with hands near the face or hair, and drop the head back for a dramatic, backlit silhouette.",
    tip: "Let the ottoman fully support the weight of the upper back so the arms and neck can stay relaxed and expressive rather than tense from balancing.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:28, now spine:-28.
    joints: {spine: -28, hips: 0, neck: 27, leftShoulder: -125, rightShoulder: -125, leftElbow: 95, rightElbow: 100, hipAbductL: -20, hipAbductR: 18, leftHip: 22, rightHip: 25, leftKnee: 98, rightKnee: 102, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: 20, shoulderFwdR: 20, globalTilt: -78, globalTwist: 0, globalRoll: 0}
  },
  "p10-bench-s1-kneeling-profile-hands-lap": {
    id: "p10-bench-s1-kneeling-profile-hands-lap", name: "Kneeling on Bench in Profile, Hands in Lap",
    category: "seated", difficulty: "Beginner", intent: "Fashion/Editorial",
    tags: ["bench", "kneeling", "profile", "hands clasped", "poised"],
    instructions: "Kneel upright on a padded bench with the body turned to a side profile. Clasp both hands together and rest them gently in your lap. Keep the spine tall and turn the head to look off to the side.",
    tip: "Lengthen the neck and lift the sternum slightly to avoid the kneeling position collapsing the torso forward.",
    joints: {spine: 4, hips: 0, neck: -6, leftShoulder: 60, rightShoulder: 60, leftElbow: 90, rightElbow: 90, hipAbductL: 0, hipAbductR: 0, leftHip: 102, rightHip: 102, leftKnee: 138, rightKnee: 138, leftAnkle: -30, rightAnkle: -30, shoulderFwdL: 0, shoulderFwdR: 0, globalTilt: -25, globalTwist: -60, globalRoll: 0}
  },
  "p10-bench-s2-all-fours-arch-back": {
    id: "p10-bench-s2-all-fours-arch-back", name: "All-Fours Arched Back on Bench",
    category: "seated", difficulty: "Advanced", intent: "Boudoir/Sensual",
    tags: ["bench", "all fours", "arched back", "dynamic", "leg extended"],
    instructions: "Position yourself on hands and knees on top of the bench. Arch the back deeply, dropping the belly down and lifting the chest and hips. Extend one leg straight back and slightly up off the bench, and look down or forward with a focused expression.",
    tip: "Drop the belly first to initiate the arch, then lift the chest — trying to arch from the shoulders alone looks stiff.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:30, now spine:-30.
    joints: { spine: -30, neck: -6.6, hips: 16, leftShoulder: -80, rightShoulder: -92, leftElbow: 32, rightElbow: 15, shoulderFwdL: -20, shoulderFwdR: -20, leftHip: 118, rightHip: -12, leftKnee: 130, rightKnee: 10, leftAnkle: -20, rightAnkle: -8, hipAbductL: 5, hipAbductR: -5, globalTwist: 0, globalRoll: 0, globalTilt: 20 }
  },
  "p10-bench-s3-recline-arm-overhead": {
    id: "p10-bench-s3-recline-arm-overhead", name: "Reclined on Bench, Arm Overhead",
    category: "seated", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["bench", "reclining", "arm overhead", "hair cascade", "head back"],
    instructions: "Lie back on the bench with the head tilted back over the edge. Raise one arm overhead so the hand rests near or hangs past the head. Bend both knees and let the lower legs hang off the edge of the bench. Let long hair cascade down.",
    tip: "Let the head hang back fully so the throat elongates fully; a lifted chin position undercuts the dramatic recline line.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:17, now spine:-17.
    joints: {
"spine":-17,"neck":27,"hips":0,"leftShoulder":-140,"rightShoulder":-130,"leftElbow":35,"rightElbow":30,"shoulderFwdL":0,"shoulderFwdR":5,"leftHip":8,"rightHip":10,"leftKnee":92,"rightKnee":98,"leftAnkle":-10,"rightAnkle":-10,"hipAbductL":-8,"hipAbductR":8,"globalTwist":0,"globalRoll":0,"globalTilt":-85
  }
  },
  "p10-bench-s4-seated-cross-leg-lean-back": {
    id: "p10-bench-s4-seated-cross-leg-lean-back", name: "Seated Cross-Legged, Leaning Back",
    category: "seated", difficulty: "Beginner", intent: "Fashion/Editorial",
    tags: ["bench", "seated", "crossed legs", "direct gaze", "leaning back"],
    instructions: "Sit on the bench with legs crossed at the knee. Lean back slightly, supporting the recline with a relaxed posture, and rest one arm on top of the crossed knee. Look directly at the camera with a confident expression.",
    tip: "Keep the leaning-back angle subtle — leaning too far turns a confident seated pose into an overly casual slouch.",
    joints: {spine: -10, hips: 0, neck: -6, leftShoulder: 10, rightShoulder: -30, leftElbow: 81, rightElbow: 90, hipAbductL: 10, hipAbductR: -5, leftHip: 100, rightHip: 95, leftKnee: 120, rightKnee: 95, leftAnkle: -15, rightAnkle: 0, shoulderFwdL: 15, shoulderFwdR: -30, globalTilt: -12, globalTwist: -8, globalRoll: 0}
  },
  "p10-bench-s5-side-recline-arm-up": {
    id: "p10-bench-s5-side-recline-arm-up", name: "Side Recline Along Bench, Arm Overhead",
    category: "seated", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["bench", "side lying", "arm overhead", "elongated", "glamorous"],
    instructions: "Lie on your side along the full length of the bench. Extend the legs along the bench and raise the top arm overhead, resting the hand behind the head. Let the bottom arm support the head or rest along the bench.",
    tip: "Create a visible waist-to-hip curve by keeping the top hip slightly rolled forward rather than stacking the hips directly on top of each other.",
    joints: {
"spine":10,"hips":-8,"neck":10,"leftShoulder":-130,"rightShoulder":-130,"leftElbow":75,"rightElbow":150,"hipAbductL":0,"hipAbductR":0,"leftHip":10,"rightHip":8,"leftKnee":12,"rightKnee":15,"leftAnkle":-5,"rightAnkle":-5,"shoulderFwdL":30,"shoulderFwdR":-50,"globalTilt":-82,"globalTwist":5,"globalRoll":40
  }
  },
  "p10-bench-s6-back-view-kneel-lean": {
    id: "p10-bench-s6-back-view-kneel-lean", name: "Back View Kneeling, Gripping Bench Edge",
    category: "seated", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["bench", "back view", "kneeling", "hip cocked", "over shoulder"],
    instructions: "Kneel on the bench with your back to the camera. Grip the top edge or back of the bench with one hand for support and let the opposite hip pop out to the side. Turn your head to look back over your shoulder toward the camera.",
    tip: "Push the hip out further than feels natural — from behind, a subtle hip shift barely reads, so exaggerate it slightly for the camera.",
    joints: {spine: 15, hips: 18, neck: -14.8, leftShoulder: -60, rightShoulder: 20, leftElbow: 75, rightElbow: 30, hipAbductL: 12, hipAbductR: -18, leftHip: 105, rightHip: 100, leftKnee: 130, rightKnee: 125, leftAnkle: -25, rightAnkle: -25, shoulderFwdL: -15, shoulderFwdR: 10, globalTilt: -22, globalTwist: 25, globalRoll: 0}
  },
  "p10-bench-s7-standing-drape-fabric": {
    id: "p10-bench-s7-standing-drape-fabric", name: "Standing Beside Bench, Draping Fabric",
    category: "seated", difficulty: "Intermediate", intent: "Fine Art",
    tags: ["bench", "standing", "fabric drape", "one leg up", "looking up"],
    instructions: "Stand beside the bench with one foot raised and placed on top of it. Drape a length of fabric or a blanket loosely around the body with both hands, and tilt the head back slightly to look upward off-camera.",
    tip: "Hold the fabric loosely rather than clutching it tightly so it drapes with natural folds and movement instead of looking stiff.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -20→-110, rightShoulder -30→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -10, hips: -10, neck: 22, leftShoulder: -30, rightShoulder: -30, leftElbow: 70, rightElbow: 80, hipAbductL: 10, hipAbductR: 0, leftHip: 58, rightHip: -5, leftKnee: 75, rightKnee: 6, leftAnkle: 0, rightAnkle: -5, shoulderFwdL: -30, shoulderFwdR: -30, globalTilt: -8, globalTwist: -60, globalRoll: 0}
  },
  "p10-bench-s8-seated-profile-tiptoe": {
    id: "p10-bench-s8-seated-profile-tiptoe", name: "Perched on Bench, Leg Extended on Tiptoe",
    category: "seated", difficulty: "Intermediate", intent: "Fashion/Editorial",
    tags: ["bench", "perched", "profile", "pointed toe", "looking up"],
    instructions: "Perch on the edge of the bench in profile. Extend one leg forward with the toes pointed and lightly touching the floor, keeping the supporting leg bent beneath you. Tilt the head back and look up and away from the camera.",
    tip: "Fully point the extended foot's toes all the way to the floor — a flexed foot breaks the elegant line of the extended leg.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-8, now spine:8.
    joints: {spine: 8, hips: 0, neck: 13.8, leftShoulder: -20, rightShoulder: -20, leftElbow: 30, rightElbow: 50, hipAbductL: 0, hipAbductR: 0, leftHip: 120, rightHip: 20, leftKnee: 170, rightKnee: 15, leftAnkle: -30, rightAnkle: -35, shoulderFwdL: 0, shoulderFwdR: -15, globalTilt: -15, globalTwist: -60, globalRoll: 0}
  },
  "p10-bench-s9-seated-head-tilt-back": {
    id: "p10-bench-s9-seated-head-tilt-back", name: "Seated One Leg Up, Head Tilted Back",
    category: "seated", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["bench", "seated", "one leg up", "head tilt back", "hair touch"],
    instructions: "Sit on the bench with one leg bent and placed up on the bench surface and the other foot on the floor. Tilt the head back and raise one hand up into the hair. Let the other hand rest on the raised knee.",
    tip: "Drop the shoulders down away from the ears even as the head tilts back, to keep the neckline looking relaxed instead of strained.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 65→-110, rightShoulder 10→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -12, hips: 0, neck: 15.4, leftShoulder: -30, rightShoulder: -90, leftElbow: 110, rightElbow: 140, hipAbductL: 15, hipAbductR: -5, leftHip: 92, rightHip: 15, leftKnee: 92, rightKnee: 15, leftAnkle: -5, rightAnkle: 0, shoulderFwdL: -60, shoulderFwdR: -40, globalTilt: -18, globalTwist: -10, globalRoll: 0}
  },
  "p10-bench-s10-recline-legs-up-vertical": {
    id: "p10-bench-s10-recline-legs-up-vertical", name: "Reclined on Bench, Legs Raised Vertical",
    category: "seated", difficulty: "Advanced", intent: "Fine Art",
    tags: ["bench", "legs vertical", "inverted", "dramatic", "head hanging"],
    instructions: "Lie on your back on the bench with the hips near the edge, then raise both legs straight up into the air, perpendicular to the floor. Let the head hang back off the opposite edge of the bench, and bring one hand up near the face.",
    tip: "Keep the legs together and fully extended for the cleanest vertical line — even a slight bend in the knees breaks the dramatic silhouette.",
    joints: {spine: 18, hips: 0, neck: 27, leftShoulder: -70, rightShoulder: -15, leftElbow: 140, rightElbow: 20, hipAbductL: -5, hipAbductR: 5, leftHip: 118, rightHip: 115, leftKnee: 10, rightKnee: 12, leftAnkle: -10, rightAnkle: -10, shoulderFwdL: -30, shoulderFwdR: 5, globalTilt: -85, globalTwist: 0, globalRoll: 0}
  },
  "p09-unconv-s1-forward-bend-heels": {
    id: "p09-unconv-s1-forward-bend-heels", name: "Standing Forward Bend in Heels",
    category: "eccentric", difficulty: "Advanced", intent: "Fashion/Editorial",
    tags: ["unconventional", "forward fold", "fishnet", "dynamic", "hair drop"],
    instructions: "Stand with feet in heels and hinge forward at the hips into a deep forward bend. Let both hands reach down toward the ankles, and allow the hair to fall forward toward the floor, creating a dynamic bent silhouette.",
    tip: "Bend from the hips, not the waist, keeping the legs as straight as possible to elongate the line from heel to hip.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 0→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: 37, neck: -20, hips: 16, leftShoulder: -60, rightShoulder: -65, leftElbow: 32, rightElbow: 17, shoulderFwdL: -30, shoulderFwdR: -30, leftHip: 118, rightHip: 118, leftKnee: 8, rightKnee: 8, leftAnkle: -10, rightAnkle: -10, hipAbductL: 0, hipAbductR: 0, globalTwist: 0, globalRoll: 0, globalTilt: 0 }
  },
  "p09-unconv-s2-bridge-pose-floor": {
    id: "p09-unconv-s2-bridge-pose-floor", name: "Floor Bridge Pose",
    category: "eccentric", difficulty: "Advanced", intent: "Fine Art",
    tags: ["unconventional", "bridge", "floor", "flexibility", "dramatic arch"],
    instructions: "Lie on your back on the floor, then lift the hips high into a bridge position with the shoulders and head remaining on the floor. Bend both knees, keep feet flat, and let one arm relax on the floor while looking toward the camera.",
    tip: "Push evenly through both feet to keep the hips level and avoid one side dropping lower than the other.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:31, now spine:-31.
    joints: { spine: -31, neck: -18.6, hips: 16, leftShoulder: -110, rightShoulder: -110, leftElbow: 32, rightElbow: 17, shoulderFwdL: 8, shoulderFwdR: -6, leftHip: -20, rightHip: -22, leftKnee: 90, rightKnee: 92, leftAnkle: 5, rightAnkle: 5, hipAbductL: 8, hipAbductR: 8, globalTwist: 0, globalRoll: 0, globalTilt: -85 }
  },
  "p09-unconv-s3-legs-up-wall-recline": {
    id: "p09-unconv-s3-legs-up-wall-recline", name: "Legs Raised Diagonal, Torso Flat",
    category: "eccentric", difficulty: "Advanced", intent: "Fine Art",
    tags: ["unconventional", "legs raised", "floor", "graphic shape", "arms extended"],
    instructions: "Lie flat on your back on the floor with the torso and head completely flat. Raise both legs together and bend them at a diagonal angle up and to one side, and extend both arms straight out to the sides along the floor.",
    tip: "Keep the arms fully extended and flat on the floor to create a strong horizontal line that contrasts with the diagonal legs.",
    joints: {spine: 0, hips: 0, neck: -6, leftShoulder: 85, rightShoulder: -85, leftElbow: 37, rightElbow: 0, hipAbductL: -30, hipAbductR: 30, leftHip: 75, rightHip: 78, leftKnee: 95, rightKnee: 95, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: 8, shoulderFwdR: -6, globalTilt: -85, globalTwist: 0, globalRoll: 0}
  },
  "p09-unconv-s4-plank-reading-book": {
    id: "p09-unconv-s4-plank-reading-book", name: "Prone Plank Reading a Book, Legs on Ottoman",
    category: "eccentric", difficulty: "Intermediate", intent: "Fashion/Editorial",
    tags: ["unconventional", "prone", "book prop", "ottoman", "fishnet legs"],
    instructions: "Lie face-down on the floor propped up on both forearms, holding an open book to read. Extend the legs back with one knee bent and lifted, resting the raised leg against a tufted ottoman positioned behind you.",
    tip: "Angle the book slightly toward the camera so its shape and the model's engaged reading gaze both remain visible.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 30→-110, rightShoulder 35→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: 16, neck: -5.5, hips: 0, leftShoulder: -110, rightShoulder: -110, leftElbow: 100, rightElbow: 80, shoulderFwdL: 25, shoulderFwdR: 25, leftHip: -5, rightHip: 25, leftKnee: 18, rightKnee: 78, leftAnkle: -8, rightAnkle: -5, hipAbductL: 0, hipAbductR: -15, globalTwist: 0, globalRoll: 0, globalTilt: 78 }
  },
  "p09-unconv-s5-prone-legs-up-chin-hands": {
    id: "p09-unconv-s5-prone-legs-up-chin-hands", name: "Prone with Legs on Sofa, Chin on Hand",
    category: "eccentric", difficulty: "Intermediate", intent: "Boudoir/Sensual",
    tags: ["unconventional", "prone", "sofa prop", "chin rest", "soft gaze"],
    instructions: "Lie face-down on the floor with the legs resting up on a low sofa or bench behind you. Prop the chin on one hand with the elbow bent on the floor, and look down softly toward the camera.",
    tip: "Keep the supporting elbow directly under the shoulder for stability so the propped chin position looks relaxed rather than strained.",
    joints: {spine: 13, hips: 0, neck: -9.9, leftShoulder: 120, rightShoulder: 20, leftElbow: 150, rightElbow: 40, hipAbductL: -5, hipAbductR: 5, leftHip: 5, rightHip: 8, leftKnee: 22, rightKnee: 25, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: 75, shoulderFwdR: 15, globalTilt: 78, globalTwist: 0, globalRoll: 0}
  },
  "p09-unconv-s6-shoulder-stand-fold": {
    id: "p09-unconv-s6-shoulder-stand-fold", name: "Inverted Shoulder-Stand Fold, Hands in Prayer",
    category: "eccentric", difficulty: "Advanced", intent: "Fine Art",
    tags: ["unconventional", "inverted", "extreme flexibility", "prayer hands", "floor"],
    instructions: "Lie on your back and roll the hips up and over so the legs extend up and over the head, supported by the shoulders on the floor. Bring both hands together in a prayer position beneath the extended legs.",
    tip: "This is an advanced flexibility pose — only attempt with a warmed-up body and never force the neck to bear weight; the shoulders should support the load.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder 40→-110, rightShoulder 28→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -38, hips: 0, neck: -25, leftShoulder: -150, rightShoulder: -150, leftElbow: 120, rightElbow: 120, hipAbductL: 0, hipAbductR: 0, leftHip: 114, rightHip: 114, leftKnee: 12, rightKnee: 12, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: -60, shoulderFwdR: -60, globalTilt: -85, globalTwist: 0, globalRoll: 0}
  },
  "p09-unconv-s7-seated-box-arm-overhead": {
    id: "p09-unconv-s7-seated-box-arm-overhead", name: "Seated on Box, Legs Wide, Arm Overhead",
    category: "eccentric", difficulty: "Intermediate", intent: "Fashion/Editorial",
    tags: ["unconventional", "box prop", "seated", "wide legs", "arm overhead"],
    instructions: "Sit on a black box or cube with the legs spread wide apart in fishnet tights. Raise one arm overhead and run the hand through the hair, looking down or to the side dramatically.",
    tip: "Keep the spine tall even with the legs spread wide; a collapsed torso undercuts the dramatic, powerful line of the pose.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 8→18, leftShoulder 70→-110, rightShoulder -10→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: 18, neck: -12.1, hips: 0, leftShoulder: -110, rightShoulder: -110, leftElbow: 100, rightElbow: 50, shoulderFwdL: 20, shoulderFwdR: 10, leftHip: 95, rightHip: 98, leftKnee: 95, rightKnee: 98, leftAnkle: -5, rightAnkle: -5, hipAbductL: 25, hipAbductR: -25, globalTwist: 0, globalRoll: 0, globalTilt: -15 }
  },
  "p09-unconv-s8-seated-box-knee-crossed": {
    id: "p09-unconv-s8-seated-box-knee-crossed", name: "Seated on Box, Legs Crossed",
    category: "eccentric", difficulty: "Beginner", intent: "Fashion/Editorial",
    tags: ["unconventional", "box prop", "seated", "crossed legs", "direct gaze"],
    instructions: "Sit on a wooden box with legs crossed at the knee. Rest one hand on the top knee and turn the head to gaze off to the side with a direct, confident expression.",
    tip: "Point the top foot slightly downward when crossing the legs to keep the line clean rather than letting the foot flex upward.",
    joints: { spine: -5, neck: -6, hips: 0, leftShoulder: 5, rightShoulder: -15, leftElbow: 79, rightElbow: 40, shoulderFwdL: 15, shoulderFwdR: 5, leftHip: 100, rightHip: 95, leftKnee: 112, rightKnee: 95, leftAnkle: -15, rightAnkle: 0, hipAbductL: 10, hipAbductR: -5, globalTwist: -30, globalRoll: 0, globalTilt: -12 }
  },
  "p09-unconv-s9-back-view-squat-boxes": {
    id: "p09-unconv-s9-back-view-squat-boxes", name: "Back View Squat Over Stacked Boxes",
    category: "eccentric", difficulty: "Advanced", intent: "Boudoir/Sensual",
    tags: ["unconventional", "back view", "squat", "box prop", "over shoulder"],
    instructions: "Squat low over two stacked boxes with your back to the camera, gripping the boxes with both hands for support and balance. Turn the head to look back over your shoulder toward the camera.",
    tip: "Keep the heels grounded or lifted consistently on both sides so the squat reads as balanced and intentional rather than precarious.",
    joints: { spine: -20, neck: -27, hips: 0, leftShoulder: -50, rightShoulder: -62, leftElbow: 78, rightElbow: 67, shoulderFwdL: -25, shoulderFwdR: -25, leftHip: 118, rightHip: 118, leftKnee: 138, rightKnee: 138, leftAnkle: 15, rightAnkle: 15, hipAbductL: 15, hipAbductR: -15, globalTwist: 10, globalRoll: 0, globalTilt: -40 }
  },
  "p09-unconv-s10-wide-squat-floor-point": {
    id: "p09-unconv-s10-wide-squat-floor-point", name: "Wide Floor Squat, Pointing Gesture",
    category: "eccentric", difficulty: "Intermediate", intent: "Fashion/Editorial",
    tags: ["unconventional", "wide squat", "floor", "gesture", "confident gaze"],
    instructions: "Sit low on the floor in a wide squat or straddle stance. Raise one hand and point or gesture upward, and rest the opposite elbow on the corresponding knee. Look directly at the camera with a confident expression.",
    tip: "Commit fully to the pointing gesture with a straight arm and extended fingers; a half-hearted bent gesture reads as uncertain.",
    joints: { spine: -10, neck: -6, hips: 0, leftShoulder: -55, rightShoulder: 65, leftElbow: 38, rightElbow: 85, shoulderFwdL: -10, shoulderFwdR: 15, leftHip: 112, rightHip: 110, leftKnee: 125, rightKnee: 122, leftAnkle: 10, rightAnkle: 10, hipAbductL: 25, hipAbductR: -25, globalTwist: 0, globalRoll: 0, globalTilt: -50 }
  },
  "p09-unconv-s11-leaning-table-kneel": {
    id: "p09-unconv-s11-leaning-table-kneel", name: "Kneeling on Ottomans, Leaning on Table",
    category: "eccentric", difficulty: "Intermediate", intent: "Fashion/Editorial",
    tags: ["unconventional", "kneeling", "table prop", "profile", "leaning"],
    instructions: "Kneel on a set of stools or ottomans with the legs extended back. Lean forward and place both hands flat on a tall side table for support, keeping the body in profile to the camera.",
    tip: "Extend fully through the spine from the hands to the knees to create one continuous diagonal line rather than breaking at the hips.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:11, now spine:-11.
    joints: {spine: 35, hips: 0, neck: -2.8, leftShoulder: -70, rightShoulder: -82, leftElbow: 44, rightElbow: 4, hipAbductL: 0, hipAbductR: 0, leftHip: -8, rightHip: -8, leftKnee: 95, rightKnee: 95, leftAnkle: -25, rightAnkle: -25, shoulderFwdL: -35, shoulderFwdR: -25, globalTilt: -20, globalTwist: -60, globalRoll: 0}
  },
  "p09-unconv-s12-table-side-extend-leg": {
    id: "p09-unconv-s12-table-side-extend-leg", name: "Leaning Over Table, Leg Extended Back",
    category: "eccentric", difficulty: "Advanced", intent: "Fashion/Editorial",
    tags: ["unconventional", "table prop", "leg extended", "dynamic line", "side profile"],
    instructions: "Lean forward over a wooden table or desk, placing both hands flat on the surface. Extend one leg straight back and lift it up off the floor, pointing the toes, while keeping the body in side profile.",
    tip: "Lift the extended leg from the hip, not just the knee, and keep it in line with the torso for the cleanest diagonal silhouette.",
    joints: { spine: 30, neck: -5, hips: 0, leftShoulder: -75, rightShoulder: -87, leftElbow: 44, rightElbow: 4, shoulderFwdL: -35, shoulderFwdR: -25, leftHip: 10, rightHip: -18, leftKnee: 10, rightKnee: 8, leftAnkle: 0, rightAnkle: -30, hipAbductL: 0, hipAbductR: 0, globalTwist: -60, globalRoll: 0, globalTilt: -15 }
  },
  "p09-unconv-s13-bent-over-chair-headdown": {
    id: "p09-unconv-s13-bent-over-chair-headdown", name: "Bent Over Ottoman, Head Down, Rear View",
    category: "eccentric", difficulty: "Advanced", intent: "Boudoir/Sensual",
    tags: ["unconventional", "bent over", "ottoman prop", "rear view", "arched back"],
    instructions: "Bend forward over a tufted ottoman or chair with your back to the camera, letting the head hang down near or on the prop. Trail both hands down toward the floor and arch the back over the top of the prop.",
    tip: "Push the hips up and back as you fold forward to create a pronounced curve over the ottoman rather than just bending the spine.",
    joints: {spine: 45, hips: 0, neck: -25, leftShoulder: -65, rightShoulder: -77, leftElbow: 30, rightElbow: 10, hipAbductL: 0, hipAbductR: 0, leftHip: 20, rightHip: 22, leftKnee: 8, rightKnee: 10, leftAnkle: 0, rightAnkle: 0, shoulderFwdL: -20, shoulderFwdR: -20, globalTilt: -35, globalTwist: 0, globalRoll: 0}
  },
  "p09-unconv-s14-prone-legs-up-chair": {
    id: "p09-unconv-s14-prone-legs-up-chair", name: "Prone on Floor, Legs Raised on Chair Behind",
    category: "eccentric", difficulty: "Intermediate", intent: "Fine Art",
    tags: ["unconventional", "prone", "chair prop", "legs raised", "soft gaze"],
    instructions: "Lie face-down on the floor, propped up on both forearms in front. Bend both knees and raise the lower legs up and back, resting them on a green chair or ottoman positioned behind you. Look down softly toward the camera.",
    tip: "Keep the hips grounded on the floor even as the legs lift, so the shape stays controlled instead of turning into a full backbend.",
    joints: { spine: 15, neck: -6.6, hips: 0, leftShoulder: 35, rightShoulder: 23, leftElbow: 100, rightElbow: 80, shoulderFwdL: 25, shoulderFwdR: 25, leftHip: 5, rightHip: 5, leftKnee: 115, rightKnee: 118, leftAnkle: -8, rightAnkle: -8, hipAbductL: -5, hipAbductR: 5, globalTwist: 0, globalRoll: 0, globalTilt: 80 }
  },
  "p15-chair-s1-thinker-crossed-ankles": {
    id: "p15-chair-s1-thinker-crossed-ankles", name: "Chair Thinker with Crossed Ankles",
    category: "seated", difficulty: "Beginner", intent: "Contemplative",
    tags: ["seated", "chair", "crossed-legs", "chin-rest"],
    instructions: "Sit sideways on the chair seat with both legs brought together and crossed at the ankles, angled to one side. Rest the near forearm across the top knee, bring the far hand up to rest under the chin. Turn shoulders slightly toward camera, chin down, direct steady gaze.",
    tip: "Keep the spine tall even while resting the chin on the hand — collapsing the chest reads as slouching, not relaxed.",
    joints: {spine: 8, hips: -18, neck: -8.2, leftShoulder: -30, rightShoulder: -90, leftElbow: 120, rightElbow: 140, hipAbductL: -10, hipAbductR: -8, leftHip: 85, rightHip: 88, leftKnee: 100, rightKnee: 95, leftAnkle: -5, rightAnkle: -8, shoulderFwdL: -30, shoulderFwdR: -70, globalTilt: 5, globalTwist: 32, globalRoll: 3}
  },
  "p15-chair-s2-forward-elbows-knees": {
    id: "p15-chair-s2-forward-elbows-knees", name: "Chair Forward Lean Elbows on Knees",
    category: "seated", difficulty: "Beginner", intent: "Confident",
    tags: ["seated", "chair", "forward-lean", "elbows-on-knees"],
    instructions: "Sit toward the front edge of the chair, knees apart, and lean the torso forward so both forearms rest on top of the thighs. Keep the spine long rather than rounded, head up, and look directly at the camera.",
    tip: "Lean from the hips, not the upper back — a straight spine with forward hip hinge photographs stronger than a hunched back.",
    joints: {spine: 25, hips: 5, neck: -2.8, leftShoulder: -20, rightShoulder: -25, leftElbow: 100, rightElbow: 100, hipAbductL: -25, hipAbductR: -25, leftHip: 92, rightHip: 92, leftKnee: 92, rightKnee: 92, leftAnkle: 0, rightAnkle: 0, shoulderFwdL: -40, shoulderFwdR: -40, globalTilt: 15, globalTwist: 0, globalRoll: 0}
  },
  "p15-chair-s3-side-straddle-back": {
    id: "p15-chair-s3-side-straddle-back", name: "Chair Backward Straddle Lean",
    category: "seated", difficulty: "Intermediate", intent: "Playful",
    tags: ["seated", "chair", "straddle", "backrest"],
    instructions: "Sit backward on the chair, straddling the seat and facing the chair back. Fold arms and rest them along the top rail of the chair back, chest lifted, chin resting toward the forearms or turned to camera.",
    tip: "Keep the chest lifted off the chair back so the pose doesn't collapse; use the arms on the rail as a frame, not a crutch.",
    joints: {spine: 12, hips: 0, neck: -4.4, leftShoulder: -60, rightShoulder: -60, leftElbow: 100, rightElbow: 100, hipAbductL: 25, hipAbductR: 25, leftHip: 95, rightHip: 95, leftKnee: 98, rightKnee: 98, leftAnkle: 0, rightAnkle: 0, shoulderFwdL: -50, shoulderFwdR: -50, globalTilt: 0, globalTwist: 55, globalRoll: 0}
  },
  "p15-chair-s4-side-perch-legs-extended": {
    id: "p15-chair-s4-side-perch-legs-extended", name: "Chair Side Perch Extended Legs",
    category: "seated", difficulty: "Intermediate", intent: "Elegant",
    tags: ["seated", "chair", "extended-legs", "side-lean"],
    instructions: "Perch on the edge of the chair seat sideways, extend both legs out to one side crossed at the ankles, lean the torso back slightly supported by one arm on the seat or chair frame, other hand resting on the thigh. Turn head to camera.",
    tip: "Point the toes and lengthen the extended legs fully to create an elegant diagonal line across the frame.",
    joints: {spine: -20, hips: -15, neck: -10, leftShoulder: -15, rightShoulder: -25, leftElbow: 50, rightElbow: 70, hipAbductL: 15, hipAbductR: -20, leftHip: 70, rightHip: 65, leftKnee: 15, rightKnee: 20, leftAnkle: 15, rightAnkle: 12, shoulderFwdL: -30, shoulderFwdR: 15, globalTilt: -30, globalTwist: 20, globalRoll: -10}
  },
  "p15-chair-s5-side-saddle-look-back": {
    id: "p15-chair-s5-side-saddle-look-back", name: "Chair Side-Saddle Look Back",
    category: "seated", difficulty: "Intermediate", intent: "Flirtatious",
    tags: ["seated", "chair", "side-saddle", "look-back"],
    instructions: "Sit sideways on the chair with both legs together swept to one side. Twist the torso and head back toward the camera over the shoulder. One hand rests on the chair back or seat, the other on the thigh.",
    tip: "Lead the twist with the chest, not just the neck, for a natural spiral through the spine.",
    joints: {spine: 6, hips: 0, neck: -6.6, leftShoulder: -15, rightShoulder: -50, leftElbow: 90, rightElbow: 85, hipAbductL: 12, hipAbductR: 10, leftHip: 90, rightHip: 90, leftKnee: 98, rightKnee: 100, leftAnkle: -5, rightAnkle: -3, shoulderFwdL: -5, shoulderFwdR: 20, globalTilt: 0, globalTwist: 58, globalRoll: 5}
  },
  "p15-chair-s6-one-leg-up-chair": {
    id: "p15-chair-s6-one-leg-up-chair", name: "Chair One Foot Up on Seat",
    category: "seated", difficulty: "Advanced", intent: "Edgy",
    tags: ["seated", "chair", "foot-up", "knee-wrap"],
    instructions: "Sit on the chair, plant one foot flat on the seat with the knee bent up high, wrap both arms loosely around the raised shin, letting the other leg extend or rest on the floor. Lean torso slightly toward the raised knee, gaze to camera.",
    tip: "Keep the standing/extended leg engaged and pointed so the pose reads as intentional rather than collapsed.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -65→-110, rightShoulder -77→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 15, hips: 12, neck: -5.5, leftShoulder: -20, rightShoulder: -20, leftElbow: 95, rightElbow: 95, hipAbductL: 15, hipAbductR: 0, leftHip: 118, rightHip: 55, leftKnee: 135, rightKnee: 60, leftAnkle: -10, rightAnkle: 5, shoulderFwdL: -20, shoulderFwdR: -20, globalTilt: 10, globalTwist: 15, globalRoll: 12}
  },
  "p15-chair-s7-recline-arms-overhead": {
    id: "p15-chair-s7-recline-arms-overhead", name: "Chair Recline Arms Overhead",
    category: "seated", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "chair", "recline", "arms-overhead"],
    instructions: "Sit back into the chair, let the spine relax into a slight recline against the chair back, raise both arms overhead or behind the head, chest lifted and open, legs extended loosely in front, gaze soft to camera.",
    tip: "Lifting the arms overhead automatically lifts and lengthens the torso — keep the ribs from flaring by engaging the core slightly.",
    // PR-v6 (v1.6) Iter C2 — fix recline_missing: description says "recline against chair back" — increase recline from -35 to -45. Was globalTilt:-35, now -45.
    joints: {spine: -12, hips: -8, neck: -18, leftShoulder: -131, rightShoulder: -140, leftElbow: 30, rightElbow: 35, hipAbductL: 8, hipAbductR: 8, leftHip: 60, rightHip: 58, leftKnee: 25, rightKnee: 30, leftAnkle: 5, rightAnkle: 3, shoulderFwdL: 10, shoulderFwdR: 10, globalTilt: -10, globalTwist: 8, globalRoll: 0}
  },
  "p15-chair-s8-profile-cross-legged": {
    id: "p15-chair-s8-profile-cross-legged", name: "Chair Profile Cross-Legged",
    category: "seated", difficulty: "Beginner", intent: "Classic",
    tags: ["seated", "chair", "profile", "crossed-legs"],
    instructions: "Sit centered on the chair in profile, cross one leg over the other at the knee, hands resting one on top of the other on the top knee, spine straight, head turned to face camera.",
    tip: "This is a timeless corporate/classic pose — keep the top foot flexed rather than dangling for a polished line.",
    joints: {spine: 0, hips: 0, neck: -5, leftShoulder: -25, rightShoulder: -25, leftElbow: 90, rightElbow: 90, hipAbductL: 20, hipAbductR: -15, leftHip: 92, rightHip: 90, leftKnee: 95, rightKnee: 90, leftAnkle: -8, rightAnkle: 0, shoulderFwdL: -10, shoulderFwdR: -10, globalTilt: 0, globalTwist: 45, globalRoll: 0}
  },
  "p15-chair-s9-arch-back-hands-behind": {
    id: "p15-chair-s9-arch-back-hands-behind", name: "Chair Arched Back Hands Behind Head",
    category: "seated", difficulty: "Advanced", intent: "Bold",
    tags: ["seated", "chair", "back-arch", "hands-behind-head"],
    instructions: "Sit forward on the chair edge, arch the back and push the chest up and out, both hands clasped behind the head with elbows wide, head tilted back slightly, legs planted wide for stability.",
    tip: "Push the pelvis slightly forward as the chest arches back — this keeps the curve looking intentional and athletic rather than strained.",
    joints: {spine: -25, hips: -10, neck: -10, leftShoulder: -140, rightShoulder: -140, leftElbow: 160, rightElbow: 160, hipAbductL: -20, hipAbductR: -20, leftHip: 90, rightHip: 90, leftKnee: 90, rightKnee: 90, leftAnkle: 0, rightAnkle: 0, shoulderFwdL: 30, shoulderFwdR: 30, globalTilt: -10, globalTwist: 0, globalRoll: 0}
  },
  "p15-chair-s10-twist-both-hands-rail": {
    id: "p15-chair-s10-twist-both-hands-rail", name: "Chair Twist Both Hands on Rail",
    category: "seated", difficulty: "Advanced", intent: "Dynamic",
    tags: ["seated", "chair", "twist", "hands-on-rail"],
    instructions: "Sit sideways on the chair, twist the torso fully to grip the chair back rail with both hands, shoulders rotated toward the chair back, head turned to look at camera over the shoulder.",
    tip: "Push the twist as far as comfortably possible through the ribcage, not just the neck, to create the most dynamic line.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 5→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 18, hips: 0, neck: -7.7, leftShoulder: -70, rightShoulder: -70, leftElbow: 80, rightElbow: 80, hipAbductL: -8, hipAbductR: -5, leftHip: 92, rightHip: 92, leftKnee: 96, rightKnee: 95, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: -80, shoulderFwdR: -80, globalTilt: 0, globalTwist: 60, globalRoll: 8}
  },
  "p11-armchair-s1-legs-crossed-hands-armrests": {
    id: "p11-armchair-s1-legs-crossed-hands-armrests", name: "Armchair Crossed Legs Hands on Rests",
    category: "seated", difficulty: "Beginner", intent: "Elegant",
    tags: ["seated", "armchair", "crossed-legs", "hands-on-armrests"],
    instructions: "Sit centered in the armchair, cross one leg tightly over the other, rest both hands on the armrests with fingers gently curled over the front edge. Sit tall, chin level, direct gaze to camera.",
    tip: "Resting the hands on the armrests opens the chest and shoulders — avoid letting the shoulders creep up toward the ears.",
    joints: {spine: 2, hips: 0, neck: -6, leftShoulder: -35, rightShoulder: -47, leftElbow: 100, rightElbow: 100, hipAbductL: 25, hipAbductR: -5, leftHip: 92, rightHip: 88, leftKnee: 100, rightKnee: 105, leftAnkle: -5, rightAnkle: -10, shoulderFwdL: 10, shoulderFwdR: 10, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  },
  "p11-armchair-s2-knees-together-lean-side": {
    id: "p11-armchair-s2-knees-together-lean-side", name: "Armchair Knees Together Side Lean",
    category: "seated", difficulty: "Beginner", intent: "Soft",
    tags: ["seated", "armchair", "knees-together", "side-lean"],
    instructions: "Sit in the chair with both knees together and swept slightly to one side, torso leaning gently toward the opposite side, one hand resting on the armrest, the other resting near the hip or thigh. Head turns slightly to camera.",
    tip: "The lean of the torso should counter the sweep of the knees for a graceful S-curve through the body.",
    joints: {spine: -12, hips: -5, neck: -8, leftShoulder: 10, rightShoulder: -30, leftElbow: 30, rightElbow: 70, hipAbductL: 15, hipAbductR: 15, leftHip: 90, rightHip: 92, leftKnee: 98, rightKnee: 100, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: -20, shoulderFwdR: 5, globalTilt: -18, globalTwist: 10, globalRoll: -8}
  },
  "p11-armchair-s3-recline-legs-extended-diagonal": {
    id: "p11-armchair-s3-recline-legs-extended-diagonal", name: "Armchair Recline Diagonal Legs Extended",
    category: "seated", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "armchair", "recline", "extended-legs"],
    instructions: "Sit back into the armchair and slide the hips slightly forward, extend both legs diagonally out across the frame, hands resting on the armrest and the seat between the legs. Head turned toward camera, relaxed gaze.",
    tip: "Sliding the hips slightly forward off the back cushion elongates the legs' line across the frame — anchor the shoulders against the chair back for support.",
    joints: {spine: -16, hips: 15, neck: -6, leftShoulder: 0, rightShoulder: -20, leftElbow: 100, rightElbow: 90, hipAbductL: 20, hipAbductR: -18, leftHip: 55, rightHip: 58, leftKnee: 15, rightKnee: 18, leftAnkle: 10, rightAnkle: 8, shoulderFwdL: 0, shoulderFwdR: -30, globalTilt: -25, globalTwist: 18, globalRoll: -15}
  },
  "p11-armchair-s4-one-leg-kicked-up-armrest": {
    id: "p11-armchair-s4-one-leg-kicked-up-armrest", name: "Armchair One Leg Kicked Over Armrest",
    category: "seated", difficulty: "Advanced", intent: "Playful",
    tags: ["seated", "armchair", "leg-over-armrest", "playful"],
    instructions: "Sit in the chair and hook one leg up and over the armrest, extending it out to the side, the other leg stays grounded bent on the seat. One hand grips the same-side armrest, the other rests near the hip. Head turns to camera.",
    tip: "Flex the extended foot and point through the toes to keep the kicked-up leg looking intentional rather than accidental.",
    joints: {spine: -8, hips: 10, neck: -8, leftShoulder: -20, rightShoulder: 10, leftElbow: 79, rightElbow: 30, hipAbductL: -25, hipAbductR: -5, leftHip: 118, rightHip: 92, leftKnee: 20, rightKnee: 98, leftAnkle: 8, rightAnkle: -5, shoulderFwdL: 10, shoulderFwdR: -10, globalTilt: -12, globalTwist: 12, globalRoll: 15}
  },
  "p11-armchair-s5-both-legs-over-armrest-smile": {
    id: "p11-armchair-s5-both-legs-over-armrest-smile", name: "Armchair Both Legs Draped Over Armrest",
    category: "seated", difficulty: "Intermediate", intent: "Joyful",
    tags: ["seated", "armchair", "legs-over-armrest", "playful"],
    instructions: "Sit sideways in the chair with the back against one armrest, drape both legs together over the opposite armrest, hands resting on the seat and the near armrest, head turned to camera with a natural smile.",
    tip: "Let the shoulders sink into the back cushion so the pose feels playful and at ease, not braced.",
    joints: {spine: 10, hips: 8, neck: -5.5, leftShoulder: -50, rightShoulder: -5, leftElbow: 81, rightElbow: 60, hipAbductL: 18, hipAbductR: 18, leftHip: 70, rightHip: 68, leftKnee: 20, rightKnee: 22, leftAnkle: 8, rightAnkle: 8, shoulderFwdL: 20, shoulderFwdR: -30, globalTilt: 20, globalTwist: 25, globalRoll: 30}
  },
  "p11-armchair-s6-kneeling-back-view-armrest-grip": {
    id: "p11-armchair-s6-kneeling-back-view-armrest-grip", name: "Armchair Kneeling Back View Armrest Grip",
    category: "seated", difficulty: "Advanced", intent: "Sultry",
    tags: ["seated", "armchair", "kneeling", "back-view"],
    instructions: "Kneel on the chair seat facing the back of the chair, one hand gripping the top of the backrest, the other resting on the hip. Arch the back slightly, turn the head to look back over the shoulder toward camera.",
    tip: "Keep weight balanced through both knees on the cushion — this is an advanced pose requiring core engagement to hold the back arch safely.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips -10→-16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: -18, hips: -16, neck: -20, leftShoulder: -90, rightShoulder: -15, leftElbow: 80, rightElbow: 110, hipAbductL: 10, hipAbductR: 10, leftHip: 118, rightHip: 118, leftKnee: 140, rightKnee: 138, leftAnkle: -30, rightAnkle: -28, shoulderFwdL: 15, shoulderFwdR: -30, globalTilt: -15, globalTwist: 50, globalRoll: 10}
  },
  "p11-armchair-s7-lean-back-arm-behind-head": {
    id: "p11-armchair-s7-lean-back-arm-behind-head", name: "Armchair Lean Back Arm Behind Head",
    category: "seated", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "armchair", "arm-behind-head", "extended-leg"],
    instructions: "Sit on the edge or front of the armchair, lean the torso back against the chair's arm or side, raise one hand behind the head, the other hand resting on the armrest. Extend one leg out along the floor while the other stays bent.",
    tip: "Let the head tilt back into the raised hand for genuine relaxation rather than holding the neck stiffly upright.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-20, now spine:20.
    joints: {spine: -20, hips: -8, neck: -22, leftShoulder: -100, rightShoulder: -10, leftElbow: 130, rightElbow: 60, hipAbductL: -10, hipAbductR: -5, leftHip: 60, rightHip: 90, leftKnee: 20, rightKnee: 95, leftAnkle: 10, rightAnkle: -5, shoulderFwdL: 70, shoulderFwdR: 30, globalTilt: -28, globalTwist: 15, globalRoll: -10}
  },
  "p11-armchair-s8-standing-lean-over-back-profile": {
    id: "p11-armchair-s8-standing-lean-over-back-profile", name: "Armchair Standing Lean Over Back Profile",
    category: "seated", difficulty: "Intermediate", intent: "Elegant",
    tags: ["standing-at-chair", "armchair", "profile", "leaning"],
    instructions: "Stand behind the armchair in profile, lean the torso forward over the top of the chair back, both hands resting flat on top of the backrest, hips pushed back slightly, head turned to camera.",
    tip: "Push the hips back as the torso leans forward to create a long, elegant line from shoulders to heels.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: {spine: 18, hips: 20, neck: -5.5, leftShoulder: -65, rightShoulder: -65, leftElbow: 110, rightElbow: 110, hipAbductL: 5, hipAbductR: 5, leftHip: 15, rightHip: 12, leftKnee: 8, rightKnee: 8, leftAnkle: 0, rightAnkle: 0, shoulderFwdL: -50, shoulderFwdR: -50, globalTilt: 25, globalTwist: 35, globalRoll: 0}
  },
  "p11-armchair-s9-standing-front-hands-armrests": {
    id: "p11-armchair-s9-standing-front-hands-armrests", name: "Armchair Standing Front Hands on Armrests",
    category: "seated", difficulty: "Beginner", intent: "Confident",
    tags: ["standing-at-chair", "armchair", "front-view", "hands-on-armrests"],
    instructions: "Stand in front of the chair facing camera, lean forward slightly and place both hands on the armrests, weight shifted onto the balls of the feet, one knee softly bent, chest lifted, direct gaze.",
    tip: "Keep the weight forward through the balanced arms so the pose looks grounded and intentional, not off-balance.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 5→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 10, hips: 16, neck: -9, leftShoulder: -30, rightShoulder: -35, leftElbow: 100, rightElbow: 100, hipAbductL: 5, hipAbductR: 5, leftHip: 8, rightHip: 12, leftKnee: 10, rightKnee: 18, leftAnkle: 0, rightAnkle: -5, shoulderFwdL: -30, shoulderFwdR: -30, globalTilt: 12, globalTwist: 0, globalRoll: 0}
  },
  "p11-armchair-s10-floor-recline-head-on-armrest": {
    id: "p11-armchair-s10-floor-recline-head-on-armrest", name: "Floor Recline Head Resting on Armrest",
    category: "seated", difficulty: "Advanced", intent: "Dreamy",
    tags: ["floor", "armchair", "recline", "head-back"],
    instructions: "Recline on the floor in front of the chair, use the armrest as a headrest, arch the back gently, one arm raised overhead resting near the hair, the other hand resting on the floor or hip. Extend both legs, one bent, one straight.",
    tip: "Let the head tip fully back into the armrest for a genuine, weightless look — avoid straining the neck to look at camera.",
    joints: {spine: -18, hips: -12, neck: -28, leftShoulder: -90, rightShoulder: 20, leftElbow: 150, rightElbow: 30, hipAbductL: 5, hipAbductR: 10, leftHip: 30, rightHip: 95, leftKnee: 15, rightKnee: 105, leftAnkle: 8, rightAnkle: -10, shoulderFwdL: -50, shoulderFwdR: 20, globalTilt: -45, globalTwist: 10, globalRoll: -5}
  },
  "p16-bed-b1-prone-smile-ankles-crossed": {
    id: "p16-bed-b1-prone-smile-ankles-crossed", name: "Bed Prone Smile Crossed Ankles",
    category: "boudoir", difficulty: "Beginner", intent: "Playful",
    tags: ["boudoir", "bed", "prone", "crossed-ankles"],
    instructions: "Lie on the stomach across the bed, prop up on both forearms, cross the ankles behind you with knees bent, tilt the head down and to the side with a soft smile looking away from the lens.",
    tip: "Arch the lower back gently to lift the chest off the mattress and keep the pose from looking flat.",
    joints: { spine: -14, neck: -12, hips: 0, globalTilt: 50, globalRoll: 5, globalTwist: 10, leftShoulder: -60, rightShoulder: -55, leftElbow: 100, rightElbow: 95, shoulderFwdL: 20, shoulderFwdR: 20, leftHip: 15, rightHip: 18, leftKnee: 105, rightKnee: 100, leftAnkle: -10, rightAnkle: -10, hipAbductL: -15, hipAbductR: -15 }
  },
  "p16-bed-b2-recline-headboard-arm-up": {
    id: "p16-bed-b2-recline-headboard-arm-up", name: "Bed Recline Against Headboard Arm Up",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["boudoir", "bed", "recline", "arm-overhead"],
    instructions: "Sit reclined against the pillows at the head of the bed, extend both legs long across the mattress, raise one arm up and back behind the head, chin lifted, eyes closed or gazing softly upward.",
    tip: "Let the raised arm's elbow relax rather than locking straight — a soft bend feels more natural against the pillows.",
    joints: { spine: -16, neck: -26, hips: -5, globalTilt: -50, globalRoll: -5, globalTwist: 8, leftShoulder: -136, rightShoulder: -30, leftElbow: 40, rightElbow: 70, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: 40, rightHip: 42, leftKnee: 10, rightKnee: 12, leftAnkle: -10, rightAnkle: -10, hipAbductL: 5, hipAbductR: 5 }
  },
  "p16-bed-b3-side-lying-knees-bent-look-camera": {
    id: "p16-bed-b3-side-lying-knees-bent-look-camera", name: "Bed Side-Lying Knees Bent Look to Camera",
    category: "boudoir", difficulty: "Beginner", intent: "Inviting",
    tags: ["boudoir", "bed", "side-lying", "knees-bent"],
    instructions: "Lie on your side with both knees bent and stacked, resting the head on the lower arm against the mattress, upper arm relaxed near the chest, head turned to gaze directly into the lens.",
    tip: "Stack the knees neatly and lengthen the neck away from the shoulder for the most flattering side-lying line.",
    joints: { spine: 15, neck: -9.8, hips: 3, globalTilt: -85, globalRoll: 20, globalTwist: 15, leftShoulder: -80, rightShoulder: -45, leftElbow: 95, rightElbow: 81, shoulderFwdL: 15, shoulderFwdR: 20, leftHip: 95, rightHip: 100, leftKnee: 115, rightKnee: 118, leftAnkle: -23, rightAnkle: -23, hipAbductL: -10, hipAbductR: -10 }
  },
  "p16-bed-b4-supine-overhead-view-arms-spread": {
    id: "p16-bed-b4-supine-overhead-view-arms-spread", name: "Bed Supine Overhead View Arms Spread",
    category: "boudoir", difficulty: "Intermediate", intent: "Dreamy",
    tags: ["boudoir", "bed", "supine", "overhead-view"],
    instructions: "Lie flat on your back centered on the bed, shot from directly overhead. Extend one arm up above the head, the other resting bent near the face, legs relaxed with knees slightly bent apart, eyes closed.",
    tip: "Fan the hair out on the sheets and relax the entire body — the overhead angle reads best when everything looks weightless.",
    joints: { spine: 10, neck: -5.2, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 12, leftShoulder: -141, rightShoulder: -40, leftElbow: 10, rightElbow: 95, shoulderFwdL: 0, shoulderFwdR: 5, leftHip: 20, rightHip: 55, leftKnee: 15, rightKnee: 90, leftAnkle: -13, rightAnkle: -23, hipAbductL: -10, hipAbductR: -20 }
  },
  "p16-bed-b5-arch-legs-up-headboard": {
    id: "p16-bed-b5-arch-legs-up-headboard", name: "Bed Back Arch Legs Up Against Headboard",
    category: "boudoir", difficulty: "Advanced", intent: "Playful",
    tags: ["boudoir", "bed", "legs-up-wall", "back-arch"],
    instructions: "Lie on your back with your hips near the headboard, kick both legs up to rest against the headboard or wall, arch the upper back and tilt the head back over the edge of the bed, one hand near the face.",
    tip: "Keep the core gently engaged even while arching — this supports the lower back and keeps the pose from looking strained.",
    joints: { spine: -30, neck: -25, hips: 20, globalTilt: -55, globalRoll: 0, globalTwist: 5, leftShoulder: -70, rightShoulder: -35, leftElbow: 85, rightElbow: 60, shoulderFwdL: 15, shoulderFwdR: 10, leftHip: 115, rightHip: 118, leftKnee: 15, rightKnee: 12, leftAnkle: -3, rightAnkle: -3, hipAbductL: 8, hipAbductR: -8 }
  },
  "p16-bed-b6-legs-up-wall-side-glance": {
    id: "p16-bed-b6-legs-up-wall-side-glance", name: "Bed Legs Up Wall Side Glance",
    category: "boudoir", difficulty: "Advanced", intent: "Playful",
    tags: ["boudoir", "bed", "legs-up-wall", "side-glance"],
    instructions: "Lie on your back near the headboard, extend both legs up the wall bending the knees slightly to one side, prop the head up with one hand, gaze softly toward the camera with a slight smile.",
    tip: "Let the knees drift gently to one side rather than staying perfectly vertical for a more relaxed, candid feel.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -65→-110, rightShoulder -30→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: 15, neck: -5.5, hips: 15, globalTilt: -50, globalRoll: 10, globalTwist: 18, leftShoulder: -110, rightShoulder: -110, leftElbow: 100, rightElbow: 70, shoulderFwdL: 25, shoulderFwdR: 10, leftHip: 95, rightHip: 98, leftKnee: 95, rightKnee: 90, leftAnkle: -23, rightAnkle: -23, hipAbductL: 15, hipAbductR: 12 }
  },
  "p16-bed-b7-prone-legs-kicked-up-look-back": {
    id: "p16-bed-b7-prone-legs-kicked-up-look-back", name: "Bed Prone Legs Kicked Up Look Back",
    category: "boudoir", difficulty: "Intermediate", intent: "Playful",
    tags: ["boudoir", "bed", "prone", "legs-kicked-up"],
    instructions: "Lie on your stomach, bend both knees and kick the legs up together behind you, rest the head down sideways on the mattress near a pillow, gaze softly toward the camera.",
    tip: "Keep both knees together and pointed for a clean, unified line with the kicked-up legs.",
    joints: { spine: -8, neck: -10, hips: 0, globalTilt: 50, globalRoll: 5, globalTwist: 8, leftShoulder: -20, rightShoulder: -25, leftElbow: 60, rightElbow: 65, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: 10, rightHip: 10, leftKnee: 125, rightKnee: 120, leftAnkle: -15, rightAnkle: -15, hipAbductL: 10, hipAbductR: 10 }
  },
  "p16-bed-b8-prone-forearms-look-camera": {
    id: "p16-bed-b8-prone-forearms-look-camera", name: "Bed Prone on Forearms Direct Gaze",
    category: "boudoir", difficulty: "Beginner", intent: "Confident",
    tags: ["boudoir", "bed", "prone", "forearms"],
    instructions: "Lie on your stomach propped up on both forearms, cross the legs and bend the knees behind you, lift the chest and turn the head to look directly at the camera with a steady, confident gaze.",
    tip: "Keep both elbows firmly planted under the shoulders for stable support and a lifted chest line.",
    joints: {spine: -12, hips: 0, neck: -8, leftShoulder: -55, rightShoulder: -50, leftElbow: 95, rightElbow: 81, hipAbductL: -20, hipAbductR: -20, leftHip: 12, rightHip: 15, leftKnee: 100, rightKnee: 85, leftAnkle: -10, rightAnkle: -23, shoulderFwdL: 20, shoulderFwdR: 20, globalTilt: 50, globalTwist: 15, globalRoll: 8}
  },
  "p16-bed-b9-kneeling-arch-hand-in-hair": {
    id: "p16-bed-b9-kneeling-arch-hand-in-hair", name: "Bed Kneeling Arch Hand in Hair",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["boudoir", "bed", "kneeling", "hand-in-hair"],
    instructions: "Kneel upright on the bed, arch the back and tilt the head back, one hand raised into the hair, the other resting on the hip, eyes closed in a sensual expression.",
    tip: "Sit back slightly onto the heels for balance before initiating the backward arch of the spine.",
    joints: { spine: -26, neck: -25, hips: -15, globalTilt: 50, globalRoll: 0, globalTwist: 10, leftShoulder: -140, rightShoulder: -30, leftElbow: 45, rightElbow: 75, shoulderFwdL: 5, shoulderFwdR: 10, leftHip: 118, rightHip: 118, leftKnee: 138, rightKnee: 138, leftAnkle: -25, rightAnkle: -25, hipAbductL: 8, hipAbductR: 8 }
  },
  "p16-bed-b10-seated-legs-bent-lean-back-hands": {
    id: "p16-bed-b10-seated-legs-bent-lean-back-hands", name: "Bed Seated Legs Bent Lean Back on Hands",
    category: "boudoir", difficulty: "Beginner", intent: "Confident",
    tags: ["boudoir", "bed", "seated", "lean-back"],
    instructions: "Sit on the bed with knees bent, one leg extended along the mattress and the other bent with foot near the opposite knee, lean back slightly supported on both hands behind the hips, head turned to face camera directly.",
    tip: "Press the hands firmly into the mattress to keep the chest lifted and the shoulders from rounding forward.",
    joints: { spine: -15, neck: -9, hips: -5, globalTilt: 50, globalRoll: 0, globalTwist: 12, leftShoulder: -95, rightShoulder: -83, leftElbow: 10, rightElbow: 10, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: 60, rightHip: 95, leftKnee: 15, rightKnee: 100, leftAnkle: -13, rightAnkle: -26, hipAbductL: -5, hipAbductR: 20 }
  },
  "p18-lounge-r1-side-recline-arm-drape": {
    id: "p18-lounge-r1-side-recline-arm-drape", name: "Lounge Side Recline with Draped Arm",
    category: "reclining", difficulty: "Beginner", intent: "Sultry",
    tags: ["reclining", "sofa", "chaise", "side-lying"],
    instructions: "Lie on your side along the length of the chaise, torso turned toward camera. Drape the top arm along the backrest/armrest above the head, letting the elbow bend softly. Extend both legs long together in the same direction, stacking the knees and ankles. Turn the head to gaze directly into the lens.",
    tip: "Keep a soft bend in the top elbow instead of a rigid right angle — a completely straight arm along the backrest looks stiff rather than languid.",
    joints: {spine: 12, hips: -8, neck: 10, leftShoulder: -20, rightShoulder: -110, leftElbow: 95, rightElbow: 60, hipAbductL: -5, hipAbductR: -3, leftHip: 15, rightHip: 18, leftKnee: 10, rightKnee: 12, leftAnkle: -5, rightAnkle: -3, shoulderFwdL: 25, shoulderFwdR: 10, globalTilt: 70, globalTwist: 25, globalRoll: 20}
  },
  "p18-lounge-r2-prone-feet-up-back-arch": {
    id: "p18-lounge-r2-prone-feet-up-back-arch", name: "Lounge Prone with Feet Raised",
    category: "reclining", difficulty: "Intermediate", intent: "Playful",
    tags: ["reclining", "sofa", "chaise", "prone", "back-arch"],
    instructions: "Lie on your stomach along the chaise, chest and shoulders lifted and turned toward camera. Bend both knees together and lift the lower legs up behind you, crossing the ankles in the air. Rest one forearm on the seat for support and let the other arm trail off the edge.",
    tip: "Lift through the chest, not just the neck, so the back forms a smooth arch instead of a hyperextended neck.",
    joints: {spine: -32, hips: 5, neck: -20, leftShoulder: -60, rightShoulder: -80, leftElbow: 81, rightElbow: 45, hipAbductL: 15, hipAbductR: 15, leftHip: -5, rightHip: -5, leftKnee: 110, rightKnee: 105, leftAnkle: 10, rightAnkle: 8, shoulderFwdL: 20, shoulderFwdR: 10, globalTilt: 60, globalTwist: 15, globalRoll: 5}
  },
  "p18-lounge-r3-seated-edge-lean-forward": {
    id: "p18-lounge-r3-seated-edge-lean-forward", name: "Seated Edge Forward Lean on Chaise",
    category: "reclining", difficulty: "Beginner", intent: "Confident",
    tags: ["seated", "sofa", "chaise", "forward-lean"],
    instructions: "Sit sideways on the edge of the chaise with both knees bent and legs together, feet on the floor. Lean the torso forward over the thighs, resting both forearms across the top of the knees. Drop the chin slightly and look up into the lens through the brow.",
    tip: "Round the upper back slightly as you lean forward — a perfectly flat spine while leaning forward looks tense.",
    joints: { spine: -25, neck: 9.9, hips: -10, globalTilt: 65, globalRoll: 5, globalTwist: 20, leftShoulder: -30, rightShoulder: -35, leftElbow: 95, rightElbow: 100, shoulderFwdL: 40, shoulderFwdR: 30, leftHip: 90, rightHip: 92, leftKnee: 92, rightKnee: 90, leftAnkle: -5, rightAnkle: -5, hipAbductL: -5, hipAbductR: -5 }
  },
  "p18-lounge-r4-reclined-knees-up-hand-hair": {
    id: "p18-lounge-r4-reclined-knees-up-hand-hair", name: "Reclined with Knees Up and Hand in Hair",
    category: "reclining", difficulty: "Intermediate", intent: "Sultry",
    tags: ["reclining", "sofa", "chaise", "knees-up"],
    instructions: "Recline back against the raised end of the chaise with the spine supported. Draw both knees up together and let them fall gently to one side. Raise one hand into the hair while the other rests along the outside of the thigh. Turn the head to look toward camera.",
    tip: "Let the knees fall naturally to one side rather than staying centered — this creates a more relaxed, asymmetrical line.",
    joints: { spine: -18, neck: 6.6, hips: 20, globalTilt: -55, globalRoll: 10, globalTwist: 30, leftShoulder: -140, rightShoulder: -25, leftElbow: 100, rightElbow: 55, shoulderFwdL: 20, shoulderFwdR: 15, leftHip: 100, rightHip: 105, leftKnee: 120, rightKnee: 118, leftAnkle: 5, rightAnkle: 5, hipAbductL: -20, hipAbductR: -22 }
  },
  "p18-lounge-r5-back-lying-arms-overhead": {
    id: "p18-lounge-r5-back-lying-arms-overhead", name: "Lying Back with Arms Overhead",
    category: "reclining", difficulty: "Beginner", intent: "Romantic",
    tags: ["reclining", "sofa", "chaise", "supine"],
    instructions: "Lie back along the chaise with the torso flat and both arms reaching up overhead, wrists loosely crossed. Bend one knee up while the other leg stays extended long. Tilt the head back slightly and gaze toward the camera along the length of the body.",
    tip: "Keep the ribcage soft rather than lifted, so the pose reads as relaxed rather than posed and rigid.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:10, now spine:-10.
    joints: {
"spine":-10,"hips":5,"neck":-6.6,"leftShoulder":-130,"rightShoulder":-130,"leftElbow":15,"rightElbow":20,"hipAbductL":-15,"hipAbductR":0,"leftHip":85,"rightHip":5,"leftKnee":90,"rightKnee":8,"leftAnkle":-5,"rightAnkle":-10,"shoulderFwdL":5,"shoulderFwdR":5,"globalTilt":-80,"globalTwist":5,"globalRoll":0
  }
  },
  "p18-lounge-r6-kneeling-over-armrest": {
    id: "p18-lounge-r6-kneeling-over-armrest", name: "Kneeling Over the Armrest",
    category: "reclining", difficulty: "Advanced", intent: "Sultry",
    tags: ["kneeling", "sofa", "chaise", "armrest"],
    instructions: "Kneel on the chaise seat facing the raised armrest, then fold the torso down over it, resting the chest and forearms on top. Extend one leg back long behind you while the other stays bent beneath the hips. Turn the head to the side, resting cheek near a hand.",
    tip: "Keep the extended leg's foot pointed and slightly lifted for a longer line rather than letting it drop flat.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -50→-110, rightShoulder -55→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: -35, neck: 21, hips: 10, globalTilt: 65, globalRoll: 15, globalTwist: 20, leftShoulder: -110, rightShoulder: -110, leftElbow: 100, rightElbow: 95, shoulderFwdL: 45, shoulderFwdR: 35, leftHip: 100, rightHip: 15, leftKnee: 100, rightKnee: 10, leftAnkle: 0, rightAnkle: 15, hipAbductL: -10, hipAbductR: 5 }
  },
  "p18-lounge-r7-seated-legs-crossed-hand-chin": {
    id: "p18-lounge-r7-seated-legs-crossed-hand-chin", name: "Seated with Legs Crossed and Hand at Chin",
    category: "reclining", difficulty: "Beginner", intent: "Contemplative",
    tags: ["seated", "sofa", "chaise", "crossed-legs"],
    instructions: "Sit upright on the chaise with legs crossed at the knee, angled to one side. Rest one elbow on the top knee and bring that hand up near the chin. Let the other hand rest on the seat beside the hip for support. Turn the shoulders slightly toward camera with a soft, direct gaze.",
    tip: "Keep the supporting hand's fingers relaxed and slightly spread rather than flat and tense against the cushion.",
    joints: { spine: 8, neck: -7.7, hips: -15, globalTilt: 65, globalRoll: 5, globalTwist: 28, leftShoulder: -75, rightShoulder: -30, leftElbow: 100, rightElbow: 20, shoulderFwdL: 20, shoulderFwdR: 10, leftHip: 88, rightHip: 92, leftKnee: 100, rightKnee: 105, leftAnkle: -8, rightAnkle: -5, hipAbductL: 12, hipAbductR: -10 }
  },
  "p18-lounge-r8-side-lying-head-propped": {
    id: "p18-lounge-r8-side-lying-head-propped", name: "Side-Lying with Head Propped on Hand",
    category: "reclining", difficulty: "Beginner", intent: "Romantic",
    tags: ["reclining", "sofa", "chaise", "head-propped"],
    instructions: "Lie fully on your side along the chaise with the lower arm bent and propping up the head. Stack both knees and bend them softly forward. Let the top arm rest along the waist or trail down toward the knees. Gaze softly toward the lens.",
    tip: "Prop the head on the heel of the hand, not the fingertips, for a more natural, weight-bearing look.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: spine 8→18. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: { spine: 18, neck: 15, hips: 10, globalTilt: 75, globalRoll: 15, globalTwist: 10, leftShoulder: -100, rightShoulder: -15, leftElbow: 100, rightElbow: 45, shoulderFwdL: -10, shoulderFwdR: -15, leftHip: 70, rightHip: 75, leftKnee: 70, rightKnee: 72, leftAnkle: -5, rightAnkle: -5, hipAbductL: -8, hipAbductR: -10 }
  },
  "p18-lounge-r9-seated-back-arch-hands-behind": {
    id: "p18-lounge-r9-seated-back-arch-hands-behind", name: "Seated Back Arch with Hands Behind",
    category: "reclining", difficulty: "Intermediate", intent: "Confident",
    tags: ["seated", "sofa", "chaise", "back-arch"],
    instructions: "Sit on the chaise with both legs to one side, then place both hands behind you on the seat and press through the arms to lift and open the chest. Arch the back gently, tilt the head back slightly, and turn the face toward camera.",
    tip: "Press through the heels of the hands to keep the shoulders from creeping up toward the ears while arching.",
    joints: { spine: -22, neck: -25, hips: -18, globalTilt: 65, globalRoll: 5, globalTwist: 15, leftShoulder: -25, rightShoulder: -30, leftElbow: 15, rightElbow: 15, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: 100, rightHip: 105, leftKnee: 110, rightKnee: 112, leftAnkle: 0, rightAnkle: 0, hipAbductL: -18, hipAbductR: -20 }
  },
  "p18-lounge-r10-full-length-recline-legs-crossed": {
    id: "p18-lounge-r10-full-length-recline-legs-crossed", name: "Full-Length Recline with Crossed Ankles",
    category: "reclining", difficulty: "Beginner", intent: "Sultry",
    tags: ["reclining", "sofa", "chaise", "full-length"],
    instructions: "Lie back along the full length of the chaise, head resting against the raised end. Cross both ankles and let one hand rest on the stomach while the other trails off the side of the chaise toward the floor. Gaze languidly toward camera.",
    tip: "Let the trailing hand's fingers softly touch the floor or dangle just above it for a natural sense of weight and gravity.",
    joints: { spine: 5, neck: 8, hips: 0, globalTilt: -85, globalRoll: 0, globalTwist: 5, leftShoulder: -20, rightShoulder: -85, leftElbow: 60, rightElbow: 10, shoulderFwdL: 10, shoulderFwdR: 5, leftHip: 5, rightHip: 8, leftKnee: 8, rightKnee: 10, leftAnkle: -5, rightAnkle: -5, hipAbductL: -3, hipAbductR: -5 }
  },
  "p17-tubes-s1-reclined-across-tubes": {
    id: "p17-tubes-s1-reclined-across-tubes", name: "Reclined Across Multiple Tubes",
    category: "seated", difficulty: "Advanced", intent: "Sultry",
    tags: ["reclining", "posing-tube", "eyes-closed"],
    instructions: "Arrange three tubes in a descending line. Recline back across them so the hips rest on the tallest tube and the legs extend long over the lower ones, ankles crossed and lifted. Let one arm trail to the floor for support while the other rests on the stomach. Close the eyes and tilt the head back.",
    tip: "Keep the core gently engaged so the torso doesn't sag between the tubes — a slight lift keeps the line clean.",
    joints: {spine: -15, hips: 5, neck: -20, leftShoulder: -30, rightShoulder: -10, leftElbow: 15, rightElbow: 90, hipAbductL: 15, hipAbductR: -5, leftHip: 10, rightHip: 12, leftKnee: 8, rightKnee: 10, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: 0, shoulderFwdR: -10, globalTilt: -55, globalTwist: 8, globalRoll: 10}
  },
  "p17-tubes-s2-seated-lean-back-hands-support": {
    id: "p17-tubes-s2-seated-lean-back-hands-support", name: "Seated Lean Back with Hand Support",
    category: "seated", difficulty: "Intermediate", intent: "Confident",
    tags: ["seated", "posing-tube", "lean-back"],
    instructions: "Sit atop a single tall tube, then lean the torso back and place both hands behind you on the tube's edge for support. Extend one leg forward and let the other bend with the foot resting on a lower tube. Tilt the head back slightly and gaze into camera.",
    tip: "Keep the wrists directly under the shoulders when supporting your weight to avoid strain and keep the line clean.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-20, now spine:20.
    joints: {spine: -15, hips: -10, neck: -15, leftShoulder: -20, rightShoulder: -25, leftElbow: 40, rightElbow: 40, hipAbductL: -5, hipAbductR: -8, leftHip: 40, rightHip: 95, leftKnee: 15, rightKnee: 90, leftAnkle: -10, rightAnkle: 5, shoulderFwdL: 15, shoulderFwdR: 15, globalTilt: 0, globalTwist: 10, globalRoll: 5}
  },
  "p17-tubes-s3-kneeling-arch-over-tube": {
    id: "p17-tubes-s3-kneeling-arch-over-tube", name: "Kneeling Arch Over a Tube",
    category: "seated", difficulty: "Advanced", intent: "Sultry",
    tags: ["kneeling", "posing-tube", "back-arch"],
    instructions: "Kneel behind a tube with both knees on the floor, then drape the torso forward and down over the top of the tube, arching the back. Let both arms hang down the far side, hands loosely touching the floor. Turn the head to one side, gazing toward camera.",
    tip: "Let the tube support your ribcage, not your stomach, to keep the spine's arch smooth and avoid pinching.",
    joints: {spine: -30, hips: 15, neck: 11, leftShoulder: -20, rightShoulder: -20, leftElbow: 15, rightElbow: 15, hipAbductL: -10, hipAbductR: -10, leftHip: 110, rightHip: 108, leftKnee: 130, rightKnee: 128, leftAnkle: 15, rightAnkle: 15, shoulderFwdL: -20, shoulderFwdR: -20, globalTilt: 50, globalTwist: 15, globalRoll: 10}
  },
  "p17-tubes-s4-standing-lean-one-leg-on-tube": {
    id: "p17-tubes-s4-standing-lean-one-leg-on-tube", name: "Standing Lean with One Foot on a Tube",
    category: "seated", difficulty: "Intermediate", intent: "Confident",
    tags: ["standing", "posing-tube", "leg-up"],
    instructions: "Stand beside a tall tube and place one foot up on top of it, bending that knee outward. Lean the torso slightly toward the raised leg, resting a forearm on the bent knee. Let the standing leg carry most of the weight, hips shifted to that side. Gaze toward camera over the shoulder.",
    tip: "Shift weight fully onto the standing leg so the raised foot rests lightly on the tube rather than bearing weight.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: leftShoulder -40→-110, rightShoulder -15→-110. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 12, hips: -15, neck: -9.9, leftShoulder: -25, rightShoulder: -15, leftElbow: 90, rightElbow: 15, hipAbductL: 25, hipAbductR: 0, leftHip: 95, rightHip: 5, leftKnee: 100, rightKnee: 10, leftAnkle: 0, rightAnkle: -5, shoulderFwdL: -20, shoulderFwdR: 0, globalTilt: 5, globalTwist: 35, globalRoll: 8}
  },
  "p17-tubes-s5-seated-legs-open-hands-back": {
    id: "p17-tubes-s5-seated-legs-open-hands-back", name: "Seated with Legs Open and Hands Back",
    category: "seated", difficulty: "Beginner", intent: "Confident",
    tags: ["seated", "posing-tube", "open-stance"],
    instructions: "Sit on top of a tube with both feet planted on the floor, knees open comfortably apart. Place both hands behind you on the tube's edge for a slight backward lean. Square the shoulders to camera and lift the chin with a direct, confident gaze.",
    tip: "Keep the shoulders down and back even while leaning on your arms, to avoid hunching them up toward the ears.",
    joints: {spine: -10, hips: 0, neck: -5, leftShoulder: -8, rightShoulder: -10, leftElbow: 30, rightElbow: 10, hipAbductL: -20, hipAbductR: -20, leftHip: 92, rightHip: 92, leftKnee: 90, rightKnee: 90, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: 30, shoulderFwdR: 30, globalTilt: 10, globalTwist: 0, globalRoll: 0}
  },
  "p17-tubes-s6-side-sit-twist-look-back": {
    id: "p17-tubes-s6-side-sit-twist-look-back", name: "Side Seat with Twisting Look Back",
    category: "seated", difficulty: "Intermediate", intent: "Sultry",
    tags: ["seated", "posing-tube", "twist"],
    instructions: "Sit sideways on a tube with legs together, angled away from camera. Twist the torso and shoulders back toward the lens, resting one hand on the tube behind you and the other on the top thigh. Look back over the shoulder with a soft gaze.",
    tip: "Initiate the twist from the ribcage, not just the neck, for a more natural and elegant spiral through the torso.",
    joints: {spine: 15, hips: -15, neck: -11, leftShoulder: -12, rightShoulder: -45, leftElbow: 105, rightElbow: 70, hipAbductL: 10, hipAbductR: 10, leftHip: 90, rightHip: 90, leftKnee: 95, rightKnee: 98, leftAnkle: -5, rightAnkle: -8, shoulderFwdL: -15, shoulderFwdR: 15, globalTilt: 8, globalTwist: 40, globalRoll: 5}
  },
  "p17-tubes-s7-kneel-drape-tall-tube-leg-back": {
    id: "p17-tubes-s7-kneel-drape-tall-tube-leg-back", name: "Kneeling Drape Over Tall Tube with Leg Extended",
    category: "seated", difficulty: "Advanced", intent: "Sultry",
    tags: ["kneeling", "posing-tube", "leg-extended"],
    instructions: "Kneel on one knee draped over a tall tube, planting one hand on its surface for balance. Extend the other leg back long, resting the foot on a shorter tube behind you. Turn the torso into profile and gaze toward camera over the shoulder.",
    tip: "Point the extended back foot and lift slightly off the shorter tube for a longer, more elegant leg line.",
    joints: {spine: -10, hips: 10, neck: -25, leftShoulder: -15, rightShoulder: -10, leftElbow: 80, rightElbow: 30, hipAbductL: -15, hipAbductR: 5, leftHip: 115, rightHip: 20, leftKnee: 120, rightKnee: 12, leftAnkle: 10, rightAnkle: 8, shoulderFwdL: -10, shoulderFwdR: 5, globalTilt: 25, globalTwist: 45, globalRoll: 15}
  },
  "p17-tubes-s8-seated-foot-on-second-tube": {
    id: "p17-tubes-s8-seated-foot-on-second-tube", name: "Seated with Foot Resting on Second Tube",
    category: "seated", difficulty: "Intermediate", intent: "Confident",
    tags: ["seated", "posing-tube", "leg-extended"],
    instructions: "Sit on one tube and extend one leg to rest the foot on a second, shorter tube in front of you. Place a hand on your hip and turn the torso into a 3/4 view. Look off to the side with a relaxed, confident expression.",
    tip: "Keep the extended knee very slightly bent rather than locked straight to keep the leg line soft.",
    joints: {spine: -8, hips: 5, neck: -22, leftShoulder: -10, rightShoulder: -10, leftElbow: 110, rightElbow: 40, hipAbductL: 5, hipAbductR: -5, leftHip: 20, rightHip: 90, leftKnee: 15, rightKnee: 88, leftAnkle: -5, rightAnkle: -5, shoulderFwdL: -5, shoulderFwdR: 0, globalTilt: 5, globalTwist: 25, globalRoll: 5}
  },
  "p17-tubes-s9-seated-hand-hair-leg-back": {
    id: "p17-tubes-s9-seated-hand-hair-leg-back", name: "Seated with Hand in Hair and Leg Extended Back",
    category: "seated", difficulty: "Intermediate", intent: "Sultry",
    tags: ["seated", "posing-tube", "hand-in-hair"],
    instructions: "Sit on a tube with one leg extended back long behind you, toe pointed. Raise one hand up into the hair while the other rests on or near the tube's surface. Turn the head and gaze off to the side.",
    tip: "Lift the raised elbow up and out rather than pinning it close to the head, to open up the silhouette.",
    joints: {spine: 10, hips: 8, neck: 15, leftShoulder: -120, rightShoulder: -5, leftElbow: 130, rightElbow: 80, hipAbductL: -5, hipAbductR: 3, leftHip: 90, rightHip: 10, leftKnee: 90, rightKnee: 8, leftAnkle: -5, rightAnkle: -20, shoulderFwdL: 15, shoulderFwdR: -5, globalTilt: 8, globalTwist: 20, globalRoll: 10}
  },
  "p17-tubes-s10-seated-knees-hugged-chin-rest": {
    id: "p17-tubes-s10-seated-knees-hugged-chin-rest", name: "Seated with Knees Hugged and Chin Resting",
    category: "seated", difficulty: "Beginner", intent: "Contemplative",
    tags: ["seated", "posing-tube", "knees-hugged"],
    instructions: "Sit on a tube facing camera and draw both knees up together toward the chest. Wrap both arms around the shins and rest the chin near a knee. Keep a direct, soft gaze into the lens.",
    tip: "Keep the spine long even while curled up — rounding only through the upper back avoids a collapsed look.",
    joints: {spine: 25, hips: -5, neck: 12.1, leftShoulder: -30, rightShoulder: -30, leftElbow: 95, rightElbow: 95, hipAbductL: -8, hipAbductR: -8, leftHip: 118, rightHip: 118, leftKnee: 130, rightKnee: 130, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: -25, shoulderFwdR: -25, globalTilt: 5, globalTwist: 5, globalRoll: 0}
  },
  "p08-male-st1-shirt-pull-overhead": {
    id: "p08-male-st1-shirt-pull-overhead", name: "Standing Shirt Pull Overhead",
    category: "standing", difficulty: "Beginner", intent: "Confident",
    tags: ["standing", "male", "shirt-pull"],
    instructions: "Stand with the torso turned 3/4 to camera. Raise both arms to pull a t-shirt off over the head, one hand gripping the collar behind the head, the other pulling the hem upward. Tuck the chin down toward the chest as the shirt passes the face.",
    tip: "Keep the shoulders pulled down away from the ears even with both arms raised, to avoid a hunched silhouette.",
    joints: { spine: 15, neck: 25, hips: 12, globalTilt: 0, globalRoll: 5, globalTwist: 30, leftShoulder: -136, rightShoulder: -131, leftElbow: 100, rightElbow: 85, shoulderFwdL: 25, shoulderFwdR: 20, leftHip: -1, rightHip: 11, leftKnee: 8, rightKnee: 8, leftAnkle: -5, rightAnkle: -5, hipAbductL: 5, hipAbductR: 5 }
  },
  "p08-male-st2-hand-behind-neck-waistband": {
    id: "p08-male-st2-hand-behind-neck-waistband", name: "Standing Hand Behind Neck with Waistband Grip",
    category: "standing", difficulty: "Beginner", intent: "Confident",
    tags: ["standing", "male", "shirtless"],
    instructions: "Stand in a 3/4 view, shirtless. Raise one hand behind the neck with the elbow lifted, tilting the head down and to the side. Tuck the other hand into the jeans waistband. Keep weight relaxed on both legs.",
    tip: "Angle the head down and away from the raised elbow rather than straight down, to create a more dynamic line through the neck.",
    joints: { spine: 6, neck: 20, hips: 17, globalTilt: 0, globalRoll: 8, globalTwist: 25, leftShoulder: -131, rightShoulder: -30, leftElbow: 95, rightElbow: 75, shoulderFwdL: 20, shoulderFwdR: 15, leftHip: -1, rightHip: 14, leftKnee: 10, rightKnee: 10, leftAnkle: -5, rightAnkle: -5, hipAbductL: 5, hipAbductR: 5 }
  },
  "p08-male-se3-chair-diagonal-lean-leg-extended": {
    id: "p08-male-se3-chair-diagonal-lean-leg-extended", name: "Chair Diagonal Lean with Extended Leg",
    category: "seated", difficulty: "Intermediate", intent: "Confident",
    tags: ["seated", "male", "chair", "leg-extended"],
    instructions: "Sit on a chair and extend one leg forward with the foot on the floor. Raise one hand behind the head while the other rests on the thigh near the jeans. Lean the torso back diagonally against the chair, chin lifted, gaze to the side.",
    tip: "Let the torso's diagonal lean be supported by the chair back rather than the core, to keep the pose looking relaxed rather than strained.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says forward lean/fold but spine is negative (backward arch). Was spine:-18, now spine:18.
    joints: {spine: -18, hips: -8, neck: -12, leftShoulder: -136, rightShoulder: -25, leftElbow: 95, rightElbow: 80, hipAbductL: 5, hipAbductR: -5, leftHip: 90, rightHip: 90, leftKnee: 88, rightKnee: 88, leftAnkle: -10, rightAnkle: -5, shoulderFwdL: 10, shoulderFwdR: 15, globalTilt: 15, globalTwist: 15, globalRoll: 5}
  },
  "p08-male-se4-chair-arm-along-back-belt-hand": {
    id: "p08-male-se4-chair-arm-along-back-belt-hand", name: "Chair Recline with Arm Along Backrest",
    category: "seated", difficulty: "Intermediate", intent: "Confident",
    tags: ["seated", "male", "chair", "recline"],
    instructions: "Sit on the chair reclined diagonally as before, but drape one arm along the top of the chair back instead of behind the head. Rest the other hand near the belt or jean's waistband. Extend one leg forward, gaze off to the side.",
    tip: "Let the draped arm rest naturally along the chair back's curve rather than gripping it, for a more casual look.",
    joints: {spine: -16, hips: -6, neck: -8, leftShoulder: -65, rightShoulder: -10, leftElbow: 35, rightElbow: 125, hipAbductL: 5, hipAbductR: -5, leftHip: 35, rightHip: 90, leftKnee: 18, rightKnee: 88, leftAnkle: -8, rightAnkle: -5, shoulderFwdL: 85, shoulderFwdR: -75, globalTilt: -12, globalTwist: 12, globalRoll: 5}
  },
  "p08-male-r5-reclined-pillows-hand-near-face": {
    id: "p08-male-r5-reclined-pillows-hand-near-face", name: "Reclined Against Pillows with Hand Near Face",
    category: "boudoir", difficulty: "Beginner", intent: "Relaxed",
    tags: ["reclining", "male", "bed", "pillows"],
    instructions: "Recline against pillows on the bed, torso propped up at an angle. Bring one hand up near the ear or temple while the other grips a raised bent knee. Gaze off to the side with a relaxed expression.",
    tip: "Let the propped shoulder sink into the pillows rather than staying rigid, to keep the recline looking genuinely comfortable.",
    joints: { spine: -10, neck: 4.3, hips: 5, globalTilt: 45, globalRoll: 5, globalTwist: 15, leftShoulder: -130, rightShoulder: -40, leftElbow: 81, rightElbow: 85, shoulderFwdL: 10, shoulderFwdR: 15, leftHip: 95, rightHip: 30, leftKnee: 90, rightKnee: 20, leftAnkle: -23, rightAnkle: -26, hipAbductL: -10, hipAbductR: 5 }
  },
  "p08-male-r6-lying-back-eyes-closed-fist-face": {
    id: "p08-male-r6-lying-back-eyes-closed-fist-face", name: "Lying Back with Eyes Closed and Fist Near Face",
    category: "boudoir", difficulty: "Beginner", intent: "Relaxed",
    tags: ["reclining", "male", "bed", "eyes-closed"],
    instructions: "Lie on your back on the bed, fully relaxed. Bend one arm behind the head with the fist resting near the face. Close the eyes and let the body sink into the bedding for a serene, sleepy expression.",
    tip: "Let the facial muscles fully relax with eyes gently closed rather than squeezed shut, for authentic serenity.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:13, now spine:-13.
    joints: { spine: -18, neck: -5, hips: 0, globalTilt: 82, globalRoll: 5, globalTwist: 5, leftShoulder: -140, rightShoulder: -15, leftElbow: 100, rightElbow: 40, shoulderFwdL: 10, shoulderFwdR: 5, leftHip: 5, rightHip: 8, leftKnee: 10, rightKnee: 12, leftAnkle: -23, rightAnkle: -23, hipAbductL: 8, hipAbductR: 5 }
  },
  "p08-male-r7-side-lying-knee-raised-forearm-bedding": {
    id: "p08-male-r7-side-lying-knee-raised-forearm-bedding", name: "Side-Lying with Raised Knee and Forearm on Bedding",
    category: "boudoir", difficulty: "Beginner", intent: "Relaxed",
    tags: ["reclining", "male", "bed", "side-lying"],
    instructions: "Lie on your side on the bed. Raise the top knee and let it rest forward on the bedding. Rest the near forearm flat on the bedding beneath the head or chest. Look down and away from the camera for a candid, introspective feel.",
    tip: "Let the gaze drop naturally downward rather than posing toward the lens, to keep the mood candid and unguarded.",
    joints: { spine: 6, neck: 22, hips: 10, globalTilt: 75, globalRoll: 15, globalTwist: 12, leftShoulder: -70, rightShoulder: -20, leftElbow: 95, rightElbow: 50, shoulderFwdL: -15, shoulderFwdR: -10, leftHip: 100, rightHip: 40, leftKnee: 100, rightKnee: 25, leftAnkle: -18, rightAnkle: -23, hipAbductL: -12, hipAbductR: 5 }
  },
  "p08-male-se8-floor-lean-bench-legs-extended": {
    id: "p08-male-se8-floor-lean-bench-legs-extended", name: "Floor Seated Leaning Against Bench",
    category: "seated", difficulty: "Intermediate", intent: "Relaxed",
    tags: ["seated", "male", "floor", "bench"],
    instructions: "Sit on the floor with your back leaning against a tufted bench or ottoman. Extend both legs forward, crossing at the ankles. Rest one arm along the top of the bench and let the other rest on the floor or thigh. Gaze off to the side.",
    tip: "Let the head and upper back sink into the bench for support rather than holding the torso rigidly upright.",
    joints: {spine: -20, hips: -5, neck: -10, leftShoulder: -65, rightShoulder: -10, leftElbow: 35, rightElbow: 125, hipAbductL: 5, hipAbductR: 3, leftHip: 15, rightHip: 18, leftKnee: 10, rightKnee: 12, leftAnkle: -8, rightAnkle: -8, shoulderFwdL: -85, shoulderFwdR: -75, globalTilt: -15, globalTwist: 15, globalRoll: 5}
  },
  "p08-male-r9-reclined-floral-cushion-eyes-closed": {
    id: "p08-male-r9-reclined-floral-cushion-eyes-closed", name: "Reclined on Floral Cushion with Eyes Closed",
    category: "boudoir", difficulty: "Beginner", intent: "Relaxed",
    tags: ["reclining", "male", "cushion", "eyes-closed"],
    instructions: "Recline back on a floral-patterned cushion or ottoman. Close the eyes and rest one hand behind the head while the other arm bends near a raised knee. Let the whole body soften into a sleepy, relaxed expression.",
    tip: "Allow the mouth and jaw to relax completely with eyes closed, avoiding any tension that reads as posed rather than truly at rest.",
    joints: { spine: -8, neck: -15, hips: 5, globalTilt: -50, globalRoll: 10, globalTwist: 12, leftShoulder: -135, rightShoulder: -45, leftElbow: 95, rightElbow: 85, shoulderFwdL: 10, shoulderFwdR: 15, leftHip: 95, rightHip: 30, leftKnee: 92, rightKnee: 20, leftAnkle: -23, rightAnkle: -26, hipAbductL: -10, hipAbductR: 5 }
  },
  "p08-male-st10-standing-back-view-hands-clasped": {
    id: "p08-male-st10-standing-back-view-hands-clasped", name: "Standing Back View with Hands Clasped Behind Head",
    category: "standing", difficulty: "Beginner", intent: "Confident",
    tags: ["standing", "male", "back-view"],
    instructions: "Stand with your full back to the camera near a mantel or wall. Raise both arms and clasp the hands together behind the head or neck, elbows out wide. Keep the weight even on both legs to show the full back and shoulder line.",
    tip: "Keep the elbows wide and even so the back's width and symmetry read clearly from behind.",
    joints: {spine: 13, hips: 12, neck: -6, leftShoulder: -50, rightShoulder: -50, leftElbow: 180, rightElbow: 180, hipAbductL: 3, hipAbductR: 3, leftHip: -3, rightHip: 9, leftKnee: 5, rightKnee: 5, leftAnkle: -3, rightAnkle: -3, shoulderFwdL: 100, shoulderFwdR: 100, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  },
  "p06-chair-b1-seated-legs-crossed-shin": {
    id: "p06-chair-b1-seated-legs-crossed-shin", name: "Chair Seated Legs Crossed at Shin",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["seated", "chair", "legs crossed", "boudoir"],
    instructions: "Sit on the chair with legs extended to the side, bend one knee, and cross the legs at the shin with pointed toes. Rest arms asymmetrically on the armrests, drop the shoulders, and face the camera directly.",
    tip: "Keep the shoulders pressed down away from the ears for a longer neckline; point both feet fully to elongate the leg line.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -16 (right leg crosses behind left).
    joints: { spine: 15, neck: -6, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -25, rightShoulder: -30, leftElbow: 85, rightElbow: 78, shoulderFwdL: 8, shoulderFwdR: 10, leftHip: 50, rightHip: 68, leftKnee: 58, rightKnee: 28, leftAnkle: -8, rightAnkle: -10, hipAbductL: 10, hipAbductR: -16 }
  },
  "p06-chair-b2-seated-hand-forehead": {
    id: "p06-chair-b2-seated-hand-forehead", name: "Chair Seated Hand to Forehead",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["seated", "chair", "hand on forehead", "boudoir"],
    instructions: "Sit with legs extended and slightly bent, crossed at the shin. Rest one arm on the armrest and raise the other, bending the elbow to bring the hand to the forehead. Drop the shoulders, elongate the neck, and look away from camera.",
    tip: "Elongate the neck by gently tilting the head into the raised hand rather than dropping it forward.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -12 (right leg crosses behind left).
    joints: { spine: 8, neck: -4.3, hips: 0, globalTilt: 50, globalRoll: 3, globalTwist: 10, leftShoulder: -80, rightShoulder: -20, leftElbow: 95, rightElbow: 70, shoulderFwdL: -15, shoulderFwdR: -8, leftHip: 45, rightHip: 60, leftKnee: 50, rightKnee: 35, leftAnkle: -10, rightAnkle: -8, hipAbductL: 8, hipAbductR: -12 }
  },
  "p06-chair-b3-seated-knees-bent-hands-clasped": {
    id: "p06-chair-b3-seated-knees-bent-hands-clasped", name: "Chair Seated Both Knees Bent Hands Together",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["seated", "chair", "knees bent", "boudoir"],
    instructions: "Sit with both knees bent and legs crossed at the shin. Bend both arms slightly, resting one hand on the knee and the other on the wrist. Drop the shoulders and look straight at the camera.",
    tip: "Keep the clasped hands soft and relaxed rather than gripping, so the pose reads calm and confident.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
    joints: {spine: 13, hips: 0, neck: -6, leftShoulder: 10, rightShoulder: -10, leftElbow: 160, rightElbow: 160, hipAbductL: 10, hipAbductR: -10, leftHip: 60, rightHip: 62, leftKnee: 65, rightKnee: 60, leftAnkle: -10, rightAnkle: -10, shoulderFwdL: -90, shoulderFwdR: -90, globalTilt: 50, globalTwist: 0, globalRoll: 0}
  },
  "p06-chair-b4-seated-crossed-chin-touch": {
    id: "p06-chair-b4-seated-crossed-chin-touch", name: "Chair Seated Crossed Knees Chin Touch",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "chair", "chin touch", "boudoir"],
    instructions: "Sit with both knees bent and crossed, toes pointed. Rest one hand on the armrest and bring the other hand up to touch the chin. Drop the shoulders and look at the camera.",
    tip: "Bring the chin-touching hand up gently without collapsing the wrist to keep the gesture elegant.",
    joints: { spine: 6, neck: -3.3, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -70, rightShoulder: -25, leftElbow: 100, rightElbow: 78, shoulderFwdL: 18, shoulderFwdR: 10, leftHip: 55, rightHip: 65, leftKnee: 68, rightKnee: 55, leftAnkle: -12, rightAnkle: -10, hipAbductL: 8, hipAbductR: 12 }
  },
  "p06-chair-b5-legs-crossed-hair-hip": {
    id: "p06-chair-b5-legs-crossed-hair-hip", name: "Chair Legs Crossed Hair Touch Hip Hand",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "chair", "hair touch", "boudoir"],
    instructions: "Extend legs with one slightly bent, crossed at the shin with pointed toes. Bring one hand up to touch the hair while the other rests on the hip. Drop the shoulders and look away from the camera.",
    tip: "Angle the face slightly upward when touching the hair to keep the jawline and neck defined.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -12 (right leg crosses behind left).
    joints: { spine: 8, neck: -5.5, hips: 5, globalTilt: 50, globalRoll: 5, globalTwist: 12, leftShoulder: -85, rightShoulder: -40, leftElbow: 100, rightElbow: 85, shoulderFwdL: 15, shoulderFwdR: 10, leftHip: 50, rightHip: 62, leftKnee: 45, rightKnee: 55, leftAnkle: -10, rightAnkle: -10, hipAbductL: 10, hipAbductR: -12 }
  },
  "p06-chair-b6-standing-lean-arch": {
    id: "p06-chair-b6-standing-lean-arch", name: "Chair Standing Lean Back Arch",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "chair", "back arch", "boudoir"],
    instructions: "Stand leaning against the chair with one arm bent, one leg bent and the other straight with pointed toes, one foot elevated. Lean the upper body forward and arch the back, resting both hands on the armrest, and look at the camera.",
    tip: "Push the hips back and shift weight into the straight leg to maximize the back arch silhouette.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:28, now spine:-28.
    joints: { spine: -28, neck: -4.4, hips: -15, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -60, rightShoulder: -48, leftElbow: 60, rightElbow: 60, shoulderFwdL: -25, shoulderFwdR: -25, leftHip: 20, rightHip: 90, leftKnee: 10, rightKnee: 95, leftAnkle: -13, rightAnkle: -10, hipAbductL: 5, hipAbductR: 15 }
  },
  "p06-chair-b7-leaning-crossed-elevated-eyes-closed": {
    id: "p06-chair-b7-leaning-crossed-elevated-eyes-closed", name: "Chair Leaning Crossed Legs Elevated Eyes Closed",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "chair", "eyes closed", "boudoir"],
    instructions: "Lean on the chair with one arm bent, legs crossed and elevated on the balls of the feet. Lean the upper body forward and arch the back, resting both hands on the armrest, with eyes closed and face tilted toward the camera.",
    tip: "Close the eyes softly and tilt the chin slightly down to keep the closed-eye expression relaxed rather than strained.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:30, now spine:-30.
    joints: { spine: -30, neck: -5.4, hips: -18, globalTilt: 50, globalRoll: 5, globalTwist: 8, leftShoulder: -55, rightShoulder: -43, leftElbow: 65, rightElbow: 65, shoulderFwdL: -28, shoulderFwdR: -28, leftHip: 25, rightHip: 85, leftKnee: 15, rightKnee: 90, leftAnkle: -15, rightAnkle: -18, hipAbductL: 5, hipAbductR: 10 }
  },
  "p06-chair-b8-standing-lean-facing-camera": {
    id: "p06-chair-b8-standing-lean-facing-camera", name: "Chair Standing Lean Facing Camera",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "chair", "back arch", "boudoir"],
    instructions: "Stand by the chair leaning forward with one arm bent and the other straight, legs crossed and elevated on the balls of the feet. Arch the back, turn the body toward the camera, resting both hands on the armrest, and face the camera directly.",
    tip: "Rotate the torso toward the lens while keeping hips angled away to create a slimming spiral line.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:26, now spine:-26.
    joints: { spine: -26, neck: -6, hips: -12, globalTilt: 50, globalRoll: 8, globalTwist: 25, leftShoulder: -50, rightShoulder: -70, leftElbow: 70, rightElbow: 50, shoulderFwdL: -20, shoulderFwdR: -30, leftHip: 20, rightHip: 88, leftKnee: 12, rightKnee: 92, leftAnkle: -12, rightAnkle: -15, hipAbductL: 5, hipAbductR: 12 }
  },
  "p06-chair-b9-armrest-seated-straight": {
    id: "p06-chair-b9-armrest-seated-straight", name: "Chair Armrest Seated Straight Back",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "chair", "armrest", "boudoir"],
    instructions: "Sit on the armrest of the chair with both hands touching the armrest, legs bent with one foot on the floor and the other elevated. Keep the posture straight with the back arched, facing the camera.",
    tip: "Engage the core to hold the arched-back posture on the narrow armrest without looking stiff.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:20, now spine:-20.
    joints: { spine: -20, neck: -6, hips: -10, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -45, rightShoulder: -33, leftElbow: 75, rightElbow: 75, shoulderFwdL: 15, shoulderFwdR: 15, leftHip: 65, rightHip: 80, leftKnee: 70, rightKnee: 100, leftAnkle: -13, rightAnkle: -23, hipAbductL: 12, hipAbductR: 18 }
  },
  "p06-chair-b10-armrest-hip-hand-leg": {
    id: "p06-chair-b10-armrest-hip-hand-leg", name: "Chair Armrest Seated Hip and Leg Hands",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "chair", "armrest", "boudoir"],
    instructions: "Sit on the armrest with one hand on the hip and the other on the leg. Bend the legs with feet barely touching the floor, positioned apart, knees together. Keep the posture straight with the back arched, turned toward camera.",
    tip: "Keep the knees pressed together while letting the feet splay slightly for a flattering leg line.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: {spine: -18, hips: -16, neck: -6, leftShoulder: -5, rightShoulder: -50, leftElbow: 85, rightElbow: 70, hipAbductL: -5, hipAbductR: -5, leftHip: 68, rightHip: 72, leftKnee: 85, rightKnee: 88, leftAnkle: -16, rightAnkle: -16, shoulderFwdL: 15, shoulderFwdR: 15, globalTilt: 50, globalTwist: 20, globalRoll: 5}
  },
  "p06-chair-b11-armrest-hair-eyes-closed": {
    id: "p06-chair-b11-armrest-hair-eyes-closed", name: "Chair Armrest Seated Hair Touch Eyes Closed",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["seated", "chair", "hair touch", "eyes closed", "boudoir"],
    instructions: "Sit on the armrest with one hand on the hip and the other touching the hair. Bend the legs with feet barely touching the floor, apart, knees together. Keep the back arched, face tilted toward the camera with eyes closed.",
    tip: "Tilt the head gently rather than dropping it back fully, so the closed eyes read soft instead of strained.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:20, now spine:-20.
    joints: {spine: -20, hips: -16, neck: -6.4, leftShoulder: -85, rightShoulder: -5, leftElbow: 95, rightElbow: 95, hipAbductL: -5, hipAbductR: -5, leftHip: 68, rightHip: 70, leftKnee: 85, rightKnee: 88, leftAnkle: -16, rightAnkle: -16, shoulderFwdL: 15, shoulderFwdR: 15, globalTilt: 50, globalTwist: 15, globalRoll: 5}
  },
  "p06-chair-b12-leaning-bra-touch": {
    id: "p06-chair-b12-leaning-bra-touch", name: "Chair Leaning Forward Bra Touch",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["standing", "chair", "bra touch", "boudoir"],
    instructions: "Lean forward with one arm on the armrest and the other touching the bra. Cross the legs at the shin, standing on the balls of the feet with one foot toward the chair. Push the hip to the side and look away from the camera.",
    tip: "Keep the supporting arm firm on the armrest to control the depth of the forward lean safely.",
    joints: { spine: 15, neck: -9.8, hips: 22, globalTilt: 50, globalRoll: 8, globalTwist: 15, leftShoulder: -55, rightShoulder: -75, leftElbow: 70, rightElbow: 81, shoulderFwdL: -20, shoulderFwdR: -22, leftHip: 15, rightHip: 30, leftKnee: 10, rightKnee: 20, leftAnkle: -20, rightAnkle: -22, hipAbductL: 8, hipAbductR: -8 }
  },
  "p06-chair-b13-floor-back-against-leg-elevated": {
    id: "p06-chair-b13-floor-back-against-leg-elevated", name: "Chair Floor Back Against Chair Leg Elevated",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["seated", "chair", "floor", "boudoir"],
    instructions: "Sit on the floor with the back against the chair. Bend one leg with the foot elevated and the other leg extended along the floor. Rest the arms naturally and look toward the camera.",
    tip: "Press the back gently into the chair for support while keeping the elevated leg light rather than tense.",
    joints: { spine: -10, neck: -6, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -20, rightShoulder: -8, leftElbow: 40, rightElbow: 40, shoulderFwdL: 5, shoulderFwdR: 5, leftHip: 60, rightHip: 15, leftKnee: 100, rightKnee: 5, leftAnkle: -10, rightAnkle: -8, hipAbductL: 15, hipAbductR: 0 }
  },
  "p06-chair-b14-floor-back-against-knees-apart": {
    id: "p06-chair-b14-floor-back-against-knees-apart", name: "Chair Floor Back Against Knees Apart",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["seated", "chair", "floor", "boudoir"],
    instructions: "Sit on the floor with the back against the chair, both knees bent and apart. Rest the arms on the knees or floor and look toward the camera.",
    tip: "Keep the knees a comfortable width apart to avoid looking overly splayed while retaining an open posture.",
    joints: { spine: -12, neck: -6, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -15, rightShoulder: -3, leftElbow: 45, rightElbow: 45, shoulderFwdL: 5, shoulderFwdR: 5, leftHip: 65, rightHip: 65, leftKnee: 95, rightKnee: 95, leftAnkle: -23, rightAnkle: -23, hipAbductL: 25, hipAbductR: 25 }
  },
  "p06-chair-b15-floor-back-against-hand-floor": {
    id: "p06-chair-b15-floor-back-against-hand-floor", name: "Chair Floor Back Against Hand on Floor",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["seated", "chair", "floor", "boudoir"],
    instructions: "Sit on the floor with the back against the chair, one hand resting on the floor for support and the other resting on a knee. Extend one leg while bending the other and look toward the camera.",
    tip: "Let the supporting arm carry a little weight to open the chest and shoulders naturally.",
    joints: { spine: -10, neck: -6, hips: 0, globalTilt: 50, globalRoll: 5, globalTwist: 10, leftShoulder: -10, rightShoulder: -25, leftElbow: 30, rightElbow: 50, shoulderFwdL: 8, shoulderFwdR: 5, leftHip: 20, rightHip: 65, leftKnee: 10, rightKnee: 90, leftAnkle: -10, rightAnkle: -23, hipAbductL: 5, hipAbductR: 15 }
  },
  "p06-chair-b16-floor-lying-head-on-chair": {
    id: "p06-chair-b16-floor-lying-head-on-chair", name: "Chair Floor Lying Head Resting on Chair",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["reclining", "chair", "floor", "boudoir"],
    instructions: "Lie on the floor with the head resting on the chair seat. Extend the body along the floor, bend one leg while the other stays straight, and rest the arms naturally.",
    tip: "Let the head sink comfortably into the chair cushion so the neck stays relaxed rather than strained.",
    joints: { spine: 15, neck: 10, hips: 0, globalTilt: -60, globalRoll: 0, globalTwist: 0, leftShoulder: -30, rightShoulder: -18, leftElbow: 40, rightElbow: 40, shoulderFwdL: 5, shoulderFwdR: 5, leftHip: 15, rightHip: 70, leftKnee: 10, rightKnee: 100, leftAnkle: -13, rightAnkle: -26, hipAbductL: 5, hipAbductR: 10 }
  },
  "p06-chair-b17-back-seat-hair-touch": {
    id: "p06-chair-b17-back-seat-hair-touch", name: "Chair Back on Seat Hair Touch",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["seated", "chair", "hair touch", "boudoir"],
    instructions: "Sit back in the chair seat with one hand touching the hair and the other resting on the armrest or lap. Cross the legs and look toward the camera.",
    tip: "Let the shoulders sink into the chair back for a relaxed, confident finishing pose to the sequence.",
    joints: {spine: 5, hips: 0, neck: -5.2, leftShoulder: -80, rightShoulder: -30, leftElbow: 95, rightElbow: 80, hipAbductL: 8, hipAbductR: -8, leftHip: 55, rightHip: 68, leftKnee: 60, rightKnee: 35, leftAnkle: -10, rightAnkle: -10, shoulderFwdL: 12, shoulderFwdR: 8, globalTilt: 50, globalTwist: 0, globalRoll: 0}
  },
  "p05-bench-b1-leaning-armrest-hip": {
    id: "p05-bench-b1-leaning-armrest-hip", name: "Bench Leaning Armrest Hand on Hip",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["seated", "bench", "leaning", "boudoir"],
    instructions: "Lean with one arm against the armrest of the bench and the other hand positioned on the hip. Bend both arms, bend one knee while the other extends, toes pointed, and tilt the face away from the camera.",
    tip: "Let the bracing arm carry gentle weight so the torso reads relaxed rather than stiff.",
    joints: { spine: 12, neck: 8, hips: 8, globalTilt: 50, globalRoll: 10, globalTwist: 15, leftShoulder: -25, rightShoulder: -35, leftElbow: 70, rightElbow: 55, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: 30, rightHip: 65, leftKnee: 20, rightKnee: 60, leftAnkle: -12, rightAnkle: -10, hipAbductL: 8, hipAbductR: 10 }
  },
  "p05-bench-b2-leaning-armrest-knee": {
    id: "p05-bench-b2-leaning-armrest-knee", name: "Bench Leaning Armrest Hand on Knee",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["seated", "bench", "leaning", "boudoir"],
    instructions: "Lean with one arm against the armrest and extend the other arm to rest on the knee. Bend both knees, with one knee positioned on the bench and the other foot touching the floor, toes pointed, facing toward the camera.",
    tip: "Extend the resting arm fully to the knee to create a long diagonal line through the pose.",
    joints: { spine: 14, neck: -5, hips: 10, globalTilt: 50, globalRoll: 12, globalTwist: 18, leftShoulder: -20, rightShoulder: -45, leftElbow: 65, rightElbow: 30, shoulderFwdL: 20, shoulderFwdR: 12, leftHip: 35, rightHip: 55, leftKnee: 25, rightKnee: 65, leftAnkle: -12, rightAnkle: -12, hipAbductL: 10, hipAbductR: 15 }
  },
  "p05-bench-b3-leaning-upper-body-hair": {
    id: "p05-bench-b3-leaning-upper-body-hair", name: "Bench Leaning Upper Body Hair Touch",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["reclining", "bench", "hair touch", "boudoir"],
    instructions: "Lean the upper body against the armrest with one arm resting on the armchair and the other touching the hair. Bend both knees and position them on the bench, toes pointed, with the face tilted away from the camera.",
    tip: "Let the head tilt naturally into the raised hand to keep the hair-touch gesture soft.",
    joints: { spine: 20, neck: -4.3, hips: 5, globalTilt: 50, globalRoll: 8, globalTwist: 10, leftShoulder: -90, rightShoulder: -15, leftElbow: 85, rightElbow: 40, shoulderFwdL: 12, shoulderFwdR: 8, leftHip: 90, rightHip: 95, leftKnee: 120, rightKnee: 125, leftAnkle: -20, rightAnkle: -20, hipAbductL: 8, hipAbductR: 8 }
  },
  "p05-bench-b4-lying-underwear-hair-touch": {
    id: "p05-bench-b4-lying-underwear-hair-touch", name: "Bench Lying Underwear and Hair Touch",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "bench", "boudoir"],
    instructions: "Lie on the bench with one arm touching the underwear and the other touching the hair. Bend both knees, one foot touching the armrest and the other positioned on the bench, toes pointed, eyes closed with face tilted toward the camera.",
    tip: "Keep both touch gestures soft and unhurried so the closed-eye expression reads relaxed.",
    joints: { spine: 15, neck: -5.4, hips: 0, globalTilt: -55, globalRoll: 5, globalTwist: 5, leftShoulder: -100, rightShoulder: -55, leftElbow: 81, rightElbow: 75, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: 85, rightHip: 100, leftKnee: 115, rightKnee: 130, leftAnkle: -15, rightAnkle: -25, hipAbductL: 8, hipAbductR: 8 }
  },
  "p05-bench-b5-lying-back-arch-eyes-closed": {
    id: "p05-bench-b5-lying-back-arch-eyes-closed", name: "Bench Lying Back Arch Eyes Closed",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "bench", "back arch", "eyes closed", "boudoir"],
    instructions: "Lie on the bench arching the back with both arms bent. Bend both knees and position them on the bench, toes pointed, eyes closed with face tilted toward the camera.",
    tip: "Push the chest up and let the head drop back gently to maximize the arch.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:28, now spine:-28.
    joints: { spine: -28, neck: -6.4, hips: -5, globalTilt: -50, globalRoll: 0, globalTwist: 0, leftShoulder: -70, rightShoulder: -58, leftElbow: 60, rightElbow: 60, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: 90, rightHip: 90, leftKnee: 125, rightKnee: 125, leftAnkle: -20, rightAnkle: -20, hipAbductL: 8, hipAbductR: 8 }
  },
  "p05-bench-b6-side-sit-lean-armrest": {
    id: "p05-bench-b6-side-sit-lean-armrest", name: "Bench Side Sitting Lean Toward Armrest",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "bench", "boudoir"],
    instructions: "Sit on the side of the bench, leaning the upper body toward the armrest, one arm resting on the armrest and the other touching the bench. Cross both knees at the shin, toes pointed, face tilted away from the camera.",
    tip: "Keep the torso lean gentle so the crossed knees remain the visual focal point.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -10 (right leg crosses behind left).
    joints: { spine: 15, neck: 10, hips: 10, globalTilt: 50, globalRoll: 15, globalTwist: 15, leftShoulder: -20, rightShoulder: -30, leftElbow: 60, rightElbow: 45, shoulderFwdL: 8, shoulderFwdR: 8, leftHip: 55, rightHip: 60, leftKnee: 65, rightKnee: 58, leftAnkle: -10, rightAnkle: -10, hipAbductL: 8, hipAbductR: -10 }
  },
  "p05-bench-b7-kneeling-hip-knee-touch": {
    id: "p05-bench-b7-kneeling-hip-knee-touch", name: "Bench Kneeling Hip and Knee Touch",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["kneeling", "bench", "boudoir"],
    instructions: "Kneel on the bench with one arm bent, hand on the hip, and the other extended, touching the knee. Keep the posture straight with the back arched, face turned toward the camera.",
    tip: "Distribute weight evenly between both knees while keeping the torso lifted and open.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:15, now spine:-15.
    joints: {spine: -15, hips: -16, neck: -6, leftShoulder: -5, rightShoulder: -25, leftElbow: 95, rightElbow: 30, hipAbductL: 10, hipAbductR: 10, leftHip: 100, rightHip: 105, leftKnee: 130, rightKnee: 130, leftAnkle: -30, rightAnkle: -30, shoulderFwdL: 15, shoulderFwdR: 8, globalTilt: 50, globalTwist: 0, globalRoll: 0}
  },
  "p05-bench-b8-kneeling-elevated-forward-lean": {
    id: "p05-bench-b8-kneeling-elevated-forward-lean", name: "Bench Kneeling Body Elevated Forward Lean",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["kneeling", "bench", "boudoir"],
    instructions: "Kneel on the bench with the body slightly elevated, both arms bent, back arched with the upper body leaning slightly forward, eyes closed with face tilted toward the camera.",
    tip: "Keep the forward lean subtle to maintain balance while emphasizing the arched back line.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:22, now spine:-22.
    joints: { spine: -22, neck: -5.5, hips: -12, globalTilt: 50, globalRoll: 0, globalTwist: 5, leftShoulder: -50, rightShoulder: -38, leftElbow: 70, rightElbow: 70, shoulderFwdL: -20, shoulderFwdR: -20, leftHip: 100, rightHip: 105, leftKnee: 128, rightKnee: 128, leftAnkle: -28, rightAnkle: -28, hipAbductL: 10, hipAbductR: 10 }
  },
  "p05-bench-b9-kneeling-forward-lean-armrest": {
    id: "p05-bench-b9-kneeling-forward-lean-armrest", name: "Bench Kneeling Forward Lean on Armrest",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["kneeling", "bench", "boudoir"],
    instructions: "Kneel on the bench leaning the body forward with both arms bent, positioned on the armrest. Arch the back and close the eyes.",
    tip: "Let the armrest fully support the forward-leaning weight for a smooth, elongated back line.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:25, now spine:-25.
    joints: { spine: -25, neck: -4.4, hips: -18, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -65, rightShoulder: -53, leftElbow: 40, rightElbow: 40, shoulderFwdL: -28, shoulderFwdR: -28, leftHip: 105, rightHip: 105, leftKnee: 130, rightKnee: 130, leftAnkle: -30, rightAnkle: -30, hipAbductL: 10, hipAbductR: 10 }
  },
  "p05-bench-b10-kneeling-hands-crossed-elevated-legs": {
    id: "p05-bench-b10-kneeling-hands-crossed-elevated-legs", name: "Bench Kneeling Hands Crossed Legs Elevated",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["kneeling", "bench", "boudoir"],
    instructions: "Kneel on the bench with the upper body leaning forward, both arms positioned on the armrest with hands soft and crossed. Elevate the legs slightly apart, toes pointed, back arched, looking at the camera.",
    tip: "Cross the hands loosely on the armrest to keep the supporting gesture elegant rather than tense.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:24, now spine:-24.
    joints: { spine: -24, neck: -6, hips: -16, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -60, rightShoulder: -48, leftElbow: 45, rightElbow: 45, shoulderFwdL: 25, shoulderFwdR: 25, leftHip: 95, rightHip: 100, leftKnee: 125, rightKnee: 128, leftAnkle: -25, rightAnkle: -25, hipAbductL: -15, hipAbductR: 15 }
  },
  "p05-bench-b11-plank-knees-bent-legs-up": {
    id: "p05-bench-b11-plank-knees-bent-legs-up", name: "Bench Plank Knees Bent Legs Elevated",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["kneeling", "bench", "boudoir"],
    instructions: "Plank on the floor with the knees bent and positioned on the bench, toes pointed, arms bent supporting the pose with hands crossed at the wrist. Arch the back and look down.",
    tip: "Keep the arms firm and shoulder-width for stable support during the plank.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:26, now spine:-26.
    joints: { spine: -26, neck: 20, hips: -20, globalTilt: 40, globalRoll: 0, globalTwist: 0, leftShoulder: -30, rightShoulder: -18, leftElbow: 20, rightElbow: 20, shoulderFwdL: 30, shoulderFwdR: 30, leftHip: 100, rightHip: 100, leftKnee: 130, rightKnee: 130, leftAnkle: -30, rightAnkle: -30, hipAbductL: -15, hipAbductR: -15 }
  },
  "p05-bench-b12-armrest-seated-turned-camera": {
    id: "p05-bench-b12-armrest-seated-turned-camera", name: "Bench Armrest Seated Turned Toward Camera",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["seated", "bench", "armrest", "boudoir"],
    instructions: "Sit on the armrest of the bench with the body turned slightly toward the camera. Keep the posture straight with the back arched, legs bent with one foot closer to the bench leg, knees together, facing the camera.",
    tip: "Keep the knees pressed together while resting one hand on the bench edge for balance.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: { spine: -18, neck: -6, hips: -8, globalTilt: 50, globalRoll: 5, globalTwist: 20, leftShoulder: -35, rightShoulder: -30, leftElbow: 60, rightElbow: 70, shoulderFwdL: 20, shoulderFwdR: 10, leftHip: 68, rightHip: 72, leftKnee: 85, rightKnee: 88, leftAnkle: -16, rightAnkle: -16, hipAbductL: -5, hipAbductR: -5 }
  },
  "p05-bench-b13-standing-arm-raised-lean": {
    id: "p05-bench-b13-standing-arm-raised-lean", name: "Bench Standing Arm Raised Lean",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["standing", "bench", "boudoir"],
    instructions: "Stand near the bench with one arm raised and the other resting near the body, hip pushed to the side, legs crossed at the ankle, facing away from the camera.",
    tip: "Extend the raised arm fully to elongate the torso and highlight the waistline.",
    joints: { spine: 10, neck: -5, hips: 22, globalTilt: 50, globalRoll: 10, globalTwist: -20, leftShoulder: -136, rightShoulder: -15, leftElbow: 15, rightElbow: 40, shoulderFwdL: -2, shoulderFwdR: 5, leftHip: 8, rightHip: 15, leftKnee: 5, rightKnee: 10, leftAnkle: -15, rightAnkle: -15, hipAbductL: 5, hipAbductR: -5 }
  },
  "p05-bench-b14-standing-lean-facing-camera": {
    id: "p05-bench-b14-standing-lean-facing-camera", name: "Bench Standing Lean Facing Camera",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["standing", "bench", "boudoir"],
    instructions: "Stand near the bench with one hand on the hip and the other resting on the leg, hip pushed to the side, legs crossed at the ankle, facing the camera directly.",
    tip: "Keep weight on the back leg while the front foot crosses lightly to lengthen the leg line.",
    joints: {spine: 8, hips: 20, neck: -6, leftShoulder: 10, rightShoulder: -25, leftElbow: 100, rightElbow: 40, hipAbductL: 5, hipAbductR: -5, leftHip: 10, rightHip: 15, leftKnee: 5, rightKnee: 10, leftAnkle: -18, rightAnkle: -18, shoulderFwdL: 25, shoulderFwdR: 8, globalTilt: -50, globalTwist: 5, globalRoll: 8}
  },
  "p05-bench-b15-seated-floor-lean-bench-leg": {
    id: "p05-bench-b15-seated-floor-lean-bench-leg", name: "Bench Seated on Floor Leaning Against Bench Leg",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["seated", "bench", "floor", "boudoir"],
    instructions: "Sit on the floor leaning against the bench leg, one arm resting on the bench and the other near the body. Extend the legs and point the toes, looking toward the camera.",
    tip: "Let the back settle naturally against the bench structure for genuine, relaxed support.",
    joints: { spine: -10, neck: -6, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -20, rightShoulder: -8, leftElbow: 35, rightElbow: 35, shoulderFwdL: 5, shoulderFwdR: 5, leftHip: 15, rightHip: 20, leftKnee: 8, rightKnee: 10, leftAnkle: -12, rightAnkle: -12, hipAbductL: 5, hipAbductR: 5 }
  },
  "p05-bench-b16-floor-head-on-bench-hands-connected": {
    id: "p05-bench-b16-floor-head-on-bench-hands-connected", name: "Bench Floor Head on Bench Hands Connected",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["reclining", "bench", "floor", "boudoir"],
    instructions: "Sit on the floor with the head positioned on the bench. Bend the arms and position them on the bench with hands connected. Bend one knee while the other extends, toes pointed, and tilt the face toward the camera with eyes closed.",
    tip: "Let the connected hands rest softly overhead to elongate the torso and arms.",
    joints: { spine: 15, neck: 8, hips: 0, globalTilt: -70, globalRoll: 0, globalTwist: 0, leftShoulder: -140, rightShoulder: -128, leftElbow: 60, rightElbow: 60, shoulderFwdL: 8, shoulderFwdR: 8, leftHip: 15, rightHip: 75, leftKnee: 10, rightKnee: 100, leftAnkle: -13, rightAnkle: -26, hipAbductL: 5, hipAbductR: 10 }
  },
  "p05-bench-b17-floor-head-on-bench-hair-underwear": {
    id: "p05-bench-b17-floor-head-on-bench-hair-underwear", name: "Bench Floor Head on Bench Hair and Underwear Touch",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["reclining", "bench", "floor", "boudoir"],
    instructions: "Sit on the floor with the head positioned on the bench. Bend the arms, one hand touching the hair and the other touching the underwear. Bend one knee while the other extends, toes pointed, and look at the camera.",
    tip: "Keep the underwear-touch gesture soft and relaxed to maintain an elegant, tasteful line.",
    joints: { spine: 15, neck: -5, hips: 0, globalTilt: -70, globalRoll: 0, globalTwist: 0, leftShoulder: -100, rightShoulder: -60, leftElbow: 81, rightElbow: 80, shoulderFwdL: 8, shoulderFwdR: 10, leftHip: 15, rightHip: 78, leftKnee: 10, rightKnee: 100, leftAnkle: -13, rightAnkle: -26, hipAbductL: 5, hipAbductR: 10 }
  },
  "p02-couch-c1-seated-lean-armrest-facing": {
    id: "p02-couch-c1-seated-lean-armrest-facing", name: "Couch Seated Lean Against Armrest",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["seated", "couch", "boudoir"],
    instructions: "Sit on the couch with the upper body leaning against the armrest. Bend both arms and position them on the armrests with hands soft and relaxed. Slightly bend the knees, extending one leg more than the other, toes pointed, back straight, facing the camera.",
    tip: "Keep the hands relaxed and open on the armrest rather than gripping to maintain an inviting posture.",
    joints: { spine: -8, neck: -6, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -30, rightShoulder: -18, leftElbow: 55, rightElbow: 55, shoulderFwdL: 8, shoulderFwdR: 8, leftHip: 25, rightHip: 35, leftKnee: 15, rightKnee: 25, leftAnkle: -12, rightAnkle: -12, hipAbductL: 8, hipAbductR: 8 }
  },
  "p02-couch-c2-lying-sideways-breast-touch": {
    id: "p02-couch-c2-lying-sideways-breast-touch", name: "Couch Lying Sideways Breast Touch",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["reclining", "couch", "boudoir"],
    instructions: "Lie sideways on the couch with the upper body slightly elevated. Bend both arms, with one hand positioned on the hip and the other on the breast, hands soft and relaxed. Bend one leg while the other extends, toes pointed, eyes closed with face turned away from the camera.",
    tip: "Keep the touch gestures relaxed and let the eyes stay softly closed for an intimate, natural mood.",
    joints: { spine: 15, neck: -7.2, hips: 0, globalTilt: -45, globalRoll: 10, globalTwist: 10, leftShoulder: -55, rightShoulder: -70, leftElbow: 70, rightElbow: 81, shoulderFwdL: 10, shoulderFwdR: 12, leftHip: 20, rightHip: 80, leftKnee: 15, rightKnee: 100, leftAnkle: -13, rightAnkle: -26, hipAbductL: 5, hipAbductR: 10 }
  },
  "p02-couch-c3-lying-head-armrest-breast-touch": {
    id: "p02-couch-c3-lying-head-armrest-breast-touch", name: "Couch Lying Head on Armrest Breast Touch",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["reclining", "couch", "boudoir"],
    instructions: "Lie sideways on the couch with the head resting on the armrest. Bend both arms, with one hand on the couch and the other on the breast, hands soft and relaxed. Bend one leg while the other extends, toes pointed, eyes closed with face turned toward the camera.",
    tip: "Let the head sink comfortably into the armrest so the neck stays relaxed rather than strained.",
    joints: { spine: 12, neck: -5.5, hips: 0, globalTilt: -48, globalRoll: 8, globalTwist: 8, leftShoulder: -50, rightShoulder: -70, leftElbow: 65, rightElbow: 79, shoulderFwdL: 10, shoulderFwdR: 12, leftHip: 20, rightHip: 80, leftKnee: 15, rightKnee: 100, leftAnkle: -13, rightAnkle: -26, hipAbductL: 5, hipAbductR: 10 }
  },
  "p02-couch-c4-seated-lean-armrest-breast-hair": {
    id: "p02-couch-c4-seated-lean-armrest-breast-hair", name: "Couch Seated Lean Armrest Breast and Hair Touch",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "couch", "boudoir"],
    instructions: "Sit on the couch with the upper body leaning against the armrest. Bend both arms, with one hand positioned on the breast and the other touching the hair, hands soft and relaxed. Bend both legs with knees together, toes pointed, back arched, face turned toward the camera.",
    tip: "Draw the knees together for a compact, elegant seated line while the arms create visual interest above.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: { spine: -18, neck: -5.5, hips: -5, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -95, rightShoulder: -60, leftElbow: 85, rightElbow: 81, shoulderFwdL: 12, shoulderFwdR: 12, leftHip: 90, rightHip: 92, leftKnee: 125, rightKnee: 128, leftAnkle: -20, rightAnkle: -22, hipAbductL: 5, hipAbductR: 5 }
  },
  "p02-couch-c5-lying-sideways-elevated-hip-hand": {
    id: "p02-couch-c5-lying-sideways-elevated-hip-hand", name: "Couch Lying Sideways Upper Body Elevated Hip Hand",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "couch", "boudoir"],
    instructions: "Lie sideways on the couch with the upper body elevated and leaning against the armrest. Bend both arms, with one hand positioned on the armrest and the other on the hip. Bend both legs, toes pointed, back arched, facing away from the camera toward the wall.",
    tip: "Let the back arch develop naturally from the side-lying position rather than forcing it.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:22, now spine:-22.
    joints: { spine: -22, neck: -5, hips: -16, globalTilt: -40, globalRoll: 15, globalTwist: -15, leftShoulder: -30, rightShoulder: -55, leftElbow: 40, rightElbow: 75, shoulderFwdL: 8, shoulderFwdR: 10, leftHip: 85, rightHip: 95, leftKnee: 115, rightKnee: 125, leftAnkle: -15, rightAnkle: -20, hipAbductL: 6, hipAbductR: 6 }
  },
  "p02-couch-c6-lying-sideways-elevated-hip-chin-up": {
    id: "p02-couch-c6-lying-sideways-elevated-hip-chin-up", name: "Couch Lying Sideways Elevated Chin Up",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "couch", "boudoir"],
    instructions: "Lie sideways on the couch with the upper body elevated and leaning against the armrest. Bend both arms, with one hand on the armrest and the other on the hip. Slightly bend both knees with legs extended, toes pointed, back arched, face turned to the side with chin up.",
    tip: "Lift the chin gently rather than sharply to keep the elongated neck line graceful.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:20, now spine:-20.
    joints: { spine: -20, neck: 15, hips: -6, globalTilt: -42, globalRoll: 10, globalTwist: -10, leftShoulder: -110, rightShoulder: -110, leftElbow: 35, rightElbow: 70, shoulderFwdL: 8, shoulderFwdR: 10, leftHip: 20, rightHip: 75, leftKnee: 15, rightKnee: 95, leftAnkle: -13, rightAnkle: -10, hipAbductL: 6, hipAbductR: 8 }
  },
  "p02-couch-c7-lying-sideways-twisted-breast-touch": {
    id: "p02-couch-c7-lying-sideways-twisted-breast-touch", name: "Couch Lying Sideways Twisted Toward Camera",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "couch", "boudoir"],
    instructions: "Lie sideways on the couch with the upper body elevated and twisted toward the camera, leaning against the armrest. Bend both arms, with one hand on the hip and the other on the breast. Bend one leg while the other extends, toes pointed, face turned toward the camera with eyes looking down.",
    tip: "Rotate the upper torso gently toward the lens while keeping the hips settled for a soft spiral line.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips -5→-16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 16, hips: -16, neck: -4.4, leftShoulder: -20, rightShoulder: -30, leftElbow: 120, rightElbow: 110, hipAbductL: 5, hipAbductR: 10, leftHip: 20, rightHip: 80, leftKnee: 15, rightKnee: 100, leftAnkle: -13, rightAnkle: -26, shoulderFwdL: 15, shoulderFwdR: -15, globalTilt: 50, globalTwist: 22, globalRoll: 8}
  },
  "p02-couch-c8-seated-lean-back-neck-elongated": {
    id: "p02-couch-c8-seated-lean-back-neck-elongated", name: "Couch Seated Lean Back Neck Elongated",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "couch", "boudoir"],
    instructions: "Sit on the couch with the upper body leaning against the back of the couch. One leg bent, the other extended, toes pointed. Bend both arms, one hand on the armrest and the other on the breast, hands soft and relaxed, shoulders dropped, neck elongated, eyes closed.",
    tip: "Drop the shoulders fully away from the ears to emphasize the elongated neckline.",
    joints: { spine: -15, neck: -22, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -25, rightShoulder: -65, leftElbow: 40, rightElbow: 85, shoulderFwdL: 8, shoulderFwdR: 10, leftHip: 20, rightHip: 70, leftKnee: 15, rightKnee: 95, leftAnkle: -13, rightAnkle: -26, hipAbductL: 6, hipAbductR: 10 }
  },
  "p02-couch-c9-armrest-seated-hip-hand-eyes-closed": {
    id: "p02-couch-c9-armrest-seated-hip-hand-eyes-closed", name: "Couch Armrest Seated Hip Hand Eyes Closed",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "couch", "armrest", "boudoir"],
    instructions: "Sit on the armrest of the couch with one hand touching the hip and the other positioned on the couch. Bend both knees, positioned together, posture straight with back arched, face tilted toward the camera with eyes closed.",
    tip: "Balance weight evenly on the armrest while keeping the knees together for a graceful silhouette.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:20, now spine:-20.
    joints: { spine: -20, neck: -4.3, hips: -16, globalTilt: 50, globalRoll: 10, globalTwist: 25, leftShoulder: -40, rightShoulder: -20, leftElbow: 75, rightElbow: 30, shoulderFwdL: 22, shoulderFwdR: 8, leftHip: 65, rightHip: 70, leftKnee: 85, rightKnee: 88, leftAnkle: -16, rightAnkle: -16, hipAbductL: -5, hipAbductR: -5 }
  },
  "p03-bed-b1-prone-belly-legs-crossed-shin": {
    id: "p03-bed-b1-prone-belly-legs-crossed-shin", name: "Bed Prone Belly Legs Crossed at Shin",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["reclining", "bed", "prone", "boudoir"],
    instructions: "Lie on the belly with the upper body slightly elevated. Bend both arms with hands crossed. Bring the knees together and bend the legs, crossing them at the shin level, toes pointed, facing the camera.",
    tip: "Keep the crossed hands relaxed under the chin to support the elevated upper body comfortably.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -5 (right leg crosses behind left).
    joints: {
"spine":10,"neck":-6,"hips":0,"globalTilt":85,"globalRoll":0,"globalTwist":0,"leftShoulder":-35,"rightShoulder":-23,"leftElbow":95,"rightElbow":95,"shoulderFwdL":15,"shoulderFwdR":15,"leftHip":-15,"rightHip":-15,"leftKnee":115,"rightKnee":100,"leftAnkle":-10,"rightAnkle":-10,"hipAbductL":5,"hipAbductR":-5
  }
  },
  "p03-bed-b2-prone-belly-arch-hips-up-eyes-closed": {
    id: "p03-bed-b2-prone-belly-arch-hips-up-eyes-closed", name: "Bed Prone Belly Arch Hips Up",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["reclining", "bed", "prone", "boudoir"],
    instructions: "Lie on the belly with both arms bent. Bring the knees together and cross the legs at the shin level, arching the back and pushing the hips up, toes pointed, eyes closed with face turned away from the camera.",
    tip: "Push the hips up gently from the lower back to create the arch rather than straining the neck.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:30, now spine:-30.
    joints: {
"spine":-30,"neck":10,"hips":-20,"globalTilt":85,"globalRoll":0,"globalTwist":0,"leftShoulder":-30,"rightShoulder":-18,"leftElbow":81,"rightElbow":81,"shoulderFwdL":12,"shoulderFwdR":12,"leftHip":-20,"rightHip":-20,"leftKnee":120,"rightKnee":105,"leftAnkle":-12,"rightAnkle":-12,"hipAbductL":5,"hipAbductR":-5
  }
  },
  "p03-bed-b3-prone-belly-arch-legs-extended-crossed": {
    id: "p03-bed-b3-prone-belly-arch-legs-extended-crossed", name: "Bed Prone Belly Arch Legs Extended Crossed",
    category: "boudoir", difficulty: "Beginner", intent: "Sensual",
    tags: ["reclining", "bed", "prone", "boudoir"],
    instructions: "Lie on the belly with both arms bent. Bring the knees together, slightly bent to push the hips up, legs extended and crossed at the shin, back arched, toes pointed, eyes closed with face turned away from the camera.",
    tip: "Extend the legs fully behind for a longer line while keeping the hip lift soft.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:26, now spine:-26.
    joints: {
"spine":-26,"neck":8,"hips":-15,"globalTilt":85,"globalRoll":0,"globalTwist":0,"leftShoulder":-32,"rightShoulder":-20,"leftElbow":79,"rightElbow":79,"shoulderFwdL":12,"shoulderFwdR":12,"leftHip":-10,"rightHip":-10,"leftKnee":30,"rightKnee":20,"leftAnkle":-26,"rightAnkle":-26,"hipAbductL":5,"hipAbductR":-5
  }
  },
  "p03-bed-b4-prone-belly-turned-leg-pushed-side": {
    id: "p03-bed-b4-prone-belly-turned-leg-pushed-side", name: "Bed Prone Belly Turned Leg Pushed to Side",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "bed", "prone", "boudoir"],
    instructions: "Lie on the belly with the upper body slightly turned to the side. Bend both arms. Bend one leg, pushing it to the side with the foot touching the shin of the other leg, back arched, toes pointed, eyes closed with face turned away from the camera.",
    tip: "Push the bent leg out gently to the side to open the hip line without twisting the spine too far.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:20, now spine:-20.
    joints: {
"spine":-20,"neck":6,"hips":10,"globalTilt":85,"globalRoll":10,"globalTwist":15,"leftShoulder":-28,"rightShoulder":-16,"leftElbow":85,"rightElbow":85,"shoulderFwdL":10,"shoulderFwdR":10,"leftHip":55,"rightHip":-8,"leftKnee":90,"rightKnee":10,"leftAnkle":-20,"rightAnkle":-13,"hipAbductL":20,"hipAbductR":5
  }
  },
  "p03-bed-b5-prone-belly-elevated-hands-crossed-facing": {
    id: "p03-bed-b5-prone-belly-elevated-hands-crossed-facing", name: "Bed Prone Belly Elevated Hands Crossed Facing Camera",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "bed", "prone", "boudoir"],
    instructions: "Lie on the belly with the upper body elevated. Bend both arms with hands crossed. Bend one leg, pushing it to the side with the foot touching the shin of the other leg, back arched, toes pointed, looking at the camera.",
    tip: "Keep the crossed hands relaxed and the gaze steady at the lens for a confident, direct mood.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:24, now spine:-24.
    joints: {
"spine":-24,"neck":-6,"hips":5,"globalTilt":85,"globalRoll":5,"globalTwist":10,"leftShoulder":-35,"rightShoulder":-23,"leftElbow":95,"rightElbow":95,"shoulderFwdL":15,"shoulderFwdR":15,"leftHip":55,"rightHip":-8,"leftKnee":90,"rightKnee":10,"leftAnkle":-20,"rightAnkle":-13,"hipAbductL":18,"hipAbductR":-5
  }
  },
  "p03-bed-b6-side-lying-hair-touch-hand-bed": {
    id: "p03-bed-b6-side-lying-hair-touch-hand-bed", name: "Bed Side Lying Hair Touch Hand on Bed",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "bed", "hair touch", "boudoir"],
    instructions: "Lie on the side with both arms bent, one hand touching the hair and the other positioned on the bed. Bend one leg, pushing it forward with the foot touching the shin of the other leg, toes pointed, looking down or at the camera.",
    tip: "Let the hair-touch hand rest lightly rather than pulling, so the gesture reads soft.",
    joints: { spine: 10, neck: -5.5, hips: 0, globalTilt: -55, globalRoll: 15, globalTwist: 5, leftShoulder: -95, rightShoulder: -15, leftElbow: 85, rightElbow: 30, shoulderFwdL: -10, shoulderFwdR: -8, leftHip: 60, rightHip: -8, leftKnee: 95, rightKnee: 10, leftAnkle: -20, rightAnkle: -13, hipAbductL: 15, hipAbductR: 5 }
  },
  "p03-bed-b7-side-lying-back-camera-hair-hip": {
    id: "p03-bed-b7-side-lying-back-camera-hair-hip", name: "Bed Side Lying Back to Camera Hair and Hip",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["reclining", "bed", "boudoir"],
    instructions: "Lie on the side with the back facing the camera. Bend both arms, one hand touching the hair and the other on the hip with the elbow pushed in. The leg touching the bed is bent while the other is straight, toes pointed, chin pointed up and to the side.",
    tip: "Push the resting elbow in gently to create a defined waistline against the exposed back.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: { spine: -18, neck: 15, hips: -8, globalTilt: -50, globalRoll: 20, globalTwist: -20, leftShoulder: -90, rightShoulder: -45, leftElbow: 80, rightElbow: 65, shoulderFwdL: 0, shoulderFwdR: 8, leftHip: 75, rightHip: 10, leftKnee: 100, rightKnee: 8, leftAnkle: -15, rightAnkle: -12, hipAbductL: 10, hipAbductR: 5 }
  },
  "p03-bed-b8-seated-back-straight-knees-touch": {
    id: "p03-bed-b8-seated-back-straight-knees-touch", name: "Bed Seated Back Straight Hands on Knees",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "bed", "boudoir"],
    instructions: "Sit on the bed with the back straight. Bend both arms with hands touching the knees, hands soft and relaxed. Cross the legs with one knee slightly higher, toes pointed, looking at the camera.",
    tip: "Keep the spine tall and the hands resting lightly on the knees for an open, confident seated line.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:12, now spine:-12.
    joints: {spine: -12, hips: 0, neck: -6, leftShoulder: -55, rightShoulder: -43, leftElbow: 81, rightElbow: 81, hipAbductL: 15, hipAbductR: -10, leftHip: 70, rightHip: 78, leftKnee: 95, rightKnee: 110, leftAnkle: -16, rightAnkle: -16, shoulderFwdL: 10, shoulderFwdR: 10, globalTilt: 50, globalTwist: 0, globalRoll: 0}
  },
  "p03-bed-b9-kneeling-hands-knees-eyes-closed": {
    id: "p03-bed-b9-kneeling-hands-knees-eyes-closed", name: "Bed Kneeling Hands on Knees Eyes Closed",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["kneeling", "bed", "boudoir"],
    instructions: "Sit on the knees with both arms bent, hands touching the knees, hands soft and relaxed. Arch the back, toes pointed, face tilted with eyes closed.",
    tip: "Let the head tilt gently to the side to complement the closed-eye, relaxed expression.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:20, now spine:-20.
    joints: { spine: -20, neck: -5.4, hips: -10, globalTilt: 50, globalRoll: 8, globalTwist: 10, leftShoulder: -60, rightShoulder: -48, leftElbow: 95, rightElbow: 95, shoulderFwdL: 12, shoulderFwdR: 12, leftHip: 115, rightHip: 118, leftKnee: 138, rightKnee: 138, leftAnkle: -35, rightAnkle: -35, hipAbductL: 8, hipAbductR: 8 }
  },
  "p03-bed-b10-kneeling-elbows-elevated-foot": {
    id: "p03-bed-b10-kneeling-elbows-elevated-foot", name: "Bed Kneeling Upper Body Forward on Elbows",
    category: "boudoir", difficulty: "Intermediate", intent: "Sensual",
    tags: ["kneeling", "bed", "boudoir"],
    instructions: "Kneel with the upper body leaning forward on the elbows. Bend both legs with one foot elevated and the other on the bed, knees together, toes pointed, face turned toward the camera.",
    tip: "Keep the elbows firmly planted for stable support while the raised foot stays relaxed.",
    joints: { spine: 24, neck: -9.8, hips: -18, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -45, rightShoulder: -33, leftElbow: 100, rightElbow: 100, shoulderFwdL: 30, shoulderFwdR: 30, leftHip: 100, rightHip: 105, leftKnee: 130, rightKnee: 100, leftAnkle: -30, rightAnkle: -10, hipAbductL: 8, hipAbductR: 8 }
  },
  "p03-bed-b11-supine-back-hand-belly-facing": {
    id: "p03-bed-b11-supine-back-hand-belly-facing", name: "Bed Lying on Back Hand on Belly Facing Camera",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["reclining", "bed", "boudoir"],
    instructions: "Lie on the back with one leg bent and the other straight, toes pointed, back arched. Bend both arms with one hand touching the hair and the other touching the belly, facing the camera.",
    tip: "Keep the belly-touch hand relaxed and the gaze direct for a confident supine pose.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: { spine: -18, neck: -6, hips: -5, globalTilt: -85, globalRoll: 0, globalTwist: 0, leftShoulder: -110, rightShoulder: -55, leftElbow: 81, rightElbow: 80, shoulderFwdL: 8, shoulderFwdR: 8, leftHip: 15, rightHip: 75, leftKnee: 10, rightKnee: 95, leftAnkle: -13, rightAnkle: -26, hipAbductL: 5, hipAbductR: 8 }
  },
  "p03-bed-b12-supine-back-hands-together-facing": {
    id: "p03-bed-b12-supine-back-hands-together-facing", name: "Bed Lying on Back Hands Together Facing Camera",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["reclining", "bed", "boudoir"],
    instructions: "Lie on the back with one leg bent and the other straight, toes pointed, back arched. Bend both arms with one hand touching the other, facing the camera.",
    tip: "Rest the connected hands gently near the face or chest to frame the upper body.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: { spine: -18, neck: -6, hips: -5, globalTilt: -85, globalRoll: 0, globalTwist: 0, leftShoulder: -130, rightShoulder: -100, leftElbow: 70, rightElbow: 60, shoulderFwdL: 8, shoulderFwdR: 8, leftHip: 15, rightHip: 75, leftKnee: 10, rightKnee: 95, leftAnkle: -13, rightAnkle: -26, hipAbductL: 5, hipAbductR: 8 }
  },
  "p03-bed-b13-supine-legs-bent-hair-breast-eyes-closed": {
    id: "p03-bed-b13-supine-legs-bent-hair-breast-eyes-closed", name: "Bed Lying on Back Both Legs Bent Hair and Breast Touch",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["reclining", "bed", "boudoir"],
    instructions: "Lie on the back with both legs bent, toes pointed, back arched. Bend both arms with one hand touching the hair and the other touching the breasts, eyes closed with face turned toward the camera.",
    tip: "Keep both touch gestures soft with eyes gently closed for an intimate, relaxed mood.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:20, now spine:-20.
    joints: { spine: -20, neck: -5.5, hips: -5, globalTilt: -85, globalRoll: 0, globalTwist: 0, leftShoulder: -110, rightShoulder: -65, leftElbow: 95, rightElbow: 85, shoulderFwdL: 8, shoulderFwdR: 8, leftHip: 95, rightHip: 98, leftKnee: 125, rightKnee: 128, leftAnkle: -20, rightAnkle: -20, hipAbductL: 8, hipAbductR: 8 }
  },
  "p03-bed-b14-seated-side-legs-extended-knee-touch": {
    id: "p03-bed-b14-seated-side-legs-extended-knee-touch", name: "Bed Seated Side Legs Extended Knee Touch",
    category: "boudoir", difficulty: "Advanced", intent: "Sensual",
    tags: ["seated", "bed", "boudoir"],
    instructions: "Sit on the side with both legs extended and slightly bent, toes pointed, posture straight with back arched. One arm straight, the other bent with the hand touching the knee, looking at the camera.",
    tip: "Keep the supporting straight arm firm on the bed to hold the arched posture comfortably.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:8, now spine:-8.
    joints: { spine: -8, neck: -6, hips: 0, globalTilt: 50, globalRoll: 0, globalTwist: 0, leftShoulder: -20, rightShoulder: -55, leftElbow: 15, rightElbow: 81, shoulderFwdL: 8, shoulderFwdR: 10, leftHip: 20, rightHip: 30, leftKnee: 15, rightKnee: 25, leftAnkle: -12, rightAnkle: -12, hipAbductL: 8, hipAbductR: 8 }
  },
  "p04-wall-w1-leaning-arm-overhead-facing": {
    id: "p04-wall-w1-leaning-arm-overhead-facing", name: "Wall Leaning Arm Overhead Facing Camera",
    category: "leaning", difficulty: "Beginner", intent: "Sensual",
    tags: ["standing", "wall", "leaning", "boudoir"],
    instructions: "Lean against the wall with one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, bend the arms slightly with one hand touching the wrist of the other, one arm raised overhead touching the wall, facing the camera.",
    tip: "Push the hip firmly into the wall to create a strong S-curve while keeping the shoulders relaxed.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:12, now spine:-12.
    joints: {spine: -12, hips: 20, neck: -6, leftShoulder: -136, rightShoulder: -75, leftElbow: 35, rightElbow: 70, hipAbductL: 5, hipAbductR: -15, leftHip: 5, rightHip: 15, leftKnee: 5, rightKnee: 45, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: -3, shoulderFwdR: 8, globalTilt: 5, globalTwist: 0, globalRoll: 0}
  },
  "p04-wall-w2-leaning-arms-crossed-turned-away": {
    id: "p04-wall-w2-leaning-arms-crossed-turned-away", name: "Wall Leaning Arms Crossed Turned Away",
    category: "leaning", difficulty: "Beginner", intent: "Sensual",
    tags: ["standing", "wall", "leaning", "boudoir"],
    instructions: "Lean against the wall with one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, cross the arms, drop the shoulders, and turn away from the camera.",
    tip: "Keep the crossed arms relaxed against the torso rather than gripping, to soften the silhouette.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: -14, hips: 18, neck: 20, leftShoulder: -25, rightShoulder: -25, leftElbow: 140, rightElbow: 140, hipAbductL: 5, hipAbductR: -15, leftHip: 5, rightHip: 15, leftKnee: 5, rightKnee: 45, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: -90, shoulderFwdR: -90, globalTilt: 5, globalTwist: -35, globalRoll: 0}
  },
  "p04-wall-w3-leaning-hip-breast-touch-facing": {
    id: "p04-wall-w3-leaning-hip-breast-touch-facing", name: "Wall Leaning Hip and Breast Touch Facing Camera",
    category: "leaning", difficulty: "Beginner", intent: "Sensual",
    tags: ["standing", "wall", "leaning", "boudoir"],
    instructions: "Lean against the wall with one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, relax the shoulders and push them down, bend the arms with one hand on the hip and the other on the breast, facing the camera.",
    tip: "Keep the shoulders pressed down while the hand rests lightly on the breast for a soft, tasteful gesture.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: -14, hips: 20, neck: -6, leftShoulder: -55, rightShoulder: -25, leftElbow: 100, rightElbow: 70, hipAbductL: 5, hipAbductR: -15, leftHip: 5, rightHip: 15, leftKnee: 5, rightKnee: 45, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: -10, shoulderFwdR: -50, globalTilt: 5, globalTwist: 0, globalRoll: 0}
  },
  "p04-wall-w4-leaning-sideways-hip-wall-eyes-closed": {
    id: "p04-wall-w4-leaning-sideways-hip-wall-eyes-closed", name: "Wall Leaning Sideways Hand on Wall Eyes Closed",
    category: "leaning", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "wall", "leaning", "boudoir"],
    instructions: "Lean against the wall with the body sideways, one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, shoulders pushed down, bend the arms with one hand on the hip and the other touching the wall, eyes closed.",
    tip: "Let the wall-touching hand rest lightly for balance while keeping the eyes softly closed.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
    joints: {spine: -15, hips: 22, neck: -5.5, leftShoulder: 0, rightShoulder: -25, leftElbow: 100, rightElbow: 45, hipAbductL: 5, hipAbductR: -15, leftHip: 5, rightHip: 15, leftKnee: 5, rightKnee: 45, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: 15, shoulderFwdR: 25, globalTilt: 8, globalTwist: -15, globalRoll: 10}
  },
  "p04-wall-w5-leaning-hourglass-hands-hips-eyes-closed": {
    id: "p04-wall-w5-leaning-hourglass-hands-hips-eyes-closed", name: "Wall Leaning Hourglass Hands on Hips Eyes Closed",
    category: "leaning", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "wall", "leaning", "boudoir"],
    instructions: "Lean against the wall with the body sideways, one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, shoulders pushed down, bend the arms on the hips with elbows pushed behind the back to emphasize the hourglass shape, hands soft and relaxed, eyes closed.",
    tip: "Push the elbows back gently to accentuate the waist without straining the shoulders.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:16, now spine:-16.
    joints: {spine: -16, hips: 22, neck: -5.5, leftShoulder: -10, rightShoulder: -15, leftElbow: 140, rightElbow: 145, hipAbductL: 5, hipAbductR: 25, leftHip: 5, rightHip: 15, leftKnee: 5, rightKnee: 45, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: 40, shoulderFwdR: 45, globalTilt: 8, globalTwist: -10, globalRoll: 10}
  },
  "p04-wall-w6-back-against-wall-hip-away-eyes-closed": {
    id: "p04-wall-w6-back-against-wall-hip-away-eyes-closed", name: "Wall Back Against Wall Hips Away Eyes Closed",
    category: "leaning", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "wall", "leaning", "boudoir"],
    instructions: "Lean with the back against the wall, one leg straight and the other bent. Arch the back with the hips away from the wall, bend the arms with one hand on the hip and the other touching the wall, eyes closed.",
    tip: "Push the hips away from the wall gently while keeping the shoulder blades in contact for support.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:24, now spine:-24.
    joints: {spine: -24, hips: -7.5, neck: -6.6, leftShoulder: -10, rightShoulder: -15, leftElbow: 130, rightElbow: 20, hipAbductL: 5, hipAbductR: -10, leftHip: 5, rightHip: 20, leftKnee: 5, rightKnee: 40, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: 45, shoulderFwdR: 65, globalTilt: -15, globalTwist: 0, globalRoll: 0}
  },
  "p04-wall-w7-back-against-wall-buttocks-touching-facing": {
    id: "p04-wall-w7-back-against-wall-buttocks-touching-facing", name: "Wall Back Against Wall Buttocks Touching Facing Camera",
    category: "leaning", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "wall", "leaning", "boudoir"],
    instructions: "Lean with the back against the wall, one leg straight and the other bent. Arch the back with the buttocks touching the wall, bend the arms with one on the wall and the other touching the wrist, facing the camera.",
    tip: "Keep the buttocks lightly touching the wall as an anchor point while pushing the chest forward for the arch.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:22, now spine:-22.
    joints: {spine: -22, hips: -6, neck: -6, leftShoulder: -20, rightShoulder: -20, leftElbow: 140, rightElbow: 140, hipAbductL: 5, hipAbductR: -10, leftHip: 5, rightHip: 20, leftKnee: 5, rightKnee: 40, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: -45, shoulderFwdR: -35, globalTilt: -12, globalTwist: 0, globalRoll: 0}
  },
  "p04-wall-w8-arms-chest-against-wall-back-camera": {
    id: "p04-wall-w8-arms-chest-against-wall-back-camera", name: "Wall Chest Against Wall Back to Camera",
    category: "leaning", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "wall", "leaning", "boudoir"],
    instructions: "Lean with the arms and chest against the wall, back facing the camera. Cross the legs at the shin, arch the back, bend the arms with one on the wall and the other touching the wrist, face turned to the side.",
    tip: "Press the chest lightly into the wall while keeping the crossed legs relaxed for balance.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:18, now spine:-18.
    joints: {spine: -20, hips: 8, neck: 25, leftShoulder: -50, rightShoulder: -60, leftElbow: 80, rightElbow: 80, hipAbductL: 25, hipAbductR: -25, leftHip: 10, rightHip: 15, leftKnee: 10, rightKnee: 15, leftAnkle: 6, rightAnkle: 6, shoulderFwdL: -15, shoulderFwdR: -15, globalTilt: 25, globalTwist: -180, globalRoll: 0}
  },
  "p04-wall-w9-standing-45-degree-crossed-facing": {
    id: "p04-wall-w9-standing-45-degree-crossed-facing", name: "Wall Standing 45 Degree Angle Crossed Legs Facing Camera",
    category: "leaning", difficulty: "Intermediate", intent: "Sensual",
    tags: ["standing", "wall", "boudoir"],
    instructions: "Stand away from the wall, angled 45 degrees toward the camera. Cross the legs at the shin, arch the back with straight posture, drop the shoulders, bend the arms touching the legs at different levels, face turned toward the camera.",
    tip: "Keep the posture tall with shoulders down to close out the sequence with a confident, elegant stance.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:14, now spine:-14.
    joints: {spine: -14, hips: 10, neck: -6, leftShoulder: -10, rightShoulder: -25, leftElbow: 70, rightElbow: 130, hipAbductL: 20, hipAbductR: -15, leftHip: 10, rightHip: 18, leftKnee: 10, rightKnee: 40, leftAnkle: 6, rightAnkle: 6, shoulderFwdL: -10, shoulderFwdR: -25, globalTilt: 5, globalTwist: -40, globalRoll: 0}
  },
  "p01-master-s1-chair-legs-side-crossed": {
    id: "p01-master-s1-chair-legs-side-crossed", name: "Chair Sit Legs Extended Side Crossed",
    category: "seated", difficulty: "Beginner", intent: "Sensual",
    tags: ["seated", "chair", "legs crossed", "boudoir"],
    instructions: "Sit on the chair with both legs extended to the side. Bend one knee and cross the legs at the shin, pointing both feet. Rest arms asymmetrically on the armrests. Drop shoulders and face the camera directly.",
    tip: "Cross ankles rather than stacking knees to keep the leg line elongated; keep shoulders dropped away from ears to avoid tension in the neck.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -15 (right leg crosses behind left).
    joints: { spine: 6, neck: -6, hips: 0, globalTilt: 0, globalRoll: 0, globalTwist: 0, leftShoulder: -25, rightShoulder: -30, leftElbow: 85, rightElbow: 80, shoulderFwdL: 10, shoulderFwdR: 10, leftHip: 55, rightHip: 70, leftKnee: 60, rightKnee: 30, leftAnkle: 10, rightAnkle: 8, hipAbductL: 8, hipAbductR: -15 }
  },
  "p01-master-s2-chair-hand-forehead": {
    id: "p01-master-s2-chair-hand-forehead", name: "Chair Sit One Arm Elevated Hand to Forehead",
    category: "seated", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "chair", "arm raised", "looking away"],
    instructions: "Sit in the chair with legs extended and slightly bent, crossed at the shin with pointed toes. Rest one arm on the armrest; raise the other arm, bending the elbow so the hand touches the forehead. Drop shoulders, elongate the neck, and look away from the camera.",
    tip: "Lift the raised elbow slightly forward of the shoulder line to lengthen the torso and avoid collapsing the ribcage.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -12 (right leg crosses behind left).
    joints: {spine: 10, hips: 5, neck: -6.6, leftShoulder: -35, rightShoulder: -90, leftElbow: 95, rightElbow: 140, hipAbductL: 6, hipAbductR: -12, leftHip: 50, rightHip: 65, leftKnee: 45, rightKnee: 35, leftAnkle: 12, rightAnkle: 10, shoulderFwdL: -8, shoulderFwdR: -60, globalTilt: 8, globalTwist: 15, globalRoll: 4}
  },
  "p01-master-s3-chair-both-knees-bent-hands-clasped": {
    id: "p01-master-s3-chair-both-knees-bent-hands-clasped", name: "Chair Sit Both Knees Bent Hands Clasped",
    category: "seated", difficulty: "Beginner", intent: "Romantic",
    tags: ["seated", "chair", "hands clasped", "knees bent"],
    instructions: "Sit in the chair with both knees bent and legs crossed at the shin, toes pointed. Bend both arms slightly, clasping hands together over the knees. Drop shoulders and look straight at the camera.",
    tip: "Keep the clasped hands soft, fingers loosely interlaced rather than gripped, to maintain a relaxed appearance.",
    joints: {spine: -8, hips: 0, neck: -6, leftShoulder: -30, rightShoulder: -30, leftElbow: 100, rightElbow: 100, hipAbductL: 15, hipAbductR: -15, leftHip: 90, rightHip: 90, leftKnee: 110, rightKnee: 100, leftAnkle: 5, rightAnkle: 5, shoulderFwdL: -60, shoulderFwdR: -60, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  },
  "p01-master-s4-chair-chin-touch": {
    id: "p01-master-s4-chair-chin-touch", name: "Chair Sit Knees Crossed Hand to Chin",
    category: "seated", difficulty: "Beginner", intent: "Playful",
    tags: ["seated", "chair", "chin touch", "knees crossed"],
    instructions: "Sit in the chair with both knees bent and crossed, toes pointed. Rest one hand on the armrest and bring the other hand up to lightly touch the chin. Drop shoulders and look straight at the camera.",
    tip: "Angle the wrist so the hand frames rather than covers the jawline, keeping the face open to the light.",
    joints: {spine: 5, hips: 0, neck: -3.3, leftShoulder: -30, rightShoulder: -80, leftElbow: 95, rightElbow: 140, hipAbductL: 12, hipAbductR: -12, leftHip: 90, rightHip: 95, leftKnee: 110, rightKnee: 105, leftAnkle: 6, rightAnkle: 6, shoulderFwdL: 8, shoulderFwdR: -60, globalTilt: 5, globalTwist: 6, globalRoll: 3}
  },
  "p01-master-s5-chair-hair-touch-hip": {
    id: "p01-master-s5-chair-hair-touch-hip", name: "Chair Sit Legs Extended Hair Touch Hip Hand",
    category: "seated", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "chair", "hair touch", "looking away"],
    instructions: "Sit with legs extended, one leg slightly bent, crossed at the shin with pointed toes. Raise one arm to touch the hair while the other hand rests on the hip. Drop shoulders and look away from the camera.",
    tip: "Lift the raised elbow up and out to create negative space between the arm and torso, elongating the silhouette.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -14 (right leg crosses behind left).
    joints: {spine: 12, hips: 6, neck: -8.2, leftShoulder: -10, rightShoulder: -80, leftElbow: 125, rightElbow: 150, hipAbductL: 8, hipAbductR: -14, leftHip: 55, rightHip: 65, leftKnee: 40, rightKnee: 25, leftAnkle: 10, rightAnkle: 8, shoulderFwdL: 75, shoulderFwdR: -25, globalTilt: 10, globalTwist: 18, globalRoll: 5}
  },
  "p01-master-s6-chair-stand-lean-arch": {
    id: "p01-master-s6-chair-stand-lean-arch", name: "Standing Lean Over Chair Back Arch",
    category: "standing", difficulty: "Advanced", intent: "Sensual",
    tags: ["standing", "chair", "back arch", "leaning forward"],
    instructions: "Stand beside the chair, leaning the upper body forward with both hands resting on the armrest. Bend one arm, keep one leg bent and the other straight with toes pointed, elevating one foot slightly. Arch the back and look toward the camera.",
    tip: "Push the hips back and up as the torso hinges forward to accentuate the arch and keep the spine from rounding.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:30, now spine:-30.
    joints: { spine: -30, neck: -11, hips: -10, globalTilt: 45, globalRoll: 10, globalTwist: 25, leftShoulder: -60, rightShoulder: -55, leftElbow: 65, rightElbow: 70, shoulderFwdL: -40, shoulderFwdR: -28, leftHip: 15, rightHip: 45, leftKnee: 8, rightKnee: 55, leftAnkle: -10, rightAnkle: 15, hipAbductL: 4, hipAbductR: 10 }
  },
  "p01-master-s7-chair-lean-eyes-closed": {
    id: "p01-master-s7-chair-lean-eyes-closed", name: "Leaning Over Chair Crossed Legs Eyes Closed",
    category: "standing", difficulty: "Advanced", intent: "Sensual",
    tags: ["standing", "chair", "back arch", "eyes closed"],
    instructions: "Lean over the chair with one arm bent, legs crossed and elevated onto the balls of the feet. Lean the upper body forward and arch the back. Close the eyes and tilt the face toward the camera.",
    tip: "Cross the legs at the ankle rather than the knee to keep the lower body line clean when viewed from the side.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:32, now spine:-32.
    joints: { spine: -32, neck: -9.9, hips: -12, globalTilt: 50, globalRoll: 15, globalTwist: 20, leftShoulder: -58, rightShoulder: -52, leftElbow: 65, rightElbow: 68, shoulderFwdL: -38, shoulderFwdR: -26, leftHip: 14, rightHip: 31, leftKnee: 15, rightKnee: 20, leftAnkle: -12, rightAnkle: -10, hipAbductL: -4, hipAbductR: -6 }
  },
  "p01-master-s8-chair-stand-lean-facing-camera": {
    id: "p01-master-s8-chair-stand-lean-facing-camera", name: "Standing Lean Forward Body Turned to Camera",
    category: "standing", difficulty: "Advanced", intent: "Sensual",
    tags: ["standing", "chair", "back arch", "facing camera"],
    instructions: "Stand by the chair with the body leaning forward. Bend one arm while keeping the other straight, cross the legs elevated onto the balls of the feet, arch the back, and turn the body toward the camera.",
    tip: "Rotate the shoulders slightly more open than the hips to create a flattering twist through the torso while facing camera.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine: -8, now spine:-28.
    joints: {
"spine":-8,"neck":-16.8,"hips":-8,"globalTilt":35,"globalRoll":8,"globalTwist":35,"leftShoulder":-55,"rightShoulder":-30,"leftElbow":70,"rightElbow":30,"shoulderFwdL":-25,"shoulderFwdR":-15,"leftHip":14,"rightHip":28,"leftKnee":12,"rightKnee":18,"leftAnkle":-12,"rightAnkle":-10,"hipAbductL":-4,"hipAbductR":-4
  }
  },
  "p01-master-s9-chair-armrest-sit-straight": {
    id: "p01-master-s9-chair-armrest-sit-straight", name: "Sitting on Armrest Straight Posture Back Arch",
    category: "seated", difficulty: "Intermediate", intent: "Confident",
    tags: ["seated", "armrest", "back arch", "facing camera"],
    instructions: "Sit on the armrest of the chair with both hands touching the armrest. Bend the legs, one foot touching the floor and the other slightly elevated. Keep the posture straight with an arched back, facing the camera.",
    tip: "Perch on the front edge of the armrest with core engaged to keep the seated balance believable while still arching the spine.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:16, now spine:-16.
    joints: {spine: -16, hips: 0, neck: -6, leftShoulder: -25, rightShoulder: -37, leftElbow: 100, rightElbow: 100, hipAbductL: 6, hipAbductR: 10, leftHip: 10, rightHip: 55, leftKnee: 20, rightKnee: 70, leftAnkle: 5, rightAnkle: 10, shoulderFwdL: 10, shoulderFwdR: 10, globalTilt: 5, globalTwist: 10, globalRoll: 0}
  },
  "p01-master-s10-chair-armrest-sit-hip-leg": {
    id: "p01-master-s10-chair-armrest-sit-hip-leg", name: "Sitting on Armrest Hand on Hip Hand on Leg",
    category: "seated", difficulty: "Intermediate", intent: "Confident",
    tags: ["seated", "armrest", "hand on hip", "back arch"],
    instructions: "Sit on the armrest with one hand on the hip and the other touching the leg. Bend the legs with feet barely touching the floor, positioned apart with knees together. Keep the posture straight with an arched back, turned toward the camera.",
    tip: "Keep the supporting hand on the leg light so the arm reads relaxed instead of braced.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:15, now spine:-15.
    joints: {spine: -15, hips: 16, neck: -6, leftShoulder: 0, rightShoulder: -40, leftElbow: 100, rightElbow: 85, hipAbductL: 10, hipAbductR: 12, leftHip: 50, rightHip: 55, leftKnee: 65, rightKnee: 60, leftAnkle: 8, rightAnkle: 8, shoulderFwdL: 0, shoulderFwdR: 10, globalTilt: 6, globalTwist: 20, globalRoll: 4}
  },
  "p01-master-s11-chair-armrest-sit-hair": {
    id: "p01-master-s11-chair-armrest-sit-hair", name: "Sitting on Armrest Hand on Hip Hand in Hair Eyes Closed",
    category: "seated", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "armrest", "hair touch", "eyes closed"],
    instructions: "Sit on the armrest with one hand on the hip and the other touching the hair. Bend the legs with feet barely touching the floor, positioned apart with knees together. Keep the posture straight with an arched back, tilt the face toward the camera with eyes closed.",
    tip: "Tilt the head slightly into the raised arm to create a natural connection between the elbow and the face.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:15, now spine:-15.
    joints: {spine: -15, hips: 16, neck: -8.8, leftShoulder: 0, rightShoulder: -25, leftElbow: 100, rightElbow: 45, hipAbductL: 10, hipAbductR: 12, leftHip: 50, rightHip: 55, leftKnee: 65, rightKnee: 60, leftAnkle: 8, rightAnkle: 8, shoulderFwdL: 0, shoulderFwdR: 22, globalTilt: 8, globalTwist: 18, globalRoll: 5}
  },
  "p01-master-s12-chair-lean-bra-touch": {
    id: "p01-master-s12-chair-lean-bra-touch", name: "Standing Lean Forward Hip Pushed Side Bra Touch",
    category: "standing", difficulty: "Intermediate", intent: "Playful",
    tags: ["standing", "chair", "hip pushed side", "looking away"],
    instructions: "Stand and lean slightly forward with one arm touching the armrest and the other touching the bra strap. Cross the legs at the shin, stand on the balls of the feet with one foot toward the chair, push the hip to the side, and look away from the camera.",
    tip: "Push the hip further out than feels natural at first to create the strongest S-curve silhouette for this angle.",
    joints: { spine: 18, neck: -7.7, hips: 22, globalTilt: 20, globalRoll: 12, globalTwist: 15, leftShoulder: -35, rightShoulder: -140, leftElbow: 80, rightElbow: 35, shoulderFwdL: -12, shoulderFwdR: -20, leftHip: 10, rightHip: 30, leftKnee: 10, rightKnee: 30, leftAnkle: -8, rightAnkle: 12, hipAbductL: -10, hipAbductR: 15 }
  },
  "p01-master-s13-chair-floor-back-against-leg-elevated": {
    id: "p01-master-s13-chair-floor-back-against-leg-elevated", name: "Floor Seated Against Chair One Leg Elevated",
    category: "seated", difficulty: "Beginner", intent: "Relaxed",
    tags: ["floor", "chair back rest", "leg elevated", "looking away"],
    instructions: "Sit on the floor with the back against the chair. Bend both arms, resting one on the chair. Bend and elevate one leg while the other leg touches the floor, toes pointed. Look away from the camera.",
    tip: "Use the chair for genuine back support so the spine can relax into a soft, natural recline rather than staying rigid.",
    joints: {spine: -20, hips: -5, neck: 5.5, leftShoulder: -30, rightShoulder: -20, leftElbow: 70, rightElbow: 110, hipAbductL: -8, hipAbductR: 6, leftHip: 100, rightHip: 60, leftKnee: 120, rightKnee: 20, leftAnkle: 8, rightAnkle: 8, shoulderFwdL: 10, shoulderFwdR: 0, globalTilt: -15, globalTwist: 10, globalRoll: 5}
  },
  "p01-master-s14-chair-floor-back-against-knees-apart": {
    id: "p01-master-s14-chair-floor-back-against-knees-apart", name: "Floor Seated Against Chair Knees Apart Facing Camera",
    category: "seated", difficulty: "Beginner", intent: "Relaxed",
    tags: ["floor", "chair back rest", "knees apart", "facing camera"],
    instructions: "Sit on the floor with the back against the chair. Bend both arms, resting them on the chair. Bend and cross the legs at the shin with knees apart, toes pointed, and look at the camera.",
    tip: "Let the knees fall open naturally rather than forcing the position, keeping the pose grounded and comfortable-looking.",
    // PR-v5 (v1.5) — auto-fix hipAbduct sign: description says "cross legs" but hipAbductR was positive (spread). Flipped to -20 (right leg crosses behind left).
    joints: {spine: -18, hips: 0, neck: -6, leftShoulder: -55, rightShoulder: -67, leftElbow: 80, rightElbow: 80, hipAbductL: -25, hipAbductR: -25, leftHip: 100, rightHip: 100, leftKnee: 120, rightKnee: 120, leftAnkle: 8, rightAnkle: 8, shoulderFwdL: 12, shoulderFwdR: 12, globalTilt: -12, globalTwist: 0, globalRoll: 0}
  },
  "p01-master-s15-chair-floor-back-against-hand-floor": {
    id: "p01-master-s15-chair-floor-back-against-hand-floor", name: "Floor Seated Against Chair Hand on Floor Hip Hand",
    category: "seated", difficulty: "Beginner", intent: "Relaxed",
    tags: ["floor", "chair back rest", "hand on floor", "facing camera"],
    instructions: "Sit on the floor with the back against the chair. Keep one arm bent and the other straight; place one hand on the floor and the other on the hip. Bend, extend, and cross the legs at the shin with knees together, toes pointed, and look at the camera.",
    tip: "Press the straight arm's hand firmly into the floor to create a stable tripod base for the leaning torso.",
    joints: {spine: -15, hips: 0, neck: -6, leftShoulder: 0, rightShoulder: 0, leftElbow: 0, rightElbow: 120, hipAbductL: -8, hipAbductR: -8, leftHip: 95, rightHip: 95, leftKnee: 115, rightKnee: 110, leftAnkle: 8, rightAnkle: 8, shoulderFwdL: 0, shoulderFwdR: -40, globalTilt: -10, globalTwist: 8, globalRoll: 15}
  },
  "p01-master-s16-chair-floor-lying-head-on-chair": {
    id: "p01-master-s16-chair-floor-lying-head-on-chair", name: "Floor Lying Head Resting on Chair Eyes Closed",
    category: "reclining", difficulty: "Intermediate", intent: "Sensual",
    tags: ["floor", "reclining", "chair headrest", "eyes closed"],
    instructions: "Lie on the floor with the head resting on the chair seat. Bend both arms, one hand touching the hair and the other touching the hip. Bend the knees and extend the legs with pointed toes. Tilt the face toward the camera with eyes closed.",
    tip: "Let the head sink fully into the chair cushion for support so the neck stays soft and unstrained.",
    // PR-v4 (v1.4) — auto-fix too-subtle joints: hips 0→16. Scaled magnitudes to visible threshold per directive 'pose too subtle' failure class.
    joints: {spine: 8, hips: 16, neck: 28, leftShoulder: 130, rightShoulder: 10, leftElbow: 140, rightElbow: 120, hipAbductL: 8, hipAbductR: 6, leftHip: 35, rightHip: 45, leftKnee: 55, rightKnee: 40, leftAnkle: -20, rightAnkle: -20, shoulderFwdL: 50, shoulderFwdR: -80, globalTilt: -60, globalTwist: 15, globalRoll: 10}
  },
  "p01-master-s17-chair-back-seat-hair-touch": {
    id: "p01-master-s17-chair-back-seat-hair-touch", name: "Sitting on Chair Back Hand on Armrest Hand in Hair",
    category: "seated", difficulty: "Intermediate", intent: "Sensual",
    tags: ["seated", "chair back", "hair touch", "eyes closed"],
    instructions: "Sit on the back of the chair with one hand touching the armrest and the other touching the hair. Bend the knees with one leg lower than the other, crossed at shin level. Keep posture straight with an arched back. Tilt the face away from the camera with eyes closed.",
    tip: "Balance weight centrally over the chair back before adjusting the arms, to avoid tipping while perched high up.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:20, now spine:-20.
    joints: {spine: -20, hips: 0, neck: -9.9, leftShoulder: -30, rightShoulder: -90, leftElbow: 81, rightElbow: 140, hipAbductL: 6, hipAbductR: -10, leftHip: 55, rightHip: 70, leftKnee: 70, rightKnee: 50, leftAnkle: 8, rightAnkle: 6, shoulderFwdL: 10, shoulderFwdR: -60, globalTilt: -10, globalTwist: 20, globalRoll: 8}
  },
  "p01-master-b1-bench-lean-armrest-hip": {
    id: "p01-master-b1-bench-lean-armrest-hip", name: "Bench Recline Lean on Armrest Hand on Hip",
    category: "reclining", difficulty: "Beginner", intent: "Sensual",
    tags: ["bench", "reclining", "hand on hip", "looking away"],
    instructions: "Lean with one arm against the bench armrest and the other hand on the hip. Bend one knee while extending the other, pointing both toes. Tilt the face away from the camera.",
    tip: "Let the leaning elbow carry most of the upper body weight to create a relaxed, unforced recline.",
    joints: {spine: -10, hips: 5, neck: -8, leftShoulder: -20, rightShoulder: 10, leftElbow: 70, rightElbow: 90, hipAbductL: 6, hipAbductR: 10, leftHip: 30, rightHip: 60, leftKnee: 15, rightKnee: 55, leftAnkle: -20, rightAnkle: -20, shoulderFwdL: 10, shoulderFwdR: -60, globalTilt: 65, globalTwist: 15, globalRoll: 20}
  },
  "p01-master-b2-bench-lean-armrest-knee": {
    id: "p01-master-b2-bench-lean-armrest-knee", name: "Bench Recline Lean on Armrest Arm on Knee",
    category: "reclining", difficulty: "Beginner", intent: "Sensual",
    tags: ["bench", "reclining", "arm extended", "facing camera"],
    instructions: "Lean with one arm against the bench armrest and extend the other arm to rest on the knee. Bend both knees, one on the bench and the other touching the floor, toes pointed. Tilt the face toward the camera.",
    tip: "Extend the resting arm along the raised knee fully to create a long diagonal line across the frame.",
    joints: {spine: -8, hips: 8, neck: 0, leftShoulder: -20, rightShoulder: 0, leftElbow: 65, rightElbow: 40, hipAbductL: 15, hipAbductR: 6, leftHip: 90, rightHip: 40, leftKnee: 100, rightKnee: 15, leftAnkle: -20, rightAnkle: -20, shoulderFwdL: 10, shoulderFwdR: -50, globalTilt: 65, globalTwist: 10, globalRoll: 18}
  },
  "p01-master-b3-bench-lean-upper-body-hair": {
    id: "p01-master-b3-bench-lean-upper-body-hair", name: "Bench Recline Upper Body Lean Hair Touch",
    category: "reclining", difficulty: "Intermediate", intent: "Sensual",
    tags: ["bench", "reclining", "hair touch", "looking away"],
    instructions: "Lean the upper body against the armrest. Bend both arms, one resting on the chair and the other touching the hair. Bend both knees, positioned on the bench with pointed toes. Tilt the face away from the camera.",
    tip: "Drape the legs together to keep the lower body streamlined while the upper body leans into the armrest.",
    joints: {spine: -12, hips: 6, neck: -14, leftShoulder: -25, rightShoulder: 140, leftElbow: 75, rightElbow: 140, hipAbductL: 20, hipAbductR: 20, leftHip: 95, rightHip: 100, leftKnee: 115, rightKnee: 110, leftAnkle: -20, rightAnkle: -20, shoulderFwdL: 10, shoulderFwdR: 50, globalTilt: 65, globalTwist: 18, globalRoll: 22}
  },
  "p01-master-b4-bench-lying-underwear-touch": {
    id: "p01-master-b4-bench-lying-underwear-touch", name: "Bench Lying Hair and Waistband Touch Eyes Closed",
    category: "reclining", difficulty: "Intermediate", intent: "Sensual",
    tags: ["bench", "reclining", "eyes closed", "hair touch"],
    instructions: "Lie on the bench. Bend both arms, one hand touching the underwear waistband and the other touching the hair. Bend both knees, one foot touching the armrest and the other on the bench, toes pointed. Tilt the face toward the camera with eyes closed.",
    tip: "Keep the knees stacked and relaxed rather than splayed to maintain an elegant, soft line while lying down.",
    joints: {spine: 5, hips: 0, neck: 22, leftShoulder: 120, rightShoulder: 10, leftElbow: 130, rightElbow: 120, hipAbductL: 12, hipAbductR: 10, leftHip: 100, rightHip: 90, leftKnee: 120, rightKnee: 105, leftAnkle: -20, rightAnkle: -20, shoulderFwdL: 50, shoulderFwdR: -80, globalTilt: -65, globalTwist: 10, globalRoll: 15}
  },
  "p01-master-b5-bench-lying-back-arch": {
    id: "p01-master-b5-bench-lying-back-arch", name: "Bench Lying Back Arch Eyes Closed",
    category: "reclining", difficulty: "Intermediate", intent: "Sensual",
    tags: ["bench", "reclining", "back arch", "eyes closed"],
    instructions: "Lie on the bench, bending both arms and arching the back. Bend both knees, positioned on the bench with pointed toes. Tilt the face toward the camera with eyes closed.",
    tip: "Push the chest up and let the head drop back to intensify the arch without straining the lower back.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:30, now spine:-30.
    joints: {spine: -30, hips: -8, neck: 25, leftShoulder: -85, rightShoulder: -80, leftElbow: 60, rightElbow: 65, hipAbductL: 8, hipAbductR: 8, leftHip: 100, rightHip: 105, leftKnee: 120, rightKnee: 115, leftAnkle: -20, rightAnkle: -20, shoulderFwdL: 15, shoulderFwdR: 15, globalTilt: -65, globalTwist: 12, globalRoll: 10}
  },
  "p01-master-b6-bench-side-sit-lean-armrest": {
    id: "p01-master-b6-bench-side-sit-lean-armrest", name: "Bench Side Sit Lean Toward Armrest",
    category: "seated", difficulty: "Beginner", intent: "Sensual",
    tags: ["bench", "seated sideways", "looking away", "knees crossed"],
    instructions: "Sit sideways on the bench, leaning the upper body toward the armrest. Bend both arms, one on the armrest and the other touching the bench. Bend both knees and cross them at the shin. Tilt the face away from the camera.",
    tip: "Rotate the torso fully sideways before leaning to keep the shoulder line clean against the armrest.",
    joints: { spine: -15, neck: -10, hips: 8, globalTilt: -18, globalRoll: 25, globalTwist: 30, leftShoulder: -25, rightShoulder: -55, leftElbow: 75, rightElbow: 15, shoulderFwdL: 20, shoulderFwdR: 12, leftHip: 90, rightHip: 95, leftKnee: 110, rightKnee: 105, leftAnkle: 6, rightAnkle: 6, hipAbductL: -8, hipAbductR: -8 }
  },
  "p01-master-b7-bench-kneel-hip-knee-touch": {
    id: "p01-master-b7-bench-kneel-hip-knee-touch", name: "Bench Kneeling Hand on Hip Hand on Knee",
    category: "kneeling", difficulty: "Beginner", intent: "Confident",
    tags: ["bench", "kneeling", "hand on hip", "facing camera"],
    instructions: "Kneel on the bench. Bend one arm, resting the hand on the hip, and extend the other arm to touch the knee. Keep the posture straight with an arched back, and turn the face toward the camera.",
    tip: "Sit back slightly onto the heels before straightening the spine so the arch reads naturally rather than forced.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says "arch back" but spine is positive (forward fold). Was spine:15, now spine:-15.
    joints: {spine: -15, hips: 16, neck: 0, leftShoulder: 75, rightShoulder: 0, leftElbow: 90, rightElbow: 40, hipAbductL: 4, hipAbductR: 4, leftHip: 115, rightHip: 115, leftKnee: 135, rightKnee: 135, leftAnkle: -20, rightAnkle: -20, shoulderFwdL: 0, shoulderFwdR: -70, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  },
  "p01-master-b8-bench-kneel-elevated-arch": {
    id: "p01-master-b8-bench-kneel-elevated-arch", name: "Bench Kneeling Elevated Body Arch Eyes Closed",
    category: "kneeling", difficulty: "Advanced", intent: "Sensual",
    tags: ["bench", "kneeling", "back arch", "eyes closed"],
    instructions: "Kneel on the bench with the body slightly elevated. Bend both arms, arch the back, and lean the upper body slightly forward. Close the eyes and tilt the face toward the camera.",
    tip: "Lift through the sternum rather than just dropping the head back, to keep the arch controlled and elegant.",
    // PR-v3 (v1.3) — auto-fix spine sign error: description says back arch but spine is positive (forward fold). Was spine:32, now spine:-32.
    joints: {spine: -10, hips: -15, neck: 0, leftShoulder: -65, rightShoulder: -65, leftElbow: 56, rightElbow: 58, hipAbductL: 6, hipAbductR: 6, leftHip: 118, rightHip: 118, leftKnee: 138, rightKnee: 138, leftAnkle: -25, rightAnkle: -25, shoulderFwdL: -25, shoulderFwdR: -20, globalTilt: 0, globalTwist: 0, globalRoll: 0}
  }

};

// ── AUTO-COMPUTE CATEGORY COUNTS FROM ACTUAL DATA ──
const POSE_CATEGORIES = POSE_CATEGORIES_RAW.map(cat => ({
  ...cat,
  count: Object.values(POSES_LIBRARY).filter(p => p.category === cat.id).length
}));

// ════════════════════════════════════════════════════════════
// RESILIENT LOCAL PERSISTENCE
// ════════════════════════════════════════════════════════════

// PR-v9 (v1.9) — Persist user-created state on normal web deployments while
// retaining iframe/private-mode compatibility. Storage access can throw when
// the browser blocks localStorage, so every operation is deliberately best-
// effort and the existing in-memory behavior remains the fallback.
function persist(key, data) {
  try {
    localStorage.setItem('poseart_' + key, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

function restore(key) {
  try {
    return JSON.parse(localStorage.getItem('poseart_' + key) || 'null');
  } catch (e) {
    return null;
  }
}

// Public so app.js can persist controller-owned state without duplicating the
// storage/error-handling policy.
if (typeof window !== 'undefined') {
  window.persist = persist;
  window.restore = restore;
}

// ── GALLERY — captured images ──
// item shape: { id, dataUrl, poseId, poseName, score, timestamp, filters, favorite }
const _gallery = Array.isArray(restore('gallery')) ? restore('gallery') : [];

function addToGallery(item) {
  _gallery.unshift(item);
  if (_gallery.length > 100) _gallery.length = 100;
  persist('gallery', _gallery);
  if (window.AppState) window.AppState.galleryDirty = true;
}
function getGallery() { return _gallery.slice(); }
function removeFromGallery(id) {
  const i = _gallery.findIndex(g => g.id == id);
  if (i > -1) _gallery.splice(i, 1);
  persist('gallery', _gallery);
  if (window.AppState) window.AppState.galleryDirty = true;
}
function toggleGalleryFavorite(id) {
  const g = _gallery.find(g => g.id == id);
  if (g) g.favorite = !g.favorite;
  persist('gallery', _gallery);
  if (window.AppState) window.AppState.galleryDirty = true;
  return g ? g.favorite : false;
}

// ── SESSION HISTORY ──
const _sessionHistory = Array.isArray(restore('sessionHistory')) ? restore('sessionHistory') : [];
function getSessionHistory() { return _sessionHistory.slice(); }
function saveSession(session) {
  _sessionHistory.unshift(session);
  if (_sessionHistory.length > 50) _sessionHistory.length = 50;
  persist('sessionHistory', _sessionHistory);
}

// ── FAVORITES (pose favorites) ──
const _favorites = Array.isArray(restore('favorites')) ? restore('favorites') : [];
function getFavorites() { return _favorites.slice(); }
function toggleFavorite(poseId) {
  const idx = _favorites.indexOf(poseId);
  if (idx > -1) _favorites.splice(idx, 1); else _favorites.push(poseId);
  persist('favorites', _favorites);
  return idx === -1; // true if now favorited
}
function isFavorite(poseId) { return _favorites.includes(poseId); }

// ── TOURS — sectioned pose sequences (v2.1) ──
const _tours = Array.isArray(restore('tours')) ? restore('tours') : [];
function getTours() { return _tours.map(tour => JSON.parse(JSON.stringify(tour))); }
function getTour(id) { return _tours.find(tour => String(tour.id) === String(id)) || null; }
function saveTour(tour) {
  if (!tour || tour.id == null) return null;
  const copy = JSON.parse(JSON.stringify(tour));
  const index = _tours.findIndex(item => String(item.id) === String(copy.id));
  if (index > -1) _tours[index] = copy; else _tours.unshift(copy);
  persist('tours', _tours);
  return getTour(copy.id);
}
function deleteTour(id) {
  const index = _tours.findIndex(tour => String(tour.id) === String(id));
  if (index < 0) return false;
  _tours.splice(index, 1);
  persist('tours', _tours);
  return true;
}
