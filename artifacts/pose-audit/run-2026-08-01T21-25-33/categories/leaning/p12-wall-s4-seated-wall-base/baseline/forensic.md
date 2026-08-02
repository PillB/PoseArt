# Forensic Baseline — p12-wall-s4-seated-wall-base
- name: Seated at Wall Base
- category: leaning | difficulty: Beginner | angle: undefined
- instructions: Sit on the floor with your back resting against the base of the wall. Bend both knees up toward the chest or let one leg extend while the other stays bent. Rest one or both forearms on the raised knee. Tilt the head back gently against the wall and turn it toward the camera.
- tip: Keep the lower back in gentle contact with the wall for support, but lift the chest slightly away from the wall to avoid a slumped silhouette.

## Raw joint config
```json
{
  "spine": -14,
  "hips": 0,
  "neck": 8.2,
  "leftShoulder": -30,
  "rightShoulder": -30,
  "leftElbow": 81,
  "rightElbow": 60,
  "hipAbductL": 10,
  "hipAbductR": 5,
  "leftHip": 100,
  "rightHip": 70,
  "leftKnee": 120,
  "rightKnee": 80,
  "leftAnkle": -5,
  "rightAnkle": -8,
  "shoulderFwdL": 2,
  "shoulderFwdR": 5,
  "globalTilt": -80,
  "globalTwist": 0,
  "globalRoll": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -94.1,
    "yaw_deg": 0,
    "roll_deg": 117.3,
    "description": "Head pitch -94° (+: forward/down), roll 117° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -94,
    "lateral_flexion_deg": 180,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -94° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 44.6,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 96.6,
    "shoulder_sagittal_flexion_deg": 98.6,
    "elbow_flexion_deg": 63.4,
    "forearm_forward_deg": 132.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~97° (lateral); shoulder flexed ~99° forward; elbow bent ~63°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 93.6,
    "shoulder_sagittal_flexion_deg": 94.8,
    "elbow_flexion_deg": 47.9,
    "forearm_forward_deg": 130.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~94° (lateral); shoulder flexed ~95° forward; elbow bent ~48°."
  },
  "left_leg": {
    "hip_flexion_deg": 180,
    "hip_abduction_deg": -170,
    "knee_flexion_deg": 116.2,
    "foot_forward_deg": -8.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~180° (hip flexion); knee deeply bent (~116°)."
  },
  "right_leg": {
    "hip_flexion_deg": 150,
    "hip_abduction_deg": -174.2,
    "knee_flexion_deg": 79.4,
    "foot_forward_deg": -81.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~150° (hip flexion); knee ~right-angle (79°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.085,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.626,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.447,
    "foot_x_range": [
      -0.031,
      0.111
    ],
    "over_support": true,
    "feet_min_y": 0.085,
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
      "value": 180,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~180° (hip flexion); knee deeply bent (~116°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 150,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~150° (hip flexion); knee ~right-angle (79°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 111.49714999999985 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -94° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -94° (+: forward/down), roll 117° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm abducted ~97° (lateral); shoulder flexed ~99° forward; elbow bent ~63°.
- R arm: Right arm: arm abducted ~94° (lateral); shoulder flexed ~95° forward; elbow bent ~48°.
- L leg: Left leg: thigh forward ~180° (hip flexion); knee deeply bent (~116°).
- R leg: Right leg: thigh forward ~150° (hip flexion); knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":180,"band":[-30,130],"ctx":"Left leg: thigh forward ~180° (hip flexion); knee deeply bent (~116°).","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":150,"band":[-30,130],"ctx":"Right leg: thigh forward ~150° (hip flexion); knee ~right-angle (79°).","verdict":"outside_band_review"}]