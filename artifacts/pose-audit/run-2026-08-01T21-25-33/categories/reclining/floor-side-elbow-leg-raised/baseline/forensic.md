# Forensic Baseline — floor-side-elbow-leg-raised
- name: Floor Side Elbow Leg Raised
- category: reclining | difficulty: Advanced | angle: Side
- instructions: Prop up on one elbow with the body angled diagonally across the frame. Lift the top leg and extend it long, knee straight, for maximum diagonal length.
- tip: Angle the body corner-to-corner across the frame for the most dynamic composition.

## Raw joint config
```json
{
  "globalTilt": 80,
  "globalRoll": -45,
  "leftShoulder": -10,
  "leftElbow": 81,
  "rightShoulder": 8,
  "rightElbow": 18,
  "leftHip": 15,
  "rightHip": -50,
  "rightKnee": 5,
  "shoulderFwdL": 20
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
    "shoulder_abduction_deg": 139.1,
    "shoulder_sagittal_flexion_deg": -114.2,
    "elbow_flexion_deg": 39.9,
    "forearm_forward_deg": -72.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~139° abduction); shoulder extended ~114° behind; elbow bent ~40°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 11.7,
    "shoulder_sagittal_flexion_deg": -72.5,
    "elbow_flexion_deg": 4.8,
    "forearm_forward_deg": -71.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder extended ~73° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": -71.8,
    "hip_abduction_deg": 45,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": -5.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~72° behind; abducted ~45° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -120.7,
    "hip_abduction_deg": 135,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": -74.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~121° behind; abducted ~135° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.295,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.257,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.055,
    "com_z": 0.443,
    "foot_x_range": [
      -0.51,
      0.473
    ],
    "over_support": true,
    "feet_min_y": -0.295,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "R"
    },
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -114.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~139° abduction); shoulder extended ~114° behind; elbow bent ~40°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": -71.8,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~72° behind; abducted ~45° outward; knee straight.",
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
      "value": -120.7,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~121° behind; abducted ~135° outward; knee straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 109.23815000000032 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 83° (+: forward), lateral 45° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 83° (+: forward/down), roll 45° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -35° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence).
- L arm: Left arm: arm overhead (~139° abduction); shoulder extended ~114° behind; elbow bent ~40°.
- R arm: Right arm: arm at side; shoulder extended ~73° behind; elbow straight.
- L leg: Left leg: thigh extended ~72° behind; abducted ~45° outward; knee straight.
- R leg: Right leg: thigh extended ~121° behind; abducted ~135° outward; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-114.2,"band":[-60,180],"ctx":"Left arm: arm overhead (~139° abduction); shoulder extended ~114° behind; elbow bent ~40°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":-71.8,"band":[-30,130],"ctx":"Left leg: thigh extended ~72° behind; abducted ~45° outward; knee straight.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-72.5,"band":[-60,180],"ctx":"Right arm: arm at side; shoulder extended ~73° behind; elbow straight.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-120.7,"band":[-30,130],"ctx":"Right leg: thigh extended ~121° behind; abducted ~135° outward; knee straight.","verdict":"outside_band_review"}]