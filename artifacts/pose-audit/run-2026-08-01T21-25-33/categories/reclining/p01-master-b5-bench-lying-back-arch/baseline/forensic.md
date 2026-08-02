# Forensic Baseline — p01-master-b5-bench-lying-back-arch
- name: Bench Lying Back Arch Eyes Closed
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Lie on the bench, bending both arms and arching the back. Bend both knees, positioned on the bench with pointed toes. Tilt the face toward the camera with eyes closed.
- tip: Push the chest up and let the head drop back to intensify the arch without straining the lower back.

## Raw joint config
```json
{
  "spine": -30,
  "neck": 25,
  "hips": -8,
  "globalTilt": -65,
  "globalRoll": 10,
  "globalTwist": 12,
  "leftShoulder": -85,
  "rightShoulder": -80,
  "leftElbow": 60,
  "rightElbow": 65,
  "shoulderFwdL": 15,
  "shoulderFwdR": 15,
  "leftHip": 100,
  "rightHip": 105,
  "leftKnee": 120,
  "rightKnee": 115,
  "leftAnkle": 6,
  "rightAnkle": 6,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -95.3,
    "yaw_deg": 0,
    "roll_deg": 116.2,
    "description": "Head pitch -95° (+: forward/down), roll 116° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -97.1,
    "lateral_flexion_deg": -122.8,
    "axial_rotation_deg": 11.7,
    "description": "Torso flexion -97° (+: forward), lateral -123° (+: figure's right), axial rotation proxy 12°."
  },
  "pelvis": {
    "tilt_deg": 42.2,
    "list_deg": 6.6,
    "yaw_deg": 4.7,
    "description": "Pelvic list 7° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 42° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 100.1,
    "shoulder_sagittal_flexion_deg": 178.2,
    "elbow_flexion_deg": 57.2,
    "forearm_forward_deg": 168.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~100° (lateral); shoulder flexed ~178° forward; elbow bent ~57°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 118.8,
    "shoulder_sagittal_flexion_deg": -145.1,
    "elbow_flexion_deg": 63.4,
    "forearm_forward_deg": 169.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~119° (lateral); shoulder extended ~145° behind; elbow bent ~63°."
  },
  "left_leg": {
    "hip_flexion_deg": 165.2,
    "hip_abduction_deg": 173.2,
    "knee_flexion_deg": 120,
    "foot_forward_deg": -12.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~165° (hip flexion); abducted ~173° outward; knee deeply bent (~120°)."
  },
  "right_leg": {
    "hip_flexion_deg": 166.1,
    "hip_abduction_deg": -156.1,
    "knee_flexion_deg": 107.2,
    "foot_forward_deg": -9.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~166° (hip flexion); knee ~right-angle (107°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.158,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.135,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.093,
    "com_z": -0.428,
    "foot_x_range": [
      -0.318,
      -0.168
    ],
    "over_support": false,
    "feet_min_y": 0.135,
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
    },
    {
      "type": "elbow_above_shoulder",
      "side": "R",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_hip_flexion",
      "value": 165.2,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~165° (hip flexion); abducted ~173° outward; knee deeply bent (~120°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -145.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~119° (lateral); shoulder extended ~145° behind; elbow bent ~63°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 166.1,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~166° (hip flexion); knee ~right-angle (107°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74700000000027 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -97° (+: forward), lateral -123° (+: figure's right), axial rotation proxy 12°.
- Head: Head pitch -95° (+: forward/down), roll 116° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 7° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 42° (low confidence).
- L arm: Left arm: arm abducted ~100° (lateral); shoulder flexed ~178° forward; elbow bent ~57°.
- R arm: Right arm: arm abducted ~119° (lateral); shoulder extended ~145° behind; elbow bent ~63°.
- L leg: Left leg: thigh forward ~165° (hip flexion); abducted ~173° outward; knee deeply bent (~120°).
- R leg: Right leg: thigh forward ~166° (hip flexion); knee ~right-angle (107°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":165.2,"band":[-30,130],"ctx":"Left leg: thigh forward ~165° (hip flexion); abducted ~173° outward; knee deeply bent (~120°).","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-145.1,"band":[-60,180],"ctx":"Right arm: arm abducted ~119° (lateral); shoulder extended ~145° behind; elbow bent ~63°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":166.1,"band":[-30,130],"ctx":"Right leg: thigh forward ~166° (hip flexion); knee ~right-angle (107°).","verdict":"outside_band_review"}]