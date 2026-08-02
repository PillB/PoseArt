# Forensic Baseline — floor-seated-recline
- name: Floor Seated Recline
- category: reclining | difficulty: Beginner | angle: 3/4 View
- instructions: Sit on the floor and lower the torso back gradually onto both elbows, legs bent or extended forward. A relaxed mid-point between sitting up and lying flat.
- tip: Small changes in elbow height shift the whole mood -- test a few before settling.

## Raw joint config
```json
{
  "globalTilt": 75,
  "spine": -5,
  "neck": 1.5,
  "leftElbow": 81,
  "rightElbow": 81,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 5,
  "rightKnee": 5,
  "rightShoulder": 12
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 70,
    "yaw_deg": 0,
    "roll_deg": 4.4,
    "description": "Head pitch 70° (+: forward/down), roll 4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 70,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 70° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -44° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 50.9,
    "shoulder_sagittal_flexion_deg": -70,
    "elbow_flexion_deg": 28.9,
    "forearm_forward_deg": -53.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~51°; shoulder extended ~70° behind; elbow bent ~29°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 29.7,
    "shoulder_sagittal_flexion_deg": -70.3,
    "elbow_flexion_deg": 14.9,
    "forearm_forward_deg": -65.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~30°; shoulder extended ~70° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 5,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 66.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 5,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 66.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.887,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.887,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.426,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.887,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -70,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~51°; shoulder extended ~70° behind; elbow bent ~29°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -70.3,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~30°; shoulder extended ~70° behind; elbow straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.73899000000026 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 70° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 70° (+: forward/down), roll 4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -44° (low confidence).
- L arm: Left arm: arm abducted ~51°; shoulder extended ~70° behind; elbow bent ~29°.
- R arm: Right arm: arm abducted ~30°; shoulder extended ~70° behind; elbow straight.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM over foot support base. (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-70,"band":[-60,180],"ctx":"Left arm: arm abducted ~51°; shoulder extended ~70° behind; elbow bent ~29°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-70.3,"band":[-60,180],"ctx":"Right arm: arm abducted ~30°; shoulder extended ~70° behind; elbow straight.","verdict":"outside_band_review"}]