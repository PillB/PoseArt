# Forensic Baseline — diagonal-lean
- name: Diagonal Lean
- category: leaning | difficulty: Intermediate | angle: 3/4 View
- instructions: Lean the entire body at a steep diagonal against a wall, planting the feet as far from the support point as balance allows. Extend the far arm outward for visual length and counterbalance.
- tip: The further the feet sit from the wall, the steeper and more dramatic the diagonal line becomes.

## Raw joint config
```json
{
  "spine": 26,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -60,
  "leftElbow": 40,
  "rightElbow": 20,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftHip": -10,
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
    "pitch_deg": 26.3,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 26° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 26,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 26° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 85.1,
    "shoulder_sagittal_flexion_deg": -78.6,
    "elbow_flexion_deg": 39.4,
    "forearm_forward_deg": 67.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~85° (lateral); shoulder extended ~79° behind; elbow bent ~39°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 27,
    "shoulder_sagittal_flexion_deg": -24,
    "elbow_flexion_deg": 9.3,
    "forearm_forward_deg": -14.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~27°; shoulder extended ~24° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": -10,
    "hip_abduction_deg": -20.3,
    "knee_flexion_deg": 9.7,
    "foot_forward_deg": 57.9,
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
      "y": -0.832,
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
    "com_z": 0.145,
    "foot_x_range": [
      0.06,
      0.281
    ],
    "over_support": false,
    "feet_min_y": -0.832,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -78.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~85° (lateral); shoulder extended ~79° behind; elbow bent ~39°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 95.24421000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 26° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 26° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~85° (lateral); shoulder extended ~79° behind; elbow bent ~39°.
- R arm: Right arm: arm abducted ~27°; shoulder extended ~24° behind; elbow straight.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-78.6,"band":[-60,180],"ctx":"Left arm: arm abducted ~85° (lateral); shoulder extended ~79° behind; elbow bent ~39°.","verdict":"outside_band_review"}]