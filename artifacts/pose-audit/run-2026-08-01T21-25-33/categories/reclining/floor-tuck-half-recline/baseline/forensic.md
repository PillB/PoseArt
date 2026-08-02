# Forensic Baseline — floor-tuck-half-recline
- name: Floor Tuck Half Recline
- category: reclining | difficulty: Intermediate | angle: 3/4 View
- instructions: Lie back with knees bent and drawn toward the chest, arms wrapped loosely around the shins. A tucked, half-reclined shape between sitting and lying flat.
- tip: Keep the shoulders down and relaxed rather than hiked up toward the ears.

## Raw joint config
```json
{
  "globalTilt": -75,
  "spine": -10,
  "leftElbow": 40,
  "rightShoulder": 12,
  "rightElbow": 40,
  "leftHip": 80,
  "leftKnee": 120,
  "rightHip": 80,
  "rightKnee": 120
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -85,
    "yaw_deg": 0,
    "roll_deg": 0,
    "description": "Head pitch -85° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -85,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 44,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 44° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 78.3,
    "shoulder_sagittal_flexion_deg": 85,
    "elbow_flexion_deg": 16.9,
    "forearm_forward_deg": 95.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~78° (lateral); shoulder flexed ~85° forward; elbow bent ~17°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 63.3,
    "shoulder_sagittal_flexion_deg": 84.4,
    "elbow_flexion_deg": 10.9,
    "forearm_forward_deg": 87.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~63° (lateral); shoulder flexed ~84° forward; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 155,
    "hip_abduction_deg": 180,
    "knee_flexion_deg": 120,
    "foot_forward_deg": -28.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~155° (hip flexion); abducted ~180° outward; knee deeply bent (~120°)."
  },
  "right_leg": {
    "hip_flexion_deg": 155,
    "hip_abduction_deg": 180,
    "knee_flexion_deg": 120,
    "foot_forward_deg": -28.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~155° (hip flexion); abducted ~180° outward; knee deeply bent (~120°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.24,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.24,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.445,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.24,
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
      "value": 155,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~155° (hip flexion); abducted ~180° outward; knee deeply bent (~120°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 155,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~155° (hip flexion); abducted ~180° outward; knee deeply bent (~120°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 112.24703000000005 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -85° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -85° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 44° (low confidence).
- L arm: Left arm: arm abducted ~78° (lateral); shoulder flexed ~85° forward; elbow bent ~17°.
- R arm: Right arm: arm abducted ~63° (lateral); shoulder flexed ~84° forward; elbow straight.
- L leg: Left leg: thigh forward ~155° (hip flexion); abducted ~180° outward; knee deeply bent (~120°).
- R leg: Right leg: thigh forward ~155° (hip flexion); abducted ~180° outward; knee deeply bent (~120°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":155,"band":[-30,130],"ctx":"Left leg: thigh forward ~155° (hip flexion); abducted ~180° outward; knee deeply bent (~120°).","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":155,"band":[-30,130],"ctx":"Right leg: thigh forward ~155° (hip flexion); abducted ~180° outward; knee deeply bent (~120°).","verdict":"outside_band_review"}]