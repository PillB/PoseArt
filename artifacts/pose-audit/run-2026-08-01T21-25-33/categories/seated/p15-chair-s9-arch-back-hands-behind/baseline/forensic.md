# Forensic Baseline — p15-chair-s9-arch-back-hands-behind
- name: Chair Arched Back Hands Behind Head
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Sit forward on the chair edge, arch the back and push the chest up and out, both hands clasped behind the head with elbows wide, head tilted back slightly, legs planted wide for stability.
- tip: Push the pelvis slightly forward as the chest arches back — this keeps the curve looking intentional and athletic rather than strained.

## Raw joint config
```json
{
  "spine": -32,
  "neck": -25,
  "hips": -10,
  "globalTilt": -40,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -136,
  "rightShoulder": -124,
  "leftElbow": 79,
  "rightElbow": 79,
  "shoulderFwdL": -5,
  "shoulderFwdR": -5,
  "leftHip": 90,
  "rightHip": 90,
  "leftKnee": 90,
  "rightKnee": 90,
  "leftAnkle": 0,
  "rightAnkle": 0,
  "hipAbductL": 25,
  "hipAbductR": 25
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -74.6,
    "yaw_deg": 0,
    "roll_deg": -55.3,
    "description": "Head pitch -75° (+: forward/down), roll -55° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -72,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -72° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 32.3,
    "list_deg": -7.6,
    "yaw_deg": -6.4,
    "description": "Pelvic list -8° (+: left hip lower), yaw -6°, anterior/posterior tilt proxy 32° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 167.1,
    "shoulder_sagittal_flexion_deg": -171.5,
    "elbow_flexion_deg": 41,
    "forearm_forward_deg": -163.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~167° abduction); shoulder extended ~171° behind; elbow bent ~41°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 157.2,
    "shoulder_sagittal_flexion_deg": -174.6,
    "elbow_flexion_deg": 49.2,
    "forearm_forward_deg": -174.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~157° abduction); shoulder extended ~175° behind; elbow bent ~49°."
  },
  "left_leg": {
    "hip_flexion_deg": 130,
    "hip_abduction_deg": -157.4,
    "knee_flexion_deg": 85.5,
    "foot_forward_deg": -82.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~130° (hip flexion); knee ~right-angle (85°)."
  },
  "right_leg": {
    "hip_flexion_deg": 130,
    "hip_abduction_deg": -132.6,
    "knee_flexion_deg": 69.5,
    "foot_forward_deg": -78.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~130° (hip flexion); knee bent ~69°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.612,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.476,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.391,
    "foot_x_range": [
      -0.494,
      0.18
    ],
    "over_support": true,
    "feet_min_y": 0.476,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
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
      "value": -171.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~167° abduction); shoulder extended ~171° behind; elbow bent ~41°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -174.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~157° abduction); shoulder extended ~175° behind; elbow bent ~49°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 102.24253000000013 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -72° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -75° (+: forward/down), roll -55° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -8° (+: left hip lower), yaw -6°, anterior/posterior tilt proxy 32° (low confidence).
- L arm: Left arm: arm overhead (~167° abduction); shoulder extended ~171° behind; elbow bent ~41°.
- R arm: Right arm: arm overhead (~157° abduction); shoulder extended ~175° behind; elbow bent ~49°.
- L leg: Left leg: thigh forward ~130° (hip flexion); knee ~right-angle (85°).
- R leg: Right leg: thigh forward ~130° (hip flexion); knee bent ~69°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-171.5,"band":[-60,180],"ctx":"Left arm: arm overhead (~167° abduction); shoulder extended ~171° behind; elbow bent ~41°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-174.6,"band":[-60,180],"ctx":"Right arm: arm overhead (~157° abduction); shoulder extended ~175° behind; elbow bent ~49°.","verdict":"outside_band_review"}]