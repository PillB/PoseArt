# Forensic Baseline — hammock-pose
- name: Hammock Pose
- category: reclining | difficulty: Beginner | angle: Side
- instructions: Recline in a hammock or curved surface and let the body sink naturally into a gentle U-shape. Trail one arm off the side, fingertips grazing the ground.
- tip: Let the hammock curve do the work -- resist holding the torso rigidly straight within it.

## Raw joint config
```json
{
  "globalTilt": 80,
  "spine": 15,
  "leftShoulder": -60,
  "rightShoulder": -42,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 30,
  "rightHip": 30,
  "leftKnee": 20,
  "rightKnee": 20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 95,
    "yaw_deg": 0,
    "roll_deg": 180,
    "description": "Head pitch 95° (+: forward/down), roll 180° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 95,
    "lateral_flexion_deg": 180,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 95° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44.6,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 102.6,
    "shoulder_sagittal_flexion_deg": -145.4,
    "elbow_flexion_deg": 64.1,
    "forearm_forward_deg": -0.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~103° (lateral); shoulder extended ~145° behind; elbow bent ~64°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 100.6,
    "shoulder_sagittal_flexion_deg": -110.7,
    "elbow_flexion_deg": 40.2,
    "forearm_forward_deg": -34.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~101° (lateral); shoulder extended ~111° behind; elbow bent ~40°."
  },
  "left_leg": {
    "hip_flexion_deg": -50,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 20.2,
    "foot_forward_deg": 26.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~50° behind; knee bent ~20°."
  },
  "right_leg": {
    "hip_flexion_deg": -50,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 20.2,
    "foot_forward_deg": 26.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~50° behind; knee bent ~20°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.761,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.761,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.447,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.761,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    },
    {
      "type": "elbow_above_shoulder",
      "side": "R",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -145.4,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~103° (lateral); shoulder extended ~145° behind; elbow bent ~64°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": -50,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~50° behind; knee bent ~20°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -110.7,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~101° (lateral); shoulder extended ~111° behind; elbow bent ~40°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -50,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~50° behind; knee bent ~20°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74699999999993 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 95° (+: forward), lateral 180° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 95° (+: forward/down), roll 180° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence).
- L arm: Left arm: arm abducted ~103° (lateral); shoulder extended ~145° behind; elbow bent ~64°.
- R arm: Right arm: arm abducted ~101° (lateral); shoulder extended ~111° behind; elbow bent ~40°.
- L leg: Left leg: thigh extended ~50° behind; knee bent ~20°.
- R leg: Right leg: thigh extended ~50° behind; knee bent ~20°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-145.4,"band":[-60,180],"ctx":"Left arm: arm abducted ~103° (lateral); shoulder extended ~145° behind; elbow bent ~64°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":-50,"band":[-30,130],"ctx":"Left leg: thigh extended ~50° behind; knee bent ~20°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-110.7,"band":[-60,180],"ctx":"Right arm: arm abducted ~101° (lateral); shoulder extended ~111° behind; elbow bent ~40°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-50,"band":[-30,130],"ctx":"Right leg: thigh extended ~50° behind; knee bent ~20°.","verdict":"outside_band_review"}]