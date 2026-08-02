# Forensic Baseline — p11-armchair-s5-both-legs-over-armrest-smile
- name: Armchair Both Legs Draped Over Armrest
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit sideways in the chair with the back against one armrest, drape both legs together over the opposite armrest, hands resting on the seat and the near armrest, head turned to camera with a natural smile.
- tip: Let the shoulders sink into the back cushion so the pose feels playful and at ease, not braced.

## Raw joint config
```json
{
  "spine": 10,
  "neck": -5.5,
  "hips": 8,
  "globalTilt": 20,
  "globalRoll": 30,
  "globalTwist": 25,
  "leftShoulder": -50,
  "rightShoulder": -40,
  "leftElbow": 81,
  "rightElbow": 75,
  "shoulderFwdL": 20,
  "shoulderFwdR": 10,
  "leftHip": 70,
  "rightHip": 68,
  "leftKnee": 20,
  "rightKnee": 22,
  "leftAnkle": 8,
  "rightAnkle": 8,
  "hipAbductL": -18,
  "hipAbductR": -18
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 31.3,
    "yaw_deg": 0,
    "roll_deg": -21.7,
    "description": "Head pitch 31° (+: forward/down), roll -22° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 27.9,
    "lateral_flexion_deg": -16.3,
    "axial_rotation_deg": 22.9,
    "description": "Torso flexion 28° (+: forward), lateral -16° (+: figure's right), axial rotation proxy 23°."
  },
  "pelvis": {
    "tilt_deg": -20.1,
    "list_deg": 29.8,
    "yaw_deg": 20.6,
    "description": "Pelvic list 30° (+: left hip lower), yaw 21°, anterior/posterior tilt proxy -20° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 53.8,
    "shoulder_sagittal_flexion_deg": -13.5,
    "elbow_flexion_deg": 76.2,
    "forearm_forward_deg": 51.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~54°; elbow ~right-angle (76°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 91.4,
    "shoulder_sagittal_flexion_deg": -91.2,
    "elbow_flexion_deg": 65,
    "forearm_forward_deg": 42.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~91° (lateral); shoulder extended ~91° behind; elbow bent ~65°."
  },
  "left_leg": {
    "hip_flexion_deg": 58.3,
    "hip_abduction_deg": -44.3,
    "knee_flexion_deg": 20,
    "foot_forward_deg": 136.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~58°; knee bent ~20°."
  },
  "right_leg": {
    "hip_flexion_deg": 66.7,
    "hip_abduction_deg": 78.5,
    "knee_flexion_deg": 20.2,
    "foot_forward_deg": 150.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~67°; abducted ~78° outward; knee bent ~20°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.188,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.208,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.124,
    "com_z": 0.187,
    "foot_x_range": [
      0.181,
      0.868
    ],
    "over_support": false,
    "feet_min_y": -0.188,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -91.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~91° (lateral); shoulder extended ~91° behind; elbow bent ~65°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 93.00150000000004 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 28° (+: forward), lateral -16° (+: figure's right), axial rotation proxy 23°.
- Head: Head pitch 31° (+: forward/down), roll -22° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 30° (+: left hip lower), yaw 21°, anterior/posterior tilt proxy -20° (low confidence).
- L arm: Left arm: arm abducted ~54°; elbow ~right-angle (76°).
- R arm: Right arm: arm abducted ~91° (lateral); shoulder extended ~91° behind; elbow bent ~65°.
- L leg: Left leg: thigh forward ~58°; knee bent ~20°.
- R leg: Right leg: thigh forward ~67°; abducted ~78° outward; knee bent ~20°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-91.2,"band":[-60,180],"ctx":"Right arm: arm abducted ~91° (lateral); shoulder extended ~91° behind; elbow bent ~65°.","verdict":"outside_band_review"}]