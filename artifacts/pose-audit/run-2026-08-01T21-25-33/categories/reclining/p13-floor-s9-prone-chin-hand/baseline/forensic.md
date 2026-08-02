# Forensic Baseline — p13-floor-s9-prone-chin-hand
- name: Prone on Forearms, Finger at Lip
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Lie face-down on the floor and prop the upper body up on both forearms. Cross the legs at the ankles behind you and lift them slightly off the floor. Bring one finger up near the mouth and look directly at the camera with a playful expression.
- tip: Arch the upper back gently and lift through the chest so the pose doesn't collapse flat onto the forearms; a lifted chest keeps the silhouette dynamic.

## Raw joint config
```json
{
  "spine": 26,
  "neck": 8,
  "hips": 0,
  "leftShoulder": 35,
  "rightShoulder": -30,
  "leftElbow": 79,
  "rightElbow": 85,
  "shoulderFwdL": 30,
  "shoulderFwdR": 30,
  "leftHip": -8,
  "rightHip": -10,
  "leftKnee": 8,
  "rightKnee": 10,
  "leftAnkle": -8,
  "rightAnkle": -6,
  "hipAbductL": -5,
  "hipAbductR": 5,
  "globalTwist": 0,
  "globalRoll": 0,
  "globalTilt": 80
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 106.2,
    "yaw_deg": 0,
    "roll_deg": 155.7,
    "description": "Head pitch 106° (+: forward/down), roll 156° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 106,
    "lateral_flexion_deg": 180,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 106° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44.6,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -108.1,
    "shoulder_sagittal_flexion_deg": -96.8,
    "elbow_flexion_deg": 31.3,
    "forearm_forward_deg": -105.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder extended ~97° behind; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 144.3,
    "shoulder_sagittal_flexion_deg": -134.2,
    "elbow_flexion_deg": 68.5,
    "forearm_forward_deg": -47.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~144° abduction); shoulder extended ~134° behind; elbow bent ~69°."
  },
  "left_leg": {
    "hip_flexion_deg": -88,
    "hip_abduction_deg": 68.3,
    "knee_flexion_deg": 8.4,
    "foot_forward_deg": -31.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~88° behind; abducted ~68° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -90,
    "hip_abduction_deg": -90,
    "knee_flexion_deg": 10.3,
    "foot_forward_deg": -29.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~90° behind; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.202,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.189,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.435,
    "foot_x_range": [
      -0.251,
      0.089
    ],
    "over_support": true,
    "feet_min_y": -0.202,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "R",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -96.8,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder extended ~97° behind; elbow bent ~31°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_shoulder_abduction",
      "value": -108.1,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder extended ~97° behind; elbow bent ~31°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": -88,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~88° behind; abducted ~68° outward; knee straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -134.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~144° abduction); shoulder extended ~134° behind; elbow bent ~69°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -90,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~90° behind; knee straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 109.99100000000014 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 106° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 106° (+: forward/down), roll 156° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence).
- L arm: Left arm: arm at side; shoulder extended ~97° behind; elbow bent ~31°.
- R arm: Right arm: arm overhead (~144° abduction); shoulder extended ~134° behind; elbow bent ~69°.
- L leg: Left leg: thigh extended ~88° behind; abducted ~68° outward; knee straight.
- R leg: Right leg: thigh extended ~90° behind; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-96.8,"band":[-60,180],"ctx":"Left arm: arm at side; shoulder extended ~97° behind; elbow bent ~31°.","verdict":"outside_band_review"},{"joint":"left_shoulder_abduction","value":-108.1,"band":[0,180],"ctx":"Left arm: arm at side; shoulder extended ~97° behind; elbow bent ~31°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":-88,"band":[-30,130],"ctx":"Left leg: thigh extended ~88° behind; abducted ~68° outward; knee straight.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-134.2,"band":[-60,180],"ctx":"Right arm: arm overhead (~144° abduction); shoulder extended ~134° behind; elbow bent ~69°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-90,"band":[-30,130],"ctx":"Right leg: thigh extended ~90° behind; knee straight.","verdict":"outside_band_review"}]