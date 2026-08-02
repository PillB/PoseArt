# Forensic Baseline — kneeling-hand-floor
- name: Kneeling Hand Floor
- category: kneeling | difficulty: Intermediate | angle: Side
- instructions: Kneel with both knees down, sitting upright, and cross both arms loosely over the chest. Lean a few degrees forward from the hips, keeping shoulders relaxed and chin level.
- tip: Add a slight forward lean from the hips — it keeps the kneel from looking too rigid and formal.

## Raw joint config
```json
{
  "spine": 20,
  "neck": -6,
  "leftShoulder": -10,
  "leftElbow": 70,
  "rightShoulder": 8,
  "rightElbow": 50,
  "leftKnee": 5,
  "rightHip": 70,
  "rightKnee": 80,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 20.1,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch 20° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 20,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 34.1,
    "shoulder_sagittal_flexion_deg": -21.9,
    "elbow_flexion_deg": 39.6,
    "forearm_forward_deg": 24,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~34°; shoulder extended ~22° behind; elbow bent ~40°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 16.1,
    "shoulder_sagittal_flexion_deg": -19.1,
    "elbow_flexion_deg": 17.8,
    "forearm_forward_deg": -2.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~16°; shoulder extended ~19° behind; elbow bent ~18°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 5.6,
    "foot_forward_deg": 61.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 78.8,
    "foot_forward_deg": -153.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee ~right-angle (79°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.856,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.391,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.113,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.856,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 104.99550000000006 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 20° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~34°; shoulder extended ~22° behind; elbow bent ~40°.
- R arm: Right arm: arm abducted ~16°; shoulder extended ~19° behind; elbow bent ~18°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=false)