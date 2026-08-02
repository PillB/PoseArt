# Forensic Baseline — p10-bench-s4-seated-cross-leg-lean-back
- name: Seated Cross-Legged, Leaning Back
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit on the bench with legs crossed at the knee. Lean back slightly, supporting the recline with a relaxed posture, and rest one arm on top of the crossed knee. Look directly at the camera with a confident expression.
- tip: Keep the leaning-back angle subtle — leaning too far turns a confident seated pose into an overly casual slouch.

## Raw joint config
```json
{
  "spine": -10,
  "hips": 0,
  "neck": -6,
  "leftShoulder": 10,
  "rightShoulder": -30,
  "leftElbow": 81,
  "rightElbow": 90,
  "hipAbductL": 10,
  "hipAbductR": -5,
  "leftHip": 100,
  "rightHip": 95,
  "leftKnee": 120,
  "rightKnee": 95,
  "leftAnkle": -15,
  "rightAnkle": 0,
  "shoulderFwdL": 15,
  "shoulderFwdR": -30,
  "globalTilt": -12,
  "globalTwist": -8,
  "globalRoll": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -22.6,
    "yaw_deg": 0,
    "roll_deg": -3.1,
    "description": "Head pitch -23° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -21.8,
    "lateral_flexion_deg": 3.2,
    "axial_rotation_deg": -7.9,
    "description": "Torso flexion -22° (+: forward), lateral 3° (+: figure's right), axial rotation proxy -8°."
  },
  "pelvis": {
    "tilt_deg": 11.6,
    "list_deg": 0,
    "yaw_deg": -7.9,
    "description": "Pelvic list 0° (+: left hip lower), yaw -8°, anterior/posterior tilt proxy 12° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 17.9,
    "shoulder_sagittal_flexion_deg": 15.5,
    "elbow_flexion_deg": 20.7,
    "forearm_forward_deg": 26,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~18°; shoulder flexed ~16° forward; elbow bent ~21°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 47.4,
    "shoulder_sagittal_flexion_deg": 57.1,
    "elbow_flexion_deg": 68.7,
    "forearm_forward_deg": 51.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~47°; shoulder flexed ~57° forward; elbow bent ~69°."
  },
  "left_leg": {
    "hip_flexion_deg": 111.7,
    "hip_abduction_deg": -173.1,
    "knee_flexion_deg": 116.2,
    "foot_forward_deg": -86.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~112° (hip flexion); knee deeply bent (~116°)."
  },
  "right_leg": {
    "hip_flexion_deg": 107,
    "hip_abduction_deg": -171,
    "knee_flexion_deg": 94.8,
    "foot_forward_deg": -101.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~107° (hip flexion); knee ~right-angle (95°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.451,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.593,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.021,
    "com_z": -0.147,
    "foot_x_range": [
      0.002,
      0.235
    ],
    "over_support": true,
    "feet_min_y": 0.451,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "L"
    },
    {
      "type": "knee_above_hip",
      "side": "R"
    }
  ],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.25300000000007 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -22° (+: forward), lateral 3° (+: figure's right), axial rotation proxy -8°.
- Head: Head pitch -23° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw -8°, anterior/posterior tilt proxy 12° (low confidence).
- L arm: Left arm: arm abducted ~18°; shoulder flexed ~16° forward; elbow bent ~21°.
- R arm: Right arm: arm abducted ~47°; shoulder flexed ~57° forward; elbow bent ~69°.
- L leg: Left leg: thigh forward ~112° (hip flexion); knee deeply bent (~116°).
- R leg: Right leg: thigh forward ~107° (hip flexion); knee ~right-angle (95°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]