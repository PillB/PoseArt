# Forensic Baseline — perch-edge
- name: Perch on Edge
- category: seated | difficulty: Beginner | angle: Side
- instructions: Perch lightly on the very edge of a stool with both feet planted and knees together. Keep the spine tall, shoulders relaxed, and rest both hands gently on the seat edge beside you.
- tip: Sink real weight into your feet, not just the seat — it reads as poised, not precarious.

## Raw joint config
```json
{
  "spine": 5,
  "neck": -8.8,
  "leftElbow": 65,
  "rightElbow": 45,
  "hipAbductL": 18,
  "hipAbductR": 18,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 5.1,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 5° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 5,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 22.2,
    "shoulder_sagittal_flexion_deg": -7.9,
    "elbow_flexion_deg": 23.1,
    "forearm_forward_deg": 15.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; elbow bent ~23°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 35.1,
    "shoulder_sagittal_flexion_deg": -2.1,
    "elbow_flexion_deg": 24.5,
    "forearm_forward_deg": 23.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; elbow bent ~25°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -61.9,
    "knee_flexion_deg": 83.7,
    "foot_forward_deg": -132.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (84°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -61.9,
    "knee_flexion_deg": 83.7,
    "foot_forward_deg": -132.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (84°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.462,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.462,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.029,
    "foot_x_range": [
      -0.236,
      0.236
    ],
    "over_support": true,
    "feet_min_y": 0.462,
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
| auto | true | 92.24406000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 5° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; elbow bent ~23°.
- R arm: Right arm: arm abducted ~35°; elbow bent ~25°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (84°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (84°).
- Balance: COM over foot support base. (floating=true)