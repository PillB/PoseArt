# Forensic Baseline — kneeling-bow
- name: Kneeling Bow
- category: kneeling | difficulty: Beginner | angle: Side
- instructions: Kneel upright and draw both shoulder blades together, opening the chest wide with arms relaxed at the sides. Lift through the sternum for a confident, grounded posture.
- tip: Lift through the sternum rather than yanking the shoulders back — it reads natural, not military.

## Raw joint config
```json
{
  "spine": 32,
  "neck": 19.2,
  "leftElbow": 65,
  "rightShoulder": -12,
  "rightElbow": 45,
  "leftHip": 80,
  "leftKnee": 90,
  "leftAnkle": -35,
  "rightHip": 80,
  "rightKnee": 90,
  "rightAnkle": -35,
  "shoulderFwdL": 20,
  "shoulderFwdR": 20,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 33.5,
    "yaw_deg": 0,
    "roll_deg": 19.2,
    "description": "Head pitch 33° (+: forward/down), roll 19° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 32,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 32° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 14.2,
    "shoulder_sagittal_flexion_deg": -37.1,
    "elbow_flexion_deg": 36.9,
    "forearm_forward_deg": -7.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder extended ~37° behind; elbow bent ~37°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 26.6,
    "shoulder_sagittal_flexion_deg": -43.3,
    "elbow_flexion_deg": 30.5,
    "forearm_forward_deg": -18.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~27°; shoulder extended ~43° behind; elbow bent ~30°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.175,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.524,
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
| auto | true | 105.00000000000034 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 32° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 33° (+: forward/down), roll 19° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; shoulder extended ~37° behind; elbow bent ~37°.
- R arm: Right arm: arm abducted ~27°; shoulder extended ~43° behind; elbow bent ~30°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- Balance: COM over foot support base. (floating=true)