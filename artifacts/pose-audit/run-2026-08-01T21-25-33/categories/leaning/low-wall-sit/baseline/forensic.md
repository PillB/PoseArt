# Forensic Baseline — low-wall-sit
- name: Low Wall Sit
- category: leaning | difficulty: Beginner | angle: Side
- instructions: Perch on a low ledge with feet planted on the ground, leaning the torso back to rest against a higher wall behind you. Rest both hands on the ledge beside the hips for support.
- tip: Bridging between two surfaces creates a naturally supported lean that never looks posed.

## Raw joint config
```json
{
  "spine": 12,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "leftElbow": 70,
  "rightElbow": 50,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftKnee": 85,
  "rightKnee": 85,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 12.1,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 12° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 12,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 33.4,
    "shoulder_sagittal_flexion_deg": -12.5,
    "elbow_flexion_deg": 36.5,
    "forearm_forward_deg": 26.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~33°; elbow bent ~37°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 16.2,
    "shoulder_sagittal_flexion_deg": -10.1,
    "elbow_flexion_deg": 13.6,
    "forearm_forward_deg": 4.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~16°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -20,
    "knee_flexion_deg": 78,
    "foot_forward_deg": 127.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee ~right-angle (78°)."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 85,
    "foot_forward_deg": 126.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee ~right-angle (85°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.322,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.308,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.069,
    "foot_x_range": [
      0.06,
      0.281
    ],
    "over_support": false,
    "feet_min_y": -0.322,
    "floating": true,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 101.99403000000031 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 12° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 12° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~33°; elbow bent ~37°.
- R arm: Right arm: arm abducted ~16°; elbow straight.
- L leg: Left leg: thigh near neutral; knee ~right-angle (78°).
- R leg: Right leg: thigh near neutral; knee ~right-angle (85°).
- Balance: COM outside foot support base (balance risk). (floating=true)