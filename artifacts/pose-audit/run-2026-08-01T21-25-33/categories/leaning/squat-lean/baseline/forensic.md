# Forensic Baseline — squat-lean
- name: Squat Lean
- category: leaning | difficulty: Intermediate | angle: 3/4 View
- instructions: Lean the back against the wall and lower into a partial squat, knees tracking directly over the toes. Rest both forearms loosely on the thighs to complete the hold.
- tip: Keep knees tracking over the toes and the back flat on the wall to protect the joints.

## Raw joint config
```json
{
  "spine": -12,
  "leftElbow": 80,
  "rightElbow": 20,
  "leftHip": 60,
  "rightHip": 60,
  "leftKnee": 90,
  "rightKnee": 90,
  "rightShoulder": -12,
  "neck": -3.3,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -12,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch -12° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -12,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 23.1,
    "shoulder_sagittal_flexion_deg": 12.4,
    "elbow_flexion_deg": 32,
    "forearm_forward_deg": 22.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~23°; elbow bent ~32°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.4,
    "shoulder_sagittal_flexion_deg": 16.7,
    "elbow_flexion_deg": 12.6,
    "forearm_forward_deg": 26,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~34°; shoulder flexed ~17° forward; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 60,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -153.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~60°; knee ~right-angle (90°)."
  },
  "right_leg": {
    "hip_flexion_deg": 60,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -153.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~60°; knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.328,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.328,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.069,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.328,
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
| auto | true | 91.49409000000021 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -12° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~23°; elbow bent ~32°.
- R arm: Right arm: arm abducted ~34°; shoulder flexed ~17° forward; elbow straight.
- L leg: Left leg: thigh forward ~60°; knee ~right-angle (90°).
- R leg: Right leg: thigh forward ~60°; knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)