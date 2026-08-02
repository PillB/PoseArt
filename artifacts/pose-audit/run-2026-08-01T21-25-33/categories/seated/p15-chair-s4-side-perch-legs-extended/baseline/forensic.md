# Forensic Baseline — p15-chair-s4-side-perch-legs-extended
- name: Chair Side Perch Extended Legs
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Perch on the edge of the chair seat sideways, extend both legs out to one side crossed at the ankles, lean the torso back slightly supported by one arm on the seat or chair frame, other hand resting on the thigh. Turn head to camera.
- tip: Point the toes and lengthen the extended legs fully to create an elegant diagonal line across the frame.

## Raw joint config
```json
{
  "spine": -20,
  "hips": -15,
  "neck": -10,
  "leftShoulder": -15,
  "rightShoulder": -25,
  "leftElbow": 35,
  "rightElbow": 70,
  "hipAbductL": -25,
  "hipAbductR": -22,
  "leftHip": 70,
  "rightHip": 65,
  "leftKnee": 15,
  "rightKnee": 20,
  "leftAnkle": 15,
  "rightAnkle": 12,
  "shoulderFwdL": -10,
  "shoulderFwdR": 15,
  "globalTilt": -30,
  "globalTwist": 20,
  "globalRoll": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -43.5,
    "yaw_deg": 0,
    "roll_deg": -23.2,
    "description": "Head pitch -44° (+: forward/down), roll -23° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -46.7,
    "lateral_flexion_deg": -12.2,
    "axial_rotation_deg": 18.9,
    "description": "Torso flexion -47° (+: forward), lateral -12° (+: figure's right), axial rotation proxy 19°."
  },
  "pelvis": {
    "tilt_deg": 28.5,
    "list_deg": -21.1,
    "yaw_deg": 11.8,
    "description": "Pelvic list -21° (+: left hip lower), yaw 12°, anterior/posterior tilt proxy 28° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 40.6,
    "shoulder_sagittal_flexion_deg": 66.3,
    "elbow_flexion_deg": 24.2,
    "forearm_forward_deg": 68.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~41°; shoulder flexed ~66° forward; elbow bent ~24°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 51.2,
    "shoulder_sagittal_flexion_deg": 11.2,
    "elbow_flexion_deg": 53.5,
    "forearm_forward_deg": 73.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~51°; elbow bent ~53°."
  },
  "left_leg": {
    "hip_flexion_deg": 101.6,
    "hip_abduction_deg": 121,
    "knee_flexion_deg": 12,
    "foot_forward_deg": -175.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~102° (hip flexion); abducted ~121° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 90.4,
    "hip_abduction_deg": 90.8,
    "knee_flexion_deg": 20.1,
    "foot_forward_deg": -175.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~90° (hip flexion); abducted ~91° outward; knee bent ~20°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.484,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.289,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.05,
    "com_z": -0.294,
    "foot_x_range": [
      -0.475,
      0.576
    ],
    "over_support": true,
    "feet_min_y": 0.289,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "L"
    }
  ],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 99.9970300000004 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -47° (+: forward), lateral -12° (+: figure's right), axial rotation proxy 19°.
- Head: Head pitch -44° (+: forward/down), roll -23° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -21° (+: left hip lower), yaw 12°, anterior/posterior tilt proxy 28° (low confidence).
- L arm: Left arm: arm abducted ~41°; shoulder flexed ~66° forward; elbow bent ~24°.
- R arm: Right arm: arm abducted ~51°; elbow bent ~53°.
- L leg: Left leg: thigh forward ~102° (hip flexion); abducted ~121° outward; knee straight.
- R leg: Right leg: thigh forward ~90° (hip flexion); abducted ~91° outward; knee bent ~20°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"}]