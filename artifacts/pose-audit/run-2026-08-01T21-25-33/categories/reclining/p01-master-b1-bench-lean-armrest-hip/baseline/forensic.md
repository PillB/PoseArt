# Forensic Baseline — p01-master-b1-bench-lean-armrest-hip
- name: Bench Recline Lean on Armrest Hand on Hip
- category: reclining | difficulty: Beginner | angle: undefined
- instructions: Lean with one arm against the bench armrest and the other hand on the hip. Bend one knee while extending the other, pointing both toes. Tilt the face away from the camera.
- tip: Let the leaning elbow carry most of the upper body weight to create a relaxed, unforced recline.

## Raw joint config
```json
{
  "spine": -10,
  "neck": -8,
  "hips": 5,
  "globalTilt": 65,
  "globalRoll": 20,
  "globalTwist": 15,
  "leftShoulder": -20,
  "rightShoulder": -90,
  "leftElbow": 70,
  "rightElbow": 60,
  "shoulderFwdL": 10,
  "shoulderFwdR": 12,
  "leftHip": 30,
  "rightHip": 60,
  "leftKnee": 15,
  "rightKnee": 55,
  "leftAnkle": 8,
  "rightAnkle": 8,
  "hipAbductL": 6,
  "hipAbductR": 10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 55.5,
    "yaw_deg": 0,
    "roll_deg": -12.3,
    "description": "Head pitch 56° (+: forward/down), roll -12° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 52.3,
    "lateral_flexion_deg": 0.3,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion 52° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": -41.8,
    "list_deg": 20.3,
    "yaw_deg": 10.3,
    "description": "Pelvic list 20° (+: left hip lower), yaw 10°, anterior/posterior tilt proxy -42° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 47.8,
    "shoulder_sagittal_flexion_deg": -35.7,
    "elbow_flexion_deg": 46.4,
    "forearm_forward_deg": -20.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~48°; shoulder extended ~36° behind; elbow bent ~46°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 121.2,
    "shoulder_sagittal_flexion_deg": 170.3,
    "elbow_flexion_deg": 55.4,
    "forearm_forward_deg": 57.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~121° abduction); shoulder flexed ~170° forward; elbow bent ~55°."
  },
  "left_leg": {
    "hip_flexion_deg": -38.6,
    "hip_abduction_deg": -22.7,
    "knee_flexion_deg": 14.9,
    "foot_forward_deg": 48.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~39° behind; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -3.6,
    "hip_abduction_deg": 13.9,
    "knee_flexion_deg": 54.7,
    "foot_forward_deg": 116.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee bent ~55°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.763,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.519,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.01,
    "com_z": 0.366,
    "foot_x_range": [
      0.226,
      0.414
    ],
    "over_support": false,
    "feet_min_y": -0.763,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "R",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_hip_flexion",
      "value": -38.6,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~39° behind; knee straight.",
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
- Torso: Torso flexion 52° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch 56° (+: forward/down), roll -12° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 20° (+: left hip lower), yaw 10°, anterior/posterior tilt proxy -42° (low confidence).
- L arm: Left arm: arm abducted ~48°; shoulder extended ~36° behind; elbow bent ~46°.
- R arm: Right arm: arm overhead (~121° abduction); shoulder flexed ~170° forward; elbow bent ~55°.
- L leg: Left leg: thigh extended ~39° behind; knee straight.
- R leg: Right leg: thigh near neutral; knee bent ~55°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":-38.6,"band":[-30,130],"ctx":"Left leg: thigh extended ~39° behind; knee straight.","verdict":"outside_band_review"}]