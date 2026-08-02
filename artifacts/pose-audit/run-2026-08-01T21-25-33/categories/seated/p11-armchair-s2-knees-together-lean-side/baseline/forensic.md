# Forensic Baseline — p11-armchair-s2-knees-together-lean-side
- name: Armchair Knees Together Side Lean
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit in the chair with both knees together and swept slightly to one side, torso leaning gently toward the opposite side, one hand resting on the armrest, the other resting near the hip or thigh. Head turns slightly to camera.
- tip: The lean of the torso should counter the sweep of the knees for a graceful S-curve through the body.

## Raw joint config
```json
{
  "spine": -12,
  "neck": -8,
  "hips": -5,
  "globalTilt": -18,
  "globalRoll": -8,
  "globalTwist": 10,
  "leftShoulder": -45,
  "rightShoulder": -30,
  "leftElbow": 100,
  "rightElbow": 70,
  "shoulderFwdL": 10,
  "shoulderFwdR": 5,
  "leftHip": 90,
  "rightHip": 92,
  "leftKnee": 98,
  "rightKnee": 100,
  "leftAnkle": -5,
  "rightAnkle": -5,
  "hipAbductL": -15,
  "hipAbductR": -15
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -27.9,
    "yaw_deg": 0,
    "roll_deg": -6.4,
    "description": "Head pitch -28° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -29.5,
    "lateral_flexion_deg": 2.3,
    "axial_rotation_deg": 9.9,
    "description": "Torso flexion -30° (+: forward), lateral 2° (+: figure's right), axial rotation proxy 10°."
  },
  "pelvis": {
    "tilt_deg": 17.7,
    "list_deg": -12.4,
    "yaw_deg": 8.3,
    "description": "Pelvic list -12° (+: left hip lower), yaw 8°, anterior/posterior tilt proxy 18° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 77.4,
    "shoulder_sagittal_flexion_deg": 55.3,
    "elbow_flexion_deg": 90.5,
    "forearm_forward_deg": 80.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~77° (lateral); shoulder flexed ~55° forward; elbow ~right-angle (91°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 50.2,
    "shoulder_sagittal_flexion_deg": 13.7,
    "elbow_flexion_deg": 55,
    "forearm_forward_deg": 66.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~50°; elbow bent ~55°."
  },
  "left_leg": {
    "hip_flexion_deg": 108.4,
    "hip_abduction_deg": 156,
    "knee_flexion_deg": 91.3,
    "foot_forward_deg": -104.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~108° (hip flexion); abducted ~156° outward; knee ~right-angle (91°)."
  },
  "right_leg": {
    "hip_flexion_deg": 108.1,
    "hip_abduction_deg": 127.4,
    "knee_flexion_deg": 98.5,
    "foot_forward_deg": -98.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~108° (hip flexion); abducted ~127° outward; knee ~right-angle (98°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.624,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.521,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.021,
    "com_z": -0.199,
    "foot_x_range": [
      -0.396,
      0.403
    ],
    "over_support": true,
    "feet_min_y": 0.521,
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
| auto | true | 90.7451999999999 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -30° (+: forward), lateral 2° (+: figure's right), axial rotation proxy 10°.
- Head: Head pitch -28° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -12° (+: left hip lower), yaw 8°, anterior/posterior tilt proxy 18° (low confidence).
- L arm: Left arm: arm abducted ~77° (lateral); shoulder flexed ~55° forward; elbow ~right-angle (91°).
- R arm: Right arm: arm abducted ~50°; elbow bent ~55°.
- L leg: Left leg: thigh forward ~108° (hip flexion); abducted ~156° outward; knee ~right-angle (91°).
- R leg: Right leg: thigh forward ~108° (hip flexion); abducted ~127° outward; knee ~right-angle (98°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]