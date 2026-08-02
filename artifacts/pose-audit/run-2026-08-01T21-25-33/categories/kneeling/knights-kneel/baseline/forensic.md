# Forensic Baseline — knights-kneel
- name: Knight's Kneel
- category: kneeling | difficulty: Beginner | angle: 3/4 View
- instructions: Plant the right foot flat on the floor with the knee bent at 90°, then lower the left knee directly to the ground beneath the left hip — shin trailing behind you, not splayed out. Sit tall through the spine, roll the shoulders back to open the chest, and rest the right forearm or hand lightly on the right thigh just above the knee. Keep the pelvis level and avoid sinking into the hip of the down leg.
- tip: Stack the front shin vertically — if the front foot drifts forward past the knee, the pose collapses. Check that the down-knee lands directly below the hip, not behind it, to keep the torso from leaning backward.

## Raw joint config
```json
{
  "spine": -3,
  "neck": -5,
  "leftShoulder": -10,
  "leftElbow": 70,
  "rightShoulder": 8,
  "rightElbow": 50,
  "leftHip": 80,
  "leftKnee": 90,
  "leftAnkle": -35,
  "rightHip": 0,
  "rightKnee": 10,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -3,
    "yaw_deg": 0,
    "roll_deg": -5,
    "description": "Head pitch -3° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -3,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -3° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 32.9,
    "shoulder_sagittal_flexion_deg": 3.3,
    "elbow_flexion_deg": 35.5,
    "forearm_forward_deg": 29.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~33°; elbow bent ~35°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 14.9,
    "shoulder_sagittal_flexion_deg": 2.9,
    "elbow_flexion_deg": 12.3,
    "forearm_forward_deg": 11.5,
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
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 10.2,
    "foot_forward_deg": 66.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
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
      "y": -0.84,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.017,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.84,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 106.50012000000014 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -3° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -3° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~33°; elbow bent ~35°.
- R arm: Right arm: arm at side; elbow straight.
- L leg: Left leg: thigh forward ~80° (hip flexion); knee ~right-angle (89°).
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM over foot support base. (floating=false)