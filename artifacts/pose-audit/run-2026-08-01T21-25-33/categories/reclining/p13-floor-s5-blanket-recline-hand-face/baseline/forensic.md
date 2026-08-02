# Forensic Baseline — p13-floor-s5-blanket-recline-hand-face
- name: Cozy Blanket Recline, Hand Near Face
- category: reclining | difficulty: Beginner | angle: undefined
- instructions: Lie back on a soft blanket or bedding on the floor. Bend one leg up while keeping the other extended, and bring one hand up near the face or jaw. Relax the other arm at your side and turn the head gently toward the camera with a soft, intimate expression.
- tip: Use a folded blanket or throw beneath you instead of the bare floor to soften the surface texture and support a cozier, more intimate mood.

## Raw joint config
```json
{
  "spine": -8,
  "neck": 6.6,
  "hips": 0,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 100,
  "rightElbow": 15,
  "shoulderFwdL": 15,
  "shoulderFwdR": 5,
  "leftHip": 8,
  "rightHip": 90,
  "leftKnee": 10,
  "rightKnee": 88,
  "leftAnkle": -5,
  "rightAnkle": 0,
  "hipAbductL": -5,
  "hipAbductR": -12,
  "globalTwist": 5,
  "globalRoll": 4,
  "globalTilt": -85
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -92.9,
    "yaw_deg": 0,
    "roll_deg": 149,
    "description": "Head pitch -93° (+: forward/down), roll 149° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -93.4,
    "lateral_flexion_deg": -125,
    "axial_rotation_deg": 5,
    "description": "Torso flexion -93° (+: forward), lateral -125° (+: figure's right), axial rotation proxy 5°."
  },
  "pelvis": {
    "tilt_deg": 44.8,
    "list_deg": 4,
    "yaw_deg": 5,
    "description": "Pelvic list 4° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 85.7,
    "shoulder_sagittal_flexion_deg": -84.5,
    "elbow_flexion_deg": 70,
    "forearm_forward_deg": -144.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~86° (lateral); shoulder extended ~84° behind; elbow bent ~70°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 104.4,
    "shoulder_sagittal_flexion_deg": -103.1,
    "elbow_flexion_deg": 11.3,
    "forearm_forward_deg": -117.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~104° (lateral); shoulder extended ~103° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 93,
    "hip_abduction_deg": 175.9,
    "knee_flexion_deg": 10.3,
    "foot_forward_deg": 154.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~93° (hip flexion); abducted ~176° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 176.1,
    "hip_abduction_deg": 171.6,
    "knee_flexion_deg": 86.1,
    "foot_forward_deg": -40.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~176° (hip flexion); abducted ~172° outward; knee ~right-angle (86°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.242,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.381,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.039,
    "com_z": -0.447,
    "foot_x_range": [
      -0.194,
      0.292
    ],
    "over_support": true,
    "feet_min_y": 0.242,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
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
      "value": -84.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~86° (lateral); shoulder extended ~84° behind; elbow bent ~70°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -103.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~104° (lateral); shoulder extended ~103° behind; elbow straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 176.1,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~176° (hip flexion); abducted ~172° outward; knee ~right-angle (86°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.75149999999987 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -93° (+: forward), lateral -125° (+: figure's right), axial rotation proxy 5°.
- Head: Head pitch -93° (+: forward/down), roll 149° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 4° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm abducted ~86° (lateral); shoulder extended ~84° behind; elbow bent ~70°.
- R arm: Right arm: arm abducted ~104° (lateral); shoulder extended ~103° behind; elbow straight.
- L leg: Left leg: thigh forward ~93° (hip flexion); abducted ~176° outward; knee straight.
- R leg: Right leg: thigh forward ~176° (hip flexion); abducted ~172° outward; knee ~right-angle (86°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-84.5,"band":[-60,180],"ctx":"Left arm: arm abducted ~86° (lateral); shoulder extended ~84° behind; elbow bent ~70°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-103.1,"band":[-60,180],"ctx":"Right arm: arm abducted ~104° (lateral); shoulder extended ~103° behind; elbow straight.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":176.1,"band":[-30,130],"ctx":"Right leg: thigh forward ~176° (hip flexion); abducted ~172° outward; knee ~right-angle (86°).","verdict":"outside_band_review"}]