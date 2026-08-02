# Forensic Baseline — p01-master-s13-chair-floor-back-against-leg-elevated
- name: Floor Seated Against Chair One Leg Elevated
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit on the floor with the back against the chair. Bend both arms, resting one on the chair. Bend and elevate one leg while the other leg touches the floor, toes pointed. Look away from the camera.
- tip: Use the chair for genuine back support so the spine can relax into a soft, natural recline rather than staying rigid.

## Raw joint config
```json
{
  "spine": -20,
  "neck": 5.5,
  "hips": -5,
  "globalTilt": -15,
  "globalRoll": 5,
  "globalTwist": 10,
  "leftShoulder": -30,
  "rightShoulder": -60,
  "leftElbow": 70,
  "rightElbow": 60,
  "shoulderFwdL": 10,
  "shoulderFwdR": 15,
  "leftHip": 100,
  "rightHip": 60,
  "leftKnee": 120,
  "rightKnee": 20,
  "leftAnkle": 8,
  "rightAnkle": 8,
  "hipAbductL": -8,
  "hipAbductR": 6
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -35.5,
    "yaw_deg": 0,
    "roll_deg": -5.8,
    "description": "Head pitch -36° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -35,
    "lateral_flexion_deg": -11.9,
    "axial_rotation_deg": 9.9,
    "description": "Torso flexion -35° (+: forward), lateral -12° (+: figure's right), axial rotation proxy 10°."
  },
  "pelvis": {
    "tilt_deg": 15.1,
    "list_deg": 0.1,
    "yaw_deg": 8.6,
    "description": "Pelvic list 0° (+: left hip lower), yaw 9°, anterior/posterior tilt proxy 15° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 51.6,
    "shoulder_sagittal_flexion_deg": 39.1,
    "elbow_flexion_deg": 57,
    "forearm_forward_deg": 69.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~52°; shoulder flexed ~39° forward; elbow bent ~57°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 90.5,
    "shoulder_sagittal_flexion_deg": -95.5,
    "elbow_flexion_deg": 60,
    "forearm_forward_deg": 100.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~91° (lateral); shoulder extended ~96° behind; elbow bent ~60°."
  },
  "left_leg": {
    "hip_flexion_deg": 114,
    "hip_abduction_deg": 165.6,
    "knee_flexion_deg": 116.1,
    "foot_forward_deg": -57.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~114° (hip flexion); abducted ~166° outward; knee deeply bent (~116°)."
  },
  "right_leg": {
    "hip_flexion_deg": 75.2,
    "hip_abduction_deg": -0.2,
    "knee_flexion_deg": 19.7,
    "foot_forward_deg": 158.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~75° (hip flexion); knee bent ~20°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.371,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.105,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.072,
    "com_z": -0.217,
    "foot_x_range": [
      -0.431,
      0.127
    ],
    "over_support": true,
    "feet_min_y": 0.105,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "L"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -95.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~91° (lateral); shoulder extended ~96° behind; elbow bent ~60°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.7425 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -35° (+: forward), lateral -12° (+: figure's right), axial rotation proxy 10°.
- Head: Head pitch -36° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 9°, anterior/posterior tilt proxy 15° (low confidence).
- L arm: Left arm: arm abducted ~52°; shoulder flexed ~39° forward; elbow bent ~57°.
- R arm: Right arm: arm abducted ~91° (lateral); shoulder extended ~96° behind; elbow bent ~60°.
- L leg: Left leg: thigh forward ~114° (hip flexion); abducted ~166° outward; knee deeply bent (~116°).
- R leg: Right leg: thigh forward ~75° (hip flexion); knee bent ~20°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-95.5,"band":[-60,180],"ctx":"Right arm: arm abducted ~91° (lateral); shoulder extended ~96° behind; elbow bent ~60°.","verdict":"outside_band_review"}]