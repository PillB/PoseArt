# Forensic Baseline — p12-wall-s8-one-leg-up-wall
- name: One Leg Raised Against Wall
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Stand in profile beside the wall. Raise one leg and place the foot flat against the wall at knee-to-hip height, creating a strong bent-leg silhouette. Rest weight fully on the standing leg. Let the arms hang naturally or one hand rest on the raised thigh, and keep the torso upright and elongated.
- tip: Rotate the raised knee slightly outward rather than straight forward, this keeps the hip open and avoids looking like a static stretch.

## Raw joint config
```json
{
  "spine": 18,
  "neck": 6,
  "hips": 0,
  "leftShoulder": -5,
  "rightShoulder": -5,
  "leftElbow": 60,
  "rightElbow": 15,
  "shoulderFwdL": -3,
  "shoulderFwdR": 0,
  "leftHip": 75,
  "rightHip": -3,
  "leftKnee": 95,
  "rightKnee": 5,
  "leftAnkle": 14,
  "rightAnkle": 0,
  "hipAbductL": 22,
  "hipAbductR": 0,
  "globalTwist": 0,
  "globalRoll": 0,
  "globalTilt": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 18.1,
    "yaw_deg": 0,
    "roll_deg": 6,
    "description": "Head pitch 18° (+: forward/down), roll 6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 29.6,
    "shoulder_sagittal_flexion_deg": -17.2,
    "elbow_flexion_deg": 29.6,
    "forearm_forward_deg": 16.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~30°; shoulder extended ~17° behind; elbow bent ~30°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 28.9,
    "shoulder_sagittal_flexion_deg": -18.7,
    "elbow_flexion_deg": 6.9,
    "forearm_forward_deg": -11.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~29°; shoulder extended ~19° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 75,
    "hip_abduction_deg": -57.4,
    "knee_flexion_deg": 85.2,
    "foot_forward_deg": -117.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~75° (hip flexion); knee ~right-angle (85°)."
  },
  "right_leg": {
    "hip_flexion_deg": -3,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 58.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.389,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.875,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.102,
    "foot_x_range": [
      0.05,
      0.297
    ],
    "over_support": false,
    "feet_min_y": -0.875,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49048999999981 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 18° (+: forward/down), roll 6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~30°; shoulder extended ~17° behind; elbow bent ~30°.
- R arm: Right arm: arm abducted ~29°; shoulder extended ~19° behind; elbow straight.
- L leg: Left leg: thigh forward ~75° (hip flexion); knee ~right-angle (85°).
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)