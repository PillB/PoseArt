# Forensic Baseline — p10-bench-s3-recline-arm-overhead
- name: Reclined on Bench, Arm Overhead
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Lie back on the bench with the head tilted back over the edge. Raise one arm overhead so the hand rests near or hangs past the head. Bend both knees and let the lower legs hang off the edge of the bench. Let long hair cascade down.
- tip: Let the head hang back fully so the throat elongates fully; a lifted chin position undercuts the dramatic recline line.

## Raw joint config
```json
{
  "spine": -17,
  "neck": 27,
  "hips": 0,
  "leftShoulder": -140,
  "rightShoulder": -25,
  "leftElbow": 35,
  "rightElbow": 30,
  "shoulderFwdL": 0,
  "shoulderFwdR": 5,
  "leftHip": 8,
  "rightHip": 10,
  "leftKnee": 92,
  "rightKnee": 98,
  "leftAnkle": -10,
  "rightAnkle": -10,
  "hipAbductL": -8,
  "hipAbductR": 8,
  "globalTwist": 0,
  "globalRoll": 0,
  "globalTilt": -85
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -103.9,
    "yaw_deg": 0,
    "roll_deg": 116.6,
    "description": "Head pitch -104° (+: forward/down), roll 117° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -102,
    "lateral_flexion_deg": 180,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -102° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 44.9,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 142.4,
    "shoulder_sagittal_flexion_deg": -111.2,
    "elbow_flexion_deg": 12.6,
    "forearm_forward_deg": -118.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~142° abduction); shoulder extended ~111° behind; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 101.3,
    "shoulder_sagittal_flexion_deg": 102.9,
    "elbow_flexion_deg": 23.6,
    "forearm_forward_deg": 124.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~101° (lateral); shoulder flexed ~103° forward; elbow bent ~24°."
  },
  "left_leg": {
    "hip_flexion_deg": 93,
    "hip_abduction_deg": 110.4,
    "knee_flexion_deg": 91.2,
    "foot_forward_deg": -128.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~93° (hip flexion); abducted ~110° outward; knee ~right-angle (91°)."
  },
  "right_leg": {
    "hip_flexion_deg": 95,
    "hip_abduction_deg": -121.8,
    "knee_flexion_deg": 96.3,
    "foot_forward_deg": -120.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~95° (hip flexion); knee ~right-angle (96°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.533,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.517,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.442,
    "foot_x_range": [
      -0.3,
      0.041
    ],
    "over_support": true,
    "feet_min_y": 0.517,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
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
      "joint": "left_shoulder_flexion",
      "value": -111.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~142° abduction); shoulder extended ~111° behind; elbow straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 113.74849999999948 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -102° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -104° (+: forward/down), roll 117° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm overhead (~142° abduction); shoulder extended ~111° behind; elbow straight.
- R arm: Right arm: arm abducted ~101° (lateral); shoulder flexed ~103° forward; elbow bent ~24°.
- L leg: Left leg: thigh forward ~93° (hip flexion); abducted ~110° outward; knee ~right-angle (91°).
- R leg: Right leg: thigh forward ~95° (hip flexion); knee ~right-angle (96°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-111.2,"band":[-60,180],"ctx":"Left arm: arm overhead (~142° abduction); shoulder extended ~111° behind; elbow straight.","verdict":"outside_band_review"}]