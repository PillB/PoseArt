# Forensic Baseline — kneeling-chest-open
- name: Kneeling Chest Open
- category: kneeling | difficulty: Beginner | angle: Front
- instructions: Kneel and lean forward onto both hands flat on the floor, hips lifted slightly off the heels. Arch the back gently, not rounded, and lift the gaze forward for a feline, poised look.
- tip: A gentle spinal arch, not a rounded back, gives this pose its elegant, cat-like quality.

## Raw joint config
```json
{
  "spine": -20,
  "neck": -10,
  "leftShoulder": 35,
  "leftElbow": 65,
  "rightShoulder": -35,
  "rightElbow": 45,
  "leftHip": 80,
  "leftKnee": 90,
  "leftAnkle": -35,
  "rightHip": 80,
  "rightKnee": 90,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -20.3,
    "yaw_deg": 0,
    "roll_deg": -10,
    "description": "Head pitch -20° (+: forward/down), roll -10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -20,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -10.9,
    "shoulder_sagittal_flexion_deg": 18.7,
    "elbow_flexion_deg": 24.7,
    "forearm_forward_deg": -3.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder flexed ~19° forward; elbow bent ~25°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 59.1,
    "shoulder_sagittal_flexion_deg": 32.9,
    "elbow_flexion_deg": 39.4,
    "forearm_forward_deg": 56.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~59°; shoulder flexed ~33° forward; elbow bent ~39°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
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
    "com_x": 0,
    "com_z": -0.113,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.524,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_abduction",
      "value": -10.9,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder flexed ~19° forward; elbow bent ~25°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 106.50299999999999 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -20° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -20° (+: forward/down), roll -10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; shoulder flexed ~19° forward; elbow bent ~25°.
- R arm: Right arm: arm abducted ~59°; shoulder flexed ~33° forward; elbow bent ~39°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- Balance: COM over foot support base. (floating=true)
- Plausibility flags: [{"joint":"left_shoulder_abduction","value":-10.9,"band":[0,180],"ctx":"Left arm: arm at side; shoulder flexed ~19° forward; elbow bent ~25°.","verdict":"outside_band_review"}]