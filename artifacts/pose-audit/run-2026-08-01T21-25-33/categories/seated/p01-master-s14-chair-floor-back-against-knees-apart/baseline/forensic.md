# Forensic Baseline — p01-master-s14-chair-floor-back-against-knees-apart
- name: Floor Seated Against Chair Knees Apart Facing Camera
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit on the floor with the back against the chair. Bend both arms, resting them on the chair. Bend and cross the legs at the shin with knees apart, toes pointed, and look at the camera.
- tip: Let the knees fall open naturally rather than forcing the position, keeping the pose grounded and comfortable-looking.

## Raw joint config
```json
{
  "spine": -18,
  "neck": -6,
  "hips": 0,
  "globalTilt": -12,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -55,
  "rightShoulder": -67,
  "leftElbow": 80,
  "rightElbow": 80,
  "shoulderFwdL": 12,
  "shoulderFwdR": 12,
  "leftHip": 100,
  "rightHip": 100,
  "leftKnee": 120,
  "rightKnee": 120,
  "leftAnkle": 8,
  "rightAnkle": 8,
  "hipAbductL": 20,
  "hipAbductR": -20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -30.1,
    "yaw_deg": 0,
    "roll_deg": -6.6,
    "description": "Head pitch -30° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -30,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -30° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 11.7,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 12° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 80.5,
    "shoulder_sagittal_flexion_deg": 36.2,
    "elbow_flexion_deg": 78.4,
    "forearm_forward_deg": 89.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~81° (lateral); shoulder flexed ~36° forward; elbow ~right-angle (78°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 91.8,
    "shoulder_sagittal_flexion_deg": 112.5,
    "elbow_flexion_deg": 80.3,
    "forearm_forward_deg": 100.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~92° (lateral); shoulder flexed ~113° forward; elbow ~right-angle (80°)."
  },
  "left_leg": {
    "hip_flexion_deg": 112,
    "hip_abduction_deg": -135.8,
    "knee_flexion_deg": 107.5,
    "foot_forward_deg": -62.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~112° (hip flexion); knee ~right-angle (108°)."
  },
  "right_leg": {
    "hip_flexion_deg": 112,
    "hip_abduction_deg": 135.8,
    "knee_flexion_deg": 110.3,
    "foot_forward_deg": -62.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~112° (hip flexion); abducted ~136° outward; knee ~right-angle (110°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.373,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.381,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.19,
    "foot_x_range": [
      0.147,
      0.489
    ],
    "over_support": false,
    "feet_min_y": 0.373,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "L"
    },
    {
      "type": "knee_above_hip",
      "side": "R"
    }
  ],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.99253000000012 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -30° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -30° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 12° (low confidence).
- L arm: Left arm: arm abducted ~81° (lateral); shoulder flexed ~36° forward; elbow ~right-angle (78°).
- R arm: Right arm: arm abducted ~92° (lateral); shoulder flexed ~113° forward; elbow ~right-angle (80°).
- L leg: Left leg: thigh forward ~112° (hip flexion); knee ~right-angle (108°).
- R leg: Right leg: thigh forward ~112° (hip flexion); abducted ~136° outward; knee ~right-angle (110°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]