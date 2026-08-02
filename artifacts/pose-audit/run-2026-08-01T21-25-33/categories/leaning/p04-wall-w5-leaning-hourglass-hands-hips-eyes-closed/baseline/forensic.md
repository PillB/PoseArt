# Forensic Baseline — p04-wall-w5-leaning-hourglass-hands-hips-eyes-closed
- name: Wall Leaning Hourglass Hands on Hips Eyes Closed
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Lean against the wall with the body sideways, one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, shoulders pushed down, bend the arms on the hips with elbows pushed behind the back to emphasize the hourglass shape, hands soft and relaxed, eyes closed.
- tip: Push the elbows back gently to accentuate the waist without straining the shoulders.

## Raw joint config
```json
{
  "spine": -16,
  "neck": -5.5,
  "hips": 22,
  "globalTilt": 8,
  "globalRoll": 10,
  "globalTwist": -10,
  "leftShoulder": -40,
  "rightShoulder": -52,
  "leftElbow": 75,
  "rightElbow": 75,
  "shoulderFwdL": -15,
  "shoulderFwdR": -15,
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
    "pitch_deg": -9.1,
    "yaw_deg": 0,
    "roll_deg": -13.9,
    "description": "Head pitch -9° (+: forward/down), roll -14° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -8,
    "lateral_flexion_deg": -8.6,
    "axial_rotation_deg": -9.9,
    "description": "Torso flexion -8° (+: forward), lateral -9° (+: figure's right), axial rotation proxy -10°."
  },
  "pelvis": {
    "tilt_deg": -3.5,
    "list_deg": 27.6,
    "yaw_deg": -12,
    "description": "Pelvic list 28° (+: left hip lower), yaw -12°, anterior/posterior tilt proxy -4° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 49.4,
    "shoulder_sagittal_flexion_deg": 22.9,
    "elbow_flexion_deg": 66.5,
    "forearm_forward_deg": 55.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~49°; shoulder flexed ~23° forward; elbow bent ~67°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 77.8,
    "shoulder_sagittal_flexion_deg": 73.8,
    "elbow_flexion_deg": 72.5,
    "forearm_forward_deg": 60.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~78° (lateral); shoulder flexed ~74° forward; elbow bent ~72°."
  },
  "left_leg": {
    "hip_flexion_deg": 2.4,
    "hip_abduction_deg": -37.1,
    "knee_flexion_deg": 5.2,
    "foot_forward_deg": 68.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 16.4,
    "hip_abduction_deg": 46,
    "knee_flexion_deg": 36.3,
    "foot_forward_deg": 119,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~16°; abducted ~46° outward; knee bent ~36°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.73,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.276,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.072,
    "com_z": -0.029,
    "foot_x_range": [
      0.393,
      0.72
    ],
    "over_support": false,
    "feet_min_y": -0.73,
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
| auto | true | 90.75149999999995 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -8° (+: forward), lateral -9° (+: figure's right), axial rotation proxy -10°.
- Head: Head pitch -9° (+: forward/down), roll -14° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 28° (+: left hip lower), yaw -12°, anterior/posterior tilt proxy -4° (low confidence).
- L arm: Left arm: arm abducted ~49°; shoulder flexed ~23° forward; elbow bent ~67°.
- R arm: Right arm: arm abducted ~78° (lateral); shoulder flexed ~74° forward; elbow bent ~72°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~16°; abducted ~46° outward; knee bent ~36°.
- Balance: COM outside foot support base (balance risk). (floating=false)