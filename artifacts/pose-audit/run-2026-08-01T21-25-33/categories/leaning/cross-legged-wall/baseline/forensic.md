# Forensic Baseline — cross-legged-wall
- name: Cross-Legged Wall
- category: leaning | difficulty: Beginner | angle: 3/4 View
- instructions: Lean the back flat against the wall with weight evenly distributed on both feet, then cross the ankles wide with the front foot pointed outward. Rest hands in pockets or clasped in front.
- tip: Cross the ankles wide with the front foot pointed out — narrower crosses look cramped.

## Raw joint config
```json
{
  "spine": 14,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -30,
  "rightShoulder": -12,
  "leftElbow": 100,
  "rightElbow": 100,
  "hipAbductL": 10,
  "hipAbductR": -10,
  "leftKnee": 4,
  "rightKnee": 4,
  "shoulderFwdL": 4,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 14.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 52.8,
    "shoulder_sagittal_flexion_deg": -25.5,
    "elbow_flexion_deg": 75.5,
    "forearm_forward_deg": 51.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~53°; shoulder extended ~26° behind; elbow ~right-angle (75°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 36.9,
    "shoulder_sagittal_flexion_deg": -8.7,
    "elbow_flexion_deg": 53.4,
    "forearm_forward_deg": 35.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~37°; elbow bent ~53°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -20,
    "knee_flexion_deg": 5.4,
    "foot_forward_deg": 62.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 20,
    "knee_flexion_deg": 5.5,
    "foot_forward_deg": 62.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~20° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.826,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.795,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.08,
    "foot_x_range": [
      0.161,
      0.499
    ],
    "over_support": false,
    "feet_min_y": -0.826,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49264999999991 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~53°; shoulder extended ~26° behind; elbow ~right-angle (75°).
- R arm: Right arm: arm abducted ~37°; elbow bent ~53°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; abducted ~20° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)