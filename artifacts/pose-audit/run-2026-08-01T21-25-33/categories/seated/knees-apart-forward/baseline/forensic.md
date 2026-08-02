# Forensic Baseline — knees-apart-forward
- name: Knees Apart Forward
- category: seated | difficulty: Beginner | angle: Front
- instructions: Sit on the front edge of the seat with knees apart and forearms resting on the thighs. Lean a few degrees forward from the hips while keeping the spine straight and the gaze direct into the lens.
- tip: Keep the spine straight through the lean — rounded shoulders undercut this pose's confident intent.

## Raw joint config
```json
{
  "spine": 12,
  "leftElbow": 81,
  "rightElbow": 81,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 80,
  "rightKnee": 80,
  "rightShoulder": -12,
  "neck": -6,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 12.1,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch 12° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 12,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 21.9,
    "shoulder_sagittal_flexion_deg": -14.8,
    "elbow_flexion_deg": 30.6,
    "forearm_forward_deg": 17.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 36,
    "shoulder_sagittal_flexion_deg": -10,
    "elbow_flexion_deg": 43.9,
    "forearm_forward_deg": 32.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~36°; elbow bent ~44°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 80,
    "foot_forward_deg": -143.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (80°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 80,
    "foot_forward_deg": -143.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (80°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.486,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.486,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.069,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.486,
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
| auto | true | 91.4940000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 12° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; elbow bent ~31°.
- R arm: Right arm: arm abducted ~36°; elbow bent ~44°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (80°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (80°).
- Balance: COM over foot support base. (floating=true)