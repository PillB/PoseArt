# Forensic Baseline — mirror-lean
- name: Mirror Lean
- category: leaning | difficulty: Intermediate | angle: Front
- instructions: Stand facing a mirror and lean one hand flat against its surface, looking at your own reflection rather than the camera. Pop the opposite hip out to the side for an editorial curve.
- tip: Shoot the reflection rather than the subject directly — it adds a layered, storytelling frame.

## Raw joint config
```json
{
  "spine": 15,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -40,
  "leftElbow": 40,
  "rightElbow": 20,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftHip": 12,
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
    "pitch_deg": 15.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 15° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 15,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 15° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 63.7,
    "shoulder_sagittal_flexion_deg": -27.3,
    "elbow_flexion_deg": 35.1,
    "forearm_forward_deg": 38.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~64° (lateral); shoulder extended ~27° behind; elbow bent ~35°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 24.6,
    "shoulder_sagittal_flexion_deg": -12.9,
    "elbow_flexion_deg": 7.7,
    "forearm_forward_deg": -4.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~25°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 12,
    "hip_abduction_deg": -20.4,
    "knee_flexion_deg": 9.7,
    "foot_forward_deg": 79.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 10.4,
    "foot_forward_deg": 66.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.751,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.828,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.085,
    "foot_x_range": [
      0.06,
      0.281
    ],
    "over_support": false,
    "feet_min_y": -0.828,
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
| auto | true | 92.24568000000043 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 15° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 15° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~64° (lateral); shoulder extended ~27° behind; elbow bent ~35°.
- R arm: Right arm: arm abducted ~25°; elbow straight.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)