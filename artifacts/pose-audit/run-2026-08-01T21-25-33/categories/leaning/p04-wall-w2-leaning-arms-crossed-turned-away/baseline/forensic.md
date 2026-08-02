# Forensic Baseline — p04-wall-w2-leaning-arms-crossed-turned-away
- name: Wall Leaning Arms Crossed Turned Away
- category: leaning | difficulty: Beginner | angle: undefined
- instructions: Lean against the wall with one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, cross the arms, drop the shoulders, and turn away from the camera.
- tip: Keep the crossed arms relaxed against the torso rather than gripping, to soften the silhouette.

## Raw joint config
```json
{
  "spine": -14,
  "neck": 20,
  "hips": 18,
  "globalTilt": 5,
  "globalRoll": 0,
  "globalTwist": -35,
  "leftShoulder": -30,
  "rightShoulder": -42,
  "leftElbow": 81,
  "rightElbow": 81,
  "shoulderFwdL": 5,
  "shoulderFwdR": 15,
  "leftHip": 5,
  "rightHip": 15,
  "leftKnee": 5,
  "rightKnee": 45,
  "leftAnkle": 5,
  "rightAnkle": 5,
  "hipAbductL": 5,
  "hipAbductR": -15
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 3.6,
    "yaw_deg": 0,
    "roll_deg": 21.4,
    "description": "Head pitch 4° (+: forward/down), roll 21° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -7.4,
    "lateral_flexion_deg": 5.2,
    "axial_rotation_deg": -29.8,
    "description": "Torso flexion -7° (+: forward), lateral 5° (+: figure's right), axial rotation proxy -30°."
  },
  "pelvis": {
    "tilt_deg": 6.2,
    "list_deg": 17.1,
    "yaw_deg": -29.6,
    "description": "Pelvic list 17° (+: left hip lower), yaw -30°, anterior/posterior tilt proxy 6° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 50.4,
    "shoulder_sagittal_flexion_deg": -32.3,
    "elbow_flexion_deg": 63.4,
    "forearm_forward_deg": 42.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~50°; shoulder extended ~32° behind; elbow bent ~63°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 62.6,
    "shoulder_sagittal_flexion_deg": 50.3,
    "elbow_flexion_deg": 72.6,
    "forearm_forward_deg": 56.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~63° (lateral); shoulder flexed ~50° forward; elbow bent ~73°."
  },
  "left_leg": {
    "hip_flexion_deg": 13.7,
    "hip_abduction_deg": -19.2,
    "knee_flexion_deg": 5.3,
    "foot_forward_deg": 67.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 27.6,
    "hip_abduction_deg": 23.7,
    "knee_flexion_deg": 38.1,
    "foot_forward_deg": 120,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~28°; abducted ~24° outward; knee bent ~38°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.812,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.4,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.024,
    "com_z": -0.034,
    "foot_x_range": [
      0.074,
      0.301
    ],
    "over_support": false,
    "feet_min_y": -0.812,
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
| auto | true | 91.50299999999974 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -7° (+: forward), lateral 5° (+: figure's right), axial rotation proxy -30°.
- Head: Head pitch 4° (+: forward/down), roll 21° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 17° (+: left hip lower), yaw -30°, anterior/posterior tilt proxy 6° (low confidence).
- L arm: Left arm: arm abducted ~50°; shoulder extended ~32° behind; elbow bent ~63°.
- R arm: Right arm: arm abducted ~63° (lateral); shoulder flexed ~50° forward; elbow bent ~73°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~28°; abducted ~24° outward; knee bent ~38°.
- Balance: COM outside foot support base (balance risk). (floating=false)