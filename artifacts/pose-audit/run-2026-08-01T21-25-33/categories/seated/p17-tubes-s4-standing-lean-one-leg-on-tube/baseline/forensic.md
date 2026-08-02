# Forensic Baseline — p17-tubes-s4-standing-lean-one-leg-on-tube
- name: Standing Lean with One Foot on a Tube
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Stand beside a tall tube and place one foot up on top of it, bending that knee outward. Lean the torso slightly toward the raised leg, resting a forearm on the bent knee. Let the standing leg carry most of the weight, hips shifted to that side. Gaze toward camera over the shoulder.
- tip: Shift weight fully onto the standing leg so the raised foot rests lightly on the tube rather than bearing weight.

## Raw joint config
```json
{
  "spine": 12,
  "neck": -9.9,
  "hips": 15,
  "globalTilt": 5,
  "globalRoll": 8,
  "globalTwist": 35,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 85,
  "rightElbow": 15,
  "shoulderFwdL": 15,
  "shoulderFwdR": 5,
  "leftHip": 95,
  "rightHip": 5,
  "leftKnee": 100,
  "rightKnee": 10,
  "leftAnkle": 0,
  "rightAnkle": -5,
  "hipAbductL": 25,
  "hipAbductR": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 19.7,
    "yaw_deg": 0,
    "roll_deg": -6.2,
    "description": "Head pitch 20° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 13.9,
    "lateral_flexion_deg": 1.9,
    "axial_rotation_deg": 29.8,
    "description": "Torso flexion 14° (+: forward), lateral 2° (+: figure's right), axial rotation proxy 30°."
  },
  "pelvis": {
    "tilt_deg": -12.3,
    "list_deg": 20.2,
    "yaw_deg": 28.2,
    "description": "Pelvic list 20° (+: left hip lower), yaw 28°, anterior/posterior tilt proxy -12° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 127,
    "shoulder_sagittal_flexion_deg": 169.3,
    "elbow_flexion_deg": 61.4,
    "forearm_forward_deg": 125.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~127° abduction); shoulder flexed ~169° forward; elbow bent ~61°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 154.5,
    "shoulder_sagittal_flexion_deg": -143.4,
    "elbow_flexion_deg": 11.7,
    "forearm_forward_deg": -148.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~155° abduction); shoulder extended ~143° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 117.4,
    "hip_abduction_deg": -98,
    "knee_flexion_deg": 70.2,
    "foot_forward_deg": -104.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~117° (hip flexion); knee bent ~70°."
  },
  "right_leg": {
    "hip_flexion_deg": -9.1,
    "hip_abduction_deg": 20.4,
    "knee_flexion_deg": 10.1,
    "foot_forward_deg": 59.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~20° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.428,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.735,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.088,
    "foot_x_range": [
      0.384,
      0.584
    ],
    "over_support": false,
    "feet_min_y": -0.735,
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
      "joint": "right_shoulder_flexion",
      "value": -143.4,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~155° abduction); shoulder extended ~143° behind; elbow straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.9969999999996 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral 2° (+: figure's right), axial rotation proxy 30°.
- Head: Head pitch 20° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 20° (+: left hip lower), yaw 28°, anterior/posterior tilt proxy -12° (low confidence).
- L arm: Left arm: arm overhead (~127° abduction); shoulder flexed ~169° forward; elbow bent ~61°.
- R arm: Right arm: arm overhead (~155° abduction); shoulder extended ~143° behind; elbow straight.
- L leg: Left leg: thigh forward ~117° (hip flexion); knee bent ~70°.
- R leg: Right leg: thigh near neutral; abducted ~20° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-143.4,"band":[-60,180],"ctx":"Right arm: arm overhead (~155° abduction); shoulder extended ~143° behind; elbow straight.","verdict":"outside_band_review"}]