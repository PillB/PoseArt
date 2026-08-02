# Forensic Baseline — sitting-on-heels
- name: Seiza
- category: kneeling | difficulty: Beginner | angle: 3/4 View
- instructions: Kneel with both knees on the ground and the torso upright, sitting back onto the heels without collapsing. Rest the arms naturally at the sides or on the thighs for a grounded, symmetrical base.
- tip: Lengthen up through the crown to avoid sinking onto the heels and collapsing the spine.

## Raw joint config
```json
{
  "spine": -5,
  "neck": -5,
  "leftElbow": 65,
  "rightShoulder": -12,
  "rightElbow": 45,
  "leftHip": 85,
  "leftKnee": 100,
  "leftAnkle": -35,
  "rightHip": 85,
  "rightKnee": 100,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -5,
    "yaw_deg": 0,
    "roll_deg": -5,
    "description": "Head pitch -5° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
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
    "shoulder_abduction_deg": 22.9,
    "shoulder_sagittal_flexion_deg": 5,
    "elbow_flexion_deg": 24,
    "forearm_forward_deg": 20.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~23°; elbow bent ~24°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.9,
    "shoulder_sagittal_flexion_deg": 5.6,
    "elbow_flexion_deg": 25.2,
    "forearm_forward_deg": 27.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; elbow bent ~25°."
  },
  "left_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -58.2,
    "knee_flexion_deg": 98.2,
    "foot_forward_deg": -153.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (98°)."
  },
  "right_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -58.2,
    "knee_flexion_deg": 98.2,
    "foot_forward_deg": -153.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~85° (hip flexion); knee ~right-angle (98°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.553,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.553,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.029,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.553,
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
| auto | true | 109.49099999999996 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -5° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~23°; elbow bent ~24°.
- R arm: Right arm: arm abducted ~35°; elbow bent ~25°.
- L leg: Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (98°).
- R leg: Right leg: thigh forward ~85° (hip flexion); knee ~right-angle (98°).
- Balance: COM over foot support base. (floating=true)