# Forensic Baseline — p01-master-b4-bench-lying-underwear-touch
- name: Bench Lying Hair and Waistband Touch Eyes Closed
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Lie on the bench. Bend both arms, one hand touching the underwear waistband and the other touching the hair. Bend both knees, one foot touching the armrest and the other on the bench, toes pointed. Tilt the face toward the camera with eyes closed.
- tip: Keep the knees stacked and relaxed rather than splayed to maintain an elegant, soft line while lying down.

## Raw joint config
```json
{
  "spine": 5,
  "neck": 22,
  "hips": 0,
  "globalTilt": -65,
  "globalRoll": 15,
  "globalTwist": 10,
  "leftShoulder": -95,
  "rightShoulder": -35,
  "leftElbow": 55,
  "rightElbow": 70,
  "shoulderFwdL": 12,
  "shoulderFwdR": 10,
  "leftHip": 100,
  "rightHip": 90,
  "leftKnee": 120,
  "rightKnee": 105,
  "leftAnkle": 6,
  "rightAnkle": 6,
  "hipAbductL": 12,
  "hipAbductR": 10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -59,
    "yaw_deg": 0,
    "roll_deg": 11,
    "description": "Head pitch -59° (+: forward/down), roll 11° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -62.5,
    "lateral_flexion_deg": -31.7,
    "axial_rotation_deg": 9.9,
    "description": "Torso flexion -62° (+: forward), lateral -32° (+: figure's right), axial rotation proxy 10°."
  },
  "pelvis": {
    "tilt_deg": 41.8,
    "list_deg": 14.3,
    "yaw_deg": 9.9,
    "description": "Pelvic list 14° (+: left hip lower), yaw 10°, anterior/posterior tilt proxy 42° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 72.5,
    "shoulder_sagittal_flexion_deg": -53.7,
    "elbow_flexion_deg": 48.8,
    "forearm_forward_deg": -176.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~73° (lateral); shoulder extended ~54° behind; elbow bent ~49°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 78.8,
    "shoulder_sagittal_flexion_deg": 51.5,
    "elbow_flexion_deg": 57.3,
    "forearm_forward_deg": 126.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~79° (lateral); shoulder flexed ~52° forward; elbow bent ~57°."
  },
  "left_leg": {
    "hip_flexion_deg": 167.7,
    "hip_abduction_deg": 179.7,
    "knee_flexion_deg": 114.8,
    "foot_forward_deg": -13.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~168° (hip flexion); abducted ~180° outward; knee ~right-angle (115°)."
  },
  "right_leg": {
    "hip_flexion_deg": 152.3,
    "hip_abduction_deg": -158.7,
    "knee_flexion_deg": 102.1,
    "foot_forward_deg": -35.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~152° (hip flexion); knee ~right-angle (102°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.181,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.32,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.122,
    "com_z": -0.389,
    "foot_x_range": [
      -0.262,
      0.031
    ],
    "over_support": true,
    "feet_min_y": 0.181,
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
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_hip_flexion",
      "value": 167.7,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~168° (hip flexion); abducted ~180° outward; knee ~right-angle (115°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 152.3,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~152° (hip flexion); knee ~right-angle (102°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.7425 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -62° (+: forward), lateral -32° (+: figure's right), axial rotation proxy 10°.
- Head: Head pitch -59° (+: forward/down), roll 11° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 14° (+: left hip lower), yaw 10°, anterior/posterior tilt proxy 42° (low confidence).
- L arm: Left arm: arm abducted ~73° (lateral); shoulder extended ~54° behind; elbow bent ~49°.
- R arm: Right arm: arm abducted ~79° (lateral); shoulder flexed ~52° forward; elbow bent ~57°.
- L leg: Left leg: thigh forward ~168° (hip flexion); abducted ~180° outward; knee ~right-angle (115°).
- R leg: Right leg: thigh forward ~152° (hip flexion); knee ~right-angle (102°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":167.7,"band":[-30,130],"ctx":"Left leg: thigh forward ~168° (hip flexion); abducted ~180° outward; knee ~right-angle (115°).","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":152.3,"band":[-30,130],"ctx":"Right leg: thigh forward ~152° (hip flexion); knee ~right-angle (102°).","verdict":"outside_band_review"}]