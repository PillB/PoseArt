# Forensic Baseline — kneeling-hug
- name: Kneeling Hug
- category: kneeling | difficulty: Beginner | angle: 3/4 View
- instructions: From a low lunge with one knee down, sweep the back leg up and hold the ankle with the same-side hand while the torso opens toward camera. Warm up thoroughly before this deep backbend.
- tip: Warm up hip and back flexibility first — this deep stretch should never be forced.

## Raw joint config
```json
{
  "spine": -5,
  "neck": 12,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "leftElbow": 100,
  "rightElbow": 100,
  "rightHip": 70,
  "leftKnee": 20,
  "rightKnee": 80,
  "hipAbductL": 8,
  "hipAbductR": 8,
  "shoulderFwdL": 12,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -5.1,
    "yaw_deg": 0,
    "roll_deg": 12,
    "description": "Head pitch -5° (+: forward/down), roll 12° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -5,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 33.1,
    "shoulder_sagittal_flexion_deg": -2.3,
    "elbow_flexion_deg": 48.3,
    "forearm_forward_deg": 30.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~33°; elbow bent ~48°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 13.9,
    "shoulder_sagittal_flexion_deg": 7.3,
    "elbow_flexion_deg": 22.7,
    "forearm_forward_deg": 10.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; elbow bent ~23°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 19.9,
    "foot_forward_deg": 76.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee bent ~20°."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 78.8,
    "foot_forward_deg": -153.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee ~right-angle (79°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.797,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.391,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.029,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.797,
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
| auto | true | 104.99549999999991 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -5° (+: forward/down), roll 12° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~33°; elbow bent ~48°.
- R arm: Right arm: arm at side; elbow bent ~23°.
- L leg: Left leg: thigh near neutral; knee bent ~20°.
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=false)