# Forensic Baseline — p04-wall-w6-back-against-wall-hip-away-eyes-closed
- name: Wall Back Against Wall Hips Away Eyes Closed
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Lean with the back against the wall, one leg straight and the other bent. Arch the back with the hips away from the wall, bend the arms with one hand on the hip and the other touching the wall, eyes closed.
- tip: Push the hips away from the wall gently while keeping the shoulder blades in contact for support.

## Raw joint config
```json
{
  "spine": -24,
  "neck": -6.6,
  "hips": -7.5,
  "globalTilt": -15,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -35,
  "rightShoulder": -25,
  "leftElbow": 70,
  "rightElbow": 20,
  "shoulderFwdL": 2,
  "shoulderFwdR": 8,
  "leftHip": 5,
  "rightHip": 20,
  "leftKnee": 5,
  "rightKnee": 40,
  "leftAnkle": 5,
  "rightAnkle": 5,
  "hipAbductL": 5,
  "hipAbductR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -39.1,
    "yaw_deg": 0,
    "roll_deg": -7.8,
    "description": "Head pitch -39° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -39,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -39° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 14.4,
    "list_deg": -7.2,
    "yaw_deg": -1.9,
    "description": "Pelvic list -7° (+: left hip lower), yaw -2°, anterior/posterior tilt proxy 14° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 66,
    "shoulder_sagittal_flexion_deg": 51.6,
    "elbow_flexion_deg": 61.1,
    "forearm_forward_deg": 75,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~66° (lateral); shoulder flexed ~52° forward; elbow bent ~61°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 56,
    "shoulder_sagittal_flexion_deg": 39.5,
    "elbow_flexion_deg": 16.9,
    "forearm_forward_deg": 54.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~56°; shoulder flexed ~39° forward; elbow bent ~17°."
  },
  "left_leg": {
    "hip_flexion_deg": 20,
    "hip_abduction_deg": 2.7,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 86.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~20°; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 35,
    "hip_abduction_deg": 3.1,
    "knee_flexion_deg": 40.1,
    "foot_forward_deg": 136.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~35°; knee bent ~40°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.729,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.324,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.239,
    "foot_x_range": [
      -0.219,
      0.2
    ],
    "over_support": true,
    "feet_min_y": -0.729,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 97.49655000000001 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -39° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -39° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -7° (+: left hip lower), yaw -2°, anterior/posterior tilt proxy 14° (low confidence).
- L arm: Left arm: arm abducted ~66° (lateral); shoulder flexed ~52° forward; elbow bent ~61°.
- R arm: Right arm: arm abducted ~56°; shoulder flexed ~39° forward; elbow bent ~17°.
- L leg: Left leg: thigh forward ~20°; knee straight.
- R leg: Right leg: thigh forward ~35°; knee bent ~40°.
- Balance: COM over foot support base. (floating=false)