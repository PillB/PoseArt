# Forensic Baseline — p04-wall-w9-standing-45-degree-crossed-facing
- name: Wall Standing 45 Degree Angle Crossed Legs Facing Camera
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Stand away from the wall, angled 45 degrees toward the camera. Cross the legs at the shin, arch the back with straight posture, drop the shoulders, bend the arms touching the legs at different levels, face turned toward the camera.
- tip: Keep the posture tall with shoulders down to close out the sequence with a confident, elegant stance.

## Raw joint config
```json
{
  "spine": -14,
  "neck": -6,
  "hips": 10,
  "globalTilt": 5,
  "globalRoll": 0,
  "globalTwist": -40,
  "leftShoulder": -45,
  "rightShoulder": -55,
  "leftElbow": 60,
  "rightElbow": 75,
  "shoulderFwdL": -2,
  "shoulderFwdR": 8,
  "leftHip": 10,
  "rightHip": 18,
  "leftKnee": 10,
  "rightKnee": 40,
  "leftAnkle": 6,
  "rightAnkle": 6,
  "hipAbductL": 5,
  "hipAbductR": -12
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -10.7,
    "yaw_deg": 0,
    "roll_deg": 1.4,
    "description": "Head pitch -11° (+: forward/down), roll 1° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -6.9,
    "lateral_flexion_deg": 5.8,
    "axial_rotation_deg": -32.7,
    "description": "Torso flexion -7° (+: forward), lateral 6° (+: figure's right), axial rotation proxy -33°."
  },
  "pelvis": {
    "tilt_deg": 2.6,
    "list_deg": 9.8,
    "yaw_deg": -32.8,
    "description": "Pelvic list 10° (+: left hip lower), yaw -33°, anterior/posterior tilt proxy 3° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 65.5,
    "shoulder_sagittal_flexion_deg": -47.1,
    "elbow_flexion_deg": 55.6,
    "forearm_forward_deg": 47.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~66° (lateral); shoulder extended ~47° behind; elbow bent ~56°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 74,
    "shoulder_sagittal_flexion_deg": 73.5,
    "elbow_flexion_deg": 73.3,
    "forearm_forward_deg": 68.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~74° (lateral); shoulder flexed ~74° forward; elbow bent ~73°."
  },
  "left_leg": {
    "hip_flexion_deg": 13.5,
    "hip_abduction_deg": -8.5,
    "knee_flexion_deg": 10,
    "foot_forward_deg": 76.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 23.9,
    "hip_abduction_deg": 9.6,
    "knee_flexion_deg": 37.4,
    "foot_forward_deg": 119.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~24°; knee bent ~37°."
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
      "y": -0.489,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.026,
    "com_z": -0.032,
    "foot_x_range": [
      -0.131,
      0.074
    ],
    "over_support": true,
    "feet_min_y": -0.801,
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
| auto | true | 90.74106000000003 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -7° (+: forward), lateral 6° (+: figure's right), axial rotation proxy -33°.
- Head: Head pitch -11° (+: forward/down), roll 1° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw -33°, anterior/posterior tilt proxy 3° (low confidence).
- L arm: Left arm: arm abducted ~66° (lateral); shoulder extended ~47° behind; elbow bent ~56°.
- R arm: Right arm: arm abducted ~74° (lateral); shoulder flexed ~74° forward; elbow bent ~73°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~24°; knee bent ~37°.
- Balance: COM over foot support base. (floating=false)