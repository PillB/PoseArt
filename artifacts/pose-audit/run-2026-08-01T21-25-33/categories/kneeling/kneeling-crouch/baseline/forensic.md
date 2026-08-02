# Forensic Baseline — kneeling-crouch
- name: Kneeling Crouch
- category: kneeling | difficulty: Intermediate | angle: 3/4 View
- instructions: Sit back on the heels and open both arms wide to the sides at shoulder height, palms up in a welcoming gesture. Keep the chest lifted, fingers relaxed rather than stiffly extended.
- tip: Keep the fingers relaxed, not stiffly extended — an open palm alone reads as inviting.

## Raw joint config
```json
{
  "spine": -6,
  "neck": -6,
  "leftElbow": 81,
  "rightShoulder": -12,
  "rightElbow": 18,
  "leftHip": 60,
  "leftKnee": 120,
  "leftAnkle": -35,
  "rightHip": 60,
  "rightKnee": 90,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -6,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch -6° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -6,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -6° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 22.9,
    "shoulder_sagittal_flexion_deg": 6,
    "elbow_flexion_deg": 29.3,
    "forearm_forward_deg": 21.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~23°; elbow bent ~29°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.9,
    "shoulder_sagittal_flexion_deg": 6.7,
    "elbow_flexion_deg": 10.7,
    "forearm_forward_deg": 17.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 60,
    "hip_abduction_deg": -15.7,
    "knee_flexion_deg": 117.4,
    "foot_forward_deg": -158.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~60°; knee deeply bent (~117°)."
  },
  "right_leg": {
    "hip_flexion_deg": 60,
    "hip_abduction_deg": -15.7,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": 171.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~60°; knee ~right-angle (89°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.384,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.337,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.034,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.337,
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
| auto | true | 104.99549999999974 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -6° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -6° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~23°; elbow bent ~29°.
- R arm: Right arm: arm abducted ~35°; elbow straight.
- L leg: Left leg: thigh forward ~60°; knee deeply bent (~117°).
- R leg: Right leg: thigh forward ~60°; knee ~right-angle (89°).
- Balance: COM over foot support base. (floating=true)