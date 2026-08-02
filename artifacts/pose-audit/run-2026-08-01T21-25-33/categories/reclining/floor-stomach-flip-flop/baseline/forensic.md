# Forensic Baseline — floor-stomach-flip-flop
- name: Floor Stomach Flip Flop
- category: reclining | difficulty: Beginner | angle: Side
- instructions: Lie face down with knees bent and feet crossed loosely in the air behind, chin resting on stacked hands. A youthful, playful, magazine-cover classic.
- tip: Let the crossed feet sway gently rather than holding them stiff -- it reads as candid.

## Raw joint config
```json
{
  "globalTilt": 80,
  "globalRoll": -15,
  "neck": 10,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 10,
  "rightHip": 25,
  "rightKnee": 40
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 82.9,
    "yaw_deg": 0,
    "roll_deg": 60.4,
    "description": "Head pitch 83° (+: forward/down), roll 60° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 80.3,
    "lateral_flexion_deg": 15,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 80° (+: forward), lateral 15° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44.6,
    "list_deg": -14.5,
    "yaw_deg": 0,
    "description": "Pelvic list -15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 89.9,
    "shoulder_sagittal_flexion_deg": -90,
    "elbow_flexion_deg": 32.9,
    "forearm_forward_deg": -55.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~90° (lateral); shoulder extended ~90° behind; elbow bent ~33°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 41.7,
    "shoulder_sagittal_flexion_deg": -76.5,
    "elbow_flexion_deg": 10.6,
    "forearm_forward_deg": -69.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~42°; shoulder extended ~77° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": -70.6,
    "hip_abduction_deg": 15,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": -9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~71° behind; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -55.9,
    "hip_abduction_deg": -15,
    "knee_flexion_deg": 40.1,
    "foot_forward_deg": 42.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~56° behind; knee bent ~40°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.414,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.755,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0.02,
    "com_z": 0.443,
    "foot_x_range": [
      -0.285,
      -0.028
    ],
    "over_support": false,
    "feet_min_y": -0.755,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -90,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~90° (lateral); shoulder extended ~90° behind; elbow bent ~33°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": -70.6,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~71° behind; knee straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -76.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~42°; shoulder extended ~77° behind; elbow straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -55.9,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~56° behind; knee bent ~40°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 112.24523 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 80° (+: forward), lateral 15° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 83° (+: forward/down), roll 60° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -15° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence).
- L arm: Left arm: arm abducted ~90° (lateral); shoulder extended ~90° behind; elbow bent ~33°.
- R arm: Right arm: arm abducted ~42°; shoulder extended ~77° behind; elbow straight.
- L leg: Left leg: thigh extended ~71° behind; knee straight.
- R leg: Right leg: thigh extended ~56° behind; knee bent ~40°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-90,"band":[-60,180],"ctx":"Left arm: arm abducted ~90° (lateral); shoulder extended ~90° behind; elbow bent ~33°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":-70.6,"band":[-30,130],"ctx":"Left leg: thigh extended ~71° behind; knee straight.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-76.5,"band":[-60,180],"ctx":"Right arm: arm abducted ~42°; shoulder extended ~77° behind; elbow straight.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-55.9,"band":[-30,130],"ctx":"Right leg: thigh extended ~56° behind; knee bent ~40°.","verdict":"outside_band_review"}]