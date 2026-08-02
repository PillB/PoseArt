# Forensic Baseline — cross-ankle-sit
- name: Ankle Cross
- category: seated | difficulty: Beginner | angle: 3/4 View
- instructions: Sit with both feet flat, then cross one ankle over the opposite knee into a figure-four shape. Rest a hand on the raised ankle and keep the torso lifted and open toward camera.
- tip: Angle the raised knee slightly away from camera so it doesn't block the line of the torso.

## Raw joint config
```json
{
  "spine": 4,
  "neck": -8.2,
  "leftShoulder": -20,
  "rightShoulder": -32,
  "leftElbow": 100,
  "rightElbow": 100,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 95,
  "rightKnee": 60,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "shoulderFwdL": 12,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 4,
    "yaw_deg": 0,
    "roll_deg": -8.2,
    "description": "Head pitch 4° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 4,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 4° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 41.7,
    "shoulder_sagittal_flexion_deg": -15.6,
    "elbow_flexion_deg": 61.4,
    "forearm_forward_deg": 40.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~42°; shoulder extended ~16° behind; elbow bent ~61°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 54.8,
    "shoulder_sagittal_flexion_deg": 7.8,
    "elbow_flexion_deg": 76.3,
    "forearm_forward_deg": 51.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~55°; elbow ~right-angle (76°)."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 95,
    "foot_forward_deg": -143.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (95°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 60,
    "foot_forward_deg": -178.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee bent ~60°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.51,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.441,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.023,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.441,
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
| auto | true | 91.48950000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 4° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 4° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~42°; shoulder extended ~16° behind; elbow bent ~61°.
- R arm: Right arm: arm abducted ~55°; elbow ~right-angle (76°).
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (95°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee bent ~60°.
- Balance: COM over foot support base. (floating=true)