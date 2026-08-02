# Forensic Baseline — tree-lean
- name: Tree Lean
- category: leaning | difficulty: Beginner | angle: 3/4 View
- instructions: Lean the upper back and one shoulder against the tree trunk, planting one foot flat while the other bends with the sole resting against the bark. Push the hips slightly forward of the shoulders for a flattering angle.
- tip: Push the hips slightly ahead of the shoulders against the trunk for a more flattering lean line.

## Raw joint config
```json
{
  "spine": 14,
  "hips": 16,
  "neck": -8.8,
  "leftShoulder": -6,
  "leftElbow": 40,
  "rightElbow": 20,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftKnee": 65,
  "rightKnee": 10,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 14.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 15.4,
    "yaw_deg": 0,
    "description": "Pelvic list 15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 29.7,
    "shoulder_sagittal_flexion_deg": -14.2,
    "elbow_flexion_deg": 19.3,
    "forearm_forward_deg": 7.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~30°; elbow bent ~19°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 24.4,
    "shoulder_sagittal_flexion_deg": -11.9,
    "elbow_flexion_deg": 7.6,
    "forearm_forward_deg": -3.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~24°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -26,
    "knee_flexion_deg": 57.1,
    "foot_forward_deg": 124.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee bent ~57°."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 6,
    "knee_flexion_deg": 10.3,
    "foot_forward_deg": 66.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.447,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.81,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.08,
    "foot_x_range": [
      0.162,
      0.38
    ],
    "over_support": false,
    "feet_min_y": -0.81,
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
| auto | true | 89.99550000000006 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~30°; elbow bent ~19°.
- R arm: Right arm: arm abducted ~24°; elbow straight.
- L leg: Left leg: thigh near neutral; knee bent ~57°.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)