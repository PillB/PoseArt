// ============================================================
// PoseArt v2 — Pose Library Data
// 300+ poses across 10 categories. Auto-computed category counts.
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

// ── POSE LIBRARY (300+ poses) ──
const POSES_LIBRARY = {
  // ══════════════ STANDING (30) ══════════════
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
  'tiptoe-reach': {
    id: 'tiptoe-reach', category: 'standing', name: 'Tiptoe Reach',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Active',
    instructions: 'Rise onto the balls of both feet and stretch one arm straight overhead as if reaching for something just out of grasp. Keep the standing leg engaged and let the ribcage lift with the reach.',
    tip: 'Point the toes of a slightly lifted back foot for extra lengthening through the whole silhouette.',
    joints: { leftShoulder: -160, spine: -8, neck: -10 },
    color: 'var(--color-teal-100)', figure: 'arm-reach',
    tags: ['artistic', 'intermediate', 'standing', 'elongated']
  },
  'one-leg-balance': {
    id: 'one-leg-balance', category: 'standing', name: 'One-Leg Balance',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Artistic', effort: 'Active',
    instructions: 'Balance fully on one leg while drawing the opposite foot up to rest against the standing calf or knee. Bring the hands together at the chest or extend them outward for counterbalance.',
    tip: 'Fix your gaze on a single unmoving point in the distance — it\'s the secret to holding balance poses steady.',
    joints: { leftKnee: 110, rightKnee: -5, leftHip: 40, spine: 3 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['balance', 'advanced', 'standing', 'artistic']
  },
  'side-stretch': {
    id: 'side-stretch', category: 'standing', name: 'Side Stretch',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Stand tall and reach one arm overhead, bending your torso directly sideways at the waist. Let the opposite hand slide down the outer thigh as the ribs stretch open.',
    tip: 'Keep both feet planted flat and hips squared forward — the bend should isolate the waist, not the hips.',
    joints: { leftShoulder: -150, spine: 22, rightHip: -4 },
    color: 'var(--color-teal-100)', figure: 'arm-reach',
    tags: ['stretch', 'intermediate', 'standing', 'artistic']
  },
  'back-arch': {
    id: 'back-arch', category: 'standing', name: 'Back Arch',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Stand with feet hip-width apart, then arch the spine backward while letting the head tilt back and arms drift out to the sides for balance. Keep the hips pressed slightly forward to support the curve.',
    tip: 'Engage the glutes and core before arching — this protects the lower back and keeps the line controlled, not collapsed.',
    joints: { spine: -28, neck: 18, leftShoulder: -30, rightShoulder: -30 },
    color: 'var(--color-teal-200)', figure: 'scurve',
    tags: ['artistic', 'advanced', 'standing', 'expressive']
  },
  'prayer-hands': {
    id: 'prayer-hands', category: 'standing', name: 'Prayer Hands',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Stand centered and bring both palms together at chest height as if in prayer. Drop the shoulders, close the eyes softly or gaze down, and let the pose read as calm and grounded.',
    tip: 'Keep the elbows relaxed and slightly away from the ribs — pinned elbows make the pose look stiff instead of serene.',
    joints: { leftElbow: 110, rightElbow: 110, neck: -8 },
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['calm', 'beginner', 'standing', 'artistic']
  },
  'chest-open': {
    id: 'chest-open', category: 'standing', name: 'Chest Open',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand tall and draw both shoulder blades together behind you, opening the chest wide. Let the arms hang slightly turned out at your sides with palms facing forward.',
    tip: 'Imagine squeezing a pencil between your shoulder blades — it opens the chest without forcing the shoulders up.',
    joints: { leftShoulder: 10, rightShoulder: 10, spine: -6 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['confident', 'beginner', 'standing', 'front']
  },
  'hands-clasped-front': {
    id: 'hands-clasped-front', category: 'standing', name: 'Hands Clasped Front',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand with feet slightly staggered and clasp both hands loosely in front of your waist. Shift weight onto your back foot and turn the torso a quarter turn from the camera.',
    tip: 'Let the clasped hands rest low near the hips, not high on the stomach, to keep the line of the torso long.',
    joints: { leftElbow: 60, rightElbow: 60, leftHip: 6, spine: 3 },
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['polished', 'beginner', 'standing']
  },
  'neck-roll': {
    id: 'neck-roll', category: 'standing', name: 'Neck Roll',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Stand relaxed with arms at your sides and slowly tilt the head to one shoulder, exposing the long line of the neck. Let the eyes close gently for a soft, introspective mood.',
    tip: 'Drop the shoulder on the side you\'re tilting away from — this exaggerates the neck line beautifully.',
    joints: { neck: 26, leftShoulder: -8 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['soft', 'beginner', 'standing', 'artistic']
  },
  'profile-stand': {
    id: 'profile-stand', category: 'standing', name: 'Profile Stand',
    difficulty: 'Beginner', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn completely to the side so your body forms a clean profile line to the camera. Lift the chin slightly and keep the near arm relaxed at your side.',
    tip: 'A strong profile depends on posture — lengthen the spine and pull the chin back and up, not just up.',
    joints: { neck: 8, spine: 2 },
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['editorial', 'beginner', 'standing', 'profile']
  },
  'runway-stop': {
    id: 'runway-stop', category: 'standing', name: 'Runway Stop',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Plant your feet in a narrow stance, one foot slightly ahead, and stop sharply as if at the end of a runway. Square the shoulders to camera and hold a strong, still gaze.',
    tip: 'The stop should feel like the end of a stride, not a static stance — freeze right after the front foot lands.',
    joints: { leftHip: -8, rightHip: 8, spine: 0, neck: 0 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['editorial', 'intermediate', 'standing', 'fashion']
  },
  'half-turn': {
    id: 'half-turn', category: 'standing', name: 'Half Turn',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Face away from the camera, then rotate the upper torso and head halfway back over one shoulder. Keep the hips angled away for maximum torque through the spine.',
    tip: 'The twist should originate in the ribcage, not just the neck, or the shot will look like a strained glance.',
    joints: { spine: 24, neck: 30 },
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['editorial', 'intermediate', 'standing', 'back']
  },
  'chin-up-stand': {
    id: 'chin-up-stand', category: 'standing', name: 'Chin Up Stand',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand tall with feet hip-width apart and lift the chin slightly higher than feels natural, elongating the front of the neck. Keep the shoulders relaxed and down to avoid tension.',
    tip: 'Lifting the chin too far tips the head back — aim for just a few degrees to keep the jawline clean without exposing nostrils.',
    joints: { neck: -22, spine: -2 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['portrait', 'beginner', 'standing', 'confident']
  },
  'weight-forward': {
    id: 'weight-forward', category: 'standing', name: 'Weight Forward',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand with one foot forward and shift your body weight onto it, letting the back heel lift slightly off the ground. Lean the torso a touch toward the camera for engagement.',
    tip: 'Leaning weight forward reads as approachable and eager — great for warm, conversational portraits.',
    joints: { leftKnee: -10, spine: -6, neck: -4 },
    color: 'var(--color-teal-100)', figure: 'hip-shift',
    tags: ['approachable', 'beginner', 'standing']
  },
  'shoulder-roll-back': {
    id: 'shoulder-roll-back', category: 'standing', name: 'Shoulder Roll Back',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand naturally, then roll both shoulders up, back, and down in one motion, settling into an open, relaxed stance. Hold the position right after the roll completes.',
    tip: 'This roll is the fastest fix for hunched, camera-shy shoulders — do it right before every shot.',
    joints: { leftShoulder: -10, rightShoulder: -10, spine: -4 },
    color: 'var(--color-teal-200)', figure: 'standing-front',
    tags: ['relaxed', 'beginner', 'standing']
  },
  'head-tilt-stand': {
    id: 'head-tilt-stand', category: 'standing', name: 'Head Tilt Stand',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand centered and tilt your head gently toward one shoulder while keeping the body square to the camera. Add a soft, warm smile to complete a friendly, approachable look.',
    tip: 'A slight tilt reads as warm; too much reads as quizzical — keep it under 15 degrees.',
    joints: { neck: 16 },
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['friendly', 'beginner', 'standing', 'social']
  },
  'hand-behind-head': {
    id: 'hand-behind-head', category: 'standing', name: 'Hand Behind Head',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Raise one arm and rest the hand lightly at the back of your head or neck, elbow pointing outward. Let the opposite hip shift out for a relaxed, confident asymmetry.',
    tip: 'Keep the resting hand loose against the hair, not gripping — a light touch looks effortless.',
    joints: { leftShoulder: -100, leftElbow: 60, leftHip: 10 },
    color: 'var(--color-teal-200)', figure: 'hip-shift',
    tags: ['editorial', 'intermediate', 'standing', 'casual']
  },
  'two-hands-pockets': {
    id: 'two-hands-pockets', category: 'standing', name: 'Two Hands Pockets',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Slide both hands into your front pockets, letting the shoulders relax and drop naturally. Keep a slight bend in the knees to avoid a stiff, locked stance.',
    tip: 'Pushing the elbows slightly back and out creates negative space that slims the torso in frame.',
    joints: { leftShoulder: -8, rightShoulder: -8, leftElbow: 35, rightElbow: 35 },
    color: 'var(--color-teal-100)', figure: 'standing-front',
    tags: ['casual', 'beginner', 'standing', 'social']
  },
  'lean-no-support': {
    id: 'lean-no-support', category: 'standing', name: 'Standing Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Without any wall or prop, lean your entire torso off-axis to one side while your feet stay planted, creating the illusion of leaning against something invisible. Hold the tension through the core.',
    tip: 'This only works with real core engagement — a half-hearted lean just looks like poor balance.',
    joints: { spine: 20, leftHip: -10, neck: -6 },
    color: 'var(--color-teal-200)', figure: 'hip-shift',
    tags: ['artistic', 'intermediate', 'standing', 'creative']
  },
  'victory-arms': {
    id: 'victory-arms', category: 'standing', name: 'Victory Arms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Plant your feet firmly and throw both arms up into a wide V above your head in a moment of celebration. Let the chest lift and the face open into genuine joy.',
    tip: 'Jump slightly into the position rather than posing it statically — it produces a far more authentic burst of energy.',
    joints: { leftShoulder: -155, rightShoulder: -155, spine: -8, neck: 6 },
    color: 'var(--color-teal-100)', figure: 'arm-reach',
    tags: ['joyful', 'beginner', 'standing', 'celebratory']
  },
  'diagonal-step': {
    id: 'diagonal-step', category: 'standing', name: 'Diagonal Step',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Step one foot out at a diagonal angle away from the body, keeping the torso facing the camera. Let the hips follow the step slightly to create a long diagonal line through the legs.',
    tip: 'The wider the diagonal step, the more dramatic the base — but keep enough weight centered to look stable, not off-balance.',
    joints: { leftHip: 20, rightHip: -6, spine: 4 },
    color: 'var(--color-teal-200)', figure: 'hip-shift',
    tags: ['editorial', 'intermediate', 'standing', 'fashion']
  },

  // ══════════════ SEATED (30) ══════════════
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
  'side-saddle': {
    id: 'side-saddle', category: 'seated', name: 'Side Saddle',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on a chair or step with both legs swept to one side, ankles crossed neatly. Turn your upper body slightly toward the camera while the legs stay angled away.',
    tip: 'Stacking the knees precisely, one directly above the other, keeps the leg line clean from any angle.',
    joints: { spine: 6, leftKnee: 100, rightKnee: 105, neck: -6 },
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['elegant', 'beginner', 'seated', 'classic']
  },
  'ottoman-recline': {
    id: 'ottoman-recline', category: 'seated', name: 'Ottoman Recline',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on a low ottoman or bench and lean back on one supporting arm, extending both legs loosely forward. Let the free hand rest on your thigh for a relaxed, off-duty mood.',
    tip: 'Keep the supporting elbow soft, not locked, so the shoulder doesn\'t hike up toward the ear.',
    joints: { spine: 14, leftElbow: 15, leftKnee: 160, rightKnee: 160 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['relaxed', 'beginner', 'seated', 'casual']
  },
  'floor-side-extend': {
    id: 'floor-side-extend', category: 'seated', name: 'Floor Side Extend',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor and extend one leg straight out to the side while the other bends in toward the body. Reach the same-side arm along the extended leg for a long, elegant stretch.',
    tip: 'Flex the extended foot rather than pointing it — it reads as more intentional and controlled in stills.',
    joints: { spine: 12, leftKnee: 0, rightKnee: 100, leftShoulder: 20 },
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['artistic', 'intermediate', 'seated', 'floor']
  },
  'knees-apart-forward': {
    id: 'knees-apart-forward', category: 'seated', name: 'Knees Apart Forward',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit on the edge of a chair or box with knees apart and forearms resting on your thighs. Lean slightly forward with a direct, confident gaze into the lens.',
    tip: 'Keep the spine straight even as you lean in — round shoulders undercut the confident intent of this pose.',
    joints: { spine: -12, leftKnee: 80, rightKnee: 80, leftElbow: 90, rightElbow: 90 },
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['confident', 'beginner', 'seated', 'editorial']
  },
  'meditation-palms': {
    id: 'meditation-palms', category: 'seated', name: 'Meditation Palms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit cross-legged on the floor with the backs of your hands resting on your knees, palms open and upward. Close your eyes softly and lift through the crown of the head.',
    tip: 'Roll the shoulders down and back before settling — tension in the shoulders breaks the calm illusion instantly.',
    joints: { spine: 0, leftKnee: 120, rightKnee: 120, neck: -2 },
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['calm', 'beginner', 'seated', 'meditative']
  },
  'floor-hug-knees': {
    id: 'floor-hug-knees', category: 'seated', name: 'Floor Hug Knees',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the floor, draw both knees fully into your chest, and wrap both arms around your shins. Rest your cheek against a knee and let your gaze soften toward or away from camera.',
    tip: 'Untuck one foot slightly so it peeks out — it keeps the silhouette from becoming a single tight ball shape.',
    joints: { spine: -22, leftKnee: 30, rightKnee: 30, neck: -16 },
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['cozy', 'beginner', 'seated', 'intimate']
  },
  'one-leg-extend-floor': {
    id: 'one-leg-extend-floor', category: 'seated', name: 'One Leg Extend Floor',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on the floor with one leg extended straight ahead and the other bent, foot flat near the opposite knee. Rest one hand on the floor behind you for support and lift the chest.',
    tip: 'Angling the extended leg slightly away from square-to-camera makes it look longer and leaner.',
    joints: { spine: 8, leftKnee: 0, rightKnee: 90, leftElbow: 10 },
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['portrait', 'intermediate', 'seated', 'floor']
  },
  'chair-back-lean': {
    id: 'chair-back-lean', category: 'seated', name: 'Chair Back Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit fully back into a chair, letting the backrest support your spine, and rest both hands loosely on the armrests or thighs. Relax the shoulders and hold a calm, open expression.',
    tip: 'Uncross the ankles and place both feet flat — it grounds the pose and avoids a slouched look.',
    joints: { spine: 8, leftElbow: 95, rightElbow: 95, neck: -2 },
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['relaxed', 'beginner', 'seated', 'chair']
  },
  'swivel-twist': {
    id: 'swivel-twist', category: 'seated', name: 'Swivel Twist',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit on a chair with legs facing one direction while twisting the upper torso toward the camera. Rest one arm on the chair back to support and emphasize the twist.',
    tip: 'Initiate the twist from the waist, keeping the hips anchored — this creates the most flattering spinal torque.',
    joints: { spine: 20, leftElbow: 70, neck: -8 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'chair']
  },
  'perch-edge': {
    id: 'perch-edge', category: 'seated', name: 'Perch on Edge',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Perch lightly on the very edge of a stool or ledge with both feet planted and knees together. Keep the spine tall and hands resting gently on the seat edge beside you.',
    tip: 'Distribute a little weight into your feet, not just the seat — it keeps the pose looking poised instead of precarious.',
    joints: { spine: -4, leftKnee: 95, rightKnee: 95 },
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['poised', 'beginner', 'seated']
  },
  'stool-lean-back': {
    id: 'stool-lean-back', category: 'seated', name: 'Stool Lean Back',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit on a stool and lean the torso back, supporting your weight on both hands placed behind you on the seat. Extend the legs loosely forward and tilt the chin up slightly.',
    tip: 'Keep the shoulders down away from the ears even while bearing weight on the arms — a common tension point.',
    joints: { spine: 16, leftElbow: 5, rightElbow: 5, neck: 6 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'relaxed']
  },
  'floor-stretch-legs': {
    id: 'floor-stretch-legs', category: 'seated', name: 'Floor Stretch Legs',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor with both legs extended straight out in front of you, back tall. Reach both hands forward toward the toes or rest them lightly on the shins.',
    tip: 'A soft bend in the knees looks more natural on camera than a forced, locked-straight stretch.',
    joints: { spine: -8, leftKnee: 5, rightKnee: 5, leftShoulder: 10 },
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['artistic', 'beginner', 'seated', 'floor']
  },
  'seated-hug-pillow': {
    id: 'seated-hug-pillow', category: 'seated', name: 'Seated Hug Pillow',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on a bed or couch and hug a pillow or cushion loosely to your chest. Rest your chin on top of it and let your knees draw up slightly for a soft, cozy mood.',
    tip: 'A real prop like a pillow gives your hands purpose — it removes the awkward \'what do I do with my hands\' problem.',
    joints: { spine: -10, leftElbow: 110, rightElbow: 110, neck: -10 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['cozy', 'beginner', 'seated', 'social']
  },
  'chair-twist-both': {
    id: 'chair-twist-both', category: 'seated', name: 'Chair Twist Both Arms',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit backward on a chair facing away from camera, then twist the torso and drape both arms over the top of the backrest. Look back over one shoulder toward the lens.',
    tip: 'Resting the chin near the top hand adds a natural focal point for the twisted gaze.',
    joints: { spine: 22, leftElbow: 75, rightElbow: 75, neck: 26 },
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'back']
  },
  'lounger-recline': {
    id: 'lounger-recline', category: 'seated', name: 'Lounger Recline',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Settle into a reclined lounger or sofa with legs extended and crossed at the ankle. Let one arm rest along the back cushion and the other in your lap.',
    tip: 'A slight downward tilt of the chin softens the face when the body is reclined at this angle.',
    joints: { spine: 18, leftKnee: 165, rightKnee: 165, leftShoulder: -20 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['relaxed', 'beginner', 'seated', 'lounge']
  },
  'floor-asymmetric': {
    id: 'floor-asymmetric', category: 'seated', name: 'Floor Asymmetric',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor with one knee bent up and the other leg tucked beneath you asymmetrically. Rest one arm across the raised knee and lean the torso slightly toward it.',
    tip: 'Asymmetry between the left and right leg positions is what makes this shape visually interesting — avoid mirroring them.',
    joints: { spine: 10, leftKnee: 90, rightKnee: 140, leftElbow: 60 },
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['artistic', 'intermediate', 'seated', 'floor']
  },
  'bench-sit-side': {
    id: 'bench-sit-side', category: 'seated', name: 'Bench Sit Side',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Sit sideways on a bench with legs together and angled away from the camera. Place both hands flat on the bench beside you and lift the chest for a poised profile.',
    tip: 'A small gap of light and space between your arm and torso keeps the waist from looking compressed.',
    joints: { spine: -2, leftKnee: 95, rightKnee: 95, leftElbow: 8 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['poised', 'beginner', 'seated']
  },
  'tabletop-sit': {
    id: 'tabletop-sit', category: 'seated', name: 'Tabletop Sit',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the edge of a table or counter with legs dangling or crossed at the ankle. Lean back slightly on your hands and let your shoulders relax down.',
    tip: 'Bouncing your feet gently just before the shot keeps the pose from freezing into stiffness.',
    joints: { spine: 10, leftKnee: 160, rightKnee: 160, leftElbow: 10 },
    color: 'var(--color-teal-200)', figure: 'seated-side',
    tags: ['casual', 'intermediate', 'seated', 'social']
  },
  'feet-tucked-under': {
    id: 'feet-tucked-under', category: 'seated', name: 'Feet Tucked Under',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on a couch or chair and tuck both feet underneath you to one side. Lean into the armrest or backrest with one elbow and relax the free hand in your lap.',
    tip: 'Tucking the feet under instantly reads as cozy and candid — ideal for lifestyle-style shots.',
    joints: { spine: 12, leftKnee: 150, rightKnee: 150, leftElbow: 60 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['cozy', 'beginner', 'seated', 'lifestyle']
  },
  'kneeling-upright-twist': {
    id: 'kneeling-upright-twist', category: 'seated', name: 'Kneeling Upright Twist',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit back on your heels in a kneeling position and twist the upper torso to one side, placing one hand on the floor behind you for support. Look back over the opposite shoulder.',
    tip: 'Keep the hips squared forward while the ribcage twists — that separation is what gives the pose its editorial line.',
    joints: { spine: 20, leftKnee: 30, rightKnee: 30, neck: 22 },
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['editorial', 'intermediate', 'seated', 'kneeling']
  },
  'seated-v-stretch': {
    id: 'seated-v-stretch', category: 'seated', name: 'Seated V Stretch',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor and open both legs into a wide V shape. Reach both arms forward between the legs or rest hands on the floor, lifting the chest as you lean slightly forward.',
    tip: 'Lead the forward lean with the chest, not the head — it keeps the spine long instead of rounding forward.',
    joints: { spine: -6, leftHip: 40, rightHip: -40, leftShoulder: 20 },
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['artistic', 'intermediate', 'seated', 'floor']
  },
  'floor-prop-back': {
    id: 'floor-prop-back', category: 'seated', name: 'Floor Prop Back',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on the floor and lean back on both forearms with legs extended or gently bent. Tilt the head back slightly and let the chest open toward the sky.',
    tip: 'Keep the forearms angled slightly behind the hips, not directly under the shoulders, for a more relaxed lean-back line.',
    joints: { spine: 18, leftElbow: 15, rightElbow: 15, neck: 8 },
    color: 'var(--color-teal-200)', figure: 'seated-floor',
    tags: ['relaxed', 'beginner', 'seated', 'floor']
  },

  // ══════════════ LEANING — STANDING (30) ══════════════
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
  'column-lean': {
    id: 'column-lean', category: 'leaning', name: 'Column Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand beside a column or pillar and lean your shoulder and hip against its curved edge. Cross one ankle over the other and let the near arm rest along the column\'s surface.',
    tip: 'A curved surface asks for a curved body — mirror the column\'s line with a slight spinal arch for cohesion.',
    joints: { leftShoulder: -8, spine: 10, leftHip: 8 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'beginner', 'leaning', 'architectural']
  },
  'fence-lean': {
    id: 'fence-lean', category: 'leaning', name: 'Fence Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Rest both forearms on the top rail of a fence, leaning forward comfortably with feet planted behind you. Let one foot cross behind the other for a casual stance.',
    tip: 'Leaning your weight into the fence rather than hovering above it reads as more natural and relaxed.',
    joints: { spine: -12, leftElbow: 95, rightElbow: 95, neck: -4 },
    color: 'var(--color-cobalt-200)', figure: 'elbow-prop',
    tags: ['casual', 'beginner', 'leaning', 'outdoor']
  },
  'tree-lean': {
    id: 'tree-lean', category: 'leaning', name: 'Tree Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean your upper back and shoulder against a tree trunk, one foot planted flat and the other bent with the sole resting against the bark. Let the arms hang loose or cross gently.',
    tip: 'Push the hips slightly forward of the shoulders against the trunk — it creates a subtle, flattering lean angle.',
    joints: { leftShoulder: -6, spine: 8, leftKnee: 65 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['outdoor', 'beginner', 'leaning', 'natural']
  },
  'car-lean': {
    id: 'car-lean', category: 'leaning', name: 'Car Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean back against a car door or hood with hands resting lightly on the edge beside your hips. Cross one ankle over the other and angle the torso slightly toward the camera.',
    tip: 'Keep a slight bend in the elbows when hands rest on the surface — locked arms look tense against a hard edge.',
    joints: { spine: 6, leftElbow: 15, rightElbow: 15, leftHip: 6 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'beginner', 'leaning', 'urban']
  },
  'railing-lean': {
    id: 'railing-lean', category: 'leaning', name: 'Railing Lean',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Rest both forearms on a railing and look outward toward the horizon or view, back rounded gently forward. Let one foot cross behind the other for a relaxed weight shift.',
    tip: 'Directing the gaze off-camera toward the view sells the candid, contemplative mood of this pose.',
    joints: { spine: -14, leftElbow: 90, rightElbow: 90, neck: 4 },
    color: 'var(--color-cobalt-200)', figure: 'elbow-prop',
    tags: ['contemplative', 'beginner', 'leaning', 'outdoor']
  },
  'stair-lean': {
    id: 'stair-lean', category: 'leaning', name: 'Stair Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand a step above or below the camera on a staircase, leaning your shoulder against the wall or railing beside you. Let one hand trail along the banister.',
    tip: 'Uneven ground like stairs naturally creates asymmetry — lean into that instead of trying to look perfectly level.',
    joints: { leftShoulder: -10, spine: 6, leftKnee: -8 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'urban']
  },
  'shoulder-wall': {
    id: 'shoulder-wall', category: 'leaning', name: 'Shoulder Wall',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Turn your body sideways and press just one shoulder flat against the wall, feet staggered beneath you. Let the far arm rest on your hip or hang loose.',
    tip: 'Keep enough distance between your feet and the wall so your body leans at a real angle, not standing straight up against it.',
    joints: { leftShoulder: -4, spine: 12, leftHip: -6 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning']
  },
  'forearm-wall': {
    id: 'forearm-wall', category: 'leaning', name: 'Forearm Wall',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Plant one forearm flat against the wall at shoulder height and lean your weight into it, crossing your feet at the ankle. Let the head rest gently near the raised arm.',
    tip: 'Angle the body away from the wall at the feet, creating a diagonal line from foot to elbow.',
    joints: { leftShoulder: -70, leftElbow: 90, spine: 8, neck: 6 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'beginner', 'leaning']
  },
  'two-hands-wall': {
    id: 'two-hands-wall', category: 'leaning', name: 'Two Hands Wall',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Face the wall directly and place both palms flat against it at shoulder height, arms extended. Lean your torso in toward the wall while keeping the feet planted further back.',
    tip: 'This creates a strong diagonal line best shot from the side — a straight-on angle flattens the effect.',
    joints: { leftShoulder: -80, rightShoulder: -80, spine: 10 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['artistic', 'intermediate', 'leaning']
  },
  'back-arch-wall': {
    id: 'back-arch-wall', category: 'leaning', name: 'Back Arch Wall',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Stand with your lower back against the wall and arch your upper spine away from it, letting the head tilt back and arms drift outward. Keep the hips anchored to the wall for support.',
    tip: 'Only arch as far as feels controlled — the wall is there for safety, not to let you overextend the spine.',
    joints: { spine: -24, neck: 16, leftShoulder: -20 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['artistic', 'advanced', 'leaning', 'expressive']
  },
  'cross-legged-wall': {
    id: 'cross-legged-wall', category: 'leaning', name: 'Cross-Legged Wall',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Lean your back flat against the wall and cross your legs at the ankles, weight evenly distributed. Let the hands rest in pockets or clasped in front.',
    tip: 'A wide ankle cross with the front foot pointed outward looks more elegant than a straight, narrow cross.',
    joints: { spine: 4, leftKnee: -6, rightKnee: 4 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning', 'social']
  },
  'squat-lean': {
    id: 'squat-lean', category: 'leaning', name: 'Squat Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean your back against the wall and lower into a partial squat, thighs at an angle rather than fully seated. Rest forearms loosely on your knees.',
    tip: 'Keep the knees tracking over the toes and the back flat on the wall to protect the joints during the hold.',
    joints: { leftKnee: 90, rightKnee: 90, spine: 2, leftElbow: 80 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'athletic']
  },
  'low-wall-sit': {
    id: 'low-wall-sit', category: 'leaning', name: 'Low Wall Sit',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Perch on a low wall or ledge with feet planted on the ground, leaning your torso back slightly to rest against a higher wall behind you. Hands rest on the ledge beside your hips.',
    tip: 'Bridging between two surfaces like this creates a naturally supported, relaxed lean without looking posed.',
    joints: { spine: 12, leftElbow: 10, rightElbow: 10 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning', 'outdoor']
  },
  'chin-on-wall': {
    id: 'chin-on-wall', category: 'leaning', name: 'Chin on Wall',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Stand close to the wall and rest your chin lightly on the back of your hand, which is pressed flat against the surface. Let the body angle away in a soft diagonal.',
    tip: 'Keep the wrist relaxed under the chin — a stiff wrist reads as awkward in close-up framing.',
    joints: { leftShoulder: -60, leftElbow: 100, neck: -10, spine: 6 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['portrait', 'intermediate', 'leaning']
  },
  'pillar-wrap': {
    id: 'pillar-wrap', category: 'leaning', name: 'Pillar Wrap',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand beside a pillar or post and wrap one arm around it while leaning your body weight into the wrap. Let the opposite leg cross in front for a spiraled, editorial line.',
    tip: 'The wrapping arm should look like it\'s genuinely supporting weight — commit to leaning in, not hovering beside it.',
    joints: { leftShoulder: -50, leftElbow: 110, spine: 14, leftHip: 10 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'architectural']
  },
  'ledge-lean-elbow': {
    id: 'ledge-lean-elbow', category: 'leaning', name: 'Ledge Lean Elbow',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest a single elbow on a high ledge or counter and let your body angle away from it, weight shifted onto the opposite hip. Prop your chin lightly on the raised hand.',
    tip: 'This one-arm version feels less symmetrical and more candid than resting both elbows evenly.',
    joints: { leftElbow: 100, leftHip: 12, neck: -8, spine: 8 },
    color: 'var(--color-cobalt-200)', figure: 'elbow-prop',
    tags: ['casual', 'beginner', 'leaning']
  },
  'mirror-lean': {
    id: 'mirror-lean', category: 'leaning', name: 'Mirror Lean',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand facing a mirror and lean one hand against its surface while looking at your own reflection rather than the camera. Let the opposite hip pop out to the side.',
    tip: 'Shooting the reflection rather than you directly adds a layered, editorial storytelling element to the frame.',
    joints: { leftShoulder: -40, leftElbow: 20, leftHip: 12 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['creative', 'intermediate', 'leaning', 'reflection']
  },
  'hip-pop-wall': {
    id: 'hip-pop-wall', category: 'leaning', name: 'Hip Pop Wall',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean one shoulder against the wall and pop the opposite hip out sharply to the side, creating a strong S-curve. Rest the near hand on the popped hip.',
    tip: 'The sharper the hip pop, the more graphic the silhouette — great for bold, high-contrast lighting setups.',
    joints: { leftShoulder: -8, leftHip: 22, spine: 10 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['bold', 'beginner', 'leaning']
  },
  'diagonal-lean': {
    id: 'diagonal-lean', category: 'leaning', name: 'Diagonal Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean your entire body at a steep diagonal against a wall or surface, feet planted far away from the support point. Extend the far arm outward for balance and visual length.',
    tip: 'The further your feet are from the wall, the steeper and more dramatic the diagonal line becomes.',
    joints: { spine: 26, leftShoulder: -60, leftHip: -10 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'dramatic']
  },
  'step-lean': {
    id: 'step-lean', category: 'leaning', name: 'Step Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Stand on a raised step or curb with one foot higher than the other, leaning slightly into the height difference. Rest a hand on the nearby rail or wall for support.',
    tip: 'Using real architecture like steps for height variation makes group or solo shots feel more dynamic.',
    joints: { leftKnee: -15, spine: 6, leftElbow: 20 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning', 'urban']
  },
  'gate-lean': {
    id: 'gate-lean', category: 'leaning', name: 'Gate Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean back against a closed gate or low door with arms spread along the top edge on either side. Cross one ankle over the other and tilt the head slightly.',
    tip: 'Spreading the arms wide along the gate opens the chest and makes the whole frame feel more expansive.',
    joints: { leftShoulder: -30, rightShoulder: -30, spine: 6 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['rustic', 'beginner', 'leaning', 'outdoor']
  },
  'door-side-lean': {
    id: 'door-side-lean', category: 'leaning', name: 'Door Side Lean',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand in an open doorway and lean one shoulder against the frame, letting the opposite leg cross casually in front. Look down the hallway or out into the room beyond.',
    tip: 'Framing devices like doorways add depth — position yourself so the frame lines lead the eye to your face.',
    joints: { leftShoulder: -8, spine: 8, leftKnee: 8 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'beginner', 'leaning', 'framing']
  },
  'bench-lean-side': {
    id: 'bench-lean-side', category: 'leaning', name: 'Bench Lean Side',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Stand beside a park bench and lean your hip against its armrest, one hand resting on the backrest. Cross your feet at the ankle for a relaxed outdoor stance.',
    tip: 'Letting your fingers drape over the bench back rather than gripping it keeps the hand looking soft.',
    joints: { leftHip: 14, leftElbow: 30, spine: 6 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['casual', 'beginner', 'leaning', 'outdoor']
  },
  'glass-lean': {
    id: 'glass-lean', category: 'leaning', name: 'Glass Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean your back against a glass window or storefront, one foot planted and the other bent with the sole against the glass. Look off to the side with a cool, detached expression.',
    tip: 'Watch for reflections in the glass — a slight angle to your body avoids a distracting mirror image of yourself.',
    joints: { spine: 8, leftKnee: 60, neck: 10 },
    color: 'var(--color-cobalt-200)', figure: 'wall-lean',
    tags: ['editorial', 'intermediate', 'leaning', 'urban']
  },

  // ══════════════ LEANING — SEATED (30) ══════════════
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
  'table-elbow-single': {
    id: 'table-elbow-single', category: 'lean-seat', name: 'Table Elbow Single',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit at a table and rest one elbow flat on the surface, leaning your weight gently into it. Let the other hand rest in your lap and turn your torso slightly toward the propped arm.',
    tip: 'Keep the supporting wrist straight rather than bent, which distributes weight more comfortably for longer holds.',
    joints: { spine: -8, leftElbow: 90, neck: -6 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['relaxed', 'beginner', 'seated', 'leaning']
  },
  'chin-on-fist': {
    id: 'chin-on-fist', category: 'lean-seat', name: 'Chin on Fist',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest an elbow on the table and make a loose fist, resting your chin lightly on top of it. Let the eyes gaze thoughtfully off to the side.',
    tip: 'A loose fist under the chin reads as playful, while an open palm reads as contemplative — choose based on the mood you want.',
    joints: { spine: -10, leftElbow: 95, neck: -12 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['thoughtful', 'beginner', 'seated', 'leaning']
  },
  'forearms-crossed-table': {
    id: 'forearms-crossed-table', category: 'lean-seat', name: 'Forearms Crossed Table',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit at a table and cross both forearms flat on its surface, resting your chest gently against them. Rest the chin on the top forearm and look directly at the camera.',
    tip: 'Keep the shoulders down and wide even while leaning forward — hunching narrows the frame and looks passive.',
    joints: { spine: -16, leftElbow: 100, rightElbow: 100, neck: -8 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['editorial', 'beginner', 'seated', 'leaning']
  },
  'slump-back-chair': {
    id: 'slump-back-chair', category: 'lean-seat', name: 'Slump Back Chair',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Sit in a chair and let your body sink comfortably into a slight slouch, one arm draped over the backrest. Extend your legs loosely forward, ankles crossed.',
    tip: 'An intentional, controlled slouch looks casual; a collapsed one looks tired — keep the chest slightly lifted even as you sink back.',
    joints: { spine: 16, leftElbow: 40, leftKnee: 150, rightKnee: 150 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['casual', 'beginner', 'seated', 'leaning']
  },
  'one-elbow-knee': {
    id: 'one-elbow-knee', category: 'lean-seat', name: 'One Elbow Knee',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit forward on the chair edge and rest one elbow on the same-side knee, letting the torso follow the lean. Keep the opposite hand relaxed on the other thigh.',
    tip: 'Leaning one elbow only (instead of both) creates a more dynamic, asymmetrical silhouette than mirrored poses.',
    joints: { spine: -14, leftElbow: 85, leftKnee: 85, neck: -6 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['relaxed', 'beginner', 'seated', 'leaning']
  },
  'both-knees-forearms': {
    id: 'both-knees-forearms', category: 'lean-seat', name: 'Both Knees Forearms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit with both elbows resting on both knees, forearms hanging loosely between your legs. Lean forward from the hips and keep a direct, engaged gaze forward.',
    tip: 'This classic \'thinker\' base reads as candid and grounded — perfect for environmental portrait sessions.',
    joints: { spine: -18, leftElbow: 90, rightElbow: 90, neck: -4 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['candid', 'beginner', 'seated', 'leaning']
  },
  'table-lean-back-look': {
    id: 'table-lean-back-look', category: 'lean-seat', name: 'Table Lean Back Look',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit at a table, lean back away from it, and rest one arm along the table\'s edge behind you while looking back toward the camera over your shoulder.',
    tip: 'This creates a nice push-pull tension between the reclined body and the alert, engaged head turn.',
    joints: { spine: 14, leftElbow: 10, neck: 20 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'leaning']
  },
  'chin-on-both-hands': {
    id: 'chin-on-both-hands', category: 'lean-seat', name: 'Chin on Both Hands',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Rest both elbows on a table and stack both hands beneath your chin, fingers loosely interlaced. Lean forward gently and hold a warm, direct gaze.',
    tip: 'Interlacing the fingers rather than stacking flat palms adds subtle texture and interest to the hand position.',
    joints: { spine: -14, leftElbow: 100, rightElbow: 100, neck: -6 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['warm', 'beginner', 'seated', 'leaning']
  },
  'floor-leaning-arms-back': {
    id: 'floor-leaning-arms-back', category: 'lean-seat', name: 'Floor Leaning Arms Back',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit on the floor and lean back onto both palms placed behind your hips, arms straight but relaxed. Extend the legs out or bend one knee for variation.',
    tip: 'Push down through the palms to lift the chest — it prevents the shoulders from creeping up toward the ears.',
    joints: { spine: 18, leftElbow: 5, rightElbow: 5, neck: 6 },
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['artistic', 'beginner', 'seated', 'leaning']
  },
  'look-up-chin-raised': {
    id: 'look-up-chin-raised', category: 'lean-seat', name: 'Look Up Chin Raised',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit with one elbow propped on a raised knee, but tilt the head back and up rather than down, exposing the neck. Let the gaze drift upward past the camera.',
    tip: 'This inversion of the classic chin-rest pose creates a dreamier, more artistic mood than the usual downward gaze.',
    joints: { spine: -8, leftElbow: 85, leftKnee: 85, neck: 20 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['artistic', 'intermediate', 'seated', 'leaning']
  },
  'seated-head-tilt-prop': {
    id: 'seated-head-tilt-prop', category: 'lean-seat', name: 'Seated Head Tilt Prop',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit and rest your temple lightly against your fingertips, elbow propped on a table or knee. Tilt the head into the hand rather than resting the chin.',
    tip: 'Resting at the temple instead of the chin creates a softer, more pensive expression than the classic chin-rest.',
    joints: { spine: -6, leftElbow: 95, neck: 22 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['pensive', 'beginner', 'seated', 'leaning']
  },
  'arm-drape-knee': {
    id: 'arm-drape-knee', category: 'lean-seat', name: 'Arm Drape Knee',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit with one knee raised and drape the same-side arm loosely over it, wrist relaxed. Lean back slightly on the other hand for support.',
    tip: 'Let the draped hand hang naturally past the knee rather than gripping it — tension in the fingers reads immediately.',
    joints: { spine: 6, leftKnee: 85, leftElbow: 100, rightElbow: 15 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['casual', 'beginner', 'seated', 'leaning']
  },
  'elbow-on-thigh-look-away': {
    id: 'elbow-on-thigh-look-away', category: 'lean-seat', name: 'Elbow On Thigh Look Away',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Prop one elbow on your thigh and let your chin rest near your knuckles, but turn your gaze away from camera toward the horizon. A moody, contemplative editorial look.',
    tip: 'Looking away rather than at the lens shifts the mood from friendly to introspective — choose deliberately.',
    joints: { spine: -12, leftElbow: 90, neck: 14 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['moody', 'intermediate', 'seated', 'leaning']
  },
  'seated-lean-wall-single': {
    id: 'seated-lean-wall-single', category: 'lean-seat', name: 'Seated Lean Wall Single',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit on the floor beside a wall and lean one shoulder against it, legs extended or bent to the side. Rest the near arm along the top of a bent knee.',
    tip: 'The wall gives real support, letting you hold a relaxed lean far longer than an unsupported seated twist.',
    joints: { spine: 12, leftKnee: 90, leftElbow: 60 },
    color: 'var(--color-teal-100)', figure: 'seated-floor',
    tags: ['relaxed', 'beginner', 'seated', 'leaning']
  },
  'crossed-elbow-crossed-legs': {
    id: 'crossed-elbow-crossed-legs', category: 'lean-seat', name: 'Crossed Elbow Crossed Legs',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit with legs crossed at the knee and both forearms crossed loosely atop the raised knee. Keep the spine tall and gaze direct and composed.',
    tip: 'Crossing both the arms and legs in the same direction creates a unified, harmonious line through the body.',
    joints: { spine: -4, leftKnee: 90, leftElbow: 110, rightElbow: 110 },
    color: 'var(--color-teal-100)', figure: 'seated-side',
    tags: ['editorial', 'intermediate', 'seated', 'leaning']
  },
  'hand-on-cheek': {
    id: 'hand-on-cheek', category: 'lean-seat', name: 'Hand on Cheek',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Rest an elbow on a table or knee and lay your open palm gently against your cheek, fingers pointing up toward the temple. Keep the touch soft and the neck relaxed.',
    tip: 'Keep light space between the fingers and the eye — pressing too close to the eye looks unnatural in photos.',
    joints: { spine: -8, leftElbow: 100, neck: -8 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['soft', 'beginner', 'seated', 'leaning']
  },
  'both-hands-chin': {
    id: 'both-hands-chin', category: 'lean-seat', name: 'Both Hands Chin',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Rest both elbows on a surface and cup your chin gently in both hands, fingers curling naturally along the jaw. Add a soft smile and slight head tilt.',
    tip: 'A slight head tilt within this pose prevents it from feeling too symmetrical and stiff.',
    joints: { spine: -10, leftElbow: 95, rightElbow: 95, neck: 10 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['warm', 'beginner', 'seated', 'social']
  },
  'reading-position': {
    id: 'reading-position', category: 'lean-seat', name: 'Reading Position',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit comfortably with a book or object held in both hands, elbows resting on your knees or a surface. Look down at the object for a natural, candid moment.',
    tip: 'A real object to hold and focus on removes self-consciousness and produces the most authentic candid expressions.',
    joints: { spine: -14, leftElbow: 80, rightElbow: 80, neck: -18 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['candid', 'beginner', 'seated', 'lifestyle']
  },
  'tea-cup-hold': {
    id: 'tea-cup-hold', category: 'lean-seat', name: 'Tea Cup Hold',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit with elbows resting near the table and hold a cup or mug in both hands close to your chest. Lean slightly forward and gaze softly toward the camera or down at the cup.',
    tip: 'Holding a warm prop close to the body naturally relaxes the shoulders and gives an authentic lifestyle feel.',
    joints: { spine: -8, leftElbow: 100, rightElbow: 100, neck: -6 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['lifestyle', 'beginner', 'seated', 'cozy']
  },
  'face-frame-hands': {
    id: 'face-frame-hands', category: 'lean-seat', name: 'Face Frame Hands',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Rest both elbows on a table and bring both hands up to loosely frame either side of your face without touching it. Keep the fingers relaxed and slightly spread.',
    tip: 'Leaving a small gap between the hands and the face avoids distorting the cheeks while still framing the eyes.',
    joints: { spine: -10, leftElbow: 120, rightElbow: 120, neck: -4 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['editorial', 'intermediate', 'seated', 'beauty']
  },
  'wrist-rest': {
    id: 'wrist-rest', category: 'lean-seat', name: 'Wrist Rest',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Sit with one elbow propped on a table and rest your jaw lightly against the back of your wrist rather than an open palm. Keep the shoulder relaxed and low.',
    tip: 'Resting on the wrist bone instead of the palm creates a sharper, more angular jawline in the final photo.',
    joints: { spine: -8, leftElbow: 95, neck: -10 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['portrait', 'beginner', 'seated', 'leaning']
  },
  'diagonal-lean-elbow': {
    id: 'diagonal-lean-elbow', category: 'lean-seat', name: 'Diagonal Lean Elbow',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit and lean the entire torso diagonally over one propped elbow, extending the opposite leg out for counterbalance. Creates a long diagonal from foot to head.',
    tip: 'Extending the far leg fully is what sells the diagonal — a tucked leg collapses the line back to vertical.',
    joints: { spine: 24, leftElbow: 80, rightKnee: 10, neck: 8 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['editorial', 'intermediate', 'seated', 'dramatic']
  },
  'table-lean-forward-arms-wide': {
    id: 'table-lean-forward-arms-wide', category: 'lean-seat', name: 'Table Lean Forward Arms Wide',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Sit at a table and lean forward, placing both palms flat and spread wide apart on the surface. Push the chest forward and hold a bold, assertive gaze.',
    tip: 'Wide-spread hands on a table read as commanding and confident — a strong choice for business or power portraits.',
    joints: { spine: -20, leftShoulder: -30, rightShoulder: 30, neck: -4 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['confident', 'intermediate', 'seated', 'editorial']
  },
  'neck-rest-arm': {
    id: 'neck-rest-arm', category: 'lean-seat', name: 'Neck Rest Arm',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Sit sideways and rest the back of your neck against your own raised forearm, elbow propped on a raised knee or armrest. Let the eyes close or gaze softly downward.',
    tip: 'This creates a graceful, closed triangle shape with the arm — check that the elbow doesn\'t block the face from the chosen angle.',
    joints: { spine: 4, leftElbow: 130, leftKnee: 85, neck: 12 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['graceful', 'beginner', 'seated', 'leaning']
  },
  'pillow-hug-seated': {
    id: 'pillow-hug-seated', category: 'lean-seat', name: 'Pillow Hug Seated',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit with knees bent and hug a pillow or blanket against your chest, resting your chin or cheek on top. Let one elbow rest on the nearby armrest for support.',
    tip: 'Squeezing the prop gently, rather than holding it loosely, gives the hands and arms visible, natural tension.',
    joints: { spine: -12, leftElbow: 110, leftKnee: 100, neck: -8 },
    color: 'var(--color-teal-100)', figure: 'elbow-prop',
    tags: ['cozy', 'beginner', 'seated', 'social']
  },

  // ══════════════ KNEELING (30) ══════════════
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
  'prayer-kneeling': {
    id: 'prayer-kneeling', category: 'kneeling', name: 'Prayer Kneeling',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel with both knees on the ground and press both palms together at chest height as if in prayer. Bow the head slightly forward and let the shoulders soften.',
    tip: 'Sitting slightly back onto the heels while keeping the spine long balances stability with an elegant line.',
    joints: { leftKnee: 10, rightKnee: 10, leftElbow: 110, rightElbow: 110, neck: 14 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['calm', 'beginner', 'kneeling', 'artistic']
  },
  'kneeling-back-arch': {
    id: 'kneeling-back-arch', category: 'kneeling', name: 'Kneeling Back Arch',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel upright with both knees down, then arch the spine backward while reaching both arms overhead and behind you. Let the head follow the arch naturally.',
    tip: 'Engage the core before arching to protect the lower back and keep the movement controlled rather than collapsed.',
    joints: { leftKnee: 5, rightKnee: 5, spine: -26, neck: 18, leftShoulder: -140 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['artistic', 'advanced', 'kneeling', 'expressive']
  },
  'one-knee-look-up': {
    id: 'one-knee-look-up', category: 'kneeling', name: 'One Knee Look Up',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel on one knee with the other foot planted flat in front, then tilt the chin upward and gaze toward the sky or light source. Rest a hand on the raised knee.',
    tip: 'Angling the face up toward the key light softens shadows and opens the eyes beautifully.',
    joints: { leftKnee: 90, rightKnee: 0, neck: -20, spine: -4 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['portrait', 'beginner', 'kneeling']
  },
  'kneeling-reach-side': {
    id: 'kneeling-reach-side', category: 'kneeling', name: 'Kneeling Reach Side',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'From a one-knee kneeling base, extend one arm out to the side at shoulder height while the torso leans slightly in the opposite direction for balance.',
    tip: 'The counterbalance lean is what keeps this reach looking graceful rather than off-kilter.',
    joints: { leftKnee: 90, rightKnee: 0, leftShoulder: -90, spine: -8 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'intermediate', 'kneeling']
  },
  'kneeling-arms-crossed': {
    id: 'kneeling-arms-crossed', category: 'kneeling', name: 'Kneeling Arms Crossed',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel with both knees down, sitting upright, and cross both arms loosely over your chest. Keep the shoulders relaxed and the chin level for a strong, composed portrait.',
    tip: 'A slight forward lean from the hips while kneeling keeps the pose from looking too rigid and formal.',
    joints: { leftKnee: 5, rightKnee: 5, leftElbow: 100, rightElbow: 100, spine: -4 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['confident', 'beginner', 'kneeling']
  },
  'kneeling-hand-floor': {
    id: 'kneeling-hand-floor', category: 'kneeling', name: 'Kneeling Hand Floor',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel on both knees and lean forward, placing one hand flat on the floor in front of you for support. Let the opposite arm rest on your thigh and look toward the camera.',
    tip: 'Keep the supporting arm slightly bent, not locked, so the pose reads as fluid rather than braced.',
    joints: { leftKnee: 5, rightKnee: 5, spine: -20, leftElbow: 15, neck: -6 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'intermediate', 'kneeling']
  },
  'kneeling-lean-forward': {
    id: 'kneeling-lean-forward', category: 'kneeling', name: 'Kneeling Lean Forward',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel upright and lean the torso forward from the hips, resting both forearms on your thighs. Keep the spine long through the lean and the gaze direct.',
    tip: 'Hinge from the hips rather than rounding the upper back to keep the chest open during the forward lean.',
    joints: { leftKnee: 5, rightKnee: 5, spine: -16, leftElbow: 90, rightElbow: 90 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['relaxed', 'beginner', 'kneeling']
  },
  'kneeling-hip-sit': {
    id: 'kneeling-hip-sit', category: 'kneeling', name: 'Kneeling Hip Sit',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Kneel and shift your seat to one side, sitting your hip down beside your heels rather than centered. Lean on one arm for support and let the other rest on your thigh.',
    tip: 'This mermaid-style sit creates a lovely soft S-curve through the hips and lower back.',
    joints: { leftKnee: 90, rightKnee: 100, spine: 10, leftElbow: 10 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['soft', 'beginner', 'kneeling']
  },
  'kneeling-profile': {
    id: 'kneeling-profile', category: 'kneeling', name: 'Kneeling Profile',
    difficulty: 'Beginner', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel upright in full profile to the camera, hands resting on your thighs. Lift the chin slightly to create a clean line from knee to crown.',
    tip: 'A strict profile depends on precise alignment — check that the shoulders and hips are truly perpendicular to the lens.',
    joints: { leftKnee: 5, rightKnee: 5, neck: -6, spine: 0 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'beginner', 'kneeling', 'profile']
  },
  'both-knees-arms-up': {
    id: 'both-knees-arms-up', category: 'kneeling', name: 'Both Knees Arms Up',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel with both knees down and raise both arms straight overhead in a wide V, chest lifted and open. A bold, symmetrical, celebratory shape.',
    tip: 'Keep a soft bend in the elbows overhead — fully locked arms photograph as stiff even in a joyful pose.',
    joints: { leftKnee: 5, rightKnee: 5, leftShoulder: -160, rightShoulder: -160, spine: -8 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['joyful', 'intermediate', 'kneeling', 'artistic']
  },
  'kneeling-sit-between-heels': {
    id: 'kneeling-sit-between-heels', category: 'kneeling', name: 'Sit Between Heels',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel and lower your seat down between your heels rather than onto them, knees spread slightly. Rest hands on thighs and keep the spine tall despite the low position.',
    tip: 'This deep kneel demands good ankle flexibility — sit only as low as remains comfortable and controlled.',
    joints: { leftKnee: 150, rightKnee: 150, spine: 0, neck: -2 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['artistic', 'intermediate', 'kneeling']
  },
  'kneeling-side-stretch': {
    id: 'kneeling-side-stretch', category: 'kneeling', name: 'Kneeling Side Stretch',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel upright and reach one arm overhead, bending the torso sideways over the opposite hip. Let the other hand slide down toward the floor for a full lateral stretch.',
    tip: 'Keep both hips grounded and level — the bend should come entirely from the waist and ribcage.',
    joints: { leftKnee: 5, rightKnee: 5, leftShoulder: -150, spine: 24 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['stretch', 'intermediate', 'kneeling', 'artistic']
  },
  'kneeling-look-back': {
    id: 'kneeling-look-back', category: 'kneeling', name: 'Kneeling Look Back',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel facing away from the camera, then twist the torso and turn your head back over one shoulder toward the lens. Let one hand rest on the floor behind you for the twist.',
    tip: 'Lead with the eyes, then let the shoulders and ribcage follow — a sequential twist looks far more natural.',
    joints: { leftKnee: 5, rightKnee: 5, spine: 24, neck: 30 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'intermediate', 'kneeling', 'back']
  },
  'kneeling-prayer-up': {
    id: 'kneeling-prayer-up', category: 'kneeling', name: 'Kneeling Prayer Up',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel and press both palms together, then raise the joined hands high above the head rather than at the chest. Tilt the face upward slightly to follow the reach.',
    tip: 'Lengthening through the sides of the ribcage as the arms lift keeps the pose graceful instead of strained.',
    joints: { leftKnee: 5, rightKnee: 5, leftShoulder: -170, rightShoulder: -170, neck: -10 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['artistic', 'beginner', 'kneeling']
  },
  'kneeling-dragon': {
    id: 'kneeling-dragon', category: 'kneeling', name: 'Kneeling Dragon',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'From a low lunge with one knee down, sweep the back leg up and back, holding the ankle with the same-side hand while the torso opens toward the camera. A deep, dramatic backbend stretch.',
    tip: 'Warm up thoroughly before attempting this — the pose relies on hip and back flexibility, so never force the stretch.',
    joints: { leftKnee: 90, rightKnee: 140, spine: -20, leftShoulder: -60 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['advanced', 'artistic', 'kneeling', 'flexible']
  },
  'kneeling-hug': {
    id: 'kneeling-hug', category: 'kneeling', name: 'Kneeling Hug',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Kneel back onto your heels and wrap both arms around your own torso in a self-hug, shoulders relaxed and head tilted slightly down. A tender, introspective mood.',
    tip: 'Tucking the chin slightly and closing the eyes deepens the intimate, self-soothing feeling of this pose.',
    joints: { leftKnee: 20, rightKnee: 20, leftElbow: 130, rightElbow: 130, neck: 12 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['intimate', 'beginner', 'kneeling', 'social']
  },
  'kneeling-twist-back': {
    id: 'kneeling-twist-back', category: 'kneeling', name: 'Kneeling Twist Back',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel upright and rotate the torso fully to one side, reaching the trailing arm across the body while the front arm opens outward. A dynamic spinal rotation.',
    tip: 'Keep both knees anchored on the ground throughout — the twist should isolate the torso, not shift the base.',
    joints: { leftKnee: 5, rightKnee: 5, spine: 26, leftShoulder: 30, rightShoulder: -60 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'intermediate', 'kneeling', 'dynamic']
  },
  'kneeling-forearm-floor': {
    id: 'kneeling-forearm-floor', category: 'kneeling', name: 'Kneeling Forearm Floor',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel and lower onto both forearms on the floor in front of you, hips still lifted off the heels. Let the gaze rest forward, low to the ground, for an intimate angle.',
    tip: 'Shooting from a similarly low camera angle makes this pose feel immersive rather than distant.',
    joints: { leftKnee: 90, rightKnee: 90, spine: -30, leftElbow: 90, neck: -14 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['intimate', 'intermediate', 'kneeling']
  },
  'kneeling-reach-up-one': {
    id: 'kneeling-reach-up-one', category: 'kneeling', name: 'Kneeling Reach Up One',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel on one knee and extend the opposite arm straight up overhead, fingers reaching toward the ceiling or sky. Let the gaze follow the hand upward.',
    tip: 'Reaching from a lower base like kneeling exaggerates verticality — shoot from a low angle to emphasize the length.',
    joints: { leftKnee: 90, rightKnee: 0, rightShoulder: -165, neck: -14 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['artistic', 'intermediate', 'kneeling']
  },
  'kneeling-seated-arms-wide': {
    id: 'kneeling-seated-arms-wide', category: 'kneeling', name: 'Kneeling Seated Arms Wide',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Sit back on your heels and open both arms wide to the sides at shoulder height, palms up, in a welcoming gesture. Keep the chest lifted and expression warm.',
    tip: 'An open palm gesture reads as inviting — keep the fingers relaxed rather than stiffly extended.',
    joints: { leftKnee: 20, rightKnee: 20, leftShoulder: -80, rightShoulder: -80 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['welcoming', 'beginner', 'kneeling', 'social']
  },
  'kneeling-crouch': {
    id: 'kneeling-crouch', category: 'kneeling', name: 'Kneeling Crouch',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Dynamic', effort: 'Static',
    instructions: 'Drop into a low crouch with one knee nearly touching the ground and the other foot planted for balance. Rest one forearm across the raised knee, coiled and alert.',
    tip: 'This ready, coiled stance photographs powerfully from a low angle looking slightly upward at the subject.',
    joints: { leftKnee: 120, rightKnee: 90, spine: -6, leftElbow: 90 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['dynamic', 'intermediate', 'kneeling', 'strong']
  },
  'kneeling-tuck-forward': {
    id: 'kneeling-tuck-forward', category: 'kneeling', name: 'Kneeling Tuck Forward',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel and fold the torso forward over the thighs, arms extending along the floor or tucked beside the body. A restful, child\'s-pose-like silhouette.',
    tip: 'Letting the arms extend fully forward elongates the shape more than tucking them close to the sides.',
    joints: { leftKnee: 150, rightKnee: 150, spine: -35, leftShoulder: -120 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['restful', 'beginner', 'kneeling', 'artistic']
  },
  'kneeling-lean-hands-floor': {
    id: 'kneeling-lean-hands-floor', category: 'kneeling', name: 'Kneeling Lean Hands Floor',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel and lean forward onto both hands flat on the floor, hips lifted slightly off the heels. Arch the back gently and lift the gaze forward for a feline, poised look.',
    tip: 'A gentle spinal arch here (rather than a rounded back) gives the pose a much more elegant, cat-like quality.',
    joints: { leftKnee: 100, rightKnee: 100, spine: -12, leftElbow: 10, neck: -6 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'intermediate', 'kneeling']
  },
  'kneeling-chest-open': {
    id: 'kneeling-chest-open', category: 'kneeling', name: 'Kneeling Chest Open',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Kneel upright and draw both shoulder blades together, opening the chest wide with arms relaxed at the sides. A confident, grounded kneeling posture.',
    tip: 'Lift through the sternum rather than pulling the shoulders back forcibly — it looks natural, not military.',
    joints: { leftKnee: 5, rightKnee: 5, leftShoulder: 10, rightShoulder: 10, spine: -8 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['confident', 'beginner', 'kneeling']
  },
  'kneeling-bow': {
    id: 'kneeling-bow', category: 'kneeling', name: 'Kneeling Bow',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Kneel and bow the torso forward gracefully from the hips, arms resting on the thighs or extended forward. A respectful, serene gesture of humility.',
    tip: 'Keep the bow controlled and slow rather than collapsing forward quickly — the stillness is what reads as reverent.',
    joints: { leftKnee: 10, rightKnee: 10, spine: -28, neck: -10 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['serene', 'beginner', 'kneeling', 'artistic']
  },
  'kneeling-crossed-arms-look-side': {
    id: 'kneeling-crossed-arms-look-side', category: 'kneeling', name: 'Kneeling Crossed Arms Look Side',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Kneel upright with arms crossed firmly over the chest, but turn the head sharply to one side rather than facing forward. A cool, editorial attitude.',
    tip: 'A sharp head turn combined with a still torso creates strong graphic tension in the frame.',
    joints: { leftKnee: 5, rightKnee: 5, leftElbow: 100, rightElbow: 100, neck: 28 },
    color: 'var(--color-gold-300)', figure: 'kneeling',
    tags: ['editorial', 'intermediate', 'kneeling', 'attitude']
  },

  // ══════════════ RECLINING (30) ══════════════
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
  'belly-up-arms-wide': {
    id: 'belly-up-arms-wide', category: 'reclining', name: 'Belly Up Arms Wide',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie flat on your back and extend both arms out to the sides at shoulder height, palms open toward the ceiling. Let the legs relax straight or slightly apart.',
    tip: 'Shot from directly overhead, this open shape reads as peaceful and expansive — great for flat-lay style compositions.',
    joints: { spine: 0, leftShoulder: -85, rightShoulder: -85, neck: 0 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['peaceful', 'beginner', 'reclining', 'artistic']
  },
  'side-recline-top-leg-bent': {
    id: 'side-recline-top-leg-bent', category: 'reclining', name: 'Side Recline Top Leg Bent',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Lie on your side propped on one elbow, then bend the top leg forward and rest the knee on the ground in front of the bottom leg. Creates a flattering figure-four line through the hips.',
    tip: 'The bent top leg is what creates the classic waist-to-hip curve seen in most reclining portrait poses.',
    joints: { spine: 6, leftElbow: 85, leftKnee: 100, neck: -12 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['flattering', 'beginner', 'reclining', 'classic']
  },
  'prone-tuck-arms': {
    id: 'prone-tuck-arms', category: 'reclining', name: 'Prone Tuck Arms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Lie face down and tuck both forearms beneath your chin, resting your head sideways on your stacked hands. Let the legs relax straight or gently bent.',
    tip: 'Turning the head to rest one cheek on the hands, rather than facing the lens directly, gives a candid, relaxed feel.',
    joints: { spine: -10, leftElbow: 70, rightElbow: 70, neck: 24 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['candid', 'beginner', 'reclining', 'relaxed']
  },
  'supine-one-knee-up': {
    id: 'supine-one-knee-up', category: 'reclining', name: 'Supine One Knee Up',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Lie on your back and bend one knee up with the foot flat on the ground, letting the other leg rest straight. Rest one hand on your stomach and the other beside you.',
    tip: 'A single bent knee breaks the symmetry of a flat lying pose and adds a relaxed, casual silhouette.',
    joints: { spine: 0, leftKnee: 90, rightKnee: 0, leftElbow: 30 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['casual', 'beginner', 'reclining']
  },
  'back-recline-arms-up': {
    id: 'back-recline-arms-up', category: 'reclining', name: 'Back Recline Arms Up',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie flat on your back and stretch both arms straight overhead, resting them on the ground above your head. Let the whole body lengthen from fingertips to toes.',
    tip: 'Pointing the toes while the arms stretch overhead creates one continuous elegant line through the entire body.',
    joints: { spine: 0, leftShoulder: -175, rightShoulder: -175, neck: -4 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['elongated', 'beginner', 'reclining', 'artistic']
  },
  'side-recline-gaze-up': {
    id: 'side-recline-gaze-up', category: 'reclining', name: 'Side Recline Gaze Up',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'Lie on your side propped on one elbow, but tilt the head back and gaze upward rather than at the camera. Let the neck lengthen with the upward tilt.',
    tip: 'This upward gaze variation softens the classic reclining pose into something more dreamy and introspective.',
    joints: { spine: 5, leftElbow: 88, neck: 22 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['dreamy', 'beginner', 'reclining']
  },
  'sphinx-pose': {
    id: 'sphinx-pose', category: 'reclining', name: 'Sphinx Pose',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie face down and prop the upper body up on both forearms, elbows directly under the shoulders. Keep the hips grounded and the gaze level or slightly lifted.',
    tip: 'Keep the elbows stacked under the shoulders, not out wide, for the cleanest line through the upper body.',
    joints: { spine: -18, leftElbow: 90, rightElbow: 90, neck: -4 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['artistic', 'intermediate', 'reclining', 'yoga']
  },
  'lounger-back-arm-raised': {
    id: 'lounger-back-arm-raised', category: 'reclining', name: 'Lounger Back Arm Raised',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Recline back on a lounger or bed with one arm raised and resting behind your head. Let the other arm rest along your side or on your stomach, legs relaxed.',
    tip: 'A raised arm behind the head opens the ribcage and elongates the torso for a more flattering reclining line.',
    joints: { spine: 8, leftShoulder: -140, leftElbow: 60, neck: -6 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['relaxed', 'beginner', 'reclining', 'social']
  },
  'prone-push-up-position': {
    id: 'prone-push-up-position', category: 'reclining', name: 'Prone Push-Up Position',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Lie face down and press both palms flat near your shoulders as if starting a push-up, lifting the chest slightly off the ground. Keep the hips grounded for support.',
    tip: 'Lift only the chest, not the hips, to keep this feeling like a soft recline rather than an athletic exercise pose.',
    joints: { spine: -22, leftElbow: 60, rightElbow: 60, neck: -8 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['editorial', 'intermediate', 'reclining']
  },
  'floor-roll-side': {
    id: 'floor-roll-side', category: 'reclining', name: 'Floor Roll Side',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Active',
    instructions: 'Capture the mid-motion of rolling from your back onto your side, one arm reaching across the body and legs mid-turn. A candid, in-between moment full of energy.',
    tip: 'Actually roll through the motion several times and shoot in burst — the in-between frames are far more dynamic than a held pose.',
    joints: { spine: 16, leftShoulder: 30, leftKnee: 60 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['dynamic', 'intermediate', 'reclining', 'motion']
  },
  'fetal-curl': {
    id: 'fetal-curl', category: 'reclining', name: 'Fetal Curl',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie on your side and curl your knees up toward your chest while tucking your chin down and arms in close to the body. A protective, introspective curled shape.',
    tip: 'Leave the top arm slightly separated from the body so it doesn\'t disappear entirely into the silhouette.',
    joints: { spine: 18, leftKnee: 30, rightKnee: 30, neck: 16 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['introspective', 'beginner', 'reclining', 'artistic']
  },
  'back-angel': {
    id: 'back-angel', category: 'reclining', name: 'Back Angel',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Active',
    instructions: 'Lie on your back on a soft surface and sweep both arms out and up above your head, like making a snow angel. Legs can stay together or spread slightly.',
    tip: 'Capture this mid-sweep rather than at full extension — the motion blur of moving arms adds life to the frame.',
    joints: { spine: 0, leftShoulder: -120, rightShoulder: -120 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['playful', 'beginner', 'reclining', 'motion']
  },
  'spread-eagle': {
    id: 'spread-eagle', category: 'reclining', name: 'Spread Eagle',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie on your back with arms and legs spread wide into a full X shape. Let the whole body relax completely into the surface below.',
    tip: 'This works beautifully as an overhead shot on a bed, grass, or sand where the full X reads clearly.',
    joints: { spine: 0, leftShoulder: -80, rightShoulder: -80, leftHip: 35, rightHip: 35 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['carefree', 'beginner', 'reclining', 'overhead']
  },
  'floor-seated-recline': {
    id: 'floor-seated-recline', category: 'reclining', name: 'Floor Seated Recline',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the floor and lower back gradually onto both elbows, legs bent or extended forward. A relaxed mid-point between sitting and fully lying down.',
    tip: 'This half-reclined angle is often the most flattering middle ground — experiment with elbow height to find it.',
    joints: { spine: 22, leftElbow: 20, rightElbow: 20, leftKnee: 90 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['relaxed', 'beginner', 'reclining']
  },
  'superman-arms': {
    id: 'superman-arms', category: 'reclining', name: 'Superman Arms',
    difficulty: 'Advanced', angle: 'Front', intent: 'Artistic', effort: 'Active',
    instructions: 'Lie face down and lift both arms and legs simultaneously off the ground, chest raised, in a flying superman shape. Hold briefly for the capture.',
    tip: 'This is a genuine muscular hold — take breaks between shots and only hold as long as feels controlled.',
    joints: { spine: -30, leftShoulder: -170, rightShoulder: -170, leftKnee: -5 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['advanced', 'artistic', 'reclining', 'dynamic']
  },
  'stargaze': {
    id: 'stargaze', category: 'reclining', name: 'Stargaze',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie flat on your back with hands laced behind your head, elbows relaxed out to the sides. Gaze straight up as if watching the night sky.',
    tip: 'Elbows resting flat on the ground rather than lifted keeps the shoulders relaxed during longer holds.',
    joints: { spine: 0, leftElbow: 100, rightElbow: 100, neck: 0 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['dreamy', 'beginner', 'reclining', 'artistic']
  },
  'hammock-pose': {
    id: 'hammock-pose', category: 'reclining', name: 'Hammock Pose',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Recline in a hammock or similarly curved surface, letting the body naturally sink into a gentle U-shape. One arm can trail off the side, fingers grazing the ground.',
    tip: 'Let the natural curve of the hammock do the work — resist the urge to hold yourself rigidly straight within it.',
    joints: { spine: 15, leftKnee: 30, leftShoulder: -20 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['relaxed', 'beginner', 'reclining', 'outdoor']
  },
  'pool-float': {
    id: 'pool-float', category: 'reclining', name: 'Pool Float',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Lie back on a pool float or in shallow water, arms relaxed out to the sides and legs loosely extended. Let the body drift naturally with the water\'s movement.',
    tip: 'Sunglasses and a relaxed half-smile complete the effortless summer mood of this pose.',
    joints: { spine: 0, leftShoulder: -50, rightShoulder: -50 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['summer', 'beginner', 'reclining', 'social']
  },
  'floor-tuck-half-recline': {
    id: 'floor-tuck-half-recline', category: 'reclining', name: 'Floor Tuck Half Recline',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Recline back on one elbow while tucking both knees to the same side, creating a spiral through the lower body. Let the free arm rest along the thigh.',
    tip: 'The spiral between the upper torso facing camera and the legs turned away is what gives this its editorial polish.',
    joints: { spine: 12, leftElbow: 85, leftKnee: 100, rightKnee: 100 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['editorial', 'intermediate', 'reclining']
  },
  'drowsy-recline': {
    id: 'drowsy-recline', category: 'reclining', name: 'Drowsy Recline',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Lie on your side with both hands tucked under your cheek as if sleeping, knees drawn up gently. Close the eyes softly for a tender, peaceful mood.',
    tip: 'A slightly parted, relaxed mouth sells the sleepy authenticity far better than a tightly closed one.',
    joints: { spine: 12, leftElbow: 40, leftKnee: 60, neck: 10 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['peaceful', 'beginner', 'reclining', 'tender']
  },
  'diagonal-prop': {
    id: 'diagonal-prop', category: 'reclining', name: 'Diagonal Prop',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lie propped on one elbow with the body angled diagonally across the frame rather than parallel to it. Extend the top leg long for maximum diagonal length.',
    tip: 'Shooting the diagonal across the full frame, corner to corner, creates the most dynamic composition.',
    joints: { spine: 10, leftElbow: 85, leftKnee: 5, rightKnee: 90 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['editorial', 'intermediate', 'reclining', 'composition']
  },
  'floor-side-elbow-leg-raised': {
    id: 'floor-side-elbow-leg-raised', category: 'reclining', name: 'Floor Side Elbow Leg Raised',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie on your side propped on one elbow and lift the top leg straight up into the air, holding it with the free hand at the ankle if flexibility allows. A striking, athletic line.',
    tip: 'Only lift as high as maintains a straight knee and controlled balance — a bent, straining leg undercuts the elegance.',
    joints: { spine: 8, leftElbow: 85, leftKnee: -60, leftShoulder: 40 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['advanced', 'artistic', 'reclining', 'flexible']
  },
  'cobra-lite': {
    id: 'cobra-lite', category: 'reclining', name: 'Cobra Lite',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Lie face down and press through both palms to lift the chest into a gentle backbend, keeping the hips grounded. Look forward or slightly upward.',
    tip: 'Keep the elbows slightly bent rather than fully straightening the arms — it keeps the backbend soft and controlled.',
    joints: { spine: -25, leftElbow: 40, rightElbow: 40, neck: -10 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['artistic', 'intermediate', 'reclining', 'yoga']
  },
  'back-recline-knee-hug': {
    id: 'back-recline-knee-hug', category: 'reclining', name: 'Back Recline Knee Hug',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Lie on your back and hug one knee up toward your chest with both arms while the other leg stays extended flat. A playful, asymmetrical reclining shape.',
    tip: 'Pointing the toe of the extended leg keeps the overall line elegant even in this playful pose.',
    joints: { spine: 5, leftKnee: 140, rightKnee: 0, leftElbow: 100 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['playful', 'beginner', 'reclining']
  },
  'floor-stomach-flip-flop': {
    id: 'floor-stomach-flip-flop', category: 'reclining', name: 'Floor Stomach Flip Flop',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Lie face down with knees bent and feet crossed lazily in the air behind you, chin resting on stacked hands. A youthful, playful, magazine-cover classic.',
    tip: 'Letting the feet sway gently and cross loosely (rather than holding them stiffly) keeps this pose feeling candid.',
    joints: { spine: -14, leftKnee: 110, rightKnee: 100, leftElbow: 70, rightElbow: 70 },
    color: 'var(--color-parchment-200)', figure: 'side-recline',
    tags: ['playful', 'beginner', 'reclining', 'classic']
  },

  // ══════════════ DYNAMIC (30) ══════════════
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
  'warrior-lunge': {
    id: 'warrior-lunge', category: 'dynamic', name: 'Warrior Lunge',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Step one leg forward into a deep lunge, bending the front knee to 90 degrees while the back leg extends straight. Raise both arms overhead in a strong, warrior-like stance.',
    tip: 'Keep the front knee tracking directly over the ankle, not past the toes, for both safety and a cleaner silhouette.',
    joints: { leftKnee: 90, rightKnee: 5, leftShoulder: -160, rightShoulder: -160, spine: -6 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'strong']
  },
  'toss-hair': {
    id: 'toss-hair', category: 'dynamic', name: 'Toss Hair',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Sudden-Free',
    instructions: 'Whip your head and hair forward then snap it back in one fluid motion, capturing the peak moment as the hair is airborne. Let one hand run through the ends as they settle.',
    tip: 'Shoot in burst mode through several tosses — timing the exact peak of hair movement by eye alone is nearly impossible.',
    joints: { neck: -22, spine: -8, leftShoulder: -60 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['glamour', 'intermediate', 'dynamic', 'motion']
  },
  'skip-step': {
    id: 'skip-step', category: 'dynamic', name: 'Skip Step',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Capture a genuine skip mid-air, one knee driving up and the opposite arm swinging forward. Let the free leg trail slightly behind for a joyful, bouncy silhouette.',
    tip: 'Real skips produce the most natural motion — avoid faking the position statically, actually skip through the frame.',
    joints: { leftKnee: 100, rightKnee: -10, leftShoulder: 40, rightShoulder: -60, spine: 6 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['joyful', 'intermediate', 'dynamic', 'motion']
  },
  'pivot-turn': {
    id: 'pivot-turn', category: 'dynamic', name: 'Pivot Turn',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Plant one foot and pivot the body sharply around it, letting clothing and hair swing with the rotation. Freeze at the point where the torso has turned but the head is still catching up.',
    tip: 'The slight lag between hips and head mid-turn is what creates the sense of motion — avoid a fully aligned freeze.',
    joints: { spine: 20, neck: 10, leftHip: 25 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['editorial', 'advanced', 'dynamic', 'motion']
  },
  'run-freeze': {
    id: 'run-freeze', category: 'dynamic', name: 'Run Freeze',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Freeze mid-run with one leg driving forward and bent, the other extended behind, arms pumping in opposition. Lean the torso forward into the implied momentum.',
    tip: 'A genuine short sprint captured on burst produces far more convincing running frames than a held static pose.',
    joints: { leftKnee: 100, rightKnee: -20, leftShoulder: -30, rightShoulder: 40, spine: 10 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'motion']
  },
  'leap-freeze': {
    id: 'leap-freeze', category: 'dynamic', name: 'Leap Freeze',
    difficulty: 'Advanced', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Capture the apex of a jump with both feet off the ground, legs tucked or extended behind you, arms trailing back. The peak moment right before descent begins.',
    tip: 'Time the shutter for the very top of the jump, where the body briefly appears to hang weightless in the air.',
    joints: { leftKnee: 100, rightKnee: 40, leftShoulder: 60, rightShoulder: 60, spine: 8 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['editorial', 'advanced', 'dynamic', 'motion']
  },
  'cartwheel-freeze': {
    id: 'cartwheel-freeze', category: 'dynamic', name: 'Cartwheel Freeze',
    difficulty: 'Advanced', angle: 'Front', intent: 'Artistic', effort: 'Active',
    instructions: 'Capture the mid-point of a cartwheel with one hand planted and legs extended into a wide inverted V. A striking, gravity-defying frame.',
    tip: 'Only attempt this on a soft, safe surface with room to complete the movement fully if the freeze is missed.',
    joints: { leftShoulder: -170, leftHip: 60, rightHip: -60, spine: 15 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'artistic', 'dynamic', 'acrobatic']
  },
  'arabesque-balance': {
    id: 'arabesque-balance', category: 'dynamic', name: 'Arabesque Balance',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Active',
    instructions: 'Stand on one leg and extend the other straight back behind you at hip height or higher, torso tilting forward to counterbalance. Extend the opposite arm forward for a classical dance line.',
    tip: 'Fix your gaze on a stationary point ahead — spotting is essential to holding balance in this extended position.',
    joints: { leftKnee: -5, rightHip: -70, spine: 20, leftShoulder: -70 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'artistic', 'dynamic', 'dance']
  },
  'basketball-reach': {
    id: 'basketball-reach', category: 'dynamic', name: 'Basketball Reach',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Jump and extend one arm fully upward as if shooting or blocking a basketball, the other arm bent for balance. Bend both knees slightly as if mid-jump.',
    tip: 'A real small jump, even a few inches, adds authentic lift compared to posing flat-footed with a raised arm.',
    joints: { leftShoulder: -170, rightElbow: 90, leftKnee: 30, rightKnee: 30 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'sport']
  },
  'tennis-follow': {
    id: 'tennis-follow', category: 'dynamic', name: 'Tennis Follow Through',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Swing one arm across the body in a follow-through motion as if finishing a tennis stroke, torso rotated and back foot pivoted onto its toes.',
    tip: 'Committing fully to the rotation of the hips and shoulders sells the athletic follow-through far better than a partial swing.',
    joints: { spine: 24, leftShoulder: 50, leftHip: 20, rightKnee: -10 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'sport']
  },
  'throw-pose': {
    id: 'throw-pose', category: 'dynamic', name: 'Throw Pose',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Wind one arm back behind the head as if about to throw an object, torso twisted opposite the throwing arm, opposite arm extended forward for aim.',
    tip: 'The twist between hips and shoulders should be maximized here — it\'s what generates the sense of coiled power.',
    joints: { rightShoulder: -140, leftShoulder: -40, spine: -20, leftHip: -15 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['editorial', 'intermediate', 'dynamic', 'athletic']
  },
  'catch-reach': {
    id: 'catch-reach', category: 'dynamic', name: 'Catch Reach',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Reach both hands upward and outward as if catching something falling from above, knees bent and body coiled to absorb the catch. Eyes tracking upward.',
    tip: 'Track your eyes to an actual thrown object (even imagined) — the gaze direction sells the catching action.',
    joints: { leftShoulder: -140, rightShoulder: -120, leftKnee: 25, rightKnee: 25, neck: -15 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['playful', 'intermediate', 'dynamic', 'motion']
  },
  'sprint-lean': {
    id: 'sprint-lean', category: 'dynamic', name: 'Sprint Lean',
    difficulty: 'Advanced', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Lean the torso dramatically forward from a low sprinter\'s start position, one leg bent under the hips and the other extended back, both hands near the ground.',
    tip: 'The steeper the forward lean, the more explosive the implied speed — but keep the front knee bent for genuine support.',
    joints: { spine: 35, leftKnee: 90, rightKnee: 170, leftElbow: 60 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'editorial', 'dynamic', 'athletic']
  },
  'martial-arts-guard': {
    id: 'martial-arts-guard', category: 'dynamic', name: 'Martial Arts Guard',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Take a wide, low fighting stance with both fists raised near the face in a guard position. Bend both knees and keep the weight centered and ready.',
    tip: 'Keep the chin tucked slightly behind the guard — an exposed chin undercuts the readiness of the stance.',
    joints: { leftKnee: 40, rightKnee: 40, leftElbow: 110, rightElbow: 110, spine: 6 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'strong']
  },
  'karate-chop': {
    id: 'karate-chop', category: 'dynamic', name: 'Karate Chop',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Extend one arm forward in a sharp chopping motion, blade of the hand leading, while the other arm pulls back for counterbalance. Bend the front knee for a stable base.',
    tip: 'A sharp exhale timed with the chop\'s extension adds real tension and energy to the freeze.',
    joints: { leftShoulder: -50, leftElbow: -10, rightElbow: 100, leftKnee: 30 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['playful', 'intermediate', 'dynamic', 'athletic']
  },
  'boxer-jab': {
    id: 'boxer-jab', category: 'dynamic', name: 'Boxer Jab',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Active',
    instructions: 'Extend one fist forward in a sharp jab while the other guards near the chin, back leg extended and front knee bent in a boxer\'s stance.',
    tip: 'Rotate the front hip slightly into the jab — the hip rotation is what sells real punching mechanics.',
    joints: { leftShoulder: -60, leftElbow: -5, rightElbow: 110, leftKnee: 30, rightKnee: 10 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['athletic', 'intermediate', 'dynamic', 'strong']
  },
  'dance-arms-up': {
    id: 'dance-arms-up', category: 'dynamic', name: 'Dance Arms Up',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Sway the hips to one side while both arms lift overhead in a loose, joyful dance gesture. Let the knees bounce slightly with the implied rhythm.',
    tip: 'Actually moving to music while shooting produces much more authentic dance energy than a held static pose.',
    joints: { leftHip: 20, leftShoulder: -150, rightShoulder: -140, spine: 8 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['joyful', 'intermediate', 'dynamic', 'dance']
  },
  'hip-hop-lean': {
    id: 'hip-hop-lean', category: 'dynamic', name: 'Hip Hop Lean',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Lean the torso sharply to one side with a bent knee and one arm crossed low across the body, the other flexed near the shoulder. A grounded, urban dance freeze.',
    tip: 'Sharp, angular joints (rather than soft curves) are what give street-style dance freezes their punch.',
    joints: { spine: 22, leftKnee: 60, leftElbow: 100, rightElbow: 40 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['urban', 'intermediate', 'dynamic', 'dance']
  },
  'salsa-step': {
    id: 'salsa-step', category: 'dynamic', name: 'Salsa Step',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Step one foot to the side with hips rotated into the step, one arm curved overhead and the other extended to the side. A vibrant, rhythmic dance line.',
    tip: 'Let the hip lead the step rather than the shoulders — authentic salsa movement always originates from the hips.',
    joints: { leftHip: 30, leftShoulder: -140, rightShoulder: -60, spine: 10 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['vibrant', 'intermediate', 'dynamic', 'dance']
  },
  'acrobat-balance': {
    id: 'acrobat-balance', category: 'dynamic', name: 'Acrobat Balance',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Active',
    instructions: 'Balance on one leg with the torso tilted forward and the free leg extended high behind you, both arms spread wide for counterbalance. A striking acrobatic silhouette.',
    tip: 'Build up to full extension gradually across several attempts rather than forcing maximum height on the first try.',
    joints: { leftKnee: -5, rightHip: -90, spine: 30, leftShoulder: -80, rightShoulder: 80 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'artistic', 'dynamic', 'acrobatic']
  },
  'street-dance-tilt': {
    id: 'street-dance-tilt', category: 'dynamic', name: 'Street Dance Tilt',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Freeze in an off-balance-looking tilt, weight shifted onto one bent leg while the torso leans dramatically away. Arms counterbalance in sharp, angular positions.',
    tip: 'The illusion of falling is the goal here — commit fully to the lean rather than protecting your center of balance.',
    joints: { spine: 32, leftKnee: 70, leftShoulder: -30, rightShoulder: 60 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'editorial', 'dynamic', 'street']
  },
  'windmill-arm': {
    id: 'windmill-arm', category: 'dynamic', name: 'Windmill Arm',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Sudden-Free',
    instructions: 'Swing one arm in a large circular windmill motion, capturing it mid-arc either overhead or extended to the side. Let the body twist naturally with the swing.',
    tip: 'Shoot a continuous burst through the full arm rotation — the most interesting frame is rarely the one you expect.',
    joints: { leftShoulder: -100, spine: 15, leftHip: 10 },
    color: 'rgba(109,74,114,0.2)', figure: 'dynamic-reach',
    tags: ['artistic', 'intermediate', 'dynamic', 'motion']
  },

  // ══════════════ ECCENTRIC (30) ══════════════
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
  'matrix-lean': {
    id: 'matrix-lean', category: 'eccentric', name: 'Matrix Lean',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Sudden-Free',
    instructions: 'Lean the torso back dramatically at a steep angle while keeping the feet firmly planted, arms held slightly out for balance, in a bullet-dodging silhouette.',
    tip: 'This requires real core strength — practice against a wall first to find your safe maximum lean angle.',
    joints: { spine: -35, leftKnee: -15, leftShoulder: -20, rightShoulder: 20 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['dramatic', 'advanced', 'eccentric', 'iconic']
  },
  'catwalk-extreme': {
    id: 'catwalk-extreme', category: 'eccentric', name: 'Catwalk Extreme',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Exaggerate a runway stride to the extreme, crossing one foot sharply in front of the other, hip thrust dramatically to the side, chin lifted high and severe.',
    tip: 'Push every angle further than feels natural — high fashion editorial poses read as subtle once through a lens.',
    joints: { leftHip: 30, rightHip: -25, spine: 12, neck: -18 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['fashion', 'advanced', 'eccentric', 'editorial']
  },
  'avant-garde-arms': {
    id: 'avant-garde-arms', category: 'eccentric', name: 'Avant-Garde Arms',
    difficulty: 'Advanced', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Bend both arms into sharp, asymmetrical geometric angles at different heights, as if forming an abstract sculpture with your own limbs.',
    tip: 'Break symmetry deliberately — mismatched angles between the left and right arm are the entire point of this pose.',
    joints: { leftShoulder: -90, leftElbow: 30, rightShoulder: 20, rightElbow: 130 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['abstract', 'advanced', 'eccentric', 'artistic']
  },
  'abstract-contortion': {
    id: 'abstract-contortion', category: 'eccentric', name: 'Abstract Contortion',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Twist the torso and limbs into an unconventional, sculptural shape that prioritizes interesting negative space over natural anatomy. Hold with control.',
    tip: 'Work with a mirror or monitor to check the silhouette in real time — contorted poses are hard to judge from the inside.',
    joints: { spine: 30, leftHip: -20, leftShoulder: 60, rightElbow: 140 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'artistic', 'eccentric', 'sculptural']
  },
  'statue-freeze': {
    id: 'statue-freeze', category: 'eccentric', name: 'Statue Freeze',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Hold a completely rigid, deliberate pose as if carved from marble, with a neutral or classical arm gesture. Do not blink or shift for the duration of the capture.',
    tip: 'A truly still, unblinking hold is what sells the statue illusion — even a small unconscious sway breaks it.',
    joints: { spine: 0, leftShoulder: -30, neck: 0 },
    color: 'rgba(74,47,109,0.2)', figure: 'standing-front',
    tags: ['artistic', 'intermediate', 'eccentric', 'concept']
  },
  'mirror-pose': {
    id: 'mirror-pose', category: 'eccentric', name: 'Mirror Pose',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Pose with perfect bilateral symmetry, both arms and legs mirroring each other exactly, as if reflected down a central vertical axis.',
    tip: 'Use a real mirror or monitor reflection to check both sides match — small asymmetries are hard to feel internally.',
    joints: { leftShoulder: -60, rightShoulder: -60, leftHip: 15, rightHip: -15 },
    color: 'rgba(74,47,109,0.2)', figure: 'standing-front',
    tags: ['symmetrical', 'intermediate', 'eccentric', 'concept']
  },
  'superhero-land': {
    id: 'superhero-land', category: 'eccentric', name: 'Superhero Landing',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Crouch low with one knee and one fist touching the ground, the other leg bent for support, as if just landing from a great height. A powerful, cinematic freeze.',
    tip: 'Add a small hop before dropping into the crouch — the slight impact makes the landing look more convincing.',
    joints: { leftKnee: 130, rightKnee: 80, leftElbow: 150, spine: -10 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['cinematic', 'intermediate', 'eccentric', 'fun']
  },
  'villain-stand': {
    id: 'villain-stand', category: 'eccentric', name: 'Villain Stand',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Stand with one hand tucked behind the back and the other gesturing outward with a sharp, commanding point. Tilt the chin down with a piercing, direct gaze.',
    tip: 'A lowered chin with eyes still lifted toward the lens creates the most intense, brooding effect.',
    joints: { leftShoulder: -40, rightShoulder: -60, neck: -14, spine: 4 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['dramatic', 'intermediate', 'eccentric', 'character']
  },
  'magic-cast': {
    id: 'magic-cast', category: 'eccentric', name: 'Magic Cast',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Sudden-Free',
    instructions: 'Extend both hands forward with fingers spread wide, as if casting a spell or channeling energy. Lean the torso back slightly and open the eyes wide with intensity.',
    tip: 'Slightly splayed, tense fingers read as more magical and energetic than a loose, relaxed hand.',
    joints: { leftShoulder: -70, rightShoulder: -70, spine: -10, neck: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['fantasy', 'intermediate', 'eccentric', 'creative']
  },
  'floating-gesture': {
    id: 'floating-gesture', category: 'eccentric', name: 'Floating Gesture',
    difficulty: 'Advanced', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Rise onto the toes of one foot with the other leg trailing gently behind, arms floating loosely at your sides as if weightless. A delicate, ethereal illusion.',
    tip: 'Soft, slightly bent joints throughout the body (never locked) are essential to selling the floating illusion.',
    joints: { leftKnee: -8, rightKnee: 15, leftShoulder: -20, rightShoulder: -15, spine: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['ethereal', 'advanced', 'eccentric', 'artistic']
  },
  'puppet-strings': {
    id: 'puppet-strings', category: 'eccentric', name: 'Puppet Strings',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Hold the limbs at unnatural, jointed angles as if suspended by invisible strings from above, wrists and elbows bent at sharp marionette-like angles.',
    tip: 'Keep the head slightly tilted and the jaw a touch slack — it enhances the uncanny puppet illusion.',
    joints: { leftShoulder: -100, leftElbow: 90, rightShoulder: 40, rightElbow: -70, neck: 10 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['creative', 'intermediate', 'eccentric', 'concept']
  },
  'ragdoll-hang': {
    id: 'ragdoll-hang', category: 'eccentric', name: 'Ragdoll Hang',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Let the entire upper body hang completely limp forward from the hips, arms dangling loosely toward the floor, head fully relaxed and hanging down.',
    tip: 'Exhale fully and let gravity do all the work — any muscular tension in the back or neck ruins the ragdoll effect.',
    joints: { spine: -45, neck: -30, leftShoulder: -10, rightShoulder: -10 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['artistic', 'intermediate', 'eccentric', 'loose']
  },
  'fashion-backward': {
    id: 'fashion-backward', category: 'eccentric', name: 'Fashion Backward',
    difficulty: 'Advanced', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Face fully away from the camera and arch the upper back while turning the head back sharply over one shoulder, exaggerating the spinal curve for a bold editorial back shot.',
    tip: 'This backward emphasis works best with a strong, structured garment or bare-back silhouette to show off the line.',
    joints: { spine: -28, neck: 32 },
    color: 'rgba(74,47,109,0.2)', figure: 'standing-front',
    tags: ['fashion', 'advanced', 'eccentric', 'editorial']
  },
  'extreme-hip': {
    id: 'extreme-hip', category: 'eccentric', name: 'Extreme Hip',
    difficulty: 'Advanced', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Push one hip out to its maximum extreme while the opposite shoulder drops equally far in the other direction, forming an exaggerated, graphic zigzag line.',
    tip: 'This is a caricature of the classic hip-shift — the exaggeration itself is the artistic statement, so commit fully.',
    joints: { leftHip: 40, rightShoulder: 35, spine: 18 },
    color: 'rgba(74,47,109,0.2)', figure: 'hip-shift',
    tags: ['graphic', 'advanced', 'eccentric', 'editorial']
  },
  'neck-extreme': {
    id: 'neck-extreme', category: 'eccentric', name: 'Neck Extreme',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Extend the neck to its maximum length, chin lifted and turned to a sharp profile, shoulders pressed firmly down and away. An extreme, sculptural elongation.',
    tip: 'Press the shoulders down consciously — most of the extra neck length comes from dropping the shoulders, not lifting the chin further.',
    joints: { neck: -30, leftShoulder: 15, rightShoulder: 15 },
    color: 'rgba(74,47,109,0.2)', figure: 'standing-front',
    tags: ['sculptural', 'intermediate', 'eccentric', 'artistic']
  },
  'arms-tangled': {
    id: 'arms-tangled', category: 'eccentric', name: 'Arms Tangled',
    difficulty: 'Advanced', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Wrap both arms around each other and across the torso in a tangled, interwoven shape, as if the limbs themselves are knotted together.',
    tip: 'Take reference photos from multiple angles first — tangled arm poses often look different than they feel from inside them.',
    joints: { leftShoulder: 40, leftElbow: 150, rightShoulder: -30, rightElbow: 100 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'artistic', 'eccentric', 'sculptural']
  },
  'gravity-defiance': {
    id: 'gravity-defiance', category: 'eccentric', name: 'Gravity Defiance',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Artistic', effort: 'Active',
    instructions: 'Capture a jump at its peak with the body angled as if defying gravity entirely — legs swept to one side, torso leaning the opposite direction, arms extended for drama.',
    tip: 'A trampoline or soft platform can help achieve genuine hang-time for a more convincing capture.',
    joints: { spine: 25, leftHip: 40, rightHip: 40, leftShoulder: -100 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'artistic', 'eccentric', 'dramatic']
  },
  'theater-bow': {
    id: 'theater-bow', category: 'eccentric', name: 'Theater Bow',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sweep one arm across the waist and bow deeply from the hips, the other arm extended behind you in a grand theatrical gesture. Look down toward the floor.',
    tip: 'A slower, more deliberate bow reads as more theatrical and intentional than a quick dip.',
    joints: { spine: -40, leftShoulder: 20, rightShoulder: -80, neck: -20 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['theatrical', 'beginner', 'eccentric', 'dramatic']
  },
  'operatic-arms': {
    id: 'operatic-arms', category: 'eccentric', name: 'Operatic Arms',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Throw both arms wide and high in a grand, operatic gesture, chest lifted and head tilted back as if mid-aria. A maximalist, expressive full-body shape.',
    tip: 'Open the mouth slightly as if singing — it completes the operatic illusion far better than a closed, neutral expression.',
    joints: { leftShoulder: -160, rightShoulder: -160, spine: -15, neck: 14 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['expressive', 'intermediate', 'eccentric', 'theatrical']
  },
  'dramatic-gasp': {
    id: 'dramatic-gasp', category: 'eccentric', name: 'Dramatic Gasp',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Sudden-Free',
    instructions: 'Bring both hands up to frame an open-mouthed, wide-eyed gasp of shock or surprise. Let the shoulders lift slightly with the sharp inhale.',
    tip: 'A genuine sharp inhale right before the shutter produces a far more believable gasp than a held, static expression.',
    joints: { leftElbow: 120, rightElbow: 120, leftShoulder: -50, rightShoulder: -50, neck: -6 },
    color: 'rgba(74,47,109,0.2)', figure: 'standing-front',
    tags: ['expressive', 'beginner', 'eccentric', 'social']
  },
  'thinker-extreme': {
    id: 'thinker-extreme', category: 'eccentric', name: 'Thinker Extreme',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit or crouch and press a closed fist hard against the chin, elbow braced on the opposite knee, torso hunched forward in an exaggerated Rodin-inspired pose of deep thought.',
    tip: 'Exaggerate the hunch further than feels natural — this pose is a deliberate homage and reads best pushed to the extreme.',
    joints: { spine: -30, leftElbow: 60, leftKnee: 90, neck: -20 },
    color: 'rgba(74,47,109,0.2)', figure: 'elbow-prop',
    tags: ['artistic', 'intermediate', 'eccentric', 'classic']
  },
  'crouching-prowl': {
    id: 'crouching-prowl', category: 'eccentric', name: 'Crouching Prowl',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Crouch low on the balls of both feet, fingertips grazing the ground, spine curved and head lifted like a predator ready to move. An intense, feline energy.',
    tip: 'Keep the weight forward on the toes rather than sitting back on the heels — it maintains the coiled, ready tension.',
    joints: { leftKnee: 140, rightKnee: 140, spine: -15, neck: -8 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'artistic', 'eccentric', 'intense']
  },
  'fashion-collapse': {
    id: 'fashion-collapse', category: 'eccentric', name: 'Fashion Collapse',
    difficulty: 'Advanced', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Let the body appear to collapse dramatically to one side, one knee buckling and the torso following, arms trailing as if caught mid-fall. A bold, high-fashion risk shot.',
    tip: 'Practice the controlled fall onto a soft surface first — this pose should look uncontrolled while staying completely safe.',
    joints: { spine: 30, leftKnee: 100, leftShoulder: 50, rightShoulder: -20 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['advanced', 'editorial', 'eccentric', 'fashion']
  },
  'elongated-reach': {
    id: 'elongated-reach', category: 'eccentric', name: 'Elongated Reach',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Stretch one arm forward and the opposite leg back simultaneously to maximum extension, forming one continuous line through the entire body from fingertip to toe.',
    tip: 'Think of pulling from both ends at once, like stretching taffy — the tension through the whole body sells the elongation.',
    joints: { leftShoulder: -160, rightHip: -50, spine: 10 },
    color: 'rgba(74,47,109,0.2)', figure: 'dynamic-reach',
    tags: ['artistic', 'intermediate', 'eccentric', 'elongated']
  },

  // ══════════════ COUPLE (30) ══════════════
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
  'slow-dance': {
    id: 'slow-dance', category: 'couple', name: 'Slow Dance',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Face each other closely with one partner\'s hands resting on the other\'s waist and the second partner\'s arms draped around the neck or shoulders, swaying gently as if dancing.',
    tip: 'A real gentle sway captured mid-motion feels far more genuine than a perfectly still dance hold.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['romantic', 'beginner', 'couple', 'dance']
  },
  'over-shoulder-look-couple': {
    id: 'over-shoulder-look-couple', category: 'couple', name: 'Over Shoulder Look',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands slightly behind and to the side of the other, resting a chin near the shoulder while both look toward the camera at slightly different angles.',
    tip: 'Stagger the heights and turn each face a touch differently to avoid a flat, mirrored look.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['portrait', 'beginner', 'couple']
  },
  'piggyback-couple': {
    id: 'piggyback-couple', category: 'couple', name: 'Piggyback Ride',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'One partner climbs onto the other\'s back for a piggyback, arms wrapped around the neck and legs secured at the hips. Both laugh or smile candidly for the camera.',
    tip: 'Have the carrying partner take a genuine step forward — the motion makes the moment feel alive rather than posed.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['playful', 'intermediate', 'couple', 'candid']
  },
  'forehead-touch-hands-held': {
    id: 'forehead-touch-hands-held', category: 'couple', name: 'Forehead Touch Hands Held',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Face each other, touch foreheads gently, and clasp both hands together between your bodies at chest height. Eyes closed or softly downcast for intimacy.',
    tip: 'Keep a small gap between your bodies so the clasped hands remain visible between you in the frame.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['romantic', 'beginner', 'couple', 'intimate']
  },
  'cheek-to-cheek': {
    id: 'cheek-to-cheek', category: 'couple', name: 'Cheek to Cheek',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand or sit close together and press cheeks gently together while both face the camera with warm smiles. A classic, joyful double-portrait pose.',
    tip: 'Tilt both heads very slightly toward each other rather than pressing flat — it looks more natural and less forced.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['warm', 'beginner', 'couple', 'classic']
  },
  'shoulder-to-shoulder': {
    id: 'shoulder-to-shoulder', category: 'couple', name: 'Shoulder to Shoulder',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand side by side with shoulders touching, arms around each other\'s backs. Both face the camera directly with relaxed, natural postures.',
    tip: 'Angling both bodies slightly inward toward each other feels warmer than standing perfectly parallel.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['friendly', 'beginner', 'couple', 'front']
  },
  'whisper-ear': {
    id: 'whisper-ear', category: 'couple', name: 'Whisper in Ear',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner leans in close to whisper something in the other\'s ear, who reacts with a genuine smile or laugh. Captures a candid, secretive, intimate moment.',
    tip: 'Have the whispering partner actually say something funny — real reactions always beat performed ones.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['candid', 'beginner', 'couple', 'playful']
  },
  'lead-dance-hand': {
    id: 'lead-dance-hand', category: 'couple', name: 'Lead Dance Hand',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'One partner extends a hand to lead the other into a spin or step, arms extended and connected only at the fingertips. Both bodies angled dynamically apart.',
    tip: 'The connection at just the fingertips creates elegant negative space between the two bodies — don\'t let hands overlap fully.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['elegant', 'intermediate', 'couple', 'dance']
  },
  'one-holds-other-waist': {
    id: 'one-holds-other-waist', category: 'couple', name: 'One Holds Other Waist',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands behind, wrapping both arms around the other\'s waist from behind, chin resting on their shoulder. The front partner rests hands over the encircling arms.',
    tip: 'The front partner should lean back slightly into the embrace to visually close the gap between both bodies.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['warm', 'beginner', 'couple', 'intimate']
  },
  'seated-together-back': {
    id: 'seated-together-back', category: 'couple', name: 'Seated Together Back to Back',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Static',
    instructions: 'Sit on the ground back-to-back, spines gently touching, each with knees drawn up or legs extended in their own direction. A calm, supportive dual portrait.',
    tip: 'Have both partners press back gently into each other for real, visible weight-sharing contact.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['calm', 'beginner', 'couple', 'floor']
  },
  'side-by-side-lean': {
    id: 'side-by-side-lean', category: 'couple', name: 'Side by Side Lean',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand or sit side by side and lean your heads together at the top, bodies staying upright and separate below. A sweet, minimal gesture of closeness.',
    tip: 'This subtle pose works beautifully in wide shots where the environment plays a large supporting role.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['sweet', 'beginner', 'couple', 'minimal']
  },
  'romantic-reach': {
    id: 'romantic-reach', category: 'couple', name: 'Romantic Reach',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'One partner reaches out to touch the other\'s face or extended hand while both bodies are angled apart mid-step, as if drawn together across a distance.',
    tip: 'A few real steps toward each other before the shutter captures a much more genuine reaching gesture.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['romantic', 'intermediate', 'couple', 'editorial']
  },
  'hand-in-hand-walk-couple': {
    id: 'hand-in-hand-walk-couple', category: 'couple', name: 'Hand in Hand Walk',
    difficulty: 'Beginner', angle: 'Side', intent: 'Social', effort: 'Active',
    instructions: 'Walk side by side with fingers interlaced, both mid-stride and looking ahead or at each other. A warm, story-telling walking portrait.',
    tip: 'Walk several real steps in a loop and shoot continuously — natural gait always outperforms a frozen fake stride.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['candid', 'beginner', 'couple', 'motion']
  },
  'nose-to-nose': {
    id: 'nose-to-nose', category: 'couple', name: 'Nose to Nose',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Stand close facing each other with noses nearly touching, eyes locked or closed, small smiles playing at the lips. A playful, tender close-up moment.',
    tip: 'Leave a tiny gap between noses rather than pressing fully together to avoid distorting both faces in close-up.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['tender', 'beginner', 'couple', 'close-up']
  },
  'both-look-camera-hold-hands': {
    id: 'both-look-camera-hold-hands', category: 'couple', name: 'Both Look Camera Hold Hands',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand side by side facing the camera directly, hands clasped together and held slightly forward or at your sides. Simple, warm, classic couple portrait.',
    tip: 'A slight body angle toward each other, even while facing camera, keeps the pose from feeling too rigid.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['classic', 'beginner', 'couple', 'front']
  },
  'one-leans-other-stands': {
    id: 'one-leans-other-stands', category: 'couple', name: 'One Leans Other Stands',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands upright and steady while the other leans their body weight gently against them, head resting on a shoulder or chest. A trusting, relaxed dynamic.',
    tip: 'The standing partner should widen their stance slightly to comfortably support the leaning weight.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['trusting', 'beginner', 'couple', 'relaxed']
  },
  'facing-away-hold': {
    id: 'facing-away-hold', category: 'couple', name: 'Facing Away Hold',
    difficulty: 'Intermediate', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Both partners face away from the camera while holding hands, walking or standing together looking out at a view. An anonymous, story-driven silhouette shot.',
    tip: 'Backlighting or golden hour light works especially well with this pose since faces aren\'t the focal point.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['editorial', 'intermediate', 'couple', 'silhouette']
  },
  'partners-lean': {
    id: 'partners-lean', category: 'couple', name: 'Partners Lean',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Stand back to back and both lean into each other for mutual support, arms crossed or hands in pockets. A cool, confident, symmetrical duo stance.',
    tip: 'Matching expressions and postures make this symmetrical pose feel intentional rather than incidental.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['confident', 'beginner', 'couple', 'symmetrical']
  },
  'together-arms-up': {
    id: 'together-arms-up', category: 'couple', name: 'Together Arms Up',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Stand side by side and throw all four arms up together in a joint celebratory gesture, jumping slightly if energy allows. A joyful, high-energy duo shot.',
    tip: 'Count down together out loud before jumping — synchronized timing makes the celebratory gesture land together.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['joyful', 'intermediate', 'couple', 'celebratory']
  },
  'sitting-one-standing-one': {
    id: 'sitting-one-standing-one', category: 'couple', name: 'Sitting One Standing One',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'One partner sits on a chair, step, or ledge while the other stands close beside or behind them, a hand resting on their shoulder. Creates natural height variation.',
    tip: 'Height variation between two people automatically produces a more dynamic composition than standing side by side.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['dynamic', 'beginner', 'couple', 'composition']
  },
  'cradled-from-behind': {
    id: 'cradled-from-behind', category: 'couple', name: 'Cradled From Behind',
    difficulty: 'Beginner', angle: 'Side', intent: 'Photography', effort: 'Static',
    instructions: 'One partner stands behind, wrapping arms fully around the other\'s shoulders and chest in a protective cradle. The front partner tilts their head back to rest against them.',
    tip: 'The front partner closing their eyes and relaxing fully into the hold sells the trust and comfort of the pose.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['tender', 'beginner', 'couple', 'intimate']
  },
  'seated-one-stands-behind': {
    id: 'seated-one-stands-behind', category: 'couple', name: 'Seated One Stands Behind',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'One partner sits while the other stands directly behind, leaning forward to rest arms around their shoulders or drape over the chair back. Both look toward camera.',
    tip: 'The standing partner leaning in fills the gap between the two heads, creating a tighter, more connected composition.',
    joints: {},
    color: 'rgba(201,162,76,0.15)', figure: 'couple-embrace',
    tags: ['editorial', 'beginner', 'couple', 'composition']
  },

  // ══════════════ ACCESSIBLE (30) ══════════════
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
  },
  'chair-seated-look-up': {
    id: 'chair-seated-look-up', category: 'accessible', name: 'Chair Look Up',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'From a seated position, tilt the chin upward and gaze toward the light source, letting the neck lengthen. Rest both hands calmly on the armrests.',
    tip: 'Angling the face up toward a window or key light softens shadows and brightens the eyes beautifully.',
    joints: { neck: -20, leftShoulder: -6, rightShoulder: -6 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['portrait', 'beginner', 'accessible']
  },
  'chair-lean-side': {
    id: 'chair-lean-side', category: 'accessible', name: 'Chair Lean Side',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'From a seated position, lean the upper torso to one side, resting a forearm along the chair\'s armrest. Let the opposite shoulder lift slightly for a relaxed diagonal line.',
    tip: 'Leading the lean with the ribcage rather than just the shoulder creates a more elegant, fluid diagonal.',
    joints: { spine: 18, leftElbow: 90, rightShoulder: -6 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['relaxed', 'beginner', 'accessible']
  },
  'chair-arms-crossed': {
    id: 'chair-arms-crossed', category: 'accessible', name: 'Chair Arms Crossed',
    difficulty: 'Beginner', angle: 'Front', intent: 'Photography', effort: 'Static',
    instructions: 'Sit upright and cross both arms loosely at chest height, resting rather than gripping. Add a slight head tilt for warmth and keep the shoulders relaxed and down.',
    tip: 'Loosely resting hands on the opposite forearms — not gripping — keeps the pose confident rather than defensive.',
    joints: { leftElbow: 100, rightElbow: 100, neck: -6 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['confident', 'beginner', 'accessible']
  },
  'chair-forward-elbows': {
    id: 'chair-forward-elbows', category: 'accessible', name: 'Chair Forward Elbows',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Lean the torso forward from the hips and rest both elbows on the armrests or a nearby table. Keep the spine long through the lean and the gaze direct and engaged.',
    tip: 'Hinge from the hips, not the upper back, to keep the chest open and the posture confident while leaning in.',
    joints: { spine: -16, leftElbow: 90, rightElbow: 90, neck: -4 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['engaged', 'beginner', 'accessible', 'editorial']
  },
  'chair-reach-diagonal': {
    id: 'chair-reach-diagonal', category: 'accessible', name: 'Chair Reach Diagonal',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Artistic', effort: 'Active',
    instructions: 'Reach one arm out diagonally across the body and slightly upward, following the line with your gaze. Let the torso rotate gently into the reach for a dynamic diagonal.',
    tip: 'Extend fully through the fingertips, not just the arm — full extension reads as far more intentional in stills.',
    joints: { leftShoulder: -100, spine: 12, neck: -8 },
    color: 'rgba(76,175,125,0.15)', figure: 'dynamic-reach',
    tags: ['dynamic', 'intermediate', 'accessible', 'artistic']
  },
  'chair-arms-overhead': {
    id: 'chair-arms-overhead', category: 'accessible', name: 'Chair Arms Overhead',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Raise both arms straight overhead, letting the ribcage lift and the chest open wide. A bold, expansive upper-body silhouette from a seated base.',
    tip: 'Keep a soft bend in both elbows overhead — fully locked arms photograph as stiff even in an expressive gesture.',
    joints: { leftShoulder: -170, rightShoulder: -170, spine: -10, neck: -6 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['expressive', 'beginner', 'accessible', 'artistic']
  },
  'chair-look-over-shoulder': {
    id: 'chair-look-over-shoulder', category: 'accessible', name: 'Chair Look Over Shoulder',
    difficulty: 'Beginner', angle: 'Back', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn the upper torso away from the camera and look back over one shoulder toward the lens. Rest one hand on the back of the chair for the twist.',
    tip: 'Lead the turn with your eyes, then let the shoulders follow — a sequential twist looks far more natural than a flat rotation.',
    joints: { spine: 22, neck: 30 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['editorial', 'beginner', 'accessible', 'back']
  },
  'chair-profile-strong': {
    id: 'chair-profile-strong', category: 'accessible', name: 'Chair Profile Strong',
    difficulty: 'Beginner', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn completely to the side in profile, chin lifted slightly and shoulders squared. Rest both hands calmly in your lap or on the armrests.',
    tip: 'A clean profile depends on posture — lengthen the spine and pull the chin back and up, not just up.',
    joints: { neck: -8, spine: 0 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['editorial', 'beginner', 'accessible', 'profile']
  },
  'chair-reach-floor': {
    id: 'chair-reach-floor', category: 'accessible', name: 'Chair Reach Floor',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Lean forward and reach one arm down toward the floor beside the chair, torso following the reach. The opposite hand can rest on the armrest for balance.',
    tip: 'Keep the reaching arm relaxed rather than straining for maximum distance — the gesture should look effortless.',
    joints: { spine: -25, leftShoulder: -80, neck: -12 },
    color: 'rgba(76,175,125,0.15)', figure: 'dynamic-reach',
    tags: ['dynamic', 'intermediate', 'accessible']
  },
  'chair-stretch-arms-back': {
    id: 'chair-stretch-arms-back', category: 'accessible', name: 'Chair Stretch Arms Back',
    difficulty: 'Beginner', angle: 'Side', intent: 'Artistic', effort: 'Static',
    instructions: 'Reach both arms behind the chair back and clasp the hands together, opening the chest wide and lifting the chin. A strong, open stretch through the shoulders.',
    tip: 'Draw the shoulder blades together as the arms reach back — it creates a fuller, more confident chest opening.',
    joints: { leftShoulder: 20, rightShoulder: 20, spine: -10, neck: -8 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['open', 'beginner', 'accessible', 'artistic']
  },
  'chair-self-hug': {
    id: 'chair-self-hug', category: 'accessible', name: 'Chair Self Hug',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Wrap both arms around your own torso in a gentle self-hug, shoulders relaxed and head tilted slightly. A tender, introspective seated moment.',
    tip: 'Closing the eyes softly and tucking the chin slightly deepens the intimate, self-soothing quality of the pose.',
    joints: { leftElbow: 130, rightElbow: 130, neck: 10 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['tender', 'beginner', 'accessible', 'social']
  },
  'chair-turn-twist': {
    id: 'chair-turn-twist', category: 'accessible', name: 'Chair Turn Twist',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Static',
    instructions: 'Rotate the torso fully to one side while the lower body stays facing forward, one arm resting across the body and the other opening outward. A dynamic spinal rotation.',
    tip: 'Keep the hips anchored throughout the twist — isolating the rotation to the torso creates the most flattering line.',
    joints: { spine: 26, leftShoulder: 30, rightShoulder: -50 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['dynamic', 'intermediate', 'accessible', 'editorial']
  },
  'chair-face-frame': {
    id: 'chair-face-frame', category: 'accessible', name: 'Chair Face Frame',
    difficulty: 'Intermediate', angle: 'Front', intent: 'Editorial', effort: 'Static',
    instructions: 'Bring both hands up to loosely frame either side of your face without touching it, elbows out and relaxed. Keep the fingers soft and slightly spread.',
    tip: 'Leaving a small gap between the hands and the face avoids distorting the cheeks while still framing the eyes.',
    joints: { leftElbow: 120, rightElbow: 120, neck: -4 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['editorial', 'intermediate', 'accessible', 'beauty']
  },
  'chair-triumphant-arms': {
    id: 'chair-triumphant-arms', category: 'accessible', name: 'Chair Triumphant Arms',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Active',
    instructions: 'Throw both arms up into a wide V above your head in a moment of celebration, chest lifted and face bright with genuine joy.',
    tip: 'A real small upward push through the chest right as the arms lift produces a much more authentic burst of energy.',
    joints: { leftShoulder: -160, rightShoulder: -160, spine: -10, neck: 8 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['joyful', 'beginner', 'accessible', 'celebratory']
  },
  'chair-chin-tilt': {
    id: 'chair-chin-tilt', category: 'accessible', name: 'Chair Chin Tilt',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Sit centered and tilt your head gently toward one shoulder, keeping the body square to the camera. Add a soft, warm smile for a friendly, approachable look.',
    tip: 'A slight tilt reads as warm; too much reads as quizzical — keep it under 15 degrees for the most natural effect.',
    joints: { neck: 16 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['friendly', 'beginner', 'accessible', 'social']
  },
  'chair-wave': {
    id: 'chair-wave', category: 'accessible', name: 'Chair Wave',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Active',
    instructions: 'Raise one hand in a warm, open waving gesture at shoulder height, fingers relaxed and slightly spread. Let a genuine smile accompany the wave.',
    tip: 'A slight wrist motion captured mid-wave feels far more welcoming than a static, frozen hand position.',
    joints: { leftShoulder: -90, leftElbow: 60, neck: -4 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['welcoming', 'beginner', 'accessible', 'social']
  },
  'chair-point-gesture': {
    id: 'chair-point-gesture', category: 'accessible', name: 'Chair Point Gesture',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Extend one arm forward with a confident pointing gesture, as if directing attention or making a strong statement. Keep the gaze aligned with the pointing direction.',
    tip: 'Extending fully through the fingertip, rather than a bent, casual point, makes the gesture read as far more deliberate.',
    joints: { leftShoulder: -80, leftElbow: -10, spine: 6 },
    color: 'rgba(76,175,125,0.15)', figure: 'dynamic-reach',
    tags: ['confident', 'intermediate', 'accessible', 'editorial']
  },
  'chair-hair-touch': {
    id: 'chair-hair-touch', category: 'accessible', name: 'Chair Hair Touch',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Photography', effort: 'Static',
    instructions: 'Bring one hand up to gently tuck or touch your hair near the temple, elbow lifted and relaxed. A soft, candid, self-assured gesture.',
    tip: 'A light touch, rather than a deliberate hair-styling motion, keeps the gesture looking spontaneous.',
    joints: { leftShoulder: -80, leftElbow: 90, neck: -6 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['candid', 'beginner', 'accessible']
  },
  'chair-thinking-pose': {
    id: 'chair-thinking-pose', category: 'accessible', name: 'Chair Thinking Pose',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Artistic', effort: 'Static',
    instructions: 'Rest an elbow on the armrest and bring a loose fist up to rest against your chin or cheek, gazing thoughtfully off to the side.',
    tip: 'A loose fist under the chin reads as playful, while an open palm reads as contemplative — pick based on your desired mood.',
    joints: { leftElbow: 95, neck: -12 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['thoughtful', 'beginner', 'accessible', 'artistic']
  },
  'chair-laugh-gesture': {
    id: 'chair-laugh-gesture', category: 'accessible', name: 'Chair Laugh Gesture',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Sudden-Free',
    instructions: 'Throw the head back slightly in genuine laughter, one hand resting near the chest or covering part of the mouth. A joyful, candid, unguarded moment.',
    tip: 'A real joke or funny prompt right before the shutter captures far more authentic laughter than asking someone to fake it.',
    joints: { neck: 18, leftElbow: 100 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['joyful', 'beginner', 'accessible', 'candid']
  },
  'chair-both-arms-wide': {
    id: 'chair-both-arms-wide', category: 'accessible', name: 'Chair Both Arms Wide',
    difficulty: 'Beginner', angle: 'Front', intent: 'Social', effort: 'Static',
    instructions: 'Open both arms wide to the sides at shoulder height, palms up, in a warm, welcoming gesture. Keep the chest lifted and the expression open.',
    tip: 'An open palm gesture reads as inviting — keep the fingers relaxed rather than stiffly extended.',
    joints: { leftShoulder: -80, rightShoulder: -80 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['welcoming', 'beginner', 'accessible', 'social']
  },
  'chair-lean-back-casual': {
    id: 'chair-lean-back-casual', category: 'accessible', name: 'Chair Lean Back Casual',
    difficulty: 'Beginner', angle: '3/4 View', intent: 'Social', effort: 'Static',
    instructions: 'Lean back comfortably into the chair, letting the backrest fully support the spine. Rest both hands loosely on the armrests and relax the shoulders down.',
    tip: 'Uncrossing the arms and opening the hands slightly keeps this relaxed lean from reading as closed-off.',
    joints: { spine: 14, leftElbow: 95, rightElbow: 95, neck: 4 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['relaxed', 'beginner', 'accessible']
  },
  'chair-meditation': {
    id: 'chair-meditation', category: 'accessible', name: 'Chair Meditation',
    difficulty: 'Beginner', angle: 'Front', intent: 'Artistic', effort: 'Static',
    instructions: 'Sit with hands resting palm-up on your knees or thighs, eyes closed softly, chin level. A calm, grounded, meditative upper-body posture.',
    tip: 'Roll the shoulders down and back before settling — tension in the shoulders breaks the calm illusion instantly.',
    joints: { spine: 0, leftShoulder: -6, rightShoulder: -6, neck: -2 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['calm', 'beginner', 'accessible', 'meditative']
  },
  'chair-dramatic-reach': {
    id: 'chair-dramatic-reach', category: 'accessible', name: 'Chair Dramatic Reach',
    difficulty: 'Intermediate', angle: '3/4 View', intent: 'Editorial', effort: 'Active',
    instructions: 'Reach one arm powerfully upward and outward while the torso leans into the gesture, gaze following the reaching hand. A dynamic, editorial upper-body moment.',
    tip: 'Extend fully through the shoulder blade, not just the hand, for a reach that reads as powerful rather than tentative.',
    joints: { leftShoulder: -130, spine: -12, neck: -10 },
    color: 'rgba(76,175,125,0.15)', figure: 'dynamic-reach',
    tags: ['dynamic', 'intermediate', 'accessible', 'editorial']
  },
  'chair-editorial-profile': {
    id: 'chair-editorial-profile', category: 'accessible', name: 'Chair Editorial Profile',
    difficulty: 'Intermediate', angle: 'Side', intent: 'Editorial', effort: 'Static',
    instructions: 'Turn fully to the side in a sharp profile, one hand resting elegantly along the jaw or neck. Lift the chin slightly for a striking, editorial silhouette.',
    tip: 'Precise alignment is everything in profile shots — check that the shoulders are truly perpendicular to the lens.',
    joints: { leftElbow: 100, neck: -10 },
    color: 'rgba(76,175,125,0.15)', figure: 'upper-body',
    tags: ['editorial', 'intermediate', 'accessible', 'profile']
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
