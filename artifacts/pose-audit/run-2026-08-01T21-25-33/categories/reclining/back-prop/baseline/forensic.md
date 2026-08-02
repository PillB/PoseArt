# Forensic Baseline — back-prop
- name: Backyard Lean
- category: reclining | difficulty: Beginner | angle: 3/4 View
- instructions: Lie on one side propped up on one elbow, top leg straight or bent slightly forward and bottom leg straight beneath it. Rest the head in the raised hand or lift it for a longer neckline.
- tip: Arch the back slightly and lift the head high — it elongates the neck and accentuates curves.

## Raw joint config
```json
{
  "globalTilt": 75,
  "neck": 8,
  "leftShoulder": -100,
  "rightShoulder": -100,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 30,
  "rightHip": 20,
  "leftKnee": 35,
  "rightKnee": 20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 75,
    "yaw_deg": 0,
    "roll_deg": 28.5,
    "description": "Head pitch 75° (+: forward/down), roll 29° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 75,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 75° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -44° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 99.5,
    "shoulder_sagittal_flexion_deg": 105,
    "elbow_flexion_deg": 54.4,
    "forearm_forward_deg": 48.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~99° (lateral); shoulder flexed ~105° forward; elbow bent ~54°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 99.5,
    "shoulder_sagittal_flexion_deg": 105,
    "elbow_flexion_deg": 38.1,
    "forearm_forward_deg": 54.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~99° (lateral); shoulder flexed ~105° forward; elbow bent ~38°."
  },
  "left_leg": {
    "hip_flexion_deg": -45,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 35.1,
    "foot_forward_deg": 46.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~45° behind; knee bent ~35°."
  },
  "right_leg": {
    "hip_flexion_deg": -55,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 20.2,
    "foot_forward_deg": 21.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~55° behind; knee bent ~20°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.804,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.712,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.435,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.804,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
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
      "joint": "left_hip_flexion",
      "value": -45,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~45° behind; knee bent ~35°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -55,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~55° behind; knee bent ~20°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74699999999993 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 75° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 75° (+: forward/down), roll 29° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -44° (low confidence).
- L arm: Left arm: arm abducted ~99° (lateral); shoulder flexed ~105° forward; elbow bent ~54°.
- R arm: Right arm: arm abducted ~99° (lateral); shoulder flexed ~105° forward; elbow bent ~38°.
- L leg: Left leg: thigh extended ~45° behind; knee bent ~35°.
- R leg: Right leg: thigh extended ~55° behind; knee bent ~20°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":-45,"band":[-30,130],"ctx":"Left leg: thigh extended ~45° behind; knee bent ~35°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-55,"band":[-30,130],"ctx":"Right leg: thigh extended ~55° behind; knee bent ~20°.","verdict":"outside_band_review"}]