# Forensic Baseline — kneeling-reach-up-one
- name: Kneeling Reach Up One
- category: kneeling | difficulty: Intermediate | angle: 3/4 View
- instructions: Kneel and lower onto both forearms in front of you, hips still lifted off the heels. Let the gaze rest forward and low to the ground for an intimate, immersive angle.
- tip: Shoot from a similarly low camera angle to make the pose feel immersive rather than distant.

## Raw joint config
```json
{
  "spine": 5,
  "neck": -4.2,
  "leftShoulder": -136,
  "rightShoulder": -120,
  "leftElbow": 70,
  "rightElbow": 70,
  "rightHip": 70,
  "leftKnee": 90,
  "rightKnee": 80,
  "leftAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 5,
    "yaw_deg": 0,
    "roll_deg": -4.2,
    "description": "Head pitch 5° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 5,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 158.9,
    "shoulder_sagittal_flexion_deg": -175.1,
    "elbow_flexion_deg": 25.9,
    "forearm_forward_deg": 159.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~159° abduction); shoulder extended ~175° behind; elbow bent ~26°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 142.9,
    "shoulder_sagittal_flexion_deg": -174.2,
    "elbow_flexion_deg": 42,
    "forearm_forward_deg": 143.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~143° abduction); shoulder extended ~174° behind; elbow bent ~42°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": 111.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee ~right-angle (89°)."
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
      "y": -0.323,
      "relation": "elevated"
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
    "com_z": 0.029,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.323,
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
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -175.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~159° abduction); shoulder extended ~175° behind; elbow bent ~26°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -174.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~143° abduction); shoulder extended ~174° behind; elbow bent ~42°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 107.9925 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 5° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~159° abduction); shoulder extended ~175° behind; elbow bent ~26°.
- R arm: Right arm: arm overhead (~143° abduction); shoulder extended ~174° behind; elbow bent ~42°.
- L leg: Left leg: thigh near neutral; knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-175.1,"band":[-60,180],"ctx":"Left arm: arm overhead (~159° abduction); shoulder extended ~175° behind; elbow bent ~26°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-174.2,"band":[-60,180],"ctx":"Right arm: arm overhead (~143° abduction); shoulder extended ~174° behind; elbow bent ~42°.","verdict":"outside_band_review"}]