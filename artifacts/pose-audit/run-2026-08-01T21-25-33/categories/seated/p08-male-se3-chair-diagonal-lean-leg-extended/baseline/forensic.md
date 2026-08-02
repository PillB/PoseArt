# Forensic Baseline — p08-male-se3-chair-diagonal-lean-leg-extended
- name: Chair Diagonal Lean with Extended Leg
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on a chair and extend one leg forward with the foot on the floor. Raise one hand behind the head while the other rests on the thigh near the jeans. Lean the torso back diagonally against the chair, chin lifted, gaze to the side.
- tip: Let the torso's diagonal lean be supported by the chair back rather than the core, to keep the pose looking relaxed rather than strained.

## Raw joint config
```json
{
  "spine": 18,
  "neck": -12,
  "hips": -8,
  "globalTilt": 15,
  "globalRoll": 5,
  "globalTwist": 15,
  "leftShoulder": -136,
  "rightShoulder": -25,
  "leftElbow": 95,
  "rightElbow": 80,
  "shoulderFwdL": 10,
  "shoulderFwdR": 15,
  "leftHip": 40,
  "rightHip": 90,
  "leftKnee": 15,
  "rightKnee": 88,
  "leftAnkle": -10,
  "rightAnkle": -5,
  "hipAbductL": 5,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 35.2,
    "yaw_deg": 0,
    "roll_deg": -8.6,
    "description": "Head pitch 35° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 31.8,
    "lateral_flexion_deg": 4.5,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion 32° (+: forward), lateral 5° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": -11.9,
    "list_deg": -2.9,
    "yaw_deg": 16.2,
    "description": "Pelvic list -3° (+: left hip lower), yaw 16°, anterior/posterior tilt proxy -12° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 158.1,
    "shoulder_sagittal_flexion_deg": -178.8,
    "elbow_flexion_deg": 39.7,
    "forearm_forward_deg": 140.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~158° abduction); shoulder extended ~179° behind; elbow bent ~40°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 47.3,
    "shoulder_sagittal_flexion_deg": -59.1,
    "elbow_flexion_deg": 58.2,
    "forearm_forward_deg": 13.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~47°; shoulder extended ~59° behind; elbow bent ~58°."
  },
  "left_leg": {
    "hip_flexion_deg": 25.2,
    "hip_abduction_deg": -8.7,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 87.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~25°; knee bent ~15°."
  },
  "right_leg": {
    "hip_flexion_deg": 75.7,
    "hip_abduction_deg": 42.6,
    "knee_flexion_deg": 87.7,
    "foot_forward_deg": -146.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~76° (hip flexion); abducted ~43° outward; knee ~right-angle (88°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.652,
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
    "com_x": 0.02,
    "com_z": 0.204,
    "foot_x_range": [
      -0.006,
      0.19
    ],
    "over_support": true,
    "feet_min_y": -0.652,
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
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -178.8,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~158° abduction); shoulder extended ~179° behind; elbow bent ~40°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.7425 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 32° (+: forward), lateral 5° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch 35° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -3° (+: left hip lower), yaw 16°, anterior/posterior tilt proxy -12° (low confidence).
- L arm: Left arm: arm overhead (~158° abduction); shoulder extended ~179° behind; elbow bent ~40°.
- R arm: Right arm: arm abducted ~47°; shoulder extended ~59° behind; elbow bent ~58°.
- L leg: Left leg: thigh forward ~25°; knee bent ~15°.
- R leg: Right leg: thigh forward ~76° (hip flexion); abducted ~43° outward; knee ~right-angle (88°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-178.8,"band":[-60,180],"ctx":"Left arm: arm overhead (~158° abduction); shoulder extended ~179° behind; elbow bent ~40°.","verdict":"outside_band_review"}]