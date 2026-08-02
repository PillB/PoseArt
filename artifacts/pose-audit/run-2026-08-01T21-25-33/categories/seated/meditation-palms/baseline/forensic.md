# Forensic Baseline — meditation-palms
- name: Meditation Palms
- category: seated | difficulty: Beginner | angle: Front
- instructions: Sit cross-legged on the floor with the backs of the hands resting on the knees, palms open and turned upward. Roll the shoulders down and back, then close the eyes softly and lift through the crown.
- tip: Roll shoulders down and back before settling — tension there breaks the calm illusion instantly.

## Raw joint config
```json
{
  "spine": -8,
  "neck": -5,
  "leftShoulder": -20,
  "rightShoulder": -32,
  "leftElbow": 100,
  "rightElbow": 100,
  "leftHip": 85,
  "rightHip": 85,
  "leftKnee": 130,
  "rightKnee": 130,
  "hipAbductL": 25,
  "hipAbductR": 25,
  "shoulderFwdL": 12,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -8,
    "yaw_deg": 0,
    "roll_deg": -5,
    "description": "Head pitch -8° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
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
    "shoulder_abduction_deg": 43.5,
    "shoulder_sagittal_flexion_deg": -1.2,
    "elbow_flexion_deg": 62.6,
    "forearm_forward_deg": 40.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~44°; elbow bent ~63°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 53.9,
    "shoulder_sagittal_flexion_deg": 25.2,
    "elbow_flexion_deg": 77.2,
    "forearm_forward_deg": 49.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~54°; shoulder flexed ~25° forward; elbow ~right-angle (77°)."
  },
  "left_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -79.4,
    "knee_flexion_deg": 108.6,
    "foot_forward_deg": -86.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (109°)."
  },
  "right_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -79.4,
    "knee_flexion_deg": 108.6,
    "foot_forward_deg": -86.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~85° (hip flexion); knee ~right-angle (109°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.311,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.311,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.046,
    "foot_x_range": [
      -0.341,
      0.341
    ],
    "over_support": true,
    "feet_min_y": 0.311,
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
| auto | true | 90.7425 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -8° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~44°; elbow bent ~63°.
- R arm: Right arm: arm abducted ~54°; shoulder flexed ~25° forward; elbow ~right-angle (77°).
- L leg: Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (109°).
- R leg: Right leg: thigh forward ~85° (hip flexion); knee ~right-angle (109°).
- Balance: COM over foot support base. (floating=true)