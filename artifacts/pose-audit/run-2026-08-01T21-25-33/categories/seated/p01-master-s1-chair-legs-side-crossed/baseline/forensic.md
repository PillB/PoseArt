# Forensic Baseline — p01-master-s1-chair-legs-side-crossed
- name: Chair Sit Legs Extended Side Crossed
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit on the chair with both legs extended to the side. Bend one knee and cross the legs at the shin, pointing both feet. Rest arms asymmetrically on the armrests. Drop shoulders and face the camera directly.
- tip: Cross ankles rather than stacking knees to keep the leg line elongated; keep shoulders dropped away from ears to avoid tension in the neck.

## Raw joint config
```json
{
  "spine": 6,
  "neck": -6,
  "hips": 0,
  "globalTilt": 0,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -25,
  "rightShoulder": -30,
  "leftElbow": 85,
  "rightElbow": 80,
  "shoulderFwdL": 10,
  "shoulderFwdR": 10,
  "leftHip": 55,
  "rightHip": 70,
  "leftKnee": 60,
  "rightKnee": 30,
  "leftAnkle": 10,
  "rightAnkle": 8,
  "hipAbductL": 8,
  "hipAbductR": -15
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 6,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch 6° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 6,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 6° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 46.8,
    "shoulder_sagittal_flexion_deg": -18.5,
    "elbow_flexion_deg": 59.1,
    "forearm_forward_deg": 43.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~47°; shoulder extended ~19° behind; elbow bent ~59°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 51.9,
    "shoulder_sagittal_flexion_deg": -21.2,
    "elbow_flexion_deg": 60.7,
    "forearm_forward_deg": 47.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~52°; shoulder extended ~21° behind; elbow bent ~61°."
  },
  "left_leg": {
    "hip_flexion_deg": 55,
    "hip_abduction_deg": -13.8,
    "knee_flexion_deg": 59.2,
    "foot_forward_deg": -178.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~55°; knee bent ~59°."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": 38.1,
    "knee_flexion_deg": 29.3,
    "foot_forward_deg": 165.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; abducted ~38° outward; knee bent ~29°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.124,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.117,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.034,
    "foot_x_range": [
      -0.041,
      0.411
    ],
    "over_support": true,
    "feet_min_y": 0.117,
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
| auto | true | 91.49103000000001 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 6° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 6° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~47°; shoulder extended ~19° behind; elbow bent ~59°.
- R arm: Right arm: arm abducted ~52°; shoulder extended ~21° behind; elbow bent ~61°.
- L leg: Left leg: thigh forward ~55°; knee bent ~59°.
- R leg: Right leg: thigh forward ~70°; abducted ~38° outward; knee bent ~29°.
- Balance: COM over foot support base. (floating=true)