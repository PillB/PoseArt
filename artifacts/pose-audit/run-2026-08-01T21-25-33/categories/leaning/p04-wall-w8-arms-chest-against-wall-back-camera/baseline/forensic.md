# Forensic Baseline — p04-wall-w8-arms-chest-against-wall-back-camera
- name: Wall Chest Against Wall Back to Camera
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Lean with the arms and chest against the wall, back facing the camera. Cross the legs at the shin, arch the back, bend the arms with one on the wall and the other touching the wrist, face turned to the side.
- tip: Press the chest lightly into the wall while keeping the crossed legs relaxed for balance.

## Raw joint config
```json
{
  "spine": -18,
  "neck": 25,
  "hips": 8,
  "globalTilt": 10,
  "globalRoll": 0,
  "globalTwist": -60,
  "leftShoulder": -50,
  "rightShoulder": -60,
  "leftElbow": 55,
  "rightElbow": 65,
  "shoulderFwdL": 5,
  "shoulderFwdR": 15,
  "leftHip": 10,
  "rightHip": 15,
  "leftKnee": 10,
  "rightKnee": 15,
  "leftAnkle": 6,
  "rightAnkle": 6,
  "hipAbductL": 5,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 16.7,
    "yaw_deg": 0,
    "roll_deg": 20.4,
    "description": "Head pitch 17° (+: forward/down), roll 20° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -4,
    "lateral_flexion_deg": 6.9,
    "axial_rotation_deg": -40.9,
    "description": "Torso flexion -4° (+: forward), lateral 7° (+: figure's right), axial rotation proxy -41°."
  },
  "pelvis": {
    "tilt_deg": 2,
    "list_deg": 7.8,
    "yaw_deg": -41,
    "description": "Pelvic list 8° (+: left hip lower), yaw -41°, anterior/posterior tilt proxy 2° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 63.8,
    "shoulder_sagittal_flexion_deg": -68.1,
    "elbow_flexion_deg": 53.1,
    "forearm_forward_deg": 11.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~64° (lateral); shoulder extended ~68° behind; elbow bent ~53°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 77.8,
    "shoulder_sagittal_flexion_deg": 83.1,
    "elbow_flexion_deg": 64.8,
    "forearm_forward_deg": 68.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~78° (lateral); shoulder flexed ~83° forward; elbow bent ~65°."
  },
  "left_leg": {
    "hip_flexion_deg": 11.3,
    "hip_abduction_deg": -6.6,
    "knee_flexion_deg": 10.1,
    "foot_forward_deg": 63.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 13.7,
    "hip_abduction_deg": 2.3,
    "knee_flexion_deg": 14.9,
    "foot_forward_deg": 78.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.827,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.756,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0.022,
    "com_z": -0.013,
    "foot_x_range": [
      -0.189,
      -0.063
    ],
    "over_support": false,
    "feet_min_y": -0.827,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -68.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~64° (lateral); shoulder extended ~68° behind; elbow bent ~53°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.99699999999962 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -4° (+: forward), lateral 7° (+: figure's right), axial rotation proxy -41°.
- Head: Head pitch 17° (+: forward/down), roll 20° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 8° (+: left hip lower), yaw -41°, anterior/posterior tilt proxy 2° (low confidence).
- L arm: Left arm: arm abducted ~64° (lateral); shoulder extended ~68° behind; elbow bent ~53°.
- R arm: Right arm: arm abducted ~78° (lateral); shoulder flexed ~83° forward; elbow bent ~65°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-68.1,"band":[-60,180],"ctx":"Left arm: arm abducted ~64° (lateral); shoulder extended ~68° behind; elbow bent ~53°.","verdict":"outside_band_review"}]