# Forensic Baseline — back-recline-arms-up
- name: Back Recline Arms Up
- category: reclining | difficulty: Beginner | angle: Front
- instructions: Lie on the back and bend one knee up with the foot flat on the ground, letting the other leg rest straight. Rest one hand on the stomach and the other beside you.
- tip: A single bent knee breaks the symmetry of lying flat and adds a relaxed, casual silhouette.

## Raw joint config
```json
{
  "globalTilt": -85,
  "leftShoulder": -155,
  "rightShoulder": -122,
  "leftElbow": 70,
  "rightElbow": 78
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -85,
    "yaw_deg": 0,
    "roll_deg": 0,
    "description": "Head pitch -85° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -85,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 44.9,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 156.5,
    "shoulder_sagittal_flexion_deg": -95,
    "elbow_flexion_deg": 4.2,
    "forearm_forward_deg": -99.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~157° abduction); shoulder extended ~95° behind; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 97.1,
    "shoulder_sagittal_flexion_deg": -95,
    "elbow_flexion_deg": 43.8,
    "forearm_forward_deg": -131.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~97° (lateral); shoulder extended ~95° behind; elbow bent ~44°."
  },
  "left_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 146.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~85° (hip flexion); knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 146.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~85° (hip flexion); knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.087,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.087,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.448,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.087,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -95,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~157° abduction); shoulder extended ~95° behind; elbow straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -95,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~97° (lateral); shoulder extended ~95° behind; elbow bent ~44°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 112.99700000000027 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -85° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm overhead (~157° abduction); shoulder extended ~95° behind; elbow straight.
- R arm: Right arm: arm abducted ~97° (lateral); shoulder extended ~95° behind; elbow bent ~44°.
- L leg: Left leg: thigh forward ~85° (hip flexion); knee straight.
- R leg: Right leg: thigh forward ~85° (hip flexion); knee straight.
- Balance: COM over foot support base. (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-95,"band":[-60,180],"ctx":"Left arm: arm overhead (~157° abduction); shoulder extended ~95° behind; elbow straight.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-95,"band":[-60,180],"ctx":"Right arm: arm abducted ~97° (lateral); shoulder extended ~95° behind; elbow bent ~44°.","verdict":"outside_band_review"}]