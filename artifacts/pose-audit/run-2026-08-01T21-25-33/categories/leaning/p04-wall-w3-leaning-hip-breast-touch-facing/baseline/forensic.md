# Forensic Baseline — p04-wall-w3-leaning-hip-breast-touch-facing
- name: Wall Leaning Hip and Breast Touch Facing Camera
- category: leaning | difficulty: Beginner | angle: undefined
- instructions: Lean against the wall with one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, relax the shoulders and push them down, bend the arms with one hand on the hip and the other on the breast, facing the camera.
- tip: Keep the shoulders pressed down while the hand rests lightly on the breast for a soft, tasteful gesture.

## Raw joint config
```json
{
  "spine": -14,
  "neck": -6,
  "hips": 20,
  "globalTilt": 5,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -35,
  "rightShoulder": -65,
  "leftElbow": 70,
  "rightElbow": 85,
  "shoulderFwdL": 2,
  "shoulderFwdR": 10,
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
    "roll_deg": -5.9,
    "description": "Head pitch -9° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -9,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -9° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -4.7,
    "list_deg": 18.8,
    "yaw_deg": -1.7,
    "description": "Pelvic list 19° (+: left hip lower), yaw -2°, anterior/posterior tilt proxy -5° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 57.9,
    "shoulder_sagittal_flexion_deg": 15.8,
    "elbow_flexion_deg": 58.9,
    "forearm_forward_deg": 52,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~58°; shoulder flexed ~16° forward; elbow bent ~59°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 88.2,
    "shoulder_sagittal_flexion_deg": 57.5,
    "elbow_flexion_deg": 85.1,
    "forearm_forward_deg": 81.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~88° (lateral); shoulder flexed ~57° forward; elbow ~right-angle (85°)."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -25,
    "knee_flexion_deg": 5.2,
    "foot_forward_deg": 68.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 10,
    "hip_abduction_deg": 35.4,
    "knee_flexion_deg": 37.2,
    "foot_forward_deg": 121.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~35° outward; knee bent ~37°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.801,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.381,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.041,
    "foot_x_range": [
      0.253,
      0.723
    ],
    "over_support": false,
    "feet_min_y": -0.801,
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
| auto | true | 89.24850000000013 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -9° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -9° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 19° (+: left hip lower), yaw -2°, anterior/posterior tilt proxy -5° (low confidence).
- L arm: Left arm: arm abducted ~58°; shoulder flexed ~16° forward; elbow bent ~59°.
- R arm: Right arm: arm abducted ~88° (lateral); shoulder flexed ~57° forward; elbow ~right-angle (85°).
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; abducted ~35° outward; knee bent ~37°.
- Balance: COM outside foot support base (balance risk). (floating=false)