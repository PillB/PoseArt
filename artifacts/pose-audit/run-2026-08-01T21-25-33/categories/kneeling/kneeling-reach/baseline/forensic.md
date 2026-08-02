# Forensic Baseline — kneeling-reach
- name: Kneeling Reach
- category: kneeling | difficulty: Advanced | angle: 3/4 View
- instructions: Sit back gently onto the heels with knees together and both hands folded in the lap. Keep the spine straight and the shoulders soft for a calm, meditative posture.
- tip: Relax the shoulders and soften the gaze — serenity is the entire point of this pose.

## Raw joint config
```json
{
  "spine": -5,
  "neck": -5,
  "leftShoulder": -90,
  "leftElbow": 70,
  "rightShoulder": 15,
  "rightElbow": 45,
  "leftHip": 80,
  "leftKnee": 90,
  "leftAnkle": -35,
  "rightHip": 80,
  "rightKnee": 90,
  "rightAnkle": -35,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -5,
    "yaw_deg": 0,
    "roll_deg": -5,
    "description": "Head pitch -5° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -5,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 112.9,
    "shoulder_sagittal_flexion_deg": 168.3,
    "elbow_flexion_deg": 64.4,
    "forearm_forward_deg": 111.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~113° (lateral); shoulder flexed ~168° forward; elbow bent ~64°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 7.9,
    "shoulder_sagittal_flexion_deg": 4.7,
    "elbow_flexion_deg": 7.7,
    "forearm_forward_deg": 7.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
  },
  "right_leg": {
    "hip_flexion_deg": 80,
    "hip_abduction_deg": -39,
    "knee_flexion_deg": 88.5,
    "foot_forward_deg": -168.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.524,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.029,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": 0.524,
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
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 105.74699999999993 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -5° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -5° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~113° (lateral); shoulder flexed ~168° forward; elbow bent ~64°.
- R arm: Right arm: arm at side; elbow straight.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]