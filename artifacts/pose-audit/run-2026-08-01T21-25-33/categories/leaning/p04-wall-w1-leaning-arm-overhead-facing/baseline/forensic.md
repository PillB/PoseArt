# Forensic Baseline — p04-wall-w1-leaning-arm-overhead-facing
- name: Wall Leaning Arm Overhead Facing Camera
- category: leaning | difficulty: Beginner | angle: undefined
- instructions: Lean against the wall with one leg straight and the other bent, knee crossing over. Push the hip to the side, arch the back, bend the arms slightly with one hand touching the wrist of the other, one arm raised overhead touching the wall, facing the camera.
- tip: Push the hip firmly into the wall to create a strong S-curve while keeping the shoulders relaxed.

## Raw joint config
```json
{
  "spine": -12,
  "neck": -6,
  "hips": 20,
  "globalTilt": 5,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -136,
  "rightShoulder": -40,
  "leftElbow": 35,
  "rightElbow": 60,
  "shoulderFwdL": -3,
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
    "pitch_deg": -7.1,
    "yaw_deg": 0,
    "roll_deg": -5.9,
    "description": "Head pitch -7° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -7,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -7° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -4.7,
    "list_deg": 18.8,
    "yaw_deg": -1.7,
    "description": "Pelvic list 19° (+: left hip lower), yaw -2°, anterior/posterior tilt proxy -5° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 159.4,
    "shoulder_sagittal_flexion_deg": 162.1,
    "elbow_flexion_deg": 13.6,
    "forearm_forward_deg": 151.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~159° abduction); shoulder flexed ~162° forward; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 63.5,
    "shoulder_sagittal_flexion_deg": 3.7,
    "elbow_flexion_deg": 53.2,
    "forearm_forward_deg": 54.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~64° (lateral); elbow bent ~53°."
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
    "com_z": -0.03,
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
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.99717999999964 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -7° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -7° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 19° (+: left hip lower), yaw -2°, anterior/posterior tilt proxy -5° (low confidence).
- L arm: Left arm: arm overhead (~159° abduction); shoulder flexed ~162° forward; elbow straight.
- R arm: Right arm: arm abducted ~64° (lateral); elbow bent ~53°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; abducted ~35° outward; knee bent ~37°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]