# Forensic Baseline — p11-armchair-s9-standing-front-hands-armrests
- name: Armchair Standing Front Hands on Armrests
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Stand in front of the chair facing camera, lean forward slightly and place both hands on the armrests, weight shifted onto the balls of the feet, one knee softly bent, chest lifted, direct gaze.
- tip: Keep the weight forward through the balanced arms so the pose looks grounded and intentional, not off-balance.

## Raw joint config
```json
{
  "spine": 10,
  "neck": -9,
  "hips": 16,
  "globalTilt": 12,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -55,
  "rightShoulder": -67,
  "leftElbow": 95,
  "rightElbow": 95,
  "shoulderFwdL": 20,
  "shoulderFwdR": 20,
  "leftHip": 8,
  "rightHip": 12,
  "leftKnee": 10,
  "rightKnee": 18,
  "leftAnkle": 0,
  "rightAnkle": -5,
  "hipAbductL": 5,
  "hipAbductR": 5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 22.1,
    "yaw_deg": 0,
    "roll_deg": -9.6,
    "description": "Head pitch 22° (+: forward/down), roll -10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 22,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 22° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -11.3,
    "list_deg": 15.1,
    "yaw_deg": -3.3,
    "description": "Pelvic list 15° (+: left hip lower), yaw -3°, anterior/posterior tilt proxy -11° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 83.4,
    "shoulder_sagittal_flexion_deg": -79.1,
    "elbow_flexion_deg": 91.7,
    "forearm_forward_deg": 62.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~83° (lateral); shoulder extended ~79° behind; elbow ~right-angle (92°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 96.8,
    "shoulder_sagittal_flexion_deg": -102.3,
    "elbow_flexion_deg": 94.8,
    "forearm_forward_deg": 75.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~97° (lateral); shoulder extended ~102° behind; elbow ~right-angle (95°)."
  },
  "left_leg": {
    "hip_flexion_deg": -4,
    "hip_abduction_deg": -21,
    "knee_flexion_deg": 9.6,
    "foot_forward_deg": 64.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 11,
    "knee_flexion_deg": 18,
    "foot_forward_deg": 69.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee bent ~18°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.829,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.781,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.149,
    "foot_x_range": [
      0.186,
      0.362
    ],
    "over_support": false,
    "feet_min_y": -0.829,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -79.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~83° (lateral); shoulder extended ~79° behind; elbow ~right-angle (92°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -102.3,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~97° (lateral); shoulder extended ~102° behind; elbow ~right-angle (95°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49363999999979 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 22° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 22° (+: forward/down), roll -10° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 15° (+: left hip lower), yaw -3°, anterior/posterior tilt proxy -11° (low confidence).
- L arm: Left arm: arm abducted ~83° (lateral); shoulder extended ~79° behind; elbow ~right-angle (92°).
- R arm: Right arm: arm abducted ~97° (lateral); shoulder extended ~102° behind; elbow ~right-angle (95°).
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee bent ~18°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-79.1,"band":[-60,180],"ctx":"Left arm: arm abducted ~83° (lateral); shoulder extended ~79° behind; elbow ~right-angle (92°).","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-102.3,"band":[-60,180],"ctx":"Right arm: arm abducted ~97° (lateral); shoulder extended ~102° behind; elbow ~right-angle (95°).","verdict":"outside_band_review"}]