# Forensic Baseline — p13-floor-s10-recline-ottoman-arms-up
- name: Backlit Recline Against Ottoman, Arms Overhead
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Sit on the floor and recline back against an ottoman or low chair placed behind you. Bend both knees and let them fall open or to one side. Raise both arms overhead with hands near the face or hair, and drop the head back for a dramatic, backlit silhouette.
- tip: Let the ottoman fully support the weight of the upper back so the arms and neck can stay relaxed and expressive rather than tense from balancing.

## Raw joint config
```json
{
  "spine": -28,
  "neck": 27,
  "hips": 0,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 95,
  "rightElbow": 100,
  "shoulderFwdL": 20,
  "shoulderFwdR": 20,
  "leftHip": 22,
  "rightHip": 25,
  "leftKnee": 98,
  "rightKnee": 102,
  "leftAnkle": -5,
  "rightAnkle": -5,
  "hipAbductL": -20,
  "hipAbductR": 18,
  "globalTwist": 0,
  "globalRoll": 0,
  "globalTilt": -78
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -108.8,
    "yaw_deg": 0,
    "roll_deg": 126.4,
    "description": "Head pitch -109° (+: forward/down), roll 126° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -106,
    "lateral_flexion_deg": 180,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -106° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 44.4,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 44° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 113.3,
    "shoulder_sagittal_flexion_deg": -118.5,
    "elbow_flexion_deg": 69.7,
    "forearm_forward_deg": -152.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~113° (lateral); shoulder extended ~118° behind; elbow bent ~70°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 113.3,
    "shoulder_sagittal_flexion_deg": -118.5,
    "elbow_flexion_deg": 72.8,
    "forearm_forward_deg": -151.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~113° (lateral); shoulder extended ~118° behind; elbow bent ~73°."
  },
  "left_leg": {
    "hip_flexion_deg": 100,
    "hip_abduction_deg": 115.5,
    "knee_flexion_deg": 91.3,
    "foot_forward_deg": -109.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~100° (hip flexion); abducted ~116° outward; knee ~right-angle (91°)."
  },
  "right_leg": {
    "hip_flexion_deg": 103,
    "hip_abduction_deg": -124.7,
    "knee_flexion_deg": 94.3,
    "foot_forward_deg": -102.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~103° (hip flexion); knee ~right-angle (94°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.509,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.489,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.435,
    "foot_x_range": [
      -0.489,
      -0.116
    ],
    "over_support": false,
    "feet_min_y": 0.489,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "L"
    },
    {
      "type": "knee_above_hip",
      "side": "R"
    },
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
      "value": -118.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~113° (lateral); shoulder extended ~118° behind; elbow bent ~70°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -118.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~113° (lateral); shoulder extended ~118° behind; elbow bent ~73°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 113.74714999999993 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -106° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -109° (+: forward/down), roll 126° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 44° (low confidence).
- L arm: Left arm: arm abducted ~113° (lateral); shoulder extended ~118° behind; elbow bent ~70°.
- R arm: Right arm: arm abducted ~113° (lateral); shoulder extended ~118° behind; elbow bent ~73°.
- L leg: Left leg: thigh forward ~100° (hip flexion); abducted ~116° outward; knee ~right-angle (91°).
- R leg: Right leg: thigh forward ~103° (hip flexion); knee ~right-angle (94°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-118.5,"band":[-60,180],"ctx":"Left arm: arm abducted ~113° (lateral); shoulder extended ~118° behind; elbow bent ~70°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-118.5,"band":[-60,180],"ctx":"Right arm: arm abducted ~113° (lateral); shoulder extended ~118° behind; elbow bent ~73°.","verdict":"outside_band_review"}]