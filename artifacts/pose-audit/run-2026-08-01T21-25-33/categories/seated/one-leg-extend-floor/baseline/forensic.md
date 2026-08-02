# Forensic Baseline — one-leg-extend-floor
- name: One Leg Extend Floor
- category: seated | difficulty: Intermediate | angle: 3/4 View
- instructions: Sit on the floor with one leg extended straight ahead, angled slightly away from square-to-camera, and the other bent with the foot flat near the opposite knee. Plant one hand on the floor behind you and lift the chest.
- tip: Angle the extended leg slightly off-camera-square — it reads noticeably longer and leaner.

## Raw joint config
```json
{
  "spine": 8,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 100,
  "rightKnee": 90,
  "rightShoulder": -12,
  "neck": -3.3,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 8,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch 8° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 8,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 22,
    "shoulder_sagittal_flexion_deg": -10.8,
    "elbow_flexion_deg": 23.7,
    "forearm_forward_deg": 13.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; elbow bent ~24°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 35.5,
    "shoulder_sagittal_flexion_deg": -5.5,
    "elbow_flexion_deg": 24.7,
    "forearm_forward_deg": 21.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; elbow bent ~25°."
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
    "knee_flexion_deg": 90,
    "foot_forward_deg": -133.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
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
      "y": 0.489,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.046,
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
| auto | true | 89.98649999999986 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 8° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; elbow bent ~24°.
- R arm: Right arm: arm abducted ~35°; elbow bent ~25°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)