# Forensic Baseline — p01-master-s16-chair-floor-lying-head-on-chair
- name: Floor Lying Head Resting on Chair Eyes Closed
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Lie on the floor with the head resting on the chair seat. Bend both arms, one hand touching the hair and the other touching the hip. Bend the knees and extend the legs with pointed toes. Tilt the face toward the camera with eyes closed.
- tip: Let the head sink fully into the chair cushion for support so the neck stays soft and unstrained.

## Raw joint config
```json
{
  "spine": 8,
  "neck": 28,
  "hips": 16,
  "globalTilt": -60,
  "globalRoll": 10,
  "globalTwist": 15,
  "leftShoulder": -100,
  "rightShoulder": -40,
  "leftElbow": 50,
  "rightElbow": 75,
  "shoulderFwdL": 10,
  "shoulderFwdR": 8,
  "leftHip": 35,
  "rightHip": 45,
  "leftKnee": 55,
  "rightKnee": 40,
  "leftAnkle": 10,
  "rightAnkle": 8,
  "hipAbductL": 8,
  "hipAbductR": 6
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -52.8,
    "yaw_deg": 0,
    "roll_deg": 15.9,
    "description": "Head pitch -53° (+: forward/down), roll 16° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -53.1,
    "lateral_flexion_deg": -28.3,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion -53° (+: forward), lateral -28° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": 36.2,
    "list_deg": 16,
    "yaw_deg": 25.6,
    "description": "Pelvic list 16° (+: left hip lower), yaw 26°, anterior/posterior tilt proxy 36° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 82.2,
    "shoulder_sagittal_flexion_deg": -71.6,
    "elbow_flexion_deg": 42.3,
    "forearm_forward_deg": -178,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~82° (lateral); shoulder extended ~72° behind; elbow bent ~42°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 73.8,
    "shoulder_sagittal_flexion_deg": 6.8,
    "elbow_flexion_deg": 64.9,
    "forearm_forward_deg": 128.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~74° (lateral); elbow bent ~65°."
  },
  "left_leg": {
    "hip_flexion_deg": 103.6,
    "hip_abduction_deg": -107.2,
    "knee_flexion_deg": 49.4,
    "foot_forward_deg": -139.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~104° (hip flexion); knee bent ~49°."
  },
  "right_leg": {
    "hip_flexion_deg": 110.3,
    "hip_abduction_deg": 131.6,
    "knee_flexion_deg": 39.6,
    "foot_forward_deg": -149.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~110° (hip flexion); abducted ~132° outward; knee bent ~40°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.541,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.681,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.138,
    "com_z": -0.352,
    "foot_x_range": [
      0.232,
      0.375
    ],
    "over_support": false,
    "feet_min_y": 0.541,
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
      "type": "knee_above_hip",
      "side": "R"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -71.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~82° (lateral); shoulder extended ~72° behind; elbow bent ~42°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74654999999984 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -53° (+: forward), lateral -28° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch -53° (+: forward/down), roll 16° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 16° (+: left hip lower), yaw 26°, anterior/posterior tilt proxy 36° (low confidence).
- L arm: Left arm: arm abducted ~82° (lateral); shoulder extended ~72° behind; elbow bent ~42°.
- R arm: Right arm: arm abducted ~74° (lateral); elbow bent ~65°.
- L leg: Left leg: thigh forward ~104° (hip flexion); knee bent ~49°.
- R leg: Right leg: thigh forward ~110° (hip flexion); abducted ~132° outward; knee bent ~40°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-71.6,"band":[-60,180],"ctx":"Left arm: arm abducted ~82° (lateral); shoulder extended ~72° behind; elbow bent ~42°.","verdict":"outside_band_review"}]