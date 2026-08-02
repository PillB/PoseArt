# Forensic Baseline — diagonal-prop
- name: Diagonal Prop
- category: reclining | difficulty: Intermediate | angle: 3/4 View
- instructions: Lie on the side with both hands tucked under the cheek as if sleeping, knees drawn up gently. Close the eyes softly for a tender, peaceful mood.
- tip: A slightly parted mouth sells sleepy authenticity better than one held tightly closed.

## Raw joint config
```json
{
  "globalTilt": 75,
  "globalRoll": -15,
  "leftShoulder": -10,
  "leftElbow": 81,
  "rightShoulder": 8,
  "rightElbow": 18,
  "leftHip": 40,
  "leftKnee": 30,
  "rightHip": 30,
  "rightKnee": 20
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 75.5,
    "yaw_deg": 0,
    "roll_deg": 15,
    "description": "Head pitch 75° (+: forward/down), roll 15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 75.5,
    "lateral_flexion_deg": 15,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 75° (+: forward), lateral 15° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44,
    "list_deg": -14.5,
    "yaw_deg": 0,
    "description": "Pelvic list -15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -44° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 83.1,
    "shoulder_sagittal_flexion_deg": -85.1,
    "elbow_flexion_deg": 39.9,
    "forearm_forward_deg": -46.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~83° (lateral); shoulder extended ~85° behind; elbow bent ~40°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 30.7,
    "shoulder_sagittal_flexion_deg": -71.7,
    "elbow_flexion_deg": 4.8,
    "forearm_forward_deg": -68.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~31°; shoulder extended ~72° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": -35.9,
    "hip_abduction_deg": 15,
    "knee_flexion_deg": 30.1,
    "foot_forward_deg": 52.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~36° behind; knee bent ~30°."
  },
  "right_leg": {
    "hip_flexion_deg": -46,
    "hip_abduction_deg": -15,
    "knee_flexion_deg": 20.2,
    "foot_forward_deg": 32.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~46° behind; knee bent ~20°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.79,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.796,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0.03,
    "com_z": 0.435,
    "foot_x_range": [
      -0.386,
      -0.04
    ],
    "over_support": false,
    "feet_min_y": -0.796,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -85.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~83° (lateral); shoulder extended ~85° behind; elbow bent ~40°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": -35.9,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~36° behind; knee bent ~30°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -71.7,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~31°; shoulder extended ~72° behind; elbow straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -46,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~46° behind; knee bent ~20°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 112.24973000000027 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 75° (+: forward), lateral 15° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 75° (+: forward/down), roll 15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -44° (low confidence).
- L arm: Left arm: arm abducted ~83° (lateral); shoulder extended ~85° behind; elbow bent ~40°.
- R arm: Right arm: arm abducted ~31°; shoulder extended ~72° behind; elbow straight.
- L leg: Left leg: thigh extended ~36° behind; knee bent ~30°.
- R leg: Right leg: thigh extended ~46° behind; knee bent ~20°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-85.1,"band":[-60,180],"ctx":"Left arm: arm abducted ~83° (lateral); shoulder extended ~85° behind; elbow bent ~40°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":-35.9,"band":[-30,130],"ctx":"Left leg: thigh extended ~36° behind; knee bent ~30°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-71.7,"band":[-60,180],"ctx":"Right arm: arm abducted ~31°; shoulder extended ~72° behind; elbow straight.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-46,"band":[-30,130],"ctx":"Right leg: thigh extended ~46° behind; knee bent ~20°.","verdict":"outside_band_review"}]