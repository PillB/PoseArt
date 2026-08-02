# Forensic Baseline — back-angel
- name: Back Angel
- category: reclining | difficulty: Beginner | angle: Front
- instructions: Lie on the back on a soft surface and sweep both arms out and overhead like a snow angel. Let the legs stay together or drift slightly apart.
- tip: Catch this mid-sweep -- motion blur in the arms adds life over a frozen finish.

## Raw joint config
```json
{
  "globalTilt": -85,
  "leftShoulder": -90,
  "rightShoulder": -72,
  "leftElbow": 70,
  "rightElbow": 78,
  "leftHip": 25,
  "rightHip": 25
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -85,
    "yaw_deg": 0,
    "roll_deg": 0,
    "description": "Head pitch -85° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
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
    "shoulder_abduction_deg": 92.1,
    "shoulder_sagittal_flexion_deg": -95,
    "elbow_flexion_deg": 64.4,
    "forearm_forward_deg": -163.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~92° (lateral); shoulder extended ~95° behind; elbow bent ~64°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 90.4,
    "shoulder_sagittal_flexion_deg": -95,
    "elbow_flexion_deg": 77.8,
    "forearm_forward_deg": 177.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~90° (lateral); shoulder extended ~95° behind; elbow ~right-angle (78°)."
  },
  "left_leg": {
    "hip_flexion_deg": 110,
    "hip_abduction_deg": 180,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 171.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~110° (hip flexion); abducted ~180° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 110,
    "hip_abduction_deg": 180,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 171.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~110° (hip flexion); abducted ~180° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.471,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.471,
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
    "feet_min_y": 0.471,
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
      "joint": "left_shoulder_flexion",
      "value": -95,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~92° (lateral); shoulder extended ~95° behind; elbow bent ~64°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -95,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~90° (lateral); shoulder extended ~95° behind; elbow ~right-angle (78°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 112.24405999999993 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -85° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm abducted ~92° (lateral); shoulder extended ~95° behind; elbow bent ~64°.
- R arm: Right arm: arm abducted ~90° (lateral); shoulder extended ~95° behind; elbow ~right-angle (78°).
- L leg: Left leg: thigh forward ~110° (hip flexion); abducted ~180° outward; knee straight.
- R leg: Right leg: thigh forward ~110° (hip flexion); abducted ~180° outward; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-95,"band":[-60,180],"ctx":"Left arm: arm abducted ~92° (lateral); shoulder extended ~95° behind; elbow bent ~64°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-95,"band":[-60,180],"ctx":"Right arm: arm abducted ~90° (lateral); shoulder extended ~95° behind; elbow ~right-angle (78°).","verdict":"outside_band_review"}]