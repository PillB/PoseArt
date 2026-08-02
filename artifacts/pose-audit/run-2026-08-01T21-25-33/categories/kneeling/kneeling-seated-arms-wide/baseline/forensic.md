# Forensic Baseline — kneeling-seated-arms-wide
- name: Kneeling Seated Arms Wide
- category: kneeling | difficulty: Beginner | angle: Front
- instructions: Kneel on one knee and extend the opposite arm straight overhead, fingers reaching toward the ceiling. Let the gaze follow the hand upward, lengthening the whole side body.
- tip: Shoot from a low angle to exaggerate the verticality this kneeling reach creates.

## Raw joint config
```json
{
  "spine": 5,
  "leftShoulder": -90,
  "rightShoulder": -72,
  "leftElbow": 70,
  "rightElbow": 70,
  "rightHip": 70,
  "leftKnee": 85,
  "rightKnee": 85,
  "leftAnkle": -35,
  "rightAnkle": -35,
  "neck": -3.3,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 5,
    "yaw_deg": 0,
    "roll_deg": -3.3,
    "description": "Head pitch 5° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 5,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 112.9,
    "shoulder_sagittal_flexion_deg": -168.3,
    "elbow_flexion_deg": 64.4,
    "forearm_forward_deg": 112.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~113° (lateral); shoulder extended ~168° behind; elbow bent ~64°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 94.9,
    "shoulder_sagittal_flexion_deg": -136.7,
    "elbow_flexion_deg": 69.8,
    "forearm_forward_deg": 92.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~95° (lateral); shoulder extended ~137° behind; elbow bent ~70°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 83.6,
    "foot_forward_deg": 106.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee ~right-angle (84°)."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 83.6,
    "foot_forward_deg": 176.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee ~right-angle (84°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.371,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.422,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.029,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.371,
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
      "value": -168.3,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~113° (lateral); shoulder extended ~168° behind; elbow bent ~64°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -136.7,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~95° (lateral); shoulder extended ~137° behind; elbow bent ~70°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 105.7470000000001 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 5° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~113° (lateral); shoulder extended ~168° behind; elbow bent ~64°.
- R arm: Right arm: arm abducted ~95° (lateral); shoulder extended ~137° behind; elbow bent ~70°.
- L leg: Left leg: thigh near neutral; knee ~right-angle (84°).
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (84°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-168.3,"band":[-60,180],"ctx":"Left arm: arm abducted ~113° (lateral); shoulder extended ~168° behind; elbow bent ~64°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-136.7,"band":[-60,180],"ctx":"Right arm: arm abducted ~95° (lateral); shoulder extended ~137° behind; elbow bent ~70°.","verdict":"outside_band_review"}]