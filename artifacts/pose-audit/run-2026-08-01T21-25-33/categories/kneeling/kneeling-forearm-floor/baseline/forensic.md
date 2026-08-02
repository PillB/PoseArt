# Forensic Baseline — kneeling-forearm-floor
- name: Kneeling Forearm Floor
- category: kneeling | difficulty: Intermediate | angle: Side
- instructions: Kneel upright and rotate the torso fully to one side, reaching the trailing arm across the body while the front arm opens outward. Keep both knees anchored throughout the rotation.
- tip: Keep both knees anchored on the ground — the twist should isolate the torso, not shift the base.

## Raw joint config
```json
{
  "spine": 32,
  "leftElbow": 80,
  "rightElbow": 80,
  "shoulderFwdL": 35,
  "shoulderFwdR": 35,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "leftAnkle": -35,
  "rightAnkle": -35,
  "rightShoulder": -12,
  "neck": -10.6,
  "hipAbductL": 8,
  "hipAbductR": 8,
  "globalTwist": 25
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 33.2,
    "yaw_deg": 0,
    "roll_deg": 5.7,
    "description": "Head pitch 33° (+: forward/down), roll 6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 29.5,
    "lateral_flexion_deg": 14.8,
    "axial_rotation_deg": 22.9,
    "description": "Torso flexion 30° (+: forward), lateral 15° (+: figure's right), axial rotation proxy 23°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 22.9,
    "description": "Pelvic list 0° (+: left hip lower), yaw 23°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 20.8,
    "shoulder_sagittal_flexion_deg": -35.1,
    "elbow_flexion_deg": 45,
    "forearm_forward_deg": 11.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~21°; shoulder extended ~35° behind; elbow bent ~45°."
  },
  "right_arm": {
    "shoulder_abduction_deg": -12.5,
    "shoulder_sagittal_flexion_deg": -46.2,
    "elbow_flexion_deg": 53.7,
    "forearm_forward_deg": -22.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder extended ~46° behind; elbow bent ~54°."
  },
  "left_leg": {
    "hip_flexion_deg": 78.2,
    "hip_abduction_deg": -72.3,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -167.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~78° (hip flexion); knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": 79.7,
    "hip_abduction_deg": 59,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -171.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); abducted ~59° outward; knee ~right-angle (89°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.074,
    "com_z": 0.158,
    "foot_x_range": [
      0.118,
      0.273
    ],
    "over_support": false,
    "feet_min_y": 0.524,
    "floating": true,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "right_shoulder_abduction",
      "value": -12.5,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder extended ~46° behind; elbow bent ~54°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 105.00000000000033 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 30° (+: forward), lateral 15° (+: figure's right), axial rotation proxy 23°.
- Head: Head pitch 33° (+: forward/down), roll 6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 23°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~21°; shoulder extended ~35° behind; elbow bent ~45°.
- R arm: Right arm: arm at side; shoulder extended ~46° behind; elbow bent ~54°.
- L leg: Left leg: thigh forward ~78° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~80° (hip flexion); abducted ~59° outward; knee ~right-angle (89°).
- Balance: COM outside foot support base (balance risk). (floating=true)
- Plausibility flags: [{"joint":"right_shoulder_abduction","value":-12.5,"band":[0,180],"ctx":"Right arm: arm at side; shoulder extended ~46° behind; elbow bent ~54°.","verdict":"outside_band_review"}]