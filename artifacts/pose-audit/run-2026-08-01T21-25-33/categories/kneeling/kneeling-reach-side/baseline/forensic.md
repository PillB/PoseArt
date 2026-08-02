# Forensic Baseline — kneeling-reach-side
- name: Kneeling Reach Side
- category: kneeling | difficulty: Intermediate | angle: 3/4 View
- instructions: Kneel on one knee with the other foot planted flat in front, then tilt the chin upward toward the light source. Rest a hand on the raised knee and let the eyes follow the light.
- tip: Angle the face toward the key light — it softens shadows and opens the eyes beautifully.

## Raw joint config
```json
{
  "spine": 8,
  "neck": -6,
  "leftShoulder": -90,
  "leftElbow": 70,
  "rightShoulder": 20,
  "rightElbow": 50,
  "leftKnee": 90,
  "leftAnkle": -35,
  "rightHip": 70,
  "rightKnee": 80,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 8,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch 8° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 8,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 113,
    "shoulder_sagittal_flexion_deg": -161.7,
    "elbow_flexion_deg": 64.4,
    "forearm_forward_deg": 113,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~113° (lateral); shoulder extended ~162° behind; elbow bent ~64°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 3,
    "shoulder_sagittal_flexion_deg": -7.4,
    "elbow_flexion_deg": 4.5,
    "forearm_forward_deg": -4.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": 111.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 78.8,
    "foot_forward_deg": -153.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee ~right-angle (79°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.323,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.391,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.046,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.323,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
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
      "value": -161.7,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~113° (lateral); shoulder extended ~162° behind; elbow bent ~64°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 112.49259 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 8° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~113° (lateral); shoulder extended ~162° behind; elbow bent ~64°.
- R arm: Right arm: arm at side; elbow straight.
- L leg: Left leg: thigh near neutral; knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-161.7,"band":[-60,180],"ctx":"Left arm: arm abducted ~113° (lateral); shoulder extended ~162° behind; elbow bent ~64°.","verdict":"outside_band_review"}]