# Forensic Baseline — p17-tubes-s1-reclined-across-tubes
- name: Reclined Across Multiple Tubes
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Arrange three tubes in a descending line. Recline back across them so the hips rest on the tallest tube and the legs extend long over the lower ones, ankles crossed and lifted. Let one arm trail to the floor for support while the other rests on the stomach. Close the eyes and tilt the head back.
- tip: Keep the core gently engaged so the torso doesn't sag between the tubes — a slight lift keeps the line clean.

## Raw joint config
```json
{
  "spine": -15,
  "neck": -20,
  "hips": 5,
  "globalTilt": -55,
  "globalRoll": 10,
  "globalTwist": 8,
  "leftShoulder": -80,
  "rightShoulder": -20,
  "leftElbow": 35,
  "rightElbow": 50,
  "shoulderFwdL": 10,
  "shoulderFwdR": 10,
  "leftHip": 10,
  "rightHip": 12,
  "leftKnee": 8,
  "rightKnee": 10,
  "leftAnkle": 5,
  "rightAnkle": 5,
  "hipAbductL": -5,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -74.9,
    "yaw_deg": 0,
    "roll_deg": -65.6,
    "description": "Head pitch -75° (+: forward/down), roll -66° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -71.3,
    "lateral_flexion_deg": -30.9,
    "axial_rotation_deg": 7.9,
    "description": "Torso flexion -71° (+: forward), lateral -31° (+: figure's right), axial rotation proxy 8°."
  },
  "pelvis": {
    "tilt_deg": 38.5,
    "list_deg": 12.3,
    "yaw_deg": 11.8,
    "description": "Pelvic list 12° (+: left hip lower), yaw 12°, anterior/posterior tilt proxy 39° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 90.9,
    "shoulder_sagittal_flexion_deg": -149.1,
    "elbow_flexion_deg": 34.4,
    "forearm_forward_deg": 147.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~91° (lateral); shoulder extended ~149° behind; elbow bent ~34°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 78.6,
    "shoulder_sagittal_flexion_deg": 73,
    "elbow_flexion_deg": 35.1,
    "forearm_forward_deg": 99.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~79° (lateral); shoulder flexed ~73° forward; elbow bent ~35°."
  },
  "left_leg": {
    "hip_flexion_deg": 66.3,
    "hip_abduction_deg": -26.6,
    "knee_flexion_deg": 8.4,
    "foot_forward_deg": 134.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~66°; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 69.5,
    "hip_abduction_deg": 47.8,
    "knee_flexion_deg": 10.3,
    "foot_forward_deg": 140.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~69°; abducted ~48° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.176,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.046,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.088,
    "com_z": -0.404,
    "foot_x_range": [
      -0.011,
      0.466
    ],
    "over_support": false,
    "feet_min_y": -0.176,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -149.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~91° (lateral); shoulder extended ~149° behind; elbow bent ~34°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 101.50003000000011 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -71° (+: forward), lateral -31° (+: figure's right), axial rotation proxy 8°.
- Head: Head pitch -75° (+: forward/down), roll -66° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 12° (+: left hip lower), yaw 12°, anterior/posterior tilt proxy 39° (low confidence).
- L arm: Left arm: arm abducted ~91° (lateral); shoulder extended ~149° behind; elbow bent ~34°.
- R arm: Right arm: arm abducted ~79° (lateral); shoulder flexed ~73° forward; elbow bent ~35°.
- L leg: Left leg: thigh forward ~66°; knee straight.
- R leg: Right leg: thigh forward ~69°; abducted ~48° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-149.1,"band":[-60,180],"ctx":"Left arm: arm abducted ~91° (lateral); shoulder extended ~149° behind; elbow bent ~34°.","verdict":"outside_band_review"}]