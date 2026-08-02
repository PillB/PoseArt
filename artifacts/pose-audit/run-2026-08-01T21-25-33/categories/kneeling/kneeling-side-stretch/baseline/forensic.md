# Forensic Baseline — kneeling-side-stretch
- name: Kneeling Side Stretch
- category: kneeling | difficulty: Intermediate | angle: Front
- instructions: Kneel and lower the seat down between the heels rather than onto them, knees spread slightly apart. Rest hands on the thighs and keep the spine tall despite the low position.
- tip: This deep kneel demands ankle flexibility — sit only as low as stays comfortable and controlled.

## Raw joint config
```json
{
  "spine": 24,
  "leftShoulder": -136,
  "leftElbow": 70,
  "rightElbow": 50,
  "rightHip": 70,
  "leftKnee": 5,
  "rightKnee": 80,
  "neck": -3.3,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 24,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch 24° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 24,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 24° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 160.7,
    "shoulder_sagittal_flexion_deg": -156.8,
    "elbow_flexion_deg": 34.3,
    "forearm_forward_deg": 167.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~161° abduction); shoulder extended ~157° behind; elbow bent ~34°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 24.7,
    "shoulder_sagittal_flexion_deg": -24,
    "elbow_flexion_deg": 24.2,
    "forearm_forward_deg": 1.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~25°; shoulder extended ~24° behind; elbow bent ~24°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 5.6,
    "foot_forward_deg": 61.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 78.8,
    "foot_forward_deg": -153.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee ~right-angle (79°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.856,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.391,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.134,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.856,
    "floating": false,
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
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -156.8,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~161° abduction); shoulder extended ~157° behind; elbow bent ~34°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 105.00000000000017 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 24° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 24° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~161° abduction); shoulder extended ~157° behind; elbow bent ~34°.
- R arm: Right arm: arm abducted ~25°; shoulder extended ~24° behind; elbow bent ~24°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-156.8,"band":[-60,180],"ctx":"Left arm: arm overhead (~161° abduction); shoulder extended ~157° behind; elbow bent ~34°.","verdict":"outside_band_review"}]