# Forensic Baseline — p01-master-s3-chair-both-knees-bent-hands-clasped
- name: Chair Sit Both Knees Bent Hands Clasped
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit in the chair with both knees bent and legs crossed at the shin, toes pointed. Bend both arms slightly, clasping hands together over the knees. Drop shoulders and look straight at the camera.
- tip: Keep the clasped hands soft, fingers loosely interlaced rather than gripped, to maintain a relaxed appearance.

## Raw joint config
```json
{
  "spine": -8,
  "neck": -6,
  "hips": 0,
  "globalTilt": 0,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -20,
  "rightShoulder": -32,
  "leftElbow": 70,
  "rightElbow": 70,
  "shoulderFwdL": 15,
  "shoulderFwdR": 15,
  "leftHip": 90,
  "rightHip": 90,
  "leftKnee": 110,
  "rightKnee": 100,
  "leftAnkle": 5,
  "rightAnkle": 5,
  "hipAbductL": -5,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -8,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch -8° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -8,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 43.5,
    "shoulder_sagittal_flexion_deg": -4,
    "elbow_flexion_deg": 46,
    "forearm_forward_deg": 38.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~43°; elbow bent ~46°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 55.2,
    "shoulder_sagittal_flexion_deg": -8.6,
    "elbow_flexion_deg": 55.8,
    "forearm_forward_deg": 50.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~55°; elbow bent ~56°."
  },
  "left_leg": {
    "hip_flexion_deg": 90,
    "hip_abduction_deg": 90,
    "knee_flexion_deg": 109.7,
    "foot_forward_deg": -98.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~90° (hip flexion); abducted ~90° outward; knee ~right-angle (110°)."
  },
  "right_leg": {
    "hip_flexion_deg": 90,
    "hip_abduction_deg": 90,
    "knee_flexion_deg": 99.8,
    "foot_forward_deg": -108.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~90° (hip flexion); abducted ~90° outward; knee ~right-angle (100°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.466,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.51,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.046,
    "foot_x_range": [
      -0.251,
      0.251
    ],
    "over_support": true,
    "feet_min_y": 0.466,
    "floating": true,
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
| auto | true | 90.74555999999997 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -8° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~43°; elbow bent ~46°.
- R arm: Right arm: arm abducted ~55°; elbow bent ~56°.
- L leg: Left leg: thigh forward ~90° (hip flexion); abducted ~90° outward; knee ~right-angle (110°).
- R leg: Right leg: thigh forward ~90° (hip flexion); abducted ~90° outward; knee ~right-angle (100°).
- Balance: COM over foot support base. (floating=true)