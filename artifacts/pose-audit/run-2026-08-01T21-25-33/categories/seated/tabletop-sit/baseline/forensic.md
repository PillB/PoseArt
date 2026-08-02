# Forensic Baseline — tabletop-sit
- name: Tabletop Sit
- category: seated | difficulty: Intermediate | angle: 3/4 View
- instructions: Sit on the edge of a table with legs dangling or crossed at the ankle. Lean back slightly onto both hands, shoulders relaxed down, and let the feet swing loosely just before the shot.
- tip: Bounce the feet gently right before the shutter — it keeps the pose from freezing into stiffness.

## Raw joint config
```json
{
  "spine": -10,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 140,
  "rightKnee": 140,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "rightShoulder": -12,
  "neck": -3.3,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -10,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch -10° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -10,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -10° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 24,
    "shoulder_sagittal_flexion_deg": 7,
    "elbow_flexion_deg": 25.9,
    "forearm_forward_deg": 22.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~24°; elbow bent ~26°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.4,
    "shoulder_sagittal_flexion_deg": 14.5,
    "elbow_flexion_deg": 26.1,
    "forearm_forward_deg": 31.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~34°; elbow bent ~26°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 139.9,
    "foot_forward_deg": -98.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee deeply bent (~140°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 139.9,
    "foot_forward_deg": -98.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee deeply bent (~140°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.319,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.319,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.057,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.319,
    "floating": true,
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
| auto | true | 92.24658000000028 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -10° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -10° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~24°; elbow bent ~26°.
- R arm: Right arm: arm abducted ~34°; elbow bent ~26°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee deeply bent (~140°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee deeply bent (~140°).
- Balance: COM over foot support base. (floating=true)