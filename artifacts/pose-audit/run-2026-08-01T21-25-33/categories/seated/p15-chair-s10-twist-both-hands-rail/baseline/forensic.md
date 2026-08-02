# Forensic Baseline — p15-chair-s10-twist-both-hands-rail
- name: Chair Twist Both Hands on Rail
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Sit sideways on the chair, twist the torso fully to grip the chair back rail with both hands, shoulders rotated toward the chair back, head turned to look at camera over the shoulder.
- tip: Push the twist as far as comfortably possible through the ribcage, not just the neck, to create the most dynamic line.

## Raw joint config
```json
{
  "spine": 18,
  "neck": -7.7,
  "hips": 0,
  "globalTilt": 0,
  "globalRoll": 8,
  "globalTwist": 60,
  "leftShoulder": -95,
  "rightShoulder": -75,
  "leftElbow": 65,
  "rightElbow": 70,
  "shoulderFwdL": 40,
  "shoulderFwdR": 35,
  "leftHip": 92,
  "rightHip": 92,
  "leftKnee": 96,
  "rightKnee": 95,
  "leftAnkle": -5,
  "rightAnkle": -5,
  "hipAbductL": -8,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 15.4,
    "yaw_deg": 0,
    "roll_deg": 4.2,
    "description": "Head pitch 15° (+: forward/down), roll 4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 9,
    "lateral_flexion_deg": 7.7,
    "axial_rotation_deg": 40.9,
    "description": "Torso flexion 9° (+: forward), lateral 8° (+: figure's right), axial rotation proxy 41°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 4,
    "yaw_deg": 40.9,
    "description": "Pelvic list 4° (+: left hip lower), yaw 41°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 109.6,
    "shoulder_sagittal_flexion_deg": 176.7,
    "elbow_flexion_deg": 57.6,
    "forearm_forward_deg": 114.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~110° (lateral); shoulder flexed ~177° forward; elbow bent ~58°."
  },
  "right_arm": {
    "shoulder_abduction_deg": -104,
    "shoulder_sagittal_flexion_deg": -95.9,
    "elbow_flexion_deg": 69.2,
    "forearm_forward_deg": -107.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder extended ~96° behind; elbow bent ~69°."
  },
  "left_leg": {
    "hip_flexion_deg": 103.2,
    "hip_abduction_deg": -100.5,
    "knee_flexion_deg": 95.2,
    "foot_forward_deg": -137.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~103° (hip flexion); knee ~right-angle (95°)."
  },
  "right_leg": {
    "hip_flexion_deg": 110.8,
    "hip_abduction_deg": 100.2,
    "knee_flexion_deg": 94.8,
    "foot_forward_deg": -131.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~111° (hip flexion); abducted ~100° outward; knee ~right-angle (95°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.56,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.596,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.027,
    "com_z": 0.051,
    "foot_x_range": [
      -0.047,
      0.295
    ],
    "over_support": true,
    "feet_min_y": 0.56,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
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
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -95.9,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder extended ~96° behind; elbow bent ~69°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_abduction",
      "value": -104,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder extended ~96° behind; elbow bent ~69°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.4970599999992 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 9° (+: forward), lateral 8° (+: figure's right), axial rotation proxy 41°.
- Head: Head pitch 15° (+: forward/down), roll 4° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 4° (+: left hip lower), yaw 41°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~110° (lateral); shoulder flexed ~177° forward; elbow bent ~58°.
- R arm: Right arm: arm at side; shoulder extended ~96° behind; elbow bent ~69°.
- L leg: Left leg: thigh forward ~103° (hip flexion); knee ~right-angle (95°).
- R leg: Right leg: thigh forward ~111° (hip flexion); abducted ~100° outward; knee ~right-angle (95°).
- Balance: COM over foot support base. (floating=true)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"},{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-95.9,"band":[-60,180],"ctx":"Right arm: arm at side; shoulder extended ~96° behind; elbow bent ~69°.","verdict":"outside_band_review"},{"joint":"right_shoulder_abduction","value":-104,"band":[0,180],"ctx":"Right arm: arm at side; shoulder extended ~96° behind; elbow bent ~69°.","verdict":"outside_band_review"}]