# Forensic Baseline — p13-floor-s6-knees-bent-arms-crossed
- name: Seated Knees-to-Side with Arms Crossed
- category: reclining | difficulty: Beginner | angle: undefined
- instructions: Sit on the floor against a plain wall with both knees bent and drawn together toward one side. Cross both forearms and rest them along the top knee. Look directly at the camera with a calm, confident expression.
- tip: Keep the spine tall and the shoulders back even while seated low to the ground, this avoids a slouched silhouette against the plain wall.

## Raw joint config
```json
{
  "spine": -6,
  "neck": 0,
  "hips": 0,
  "leftShoulder": 45,
  "rightShoulder": 50,
  "leftElbow": 95,
  "rightElbow": 100,
  "shoulderFwdL": 25,
  "shoulderFwdR": 25,
  "leftHip": 108,
  "rightHip": 112,
  "leftKnee": 130,
  "rightKnee": 128,
  "leftAnkle": -10,
  "rightAnkle": -10,
  "hipAbductL": 10,
  "hipAbductR": -18,
  "globalTwist": 8,
  "globalRoll": 4,
  "globalTilt": -55
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -61.3,
    "yaw_deg": 0,
    "roll_deg": -18.1,
    "description": "Head pitch -61° (+: forward/down), roll -18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -61.3,
    "lateral_flexion_deg": -18.1,
    "axial_rotation_deg": 7.9,
    "description": "Torso flexion -61° (+: forward), lateral -18° (+: figure's right), axial rotation proxy 8°."
  },
  "pelvis": {
    "tilt_deg": 39,
    "list_deg": 4,
    "yaw_deg": 7.9,
    "description": "Pelvic list 4° (+: left hip lower), yaw 8°, anterior/posterior tilt proxy 39° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -56,
    "shoulder_sagittal_flexion_deg": 70.6,
    "elbow_flexion_deg": 35,
    "forearm_forward_deg": 32.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder flexed ~71° forward; elbow bent ~35°."
  },
  "right_arm": {
    "shoulder_abduction_deg": -36.9,
    "shoulder_sagittal_flexion_deg": 72.3,
    "elbow_flexion_deg": 43.4,
    "forearm_forward_deg": 28.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder flexed ~72° forward; elbow bent ~43°."
  },
  "left_leg": {
    "hip_flexion_deg": 164.7,
    "hip_abduction_deg": -171.3,
    "knee_flexion_deg": 125.4,
    "foot_forward_deg": -20.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~165° (hip flexion); knee deeply bent (~125°)."
  },
  "right_leg": {
    "hip_flexion_deg": 169.9,
    "hip_abduction_deg": 164.1,
    "knee_flexion_deg": 118.9,
    "foot_forward_deg": -18.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~170° (hip flexion); abducted ~164° outward; knee deeply bent (~119°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.139,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.144,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.07,
    "com_z": -0.383,
    "foot_x_range": [
      -0.067,
      0.395
    ],
    "over_support": false,
    "feet_min_y": 0.139,
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
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_abduction",
      "value": -56,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder flexed ~71° forward; elbow bent ~35°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": 164.7,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~165° (hip flexion); knee deeply bent (~125°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_abduction",
      "value": -36.9,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder flexed ~72° forward; elbow bent ~43°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 169.9,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~170° (hip flexion); abducted ~164° outward; knee deeply bent (~119°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 102.99700000000001 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -61° (+: forward), lateral -18° (+: figure's right), axial rotation proxy 8°.
- Head: Head pitch -61° (+: forward/down), roll -18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 4° (+: left hip lower), yaw 8°, anterior/posterior tilt proxy 39° (low confidence).
- L arm: Left arm: arm at side; shoulder flexed ~71° forward; elbow bent ~35°.
- R arm: Right arm: arm at side; shoulder flexed ~72° forward; elbow bent ~43°.
- L leg: Left leg: thigh forward ~165° (hip flexion); knee deeply bent (~125°).
- R leg: Right leg: thigh forward ~170° (hip flexion); abducted ~164° outward; knee deeply bent (~119°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_shoulder_abduction","value":-56,"band":[0,180],"ctx":"Left arm: arm at side; shoulder flexed ~71° forward; elbow bent ~35°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":164.7,"band":[-30,130],"ctx":"Left leg: thigh forward ~165° (hip flexion); knee deeply bent (~125°).","verdict":"outside_band_review"},{"joint":"right_shoulder_abduction","value":-36.9,"band":[0,180],"ctx":"Right arm: arm at side; shoulder flexed ~72° forward; elbow bent ~43°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":169.9,"band":[-30,130],"ctx":"Right leg: thigh forward ~170° (hip flexion); abducted ~164° outward; knee deeply bent (~119°).","verdict":"outside_band_review"}]