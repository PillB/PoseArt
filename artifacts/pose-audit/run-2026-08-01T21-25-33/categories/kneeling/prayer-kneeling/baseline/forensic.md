# Forensic Baseline — prayer-kneeling
- name: Prayer Kneeling
- category: kneeling | difficulty: Beginner | angle: Front
- instructions: From one knee down, extend the opposite arm dramatically forward, reaching from the shoulder blade rather than just the hand. Let the torso follow the reach into a dynamic diagonal line.
- tip: Extend from the shoulder blade, not just the hand — it's what makes the reach look powerful.

## Raw joint config
```json
{
  "spine": 18,
  "neck": 14,
  "leftElbow": 100,
  "rightElbow": 100,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 100,
  "rightKnee": 100,
  "rightShoulder": -12,
  "hipAbductL": 8,
  "hipAbductR": 8,
  "shoulderFwdL": -12,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 18.5,
    "yaw_deg": 0,
    "roll_deg": 14,
    "description": "Head pitch 19° (+: forward/down), roll 14° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 26.6,
    "shoulder_sagittal_flexion_deg": -12.7,
    "elbow_flexion_deg": 41,
    "forearm_forward_deg": 26,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~27°; elbow bent ~41°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 37.8,
    "shoulder_sagittal_flexion_deg": -13.3,
    "elbow_flexion_deg": 55.5,
    "forearm_forward_deg": 36.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~38°; elbow bent ~56°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 98.2,
    "foot_forward_deg": -123.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (98°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 98.2,
    "foot_forward_deg": -123.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (98°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.468,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.468,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.102,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.468,
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
| auto | true | 105.00000000000017 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 19° (+: forward/down), roll 14° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~27°; elbow bent ~41°.
- R arm: Right arm: arm abducted ~38°; elbow bent ~56°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (98°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (98°).
- Balance: COM over foot support base. (floating=true)