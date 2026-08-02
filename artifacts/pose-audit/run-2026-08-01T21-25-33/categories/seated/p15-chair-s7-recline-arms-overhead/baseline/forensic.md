# Forensic Baseline — p15-chair-s7-recline-arms-overhead
- name: Chair Recline Arms Overhead
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit back into the chair, let the spine relax into a slight recline against the chair back, raise both arms overhead or behind the head, chest lifted and open, legs extended loosely in front, gaze soft to camera.
- tip: Lifting the arms overhead automatically lifts and lengthens the torso — keep the ribs from flaring by engaging the core slightly.

## Raw joint config
```json
{
  "spine": -22,
  "neck": -18,
  "hips": -8,
  "globalTilt": -45,
  "globalRoll": 0,
  "globalTwist": 8,
  "leftShoulder": -131,
  "rightShoulder": -140,
  "leftElbow": 30,
  "rightElbow": 35,
  "shoulderFwdL": 10,
  "shoulderFwdR": 10,
  "leftHip": 60,
  "rightHip": 58,
  "leftKnee": 25,
  "rightKnee": 30,
  "leftAnkle": 5,
  "rightAnkle": 3,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -66.9,
    "yaw_deg": 0,
    "roll_deg": -48.6,
    "description": "Head pitch -67° (+: forward/down), roll -49° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -66.8,
    "lateral_flexion_deg": -18.2,
    "axial_rotation_deg": 7.9,
    "description": "Torso flexion -67° (+: forward), lateral -18° (+: figure's right), axial rotation proxy 8°."
  },
  "pelvis": {
    "tilt_deg": 35.5,
    "list_deg": -5.6,
    "yaw_deg": 2.3,
    "description": "Pelvic list -6° (+: left hip lower), yaw 2°, anterior/posterior tilt proxy 35° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 148,
    "shoulder_sagittal_flexion_deg": -156.6,
    "elbow_flexion_deg": 15.1,
    "forearm_forward_deg": -167,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~148° abduction); shoulder extended ~157° behind; elbow bent ~15°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 163.9,
    "shoulder_sagittal_flexion_deg": -151.1,
    "elbow_flexion_deg": 13.9,
    "forearm_forward_deg": -160.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~164° abduction); shoulder extended ~151° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 105.1,
    "hip_abduction_deg": -152.6,
    "knee_flexion_deg": 25.1,
    "foot_forward_deg": -168.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~105° (hip flexion); knee bent ~25°."
  },
  "right_leg": {
    "hip_flexion_deg": 102.6,
    "hip_abduction_deg": -146.6,
    "knee_flexion_deg": 28.7,
    "foot_forward_deg": -168,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~103° (hip flexion); knee bent ~29°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.571,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.526,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.054,
    "com_z": -0.385,
    "foot_x_range": [
      -0.126,
      0.035
    ],
    "over_support": true,
    "feet_min_y": 0.526,
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
      "value": -156.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~148° abduction); shoulder extended ~157° behind; elbow bent ~15°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -151.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~164° abduction); shoulder extended ~151° behind; elbow straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 102.24099999999981 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -67° (+: forward), lateral -18° (+: figure's right), axial rotation proxy 8°.
- Head: Head pitch -67° (+: forward/down), roll -49° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -6° (+: left hip lower), yaw 2°, anterior/posterior tilt proxy 35° (low confidence).
- L arm: Left arm: arm overhead (~148° abduction); shoulder extended ~157° behind; elbow bent ~15°.
- R arm: Right arm: arm overhead (~164° abduction); shoulder extended ~151° behind; elbow straight.
- L leg: Left leg: thigh forward ~105° (hip flexion); knee bent ~25°.
- R leg: Right leg: thigh forward ~103° (hip flexion); knee bent ~29°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-156.6,"band":[-60,180],"ctx":"Left arm: arm overhead (~148° abduction); shoulder extended ~157° behind; elbow bent ~15°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-151.1,"band":[-60,180],"ctx":"Right arm: arm overhead (~164° abduction); shoulder extended ~151° behind; elbow straight.","verdict":"outside_band_review"}]