# Forensic Baseline — p10-bench-s7-standing-drape-fabric
- name: Standing Beside Bench, Draping Fabric
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Stand beside the bench with one foot raised and placed on top of it. Drape a length of fabric or a blanket loosely around the body with both hands, and tilt the head back slightly to look upward off-camera.
- tip: Hold the fabric loosely rather than clutching it tightly so it drapes with natural folds and movement instead of looking stiff.

## Raw joint config
```json
{
  "spine": 10,
  "neck": 22,
  "hips": -10,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 70,
  "rightElbow": 80,
  "shoulderFwdL": 10,
  "shoulderFwdR": 25,
  "leftHip": 58,
  "rightHip": -5,
  "leftKnee": 75,
  "rightKnee": 6,
  "leftAnkle": 0,
  "rightAnkle": -5,
  "hipAbductL": 10,
  "hipAbductR": 0,
  "globalTwist": -60,
  "globalRoll": 0,
  "globalTilt": -8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 20.2,
    "yaw_deg": 0,
    "roll_deg": 8.9,
    "description": "Head pitch 20° (+: forward/down), roll 9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 1,
    "lateral_flexion_deg": -1.7,
    "axial_rotation_deg": -40.9,
    "description": "Torso flexion 1° (+: forward), lateral -2° (+: figure's right), axial rotation proxy -41°."
  },
  "pelvis": {
    "tilt_deg": -4.7,
    "list_deg": -9.8,
    "yaw_deg": -40.9,
    "description": "Pelvic list -10° (+: left hip lower), yaw -41°, anterior/posterior tilt proxy -5° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 178.5,
    "shoulder_sagittal_flexion_deg": -129,
    "elbow_flexion_deg": 51.2,
    "forearm_forward_deg": -163.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~178° abduction); shoulder extended ~129° behind; elbow bent ~51°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 128.6,
    "shoulder_sagittal_flexion_deg": 158.6,
    "elbow_flexion_deg": 57.9,
    "forearm_forward_deg": 135.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~129° abduction); shoulder flexed ~159° forward; elbow bent ~58°."
  },
  "left_leg": {
    "hip_flexion_deg": 48.3,
    "hip_abduction_deg": 62.8,
    "knee_flexion_deg": 75,
    "foot_forward_deg": -171.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~48°; abducted ~63° outward; knee ~right-angle (75°)."
  },
  "right_leg": {
    "hip_flexion_deg": -7.2,
    "hip_abduction_deg": -7.6,
    "knee_flexion_deg": 6.5,
    "foot_forward_deg": 35.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.362,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.87,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0.004,
    "com_z": -0.003,
    "foot_x_range": [
      -0.643,
      -0.152
    ],
    "over_support": false,
    "feet_min_y": -0.87,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
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
      "value": -129,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~178° abduction); shoulder extended ~129° behind; elbow bent ~51°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.24550000000039 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 1° (+: forward), lateral -2° (+: figure's right), axial rotation proxy -41°.
- Head: Head pitch 20° (+: forward/down), roll 9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -10° (+: left hip lower), yaw -41°, anterior/posterior tilt proxy -5° (low confidence).
- L arm: Left arm: arm overhead (~178° abduction); shoulder extended ~129° behind; elbow bent ~51°.
- R arm: Right arm: arm overhead (~129° abduction); shoulder flexed ~159° forward; elbow bent ~58°.
- L leg: Left leg: thigh forward ~48°; abducted ~63° outward; knee ~right-angle (75°).
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-129,"band":[-60,180],"ctx":"Left arm: arm overhead (~178° abduction); shoulder extended ~129° behind; elbow bent ~51°.","verdict":"outside_band_review"}]