# Forensic Baseline — p15-chair-s8-profile-cross-legged
- name: Chair Profile Cross-Legged
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit centered on the chair in profile, cross one leg over the other at the knee, hands resting one on top of the other on the top knee, spine straight, head turned to face camera.
- tip: This is a timeless corporate/classic pose — keep the top foot flexed rather than dangling for a polished line.

## Raw joint config
```json
{
  "spine": 0,
  "neck": -5,
  "hips": 0,
  "globalTilt": 0,
  "globalRoll": 0,
  "globalTwist": 45,
  "leftShoulder": -50,
  "rightShoulder": -62,
  "leftElbow": 95,
  "rightElbow": 95,
  "shoulderFwdL": 25,
  "shoulderFwdR": 15,
  "leftHip": 92,
  "rightHip": 90,
  "leftKnee": 95,
  "rightKnee": 90,
  "leftAnkle": -8,
  "rightAnkle": 0,
  "hipAbductL": -5,
  "hipAbductR": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 3.5,
    "yaw_deg": 0,
    "roll_deg": -3.5,
    "description": "Head pitch 4° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 0,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 35.3,
    "description": "Torso flexion 0° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 35°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 35.3,
    "description": "Pelvic list 0° (+: left hip lower), yaw 35°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 71.8,
    "shoulder_sagittal_flexion_deg": 47.9,
    "elbow_flexion_deg": 88.9,
    "forearm_forward_deg": 68.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~72° (lateral); shoulder flexed ~48° forward; elbow ~right-angle (89°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 79.7,
    "shoulder_sagittal_flexion_deg": -84,
    "elbow_flexion_deg": 94.3,
    "forearm_forward_deg": 77.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~80° (lateral); shoulder extended ~84° behind; elbow ~right-angle (94°)."
  },
  "left_leg": {
    "hip_flexion_deg": 92.6,
    "hip_abduction_deg": -93.1,
    "knee_flexion_deg": 94.8,
    "foot_forward_deg": -136,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~93° (hip flexion); knee ~right-angle (95°)."
  },
  "right_leg": {
    "hip_flexion_deg": 90,
    "hip_abduction_deg": 90,
    "knee_flexion_deg": 90,
    "foot_forward_deg": -133.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~90° (hip flexion); abducted ~90° outward; knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.564,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.55,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0,
    "foot_x_range": [
      -0.012,
      0.357
    ],
    "over_support": true,
    "feet_min_y": 0.55,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -84,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~80° (lateral); shoulder extended ~84° behind; elbow ~right-angle (94°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49850000000012 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 0° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 35°.
- Head: Head pitch 4° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 35°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~72° (lateral); shoulder flexed ~48° forward; elbow ~right-angle (89°).
- R arm: Right arm: arm abducted ~80° (lateral); shoulder extended ~84° behind; elbow ~right-angle (94°).
- L leg: Left leg: thigh forward ~93° (hip flexion); knee ~right-angle (95°).
- R leg: Right leg: thigh forward ~90° (hip flexion); abducted ~90° outward; knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=true)
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-84,"band":[-60,180],"ctx":"Right arm: arm abducted ~80° (lateral); shoulder extended ~84° behind; elbow ~right-angle (94°).","verdict":"outside_band_review"}]