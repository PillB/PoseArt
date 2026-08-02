# Forensic Baseline — floor-roll-side
- name: Floor Roll Side
- category: reclining | difficulty: Intermediate | angle: 3/4 View
- instructions: Capture the mid-motion of rolling from the back onto the side, one arm reaching across the body and both legs mid-turn. A candid, in-between moment full of energy.
- tip: Shoot in burst through several real rolls -- the in-between frames beat any held pose.

## Raw joint config
```json
{
  "globalTilt": 80,
  "globalRoll": -45,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "leftElbow": 65,
  "rightElbow": 45,
  "leftHip": 30,
  "rightHip": 15
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 82.9,
    "yaw_deg": 0,
    "roll_deg": 45,
    "description": "Head pitch 83° (+: forward/down), roll 45° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 82.9,
    "lateral_flexion_deg": 45,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 83° (+: forward), lateral 45° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44.6,
    "list_deg": -35.3,
    "yaw_deg": 0,
    "description": "Pelvic list -35° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 119.9,
    "shoulder_sagittal_flexion_deg": -108.7,
    "elbow_flexion_deg": 32.9,
    "forearm_forward_deg": -70.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~120° (lateral); shoulder extended ~109° behind; elbow bent ~33°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 11.7,
    "shoulder_sagittal_flexion_deg": -72.5,
    "elbow_flexion_deg": 10.6,
    "forearm_forward_deg": -70.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder extended ~73° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": -59.3,
    "hip_abduction_deg": 45,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 15.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~59° behind; abducted ~45° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -71.8,
    "hip_abduction_deg": -45,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": -5.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~72° behind; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.422,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.45,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.055,
    "com_z": 0.443,
    "foot_x_range": [
      -0.637,
      -0.235
    ],
    "over_support": false,
    "feet_min_y": -0.45,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
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
      "value": -108.7,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~120° (lateral); shoulder extended ~109° behind; elbow bent ~33°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": -59.3,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~59° behind; abducted ~45° outward; knee straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -72.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder extended ~73° behind; elbow straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -71.8,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~72° behind; knee straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74349000000053 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 83° (+: forward), lateral 45° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 83° (+: forward/down), roll 45° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -35° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence).
- L arm: Left arm: arm abducted ~120° (lateral); shoulder extended ~109° behind; elbow bent ~33°.
- R arm: Right arm: arm at side; shoulder extended ~73° behind; elbow straight.
- L leg: Left leg: thigh extended ~59° behind; abducted ~45° outward; knee straight.
- R leg: Right leg: thigh extended ~72° behind; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-108.7,"band":[-60,180],"ctx":"Left arm: arm abducted ~120° (lateral); shoulder extended ~109° behind; elbow bent ~33°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":-59.3,"band":[-30,130],"ctx":"Left leg: thigh extended ~59° behind; abducted ~45° outward; knee straight.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-72.5,"band":[-60,180],"ctx":"Right arm: arm at side; shoulder extended ~73° behind; elbow straight.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-71.8,"band":[-30,130],"ctx":"Right leg: thigh extended ~72° behind; knee straight.","verdict":"outside_band_review"}]