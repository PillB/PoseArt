# Forensic Baseline — drowsy-recline
- name: Drowsy Recline
- category: reclining | difficulty: Beginner | angle: Side
- instructions: Recline on one elbow with both knees tucked toward the same side, creating a soft spiral through the lower body. Rest the free arm along the thigh, eyes heavy-lidded.
- tip: The spiral between a camera-facing torso and turned-away legs gives this its editorial polish.

## Raw joint config
```json
{
  "globalTilt": 60,
  "spine": -8,
  "neck": 3,
  "leftShoulder": -20,
  "rightShoulder": -8,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 60,
  "rightHip": 60,
  "leftKnee": 50,
  "rightKnee": 50
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 52,
    "yaw_deg": 0,
    "roll_deg": 4.8,
    "description": "Head pitch 52° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 52,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 52° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -40.9,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -41° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 55,
    "shoulder_sagittal_flexion_deg": -50,
    "elbow_flexion_deg": 42.9,
    "forearm_forward_deg": -19.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~55°; shoulder extended ~50° behind; elbow bent ~43°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 43.7,
    "shoulder_sagittal_flexion_deg": -51.4,
    "elbow_flexion_deg": 23.2,
    "forearm_forward_deg": -33.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~44°; shoulder extended ~51° behind; elbow bent ~23°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 50.1,
    "foot_forward_deg": 106.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee bent ~50°."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 50.1,
    "foot_forward_deg": 106.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee bent ~50°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.634,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.634,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.364,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.634,
    "floating": false,
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
| auto | true | 112.24225999999973 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 52° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 52° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -41° (low confidence).
- L arm: Left arm: arm abducted ~55°; shoulder extended ~50° behind; elbow bent ~43°.
- R arm: Right arm: arm abducted ~44°; shoulder extended ~51° behind; elbow bent ~23°.
- L leg: Left leg: thigh near neutral; knee bent ~50°.
- R leg: Right leg: thigh near neutral; knee bent ~50°.
- Balance: COM over foot support base. (floating=false)