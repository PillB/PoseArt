# Forensic Baseline — soft-sit
- name: Soft Sit
- category: seated | difficulty: Beginner | angle: 3/4 View
- instructions: Perch on the front third of the seat rather than sinking fully back, keeping the spine tall. Lean the torso a few degrees forward from the hips and angle both knees to one side rather than square to camera.
- tip: Sitting on the front edge blocks slouching and keeps the whole silhouette reading elegant.

## Raw joint config
```json
{
  "spine": 18,
  "neck": -5,
  "leftElbow": 65,
  "rightElbow": 45,
  "hipAbductL": 20,
  "hipAbductR": 20,
  "leftHip": 85,
  "rightHip": 85,
  "leftKnee": 90,
  "rightKnee": 95,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 18.1,
    "yaw_deg": 0,
    "roll_deg": -5,
    "description": "Head pitch 18° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 21.8,
    "shoulder_sagittal_flexion_deg": -20.6,
    "elbow_flexion_deg": 27.9,
    "forearm_forward_deg": 9.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; shoulder extended ~21° behind; elbow bent ~28°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 37,
    "shoulder_sagittal_flexion_deg": -16.8,
    "elbow_flexion_deg": 26.3,
    "forearm_forward_deg": 15.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~37°; shoulder extended ~17° behind; elbow bent ~26°."
  },
  "left_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -76.5,
    "knee_flexion_deg": 82.4,
    "foot_forward_deg": -142.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (82°)."
  },
  "right_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -76.5,
    "knee_flexion_deg": 86.8,
    "foot_forward_deg": -137.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~85° (hip flexion); knee ~right-angle (87°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.513,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.506,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.102,
    "foot_x_range": [
      -0.267,
      0.267
    ],
    "over_support": true,
    "feet_min_y": 0.506,
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
| auto | true | 94.49549999999998 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 18° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; shoulder extended ~21° behind; elbow bent ~28°.
- R arm: Right arm: arm abducted ~37°; shoulder extended ~17° behind; elbow bent ~26°.
- L leg: Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (82°).
- R leg: Right leg: thigh forward ~85° (hip flexion); knee ~right-angle (87°).
- Balance: COM over foot support base. (floating=true)