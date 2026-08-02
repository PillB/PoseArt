# Forensic Baseline — swivel-twist
- name: Swivel Twist
- category: seated | difficulty: Intermediate | angle: 3/4 View
- instructions: Sit with the legs facing one direction while twisting the ribcage toward camera, keeping the hips anchored in place. Rest one arm along the chair back to support and emphasize the twist.
- tip: Initiate the twist from the waist with hips anchored — that separation creates the most flattering torque.

## Raw joint config
```json
{
  "spine": 20,
  "neck": -2.4,
  "leftElbow": 70,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "rightElbow": 18,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 20,
    "yaw_deg": 0,
    "roll_deg": -2.4,
    "description": "Head pitch 20° (+: forward/down), roll -2° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 20,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 21.8,
    "shoulder_sagittal_flexion_deg": -22.6,
    "elbow_flexion_deg": 31.1,
    "forearm_forward_deg": 10.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; shoulder extended ~23° behind; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 37.4,
    "shoulder_sagittal_flexion_deg": -19.1,
    "elbow_flexion_deg": 10.3,
    "forearm_forward_deg": -6.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~37°; shoulder extended ~19° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -133.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -133.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.489,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.489,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.113,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.489,
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
| auto | true | 89.99100000000013 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 20° (+: forward/down), roll -2° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; shoulder extended ~23° behind; elbow bent ~31°.
- R arm: Right arm: arm abducted ~37°; shoulder extended ~19° behind; elbow straight.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)