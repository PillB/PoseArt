# Forensic Baseline — floor-side-extend
- name: Floor Side Extend
- category: seated | difficulty: Intermediate | angle: Side
- instructions: Sit on the floor and extend one leg straight out to the side while the other bends in toward the body. Reach the same-side arm along the extended leg, stretching the torso into one long line.
- tip: Flex the extended foot rather than pointing it — it reads as more intentional in stills.

## Raw joint config
```json
{
  "spine": 12,
  "leftShoulder": 20,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 100,
  "rightKnee": 100,
  "neck": -3.3,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 12,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch 12° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
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
    "shoulder_abduction_deg": 1.9,
    "shoulder_sagittal_flexion_deg": -11.4,
    "elbow_flexion_deg": 10.2,
    "forearm_forward_deg": -5.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 24.1,
    "shoulder_sagittal_flexion_deg": -9.9,
    "elbow_flexion_deg": 17.4,
    "forearm_forward_deg": 8.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~24°; elbow bent ~17°."
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
    "com_z": 0.069,
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
| auto | true | 92.99708999999994 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 12° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; elbow straight.
- R arm: Right arm: arm abducted ~24°; elbow bent ~17°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (100°).
- Balance: COM over foot support base. (floating=true)