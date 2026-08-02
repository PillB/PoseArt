# Forensic Baseline — feet-up
- name: Feet Up
- category: seated | difficulty: Beginner | angle: 3/4 View
- instructions: Recline back into the seat and prop both feet on a nearby surface, letting the spine sink into a relaxed curve. Rest one arm behind the head, elbow winged out, for an off-duty read.
- tip: Add a slight smile and drop the shoulders — tension in the face undercuts the casual mood.

## Raw joint config
```json
{
  "spine": -12,
  "neck": 6,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 130,
  "rightKnee": 130,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -12.1,
    "yaw_deg": 0,
    "roll_deg": 6,
    "description": "Head pitch -12° (+: forward/down), roll 6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
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
    "shoulder_abduction_deg": 24.4,
    "shoulder_sagittal_flexion_deg": 9,
    "elbow_flexion_deg": 26.9,
    "forearm_forward_deg": 23.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~24°; elbow bent ~27°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.4,
    "shoulder_sagittal_flexion_deg": 16.7,
    "elbow_flexion_deg": 26.6,
    "forearm_forward_deg": 33,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~34°; shoulder flexed ~17° forward; elbow bent ~27°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 129.9,
    "foot_forward_deg": -93.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee deeply bent (~130°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 129.9,
    "foot_forward_deg": -93.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee deeply bent (~130°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.348,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.348,
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
    "feet_min_y": 0.348,
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
| auto | true | 91.49850000000013 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -12° (+: forward/down), roll 6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~24°; elbow bent ~27°.
- R arm: Right arm: arm abducted ~34°; shoulder flexed ~17° forward; elbow bent ~27°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee deeply bent (~130°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee deeply bent (~130°).
- Balance: COM over foot support base. (floating=true)