# Forensic Baseline — kneeling-back-arch
- name: Kneeling Back Arch
- category: kneeling | difficulty: Advanced | angle: Side
- instructions: Kneel with both knees down and press both palms together at chest height. Sit slightly back onto the heels while keeping the spine long, then bow the head forward with shoulders soft.
- tip: Sit slightly back onto the heels while keeping the spine long — it balances stability with elegance.

## Raw joint config
```json
{
  "spine": -30,
  "neck": 18,
  "leftShoulder": -140,
  "rightShoulder": -126,
  "leftElbow": 70,
  "rightElbow": 70,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "leftAnkle": -35,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -31.3,
    "yaw_deg": 0,
    "roll_deg": 18,
    "description": "Head pitch -31° (+: forward/down), roll 18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -30,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -30° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 165.9,
    "shoulder_sagittal_flexion_deg": 151.8,
    "elbow_flexion_deg": 33.3,
    "forearm_forward_deg": 154.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~166° abduction); shoulder flexed ~152° forward; elbow bent ~33°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 151.9,
    "shoulder_sagittal_flexion_deg": 149.5,
    "elbow_flexion_deg": 41.9,
    "forearm_forward_deg": 142.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~152° abduction); shoulder flexed ~150° forward; elbow bent ~42°."
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
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
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
      "y": 0.524,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.165,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.524,
    "floating": true,
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
| auto | true | 105.74555999999997 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -30° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -31° (+: forward/down), roll 18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~166° abduction); shoulder flexed ~152° forward; elbow bent ~33°.
- R arm: Right arm: arm overhead (~152° abduction); shoulder flexed ~150° forward; elbow bent ~42°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]