# Forensic Baseline — throne-sit
- name: Throne Sit
- category: seated | difficulty: Beginner | angle: Front
- instructions: Sit upright with the spine tall, resting both forearms flat along the armrests. Square the shoulders to camera, lift the chin slightly, and plant both feet flat with knees a hip-width apart.
- tip: Keep both feet grounded and knees apart — it reads as commanding rather than closed-off.

## Raw joint config
```json
{
  "spine": -18,
  "neck": -10,
  "leftShoulder": 15,
  "rightShoulder": -15,
  "leftElbow": 65,
  "rightElbow": 45,
  "hipAbductL": -15,
  "hipAbductR": -15,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 90,
  "rightKnee": 90,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -18.3,
    "yaw_deg": 0,
    "roll_deg": -10,
    "description": "Head pitch -18° (+: forward/down), roll -10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 10.9,
    "shoulder_sagittal_flexion_deg": 15.6,
    "elbow_flexion_deg": 21.3,
    "forearm_forward_deg": 14.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder flexed ~16° forward; elbow bent ~21°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 37.6,
    "shoulder_sagittal_flexion_deg": 24.3,
    "elbow_flexion_deg": 30,
    "forearm_forward_deg": 39,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~38°; shoulder flexed ~24° forward; elbow bent ~30°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 57.1,
    "knee_flexion_deg": 86.8,
    "foot_forward_deg": -132.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); abducted ~57° outward; knee ~right-angle (87°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 57.1,
    "knee_flexion_deg": 86.8,
    "foot_forward_deg": -132.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); abducted ~57° outward; knee ~right-angle (87°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.479,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.479,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.102,
    "foot_x_range": [
      -0.411,
      0.411
    ],
    "over_support": true,
    "feet_min_y": 0.479,
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
| auto | true | 91.4935500000001 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -18° (+: forward/down), roll -10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; shoulder flexed ~16° forward; elbow bent ~21°.
- R arm: Right arm: arm abducted ~38°; shoulder flexed ~24° forward; elbow bent ~30°.
- L leg: Left leg: thigh forward ~80° (hip flexion); abducted ~57° outward; knee ~right-angle (87°).
- R leg: Right leg: thigh forward ~80° (hip flexion); abducted ~57° outward; knee ~right-angle (87°).
- Balance: COM over foot support base. (floating=true)