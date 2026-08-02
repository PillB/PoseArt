# Forensic Baseline — seated-v-stretch
- name: Seated V Stretch
- category: seated | difficulty: Intermediate | angle: Front
- instructions: Sit on the floor and open both legs into a wide V. Lead with the chest as you lean forward, reaching both arms between the legs or resting hands flat on the floor.
- tip: Lead the forward lean with the chest, not the head — it keeps the spine long instead of rounding.

## Raw joint config
```json
{
  "spine": 6,
  "leftShoulder": 20,
  "leftElbow": 70,
  "rightElbow": 50,
  "leftHip": 40,
  "rightHip": -40,
  "leftKnee": 90,
  "rightKnee": 90,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "neck": -6,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 6,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch 6° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 6,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 6° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 2.2,
    "shoulder_sagittal_flexion_deg": -5.9,
    "elbow_flexion_deg": 4.9,
    "forearm_forward_deg": -2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 23.3,
    "shoulder_sagittal_flexion_deg": -3.9,
    "elbow_flexion_deg": 18.1,
    "forearm_forward_deg": 14,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~23°; elbow bent ~18°."
  },
  "left_leg": {
    "hip_flexion_deg": 40,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": 171.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~40°; knee ~right-angle (90°)."
  },
  "right_leg": {
    "hip_flexion_deg": -40,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": 91.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~40° behind; knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.133,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.546,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.034,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.546,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "right_hip_flexion",
      "value": -40,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~40° behind; knee ~right-angle (90°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.24261999999997 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 6° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 6° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; elbow straight.
- R arm: Right arm: arm abducted ~23°; elbow bent ~18°.
- L leg: Left leg: thigh forward ~40°; knee ~right-angle (90°).
- R leg: Right leg: thigh extended ~40° behind; knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)
- Plausibility flags: [{"joint":"right_hip_flexion","value":-40,"band":[-30,130],"ctx":"Right leg: thigh extended ~40° behind; knee ~right-angle (90°).","verdict":"outside_band_review"}]