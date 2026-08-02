# Forensic Baseline — step-lean
- name: Step Lean
- category: leaning | difficulty: Beginner | angle: 3/4 View
- instructions: Stand on a raised step with one foot higher than the other, letting the torso lean slightly into the height difference. Rest a hand on the nearby rail or wall for support.
- tip: Use real architecture like steps for height variation — it makes solo shots feel far more dynamic.

## Raw joint config
```json
{
  "spine": 14,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 40,
  "rightElbow": 20,
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
    "pitch_deg": 14.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 133.3,
    "shoulder_sagittal_flexion_deg": -162.6,
    "elbow_flexion_deg": 30.3,
    "forearm_forward_deg": 154.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~133° abduction); shoulder extended ~163° behind; elbow bent ~30°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 132.8,
    "shoulder_sagittal_flexion_deg": -166.5,
    "elbow_flexion_deg": 15.5,
    "forearm_forward_deg": 170.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~133° abduction); shoulder extended ~167° behind; elbow bent ~15°."
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
    "com_z": 0.08,
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
      "value": -162.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~133° abduction); shoulder extended ~163° behind; elbow bent ~30°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -166.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~133° abduction); shoulder extended ~167° behind; elbow bent ~15°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.74699999999993 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~133° abduction); shoulder extended ~163° behind; elbow bent ~30°.
- R arm: Right arm: arm overhead (~133° abduction); shoulder extended ~167° behind; elbow bent ~15°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-162.6,"band":[-60,180],"ctx":"Left arm: arm overhead (~133° abduction); shoulder extended ~163° behind; elbow bent ~30°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-166.5,"band":[-60,180],"ctx":"Right arm: arm overhead (~133° abduction); shoulder extended ~167° behind; elbow bent ~15°.","verdict":"outside_band_review"}]