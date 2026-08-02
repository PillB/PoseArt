# Forensic Baseline — p15-chair-s3-side-straddle-back
- name: Chair Backward Straddle Lean
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit backward on the chair, straddling the seat and facing the chair back. Fold arms and rest them along the top rail of the chair back, chest lifted, chin resting toward the forearms or turned to camera.
- tip: Keep the chest lifted off the chair back so the pose doesn't collapse; use the arms on the rail as a frame, not a crutch.

## Raw joint config
```json
{
  "spine": 12,
  "neck": -4.4,
  "hips": 0,
  "globalTilt": 0,
  "globalRoll": 0,
  "globalTwist": 55,
  "leftShoulder": -60,
  "rightShoulder": -72,
  "leftElbow": 100,
  "rightElbow": 95,
  "shoulderFwdL": 35,
  "shoulderFwdR": 25,
  "leftHip": 95,
  "rightHip": 95,
  "leftKnee": 98,
  "rightKnee": 98,
  "leftAnkle": 0,
  "rightAnkle": 0,
  "hipAbductL": 25,
  "hipAbductR": 25
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 10.5,
    "yaw_deg": 0,
    "roll_deg": 7.4,
    "description": "Head pitch 10° (+: forward/down), roll 7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 7,
    "lateral_flexion_deg": 9.9,
    "axial_rotation_deg": 39.3,
    "description": "Torso flexion 7° (+: forward), lateral 10° (+: figure's right), axial rotation proxy 39°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 39.3,
    "description": "Pelvic list 0° (+: left hip lower), yaw 39°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 83.3,
    "shoulder_sagittal_flexion_deg": 53.2,
    "elbow_flexion_deg": 98.6,
    "forearm_forward_deg": 80.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~83° (lateral); shoulder flexed ~53° forward; elbow ~right-angle (99°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": -168.1,
    "shoulder_sagittal_flexion_deg": -95.2,
    "elbow_flexion_deg": 94.6,
    "forearm_forward_deg": 127.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder extended ~95° behind; elbow ~right-angle (95°)."
  },
  "left_leg": {
    "hip_flexion_deg": 114.7,
    "hip_abduction_deg": -94.6,
    "knee_flexion_deg": 85.1,
    "foot_forward_deg": -112.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~115° (hip flexion); knee ~right-angle (85°)."
  },
  "right_leg": {
    "hip_flexion_deg": 95.2,
    "hip_abduction_deg": 99,
    "knee_flexion_deg": 85.1,
    "foot_forward_deg": -131.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~95° (hip flexion); abducted ~99° outward; knee ~right-angle (85°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.49,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.49,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.056,
    "com_z": 0.039,
    "foot_x_range": [
      -0.081,
      0.362
    ],
    "over_support": true,
    "feet_min_y": 0.49,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -95.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder extended ~95° behind; elbow ~right-angle (95°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_abduction",
      "value": -168.1,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder extended ~95° behind; elbow ~right-angle (95°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.98911000000008 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 7° (+: forward), lateral 10° (+: figure's right), axial rotation proxy 39°.
- Head: Head pitch 10° (+: forward/down), roll 7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 39°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~83° (lateral); shoulder flexed ~53° forward; elbow ~right-angle (99°).
- R arm: Right arm: arm at side; shoulder extended ~95° behind; elbow ~right-angle (95°).
- L leg: Left leg: thigh forward ~115° (hip flexion); knee ~right-angle (85°).
- R leg: Right leg: thigh forward ~95° (hip flexion); abducted ~99° outward; knee ~right-angle (85°).
- Balance: COM over foot support base. (floating=true)
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-95.2,"band":[-60,180],"ctx":"Right arm: arm at side; shoulder extended ~95° behind; elbow ~right-angle (95°).","verdict":"outside_band_review"},{"joint":"right_shoulder_abduction","value":-168.1,"band":[0,180],"ctx":"Right arm: arm at side; shoulder extended ~95° behind; elbow ~right-angle (95°).","verdict":"outside_band_review"}]