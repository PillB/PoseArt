# Forensic Baseline — p10-bench-s8-seated-profile-tiptoe
- name: Perched on Bench, Leg Extended on Tiptoe
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Perch on the edge of the bench in profile. Extend one leg forward with the toes pointed and lightly touching the floor, keeping the supporting leg bent beneath you. Tilt the head back and look up and away from the camera.
- tip: Fully point the extended foot's toes all the way to the floor — a flexed foot breaks the elegant line of the extended leg.

## Raw joint config
```json
{
  "spine": 8,
  "neck": 13.8,
  "hips": 0,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 30,
  "rightElbow": 50,
  "shoulderFwdL": 0,
  "shoulderFwdR": 15,
  "leftHip": 95,
  "rightHip": 20,
  "leftKnee": 100,
  "rightKnee": 15,
  "leftAnkle": -5,
  "rightAnkle": -35,
  "hipAbductL": 0,
  "hipAbductR": 0,
  "globalTwist": -60,
  "globalRoll": 0,
  "globalTilt": -15
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 8.7,
    "yaw_deg": 0,
    "roll_deg": 12.7,
    "description": "Head pitch 9° (+: forward/down), roll 13° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -3.5,
    "lateral_flexion_deg": 6.1,
    "axial_rotation_deg": -40.9,
    "description": "Torso flexion -4° (+: forward), lateral 6° (+: figure's right), axial rotation proxy -41°."
  },
  "pelvis": {
    "tilt_deg": 7.4,
    "list_deg": 0,
    "yaw_deg": -40.9,
    "description": "Pelvic list 0° (+: left hip lower), yaw -41°, anterior/posterior tilt proxy 7° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 170.5,
    "shoulder_sagittal_flexion_deg": -128.6,
    "elbow_flexion_deg": 22.6,
    "forearm_forward_deg": -140.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~171° abduction); shoulder extended ~129° behind; elbow bent ~23°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 127.5,
    "shoulder_sagittal_flexion_deg": 149.4,
    "elbow_flexion_deg": 37.1,
    "forearm_forward_deg": 136.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~128° abduction); shoulder flexed ~149° forward; elbow bent ~37°."
  },
  "left_leg": {
    "hip_flexion_deg": 126.1,
    "hip_abduction_deg": 112.8,
    "knee_flexion_deg": 100,
    "foot_forward_deg": -107,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~126° (hip flexion); abducted ~113° outward; knee ~right-angle (100°)."
  },
  "right_leg": {
    "hip_flexion_deg": 19.3,
    "hip_abduction_deg": -31.2,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 55.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~19°; knee bent ~15°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.581,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.62,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.062,
    "com_z": -0.036,
    "foot_x_range": [
      -0.604,
      -0.028
    ],
    "over_support": false,
    "feet_min_y": -0.62,
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
      "value": -128.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~171° abduction); shoulder extended ~129° behind; elbow bent ~23°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.24549999999974 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -4° (+: forward), lateral 6° (+: figure's right), axial rotation proxy -41°.
- Head: Head pitch 9° (+: forward/down), roll 13° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw -41°, anterior/posterior tilt proxy 7° (low confidence).
- L arm: Left arm: arm overhead (~171° abduction); shoulder extended ~129° behind; elbow bent ~23°.
- R arm: Right arm: arm overhead (~128° abduction); shoulder flexed ~149° forward; elbow bent ~37°.
- L leg: Left leg: thigh forward ~126° (hip flexion); abducted ~113° outward; knee ~right-angle (100°).
- R leg: Right leg: thigh forward ~19°; knee bent ~15°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-128.6,"band":[-60,180],"ctx":"Left arm: arm overhead (~171° abduction); shoulder extended ~129° behind; elbow bent ~23°.","verdict":"outside_band_review"}]