# Forensic Baseline — chair-twist-both
- name: Chair Twist Both Arms
- category: seated | difficulty: Intermediate | angle: Back
- instructions: Sit backward on a chair facing away from camera, then twist the torso and drape both arms over the top of the backrest. Look back over one shoulder toward the lens, chin resting near the top hand.
- tip: Rest the chin near the top hand — it gives the twisted gaze a natural focal point.

## Raw joint config
```json
{
  "spine": 22,
  "neck": 26,
  "leftShoulder": 60,
  "rightShoulder": 20,
  "leftElbow": 75,
  "rightElbow": 75,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 24.2,
    "yaw_deg": 0,
    "roll_deg": 26,
    "description": "Head pitch 24° (+: forward/down), roll 26° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 22,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 22° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -37.4,
    "shoulder_sagittal_flexion_deg": -19.9,
    "elbow_flexion_deg": 46.9,
    "forearm_forward_deg": -42,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder extended ~20° behind; elbow bent ~47°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 6.2,
    "shoulder_sagittal_flexion_deg": -19.8,
    "elbow_flexion_deg": 22.9,
    "forearm_forward_deg": -1.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder extended ~20° behind; elbow bent ~23°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -148.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -148.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.512,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.512,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.124,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.512,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_abduction",
      "value": -37.4,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder extended ~20° behind; elbow bent ~47°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.99699999999993 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 22° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 24° (+: forward/down), roll 26° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; shoulder extended ~20° behind; elbow bent ~47°.
- R arm: Right arm: arm at side; shoulder extended ~20° behind; elbow bent ~23°.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)
- Plausibility flags: [{"joint":"left_shoulder_abduction","value":-37.4,"band":[0,180],"ctx":"Left arm: arm at side; shoulder extended ~20° behind; elbow bent ~47°.","verdict":"outside_band_review"}]