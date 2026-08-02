# Forensic Baseline — p13-floor-s3-side-seated-look-away
- name: Side-Seated with Cascading Hair
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Sit on the floor with legs crossed and turned to one side, showing the back and side of the torso to the camera. Place one hand flat on the floor behind you for support and rest the other hand on top of the bent knee. Turn the head to look away over the shoulder, letting long hair cascade down the b
- tip: Lengthen through the supporting arm and lift the ribcage away from the hips so the side-seated silhouette reads as elongated, not slouched.

## Raw joint config
```json
{
  "spine": 8,
  "neck": -11,
  "hips": 4,
  "leftShoulder": -65,
  "rightShoulder": 15,
  "leftElbow": 12,
  "rightElbow": 85,
  "shoulderFwdL": -30,
  "shoulderFwdR": 15,
  "leftHip": 100,
  "rightHip": 105,
  "leftKnee": 132,
  "rightKnee": 130,
  "leftAnkle": -8,
  "rightAnkle": -8,
  "hipAbductL": 22,
  "hipAbductR": -20,
  "globalTwist": -35,
  "globalRoll": 6,
  "globalTilt": -60
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -49.5,
    "yaw_deg": 0,
    "roll_deg": 19.4,
    "description": "Head pitch -49° (+: forward/down), roll 19° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -44.4,
    "lateral_flexion_deg": 30.3,
    "axial_rotation_deg": -29.8,
    "description": "Torso flexion -44° (+: forward), lateral 30° (+: figure's right), axial rotation proxy -30°."
  },
  "pelvis": {
    "tilt_deg": 36.8,
    "list_deg": 7.1,
    "yaw_deg": -27.6,
    "description": "Pelvic list 7° (+: left hip lower), yaw -28°, anterior/posterior tilt proxy 37° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 103.7,
    "shoulder_sagittal_flexion_deg": -122.6,
    "elbow_flexion_deg": 12.1,
    "forearm_forward_deg": -152.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~104° (lateral); shoulder extended ~123° behind; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": -23.7,
    "shoulder_sagittal_flexion_deg": 46.1,
    "elbow_flexion_deg": 12.4,
    "forearm_forward_deg": 58.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder flexed ~46° forward; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 149.6,
    "hip_abduction_deg": -173.8,
    "knee_flexion_deg": 108.5,
    "foot_forward_deg": -5.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~150° (hip flexion); knee ~right-angle (108°)."
  },
  "right_leg": {
    "hip_flexion_deg": 154.6,
    "hip_abduction_deg": 173.4,
    "knee_flexion_deg": 113.6,
    "foot_forward_deg": -4.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~155° (hip flexion); abducted ~173° outward; knee ~right-angle (114°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.154,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.169,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.18,
    "com_z": -0.298,
    "foot_x_range": [
      0.337,
      0.645
    ],
    "over_support": false,
    "feet_min_y": 0.154,
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
      "joint": "left_shoulder_flexion",
      "value": -122.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~104° (lateral); shoulder extended ~123° behind; elbow straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": 149.6,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~150° (hip flexion); knee ~right-angle (108°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_abduction",
      "value": -23.7,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder flexed ~46° forward; elbow straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 154.6,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~155° (hip flexion); abducted ~173° outward; knee ~right-angle (114°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74358000000022 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -44° (+: forward), lateral 30° (+: figure's right), axial rotation proxy -30°.
- Head: Head pitch -49° (+: forward/down), roll 19° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 7° (+: left hip lower), yaw -28°, anterior/posterior tilt proxy 37° (low confidence).
- L arm: Left arm: arm abducted ~104° (lateral); shoulder extended ~123° behind; elbow straight.
- R arm: Right arm: arm at side; shoulder flexed ~46° forward; elbow straight.
- L leg: Left leg: thigh forward ~150° (hip flexion); knee ~right-angle (108°).
- R leg: Right leg: thigh forward ~155° (hip flexion); abducted ~173° outward; knee ~right-angle (114°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-122.6,"band":[-60,180],"ctx":"Left arm: arm abducted ~104° (lateral); shoulder extended ~123° behind; elbow straight.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":149.6,"band":[-30,130],"ctx":"Left leg: thigh forward ~150° (hip flexion); knee ~right-angle (108°).","verdict":"outside_band_review"},{"joint":"right_shoulder_abduction","value":-23.7,"band":[0,180],"ctx":"Right arm: arm at side; shoulder flexed ~46° forward; elbow straight.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":154.6,"band":[-30,130],"ctx":"Right leg: thigh forward ~155° (hip flexion); abducted ~173° outward; knee ~right-angle (114°).","verdict":"outside_band_review"}]