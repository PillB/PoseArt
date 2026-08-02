# Forensic Baseline — stool-lean-back
- name: Stool Lean Back
- category: seated | difficulty: Intermediate | angle: 3/4 View
- instructions: Sit on a stool and lean the torso back, bracing weight on both hands placed flat behind you on the seat. Extend the legs loosely forward and tilt the chin up a few degrees.
- tip: Keep shoulders pulled down away from the ears even while bearing weight on the arms.

## Raw joint config
```json
{
  "spine": 15,
  "neck": -8,
  "leftElbow": 65,
  "rightElbow": 45,
  "hipAbductL": 12,
  "hipAbductR": 12,
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
    "pitch_deg": 15.1,
    "yaw_deg": 0,
    "roll_deg": -8,
    "description": "Head pitch 15° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 15,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 15° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 21.8,
    "shoulder_sagittal_flexion_deg": -17.7,
    "elbow_flexion_deg": 26.3,
    "forearm_forward_deg": 10.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; shoulder extended ~18° behind; elbow bent ~26°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 36.4,
    "shoulder_sagittal_flexion_deg": -13.4,
    "elbow_flexion_deg": 25.6,
    "forearm_forward_deg": 17.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~36°; elbow bent ~26°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -50.8,
    "knee_flexion_deg": 87,
    "foot_forward_deg": -133.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (87°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -50.8,
    "knee_flexion_deg": 87,
    "foot_forward_deg": -133.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (87°)."
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
    "com_z": 0.085,
    "foot_x_range": [
      -0.143,
      0.143
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
| auto | true | 92.24558999999992 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 15° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 15° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; shoulder extended ~18° behind; elbow bent ~26°.
- R arm: Right arm: arm abducted ~36°; elbow bent ~26°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (87°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (87°).
- Balance: COM over foot support base. (floating=true)