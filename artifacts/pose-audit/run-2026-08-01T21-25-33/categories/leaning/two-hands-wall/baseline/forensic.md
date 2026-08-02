# Forensic Baseline — two-hands-wall
- name: Two Hands Wall
- category: leaning | difficulty: Intermediate | angle: Front
- instructions: Face the wall directly and press both palms flat against it at shoulder height, arms extended. Walk the feet back and lean the torso in toward the wall, creating a strong diagonal.
- tip: Shoot this from the side — a straight-on angle flattens the diagonal line entirely.

## Raw joint config
```json
{
  "spine": -14,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -90,
  "rightShoulder": -72,
  "leftElbow": 70,
  "rightElbow": 70,
  "hipAbductL": 10,
  "hipAbductR": 10,
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
    "pitch_deg": -14.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch -14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 113.6,
    "shoulder_sagittal_flexion_deg": 148.4,
    "elbow_flexion_deg": 64.4,
    "forearm_forward_deg": 110.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~114° (lateral); shoulder flexed ~148° forward; elbow bent ~64°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 95.6,
    "shoulder_sagittal_flexion_deg": 106.8,
    "elbow_flexion_deg": 70,
    "forearm_forward_deg": 93.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~96° (lateral); shoulder flexed ~107° forward; elbow bent ~70°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -20,
    "knee_flexion_deg": 9.7,
    "foot_forward_deg": 67.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 10.4,
    "foot_forward_deg": 66.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.811,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.828,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.08,
    "foot_x_range": [
      0.06,
      0.281
    ],
    "over_support": false,
    "feet_min_y": -0.828,
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
| auto | true | 91.49705999999983 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~114° (lateral); shoulder flexed ~148° forward; elbow bent ~64°.
- R arm: Right arm: arm abducted ~96° (lateral); shoulder flexed ~107° forward; elbow bent ~70°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]