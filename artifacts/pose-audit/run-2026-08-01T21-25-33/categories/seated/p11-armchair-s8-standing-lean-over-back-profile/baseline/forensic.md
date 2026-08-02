# Forensic Baseline — p11-armchair-s8-standing-lean-over-back-profile
- name: Armchair Standing Lean Over Back Profile
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Stand behind the armchair in profile, lean the torso forward over the top of the chair back, both hands resting flat on top of the backrest, hips pushed back slightly, head turned to camera.
- tip: Push the hips back as the torso leans forward to create a long, elegant line from shoulders to heels.

## Raw joint config
```json
{
  "spine": 18,
  "neck": -5.5,
  "hips": 20,
  "globalTilt": 25,
  "globalRoll": 0,
  "globalTwist": 35,
  "leftShoulder": -70,
  "rightShoulder": -82,
  "leftElbow": 35,
  "rightElbow": 15,
  "shoulderFwdL": 35,
  "shoulderFwdR": 25,
  "leftHip": 15,
  "rightHip": 12,
  "leftKnee": 8,
  "rightKnee": 8,
  "leftAnkle": 0,
  "rightAnkle": 0,
  "hipAbductL": 5,
  "hipAbductR": 5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 40,
    "yaw_deg": 0,
    "roll_deg": 23.4,
    "description": "Head pitch 40° (+: forward/down), roll 23° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 37.4,
    "lateral_flexion_deg": 28.1,
    "axial_rotation_deg": 29.8,
    "description": "Torso flexion 37° (+: forward), lateral 28° (+: figure's right), axial rotation proxy 30°."
  },
  "pelvis": {
    "tilt_deg": -27.5,
    "list_deg": 17.2,
    "yaw_deg": 22.8,
    "description": "Pelvic list 17° (+: left hip lower), yaw 23°, anterior/posterior tilt proxy -28° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 113.4,
    "shoulder_sagittal_flexion_deg": -152.5,
    "elbow_flexion_deg": 34.8,
    "forearm_forward_deg": 113,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~113° (lateral); shoulder extended ~153° behind; elbow bent ~35°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 148.6,
    "shoulder_sagittal_flexion_deg": -122.6,
    "elbow_flexion_deg": 14.6,
    "forearm_forward_deg": -117.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~149° abduction); shoulder extended ~123° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": -22.6,
    "hip_abduction_deg": -16,
    "knee_flexion_deg": 7.7,
    "foot_forward_deg": 45,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh extended ~23° behind; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -19.1,
    "hip_abduction_deg": 5.3,
    "knee_flexion_deg": 8.2,
    "foot_forward_deg": 42.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~19° behind; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.824,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.812,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0.158,
    "com_z": 0.226,
    "foot_x_range": [
      0.22,
      0.376
    ],
    "over_support": false,
    "feet_min_y": -0.824,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
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
      "value": -152.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~113° (lateral); shoulder extended ~153° behind; elbow bent ~35°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -122.6,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~149° abduction); shoulder extended ~123° behind; elbow straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.50164999999978 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 37° (+: forward), lateral 28° (+: figure's right), axial rotation proxy 30°.
- Head: Head pitch 40° (+: forward/down), roll 23° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 17° (+: left hip lower), yaw 23°, anterior/posterior tilt proxy -28° (low confidence).
- L arm: Left arm: arm abducted ~113° (lateral); shoulder extended ~153° behind; elbow bent ~35°.
- R arm: Right arm: arm overhead (~149° abduction); shoulder extended ~123° behind; elbow straight.
- L leg: Left leg: thigh extended ~23° behind; knee straight.
- R leg: Right leg: thigh extended ~19° behind; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-152.5,"band":[-60,180],"ctx":"Left arm: arm abducted ~113° (lateral); shoulder extended ~153° behind; elbow bent ~35°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-122.6,"band":[-60,180],"ctx":"Right arm: arm overhead (~149° abduction); shoulder extended ~123° behind; elbow straight.","verdict":"outside_band_review"}]