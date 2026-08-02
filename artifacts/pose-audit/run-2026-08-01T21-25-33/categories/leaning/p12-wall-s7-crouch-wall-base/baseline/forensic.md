# Forensic Baseline — p12-wall-s7-crouch-wall-base
- name: Low Crouch at Wall Base
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Crouch low near the base of the wall with the back or shoulder lightly touching it. Wrap arms around the knees or hold a piece of fabric/wrap close to the body. Turn the head up and toward the camera with a soft or playful gaze. Keep the hips low and weight balanced on the balls of the feet.
- tip: Keep heels lifted and weight on the balls of the feet in a deep crouch to maintain balance and elongate the calf lines.

## Raw joint config
```json
{
  "spine": -15,
  "neck": 9.9,
  "hips": 0,
  "leftShoulder": -40,
  "rightShoulder": -45,
  "leftElbow": 100,
  "rightElbow": 100,
  "shoulderFwdL": 12,
  "shoulderFwdR": 20,
  "leftHip": 115,
  "rightHip": 115,
  "leftKnee": 135,
  "rightKnee": 135,
  "leftAnkle": 16,
  "rightAnkle": 16,
  "hipAbductL": 12,
  "hipAbductR": 12,
  "globalTwist": 0,
  "globalRoll": 0,
  "globalTilt": -55
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -70.2,
    "yaw_deg": 0,
    "roll_deg": 26.5,
    "description": "Head pitch -70° (+: forward/down), roll 26° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -70,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -70° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 39.3,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 39° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 77.2,
    "shoulder_sagittal_flexion_deg": 61.9,
    "elbow_flexion_deg": 86.8,
    "forearm_forward_deg": 116.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~77° (lateral); shoulder flexed ~62° forward; elbow ~right-angle (87°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 73.6,
    "shoulder_sagittal_flexion_deg": 41.5,
    "elbow_flexion_deg": 91,
    "forearm_forward_deg": 121.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~74° (lateral); shoulder flexed ~42° forward; elbow ~right-angle (91°)."
  },
  "left_leg": {
    "hip_flexion_deg": 170,
    "hip_abduction_deg": -167.8,
    "knee_flexion_deg": 128,
    "foot_forward_deg": 17.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~170° (hip flexion); knee deeply bent (~128°)."
  },
  "right_leg": {
    "hip_flexion_deg": 170,
    "hip_abduction_deg": -167.8,
    "knee_flexion_deg": 128,
    "foot_forward_deg": 17.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~170° (hip flexion); knee deeply bent (~128°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.073,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.073,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.408,
    "foot_x_range": [
      -0.143,
      0.143
    ],
    "over_support": true,
    "feet_min_y": 0.073,
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
      "value": 170,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~170° (hip flexion); knee deeply bent (~128°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 170,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~170° (hip flexion); knee deeply bent (~128°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 101.49705999999983 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -70° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -70° (+: forward/down), roll 26° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 39° (low confidence).
- L arm: Left arm: arm abducted ~77° (lateral); shoulder flexed ~62° forward; elbow ~right-angle (87°).
- R arm: Right arm: arm abducted ~74° (lateral); shoulder flexed ~42° forward; elbow ~right-angle (91°).
- L leg: Left leg: thigh forward ~170° (hip flexion); knee deeply bent (~128°).
- R leg: Right leg: thigh forward ~170° (hip flexion); knee deeply bent (~128°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":170,"band":[-30,130],"ctx":"Left leg: thigh forward ~170° (hip flexion); knee deeply bent (~128°).","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":170,"band":[-30,130],"ctx":"Right leg: thigh forward ~170° (hip flexion); knee deeply bent (~128°).","verdict":"outside_band_review"}]