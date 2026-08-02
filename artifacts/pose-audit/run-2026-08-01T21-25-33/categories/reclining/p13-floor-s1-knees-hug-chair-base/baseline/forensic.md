# Forensic Baseline — p13-floor-s1-knees-hug-chair-base
- name: Knees Hugged Against Chair Base
- category: reclining | difficulty: Beginner | angle: undefined
- instructions: Sit on the floor with your back and shoulder leaned against the base of an armchair or ottoman. Draw both knees up toward the chest and wrap both arms around the shins, clasping the hands together. Drop the chin down and turn the gaze downward and away from the camera, letting hair fall forward.
- tip: Round the upper back slightly and let the head hang naturally rather than holding it up, this reads as a quiet, introspective moment rather than a posed stance.

## Raw joint config
```json
{
  "spine": -32,
  "neck": -28,
  "hips": 6,
  "leftShoulder": 55,
  "rightShoulder": 60,
  "leftElbow": 100,
  "rightElbow": 100,
  "shoulderFwdL": -35,
  "shoulderFwdR": -35,
  "leftHip": 112,
  "rightHip": 115,
  "leftKnee": 138,
  "rightKnee": 138,
  "leftAnkle": -10,
  "rightAnkle": -10,
  "hipAbductL": -8,
  "hipAbductR": 8,
  "globalTwist": 10,
  "globalRoll": 8,
  "globalTilt": -60
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -100.9,
    "yaw_deg": 0,
    "roll_deg": -106.7,
    "description": "Head pitch -101° (+: forward/down), roll -107° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -93.4,
    "lateral_flexion_deg": -109.4,
    "axial_rotation_deg": 9.9,
    "description": "Torso flexion -93° (+: forward), lateral -109° (+: figure's right), axial rotation proxy 10°."
  },
  "pelvis": {
    "tilt_deg": 39.7,
    "list_deg": 10.5,
    "yaw_deg": 14.7,
    "description": "Pelvic list 11° (+: left hip lower), yaw 15°, anterior/posterior tilt proxy 40° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -79.8,
    "shoulder_sagittal_flexion_deg": 77.5,
    "elbow_flexion_deg": 61.1,
    "forearm_forward_deg": 17.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder flexed ~77° forward; elbow bent ~61°."
  },
  "right_arm": {
    "shoulder_abduction_deg": -56.8,
    "shoulder_sagittal_flexion_deg": 67.5,
    "elbow_flexion_deg": 65.5,
    "forearm_forward_deg": 14.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder flexed ~68° forward; elbow bent ~66°."
  },
  "left_leg": {
    "hip_flexion_deg": 171.7,
    "hip_abduction_deg": 171.4,
    "knee_flexion_deg": 138,
    "foot_forward_deg": -3.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~172° (hip flexion); abducted ~171° outward; knee deeply bent (~138°)."
  },
  "right_leg": {
    "hip_flexion_deg": 174.7,
    "hip_abduction_deg": -170.9,
    "knee_flexion_deg": 137.5,
    "foot_forward_deg": -0.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~175° (hip flexion); knee deeply bent (~138°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.004,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.033,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.081,
    "com_z": -0.427,
    "foot_x_range": [
      -0.247,
      0.082
    ],
    "over_support": true,
    "feet_min_y": 0.004,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "L"
    },
    {
      "type": "knee_above_hip",
      "side": "R"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_abduction",
      "value": -79.8,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder flexed ~77° forward; elbow bent ~61°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": 171.7,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~172° (hip flexion); abducted ~171° outward; knee deeply bent (~138°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_abduction",
      "value": -56.8,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder flexed ~68° forward; elbow bent ~66°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 174.7,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~175° (hip flexion); knee deeply bent (~138°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 109.99702999999974 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -93° (+: forward), lateral -109° (+: figure's right), axial rotation proxy 10°.
- Head: Head pitch -101° (+: forward/down), roll -107° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 11° (+: left hip lower), yaw 15°, anterior/posterior tilt proxy 40° (low confidence).
- L arm: Left arm: arm at side; shoulder flexed ~77° forward; elbow bent ~61°.
- R arm: Right arm: arm at side; shoulder flexed ~68° forward; elbow bent ~66°.
- L leg: Left leg: thigh forward ~172° (hip flexion); abducted ~171° outward; knee deeply bent (~138°).
- R leg: Right leg: thigh forward ~175° (hip flexion); knee deeply bent (~138°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_shoulder_abduction","value":-79.8,"band":[0,180],"ctx":"Left arm: arm at side; shoulder flexed ~77° forward; elbow bent ~61°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":171.7,"band":[-30,130],"ctx":"Left leg: thigh forward ~172° (hip flexion); abducted ~171° outward; knee deeply bent (~138°).","verdict":"outside_band_review"},{"joint":"right_shoulder_abduction","value":-56.8,"band":[0,180],"ctx":"Right arm: arm at side; shoulder flexed ~68° forward; elbow bent ~66°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":174.7,"band":[-30,130],"ctx":"Right leg: thigh forward ~175° (hip flexion); knee deeply bent (~138°).","verdict":"outside_band_review"}]