# Forensic Baseline — p11-armchair-s6-kneeling-back-view-armrest-grip
- name: Armchair Kneeling Back View Armrest Grip
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Kneel on the chair seat facing the back of the chair, one hand gripping the top of the backrest, the other resting on the hip. Arch the back slightly, turn the head to look back over the shoulder toward camera.
- tip: Keep weight balanced through both knees on the cushion — this is an advanced pose requiring core engagement to hold the back arch safely.

## Raw joint config
```json
{
  "spine": -18,
  "neck": -20,
  "hips": -16,
  "globalTilt": -15,
  "globalRoll": 10,
  "globalTwist": 50,
  "leftShoulder": -140,
  "rightShoulder": -20,
  "leftElbow": 45,
  "rightElbow": 75,
  "shoulderFwdL": 15,
  "shoulderFwdR": 10,
  "leftHip": 118,
  "rightHip": 118,
  "leftKnee": 140,
  "rightKnee": 138,
  "leftAnkle": -30,
  "rightAnkle": -28,
  "hipAbductL": 10,
  "hipAbductR": 10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -7.8,
    "yaw_deg": 0,
    "roll_deg": -48.1,
    "description": "Head pitch -8° (+: forward/down), roll -48° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -24.9,
    "lateral_flexion_deg": -36.4,
    "axial_rotation_deg": 37.5,
    "description": "Torso flexion -25° (+: forward), lateral -36° (+: figure's right), axial rotation proxy 37°."
  },
  "pelvis": {
    "tilt_deg": 20.4,
    "list_deg": -8.3,
    "yaw_deg": 34.6,
    "description": "Pelvic list -8° (+: left hip lower), yaw 35°, anterior/posterior tilt proxy 20° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 155.6,
    "shoulder_sagittal_flexion_deg": 165.6,
    "elbow_flexion_deg": 16.6,
    "forearm_forward_deg": 169,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~156° abduction); shoulder flexed ~166° forward; elbow bent ~17°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 58.7,
    "shoulder_sagittal_flexion_deg": -33.2,
    "elbow_flexion_deg": 52.1,
    "forearm_forward_deg": 54.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~59°; shoulder extended ~33° behind; elbow bent ~52°."
  },
  "left_leg": {
    "hip_flexion_deg": 144,
    "hip_abduction_deg": -154.2,
    "knee_flexion_deg": 139,
    "foot_forward_deg": -40.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~144° (hip flexion); knee deeply bent (~139°)."
  },
  "right_leg": {
    "hip_flexion_deg": 130.3,
    "hip_abduction_deg": 170.1,
    "knee_flexion_deg": 112,
    "foot_forward_deg": -28,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~130° (hip flexion); abducted ~170° outward; knee ~right-angle (112°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.221,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.133,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.227,
    "com_z": -0.135,
    "foot_x_range": [
      -0.455,
      -0.322
    ],
    "over_support": false,
    "feet_min_y": 0.133,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
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
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_hip_flexion",
      "value": 144,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~144° (hip flexion); knee deeply bent (~139°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.75149999999987 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -25° (+: forward), lateral -36° (+: figure's right), axial rotation proxy 37°.
- Head: Head pitch -8° (+: forward/down), roll -48° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -8° (+: left hip lower), yaw 35°, anterior/posterior tilt proxy 20° (low confidence).
- L arm: Left arm: arm overhead (~156° abduction); shoulder flexed ~166° forward; elbow bent ~17°.
- R arm: Right arm: arm abducted ~59°; shoulder extended ~33° behind; elbow bent ~52°.
- L leg: Left leg: thigh forward ~144° (hip flexion); knee deeply bent (~139°).
- R leg: Right leg: thigh forward ~130° (hip flexion); abducted ~170° outward; knee ~right-angle (112°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":144,"band":[-30,130],"ctx":"Left leg: thigh forward ~144° (hip flexion); knee deeply bent (~139°).","verdict":"outside_band_review"}]