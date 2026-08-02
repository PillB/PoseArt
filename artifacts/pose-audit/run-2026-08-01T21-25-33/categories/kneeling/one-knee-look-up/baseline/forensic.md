# Forensic Baseline — one-knee-look-up
- name: One Knee Look Up
- category: kneeling | difficulty: Beginner | angle: 3/4 View
- instructions: Kneel upright with both knees down, engage the core, then arch the spine backward while reaching both arms overhead and behind you. Let the head follow the arch naturally.
- tip: Engage the core before arching to protect the lower back and keep the movement controlled.

## Raw joint config
```json
{
  "spine": -4,
  "neck": -18,
  "leftShoulder": -110,
  "leftElbow": 70,
  "rightShoulder": -110,
  "rightElbow": 50,
  "leftHip": 80,
  "leftKnee": 90,
  "leftAnkle": -35,
  "rightHip": 0,
  "rightKnee": 10,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -4.2,
    "yaw_deg": 0,
    "roll_deg": -18,
    "description": "Head pitch -4° (+: forward/down), roll -18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -4,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -4° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 132.9,
    "shoulder_sagittal_flexion_deg": 174.6,
    "elbow_flexion_deg": 50.7,
    "forearm_forward_deg": 131.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~133° abduction); shoulder flexed ~175° forward; elbow bent ~51°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 132.9,
    "shoulder_sagittal_flexion_deg": 174.6,
    "elbow_flexion_deg": 36.8,
    "forearm_forward_deg": 136.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~133° abduction); shoulder flexed ~175° forward; elbow bent ~37°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 10.2,
    "foot_forward_deg": 66.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.84,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.023,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.84,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    },
    {
      "type": "elbow_above_shoulder",
      "side": "R",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 106.48950000000026 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -4° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -4° (+: forward/down), roll -18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~133° abduction); shoulder flexed ~175° forward; elbow bent ~51°.
- R arm: Right arm: arm overhead (~133° abduction); shoulder flexed ~175° forward; elbow bent ~37°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]