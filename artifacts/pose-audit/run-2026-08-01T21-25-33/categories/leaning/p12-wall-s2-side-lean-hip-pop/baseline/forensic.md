# Forensic Baseline — p12-wall-s2-side-lean-hip-pop
- name: Wall Side-Lean Hip Pop
- category: leaning | difficulty: Beginner | angle: undefined
- instructions: Lean one shoulder against the wall in profile or three-quarter stance. Pop the hip nearest the camera outward for a strong curve. Cross one ankle in front of the other for a relaxed leg line. Let one hand rest on the popped hip and the other hang naturally or touch the wall.
- tip: Keep only the shoulder (not the whole side of the torso) in contact with the wall to preserve the waist-to-hip curve.

## Raw joint config
```json
{
  "spine": 14,
  "neck": 8,
  "hips": -10,
  "leftShoulder": -10,
  "rightShoulder": -80,
  "leftElbow": 40,
  "rightElbow": 80,
  "shoulderFwdL": -25,
  "shoulderFwdR": 15,
  "leftHip": -5,
  "rightHip": -8,
  "leftKnee": 5,
  "rightKnee": 15,
  "leftAnkle": 0,
  "rightAnkle": -8,
  "hipAbductL": 0,
  "hipAbductR": -6,
  "globalTwist": 5,
  "globalRoll": 15,
  "globalTilt": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 13.3,
    "yaw_deg": 0,
    "roll_deg": -5.8,
    "description": "Head pitch 13° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14.3,
    "lateral_flexion_deg": -13.8,
    "axial_rotation_deg": 5,
    "description": "Torso flexion 14° (+: forward), lateral -14° (+: figure's right), axial rotation proxy 5°."
  },
  "pelvis": {
    "tilt_deg": 0.9,
    "list_deg": 4.9,
    "yaw_deg": 4.9,
    "description": "Pelvic list 5° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 1° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 20.4,
    "shoulder_sagittal_flexion_deg": 4.6,
    "elbow_flexion_deg": 21.5,
    "forearm_forward_deg": 23.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~20°; elbow bent ~22°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 120.6,
    "shoulder_sagittal_flexion_deg": -128.9,
    "elbow_flexion_deg": 77.9,
    "forearm_forward_deg": 116.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~121° abduction); shoulder extended ~129° behind; elbow ~right-angle (78°)."
  },
  "left_leg": {
    "hip_flexion_deg": -4,
    "hip_abduction_deg": -4.6,
    "knee_flexion_deg": 5.6,
    "foot_forward_deg": 57.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -7.7,
    "hip_abduction_deg": 10.3,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 56.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee bent ~15°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.886,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.852,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": -0.107,
    "com_z": 0.08,
    "foot_x_range": [
      -0.106,
      0.33
    ],
    "over_support": false,
    "feet_min_y": -0.886,
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
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -128.9,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~121° abduction); shoulder extended ~129° behind; elbow ~right-angle (78°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.25000000000017 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral -14° (+: figure's right), axial rotation proxy 5°.
- Head: Head pitch 13° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 5° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 1° (low confidence).
- L arm: Left arm: arm abducted ~20°; elbow bent ~22°.
- R arm: Right arm: arm overhead (~121° abduction); shoulder extended ~129° behind; elbow ~right-angle (78°).
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee bent ~15°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-128.9,"band":[-60,180],"ctx":"Right arm: arm overhead (~121° abduction); shoulder extended ~129° behind; elbow ~right-angle (78°).","verdict":"outside_band_review"}]