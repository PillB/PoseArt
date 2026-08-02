# Forensic Baseline — p13-floor-s4-side-recline-arm-up
- name: Side-Lying Recline with Hand in Hair
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Lie on your back on the floor. Bend both knees and let them drape gently to one side. Reach one arm up and bend it so the hand rests near the head or hair, and let the other arm relax naturally along the floor. Fan the hair out and turn the face gently toward the camera.
- tip: Let the draped knees stack loosely rather than pressing them together tightly; a slight gap between them keeps the line soft instead of rigid.

## Raw joint config
```json
{
  "spine": -5,
  "neck": 6.6,
  "hips": 0,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 95,
  "rightElbow": 20,
  "shoulderFwdL": 10,
  "shoulderFwdR": 5,
  "leftHip": 15,
  "rightHip": 18,
  "leftKnee": 98,
  "rightKnee": 95,
  "leftAnkle": -5,
  "rightAnkle": -5,
  "hipAbductL": -20,
  "hipAbductR": -18,
  "globalTwist": 8,
  "globalRoll": 5,
  "globalTilt": -85
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -90.2,
    "yaw_deg": 0,
    "roll_deg": -96.3,
    "description": "Head pitch -90° (+: forward/down), roll -96° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -90.7,
    "lateral_flexion_deg": -95,
    "axial_rotation_deg": 7.9,
    "description": "Torso flexion -91° (+: forward), lateral -95° (+: figure's right), axial rotation proxy 8°."
  },
  "pelvis": {
    "tilt_deg": 44.6,
    "list_deg": 4.9,
    "yaw_deg": 7.9,
    "description": "Pelvic list 5° (+: left hip lower), yaw 8°, anterior/posterior tilt proxy 45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 85.8,
    "shoulder_sagittal_flexion_deg": -84,
    "elbow_flexion_deg": 66.9,
    "forearm_forward_deg": -144.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~86° (lateral); shoulder extended ~84° behind; elbow bent ~67°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 101.8,
    "shoulder_sagittal_flexion_deg": -99.6,
    "elbow_flexion_deg": 15,
    "forearm_forward_deg": -118.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~102° (lateral); shoulder extended ~100° behind; elbow bent ~15°."
  },
  "left_leg": {
    "hip_flexion_deg": 98.5,
    "hip_abduction_deg": 122.9,
    "knee_flexion_deg": 91.3,
    "foot_forward_deg": -108.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~99° (hip flexion); abducted ~123° outward; knee ~right-angle (91°)."
  },
  "right_leg": {
    "hip_flexion_deg": 106,
    "hip_abduction_deg": 121.2,
    "knee_flexion_deg": 89.9,
    "foot_forward_deg": -109.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~106° (hip flexion); abducted ~121° outward; knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.465,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.563,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.063,
    "com_z": -0.445,
    "foot_x_range": [
      -0.515,
      0.419
    ],
    "over_support": true,
    "feet_min_y": 0.465,
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
      "value": -84,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~86° (lateral); shoulder extended ~84° behind; elbow bent ~67°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -99.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~102° (lateral); shoulder extended ~100° behind; elbow bent ~15°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74699999999993 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -91° (+: forward), lateral -95° (+: figure's right), axial rotation proxy 8°.
- Head: Head pitch -90° (+: forward/down), roll -96° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 5° (+: left hip lower), yaw 8°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm abducted ~86° (lateral); shoulder extended ~84° behind; elbow bent ~67°.
- R arm: Right arm: arm abducted ~102° (lateral); shoulder extended ~100° behind; elbow bent ~15°.
- L leg: Left leg: thigh forward ~99° (hip flexion); abducted ~123° outward; knee ~right-angle (91°).
- R leg: Right leg: thigh forward ~106° (hip flexion); abducted ~121° outward; knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-84,"band":[-60,180],"ctx":"Left arm: arm abducted ~86° (lateral); shoulder extended ~84° behind; elbow bent ~67°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-99.6,"band":[-60,180],"ctx":"Right arm: arm abducted ~102° (lateral); shoulder extended ~100° behind; elbow bent ~15°.","verdict":"outside_band_review"}]