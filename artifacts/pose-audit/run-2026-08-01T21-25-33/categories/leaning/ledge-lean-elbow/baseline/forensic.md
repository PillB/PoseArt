# Forensic Baseline — ledge-lean-elbow
- name: Ledge Lean Elbow
- category: leaning | difficulty: Beginner | angle: 3/4 View
- instructions: Rest a single elbow on a high ledge, letting the body angle away from it with weight shifted onto the opposite hip. Prop the chin lightly on the raised hand, fingers soft along the jaw.
- tip: A single-elbow lean feels more candid and asymmetrical than resting both elbows evenly.

## Raw joint config
```json
{
  "spine": 14,
  "hips": 16,
  "neck": -2.4,
  "leftShoulder": -30,
  "rightShoulder": -30,
  "leftElbow": 100,
  "rightElbow": 20,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftHip": 12,
  "leftKnee": 10,
  "rightKnee": 10,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 14,
    "yaw_deg": 0,
    "roll_deg": -2.4,
    "description": "Head pitch 14° (+: forward/down), roll -2° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 15.4,
    "yaw_deg": 0,
    "description": "Pelvic list 15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 53.6,
    "shoulder_sagittal_flexion_deg": -19.8,
    "elbow_flexion_deg": 75.5,
    "forearm_forward_deg": 52.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~54°; shoulder extended ~20° behind; elbow ~right-angle (75°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 54,
    "shoulder_sagittal_flexion_deg": -14.8,
    "elbow_flexion_deg": 15.6,
    "forearm_forward_deg": 10.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~54°; elbow bent ~16°."
  },
  "left_leg": {
    "hip_flexion_deg": 12,
    "hip_abduction_deg": -26.5,
    "knee_flexion_deg": 9.3,
    "foot_forward_deg": 81.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 6,
    "knee_flexion_deg": 10.3,
    "foot_forward_deg": 66.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.725,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.81,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.08,
    "foot_x_range": [
      0.162,
      0.38
    ],
    "over_support": false,
    "feet_min_y": -0.81,
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
| auto | true | 91.49346000000008 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 14° (+: forward/down), roll -2° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~54°; shoulder extended ~20° behind; elbow ~right-angle (75°).
- R arm: Right arm: arm abducted ~54°; elbow bent ~16°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)