# Forensic Baseline — p17-tubes-s10-seated-knees-hugged-chin-rest
- name: Seated with Knees Hugged and Chin Resting
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit on a tube facing camera and draw both knees up together toward the chest. Wrap both arms around the shins and rest the chin near a knee. Keep a direct, soft gaze into the lens.
- tip: Keep the spine long even while curled up — rounding only through the upper back avoids a collapsed look.

## Raw joint config
```json
{
  "spine": -20,
  "neck": 12.1,
  "hips": -5,
  "globalTilt": 5,
  "globalRoll": 0,
  "globalTwist": 5,
  "leftShoulder": -70,
  "rightShoulder": -82,
  "leftElbow": 100,
  "rightElbow": 100,
  "shoulderFwdL": 30,
  "shoulderFwdR": 30,
  "leftHip": 118,
  "rightHip": 118,
  "leftKnee": 130,
  "rightKnee": 130,
  "leftAnkle": 5,
  "rightAnkle": 5,
  "hipAbductL": -8,
  "hipAbductR": -8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -16.3,
    "yaw_deg": 0,
    "roll_deg": 10.4,
    "description": "Head pitch -16° (+: forward/down), roll 10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -14.9,
    "lateral_flexion_deg": -1.3,
    "axial_rotation_deg": 5,
    "description": "Torso flexion -15° (+: forward), lateral -1° (+: figure's right), axial rotation proxy 5°."
  },
  "pelvis": {
    "tilt_deg": -4.5,
    "list_deg": -5,
    "yaw_deg": 5.4,
    "description": "Pelvic list -5° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy -5° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 94.9,
    "shoulder_sagittal_flexion_deg": -128.5,
    "elbow_flexion_deg": 100.1,
    "forearm_forward_deg": 86.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~95° (lateral); shoulder extended ~129° behind; elbow ~right-angle (100°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 106.7,
    "shoulder_sagittal_flexion_deg": -139.1,
    "elbow_flexion_deg": 96.1,
    "forearm_forward_deg": 98.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~107° (lateral); shoulder extended ~139° behind; elbow ~right-angle (96°)."
  },
  "left_leg": {
    "hip_flexion_deg": 112.6,
    "hip_abduction_deg": 159,
    "knee_flexion_deg": 125.2,
    "foot_forward_deg": -54.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~113° (hip flexion); abducted ~159° outward; knee deeply bent (~125°)."
  },
  "right_leg": {
    "hip_flexion_deg": 113.2,
    "hip_abduction_deg": 161.3,
    "knee_flexion_deg": 129.9,
    "foot_forward_deg": -55.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~113° (hip flexion); abducted ~161° outward; knee deeply bent (~130°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.331,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.316,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.007,
    "com_z": -0.075,
    "foot_x_range": [
      -0.392,
      0.203
    ],
    "over_support": true,
    "feet_min_y": 0.316,
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
      "joint": "left_shoulder_flexion",
      "value": -128.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~95° (lateral); shoulder extended ~129° behind; elbow ~right-angle (100°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -139.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~107° (lateral); shoulder extended ~139° behind; elbow ~right-angle (96°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.7425 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -15° (+: forward), lateral -1° (+: figure's right), axial rotation proxy 5°.
- Head: Head pitch -16° (+: forward/down), roll 10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -5° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy -5° (low confidence).
- L arm: Left arm: arm abducted ~95° (lateral); shoulder extended ~129° behind; elbow ~right-angle (100°).
- R arm: Right arm: arm abducted ~107° (lateral); shoulder extended ~139° behind; elbow ~right-angle (96°).
- L leg: Left leg: thigh forward ~113° (hip flexion); abducted ~159° outward; knee deeply bent (~125°).
- R leg: Right leg: thigh forward ~113° (hip flexion); abducted ~161° outward; knee deeply bent (~130°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-128.5,"band":[-60,180],"ctx":"Left arm: arm abducted ~95° (lateral); shoulder extended ~129° behind; elbow ~right-angle (100°).","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-139.1,"band":[-60,180],"ctx":"Right arm: arm abducted ~107° (lateral); shoulder extended ~139° behind; elbow ~right-angle (96°).","verdict":"outside_band_review"}]