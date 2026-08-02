# Forensic Baseline — p08-male-se4-chair-arm-along-back-belt-hand
- name: Chair Recline with Arm Along Backrest
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on the chair reclined diagonally as before, but drape one arm along the top of the chair back instead of behind the head. Rest the other hand near the belt or jean's waistband. Extend one leg forward, gaze off to the side.
- tip: Let the draped arm rest naturally along the chair back's curve rather than gripping it, for a more casual look.

## Raw joint config
```json
{
  "spine": -16,
  "neck": -8,
  "hips": -6,
  "globalTilt": 12,
  "globalRoll": 5,
  "globalTwist": 12,
  "leftShoulder": -40,
  "rightShoulder": -20,
  "leftElbow": 60,
  "rightElbow": 70,
  "shoulderFwdL": -5,
  "shoulderFwdR": 15,
  "leftHip": 35,
  "rightHip": 90,
  "leftKnee": 18,
  "rightKnee": 88,
  "leftAnkle": -8,
  "rightAnkle": -5,
  "hipAbductL": 5,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -2.5,
    "yaw_deg": 0,
    "roll_deg": -13.4,
    "description": "Head pitch -2° (+: forward/down), roll -13° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -3.9,
    "lateral_flexion_deg": -5.8,
    "axial_rotation_deg": 11.7,
    "description": "Torso flexion -4° (+: forward), lateral -6° (+: figure's right), axial rotation proxy 12°."
  },
  "pelvis": {
    "tilt_deg": -10.2,
    "list_deg": -1,
    "yaw_deg": 12.8,
    "description": "Pelvic list -1° (+: left hip lower), yaw 13°, anterior/posterior tilt proxy -10° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 52.8,
    "shoulder_sagittal_flexion_deg": 36,
    "elbow_flexion_deg": 53.7,
    "forearm_forward_deg": 50.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~53°; shoulder flexed ~36° forward; elbow bent ~54°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 49.2,
    "shoulder_sagittal_flexion_deg": -19.1,
    "elbow_flexion_deg": 48.2,
    "forearm_forward_deg": 29.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~49°; shoulder extended ~19° behind; elbow bent ~48°."
  },
  "left_leg": {
    "hip_flexion_deg": 22.9,
    "hip_abduction_deg": -9,
    "knee_flexion_deg": 18.2,
    "foot_forward_deg": 90.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~23°; knee bent ~18°."
  },
  "right_leg": {
    "hip_flexion_deg": 78.8,
    "hip_abduction_deg": 46.9,
    "knee_flexion_deg": 87.9,
    "foot_forward_deg": -142.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~79° (hip flexion); abducted ~47° outward; knee ~right-angle (88°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.65,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.482,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.039,
    "com_z": 0.002,
    "foot_x_range": [
      -0.008,
      0.194
    ],
    "over_support": false,
    "feet_min_y": -0.65,
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
| auto | true | 89.99352000000032 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -4° (+: forward), lateral -6° (+: figure's right), axial rotation proxy 12°.
- Head: Head pitch -2° (+: forward/down), roll -13° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -1° (+: left hip lower), yaw 13°, anterior/posterior tilt proxy -10° (low confidence).
- L arm: Left arm: arm abducted ~53°; shoulder flexed ~36° forward; elbow bent ~54°.
- R arm: Right arm: arm abducted ~49°; shoulder extended ~19° behind; elbow bent ~48°.
- L leg: Left leg: thigh forward ~23°; knee bent ~18°.
- R leg: Right leg: thigh forward ~79° (hip flexion); abducted ~47° outward; knee ~right-angle (88°).
- Balance: COM outside foot support base (balance risk). (floating=false)