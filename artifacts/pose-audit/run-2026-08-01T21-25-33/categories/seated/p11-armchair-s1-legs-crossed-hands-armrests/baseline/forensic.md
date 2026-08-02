# Forensic Baseline — p11-armchair-s1-legs-crossed-hands-armrests
- name: Armchair Crossed Legs Hands on Rests
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit centered in the armchair, cross one leg tightly over the other, rest both hands on the armrests with fingers gently curled over the front edge. Sit tall, chin level, direct gaze to camera.
- tip: Resting the hands on the armrests opens the chest and shoulders — avoid letting the shoulders creep up toward the ears.

## Raw joint config
```json
{
  "spine": 2,
  "neck": -6,
  "hips": 0,
  "globalTilt": 0,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -35,
  "rightShoulder": -47,
  "leftElbow": 100,
  "rightElbow": 100,
  "shoulderFwdL": 10,
  "shoulderFwdR": 10,
  "leftHip": 92,
  "rightHip": 88,
  "leftKnee": 100,
  "rightKnee": 105,
  "leftAnkle": -5,
  "rightAnkle": -10,
  "hipAbductL": -8,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 2,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch 2° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 2,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 2° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 57.3,
    "shoulder_sagittal_flexion_deg": -18.6,
    "elbow_flexion_deg": 79.6,
    "forearm_forward_deg": 55.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~57°; shoulder extended ~19° behind; elbow ~right-angle (80°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 69.4,
    "shoulder_sagittal_flexion_deg": -29.5,
    "elbow_flexion_deg": 91.1,
    "forearm_forward_deg": 67.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~69° (lateral); shoulder extended ~29° behind; elbow ~right-angle (91°)."
  },
  "left_leg": {
    "hip_flexion_deg": 92,
    "hip_abduction_deg": 103.9,
    "knee_flexion_deg": 99.1,
    "foot_forward_deg": -116.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~92° (hip flexion); abducted ~104° outward; knee ~right-angle (99°)."
  },
  "right_leg": {
    "hip_flexion_deg": 88,
    "hip_abduction_deg": 68.3,
    "knee_flexion_deg": 104.7,
    "foot_forward_deg": -120.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~88° (hip flexion); abducted ~68° outward; knee ~right-angle (105°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.538,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.518,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.012,
    "foot_x_range": [
      -0.3,
      0.251
    ],
    "over_support": true,
    "feet_min_y": 0.518,
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
| auto | true | 89.99558999999944 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 2° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 2° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~57°; shoulder extended ~19° behind; elbow ~right-angle (80°).
- R arm: Right arm: arm abducted ~69° (lateral); shoulder extended ~29° behind; elbow ~right-angle (91°).
- L leg: Left leg: thigh forward ~92° (hip flexion); abducted ~104° outward; knee ~right-angle (99°).
- R leg: Right leg: thigh forward ~88° (hip flexion); abducted ~68° outward; knee ~right-angle (105°).
- Balance: COM over foot support base. (floating=true)