# Forensic Baseline — p01-master-b2-bench-lean-armrest-knee
- name: Bench Recline Lean on Armrest Arm on Knee
- category: reclining | difficulty: Beginner | angle: undefined
- instructions: Lean with one arm against the bench armrest and extend the other arm to rest on the knee. Bend both knees, one on the bench and the other touching the floor, toes pointed. Tilt the face toward the camera.
- tip: Extend the resting arm along the raised knee fully to create a long diagonal line across the frame.

## Raw joint config
```json
{
  "spine": -8,
  "neck": 0,
  "hips": 8,
  "globalTilt": 65,
  "globalRoll": 18,
  "globalTwist": 10,
  "leftShoulder": -20,
  "rightShoulder": -60,
  "leftElbow": 65,
  "rightElbow": 5,
  "shoulderFwdL": 10,
  "shoulderFwdR": 15,
  "leftHip": 90,
  "rightHip": 40,
  "leftKnee": 100,
  "rightKnee": 15,
  "leftAnkle": 6,
  "rightAnkle": 10,
  "hipAbductL": 15,
  "hipAbductR": 6
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 55.7,
    "yaw_deg": 0,
    "roll_deg": -3,
    "description": "Head pitch 56° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 55.7,
    "lateral_flexion_deg": -3,
    "axial_rotation_deg": 9.9,
    "description": "Torso flexion 56° (+: forward), lateral -3° (+: figure's right), axial rotation proxy 10°."
  },
  "pelvis": {
    "tilt_deg": -42.2,
    "list_deg": 20,
    "yaw_deg": 2.7,
    "description": "Pelvic list 20° (+: left hip lower), yaw 3°, anterior/posterior tilt proxy -42° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 50.3,
    "shoulder_sagittal_flexion_deg": -43.9,
    "elbow_flexion_deg": 42.9,
    "forearm_forward_deg": -21.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~50°; shoulder extended ~44° behind; elbow bent ~43°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 112.1,
    "shoulder_sagittal_flexion_deg": -136.9,
    "elbow_flexion_deg": 8.4,
    "forearm_forward_deg": -125.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~112° (lateral); shoulder extended ~137° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 25.7,
    "hip_abduction_deg": -46.5,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~26°; knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": -25.8,
    "hip_abduction_deg": 15.5,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 59.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~26° behind; abducted ~16° outward; knee bent ~15°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.117,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.771,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": -0.008,
    "com_z": 0.38,
    "foot_x_range": [
      0.263,
      0.453
    ],
    "over_support": false,
    "feet_min_y": -0.771,
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
      "joint": "right_shoulder_flexion",
      "value": -136.9,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~112° (lateral); shoulder extended ~137° behind; elbow straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 109.9940600000001 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 56° (+: forward), lateral -3° (+: figure's right), axial rotation proxy 10°.
- Head: Head pitch 56° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 20° (+: left hip lower), yaw 3°, anterior/posterior tilt proxy -42° (low confidence).
- L arm: Left arm: arm abducted ~50°; shoulder extended ~44° behind; elbow bent ~43°.
- R arm: Right arm: arm abducted ~112° (lateral); shoulder extended ~137° behind; elbow straight.
- L leg: Left leg: thigh forward ~26°; knee ~right-angle (89°).
- R leg: Right leg: thigh extended ~26° behind; abducted ~16° outward; knee bent ~15°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-136.9,"band":[-60,180],"ctx":"Right arm: arm abducted ~112° (lateral); shoulder extended ~137° behind; elbow straight.","verdict":"outside_band_review"}]