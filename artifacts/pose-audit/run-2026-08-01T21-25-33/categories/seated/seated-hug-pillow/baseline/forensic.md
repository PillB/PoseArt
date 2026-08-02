# Forensic Baseline — seated-hug-pillow
- name: Seated Hug Pillow
- category: seated | difficulty: Beginner | angle: 3/4 View
- instructions: Sit and hug a pillow or cushion loosely against the chest, resting the chin on top of it. Let the knees draw up slightly and shoulders soften for a cozy, unguarded mood.
- tip: A real prop like a pillow gives the hands purpose and removes any awkward, empty-handed stiffness — it solves the what-do-I-do-with-my-hands problem.

## Raw joint config
```json
{
  "spine": -10,
  "neck": -10,
  "leftElbow": 100,
  "rightElbow": 100,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "rightShoulder": -12,
  "shoulderFwdL": 12,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -10.2,
    "yaw_deg": 0,
    "roll_deg": -10,
    "description": "Head pitch -10° (+: forward/down), roll -10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -10,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -10° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 24.5,
    "shoulder_sagittal_flexion_deg": 4.8,
    "elbow_flexion_deg": 36.7,
    "forearm_forward_deg": 21.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~24°; elbow bent ~37°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 33.4,
    "shoulder_sagittal_flexion_deg": 17.6,
    "elbow_flexion_deg": 52.8,
    "forearm_forward_deg": 28.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~33°; shoulder flexed ~18° forward; elbow bent ~53°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -148.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -148.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.512,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.512,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.057,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.512,
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
| auto | true | 90.74699999999993 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -10° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -10° (+: forward/down), roll -10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~24°; elbow bent ~37°.
- R arm: Right arm: arm abducted ~33°; shoulder flexed ~18° forward; elbow bent ~53°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)