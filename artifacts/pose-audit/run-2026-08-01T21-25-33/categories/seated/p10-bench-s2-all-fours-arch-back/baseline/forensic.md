# Forensic Baseline — p10-bench-s2-all-fours-arch-back
- name: All-Fours Arched Back on Bench
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Position yourself on hands and knees on top of the bench. Arch the back deeply, dropping the belly down and lifting the chest and hips. Extend one leg straight back and slightly up off the bench, and look down or forward with a focused expression.
- tip: Drop the belly first to initiate the arch, then lift the chest — trying to arch from the shoulders alone looks stiff.

## Raw joint config
```json
{
  "spine": -30,
  "neck": -6.6,
  "hips": 16,
  "leftShoulder": -80,
  "rightShoulder": -92,
  "leftElbow": 32,
  "rightElbow": 15,
  "shoulderFwdL": -20,
  "shoulderFwdR": -20,
  "leftHip": 118,
  "rightHip": -12,
  "leftKnee": 130,
  "rightKnee": 10,
  "leftAnkle": -20,
  "rightAnkle": -8,
  "hipAbductL": 5,
  "hipAbductR": -5,
  "globalTwist": 0,
  "globalRoll": 0,
  "globalTilt": -20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -50.2,
    "yaw_deg": 0,
    "roll_deg": -8.9,
    "description": "Head pitch -50° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -50,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -50° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 18.2,
    "list_deg": 14.5,
    "yaw_deg": 5.4,
    "description": "Pelvic list 15° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 18° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 126.5,
    "shoulder_sagittal_flexion_deg": 128.6,
    "elbow_flexion_deg": 31.4,
    "forearm_forward_deg": 122,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~127° abduction); shoulder flexed ~129° forward; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 137.4,
    "shoulder_sagittal_flexion_deg": 140.7,
    "elbow_flexion_deg": 13.9,
    "forearm_forward_deg": 134.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~137° abduction); shoulder flexed ~141° forward; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 138,
    "hip_abduction_deg": -152.7,
    "knee_flexion_deg": 113.9,
    "foot_forward_deg": -53.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~138° (hip flexion); knee ~right-angle (114°)."
  },
  "right_leg": {
    "hip_flexion_deg": 8,
    "hip_abduction_deg": 21.2,
    "knee_flexion_deg": 9.8,
    "foot_forward_deg": 68.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~21° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.244,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.747,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.294,
    "foot_x_range": [
      0.186,
      0.519
    ],
    "over_support": false,
    "feet_min_y": -0.747,
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
      "value": 138,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~138° (hip flexion); knee ~right-angle (114°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.74699999999962 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -50° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -50° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 15° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 18° (low confidence).
- L arm: Left arm: arm overhead (~127° abduction); shoulder flexed ~129° forward; elbow bent ~31°.
- R arm: Right arm: arm overhead (~137° abduction); shoulder flexed ~141° forward; elbow straight.
- L leg: Left leg: thigh forward ~138° (hip flexion); knee ~right-angle (114°).
- R leg: Right leg: thigh near neutral; abducted ~21° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":138,"band":[-30,130],"ctx":"Left leg: thigh forward ~138° (hip flexion); knee ~right-angle (114°).","verdict":"outside_band_review"}]