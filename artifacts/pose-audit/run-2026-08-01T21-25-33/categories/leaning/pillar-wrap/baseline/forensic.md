# Forensic Baseline — pillar-wrap
- name: Pillar Wrap
- category: leaning | difficulty: Intermediate | angle: 3/4 View
- instructions: Stand beside a pillar and wrap one arm fully around it, leaning body weight into the wrap. Cross the opposite leg in front, creating a spiraled, editorial line through the torso.
- tip: The wrapping arm should look like it's holding real weight, not just resting against the surface

## Raw joint config
```json
{
  "spine": 18,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -50,
  "leftElbow": 100,
  "rightElbow": 20,
  "hipAbductL": 10,
  "hipAbductR": -10,
  "leftHip": 10,
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
    "pitch_deg": 18.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 18° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 74,
    "shoulder_sagittal_flexion_deg": -45.3,
    "elbow_flexion_deg": 94.1,
    "forearm_forward_deg": 72.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~74° (lateral); shoulder extended ~45° behind; elbow ~right-angle (94°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 25.1,
    "shoulder_sagittal_flexion_deg": -15.9,
    "elbow_flexion_deg": 8,
    "forearm_forward_deg": -7.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~25°; shoulder extended ~16° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 10,
    "hip_abduction_deg": -20.3,
    "knee_flexion_deg": 9.7,
    "foot_forward_deg": 77.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 20,
    "knee_flexion_deg": 9.9,
    "foot_forward_deg": 67.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~20° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.763,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.779,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.102,
    "foot_x_range": [
      0.161,
      0.499
    ],
    "over_support": false,
    "feet_min_y": -0.779,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49400000000003 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 18° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~74° (lateral); shoulder extended ~45° behind; elbow ~right-angle (94°).
- R arm: Right arm: arm abducted ~25°; shoulder extended ~16° behind; elbow straight.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; abducted ~20° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)