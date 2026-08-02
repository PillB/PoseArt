# Forensic Baseline — p13-floor-s7-knees-hug-chin-rest
- name: Knees Hugged with Cheek Resting on Hand
- category: reclining | difficulty: Beginner | angle: undefined
- instructions: Sit on the floor with knees drawn close to the chest. Rest one cheek gently against the back of the hand or fingertips, and close the eyes for a soft, intimate moment. Keep the other arm wrapped loosely around the shins.
- tip: Close the eyes fully and soften the facial muscles to sell the quiet, intimate mood; a half-open eye reads as posed rather than genuine.

## Raw joint config
```json
{
  "spine": -22,
  "neck": -18,
  "hips": 5,
  "leftShoulder": 65,
  "rightShoulder": 55,
  "leftElbow": 100,
  "rightElbow": 100,
  "shoulderFwdL": 30,
  "shoulderFwdR": 30,
  "leftHip": 110,
  "rightHip": 112,
  "leftKnee": 135,
  "rightKnee": 135,
  "leftAnkle": -8,
  "rightAnkle": -8,
  "hipAbductL": -5,
  "hipAbductR": 5,
  "globalTwist": 5,
  "globalRoll": 6,
  "globalTilt": -58
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -83.1,
    "yaw_deg": 0,
    "roll_deg": -73.9,
    "description": "Head pitch -83° (+: forward/down), roll -74° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -80.5,
    "lateral_flexion_deg": -32.3,
    "axial_rotation_deg": 5,
    "description": "Torso flexion -81° (+: forward), lateral -32° (+: figure's right), axial rotation proxy 5°."
  },
  "pelvis": {
    "tilt_deg": 39.8,
    "list_deg": 8.5,
    "yaw_deg": 9.1,
    "description": "Pelvic list 8° (+: left hip lower), yaw 9°, anterior/posterior tilt proxy 40° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -113.2,
    "shoulder_sagittal_flexion_deg": 101.4,
    "elbow_flexion_deg": 66.8,
    "forearm_forward_deg": 21.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder flexed ~101° forward; elbow bent ~67°."
  },
  "right_arm": {
    "shoulder_abduction_deg": -94.2,
    "shoulder_sagittal_flexion_deg": 90.7,
    "elbow_flexion_deg": 55.7,
    "forearm_forward_deg": 34.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder flexed ~91° forward; elbow bent ~56°."
  },
  "left_leg": {
    "hip_flexion_deg": 168,
    "hip_abduction_deg": 175.1,
    "knee_flexion_deg": 134.9,
    "foot_forward_deg": -8.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~168° (hip flexion); abducted ~175° outward; knee deeply bent (~135°)."
  },
  "right_leg": {
    "hip_flexion_deg": 170,
    "hip_abduction_deg": -174.9,
    "knee_flexion_deg": 134.9,
    "foot_forward_deg": -6.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~170° (hip flexion); knee deeply bent (~135°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.056,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.081,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.05,
    "com_z": -0.425,
    "foot_x_range": [
      -0.197,
      0.138
    ],
    "over_support": true,
    "feet_min_y": 0.056,
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
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_abduction",
      "value": -113.2,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder flexed ~101° forward; elbow bent ~67°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": 168,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~168° (hip flexion); abducted ~175° outward; knee deeply bent (~135°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_abduction",
      "value": -94.2,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder flexed ~91° forward; elbow bent ~56°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 170,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~170° (hip flexion); knee deeply bent (~135°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 102.24712000000007 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -81° (+: forward), lateral -32° (+: figure's right), axial rotation proxy 5°.
- Head: Head pitch -83° (+: forward/down), roll -74° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 8° (+: left hip lower), yaw 9°, anterior/posterior tilt proxy 40° (low confidence).
- L arm: Left arm: arm at side; shoulder flexed ~101° forward; elbow bent ~67°.
- R arm: Right arm: arm at side; shoulder flexed ~91° forward; elbow bent ~56°.
- L leg: Left leg: thigh forward ~168° (hip flexion); abducted ~175° outward; knee deeply bent (~135°).
- R leg: Right leg: thigh forward ~170° (hip flexion); knee deeply bent (~135°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_abduction","value":-113.2,"band":[0,180],"ctx":"Left arm: arm at side; shoulder flexed ~101° forward; elbow bent ~67°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":168,"band":[-30,130],"ctx":"Left leg: thigh forward ~168° (hip flexion); abducted ~175° outward; knee deeply bent (~135°).","verdict":"outside_band_review"},{"joint":"right_shoulder_abduction","value":-94.2,"band":[0,180],"ctx":"Right arm: arm at side; shoulder flexed ~91° forward; elbow bent ~56°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":170,"band":[-30,130],"ctx":"Right leg: thigh forward ~170° (hip flexion); knee deeply bent (~135°).","verdict":"outside_band_review"}]