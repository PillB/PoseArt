# Forensic Baseline — p10-bench-s6-back-view-kneel-lean
- name: Back View Kneeling, Gripping Bench Edge
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Kneel on the bench with your back to the camera. Grip the top edge or back of the bench with one hand for support and let the opposite hip pop out to the side. Turn your head to look back over your shoulder toward the camera.
- tip: Push the hip out further than feels natural — from behind, a subtle hip shift barely reads, so exaggerate it slightly for the camera.

## Raw joint config
```json
{
  "spine": 15,
  "neck": -14.8,
  "hips": 18,
  "leftShoulder": -60,
  "rightShoulder": 20,
  "leftElbow": 75,
  "rightElbow": 30,
  "shoulderFwdL": -15,
  "shoulderFwdR": 10,
  "leftHip": 105,
  "rightHip": 100,
  "leftKnee": 130,
  "rightKnee": 125,
  "leftAnkle": -25,
  "rightAnkle": -25,
  "hipAbductL": -18,
  "hipAbductR": 12,
  "globalTwist": 25,
  "globalRoll": 0,
  "globalTilt": -22
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 0.3,
    "yaw_deg": 0,
    "roll_deg": -15.7,
    "description": "Head pitch 0° (+: forward/down), roll -16° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -6.3,
    "lateral_flexion_deg": -3,
    "axial_rotation_deg": 22.9,
    "description": "Torso flexion -6° (+: forward), lateral -3° (+: figure's right), axial rotation proxy 23°."
  },
  "pelvis": {
    "tilt_deg": 10.9,
    "list_deg": 16,
    "yaw_deg": 26.9,
    "description": "Pelvic list 16° (+: left hip lower), yaw 27°, anterior/posterior tilt proxy 11° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 83.9,
    "shoulder_sagittal_flexion_deg": 78.8,
    "elbow_flexion_deg": 74,
    "forearm_forward_deg": 103,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~84° (lateral); shoulder flexed ~79° forward; elbow bent ~74°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 4.2,
    "shoulder_sagittal_flexion_deg": 6.6,
    "elbow_flexion_deg": 5,
    "forearm_forward_deg": 5.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 129.7,
    "hip_abduction_deg": -150.7,
    "knee_flexion_deg": 129.9,
    "foot_forward_deg": -69.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~130° (hip flexion); knee deeply bent (~130°)."
  },
  "right_leg": {
    "hip_flexion_deg": 126.2,
    "hip_abduction_deg": 139.4,
    "knee_flexion_deg": 124.3,
    "foot_forward_deg": -80.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~126° (hip flexion); abducted ~139° outward; knee deeply bent (~124°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.32,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.456,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.036,
    "com_z": -0.077,
    "foot_x_range": [
      -0.222,
      0.177
    ],
    "over_support": true,
    "feet_min_y": 0.32,
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
| auto | true | 90.73952999999989 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -6° (+: forward), lateral -3° (+: figure's right), axial rotation proxy 23°.
- Head: Head pitch 0° (+: forward/down), roll -16° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 16° (+: left hip lower), yaw 27°, anterior/posterior tilt proxy 11° (low confidence).
- L arm: Left arm: arm abducted ~84° (lateral); shoulder flexed ~79° forward; elbow bent ~74°.
- R arm: Right arm: arm at side; elbow straight.
- L leg: Left leg: thigh forward ~130° (hip flexion); knee deeply bent (~130°).
- R leg: Right leg: thigh forward ~126° (hip flexion); abducted ~139° outward; knee deeply bent (~124°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]