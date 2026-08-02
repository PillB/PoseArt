# Forensic Baseline — p01-master-s4-chair-chin-touch
- name: Chair Sit Knees Crossed Hand to Chin
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit in the chair with both knees bent and crossed, toes pointed. Rest one hand on the armrest and bring the other hand up to lightly touch the chin. Drop shoulders and look straight at the camera.
- tip: Angle the wrist so the hand frames rather than covers the jawline, keeping the face open to the light.

## Raw joint config
```json
{
  "spine": 5,
  "neck": -3.3,
  "hips": 0,
  "globalTilt": 5,
  "globalRoll": 3,
  "globalTwist": 6,
  "leftShoulder": -30,
  "rightShoulder": -130,
  "leftElbow": 95,
  "rightElbow": 35,
  "shoulderFwdL": 8,
  "shoulderFwdR": 18,
  "leftHip": 90,
  "rightHip": 95,
  "leftKnee": 110,
  "rightKnee": 105,
  "leftAnkle": 6,
  "rightAnkle": 6,
  "hipAbductL": -6,
  "hipAbductR": -6
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 10.3,
    "yaw_deg": 0,
    "roll_deg": -5.3,
    "description": "Head pitch 10° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 10,
    "lateral_flexion_deg": -1.9,
    "axial_rotation_deg": 6,
    "description": "Torso flexion 10° (+: forward), lateral -2° (+: figure's right), axial rotation proxy 6°."
  },
  "pelvis": {
    "tilt_deg": -5,
    "list_deg": 3,
    "yaw_deg": 6,
    "description": "Pelvic list 3° (+: left hip lower), yaw 6°, anterior/posterior tilt proxy -5° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 50.9,
    "shoulder_sagittal_flexion_deg": -14.3,
    "elbow_flexion_deg": 70.8,
    "forearm_forward_deg": 45.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~51°; elbow bent ~71°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 159.6,
    "shoulder_sagittal_flexion_deg": -168.9,
    "elbow_flexion_deg": 16.9,
    "forearm_forward_deg": 174.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~160° abduction); shoulder extended ~169° behind; elbow bent ~17°."
  },
  "left_leg": {
    "hip_flexion_deg": 85,
    "hip_abduction_deg": -2.7,
    "knee_flexion_deg": 109.5,
    "foot_forward_deg": -102.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (109°)."
  },
  "right_leg": {
    "hip_flexion_deg": 90.6,
    "hip_abduction_deg": 93,
    "knee_flexion_deg": 104.5,
    "foot_forward_deg": -102.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~91° (hip flexion); abducted ~93° outward; knee ~right-angle (105°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.439,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.498,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.016,
    "com_z": 0.067,
    "foot_x_range": [
      -0.271,
      0.26
    ],
    "over_support": true,
    "feet_min_y": 0.439,
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
      "value": -168.9,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~160° abduction); shoulder extended ~169° behind; elbow bent ~17°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49399999999987 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 10° (+: forward), lateral -2° (+: figure's right), axial rotation proxy 6°.
- Head: Head pitch 10° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 3° (+: left hip lower), yaw 6°, anterior/posterior tilt proxy -5° (low confidence).
- L arm: Left arm: arm abducted ~51°; elbow bent ~71°.
- R arm: Right arm: arm overhead (~160° abduction); shoulder extended ~169° behind; elbow bent ~17°.
- L leg: Left leg: thigh forward ~85° (hip flexion); knee ~right-angle (109°).
- R leg: Right leg: thigh forward ~91° (hip flexion); abducted ~93° outward; knee ~right-angle (105°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-168.9,"band":[-60,180],"ctx":"Right arm: arm overhead (~160° abduction); shoulder extended ~169° behind; elbow bent ~17°.","verdict":"outside_band_review"}]