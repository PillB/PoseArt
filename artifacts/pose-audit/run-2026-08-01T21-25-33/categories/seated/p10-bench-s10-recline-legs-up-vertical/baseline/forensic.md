# Forensic Baseline — p10-bench-s10-recline-legs-up-vertical
- name: Reclined on Bench, Legs Raised Vertical
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Lie on your back on the bench with the hips near the edge, then raise both legs straight up into the air, perpendicular to the floor. Let the head hang back off the opposite edge of the bench, and bring one hand up near the face.
- tip: Keep the legs together and fully extended for the cleanest vertical line — even a slight bend in the knees breaks the dramatic silhouette.

## Raw joint config
```json
{
  "spine": 18,
  "neck": 27,
  "hips": 0,
  "leftShoulder": 30,
  "rightShoulder": -15,
  "leftElbow": 95,
  "rightElbow": 20,
  "shoulderFwdL": 10,
  "shoulderFwdR": 5,
  "leftHip": 118,
  "rightHip": 115,
  "leftKnee": 10,
  "rightKnee": 12,
  "leftAnkle": -10,
  "rightAnkle": -10,
  "hipAbductL": -5,
  "hipAbductR": 5,
  "globalTwist": 0,
  "globalRoll": 0,
  "globalTilt": -85
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -65,
    "yaw_deg": 0,
    "roll_deg": 48.5,
    "description": "Head pitch -65° (+: forward/down), roll 49° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -67,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -67° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 44.9,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -23.5,
    "shoulder_sagittal_flexion_deg": 69.6,
    "elbow_flexion_deg": 25.2,
    "forearm_forward_deg": 75.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder flexed ~70° forward; elbow bent ~25°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 55.2,
    "shoulder_sagittal_flexion_deg": 60.7,
    "elbow_flexion_deg": 12.1,
    "forearm_forward_deg": 75.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~55°; shoulder flexed ~61° forward; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": -157,
    "hip_abduction_deg": 174.6,
    "knee_flexion_deg": 10.3,
    "foot_forward_deg": -100.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~157° behind; abducted ~175° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -160,
    "hip_abduction_deg": -174.7,
    "knee_flexion_deg": 12.2,
    "foot_forward_deg": -101.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~160° behind; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.778,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.789,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.423,
    "foot_x_range": [
      -0.251,
      0.089
    ],
    "over_support": true,
    "feet_min_y": 0.778,
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
      "value": -23.5,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder flexed ~70° forward; elbow bent ~25°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "left_hip_flexion",
      "value": -157,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh extended ~157° behind; abducted ~175° outward; knee straight.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": -160,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh extended ~160° behind; knee straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74565000000031 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -67° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -65° (+: forward/down), roll 49° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm at side; shoulder flexed ~70° forward; elbow bent ~25°.
- R arm: Right arm: arm abducted ~55°; shoulder flexed ~61° forward; elbow straight.
- L leg: Left leg: thigh extended ~157° behind; abducted ~175° outward; knee straight.
- R leg: Right leg: thigh extended ~160° behind; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_shoulder_abduction","value":-23.5,"band":[0,180],"ctx":"Left arm: arm at side; shoulder flexed ~70° forward; elbow bent ~25°.","verdict":"outside_band_review"},{"joint":"left_hip_flexion","value":-157,"band":[-30,130],"ctx":"Left leg: thigh extended ~157° behind; abducted ~175° outward; knee straight.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":-160,"band":[-30,130],"ctx":"Right leg: thigh extended ~160° behind; knee straight.","verdict":"outside_band_review"}]