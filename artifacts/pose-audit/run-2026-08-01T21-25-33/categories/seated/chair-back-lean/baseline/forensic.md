# Forensic Baseline — chair-back-lean
- name: Chair Back Lean
- category: seated | difficulty: Beginner | angle: 3/4 View
- instructions: Sit fully back into the chair, letting the backrest support the spine, with both feet planted flat and ankles uncrossed. Rest both hands loosely on the armrests or thighs and relax the shoulders.
- tip: Uncross the ankles and plant both feet flat — it grounds the pose and avoids a slouched read.

## Raw joint config
```json
{
  "spine": -5,
  "neck": -4.4,
  "leftElbow": 95,
  "rightElbow": 95,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "rightShoulder": -12,
  "shoulderFwdL": 12,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -5,
    "yaw_deg": 0,
    "roll_deg": -4.4,
    "description": "Head pitch -5° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -5,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 23.3,
    "shoulder_sagittal_flexion_deg": -0.1,
    "elbow_flexion_deg": 32.8,
    "forearm_forward_deg": 21,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~23°; elbow bent ~33°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 33.8,
    "shoulder_sagittal_flexion_deg": 12.3,
    "elbow_flexion_deg": 49,
    "forearm_forward_deg": 30.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~34°; elbow bent ~49°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -148.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -148.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.512,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.512,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.029,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.512,
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
| auto | true | 91.49552999999986 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -5° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~23°; elbow bent ~33°.
- R arm: Right arm: arm abducted ~34°; elbow bent ~49°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)