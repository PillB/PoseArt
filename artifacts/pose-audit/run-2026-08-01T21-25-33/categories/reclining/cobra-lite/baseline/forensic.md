# Forensic Baseline — cobra-lite
- name: Cobra Lite
- category: reclining | difficulty: Intermediate | angle: Side
- instructions: Lie face down and press through both palms to lift the chest into a gentle backbend, hips staying grounded. Keep elbows slightly bent and the gaze level or lifted.
- tip: Soften the elbows rather than locking them straight -- it keeps the backbend controlled, not strained.

## Raw joint config
```json
{
  "globalTilt": 65,
  "spine": -25,
  "neck": 4.5,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "shoulderFwdL": 25,
  "shoulderFwdR": 25,
  "leftElbow": 81,
  "rightElbow": 81
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 39.9,
    "yaw_deg": 0,
    "roll_deg": 5.3,
    "description": "Head pitch 40° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 40,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 40° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -42.2,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -42° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 55.8,
    "shoulder_sagittal_flexion_deg": -55.2,
    "elbow_flexion_deg": 50.7,
    "forearm_forward_deg": -25.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~56°; shoulder extended ~55° behind; elbow bent ~51°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.6,
    "shoulder_sagittal_flexion_deg": -49.8,
    "elbow_flexion_deg": 36.8,
    "forearm_forward_deg": -40.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; shoulder extended ~50° behind; elbow bent ~37°."
  },
  "left_leg": {
    "hip_flexion_deg": -65,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": -3.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~65° behind; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -65,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": -3.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~65° behind; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.515,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.515,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.321,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.515,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_hip_flexion",
      "value": -65,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~65° behind; knee straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -65,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~65° behind; knee straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 111.50264 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 40° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 40° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -42° (low confidence).
- L arm: Left arm: arm abducted ~56°; shoulder extended ~55° behind; elbow bent ~51°.
- R arm: Right arm: arm abducted ~35°; shoulder extended ~50° behind; elbow bent ~37°.
- L leg: Left leg: thigh extended ~65° behind; knee straight.
- R leg: Right leg: thigh extended ~65° behind; knee straight.
- Balance: COM over foot support base. (floating=false)
- Plausibility flags: [{"joint":"left_hip_flexion","value":-65,"band":[-30,130],"ctx":"Left leg: thigh extended ~65° behind; knee straight.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-65,"band":[-30,130],"ctx":"Right leg: thigh extended ~65° behind; knee straight.","verdict":"outside_band_review"}]