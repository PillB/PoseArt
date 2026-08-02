# Forensic Baseline — kneeling-dragon
- name: Kneeling Dragon
- category: kneeling | difficulty: Advanced | angle: Side
- instructions: Kneel and press both palms together, then raise the joined hands high overhead rather than at the chest. Lengthen through the sides of the ribcage as the arms lift and the face tilts up.
- tip: Lengthen through the ribcage as the arms lift — it keeps the pose graceful instead of strained.

## Raw joint config
```json
{
  "spine": 15,
  "neck": 5,
  "leftShoulder": -110,
  "leftElbow": 70,
  "rightShoulder": -110,
  "rightElbow": 50,
  "leftHip": 80,
  "leftKnee": 90,
  "leftAnkle": -35,
  "rightHip": -20,
  "rightKnee": 30,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 15.1,
    "yaw_deg": 0,
    "roll_deg": 5,
    "description": "Head pitch 15° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
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
    "shoulder_abduction_deg": 133.6,
    "shoulder_sagittal_flexion_deg": -160.4,
    "elbow_flexion_deg": 51.7,
    "forearm_forward_deg": 136.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~134° abduction); shoulder extended ~160° behind; elbow bent ~52°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 133.6,
    "shoulder_sagittal_flexion_deg": -160.4,
    "elbow_flexion_deg": 37.6,
    "forearm_forward_deg": 147.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~134° abduction); shoulder extended ~160° behind; elbow bent ~38°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": -20,
    "hip_abduction_deg": -8.5,
    "knee_flexion_deg": 29.7,
    "foot_forward_deg": 66.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~20° behind; knee bent ~30°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.814,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.085,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.814,
    "floating": false,
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
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -160.4,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~134° abduction); shoulder extended ~160° behind; elbow bent ~52°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -160.4,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~134° abduction); shoulder extended ~160° behind; elbow bent ~38°.",
      "verdict": "outside_band_review"
    }
  ],
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
- Torso: Torso flexion 15° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 15° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~134° abduction); shoulder extended ~160° behind; elbow bent ~52°.
- R arm: Right arm: arm overhead (~134° abduction); shoulder extended ~160° behind; elbow bent ~38°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh extended ~20° behind; knee bent ~30°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-160.4,"band":[-60,180],"ctx":"Left arm: arm overhead (~134° abduction); shoulder extended ~160° behind; elbow bent ~52°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-160.4,"band":[-60,180],"ctx":"Right arm: arm overhead (~134° abduction); shoulder extended ~160° behind; elbow bent ~38°.","verdict":"outside_band_review"}]