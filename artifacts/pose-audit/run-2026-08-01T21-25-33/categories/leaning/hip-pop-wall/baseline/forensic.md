# Forensic Baseline — hip-pop-wall
- name: Hip Pop Wall
- category: leaning | difficulty: Beginner | angle: 3/4 View
- instructions: Lean one shoulder against the wall and drive the opposite hip sharply outward, forming a strong S-curve through the spine. Rest the near hand on the popped hip for emphasis.
- tip: The sharper the hip pop, the more graphic the silhouette — ideal under high-contrast lighting.

## Raw joint config
```json
{
  "spine": 18,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -8,
  "leftElbow": 40,
  "rightElbow": 20,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftHip": 22,
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
    "pitch_deg": 18.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 18° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 18,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 32.1,
    "shoulder_sagittal_flexion_deg": -18.7,
    "elbow_flexion_deg": 21.3,
    "forearm_forward_deg": 6.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~32°; shoulder extended ~19° behind; elbow bent ~21°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 25.1,
    "shoulder_sagittal_flexion_deg": -15.9,
    "elbow_flexion_deg": 8,
    "forearm_forward_deg": -7.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~25°; shoulder extended ~16° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 22,
    "hip_abduction_deg": -21.4,
    "knee_flexion_deg": 9.7,
    "foot_forward_deg": 89.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~22°; knee straight."
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
      "y": -0.675,
      "relation": "elevated"
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
    "com_z": 0.102,
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
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.74249999999999 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 18° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 18° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~32°; shoulder extended ~19° behind; elbow bent ~21°.
- R arm: Right arm: arm abducted ~25°; shoulder extended ~16° behind; elbow straight.
- L leg: Left leg: thigh forward ~22°; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)