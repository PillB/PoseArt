# Forensic Baseline — gate-lean
- name: Gate Lean
- category: leaning | difficulty: Beginner | angle: 3/4 View
- instructions: Lean the back against a closed gate, spreading both arms wide along the top edge on either side. Cross one ankle over the other and tilt the head a few degrees for softness.
- tip: Spreading the arms wide along the gate opens the chest and makes the whole frame feel expansive.

## Raw joint config
```json
{
  "spine": -14,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -40,
  "rightShoulder": -22,
  "leftElbow": 40,
  "rightElbow": 20,
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
    "shoulder_abduction_deg": 63.4,
    "shoulder_sagittal_flexion_deg": 28.7,
    "elbow_flexion_deg": 36,
    "forearm_forward_deg": 57.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~63° (lateral); shoulder flexed ~29° forward; elbow bent ~36°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 44.5,
    "shoulder_sagittal_flexion_deg": 22.5,
    "elbow_flexion_deg": 15.2,
    "forearm_forward_deg": 34.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~45°; shoulder flexed ~22° forward; elbow bent ~15°."
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
    "hip_abduction_deg": 20,
    "knee_flexion_deg": 9.9,
    "foot_forward_deg": 67.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~20° outward; knee straight."
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
      "y": -0.779,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.08,
    "foot_x_range": [
      0.161,
      0.499
    ],
    "over_support": false,
    "feet_min_y": -0.811,
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
| auto | true | 92.99510999999995 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~63° (lateral); shoulder flexed ~29° forward; elbow bent ~36°.
- R arm: Right arm: arm abducted ~45°; shoulder flexed ~22° forward; elbow bent ~15°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; abducted ~20° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)