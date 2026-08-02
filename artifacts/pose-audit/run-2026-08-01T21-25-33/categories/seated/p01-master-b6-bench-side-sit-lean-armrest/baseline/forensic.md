# Forensic Baseline — p01-master-b6-bench-side-sit-lean-armrest
- name: Bench Side Sit Lean Toward Armrest
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit sideways on the bench, leaning the upper body toward the armrest. Bend both arms, one on the armrest and the other touching the bench. Bend both knees and cross them at the shin. Tilt the face away from the camera.
- tip: Rotate the torso fully sideways before leaning to keep the shoulder line clean against the armrest.

## Raw joint config
```json
{
  "spine": -15,
  "neck": -10,
  "hips": 8,
  "globalTilt": -18,
  "globalRoll": 25,
  "globalTwist": 30,
  "leftShoulder": -25,
  "rightShoulder": -55,
  "leftElbow": 75,
  "rightElbow": 15,
  "shoulderFwdL": 20,
  "shoulderFwdR": 12,
  "leftHip": 90,
  "rightHip": 95,
  "leftKnee": 110,
  "rightKnee": 105,
  "leftAnkle": 6,
  "rightAnkle": 6,
  "hipAbductL": -8,
  "hipAbductR": -8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -33.9,
    "yaw_deg": 0,
    "roll_deg": -51.7,
    "description": "Head pitch -34° (+: forward/down), roll -52° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -36.2,
    "lateral_flexion_deg": -43,
    "axial_rotation_deg": 26.6,
    "description": "Torso flexion -36° (+: forward), lateral -43° (+: figure's right), axial rotation proxy 27°."
  },
  "pelvis": {
    "tilt_deg": 11.1,
    "list_deg": 25.3,
    "yaw_deg": 28,
    "description": "Pelvic list 25° (+: left hip lower), yaw 28°, anterior/posterior tilt proxy 11° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 17.9,
    "shoulder_sagittal_flexion_deg": 33.6,
    "elbow_flexion_deg": 55.3,
    "forearm_forward_deg": 72.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~18°; shoulder flexed ~34° forward; elbow bent ~55°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 104.1,
    "shoulder_sagittal_flexion_deg": -118.5,
    "elbow_flexion_deg": 15.2,
    "forearm_forward_deg": -151.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~104° (lateral); shoulder extended ~119° behind; elbow bent ~15°."
  },
  "left_leg": {
    "hip_flexion_deg": 120.3,
    "hip_abduction_deg": -148,
    "knee_flexion_deg": 110,
    "foot_forward_deg": -66.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~120° (hip flexion); knee ~right-angle (110°)."
  },
  "right_leg": {
    "hip_flexion_deg": 135,
    "hip_abduction_deg": 143.9,
    "knee_flexion_deg": 100.3,
    "foot_forward_deg": -70.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~135° (hip flexion); abducted ~144° outward; knee ~right-angle (100°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.389,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.603,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.263,
    "com_z": -0.188,
    "foot_x_range": [
      -0.337,
      0.12
    ],
    "over_support": true,
    "feet_min_y": 0.389,
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
    },
    {
      "type": "elbow_above_shoulder",
      "side": "R",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -118.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~104° (lateral); shoulder extended ~119° behind; elbow bent ~15°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 135,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~135° (hip flexion); abducted ~144° outward; knee ~right-angle (100°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.99549999999975 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -36° (+: forward), lateral -43° (+: figure's right), axial rotation proxy 27°.
- Head: Head pitch -34° (+: forward/down), roll -52° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 25° (+: left hip lower), yaw 28°, anterior/posterior tilt proxy 11° (low confidence).
- L arm: Left arm: arm abducted ~18°; shoulder flexed ~34° forward; elbow bent ~55°.
- R arm: Right arm: arm abducted ~104° (lateral); shoulder extended ~119° behind; elbow bent ~15°.
- L leg: Left leg: thigh forward ~120° (hip flexion); knee ~right-angle (110°).
- R leg: Right leg: thigh forward ~135° (hip flexion); abducted ~144° outward; knee ~right-angle (100°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-118.5,"band":[-60,180],"ctx":"Right arm: arm abducted ~104° (lateral); shoulder extended ~119° behind; elbow bent ~15°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":135,"band":[-30,130],"ctx":"Right leg: thigh forward ~135° (hip flexion); abducted ~144° outward; knee ~right-angle (100°).","verdict":"outside_band_review"}]