# Forensic Baseline — car-lean
- name: Car Lean
- category: leaning | difficulty: Beginner | angle: 3/4 View
- instructions: Lean the lower back against the car door, hands resting lightly on the edge beside the hips with a soft bend at the elbows. Cross one ankle over the other and angle the torso toward camera.
- tip: Keep a soft bend in the elbows on the hard surface — locked arms read as tense against metal.

## Raw joint config
```json
{
  "spine": -14,
  "hips": 16,
  "neck": -8.8,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "leftElbow": 70,
  "rightElbow": 50,
  "hipAbductL": 10,
  "hipAbductR": -10,
  "leftHip": 6,
  "leftKnee": 10,
  "rightKnee": 10,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -14.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch -14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 15.4,
    "yaw_deg": 0,
    "description": "Pelvic list 15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 33.3,
    "shoulder_sagittal_flexion_deg": 15.9,
    "elbow_flexion_deg": 38.8,
    "forearm_forward_deg": 33.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~33°; shoulder flexed ~16° forward; elbow bent ~39°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 14.3,
    "shoulder_sagittal_flexion_deg": 14.6,
    "elbow_flexion_deg": 17.6,
    "forearm_forward_deg": 18.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; elbow bent ~18°."
  },
  "left_leg": {
    "hip_flexion_deg": 6,
    "hip_abduction_deg": -26.1,
    "knee_flexion_deg": 9.3,
    "foot_forward_deg": 75.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 26,
    "knee_flexion_deg": 9.5,
    "foot_forward_deg": 69.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~26° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.758,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.728,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.08,
    "foot_x_range": [
      0.26,
      0.594
    ],
    "over_support": false,
    "feet_min_y": -0.758,
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
| auto | true | 90.74699999999993 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~33°; shoulder flexed ~16° forward; elbow bent ~39°.
- R arm: Right arm: arm at side; elbow bent ~18°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; abducted ~26° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)