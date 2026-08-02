# Forensic Baseline — floor-stretch-legs
- name: Floor Stretch Legs
- category: seated | difficulty: Beginner | angle: Side
- instructions: Sit on the floor with both legs extended straight ahead, spine tall, and a soft bend left in the knees. Reach both hands forward toward the toes or rest them lightly on the shins.
- tip: Leave a soft bend in the knees — a forced, locked-straight stretch reads stiffer on camera.

## Raw joint config
```json
{
  "spine": -8,
  "leftShoulder": 10,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 100,
  "rightKnee": 100,
  "neck": -6,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -8,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch -8° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -8,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 13.8,
    "shoulder_sagittal_flexion_deg": 5.9,
    "elbow_flexion_deg": 16.1,
    "forearm_forward_deg": 13,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; elbow bent ~16°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 22.4,
    "shoulder_sagittal_flexion_deg": 10,
    "elbow_flexion_deg": 18.1,
    "forearm_forward_deg": 20.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~22°; elbow bent ~18°."
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
    "com_z": -0.046,
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
| auto | true | 90.7466400000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -8° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; elbow bent ~16°.
- R arm: Right arm: arm abducted ~22°; elbow bent ~18°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- Balance: COM over foot support base. (floating=true)