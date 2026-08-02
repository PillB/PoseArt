# Forensic Baseline — kneeling-prayer-up
- name: Kneeling Prayer Up
- category: kneeling | difficulty: Beginner | angle: Front
- instructions: Kneel facing away from camera, then twist the ribcage and turn the head back over one shoulder toward the lens. Rest one hand on the floor behind you to support the twist.
- tip: Lead with the eyes, then let shoulders and ribcage follow — a sequential twist looks far more natural.

## Raw joint config
```json
{
  "spine": -12,
  "neck": -8,
  "leftElbow": 81,
  "rightShoulder": -12,
  "rightElbow": 81,
  "leftHip": 80,
  "leftKnee": 90,
  "leftAnkle": -35,
  "rightHip": 80,
  "rightKnee": 90,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8,
  "globalTwist": 25
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -7.7,
    "yaw_deg": 0,
    "roll_deg": -12.3,
    "description": "Head pitch -8° (+: forward/down), roll -12° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -10.9,
    "lateral_flexion_deg": -5.1,
    "axial_rotation_deg": 22.9,
    "description": "Torso flexion -11° (+: forward), lateral -5° (+: figure's right), axial rotation proxy 23°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 22.9,
    "description": "Pelvic list 0° (+: left hip lower), yaw 23°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 16.7,
    "shoulder_sagittal_flexion_deg": 20.5,
    "elbow_flexion_deg": 32.4,
    "forearm_forward_deg": 17.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~17°; shoulder flexed ~21° forward; elbow bent ~32°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 36.6,
    "shoulder_sagittal_flexion_deg": -4.7,
    "elbow_flexion_deg": 45.2,
    "forearm_forward_deg": 33.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~37°; elbow bent ~45°."
  },
  "left_leg": {
    "hip_flexion_deg": 78.2,
    "hip_abduction_deg": -72.3,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -167.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~78° (hip flexion); knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": 79.7,
    "hip_abduction_deg": 59,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -171.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); abducted ~59° outward; knee ~right-angle (89°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.029,
    "com_z": -0.062,
    "foot_x_range": [
      0.118,
      0.273
    ],
    "over_support": false,
    "feet_min_y": 0.524,
    "floating": true,
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
| auto | true | 104.99099999999997 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -11° (+: forward), lateral -5° (+: figure's right), axial rotation proxy 23°.
- Head: Head pitch -8° (+: forward/down), roll -12° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 23°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~17°; shoulder flexed ~21° forward; elbow bent ~32°.
- R arm: Right arm: arm abducted ~37°; elbow bent ~45°.
- L leg: Left leg: thigh forward ~78° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~80° (hip flexion); abducted ~59° outward; knee ~right-angle (89°).
- Balance: COM outside foot support base (balance risk). (floating=true)