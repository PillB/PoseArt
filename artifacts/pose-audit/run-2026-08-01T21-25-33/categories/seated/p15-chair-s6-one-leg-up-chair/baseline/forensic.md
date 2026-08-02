# Forensic Baseline — p15-chair-s6-one-leg-up-chair
- name: Chair One Foot Up on Seat
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Sit on the chair, plant one foot flat on the seat with the knee bent up high, wrap both arms loosely around the raised shin, letting the other leg extend or rest on the floor. Lean torso slightly toward the raised knee, gaze to camera.
- tip: Keep the standing/extended leg engaged and pointed so the pose reads as intentional rather than collapsed.

## Raw joint config
```json
{
  "spine": 15,
  "neck": -5.5,
  "hips": 12,
  "globalTilt": 10,
  "globalRoll": 12,
  "globalTwist": 15,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 100,
  "rightElbow": 100,
  "shoulderFwdL": 25,
  "shoulderFwdR": 25,
  "leftHip": 118,
  "rightHip": 55,
  "leftKnee": 135,
  "rightKnee": 60,
  "leftAnkle": -10,
  "rightAnkle": 5,
  "hipAbductL": 15,
  "hipAbductR": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 26,
    "yaw_deg": 0,
    "roll_deg": -10.7,
    "description": "Head pitch 26° (+: forward/down), roll -11° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 24.2,
    "lateral_flexion_deg": -5.1,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion 24° (+: forward), lateral -5° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": -12.3,
    "list_deg": 21.7,
    "yaw_deg": 12.3,
    "description": "Pelvic list 22° (+: left hip lower), yaw 12°, anterior/posterior tilt proxy -12° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 128.4,
    "shoulder_sagittal_flexion_deg": -158.5,
    "elbow_flexion_deg": 71,
    "forearm_forward_deg": 119.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~128° abduction); shoulder extended ~159° behind; elbow bent ~71°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 162.8,
    "shoulder_sagittal_flexion_deg": -147.8,
    "elbow_flexion_deg": 71,
    "forearm_forward_deg": 136.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~163° abduction); shoulder extended ~148° behind; elbow bent ~71°."
  },
  "left_leg": {
    "hip_flexion_deg": 120.1,
    "hip_abduction_deg": -124.7,
    "knee_flexion_deg": 108.8,
    "foot_forward_deg": -69,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~120° (hip flexion); knee ~right-angle (109°)."
  },
  "right_leg": {
    "hip_flexion_deg": 45.8,
    "hip_abduction_deg": 40.8,
    "knee_flexion_deg": 58.9,
    "foot_forward_deg": 169.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~46°; abducted ~41° outward; knee bent ~59°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.311,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.13,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.046,
    "com_z": 0.155,
    "foot_x_range": [
      0.175,
      0.541
    ],
    "over_support": false,
    "feet_min_y": 0.13,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
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
      "value": -158.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~128° abduction); shoulder extended ~159° behind; elbow bent ~71°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -147.8,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm overhead (~163° abduction); shoulder extended ~148° behind; elbow bent ~71°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49409000000006 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 24° (+: forward), lateral -5° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch 26° (+: forward/down), roll -11° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 22° (+: left hip lower), yaw 12°, anterior/posterior tilt proxy -12° (low confidence).
- L arm: Left arm: arm overhead (~128° abduction); shoulder extended ~159° behind; elbow bent ~71°.
- R arm: Right arm: arm overhead (~163° abduction); shoulder extended ~148° behind; elbow bent ~71°.
- L leg: Left leg: thigh forward ~120° (hip flexion); knee ~right-angle (109°).
- R leg: Right leg: thigh forward ~46°; abducted ~41° outward; knee bent ~59°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-158.5,"band":[-60,180],"ctx":"Left arm: arm overhead (~128° abduction); shoulder extended ~159° behind; elbow bent ~71°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-147.8,"band":[-60,180],"ctx":"Right arm: arm overhead (~163° abduction); shoulder extended ~148° behind; elbow bent ~71°.","verdict":"outside_band_review"}]