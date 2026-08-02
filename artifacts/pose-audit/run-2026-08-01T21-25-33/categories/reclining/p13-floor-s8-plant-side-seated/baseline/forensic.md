# Forensic Baseline — p13-floor-s8-plant-side-seated
- name: Side-Seated by Potted Plant, Eyes Closed
- category: reclining | difficulty: Beginner | angle: undefined
- instructions: Sit on the floor near a potted plant with legs bent and folded to one side. Bring one arm across the chest, resting the hand near the opposite shoulder, and close the eyes in a relaxed, meditative moment.
- tip: Angle the body slightly toward the plant so it frames the composition instead of competing with the subject for attention.

## Raw joint config
```json
{
  "spine": -8,
  "neck": -15,
  "hips": 5,
  "leftShoulder": 60,
  "rightShoulder": -10,
  "leftElbow": 95,
  "rightElbow": 30,
  "shoulderFwdL": 30,
  "shoulderFwdR": 10,
  "leftHip": 105,
  "rightHip": 108,
  "leftKnee": 128,
  "rightKnee": 125,
  "leftAnkle": -8,
  "rightAnkle": -8,
  "hipAbductL": 12,
  "hipAbductR": -15,
  "globalTwist": -10,
  "globalRoll": 5,
  "globalTilt": -55
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -64.6,
    "yaw_deg": 0,
    "roll_deg": -18.3,
    "description": "Head pitch -65° (+: forward/down), roll -18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -62,
    "lateral_flexion_deg": 13.8,
    "axial_rotation_deg": -9.9,
    "description": "Torso flexion -62° (+: forward), lateral 14° (+: figure's right), axial rotation proxy -10°."
  },
  "pelvis": {
    "tilt_deg": 39.3,
    "list_deg": 7.8,
    "yaw_deg": -5.9,
    "description": "Pelvic list 8° (+: left hip lower), yaw -6°, anterior/posterior tilt proxy 39° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -72.8,
    "shoulder_sagittal_flexion_deg": 84.4,
    "elbow_flexion_deg": 55.1,
    "forearm_forward_deg": 25.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder flexed ~84° forward; elbow bent ~55°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 48.3,
    "shoulder_sagittal_flexion_deg": 62.3,
    "elbow_flexion_deg": 16.8,
    "forearm_forward_deg": 76.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~48°; shoulder flexed ~62° forward; elbow bent ~17°."
  },
  "left_leg": {
    "hip_flexion_deg": 157.8,
    "hip_abduction_deg": -170.6,
    "knee_flexion_deg": 117.1,
    "foot_forward_deg": -21.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~158° (hip flexion); knee deeply bent (~117°)."
  },
  "right_leg": {
    "hip_flexion_deg": 160.3,
    "hip_abduction_deg": 167.2,
    "knee_flexion_deg": 114.4,
    "foot_forward_deg": -20.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~160° (hip flexion); abducted ~167° outward; knee ~right-angle (114°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.174,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.209,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.049,
    "com_z": -0.386,
    "foot_x_range": [
      0.147,
      0.536
    ],
    "over_support": false,
    "feet_min_y": 0.174,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
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
      "joint": "left_shoulder_abduction",
      "value": -72.8,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder flexed ~84° forward; elbow bent ~55°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": 157.8,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~158° (hip flexion); knee deeply bent (~117°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 160.3,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~160° (hip flexion); abducted ~167° outward; knee ~right-angle (114°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 101.49805000000003 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -62° (+: forward), lateral 14° (+: figure's right), axial rotation proxy -10°.
- Head: Head pitch -65° (+: forward/down), roll -18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 8° (+: left hip lower), yaw -6°, anterior/posterior tilt proxy 39° (low confidence).
- L arm: Left arm: arm at side; shoulder flexed ~84° forward; elbow bent ~55°.
- R arm: Right arm: arm abducted ~48°; shoulder flexed ~62° forward; elbow bent ~17°.
- L leg: Left leg: thigh forward ~158° (hip flexion); knee deeply bent (~117°).
- R leg: Right leg: thigh forward ~160° (hip flexion); abducted ~167° outward; knee ~right-angle (114°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_shoulder_abduction","value":-72.8,"band":[0,180],"ctx":"Left arm: arm at side; shoulder flexed ~84° forward; elbow bent ~55°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":157.8,"band":[-30,130],"ctx":"Left leg: thigh forward ~158° (hip flexion); knee deeply bent (~117°).","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":160.3,"band":[-30,130],"ctx":"Right leg: thigh forward ~160° (hip flexion); abducted ~167° outward; knee ~right-angle (114°).","verdict":"outside_band_review"}]