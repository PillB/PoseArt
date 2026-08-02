# Forensic Baseline — p17-tubes-s7-kneel-drape-tall-tube-leg-back
- name: Kneeling Drape Over Tall Tube with Leg Extended
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Kneel on one knee draped over a tall tube, planting one hand on its surface for balance. Extend the other leg back long, resting the foot on a shorter tube behind you. Turn the torso into profile and gaze toward camera over the shoulder.
- tip: Point the extended back foot and lift slightly off the shorter tube for a longer, more elegant leg line.

## Raw joint config
```json
{
  "spine": -10,
  "neck": -25,
  "hips": 10,
  "globalTilt": 25,
  "globalRoll": 15,
  "globalTwist": 45,
  "leftShoulder": -30,
  "rightShoulder": -10,
  "leftElbow": 45,
  "rightElbow": 30,
  "shoulderFwdL": 20,
  "shoulderFwdR": 5,
  "leftHip": 115,
  "rightHip": 20,
  "leftKnee": 120,
  "rightKnee": 12,
  "leftAnkle": 10,
  "rightAnkle": 8,
  "hipAbductL": -15,
  "hipAbductR": 5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 28.9,
    "yaw_deg": 0,
    "roll_deg": -23.9,
    "description": "Head pitch 29° (+: forward/down), roll -24° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 10.6,
    "lateral_flexion_deg": -4.3,
    "axial_rotation_deg": 35.3,
    "description": "Torso flexion 11° (+: forward), lateral -4° (+: figure's right), axial rotation proxy 35°."
  },
  "pelvis": {
    "tilt_deg": -22.6,
    "list_deg": 19.1,
    "yaw_deg": 32.8,
    "description": "Pelvic list 19° (+: left hip lower), yaw 33°, anterior/posterior tilt proxy -23° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 44.3,
    "shoulder_sagittal_flexion_deg": 24.5,
    "elbow_flexion_deg": 35.9,
    "forearm_forward_deg": 34.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~44°; shoulder flexed ~24° forward; elbow bent ~36°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 30.1,
    "shoulder_sagittal_flexion_deg": -38.4,
    "elbow_flexion_deg": 17.1,
    "forearm_forward_deg": -19.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~30°; shoulder extended ~38° behind; elbow bent ~17°."
  },
  "left_leg": {
    "hip_flexion_deg": 102.3,
    "hip_abduction_deg": -105,
    "knee_flexion_deg": 119.6,
    "foot_forward_deg": -65.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~102° (hip flexion); knee deeply bent (~120°)."
  },
  "right_leg": {
    "hip_flexion_deg": -7.3,
    "hip_abduction_deg": 15,
    "knee_flexion_deg": 12.3,
    "foot_forward_deg": 78.8,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~15° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.344,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.725,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": -0.018,
    "com_z": 0.096,
    "foot_x_range": [
      -0.218,
      0.534
    ],
    "over_support": true,
    "feet_min_y": -0.725,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "L"
    }
  ],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.99100000000004 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 11° (+: forward), lateral -4° (+: figure's right), axial rotation proxy 35°.
- Head: Head pitch 29° (+: forward/down), roll -24° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 19° (+: left hip lower), yaw 33°, anterior/posterior tilt proxy -23° (low confidence).
- L arm: Left arm: arm abducted ~44°; shoulder flexed ~24° forward; elbow bent ~36°.
- R arm: Right arm: arm abducted ~30°; shoulder extended ~38° behind; elbow bent ~17°.
- L leg: Left leg: thigh forward ~102° (hip flexion); knee deeply bent (~120°).
- R leg: Right leg: thigh near neutral; abducted ~15° outward; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"}]