# Forensic Baseline — p10-bench-s9-seated-head-tilt-back
- name: Seated One Leg Up, Head Tilted Back
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on the bench with one leg bent and placed up on the bench surface and the other foot on the floor. Tilt the head back and raise one hand up into the hair. Let the other hand rest on the raised knee.
- tip: Drop the shoulders down away from the ears even as the head tilts back, to keep the neckline looking relaxed instead of strained.

## Raw joint config
```json
{
  "spine": -12,
  "neck": 15.4,
  "hips": 0,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 100,
  "rightElbow": 81,
  "shoulderFwdL": 20,
  "shoulderFwdR": 20,
  "leftHip": 92,
  "rightHip": 15,
  "leftKnee": 92,
  "rightKnee": 15,
  "leftAnkle": -5,
  "rightAnkle": 0,
  "hipAbductL": 15,
  "hipAbductR": -5,
  "globalTwist": -10,
  "globalRoll": 0,
  "globalTilt": -18
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -27.7,
    "yaw_deg": 0,
    "roll_deg": 22.3,
    "description": "Head pitch -28° (+: forward/down), roll 22° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -29.6,
    "lateral_flexion_deg": 5.7,
    "axial_rotation_deg": -9.9,
    "description": "Torso flexion -30° (+: forward), lateral 6° (+: figure's right), axial rotation proxy -10°."
  },
  "pelvis": {
    "tilt_deg": 16.9,
    "list_deg": 0,
    "yaw_deg": -9.9,
    "description": "Pelvic list 0° (+: left hip lower), yaw -10°, anterior/posterior tilt proxy 17° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 132.4,
    "shoulder_sagittal_flexion_deg": -147.6,
    "elbow_flexion_deg": 70.3,
    "forearm_forward_deg": 148,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~132° abduction); shoulder extended ~148° behind; elbow bent ~70°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 128.8,
    "shoulder_sagittal_flexion_deg": -167.5,
    "elbow_flexion_deg": 58.4,
    "forearm_forward_deg": 147.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~129° abduction); shoulder extended ~168° behind; elbow bent ~58°."
  },
  "left_leg": {
    "hip_flexion_deg": 109.4,
    "hip_abduction_deg": -163.6,
    "knee_flexion_deg": 87.3,
    "foot_forward_deg": -106.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~109° (hip flexion); knee ~right-angle (87°)."
  },
  "right_leg": {
    "hip_flexion_deg": 33.3,
    "hip_abduction_deg": -0.6,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 104.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~33°; knee bent ~15°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.6,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.557,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.035,
    "com_z": -0.199,
    "foot_x_range": [
      0.012,
      0.173
    ],
    "over_support": true,
    "feet_min_y": -0.557,
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
      "value": -147.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~132° abduction); shoulder extended ~148° behind; elbow bent ~70°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -167.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~129° abduction); shoulder extended ~168° behind; elbow bent ~58°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.74699999999993 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -30° (+: forward), lateral 6° (+: figure's right), axial rotation proxy -10°.
- Head: Head pitch -28° (+: forward/down), roll 22° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw -10°, anterior/posterior tilt proxy 17° (low confidence).
- L arm: Left arm: arm overhead (~132° abduction); shoulder extended ~148° behind; elbow bent ~70°.
- R arm: Right arm: arm overhead (~129° abduction); shoulder extended ~168° behind; elbow bent ~58°.
- L leg: Left leg: thigh forward ~109° (hip flexion); knee ~right-angle (87°).
- R leg: Right leg: thigh forward ~33°; knee bent ~15°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-147.6,"band":[-60,180],"ctx":"Left arm: arm overhead (~132° abduction); shoulder extended ~148° behind; elbow bent ~70°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-167.5,"band":[-60,180],"ctx":"Right arm: arm overhead (~129° abduction); shoulder extended ~168° behind; elbow bent ~58°.","verdict":"outside_band_review"}]