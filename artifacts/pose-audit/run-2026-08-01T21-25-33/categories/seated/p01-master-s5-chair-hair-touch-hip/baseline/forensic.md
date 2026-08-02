# Forensic Baseline — p01-master-s5-chair-hair-touch-hip
- name: Chair Sit Legs Extended Hair Touch Hip Hand
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit with legs extended, one leg slightly bent, crossed at the shin with pointed toes. Raise one arm to touch the hair while the other hand rests on the hip. Drop shoulders and look away from the camera.
- tip: Lift the raised elbow up and out to create negative space between the arm and torso, elongating the silhouette.

## Raw joint config
```json
{
  "spine": 12,
  "neck": -8.2,
  "hips": 6,
  "globalTilt": 10,
  "globalRoll": 5,
  "globalTwist": 18,
  "leftShoulder": -35,
  "rightShoulder": -125,
  "leftElbow": 81,
  "rightElbow": 45,
  "shoulderFwdL": 10,
  "shoulderFwdR": 22,
  "leftHip": 55,
  "rightHip": 65,
  "leftKnee": 40,
  "rightKnee": 25,
  "leftAnkle": 10,
  "rightAnkle": 8,
  "hipAbductL": 8,
  "hipAbductR": -14
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 23.6,
    "yaw_deg": 0,
    "roll_deg": -6.1,
    "description": "Head pitch 24° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 20.9,
    "lateral_flexion_deg": 2.1,
    "axial_rotation_deg": 17.2,
    "description": "Torso flexion 21° (+: forward), lateral 2° (+: figure's right), axial rotation proxy 17°."
  },
  "pelvis": {
    "tilt_deg": -11.1,
    "list_deg": 10.5,
    "yaw_deg": 16.2,
    "description": "Pelvic list 11° (+: left hip lower), yaw 16°, anterior/posterior tilt proxy -11° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 57.9,
    "shoulder_sagittal_flexion_deg": -16.3,
    "elbow_flexion_deg": 66.3,
    "forearm_forward_deg": 46.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~58°; shoulder extended ~16° behind; elbow bent ~66°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 165.2,
    "shoulder_sagittal_flexion_deg": -159.8,
    "elbow_flexion_deg": 25.6,
    "forearm_forward_deg": -179.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~165° abduction); shoulder extended ~160° behind; elbow bent ~26°."
  },
  "left_leg": {
    "hip_flexion_deg": 41.9,
    "hip_abduction_deg": -37.8,
    "knee_flexion_deg": 38.6,
    "foot_forward_deg": 156,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~42°; knee bent ~39°."
  },
  "right_leg": {
    "hip_flexion_deg": 52.1,
    "hip_abduction_deg": 51.3,
    "knee_flexion_deg": 23.8,
    "foot_forward_deg": 151.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~52°; abducted ~51° outward; knee bent ~24°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.136,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.063,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.008,
    "com_z": 0.137,
    "foot_x_range": [
      0.307,
      0.735
    ],
    "over_support": false,
    "feet_min_y": -0.136,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
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
      "joint": "right_shoulder_flexion",
      "value": -159.8,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~165° abduction); shoulder extended ~160° behind; elbow bent ~26°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 94.49207999999993 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 21° (+: forward), lateral 2° (+: figure's right), axial rotation proxy 17°.
- Head: Head pitch 24° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 11° (+: left hip lower), yaw 16°, anterior/posterior tilt proxy -11° (low confidence).
- L arm: Left arm: arm abducted ~58°; shoulder extended ~16° behind; elbow bent ~66°.
- R arm: Right arm: arm overhead (~165° abduction); shoulder extended ~160° behind; elbow bent ~26°.
- L leg: Left leg: thigh forward ~42°; knee bent ~39°.
- R leg: Right leg: thigh forward ~52°; abducted ~51° outward; knee bent ~24°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-159.8,"band":[-60,180],"ctx":"Right arm: arm overhead (~165° abduction); shoulder extended ~160° behind; elbow bent ~26°.","verdict":"outside_band_review"}]