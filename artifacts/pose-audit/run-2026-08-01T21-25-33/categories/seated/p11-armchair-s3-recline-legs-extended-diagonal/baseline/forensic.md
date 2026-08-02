# Forensic Baseline — p11-armchair-s3-recline-legs-extended-diagonal
- name: Armchair Recline Diagonal Legs Extended
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit back into the armchair and slide the hips slightly forward, extend both legs diagonally out across the frame, hands resting on the armrest and the seat between the legs. Head turned toward camera, relaxed gaze.
- tip: Sliding the hips slightly forward off the back cushion elongates the legs' line across the frame — anchor the shoulders against the chair back for support.

## Raw joint config
```json
{
  "spine": -16,
  "neck": -6,
  "hips": 15,
  "globalTilt": -25,
  "globalRoll": -15,
  "globalTwist": 18,
  "leftShoulder": -70,
  "rightShoulder": -30,
  "leftElbow": 81,
  "rightElbow": 60,
  "shoulderFwdL": 20,
  "shoulderFwdR": 15,
  "leftHip": 55,
  "rightHip": 58,
  "leftKnee": 15,
  "rightKnee": 18,
  "leftAnkle": 10,
  "rightAnkle": 8,
  "hipAbductL": -20,
  "hipAbductR": -18
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -36.4,
    "yaw_deg": 0,
    "roll_deg": -6.6,
    "description": "Head pitch -36° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -38.6,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 17.2,
    "description": "Torso flexion -39° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 17°."
  },
  "pelvis": {
    "tilt_deg": 17.1,
    "list_deg": -0.1,
    "yaw_deg": 21.9,
    "description": "Pelvic list 0° (+: left hip lower), yaw 22°, anterior/posterior tilt proxy 17° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 106,
    "shoulder_sagittal_flexion_deg": 143,
    "elbow_flexion_deg": 81.2,
    "forearm_forward_deg": 114.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~106° (lateral); shoulder flexed ~143° forward; elbow ~right-angle (81°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 44.9,
    "shoulder_sagittal_flexion_deg": 1.2,
    "elbow_flexion_deg": 48.4,
    "forearm_forward_deg": 62.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~45°; elbow bent ~48°."
  },
  "left_leg": {
    "hip_flexion_deg": 76.9,
    "hip_abduction_deg": -36.9,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 160.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~77° (hip flexion); knee bent ~15°."
  },
  "right_leg": {
    "hip_flexion_deg": 64.3,
    "hip_abduction_deg": 67.5,
    "knee_flexion_deg": 15.5,
    "foot_forward_deg": 175.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~64°; abducted ~67° outward; knee bent ~16°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.083,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.018,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.013,
    "com_z": -0.254,
    "foot_x_range": [
      0.077,
      0.913
    ],
    "over_support": false,
    "feet_min_y": 0.018,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.24849999999947 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -39° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 17°.
- Head: Head pitch -36° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 22°, anterior/posterior tilt proxy 17° (low confidence).
- L arm: Left arm: arm abducted ~106° (lateral); shoulder flexed ~143° forward; elbow ~right-angle (81°).
- R arm: Right arm: arm abducted ~45°; elbow bent ~48°.
- L leg: Left leg: thigh forward ~77° (hip flexion); knee bent ~15°.
- R leg: Right leg: thigh forward ~64°; abducted ~67° outward; knee bent ~16°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]