# Forensic Baseline — p04-wall-w7-back-against-wall-buttocks-touching-facing
- name: Wall Back Against Wall Buttocks Touching Facing Camera
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Lean with the back against the wall, one leg straight and the other bent. Arch the back with the buttocks touching the wall, bend the arms with one on the wall and the other touching the wrist, facing the camera.
- tip: Keep the buttocks lightly touching the wall as an anchor point while pushing the chest forward for the arch.

## Raw joint config
```json
{
  "spine": -22,
  "neck": -6,
  "hips": -6,
  "globalTilt": -12,
  "globalRoll": 0,
  "globalTwist": 0,
  "leftShoulder": -140,
  "rightShoulder": -45,
  "leftElbow": 30,
  "rightElbow": 65,
  "shoulderFwdL": 2,
  "shoulderFwdR": 10,
  "leftHip": 5,
  "rightHip": 20,
  "leftKnee": 5,
  "rightKnee": 40,
  "leftAnkle": 5,
  "rightAnkle": 5,
  "hipAbductL": 5,
  "hipAbductR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -34.1,
    "yaw_deg": 0,
    "roll_deg": -6.7,
    "description": "Head pitch -34° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -34,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -34° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 11.7,
    "list_deg": -5.8,
    "yaw_deg": -1.2,
    "description": "Pelvic list -6° (+: left hip lower), yaw -1°, anterior/posterior tilt proxy 12° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 164.5,
    "shoulder_sagittal_flexion_deg": 171.6,
    "elbow_flexion_deg": 11.8,
    "forearm_forward_deg": 165.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~165° abduction); shoulder flexed ~172° forward; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 73,
    "shoulder_sagittal_flexion_deg": 41.6,
    "elbow_flexion_deg": 61.2,
    "forearm_forward_deg": 80.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~73° (lateral); shoulder flexed ~42° forward; elbow bent ~61°."
  },
  "left_leg": {
    "hip_flexion_deg": 17,
    "hip_abduction_deg": 1,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 83.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~17°; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 32,
    "hip_abduction_deg": 4.7,
    "knee_flexion_deg": 40,
    "foot_forward_deg": 133.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~32°; knee bent ~40°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.755,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.359,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.209,
    "foot_x_range": [
      -0.193,
      0.227
    ],
    "over_support": true,
    "feet_min_y": -0.755,
    "floating": false,
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
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.99412000000001 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -34° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -34° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -6° (+: left hip lower), yaw -1°, anterior/posterior tilt proxy 12° (low confidence).
- L arm: Left arm: arm overhead (~165° abduction); shoulder flexed ~172° forward; elbow straight.
- R arm: Right arm: arm abducted ~73° (lateral); shoulder flexed ~42° forward; elbow bent ~61°.
- L leg: Left leg: thigh forward ~17°; knee straight.
- R leg: Right leg: thigh forward ~32°; knee bent ~40°.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]