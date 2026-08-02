# Forensic Baseline — kneeling-tuck-forward
- name: Kneeling Tuck Forward
- category: kneeling | difficulty: Beginner | angle: Side
- instructions: Drop into a low crouch with one knee nearly touching the ground and the other foot planted for balance. Rest one forearm across the raised knee, coiled and alert — a sprinter-pose-like silhouette.
- tip: This coiled stance photographs powerfully from a low angle looking slightly upward.

## Raw joint config
```json
{
  "spine": -35,
  "neck": -21,
  "leftShoulder": -120,
  "leftElbow": 70,
  "rightElbow": 50,
  "leftKnee": 138,
  "leftAnkle": -35,
  "rightHip": 70,
  "rightKnee": 138,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -36.9,
    "yaw_deg": 0,
    "roll_deg": -21,
    "description": "Head pitch -37° (+: forward/down), roll -21° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -35,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -35° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 147.2,
    "shoulder_sagittal_flexion_deg": 143.5,
    "elbow_flexion_deg": 47.5,
    "forearm_forward_deg": 136.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~147° abduction); shoulder flexed ~143° forward; elbow bent ~48°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 27.2,
    "shoulder_sagittal_flexion_deg": 35,
    "elbow_flexion_deg": 33.7,
    "forearm_forward_deg": 38.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~27°; shoulder flexed ~35° forward; elbow bent ~34°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 134.2,
    "foot_forward_deg": 159.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee deeply bent (~134°)."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 134.2,
    "foot_forward_deg": -130.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee deeply bent (~134°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.066,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.362,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.189,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.066,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 105 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -35° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -37° (+: forward/down), roll -21° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~147° abduction); shoulder flexed ~143° forward; elbow bent ~48°.
- R arm: Right arm: arm abducted ~27°; shoulder flexed ~35° forward; elbow bent ~34°.
- L leg: Left leg: thigh near neutral; knee deeply bent (~134°).
- R leg: Right leg: thigh forward ~70°; knee deeply bent (~134°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]