# Forensic Baseline — back-recline-knee-hug
- name: Back Recline Knee Hug
- category: reclining | difficulty: Beginner | angle: 3/4 View
- instructions: Lie on the back and hug one knee up toward the chest with both arms while the other leg stays extended flat. A playful, asymmetrical reclining shape.
- tip: Point the toe of the extended leg to keep the line elegant even in this playful pose.

## Raw joint config
```json
{
  "globalTilt": -85,
  "neck": 15,
  "leftShoulder": -30,
  "leftElbow": 65,
  "rightShoulder": -18,
  "rightElbow": 45,
  "leftHip": 100,
  "leftKnee": 130,
  "rightHip": 100,
  "rightKnee": 130
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -85,
    "yaw_deg": 0,
    "roll_deg": 72,
    "description": "Head pitch -85° (+: forward/down), roll 72° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -85,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 44.9,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 86.2,
    "shoulder_sagittal_flexion_deg": 85,
    "elbow_flexion_deg": 49.9,
    "forearm_forward_deg": 132.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~86° (lateral); shoulder flexed ~85° forward; elbow bent ~50°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 84.2,
    "shoulder_sagittal_flexion_deg": 85,
    "elbow_flexion_deg": 28.4,
    "forearm_forward_deg": 114.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~84° (lateral); shoulder flexed ~85° forward; elbow bent ~28°."
  },
  "left_leg": {
    "hip_flexion_deg": -175,
    "hip_abduction_deg": 180,
    "knee_flexion_deg": 129.9,
    "foot_forward_deg": 11.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~175° behind; abducted ~180° outward; knee deeply bent (~130°)."
  },
  "right_leg": {
    "hip_flexion_deg": -175,
    "hip_abduction_deg": 180,
    "knee_flexion_deg": 129.9,
    "foot_forward_deg": 11.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~175° behind; abducted ~180° outward; knee deeply bent (~130°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.006,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.006,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.448,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.006,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
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
      "joint": "left_hip_flexion",
      "value": -175,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~175° behind; abducted ~180° outward; knee deeply bent (~130°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -175,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~175° behind; abducted ~180° outward; knee deeply bent (~130°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 112.24550000000006 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -85° (+: forward/down), roll 72° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm abducted ~86° (lateral); shoulder flexed ~85° forward; elbow bent ~50°.
- R arm: Right arm: arm abducted ~84° (lateral); shoulder flexed ~85° forward; elbow bent ~28°.
- L leg: Left leg: thigh extended ~175° behind; abducted ~180° outward; knee deeply bent (~130°).
- R leg: Right leg: thigh extended ~175° behind; abducted ~180° outward; knee deeply bent (~130°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":-175,"band":[-30,130],"ctx":"Left leg: thigh extended ~175° behind; abducted ~180° outward; knee deeply bent (~130°).","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-175,"band":[-30,130],"ctx":"Right leg: thigh extended ~175° behind; abducted ~180° outward; knee deeply bent (~130°).","verdict":"outside_band_review"}]