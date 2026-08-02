# Forensic Baseline — bench-sit-side
- name: Bench Sit Side
- category: seated | difficulty: Beginner | angle: Side
- instructions: Sit sideways on a bench with legs together, angled away from camera. Place both hands flat on the bench beside you, lift the chest, and leave a gap of light between the arm and torso.
- tip: Leave a gap of light between arm and torso — pressing them together compresses the waistline.

## Raw joint config
```json
{
  "spine": -2,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 95,
  "rightKnee": 95,
  "leftAnkle": -15,
  "rightAnkle": -15,
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
    "pitch_deg": -2,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch -2° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -2,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -2° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 22.9,
    "shoulder_sagittal_flexion_deg": -1,
    "elbow_flexion_deg": 23.3,
    "forearm_forward_deg": 18.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~23°; elbow bent ~23°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.6,
    "shoulder_sagittal_flexion_deg": 5.7,
    "elbow_flexion_deg": 24.8,
    "forearm_forward_deg": 27.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; elbow bent ~25°."
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
    "knee_flexion_deg": 95,
    "foot_forward_deg": -143.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (95°)."
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
      "y": 0.51,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.012,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.51,
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
| auto | true | 89.99504999999998 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -2° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -2° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~23°; elbow bent ~23°.
- R arm: Right arm: arm abducted ~35°; elbow bent ~25°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (95°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (95°).
- Balance: COM over foot support base. (floating=true)