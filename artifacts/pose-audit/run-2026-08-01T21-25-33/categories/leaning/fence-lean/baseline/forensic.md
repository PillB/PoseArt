# Forensic Baseline — fence-lean
- name: Fence Lean
- category: leaning | difficulty: Beginner | angle: 3/4 View
- instructions: Rest both forearms flat on the top rail of a fence, leaning the torso forward with weight sunk fully into the rail rather than hovering above it. Cross one foot behind the other for a casual stance.
- tip: Sink real weight into the fence rather than hovering above it — that's what reads as natural.

## Raw joint config
```json
{
  "spine": 28,
  "hips": 5,
  "neck": -4,
  "leftShoulder": -55,
  "rightShoulder": -50,
  "leftElbow": 95,
  "rightElbow": 95,
  "hipAbductL": 10,
  "hipAbductR": -12,
  "leftKnee": 10,
  "rightKnee": 10,
  "shoulderFwdL": 35,
  "shoulderFwdR": 30
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 28.1,
    "yaw_deg": 0,
    "roll_deg": -4,
    "description": "Head pitch 28° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 28,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 28° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 5,
    "yaw_deg": 0,
    "description": "Pelvic list 5° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 72.8,
    "shoulder_sagittal_flexion_deg": -80.2,
    "elbow_flexion_deg": 92.6,
    "forearm_forward_deg": 71,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~73° (lateral); shoulder extended ~80° behind; elbow ~right-angle (93°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 67.3,
    "shoulder_sagittal_flexion_deg": -74.4,
    "elbow_flexion_deg": 90.6,
    "forearm_forward_deg": 66.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~67° (lateral); shoulder extended ~74° behind; elbow ~right-angle (91°)."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -15,
    "knee_flexion_deg": 10,
    "foot_forward_deg": 67.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 17,
    "knee_flexion_deg": 10,
    "foot_forward_deg": 67.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~17° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.826,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.805,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.155,
    "foot_x_range": [
      0.077,
      0.448
    ],
    "over_support": false,
    "feet_min_y": -0.826,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -80.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~73° (lateral); shoulder extended ~80° behind; elbow ~right-angle (93°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -74.4,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~67° (lateral); shoulder extended ~74° behind; elbow ~right-angle (91°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.50300000000006 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 28° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 28° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 5° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~73° (lateral); shoulder extended ~80° behind; elbow ~right-angle (93°).
- R arm: Right arm: arm abducted ~67° (lateral); shoulder extended ~74° behind; elbow ~right-angle (91°).
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; abducted ~17° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-80.2,"band":[-60,180],"ctx":"Left arm: arm abducted ~73° (lateral); shoulder extended ~80° behind; elbow ~right-angle (93°).","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-74.4,"band":[-60,180],"ctx":"Right arm: arm abducted ~67° (lateral); shoulder extended ~74° behind; elbow ~right-angle (91°).","verdict":"outside_band_review"}]