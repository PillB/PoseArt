# Forensic Baseline — p17-tubes-s9-seated-hand-hair-leg-back
- name: Seated with Hand in Hair and Leg Extended Back
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on a tube with one leg extended back long behind you, toe pointed. Raise one hand up into the hair while the other rests on or near the tube's surface. Turn the head and gaze off to the side.
- tip: Lift the raised elbow up and out rather than pinning it close to the head, to open up the silhouette.

## Raw joint config
```json
{
  "spine": 10,
  "neck": 15,
  "hips": 8,
  "globalTilt": 8,
  "globalRoll": 10,
  "globalTwist": 20,
  "leftShoulder": -136,
  "rightShoulder": -15,
  "leftElbow": 81,
  "rightElbow": 30,
  "shoulderFwdL": 15,
  "shoulderFwdR": 10,
  "leftHip": 90,
  "rightHip": 10,
  "leftKnee": 90,
  "rightKnee": 8,
  "leftAnkle": -5,
  "rightAnkle": 15,
  "hipAbductL": -5,
  "hipAbductR": 3
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 11.7,
    "yaw_deg": 0,
    "roll_deg": 10.5,
    "description": "Head pitch 12° (+: forward/down), roll 11° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 16.9,
    "lateral_flexion_deg": -3.7,
    "axial_rotation_deg": 18.9,
    "description": "Torso flexion 17° (+: forward), lateral -4° (+: figure's right), axial rotation proxy 19°."
  },
  "pelvis": {
    "tilt_deg": -10,
    "list_deg": 16.6,
    "yaw_deg": 17.8,
    "description": "Pelvic list 17° (+: left hip lower), yaw 18°, anterior/posterior tilt proxy -10° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 151.4,
    "shoulder_sagittal_flexion_deg": -179.6,
    "elbow_flexion_deg": 31,
    "forearm_forward_deg": 149,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~151° abduction); shoulder extended ~180° behind; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 39.4,
    "shoulder_sagittal_flexion_deg": -39.9,
    "elbow_flexion_deg": 17.9,
    "forearm_forward_deg": -21.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~39°; shoulder extended ~40° behind; elbow bent ~18°."
  },
  "left_leg": {
    "hip_flexion_deg": 85.6,
    "hip_abduction_deg": -80.3,
    "knee_flexion_deg": 89.7,
    "foot_forward_deg": -136.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~86° (hip flexion); knee ~right-angle (90°)."
  },
  "right_leg": {
    "hip_flexion_deg": 0.2,
    "hip_abduction_deg": 15.4,
    "knee_flexion_deg": 8.4,
    "foot_forward_deg": 85,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~15° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.499,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.736,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": -0.035,
    "com_z": 0.112,
    "foot_x_range": [
      -0.061,
      0.464
    ],
    "over_support": true,
    "feet_min_y": -0.736,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -179.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~151° abduction); shoulder extended ~180° behind; elbow bent ~31°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49850000000005 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 17° (+: forward), lateral -4° (+: figure's right), axial rotation proxy 19°.
- Head: Head pitch 12° (+: forward/down), roll 11° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 17° (+: left hip lower), yaw 18°, anterior/posterior tilt proxy -10° (low confidence).
- L arm: Left arm: arm overhead (~151° abduction); shoulder extended ~180° behind; elbow bent ~31°.
- R arm: Right arm: arm abducted ~39°; shoulder extended ~40° behind; elbow bent ~18°.
- L leg: Left leg: thigh forward ~86° (hip flexion); knee ~right-angle (90°).
- R leg: Right leg: thigh near neutral; abducted ~15° outward; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-179.6,"band":[-60,180],"ctx":"Left arm: arm overhead (~151° abduction); shoulder extended ~180° behind; elbow bent ~31°.","verdict":"outside_band_review"}]