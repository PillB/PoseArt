# Forensic Baseline — p11-armchair-s7-lean-back-arm-behind-head
- name: Armchair Lean Back Arm Behind Head
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on the edge or front of the armchair, lean the torso back against the chair's arm or side, raise one hand behind the head, the other hand resting on the armrest. Extend one leg out along the floor while the other stays bent.
- tip: Let the head tilt back into the raised hand for genuine relaxation rather than holding the neck stiffly upright.

## Raw joint config
```json
{
  "spine": 20,
  "neck": -22,
  "hips": -8,
  "globalTilt": -28,
  "globalRoll": -10,
  "globalTwist": 15,
  "leftShoulder": -136,
  "rightShoulder": -35,
  "leftElbow": 35,
  "rightElbow": 83,
  "shoulderFwdL": 5,
  "shoulderFwdR": 15,
  "leftHip": 60,
  "rightHip": 90,
  "leftKnee": 20,
  "rightKnee": 95,
  "leftAnkle": 10,
  "rightAnkle": -5,
  "hipAbductL": -10,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -0.7,
    "yaw_deg": 0,
    "roll_deg": -11.6,
    "description": "Head pitch -1° (+: forward/down), roll -12° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -7.8,
    "lateral_flexion_deg": 7.9,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion -8° (+: forward), lateral 8° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": 25.9,
    "list_deg": -16.2,
    "yaw_deg": 10.9,
    "description": "Pelvic list -16° (+: left hip lower), yaw 11°, anterior/posterior tilt proxy 26° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 153.1,
    "shoulder_sagittal_flexion_deg": -138.4,
    "elbow_flexion_deg": 17.4,
    "forearm_forward_deg": -156.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~153° abduction); shoulder extended ~138° behind; elbow bent ~17°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 32.8,
    "shoulder_sagittal_flexion_deg": -27.5,
    "elbow_flexion_deg": 69.2,
    "forearm_forward_deg": 63.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~33°; shoulder extended ~28° behind; elbow bent ~69°."
  },
  "left_leg": {
    "hip_flexion_deg": 88.6,
    "hip_abduction_deg": 67.7,
    "knee_flexion_deg": 19.3,
    "foot_forward_deg": 173.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~89° (hip flexion); abducted ~68° outward; knee bent ~19°."
  },
  "right_leg": {
    "hip_flexion_deg": 116.5,
    "hip_abduction_deg": 149.2,
    "knee_flexion_deg": 94.7,
    "foot_forward_deg": -98.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~116° (hip flexion); abducted ~149° outward; knee ~right-angle (95°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.342,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.578,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.049,
    "com_z": -0.099,
    "foot_x_range": [
      -0.196,
      0.209
    ],
    "over_support": true,
    "feet_min_y": 0.342,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "R"
    },
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -138.4,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~153° abduction); shoulder extended ~138° behind; elbow bent ~17°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 98.99550000000008 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -8° (+: forward), lateral 8° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch -1° (+: forward/down), roll -12° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -16° (+: left hip lower), yaw 11°, anterior/posterior tilt proxy 26° (low confidence).
- L arm: Left arm: arm overhead (~153° abduction); shoulder extended ~138° behind; elbow bent ~17°.
- R arm: Right arm: arm abducted ~33°; shoulder extended ~28° behind; elbow bent ~69°.
- L leg: Left leg: thigh forward ~89° (hip flexion); abducted ~68° outward; knee bent ~19°.
- R leg: Right leg: thigh forward ~116° (hip flexion); abducted ~149° outward; knee ~right-angle (95°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-138.4,"band":[-60,180],"ctx":"Left arm: arm overhead (~153° abduction); shoulder extended ~138° behind; elbow bent ~17°.","verdict":"outside_band_review"}]