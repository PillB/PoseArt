# Forensic Baseline — p17-tubes-s6-side-sit-twist-look-back
- name: Side Seat with Twisting Look Back
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit sideways on a tube with legs together, angled away from camera. Twist the torso and shoulders back toward the lens, resting one hand on the tube behind you and the other on the top thigh. Look back over the shoulder with a soft gaze.
- tip: Initiate the twist from the ribcage, not just the neck, for a more natural and elegant spiral through the torso.

## Raw joint config
```json
{
  "spine": 15,
  "neck": -11,
  "hips": -15,
  "globalTilt": 8,
  "globalRoll": 5,
  "globalTwist": 40,
  "leftShoulder": -30,
  "rightShoulder": -45,
  "leftElbow": 40,
  "rightElbow": 70,
  "shoulderFwdL": -5,
  "shoulderFwdR": 15,
  "leftHip": 90,
  "rightHip": 95,
  "leftKnee": 95,
  "rightKnee": 98,
  "leftAnkle": -5,
  "rightAnkle": -8,
  "hipAbductL": -10,
  "hipAbductR": -8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 24.6,
    "yaw_deg": 0,
    "roll_deg": 1.8,
    "description": "Head pitch 25° (+: forward/down), roll 2° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 17.7,
    "lateral_flexion_deg": 10.3,
    "axial_rotation_deg": 32.7,
    "description": "Torso flexion 18° (+: forward), lateral 10° (+: figure's right), axial rotation proxy 33°."
  },
  "pelvis": {
    "tilt_deg": 3.6,
    "list_deg": -10.9,
    "yaw_deg": 33,
    "description": "Pelvic list -11° (+: left hip lower), yaw 33°, anterior/posterior tilt proxy 4° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 49.6,
    "shoulder_sagittal_flexion_deg": 27.8,
    "elbow_flexion_deg": 31.4,
    "forearm_forward_deg": 44.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~50°; shoulder flexed ~28° forward; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 50.7,
    "shoulder_sagittal_flexion_deg": -74.1,
    "elbow_flexion_deg": 63.9,
    "forearm_forward_deg": -7.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~51°; shoulder extended ~74° behind; elbow bent ~64°."
  },
  "left_leg": {
    "hip_flexion_deg": 83.8,
    "hip_abduction_deg": -68.5,
    "knee_flexion_deg": 85,
    "foot_forward_deg": -142.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~84° (hip flexion); knee ~right-angle (85°)."
  },
  "right_leg": {
    "hip_flexion_deg": 89.7,
    "hip_abduction_deg": 89.5,
    "knee_flexion_deg": 96.6,
    "foot_forward_deg": -133.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~90° (hip flexion); abducted ~90° outward; knee ~right-angle (97°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.489,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.507,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.056,
    "com_z": 0.112,
    "foot_x_range": [
      -0.302,
      0.175
    ],
    "over_support": true,
    "feet_min_y": 0.489,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -74.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~51°; shoulder extended ~74° behind; elbow bent ~64°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.25000000000009 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 18° (+: forward), lateral 10° (+: figure's right), axial rotation proxy 33°.
- Head: Head pitch 25° (+: forward/down), roll 2° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -11° (+: left hip lower), yaw 33°, anterior/posterior tilt proxy 4° (low confidence).
- L arm: Left arm: arm abducted ~50°; shoulder flexed ~28° forward; elbow bent ~31°.
- R arm: Right arm: arm abducted ~51°; shoulder extended ~74° behind; elbow bent ~64°.
- L leg: Left leg: thigh forward ~84° (hip flexion); knee ~right-angle (85°).
- R leg: Right leg: thigh forward ~90° (hip flexion); abducted ~90° outward; knee ~right-angle (97°).
- Balance: COM over foot support base. (floating=false)
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-74.1,"band":[-60,180],"ctx":"Right arm: arm abducted ~51°; shoulder extended ~74° behind; elbow bent ~64°.","verdict":"outside_band_review"}]