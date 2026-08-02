# Forensic Baseline — p17-tubes-s5-seated-legs-open-hands-back
- name: Seated with Legs Open and Hands Back
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit on top of a tube with both feet planted on the floor, knees open comfortably apart. Place both hands behind you on the tube's edge for a slight backward lean. Square the shoulders to camera and lift the chin with a direct, confident gaze.
- tip: Keep the shoulders down and back even while leaning on your arms, to avoid hunching them up toward the ears.

## Raw joint config
```json
{
  "spine": -10,
  "neck": -5,
  "hips": 0,
  "globalTilt": 10,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -15,
  "rightShoulder": -27,
  "leftElbow": 30,
  "rightElbow": 10,
  "shoulderFwdL": -10,
  "shoulderFwdR": -10,
  "leftHip": 92,
  "rightHip": 92,
  "leftKnee": 90,
  "rightKnee": 90,
  "leftAnkle": -5,
  "rightAnkle": -5,
  "hipAbductL": 20,
  "hipAbductR": 20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 0,
    "yaw_deg": 0,
    "roll_deg": -4.9,
    "description": "Head pitch 0° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 0,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 0° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -9.9,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -10° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 35.3,
    "shoulder_sagittal_flexion_deg": 8.7,
    "elbow_flexion_deg": 19.1,
    "forearm_forward_deg": 21.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~35°; elbow bent ~19°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 46.9,
    "shoulder_sagittal_flexion_deg": 14.6,
    "elbow_flexion_deg": 8.4,
    "forearm_forward_deg": 21.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~47°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 82,
    "hip_abduction_deg": -69.1,
    "knee_flexion_deg": 82.4,
    "foot_forward_deg": -135.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~82° (hip flexion); knee ~right-angle (82°)."
  },
  "right_leg": {
    "hip_flexion_deg": 82,
    "hip_abduction_deg": -69.1,
    "knee_flexion_deg": 82.4,
    "foot_forward_deg": -135.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~82° (hip flexion); knee ~right-angle (82°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.477,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.477,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.021,
    "foot_x_range": [
      -0.267,
      0.267
    ],
    "over_support": true,
    "feet_min_y": 0.477,
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
| auto | true | 90.73953000000006 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 0° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 0° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -10° (low confidence).
- L arm: Left arm: arm abducted ~35°; elbow bent ~19°.
- R arm: Right arm: arm abducted ~47°; elbow straight.
- L leg: Left leg: thigh forward ~82° (hip flexion); knee ~right-angle (82°).
- R leg: Right leg: thigh forward ~82° (hip flexion); knee ~right-angle (82°).
- Balance: COM over foot support base. (floating=false)