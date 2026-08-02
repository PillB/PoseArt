# Forensic Baseline — kneeling-hip-sit
- name: Kneeling Hip Sit
- category: kneeling | difficulty: Beginner | angle: Side
- instructions: Kneel upright and hinge the torso forward from the hips, resting both forearms on the thighs. Keep the spine long through the lean, chest open, and the gaze direct.
- tip: Hinge from the hips rather than rounding the upper back to keep the chest open.

## Raw joint config
```json
{
  "spine": 10,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "leftElbow": 70,
  "rightElbow": 50,
  "rightHip": 70,
  "leftKnee": 90,
  "rightKnee": 100,
  "leftAnkle": -35,
  "rightAnkle": -35,
  "neck": -3.3,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 10,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch 10° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 10,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 10° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 33.1,
    "shoulder_sagittal_flexion_deg": -11,
    "elbow_flexion_deg": 36,
    "forearm_forward_deg": 26.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~33°; elbow bent ~36°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 15.1,
    "shoulder_sagittal_flexion_deg": -9.5,
    "elbow_flexion_deg": 12.9,
    "forearm_forward_deg": 3.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~15°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": 111.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 98.2,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee ~right-angle (98°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.323,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.452,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.057,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.323,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 105.00000000000017 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 10° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 10° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~33°; elbow bent ~36°.
- R arm: Right arm: arm abducted ~15°; elbow straight.
- L leg: Left leg: thigh near neutral; knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (98°).
- Balance: COM over foot support base. (floating=true)