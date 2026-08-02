# Forensic Baseline — kneeling-sit-between-heels
- name: Sit Between Heels
- category: kneeling | difficulty: Intermediate | angle: 3/4 View
- instructions: Kneel with both knees down and raise both arms straight overhead in a wide V, chest lifted and open. Keep a soft bend in the elbows for a bold, symmetrical, celebratory shape.
- tip: Keep a soft bend in the elbows overhead — fully locked arms photograph stiff even in a joyful pose.

## Raw joint config
```json
{
  "spine": -8,
  "neck": -8,
  "leftShoulder": -110,
  "leftElbow": 70,
  "rightShoulder": -110,
  "rightElbow": 50,
  "leftKnee": 140,
  "leftAnkle": -35,
  "rightHip": 70,
  "rightKnee": 140,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -8.1,
    "yaw_deg": 0,
    "roll_deg": -8,
    "description": "Head pitch -8° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
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
    "shoulder_abduction_deg": 133,
    "shoulder_sagittal_flexion_deg": 169.3,
    "elbow_flexion_deg": 50.8,
    "forearm_forward_deg": 130.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~133° abduction); shoulder flexed ~169° forward; elbow bent ~51°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 133,
    "shoulder_sagittal_flexion_deg": 169.3,
    "elbow_flexion_deg": 36.9,
    "forearm_forward_deg": 134.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~133° abduction); shoulder flexed ~169° forward; elbow bent ~37°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 136,
    "foot_forward_deg": 161.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee deeply bent (~136°)."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 136,
    "foot_forward_deg": -128.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee deeply bent (~136°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.077,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.352,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.046,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.077,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    },
    {
      "type": "elbow_above_shoulder",
      "side": "R",
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
| auto | true | 105.75150000000019 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -8° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~133° abduction); shoulder flexed ~169° forward; elbow bent ~51°.
- R arm: Right arm: arm overhead (~133° abduction); shoulder flexed ~169° forward; elbow bent ~37°.
- L leg: Left leg: thigh near neutral; knee deeply bent (~136°).
- R leg: Right leg: thigh forward ~70°; knee deeply bent (~136°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]