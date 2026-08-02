# Forensic Baseline — kneeling-crossed-arms-look-side
- name: Kneeling Crossed Arms Look Side
- category: kneeling | difficulty: Intermediate | angle: 3/4 View
- instructions: Kneel and bow the torso forward slowly and gracefully from the hips, arms resting on the thighs or extended forward. Hold the bow controlled rather than collapsing quickly.
- tip: Keep the bow slow and controlled — stillness is what reads as reverent, not a quick collapse.

## Raw joint config
```json
{
  "spine": 5,
  "neck": 28,
  "leftShoulder": -30,
  "rightShoulder": -12,
  "leftElbow": 100,
  "rightElbow": 100,
  "rightHip": 70,
  "leftKnee": 5,
  "rightKnee": 80,
  "hipAbductL": 8,
  "hipAbductR": 8,
  "shoulderFwdL": -12,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 5.7,
    "yaw_deg": 0,
    "roll_deg": 28,
    "description": "Head pitch 6° (+: forward/down), roll 28° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 5,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 52.9,
    "shoulder_sagittal_flexion_deg": 8.2,
    "elbow_flexion_deg": 74,
    "forearm_forward_deg": 49.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~53°; elbow bent ~74°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 35.2,
    "shoulder_sagittal_flexion_deg": 1.4,
    "elbow_flexion_deg": 50.6,
    "forearm_forward_deg": 32.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~35°; elbow bent ~51°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 5.6,
    "foot_forward_deg": 61.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 78.8,
    "foot_forward_deg": -153.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee ~right-angle (79°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.856,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.391,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.029,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.856,
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
| auto | true | 104.9954999999999 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 6° (+: forward/down), roll 28° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~53°; elbow bent ~74°.
- R arm: Right arm: arm abducted ~35°; elbow bent ~51°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=false)