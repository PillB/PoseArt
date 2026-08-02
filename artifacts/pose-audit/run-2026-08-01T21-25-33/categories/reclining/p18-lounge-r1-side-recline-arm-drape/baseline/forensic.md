# Forensic Baseline — p18-lounge-r1-side-recline-arm-drape
- name: Lounge Side Recline with Draped Arm
- category: reclining | difficulty: Beginner | angle: undefined
- instructions: Lie on your side along the length of the chaise, torso turned toward camera. Drape the top arm along the backrest/armrest above the head, letting the elbow bend softly. Extend both legs long together in the same direction, stacking the knees and ankles. Turn the head to gaze directly into the lens.
- tip: Keep a soft bend in the top elbow instead of a rigid right angle — a completely straight arm along the backrest looks stiff rather than languid.

## Raw joint config
```json
{
  "spine": 12,
  "hips": -8,
  "neck": 10,
  "leftShoulder": -20,
  "rightShoulder": -20,
  "leftElbow": 95,
  "rightElbow": 40,
  "hipAbductL": -5,
  "hipAbductR": -3,
  "leftHip": 15,
  "rightHip": 18,
  "leftKnee": 10,
  "rightKnee": 12,
  "leftAnkle": -5,
  "rightAnkle": -3,
  "shoulderFwdL": 25,
  "shoulderFwdR": 10,
  "globalTilt": 70,
  "globalTwist": 25,
  "globalRoll": 20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 68.5,
    "yaw_deg": 0,
    "roll_deg": 56.7,
    "description": "Head pitch 69° (+: forward/down), roll 57° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 73,
    "lateral_flexion_deg": 51.6,
    "axial_rotation_deg": 22.9,
    "description": "Torso flexion 73° (+: forward), lateral 52° (+: figure's right), axial rotation proxy 23°."
  },
  "pelvis": {
    "tilt_deg": -38.1,
    "list_deg": 13.7,
    "yaw_deg": 28.2,
    "description": "Pelvic list 14° (+: left hip lower), yaw 28°, anterior/posterior tilt proxy -38° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 82.6,
    "shoulder_sagittal_flexion_deg": -78.3,
    "elbow_flexion_deg": 60.3,
    "forearm_forward_deg": -17.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~83° (lateral); shoulder extended ~78° behind; elbow bent ~60°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 120,
    "shoulder_sagittal_flexion_deg": -97.2,
    "elbow_flexion_deg": 26.6,
    "forearm_forward_deg": -73,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~120° abduction); shoulder extended ~97° behind; elbow bent ~27°."
  },
  "left_leg": {
    "hip_flexion_deg": -41.5,
    "hip_abduction_deg": 24.1,
    "knee_flexion_deg": 10.2,
    "foot_forward_deg": 9.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~41° behind; abducted ~24° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -43.3,
    "hip_abduction_deg": -13.8,
    "knee_flexion_deg": 12.2,
    "foot_forward_deg": 14.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~43° behind; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.794,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.742,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0.145,
    "com_z": 0.398,
    "foot_x_range": [
      -0.337,
      0.104
    ],
    "over_support": false,
    "feet_min_y": -0.794,
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
      "joint": "left_shoulder_flexion",
      "value": -78.3,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~83° (lateral); shoulder extended ~78° behind; elbow bent ~60°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": -41.5,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~41° behind; abducted ~24° outward; knee straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -97.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~120° abduction); shoulder extended ~97° behind; elbow bent ~27°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -43.3,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~43° behind; knee straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 109.99405999999978 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 73° (+: forward), lateral 52° (+: figure's right), axial rotation proxy 23°.
- Head: Head pitch 69° (+: forward/down), roll 57° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 14° (+: left hip lower), yaw 28°, anterior/posterior tilt proxy -38° (low confidence).
- L arm: Left arm: arm abducted ~83° (lateral); shoulder extended ~78° behind; elbow bent ~60°.
- R arm: Right arm: arm overhead (~120° abduction); shoulder extended ~97° behind; elbow bent ~27°.
- L leg: Left leg: thigh extended ~41° behind; abducted ~24° outward; knee straight.
- R leg: Right leg: thigh extended ~43° behind; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-78.3,"band":[-60,180],"ctx":"Left arm: arm abducted ~83° (lateral); shoulder extended ~78° behind; elbow bent ~60°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":-41.5,"band":[-30,130],"ctx":"Left leg: thigh extended ~41° behind; abducted ~24° outward; knee straight.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-97.2,"band":[-60,180],"ctx":"Right arm: arm overhead (~120° abduction); shoulder extended ~97° behind; elbow bent ~27°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-43.3,"band":[-30,130],"ctx":"Right leg: thigh extended ~43° behind; knee straight.","verdict":"outside_band_review"}]