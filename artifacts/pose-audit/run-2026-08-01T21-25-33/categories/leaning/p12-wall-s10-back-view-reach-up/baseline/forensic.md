# Forensic Baseline — p12-wall-s10-back-view-reach-up
- name: Back View Reach-Up Against Wall
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Face the wall with the back fully toward the camera. Reach one arm up to press the palm flat against the wall above head height. Bring the other hand up to rest near the neck or opposite shoulder, elbow bent and pointing down. Cross one ankle in front of the other, and turn the head to show the prof
- tip: Push the hip out to the side opposite the raised arm to create a clean diagonal line from the reaching hand down to the crossed feet.

## Raw joint config
```json
{
  "spine": 15,
  "hips": -7,
  "neck": 27,
  "leftShoulder": -60,
  "rightShoulder": -95,
  "leftElbow": 38,
  "rightElbow": 83,
  "hipAbductL": 0,
  "hipAbductR": 6,
  "leftHip": -5,
  "rightHip": -10,
  "leftKnee": 5,
  "rightKnee": 14,
  "leftAnkle": 0,
  "rightAnkle": -8,
  "shoulderFwdL": -15,
  "shoulderFwdR": 20,
  "globalTilt": 0,
  "globalTwist": -20,
  "globalRoll": 10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 23.5,
    "yaw_deg": 0,
    "roll_deg": 10.6,
    "description": "Head pitch 24° (+: forward/down), roll 11° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14.6,
    "lateral_flexion_deg": -15.2,
    "axial_rotation_deg": -18.9,
    "description": "Torso flexion 15° (+: forward), lateral -15° (+: figure's right), axial rotation proxy -19°."
  },
  "pelvis": {
    "tilt_deg": -2.4,
    "list_deg": 2.4,
    "yaw_deg": -18.8,
    "description": "Pelvic list 2° (+: left hip lower), yaw -19°, anterior/posterior tilt proxy -2° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 73.4,
    "shoulder_sagittal_flexion_deg": -49.9,
    "elbow_flexion_deg": 37.4,
    "forearm_forward_deg": 46,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~73° (lateral); shoulder extended ~50° behind; elbow bent ~37°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 128.6,
    "shoulder_sagittal_flexion_deg": -158.5,
    "elbow_flexion_deg": 72.8,
    "forearm_forward_deg": 120,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~129° abduction); shoulder extended ~158° behind; elbow bent ~73°."
  },
  "left_leg": {
    "hip_flexion_deg": -7.1,
    "hip_abduction_deg": -5.1,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 51.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -13.6,
    "hip_abduction_deg": 0.9,
    "knee_flexion_deg": 13.8,
    "foot_forward_deg": 47,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.887,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.876,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": -0.105,
    "com_z": 0.08,
    "foot_x_range": [
      -0.153,
      0.087
    ],
    "over_support": true,
    "feet_min_y": -0.887,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
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
      "value": -158.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~129° abduction); shoulder extended ~158° behind; elbow bent ~73°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.4940000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 15° (+: forward), lateral -15° (+: figure's right), axial rotation proxy -19°.
- Head: Head pitch 24° (+: forward/down), roll 11° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 2° (+: left hip lower), yaw -19°, anterior/posterior tilt proxy -2° (low confidence).
- L arm: Left arm: arm abducted ~73° (lateral); shoulder extended ~50° behind; elbow bent ~37°.
- R arm: Right arm: arm overhead (~129° abduction); shoulder extended ~158° behind; elbow bent ~73°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-158.5,"band":[-60,180],"ctx":"Right arm: arm overhead (~129° abduction); shoulder extended ~158° behind; elbow bent ~73°.","verdict":"outside_band_review"}]