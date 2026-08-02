# Forensic Baseline — belly-up-arms-wide
- name: Belly Up Arms Wide
- category: reclining | difficulty: Beginner | angle: Front
- instructions: Curl onto one side with knees drawn up toward the chest and both hands tucked near the face. Leave a small gap between chin and knees to keep the neck line visible.
- tip: Keep a little space between chin and knees so the neck line stays visible and elegant.

## Raw joint config
```json
{
  "globalTilt": 85,
  "leftShoulder": -70,
  "rightShoulder": -52,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 20,
  "rightHip": 20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 85,
    "yaw_deg": 0,
    "roll_deg": 0,
    "description": "Head pitch 85° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 85,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44.9,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 90.2,
    "shoulder_sagittal_flexion_deg": 95,
    "elbow_flexion_deg": 65,
    "forearm_forward_deg": 5.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~90° (lateral); shoulder flexed ~95° forward; elbow bent ~65°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 88.6,
    "shoulder_sagittal_flexion_deg": -85,
    "elbow_flexion_deg": 43.2,
    "forearm_forward_deg": -19,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~89° (lateral); shoulder extended ~85° behind; elbow bent ~43°."
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
      "y": -0.531,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.531,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.448,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.531,
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
      "joint": "right_shoulder_flexion",
      "value": -85,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~89° (lateral); shoulder extended ~85° behind; elbow bent ~43°.",
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
| auto | true | 112.99250000000016 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 85° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence).
- L arm: Left arm: arm abducted ~90° (lateral); shoulder flexed ~95° forward; elbow bent ~65°.
- R arm: Right arm: arm abducted ~89° (lateral); shoulder extended ~85° behind; elbow bent ~43°.
- L leg: Left leg: thigh extended ~65° behind; knee straight.
- R leg: Right leg: thigh extended ~65° behind; knee straight.
- Balance: COM over foot support base. (floating=false)
- Plausibility flags: [{"joint":"left_hip_flexion","value":-65,"band":[-30,130],"ctx":"Left leg: thigh extended ~65° behind; knee straight.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-85,"band":[-60,180],"ctx":"Right arm: arm abducted ~89° (lateral); shoulder extended ~85° behind; elbow bent ~43°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-65,"band":[-30,130],"ctx":"Right leg: thigh extended ~65° behind; knee straight.","verdict":"outside_band_review"}]