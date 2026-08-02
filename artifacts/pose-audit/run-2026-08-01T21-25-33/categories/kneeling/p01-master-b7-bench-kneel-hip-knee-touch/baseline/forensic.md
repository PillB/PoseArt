# Forensic Baseline — p01-master-b7-bench-kneel-hip-knee-touch
- name: Bench Kneeling Hand on Hip Hand on Knee
- category: kneeling | difficulty: Beginner | angle: undefined
- instructions: Kneel on the bench. Bend one arm, resting the hand on the hip, and extend the other arm to touch the knee. Keep the posture straight with an arched back, and turn the face toward the camera.
- tip: Sit back slightly onto the heels before straightening the spine so the arch reads naturally rather than forced.

## Raw joint config
```json
{
  "spine": -15,
  "neck": -6,
  "hips": 16,
  "globalTilt": 0,
  "globalRoll": 0,
  "globalTwist": 5,
  "leftShoulder": -90,
  "rightShoulder": -15,
  "leftElbow": 60,
  "rightElbow": 10,
  "shoulderFwdL": 12,
  "shoulderFwdR": 15,
  "leftHip": 115,
  "rightHip": 115,
  "leftKnee": 135,
  "rightKnee": 135,
  "leftAnkle": -20,
  "rightAnkle": -20,
  "hipAbductL": 4,
  "hipAbductR": 4
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -14.5,
    "yaw_deg": 0,
    "roll_deg": -7.3,
    "description": "Head pitch -15° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -14.9,
    "lateral_flexion_deg": -1.3,
    "axial_rotation_deg": 5,
    "description": "Torso flexion -15° (+: forward), lateral -1° (+: figure's right), axial rotation proxy 5°."
  },
  "pelvis": {
    "tilt_deg": -1.4,
    "list_deg": 15.4,
    "yaw_deg": 4.8,
    "description": "Pelvic list 15° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy -1° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 113,
    "shoulder_sagittal_flexion_deg": 161.7,
    "elbow_flexion_deg": 55.4,
    "forearm_forward_deg": 112,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~113° (lateral); shoulder flexed ~162° forward; elbow bent ~55°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 40.6,
    "shoulder_sagittal_flexion_deg": 1.3,
    "elbow_flexion_deg": 7.5,
    "forearm_forward_deg": 10.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~41°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 115.9,
    "hip_abduction_deg": -133.7,
    "knee_flexion_deg": 118.7,
    "foot_forward_deg": -72.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~116° (hip flexion); knee deeply bent (~119°)."
  },
  "right_leg": {
    "hip_flexion_deg": 115.5,
    "hip_abduction_deg": 145.5,
    "knee_flexion_deg": 130.5,
    "foot_forward_deg": -73.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~116° (hip flexion); abducted ~145° outward; knee deeply bent (~130°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.277,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.367,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.007,
    "com_z": -0.085,
    "foot_x_range": [
      0.159,
      0.364
    ],
    "over_support": false,
    "feet_min_y": 0.277,
    "floating": true,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
    {
      "type": "knee_above_hip",
      "side": "L"
    },
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
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.99103 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -15° (+: forward), lateral -1° (+: figure's right), axial rotation proxy 5°.
- Head: Head pitch -15° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 15° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy -1° (low confidence).
- L arm: Left arm: arm abducted ~113° (lateral); shoulder flexed ~162° forward; elbow bent ~55°.
- R arm: Right arm: arm abducted ~41°; elbow straight.
- L leg: Left leg: thigh forward ~116° (hip flexion); knee deeply bent (~119°).
- R leg: Right leg: thigh forward ~116° (hip flexion); abducted ~145° outward; knee deeply bent (~130°).
- Balance: COM outside foot support base (balance risk). (floating=true)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]