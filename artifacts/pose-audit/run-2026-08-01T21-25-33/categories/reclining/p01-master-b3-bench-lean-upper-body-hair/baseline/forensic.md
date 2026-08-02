# Forensic Baseline — p01-master-b3-bench-lean-upper-body-hair
- name: Bench Recline Upper Body Lean Hair Touch
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Lean the upper body against the armrest. Bend both arms, one resting on the chair and the other touching the hair. Bend both knees, positioned on the bench with pointed toes. Tilt the face away from the camera.
- tip: Drape the legs together to keep the lower body streamlined while the upper body leans into the armrest.

## Raw joint config
```json
{
  "spine": -12,
  "neck": -14,
  "hips": 6,
  "globalTilt": 65,
  "globalRoll": 22,
  "globalTwist": 18,
  "leftShoulder": -25,
  "rightShoulder": -125,
  "leftElbow": 75,
  "rightElbow": 40,
  "shoulderFwdL": 10,
  "shoulderFwdR": 20,
  "leftHip": 95,
  "rightHip": 100,
  "leftKnee": 115,
  "rightKnee": 110,
  "leftAnkle": 6,
  "rightAnkle": 6,
  "hipAbductL": 10,
  "hipAbductR": 12
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 55.7,
    "yaw_deg": 0,
    "roll_deg": -20.7,
    "description": "Head pitch 56° (+: forward/down), roll -21° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 49.4,
    "lateral_flexion_deg": 0.3,
    "axial_rotation_deg": 17.2,
    "description": "Torso flexion 49° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 17°."
  },
  "pelvis": {
    "tilt_deg": -41.7,
    "list_deg": 22.1,
    "yaw_deg": 12.3,
    "description": "Pelvic list 22° (+: left hip lower), yaw 12°, anterior/posterior tilt proxy -42° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 47.6,
    "shoulder_sagittal_flexion_deg": -25.4,
    "elbow_flexion_deg": 54.5,
    "forearm_forward_deg": -15.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~48°; shoulder extended ~25° behind; elbow bent ~54°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 136.8,
    "shoulder_sagittal_flexion_deg": 137.8,
    "elbow_flexion_deg": 22,
    "forearm_forward_deg": 110.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~137° abduction); shoulder flexed ~138° forward; elbow bent ~22°."
  },
  "left_leg": {
    "hip_flexion_deg": 31,
    "hip_abduction_deg": -48.3,
    "knee_flexion_deg": 107.2,
    "foot_forward_deg": -148.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~31°; knee ~right-angle (107°)."
  },
  "right_leg": {
    "hip_flexion_deg": 38.3,
    "hip_abduction_deg": 27.4,
    "knee_flexion_deg": 108.7,
    "foot_forward_deg": -150.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~38°; abducted ~27° outward; knee ~right-angle (109°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.202,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.196,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.013,
    "com_z": 0.354,
    "foot_x_range": [
      0.039,
      0.269
    ],
    "over_support": false,
    "feet_min_y": 0.196,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "R",
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
| auto | true | 109.99099999999947 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 49° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 17°.
- Head: Head pitch 56° (+: forward/down), roll -21° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 22° (+: left hip lower), yaw 12°, anterior/posterior tilt proxy -42° (low confidence).
- L arm: Left arm: arm abducted ~48°; shoulder extended ~25° behind; elbow bent ~54°.
- R arm: Right arm: arm overhead (~137° abduction); shoulder flexed ~138° forward; elbow bent ~22°.
- L leg: Left leg: thigh forward ~31°; knee ~right-angle (107°).
- R leg: Right leg: thigh forward ~38°; abducted ~27° outward; knee ~right-angle (109°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]