# Forensic Baseline — p01-master-s15-chair-floor-back-against-hand-floor
- name: Floor Seated Against Chair Hand on Floor Hip Hand
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit on the floor with the back against the chair. Keep one arm bent and the other straight; place one hand on the floor and the other on the hip. Bend, extend, and cross the legs at the shin with knees together, toes pointed, and look at the camera.
- tip: Press the straight arm's hand firmly into the floor to create a stable tripod base for the leaning torso.

## Raw joint config
```json
{
  "spine": -15,
  "neck": -6,
  "hips": 0,
  "globalTilt": -10,
  "globalRoll": 15,
  "globalTwist": 8,
  "leftShoulder": -10,
  "rightShoulder": -95,
  "leftElbow": 30,
  "rightElbow": 60,
  "shoulderFwdL": 15,
  "shoulderFwdR": 12,
  "leftHip": 95,
  "rightHip": 95,
  "leftKnee": 115,
  "rightKnee": 110,
  "leftAnkle": 8,
  "rightAnkle": 8,
  "hipAbductL": -6,
  "hipAbductR": -6
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -25.9,
    "yaw_deg": 0,
    "roll_deg": -25,
    "description": "Head pitch -26° (+: forward/down), roll -25° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -25.9,
    "lateral_flexion_deg": -18.7,
    "axial_rotation_deg": 7.9,
    "description": "Torso flexion -26° (+: forward), lateral -19° (+: figure's right), axial rotation proxy 8°."
  },
  "pelvis": {
    "tilt_deg": 9.8,
    "list_deg": 14.4,
    "yaw_deg": 7.9,
    "description": "Pelvic list 14° (+: left hip lower), yaw 8°, anterior/posterior tilt proxy 10° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 19.8,
    "shoulder_sagittal_flexion_deg": 19.1,
    "elbow_flexion_deg": 18.2,
    "forearm_forward_deg": 34.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~20°; shoulder flexed ~19° forward; elbow bent ~18°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 133.2,
    "shoulder_sagittal_flexion_deg": -167.6,
    "elbow_flexion_deg": 53.1,
    "forearm_forward_deg": 135.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~133° abduction); shoulder extended ~168° behind; elbow bent ~53°."
  },
  "left_leg": {
    "hip_flexion_deg": 104.9,
    "hip_abduction_deg": 171.7,
    "knee_flexion_deg": 114.4,
    "foot_forward_deg": -73,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~105° (hip flexion); abducted ~172° outward; knee ~right-angle (114°)."
  },
  "right_leg": {
    "hip_flexion_deg": 108.3,
    "hip_abduction_deg": 152.3,
    "knee_flexion_deg": 109.5,
    "foot_forward_deg": -79.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~108° (hip flexion); abducted ~152° outward; knee ~right-angle (109°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.377,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.518,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.13,
    "com_z": -0.159,
    "foot_x_range": [
      -0.374,
      0.137
    ],
    "over_support": true,
    "feet_min_y": 0.377,
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
      "joint": "right_shoulder_flexion",
      "value": -167.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~133° abduction); shoulder extended ~168° behind; elbow bent ~53°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.00450000000092 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -26° (+: forward), lateral -19° (+: figure's right), axial rotation proxy 8°.
- Head: Head pitch -26° (+: forward/down), roll -25° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 14° (+: left hip lower), yaw 8°, anterior/posterior tilt proxy 10° (low confidence).
- L arm: Left arm: arm abducted ~20°; shoulder flexed ~19° forward; elbow bent ~18°.
- R arm: Right arm: arm overhead (~133° abduction); shoulder extended ~168° behind; elbow bent ~53°.
- L leg: Left leg: thigh forward ~105° (hip flexion); abducted ~172° outward; knee ~right-angle (114°).
- R leg: Right leg: thigh forward ~108° (hip flexion); abducted ~152° outward; knee ~right-angle (109°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-167.6,"band":[-60,180],"ctx":"Right arm: arm overhead (~133° abduction); shoulder extended ~168° behind; elbow bent ~53°.","verdict":"outside_band_review"}]