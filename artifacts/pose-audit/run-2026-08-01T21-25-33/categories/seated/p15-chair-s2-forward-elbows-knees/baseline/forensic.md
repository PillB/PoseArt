# Forensic Baseline — p15-chair-s2-forward-elbows-knees
- name: Chair Forward Lean Elbows on Knees
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit toward the front edge of the chair, knees apart, and lean the torso forward so both forearms rest on top of the thighs. Keep the spine long rather than rounded, head up, and look directly at the camera.
- tip: Lean from the hips, not the upper back — a straight spine with forward hip hinge photographs stronger than a hunched back.

## Raw joint config
```json
{
  "spine": 25,
  "neck": -2.8,
  "hips": 5,
  "globalTilt": 15,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -55,
  "rightShoulder": -67,
  "leftElbow": 79,
  "rightElbow": 79,
  "shoulderFwdL": 30,
  "shoulderFwdR": 30,
  "leftHip": 92,
  "rightHip": 92,
  "leftKnee": 92,
  "rightKnee": 92,
  "leftAnkle": 0,
  "rightAnkle": 0,
  "hipAbductL": 20,
  "hipAbductR": 20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 40,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch 40° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 40,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 40° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -14.5,
    "list_deg": 4.8,
    "yaw_deg": -1.3,
    "description": "Pelvic list 5° (+: left hip lower), yaw -1°, anterior/posterior tilt proxy -14° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 94.7,
    "shoulder_sagittal_flexion_deg": -93.5,
    "elbow_flexion_deg": 76.9,
    "forearm_forward_deg": 49.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~95° (lateral); shoulder extended ~93° behind; elbow ~right-angle (77°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 111.4,
    "shoulder_sagittal_flexion_deg": -107.2,
    "elbow_flexion_deg": 78.6,
    "forearm_forward_deg": 73.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~111° (lateral); shoulder extended ~107° behind; elbow ~right-angle (79°)."
  },
  "left_leg": {
    "hip_flexion_deg": 77,
    "hip_abduction_deg": -64.2,
    "knee_flexion_deg": 80.3,
    "foot_forward_deg": -132.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~77° (hip flexion); knee ~right-angle (80°)."
  },
  "right_leg": {
    "hip_flexion_deg": 77,
    "hip_abduction_deg": -50,
    "knee_flexion_deg": 87.3,
    "foot_forward_deg": -133.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~77° (hip flexion); knee ~right-angle (87°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.409,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.458,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.243,
    "foot_x_range": [
      -0.184,
      0.348
    ],
    "over_support": true,
    "feet_min_y": 0.409,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
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
      "joint": "left_shoulder_flexion",
      "value": -93.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~95° (lateral); shoulder extended ~93° behind; elbow ~right-angle (77°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -107.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~111° (lateral); shoulder extended ~107° behind; elbow ~right-angle (79°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.9942399999995 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 40° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 40° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 5° (+: left hip lower), yaw -1°, anterior/posterior tilt proxy -14° (low confidence).
- L arm: Left arm: arm abducted ~95° (lateral); shoulder extended ~93° behind; elbow ~right-angle (77°).
- R arm: Right arm: arm abducted ~111° (lateral); shoulder extended ~107° behind; elbow ~right-angle (79°).
- L leg: Left leg: thigh forward ~77° (hip flexion); knee ~right-angle (80°).
- R leg: Right leg: thigh forward ~77° (hip flexion); knee ~right-angle (87°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-93.5,"band":[-60,180],"ctx":"Left arm: arm abducted ~95° (lateral); shoulder extended ~93° behind; elbow ~right-angle (77°).","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-107.2,"band":[-60,180],"ctx":"Right arm: arm abducted ~111° (lateral); shoulder extended ~107° behind; elbow ~right-angle (79°).","verdict":"outside_band_review"}]