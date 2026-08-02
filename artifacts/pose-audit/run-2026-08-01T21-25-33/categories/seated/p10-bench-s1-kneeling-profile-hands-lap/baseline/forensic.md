# Forensic Baseline — p10-bench-s1-kneeling-profile-hands-lap
- name: Kneeling on Bench in Profile, Hands in Lap
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Kneel upright on a padded bench with the body turned to a side profile. Clasp both hands together and rest them gently in your lap. Keep the spine tall and turn the head to look off to the side.
- tip: Lengthen the neck and lift the sternum slightly to avoid the kneeling position collapsing the torso forward.

## Raw joint config
```json
{
  "spine": -4,
  "neck": -6,
  "hips": 0,
  "leftShoulder": 15,
  "rightShoulder": 3,
  "leftElbow": 95,
  "rightElbow": 95,
  "shoulderFwdL": 10,
  "shoulderFwdR": 20,
  "leftHip": 102,
  "rightHip": 102,
  "leftKnee": 138,
  "rightKnee": 138,
  "leftAnkle": -30,
  "rightAnkle": -30,
  "hipAbductL": 0,
  "hipAbductR": 0,
  "globalTwist": -60,
  "globalRoll": 0,
  "globalTilt": -25
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -20.9,
    "yaw_deg": 0,
    "roll_deg": 22.8,
    "description": "Head pitch -21° (+: forward/down), roll 23° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -15.5,
    "lateral_flexion_deg": 25.6,
    "axial_rotation_deg": -40.9,
    "description": "Torso flexion -15° (+: forward), lateral 26° (+: figure's right), axial rotation proxy -41°."
  },
  "pelvis": {
    "tilt_deg": 11.9,
    "list_deg": 0,
    "yaw_deg": -40.9,
    "description": "Pelvic list 0° (+: left hip lower), yaw -41°, anterior/posterior tilt proxy 12° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 27.9,
    "shoulder_sagittal_flexion_deg": 6.5,
    "elbow_flexion_deg": 12.2,
    "forearm_forward_deg": 19.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~28°; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": -8.4,
    "shoulder_sagittal_flexion_deg": 28.2,
    "elbow_flexion_deg": 28.3,
    "forearm_forward_deg": 25.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder flexed ~28° forward; elbow bent ~28°."
  },
  "left_leg": {
    "hip_flexion_deg": 146.4,
    "hip_abduction_deg": 131,
    "knee_flexion_deg": 137.9,
    "foot_forward_deg": -52,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~146° (hip flexion); abducted ~131° outward; knee deeply bent (~138°)."
  },
  "right_leg": {
    "hip_flexion_deg": 146.4,
    "hip_abduction_deg": -131,
    "knee_flexion_deg": 137.9,
    "foot_forward_deg": -52,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~146° (hip flexion); knee deeply bent (~138°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.288,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.288,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.182,
    "com_z": -0.105,
    "foot_x_range": [
      0.085,
      0.315
    ],
    "over_support": true,
    "feet_min_y": 0.288,
    "floating": false,
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
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_hip_flexion",
      "value": 146.4,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~146° (hip flexion); abducted ~131° outward; knee deeply bent (~138°).",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_abduction",
      "value": -8.4,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder flexed ~28° forward; elbow bent ~28°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_hip_flexion",
      "value": 146.4,
      "band": [
        -30,
        130
      ],
      "ctx": "Right leg: thigh forward ~146° (hip flexion); knee deeply bent (~138°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49201999999947 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -15° (+: forward), lateral 26° (+: figure's right), axial rotation proxy -41°.
- Head: Head pitch -21° (+: forward/down), roll 23° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw -41°, anterior/posterior tilt proxy 12° (low confidence).
- L arm: Left arm: arm abducted ~28°; elbow straight.
- R arm: Right arm: arm at side; shoulder flexed ~28° forward; elbow bent ~28°.
- L leg: Left leg: thigh forward ~146° (hip flexion); abducted ~131° outward; knee deeply bent (~138°).
- R leg: Right leg: thigh forward ~146° (hip flexion); knee deeply bent (~138°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":146.4,"band":[-30,130],"ctx":"Left leg: thigh forward ~146° (hip flexion); abducted ~131° outward; knee deeply bent (~138°).","verdict":"outside_band_review"},{"joint":"right_shoulder_abduction","value":-8.4,"band":[0,180],"ctx":"Right arm: arm at side; shoulder flexed ~28° forward; elbow bent ~28°.","verdict":"outside_band_review"},{"joint":"right_hip_flexion","value":146.4,"band":[-30,130],"ctx":"Right leg: thigh forward ~146° (hip flexion); knee deeply bent (~138°).","verdict":"outside_band_review"}]