# Forensic Baseline — floor-prop-back
- name: Floor Prop Back
- category: seated | difficulty: Beginner | angle: Side
- instructions: Sit on the floor and lean back on both forearms, angled slightly behind the hips rather than directly under the shoulders. Tilt the head back a few degrees and let the chest open upward.
- tip: Angle the forearms slightly behind the hips, not under the shoulders, for a more relaxed lean-back line.

## Raw joint config
```json
{
  "spine": -18,
  "neck": 8,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -18.2,
    "yaw_deg": 0,
    "roll_deg": 8,
    "description": "Head pitch -18° (+: forward/down), roll 8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 25.6,
    "shoulder_sagittal_flexion_deg": 15,
    "elbow_flexion_deg": 30.5,
    "forearm_forward_deg": 26.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~26°; shoulder flexed ~15° forward; elbow bent ~30°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.6,
    "shoulder_sagittal_flexion_deg": 23.2,
    "elbow_flexion_deg": 28.4,
    "forearm_forward_deg": 36.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; shoulder flexed ~23° forward; elbow bent ~28°."
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
    "com_z": -0.102,
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
| auto | true | 96.74252999999995 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -18° (+: forward/down), roll 8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~26°; shoulder flexed ~15° forward; elbow bent ~30°.
- R arm: Right arm: arm abducted ~35°; shoulder flexed ~23° forward; elbow bent ~28°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)