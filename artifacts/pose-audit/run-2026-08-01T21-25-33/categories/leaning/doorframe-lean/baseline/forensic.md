# Forensic Baseline — doorframe-lean
- name: Doorframe Lean
- category: leaning | difficulty: Intermediate | angle: Front
- instructions: Reach both hands up to grip the doorframe above the head, arms holding real tension rather than fully hanging. Let the body curve gently through the ribs, weight settling into the hips.
- tip: Keep tension in the arms instead of fully hanging — it keeps the shoulders open and lifted.

## Raw joint config
```json
{
  "spine": 18,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -136,
  "rightShoulder": -120,
  "leftElbow": 70,
  "rightElbow": 70,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftKnee": 10,
  "rightKnee": 10,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 18.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 18° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 159.6,
    "shoulder_sagittal_flexion_deg": -162.8,
    "elbow_flexion_deg": 31,
    "forearm_forward_deg": 164.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~160° abduction); shoulder extended ~163° behind; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 142.8,
    "shoulder_sagittal_flexion_deg": -163.2,
    "elbow_flexion_deg": 44.1,
    "forearm_forward_deg": 146.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~143° abduction); shoulder extended ~163° behind; elbow bent ~44°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -20,
    "knee_flexion_deg": 9.7,
    "foot_forward_deg": 67.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 10.4,
    "foot_forward_deg": 66.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.811,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.828,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.102,
    "foot_x_range": [
      0.06,
      0.281
    ],
    "over_support": false,
    "feet_min_y": -0.828,
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
      "value": -162.8,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~160° abduction); shoulder extended ~163° behind; elbow bent ~31°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -163.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~143° abduction); shoulder extended ~163° behind; elbow bent ~44°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.74250000000033 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 18° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~160° abduction); shoulder extended ~163° behind; elbow bent ~31°.
- R arm: Right arm: arm overhead (~143° abduction); shoulder extended ~163° behind; elbow bent ~44°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-162.8,"band":[-60,180],"ctx":"Left arm: arm overhead (~160° abduction); shoulder extended ~163° behind; elbow bent ~31°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-163.2,"band":[-60,180],"ctx":"Right arm: arm overhead (~143° abduction); shoulder extended ~163° behind; elbow bent ~44°.","verdict":"outside_band_review"}]