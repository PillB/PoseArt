# Forensic Baseline — lounger-recline
- name: Lounger Recline
- category: seated | difficulty: Beginner | angle: Side
- instructions: Settle into a reclined lounger with legs extended and crossed at the ankle. Rest one arm along the back cushion and the other in the lap, tilting the chin down slightly to soften the face.
- tip: Tilt the chin down slightly at this recline angle — it keeps the face from looking strained upward.

## Raw joint config
```json
{
  "globalTilt": 40,
  "spine": -8,
  "leftElbow": 65,
  "rightElbow": 45,
  "hipAbductL": 10,
  "hipAbductR": -10,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 30,
  "rightKnee": 20,
  "rightShoulder": -12,
  "neck": -6,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 32,
    "yaw_deg": 0,
    "roll_deg": -7,
    "description": "Head pitch 32° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 32,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 32° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -32.7,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -33° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 28.1,
    "shoulder_sagittal_flexion_deg": -35,
    "elbow_flexion_deg": 25.1,
    "forearm_forward_deg": -18.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~28°; shoulder extended ~35° behind; elbow bent ~25°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 37.1,
    "shoulder_sagittal_flexion_deg": -27.7,
    "elbow_flexion_deg": 25.7,
    "forearm_forward_deg": -9.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~37°; shoulder extended ~28° behind; elbow bent ~26°."
  },
  "left_leg": {
    "hip_flexion_deg": 40,
    "hip_abduction_deg": -13,
    "knee_flexion_deg": 29.5,
    "foot_forward_deg": 126.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~40°; knee bent ~30°."
  },
  "right_leg": {
    "hip_flexion_deg": 40,
    "hip_abduction_deg": 13,
    "knee_flexion_deg": 20,
    "foot_forward_deg": 116.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~40°; knee bent ~20°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.341,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.43,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.252,
    "foot_x_range": [
      -0.009,
      0.332
    ],
    "over_support": true,
    "feet_min_y": -0.43,
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
| auto | true | 100.00000000000001 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 32° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 32° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -33° (low confidence).
- L arm: Left arm: arm abducted ~28°; shoulder extended ~35° behind; elbow bent ~25°.
- R arm: Right arm: arm abducted ~37°; shoulder extended ~28° behind; elbow bent ~26°.
- L leg: Left leg: thigh forward ~40°; knee bent ~30°.
- R leg: Right leg: thigh forward ~40°; knee bent ~20°.
- Balance: COM over foot support base. (floating=false)