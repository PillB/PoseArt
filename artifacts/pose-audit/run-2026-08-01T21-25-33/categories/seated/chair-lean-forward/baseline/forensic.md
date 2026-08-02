# Forensic Baseline — chair-lean-forward
- name: Chair Lean
- category: seated | difficulty: Beginner | angle: 3/4 View
- instructions: Sit on the front of a chair and hinge forward from the hips, resting elbows on the knees while the spine stays long. Clasp both hands loosely between the knees or let them hang relaxed.
- tip: Hinge from the hips, not the upper back — it keeps the chest open instead of caving forward.

## Raw joint config
```json
{
  "spine": 20,
  "neck": 5,
  "leftElbow": 80,
  "rightShoulder": -12,
  "rightElbow": 80,
  "leftHip": 85,
  "leftKnee": 90,
  "rightHip": 85,
  "rightKnee": 90,
  "shoulderFwdL": 30,
  "shoulderFwdR": 30,
  "hipAbductL": 12,
  "hipAbductR": 12
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 20.1,
    "yaw_deg": 0,
    "roll_deg": 5,
    "description": "Head pitch 20° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 20,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 11.6,
    "shoulder_sagittal_flexion_deg": -28.3,
    "elbow_flexion_deg": 35.3,
    "forearm_forward_deg": 4.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder extended ~28° behind; elbow bent ~35°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 23.1,
    "shoulder_sagittal_flexion_deg": -35.8,
    "elbow_flexion_deg": 46.7,
    "forearm_forward_deg": 14.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~23°; shoulder extended ~36° behind; elbow bent ~47°."
  },
  "left_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -67.7,
    "knee_flexion_deg": 87,
    "foot_forward_deg": -128.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (87°)."
  },
  "right_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -67.7,
    "knee_flexion_deg": 87,
    "foot_forward_deg": -128.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~85° (hip flexion); knee ~right-angle (87°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.507,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.507,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.113,
    "foot_x_range": [
      -0.143,
      0.143
    ],
    "over_support": true,
    "feet_min_y": 0.507,
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
| auto | true | 90.00000000000017 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 20° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; shoulder extended ~28° behind; elbow bent ~35°.
- R arm: Right arm: arm abducted ~23°; shoulder extended ~36° behind; elbow bent ~47°.
- L leg: Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (87°).
- R leg: Right leg: thigh forward ~85° (hip flexion); knee ~right-angle (87°).
- Balance: COM over foot support base. (floating=true)