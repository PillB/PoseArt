# Forensic Baseline — p15-chair-s5-side-saddle-look-back
- name: Chair Side-Saddle Look Back
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit sideways on the chair with both legs together swept to one side. Twist the torso and head back toward the camera over the shoulder. One hand rests on the chair back or seat, the other on the thigh.
- tip: Lead the twist with the chest, not just the neck, for a natural spiral through the spine.

## Raw joint config
```json
{
  "spine": 6,
  "neck": -6.6,
  "hips": 0,
  "globalTilt": 0,
  "globalRoll": 5,
  "globalTwist": 58,
  "leftShoulder": -80,
  "rightShoulder": -50,
  "leftElbow": 40,
  "rightElbow": 85,
  "shoulderFwdL": -15,
  "shoulderFwdR": 20,
  "leftHip": 90,
  "rightHip": 90,
  "leftKnee": 98,
  "rightKnee": 100,
  "leftAnkle": -5,
  "rightAnkle": -3,
  "hipAbductL": -12,
  "hipAbductR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 8.8,
    "yaw_deg": 0,
    "roll_deg": -3.4,
    "description": "Head pitch 9° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 3.2,
    "lateral_flexion_deg": 0.1,
    "axial_rotation_deg": 40.3,
    "description": "Torso flexion 3° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 40°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 2.6,
    "yaw_deg": 40.3,
    "description": "Pelvic list 3° (+: left hip lower), yaw 40°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 115.7,
    "shoulder_sagittal_flexion_deg": 101.9,
    "elbow_flexion_deg": 39.1,
    "forearm_forward_deg": 102.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~116° (lateral); shoulder flexed ~102° forward; elbow bent ~39°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 24.5,
    "shoulder_sagittal_flexion_deg": -73.5,
    "elbow_flexion_deg": 79.8,
    "forearm_forward_deg": 4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~25°; shoulder extended ~73° behind; elbow ~right-angle (80°)."
  },
  "left_leg": {
    "hip_flexion_deg": 95.2,
    "hip_abduction_deg": -95,
    "knee_flexion_deg": 95.8,
    "foot_forward_deg": -140.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~95° (hip flexion); knee ~right-angle (96°)."
  },
  "right_leg": {
    "hip_flexion_deg": 102.2,
    "hip_abduction_deg": 95,
    "knee_flexion_deg": 98.5,
    "foot_forward_deg": -124.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~102° (hip flexion); abducted ~95° outward; knee ~right-angle (98°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.534,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.551,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.01,
    "com_z": 0.018,
    "foot_x_range": [
      -0.065,
      0.346
    ],
    "over_support": true,
    "feet_min_y": 0.534,
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
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -73.5,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~25°; shoulder extended ~73° behind; elbow ~right-angle (80°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 96.74505000000006 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 3° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 40°.
- Head: Head pitch 9° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 3° (+: left hip lower), yaw 40°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~116° (lateral); shoulder flexed ~102° forward; elbow bent ~39°.
- R arm: Right arm: arm abducted ~25°; shoulder extended ~73° behind; elbow ~right-angle (80°).
- L leg: Left leg: thigh forward ~95° (hip flexion); knee ~right-angle (96°).
- R leg: Right leg: thigh forward ~102° (hip flexion); abducted ~95° outward; knee ~right-angle (98°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-73.5,"band":[-60,180],"ctx":"Right arm: arm abducted ~25°; shoulder extended ~73° behind; elbow ~right-angle (80°).","verdict":"outside_band_review"}]