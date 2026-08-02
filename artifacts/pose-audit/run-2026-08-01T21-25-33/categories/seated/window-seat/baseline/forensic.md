# Forensic Baseline — window-seat
- name: Window Seat
- category: seated | difficulty: Beginner | angle: Side
- instructions: Draw both knees up toward the chest and wrap both arms around the shins, interlacing the fingers. Rest the chin or cheek on top of the knees and let the gaze soften for an intimate, contemplative mood.
- tip: Drop one shoulder toward the knees — it softens the silhouette with a gentle diagonal curve.

## Raw joint config
```json
{
  "spine": 10,
  "neck": 15,
  "leftElbow": 65,
  "rightElbow": 45,
  "hipAbductL": 10,
  "hipAbductR": 25,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 100,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 10.3,
    "yaw_deg": 0,
    "roll_deg": 15,
    "description": "Head pitch 10° (+: forward/down), roll 15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 10,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 10° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 21.9,
    "shoulder_sagittal_flexion_deg": -12.8,
    "elbow_flexion_deg": 24.2,
    "forearm_forward_deg": 12.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; elbow bent ~24°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 35.7,
    "shoulder_sagittal_flexion_deg": -7.8,
    "elbow_flexion_deg": 24.9,
    "forearm_forward_deg": 20.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~36°; elbow bent ~25°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -45.4,
    "knee_flexion_deg": 87.8,
    "foot_forward_deg": -133.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (88°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -69.6,
    "knee_flexion_deg": 86.7,
    "foot_forward_deg": -121.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (87°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.479,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.427,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.057,
    "foot_x_range": [
      -0.341,
      0.111
    ],
    "over_support": true,
    "feet_min_y": 0.427,
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
| auto | true | 92.99700000000003 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 10° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 10° (+: forward/down), roll 15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; elbow bent ~24°.
- R arm: Right arm: arm abducted ~36°; elbow bent ~25°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (88°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (87°).
- Balance: COM over foot support base. (floating=true)