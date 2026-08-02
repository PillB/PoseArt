# Forensic Baseline — kneeling-lean-hands-floor
- name: Kneeling Lean Hands Floor
- category: kneeling | difficulty: Intermediate | angle: 3/4 View
- instructions: Kneel and fold the torso forward over the thighs, extending both arms fully along the floor rather than tucking them close. This restful, child's-pose shape reads soft and grounded.
- tip: Extend the arms fully forward — tucking them close to the sides shortens the overall shape.

## Raw joint config
```json
{
  "spine": 18,
  "neck": -6,
  "leftShoulder": -10,
  "leftElbow": 70,
  "rightShoulder": 8,
  "rightElbow": 50,
  "leftKnee": 100,
  "leftAnkle": -35,
  "rightHip": 70,
  "rightKnee": 100,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 18.1,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch 18° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 33.9,
    "shoulder_sagittal_flexion_deg": -19.7,
    "elbow_flexion_deg": 38.7,
    "forearm_forward_deg": 24.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~34°; shoulder extended ~20° behind; elbow bent ~39°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 15.9,
    "shoulder_sagittal_flexion_deg": -17.2,
    "elbow_flexion_deg": 16.6,
    "forearm_forward_deg": -0.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~16°; shoulder extended ~17° behind; elbow bent ~17°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 98.2,
    "foot_forward_deg": 121.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee ~right-angle (98°)."
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
      "y": -0.229,
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
    "com_z": 0.102,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.229,
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
| auto | true | 105.74699999999993 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 18° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~34°; shoulder extended ~20° behind; elbow bent ~39°.
- R arm: Right arm: arm abducted ~16°; shoulder extended ~17° behind; elbow bent ~17°.
- L leg: Left leg: thigh near neutral; knee ~right-angle (98°).
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (98°).
- Balance: COM over foot support base. (floating=true)