# Forensic Baseline — floor-hug-knees
- name: Floor Hug Knees
- category: seated | difficulty: Beginner | angle: Side
- instructions: Sit on the floor and draw both knees fully into the chest, wrapping both arms around the shins. Rest the cheek against a knee and let one foot untuck slightly so it peeks out from the shape.
- tip: Untuck one foot so it peeks out — it stops the silhouette from reading as one tight, closed ball.

## Raw joint config
```json
{
  "spine": -22,
  "neck": -16,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 100,
  "rightKnee": 100,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -22.8,
    "yaw_deg": 0,
    "roll_deg": -16,
    "description": "Head pitch -23° (+: forward/down), roll -16° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -22,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -22° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 26.6,
    "shoulder_sagittal_flexion_deg": 19.1,
    "elbow_flexion_deg": 33.2,
    "forearm_forward_deg": 29.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~27°; shoulder flexed ~19° forward; elbow bent ~33°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 34.8,
    "shoulder_sagittal_flexion_deg": 27.5,
    "elbow_flexion_deg": 29.8,
    "forearm_forward_deg": 38.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; shoulder flexed ~27° forward; elbow bent ~30°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 100,
    "foot_forward_deg": -123.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 100,
    "foot_forward_deg": -123.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.475,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.475,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.124,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.475,
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
| auto | true | 89.99099999999949 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -22° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -23° (+: forward/down), roll -16° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~27°; shoulder flexed ~19° forward; elbow bent ~33°.
- R arm: Right arm: arm abducted ~35°; shoulder flexed ~27° forward; elbow bent ~30°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- Balance: COM over foot support base. (floating=true)