# Forensic Baseline — p11-armchair-s10-floor-recline-head-on-armrest
- name: Floor Recline Head Resting on Armrest
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Recline on the floor in front of the chair, use the armrest as a headrest, arch the back gently, one arm raised overhead resting near the hair, the other hand resting on the floor or hip. Extend both legs, one bent, one straight.
- tip: Let the head tip fully back into the armrest for a genuine, weightless look — avoid straining the neck to look at camera.

## Raw joint config
```json
{
  "spine": -18,
  "hips": -12,
  "neck": -28,
  "leftShoulder": -10,
  "rightShoulder": -40,
  "leftElbow": 35,
  "rightElbow": 80,
  "hipAbductL": 5,
  "hipAbductR": 10,
  "leftHip": 30,
  "rightHip": 95,
  "leftKnee": 15,
  "rightKnee": 105,
  "leftAnkle": 8,
  "rightAnkle": -10,
  "shoulderFwdL": 10,
  "shoulderFwdR": 10,
  "globalTilt": -45,
  "globalTwist": 10,
  "globalRoll": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -59.6,
    "yaw_deg": 0,
    "roll_deg": -52.1,
    "description": "Head pitch -60° (+: forward/down), roll -52° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -62,
    "lateral_flexion_deg": -13.8,
    "axial_rotation_deg": 9.9,
    "description": "Torso flexion -62° (+: forward), lateral -14° (+: figure's right), axial rotation proxy 10°."
  },
  "pelvis": {
    "tilt_deg": 35.7,
    "list_deg": -13.1,
    "yaw_deg": 1.4,
    "description": "Pelvic list -13° (+: left hip lower), yaw 1°, anterior/posterior tilt proxy 36° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 51.1,
    "shoulder_sagittal_flexion_deg": 63.6,
    "elbow_flexion_deg": 21.7,
    "forearm_forward_deg": 76.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~51°; shoulder flexed ~64° forward; elbow bent ~22°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 72.8,
    "shoulder_sagittal_flexion_deg": 38.5,
    "elbow_flexion_deg": 71.1,
    "forearm_forward_deg": 107.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~73° (lateral); shoulder flexed ~39° forward; elbow bent ~71°."
  },
  "left_leg": {
    "hip_flexion_deg": 74.9,
    "hip_abduction_deg": -5.3,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 154.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~75° (hip flexion); knee bent ~15°."
  },
  "right_leg": {
    "hip_flexion_deg": 138.3,
    "hip_abduction_deg": -164.5,
    "knee_flexion_deg": 93.5,
    "foot_forward_deg": -67.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~138° (hip flexion); knee ~right-angle (94°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.082,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.452,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.045,
    "com_z": -0.373,
    "foot_x_range": [
      -0.313,
      -0.019
    ],
    "over_support": true,
    "feet_min_y": 0.082,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "R"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "right_hip_flexion",
      "value": 138.3,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~138° (hip flexion); knee ~right-angle (94°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 99.9955000000004 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -62° (+: forward), lateral -14° (+: figure's right), axial rotation proxy 10°.
- Head: Head pitch -60° (+: forward/down), roll -52° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -13° (+: left hip lower), yaw 1°, anterior/posterior tilt proxy 36° (low confidence).
- L arm: Left arm: arm abducted ~51°; shoulder flexed ~64° forward; elbow bent ~22°.
- R arm: Right arm: arm abducted ~73° (lateral); shoulder flexed ~39° forward; elbow bent ~71°.
- L leg: Left leg: thigh forward ~75° (hip flexion); knee bent ~15°.
- R leg: Right leg: thigh forward ~138° (hip flexion); knee ~right-angle (94°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"right_hip_flexion","value":138.3,"band":[-30,130],"ctx":"Right leg: thigh forward ~138° (hip flexion); knee ~right-angle (94°).","verdict":"outside_band_review"}]