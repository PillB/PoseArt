# Forensic Baseline — p04-wall-w4-leaning-sideways-hip-wall-eyes-closed
- name: Wall Leaning Sideways Hand on Wall Eyes Closed
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Lean against the wall with the body sideways, one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, shoulders pushed down, bend the arms with one hand on the hip and the other touching the wall, eyes closed.
- tip: Let the wall-touching hand rest lightly for balance while keeping the eyes softly closed.

## Raw joint config
```json
{
  "spine": -15,
  "neck": -5.5,
  "hips": 22,
  "globalTilt": 8,
  "globalRoll": 10,
  "globalTwist": -15,
  "leftShoulder": -30,
  "rightShoulder": -50,
  "leftElbow": 65,
  "rightElbow": 20,
  "shoulderFwdL": 2,
  "shoulderFwdR": 8,
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
    "pitch_deg": -8.4,
    "yaw_deg": 0,
    "roll_deg": -13.3,
    "description": "Head pitch -8° (+: forward/down), roll -13° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -6.8,
    "lateral_flexion_deg": -8.2,
    "axial_rotation_deg": -14.5,
    "description": "Torso flexion -7° (+: forward), lateral -8° (+: figure's right), axial rotation proxy -15°."
  },
  "pelvis": {
    "tilt_deg": -1.6,
    "list_deg": 27.4,
    "yaw_deg": -16.2,
    "description": "Pelvic list 27° (+: left hip lower), yaw -16°, anterior/posterior tilt proxy -2° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 42.9,
    "shoulder_sagittal_flexion_deg": -6.2,
    "elbow_flexion_deg": 51.9,
    "forearm_forward_deg": 40.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~43°; elbow bent ~52°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 82.4,
    "shoulder_sagittal_flexion_deg": 68.1,
    "elbow_flexion_deg": 19.6,
    "forearm_forward_deg": 67.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~82° (lateral); shoulder flexed ~68° forward; elbow bent ~20°."
  },
  "left_leg": {
    "hip_flexion_deg": 5.2,
    "hip_abduction_deg": -36.9,
    "knee_flexion_deg": 5.2,
    "foot_forward_deg": 67.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 20.1,
    "hip_abduction_deg": 45.1,
    "knee_flexion_deg": 36.3,
    "foot_forward_deg": 118,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~20°; abducted ~45° outward; knee bent ~36°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.733,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.285,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.072,
    "com_z": -0.023,
    "foot_x_range": [
      0.376,
      0.669
    ],
    "over_support": false,
    "feet_min_y": -0.733,
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
| auto | true | 89.99253000000013 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -7° (+: forward), lateral -8° (+: figure's right), axial rotation proxy -15°.
- Head: Head pitch -8° (+: forward/down), roll -13° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 27° (+: left hip lower), yaw -16°, anterior/posterior tilt proxy -2° (low confidence).
- L arm: Left arm: arm abducted ~43°; elbow bent ~52°.
- R arm: Right arm: arm abducted ~82° (lateral); shoulder flexed ~68° forward; elbow bent ~20°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~20°; abducted ~45° outward; knee bent ~36°.
- Balance: COM outside foot support base (balance risk). (floating=false)