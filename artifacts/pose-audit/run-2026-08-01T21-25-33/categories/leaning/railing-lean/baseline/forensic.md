# Forensic Baseline — railing-lean
- name: Railing Lean
- category: leaning | difficulty: Beginner | angle: Side
- instructions: Rest both forearms on the railing, rounding the back gently forward while the gaze drifts outward toward the horizon. Cross one foot behind the other, shifting weight into a relaxed lean.
- tip: Direct the gaze off-camera toward the view — it sells the candid, contemplative mood.

## Raw joint config
```json
{
  "spine": 14,
  "hips": 5,
  "neck": -3.8,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "leftElbow": 81,
  "rightElbow": 81,
  "hipAbductL": 10,
  "hipAbductR": -10,
  "leftKnee": 10,
  "rightKnee": 10,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 14,
    "yaw_deg": 0,
    "roll_deg": -3.8,
    "description": "Head pitch 14° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 5,
    "yaw_deg": 0,
    "description": "Pelvic list 5° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 33.6,
    "shoulder_sagittal_flexion_deg": -14.7,
    "elbow_flexion_deg": 42.5,
    "forearm_forward_deg": 29.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~34°; elbow bent ~42°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 16.5,
    "shoulder_sagittal_flexion_deg": -12,
    "elbow_flexion_deg": 23.4,
    "forearm_forward_deg": 12.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~16°; elbow bent ~23°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -15,
    "knee_flexion_deg": 10,
    "foot_forward_deg": 67.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 15,
    "knee_flexion_deg": 10.1,
    "foot_forward_deg": 67.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~15° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.826,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.814,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.08,
    "foot_x_range": [
      0.077,
      0.417
    ],
    "over_support": false,
    "feet_min_y": -0.826,
    "floating": false,
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
| auto | true | 91.4911200000001 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 14° (+: forward/down), roll -4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 5° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~34°; elbow bent ~42°.
- R arm: Right arm: arm abducted ~16°; elbow bent ~23°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; abducted ~15° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)