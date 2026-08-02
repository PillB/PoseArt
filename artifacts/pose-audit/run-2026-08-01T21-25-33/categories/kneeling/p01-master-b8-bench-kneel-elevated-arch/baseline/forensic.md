# Forensic Baseline — p01-master-b8-bench-kneel-elevated-arch
- name: Bench Kneeling Elevated Body Arch Eyes Closed
- category: kneeling | difficulty: Advanced | angle: undefined
- instructions: Kneel on the bench with the body slightly elevated. Bend both arms, arch the back, and lean the upper body slightly forward. Close the eyes and tilt the face toward the camera.
- tip: Lift through the sternum rather than just dropping the head back, to keep the arch controlled and elegant.

## Raw joint config
```json
{
  "spine": -32,
  "neck": -11,
  "hips": -15,
  "globalTilt": 25,
  "globalRoll": 15,
  "globalTwist": 20,
  "leftShoulder": -70,
  "rightShoulder": -65,
  "leftElbow": 55,
  "rightElbow": 58,
  "shoulderFwdL": -30,
  "shoulderFwdR": -20,
  "leftHip": 118,
  "rightHip": 118,
  "leftKnee": 138,
  "rightKnee": 138,
  "leftAnkle": -25,
  "rightAnkle": -25,
  "hipAbductL": 6,
  "hipAbductR": 6
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -4.2,
    "yaw_deg": 0,
    "roll_deg": -26.3,
    "description": "Head pitch -4° (+: forward/down), roll -26° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -6.9,
    "lateral_flexion_deg": -17.4,
    "axial_rotation_deg": 18.9,
    "description": "Torso flexion -7° (+: forward), lateral -17° (+: figure's right), axial rotation proxy 19°."
  },
  "pelvis": {
    "tilt_deg": -16.4,
    "list_deg": -0.1,
    "yaw_deg": 23.4,
    "description": "Pelvic list 0° (+: left hip lower), yaw 23°, anterior/posterior tilt proxy -16° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 20.7,
    "shoulder_sagittal_flexion_deg": 71.5,
    "elbow_flexion_deg": 55.3,
    "forearm_forward_deg": 77.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~21°; shoulder flexed ~71° forward; elbow bent ~55°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 85.5,
    "shoulder_sagittal_flexion_deg": 80.7,
    "elbow_flexion_deg": 58.5,
    "forearm_forward_deg": 66.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~86° (lateral); shoulder flexed ~81° forward; elbow bent ~59°."
  },
  "left_leg": {
    "hip_flexion_deg": 95.8,
    "hip_abduction_deg": -120.2,
    "knee_flexion_deg": 135.4,
    "foot_forward_deg": -90.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~96° (hip flexion); knee deeply bent (~135°)."
  },
  "right_leg": {
    "hip_flexion_deg": 92.4,
    "hip_abduction_deg": -144.9,
    "knee_flexion_deg": 119.4,
    "foot_forward_deg": -87.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~92° (hip flexion); knee deeply bent (~119°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.303,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.223,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.109,
    "com_z": 0.01,
    "foot_x_range": [
      -0.406,
      -0.248
    ],
    "over_support": false,
    "feet_min_y": 0.223,
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
| auto | true | 104.99100000000014 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -7° (+: forward), lateral -17° (+: figure's right), axial rotation proxy 19°.
- Head: Head pitch -4° (+: forward/down), roll -26° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 23°, anterior/posterior tilt proxy -16° (low confidence).
- L arm: Left arm: arm abducted ~21°; shoulder flexed ~71° forward; elbow bent ~55°.
- R arm: Right arm: arm abducted ~86° (lateral); shoulder flexed ~81° forward; elbow bent ~59°.
- L leg: Left leg: thigh forward ~96° (hip flexion); knee deeply bent (~135°).
- R leg: Right leg: thigh forward ~92° (hip flexion); knee deeply bent (~119°).
- Balance: COM outside foot support base (balance risk). (floating=false)