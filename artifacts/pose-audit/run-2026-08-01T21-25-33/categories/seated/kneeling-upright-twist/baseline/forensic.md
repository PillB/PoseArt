# Forensic Baseline — kneeling-upright-twist
- name: Kneeling Upright Twist
- category: seated | difficulty: Intermediate | angle: 3/4 View
- instructions: Sit back on the heels in a kneeling base and twist the ribcage to one side, planting one hand on the floor behind you for support. Look back over the opposite shoulder while hips stay squared forward.
- tip: Keep hips squared while the ribcage twists — that separation is what gives the line its editorial edge.

## Raw joint config
```json
{
  "spine": 20,
  "neck": 22,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 100,
  "rightKnee": 100,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 21.4,
    "yaw_deg": 0,
    "roll_deg": 22,
    "description": "Head pitch 21° (+: forward/down), roll 22° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
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
    "shoulder_abduction_deg": 21.8,
    "shoulder_sagittal_flexion_deg": -22.6,
    "elbow_flexion_deg": 29,
    "forearm_forward_deg": 8.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; shoulder extended ~23° behind; elbow bent ~29°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 37.4,
    "shoulder_sagittal_flexion_deg": -19.1,
    "elbow_flexion_deg": 26.8,
    "forearm_forward_deg": 14.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~37°; shoulder extended ~19° behind; elbow bent ~27°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 100,
    "foot_forward_deg": -123.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 100,
    "foot_forward_deg": -123.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.475,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.475,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.113,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.475,
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
| auto | true | 91.49706000000018 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 21° (+: forward/down), roll 22° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; shoulder extended ~23° behind; elbow bent ~29°.
- R arm: Right arm: arm abducted ~37°; shoulder extended ~19° behind; elbow bent ~27°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- Balance: COM over foot support base. (floating=true)