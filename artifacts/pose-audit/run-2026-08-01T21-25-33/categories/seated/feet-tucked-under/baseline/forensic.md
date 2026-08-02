# Forensic Baseline — feet-tucked-under
- name: Feet Tucked Under
- category: seated | difficulty: Beginner | angle: 3/4 View
- instructions: Sit on a couch and tuck both feet underneath the body to one side. Lean into the armrest with one elbow and let the free hand rest loosely in your lap for a candid, cozy read.
- tip: Tucking the feet under instantly reads as candid — ideal for relaxed lifestyle-style shots.

## Raw joint config
```json
{
  "spine": 12,
  "hips": -8,
  "neck": -3.3,
  "rightShoulder": -12,
  "leftElbow": 60,
  "rightElbow": 80,
  "hipAbductL": -30,
  "leftHip": 80,
  "rightHip": 80,
  "leftKnee": 138,
  "rightKnee": 138,
  "shoulderFwdL": 7,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 12,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch 12° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 12,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": -7.9,
    "yaw_deg": 0,
    "description": "Pelvic list -8° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 21.9,
    "shoulder_sagittal_flexion_deg": -14.8,
    "elbow_flexion_deg": 23.1,
    "forearm_forward_deg": 10.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~22°; elbow bent ~23°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 36,
    "shoulder_sagittal_flexion_deg": -10,
    "elbow_flexion_deg": 43.4,
    "forearm_forward_deg": 32,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~36°; elbow bent ~43°."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": 77.5,
    "knee_flexion_deg": 97,
    "foot_forward_deg": -79.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); abducted ~77° outward; knee ~right-angle (97°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 134.2,
    "foot_forward_deg": -85.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee deeply bent (~134°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.256,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.273,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.069,
    "foot_x_range": [
      -0.755,
      0.03
    ],
    "over_support": true,
    "feet_min_y": 0.256,
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
| auto | true | 90.74708999999996 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 12° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -8° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~22°; elbow bent ~23°.
- R arm: Right arm: arm abducted ~36°; elbow bent ~43°.
- L leg: Left leg: thigh forward ~80° (hip flexion); abducted ~77° outward; knee ~right-angle (97°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee deeply bent (~134°).
- Balance: COM over foot support base. (floating=true)