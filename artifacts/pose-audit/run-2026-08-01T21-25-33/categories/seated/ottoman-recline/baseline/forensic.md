# Forensic Baseline — ottoman-recline
- name: Ottoman Recline
- category: seated | difficulty: Beginner | angle: 3/4 View
- instructions: Sit on a low ottoman and lean back onto one supporting arm, elbow soft rather than locked. Extend both legs loosely forward and rest the free hand on your thigh for an off-duty mood.
- tip: Keep the supporting elbow soft, not locked, so the shoulder doesn't ride up toward the ear

## Raw joint config
```json
{
  "globalTilt": 30,
  "spine": -5,
  "neck": 3,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 35,
  "rightKnee": 35,
  "hipAbductL": 12,
  "hipAbductR": 12,
  "leftElbow": 30,
  "rightElbow": 30,
  "rightShoulder": -12,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 25,
    "yaw_deg": 0,
    "roll_deg": 3.3,
    "description": "Head pitch 25° (+: forward/down), roll 3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 25,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 25° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -26.6,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -27° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 26,
    "shoulder_sagittal_flexion_deg": -28,
    "elbow_flexion_deg": 11.9,
    "forearm_forward_deg": -17.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~26°; shoulder extended ~28° behind; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 36,
    "shoulder_sagittal_flexion_deg": -21,
    "elbow_flexion_deg": 17.1,
    "forearm_forward_deg": -5.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~36°; shoulder extended ~21° behind; elbow bent ~17°."
  },
  "left_leg": {
    "hip_flexion_deg": 50,
    "hip_abduction_deg": -18.3,
    "knee_flexion_deg": 34.1,
    "foot_forward_deg": 141.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~50°; knee bent ~34°."
  },
  "right_leg": {
    "hip_flexion_deg": 50,
    "hip_abduction_deg": -18.3,
    "knee_flexion_deg": 34.1,
    "foot_forward_deg": 141.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~50°; knee bent ~34°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.15,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.15,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.199,
    "foot_x_range": [
      -0.143,
      0.143
    ],
    "over_support": true,
    "feet_min_y": -0.15,
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
| auto | true | 100.0001800000007 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 25° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 25° (+: forward/down), roll 3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -27° (low confidence).
- L arm: Left arm: arm abducted ~26°; shoulder extended ~28° behind; elbow straight.
- R arm: Right arm: arm abducted ~36°; shoulder extended ~21° behind; elbow bent ~17°.
- L leg: Left leg: thigh forward ~50°; knee bent ~34°.
- R leg: Right leg: thigh forward ~50°; knee bent ~34°.
- Balance: COM over foot support base. (floating=false)