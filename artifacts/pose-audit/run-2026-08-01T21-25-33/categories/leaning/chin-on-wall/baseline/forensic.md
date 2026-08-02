# Forensic Baseline — chin-on-wall
- name: Chin on Wall
- category: leaning | difficulty: Intermediate | angle: 3/4 View
- instructions: Stand close to the wall and press one palm flat against the surface, then rest the chin lightly on the back of that hand. Angle the body away in a soft diagonal, wrist relaxed under the chin.
- tip: Keep the wrist relaxed under the chin — a stiff wrist reads awkward in close-up framing.

## Raw joint config
```json
{
  "spine": 14,
  "hips": 10,
  "neck": -3,
  "leftShoulder": -60,
  "leftElbow": 100,
  "rightElbow": 20,
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
    "pitch_deg": 14,
    "yaw_deg": 0,
    "roll_deg": -3,
    "description": "Head pitch 14° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 83.5,
    "shoulder_sagittal_flexion_deg": -61.7,
    "elbow_flexion_deg": 98.6,
    "forearm_forward_deg": 81.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~83° (lateral); shoulder extended ~62° behind; elbow ~right-angle (99°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 24.4,
    "shoulder_sagittal_flexion_deg": -11.9,
    "elbow_flexion_deg": 7.6,
    "forearm_forward_deg": -3.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~24°; elbow straight."
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
    "com_z": 0.08,
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
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -61.7,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~83° (lateral); shoulder extended ~62° behind; elbow ~right-angle (99°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 95.24799000000006 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 14° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~83° (lateral); shoulder extended ~62° behind; elbow ~right-angle (99°).
- R arm: Right arm: arm abducted ~24°; elbow straight.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-61.7,"band":[-60,180],"ctx":"Left arm: arm abducted ~83° (lateral); shoulder extended ~62° behind; elbow ~right-angle (99°).","verdict":"outside_band_review"}]