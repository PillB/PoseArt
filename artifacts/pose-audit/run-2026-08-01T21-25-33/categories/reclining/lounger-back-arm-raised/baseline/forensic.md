# Forensic Baseline — lounger-back-arm-raised
- name: Lounger Back Arm Raised
- category: reclining | difficulty: Beginner | angle: 3/4 View
- instructions: Recline back on a bed or lounger with one arm bent behind the head, elbow open. Rest the other hand on the stomach and let both legs relax long, ankles crossed loosely.
- tip: A bent arm behind the head opens the ribcage and elongates the whole torso line.

## Raw joint config
```json
{
  "globalTilt": -75,
  "leftShoulder": -120,
  "rightShoulder": 10,
  "leftElbow": 70,
  "rightElbow": 60,
  "leftHip": 20,
  "rightHip": 15,
  "leftKnee": 15
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -75,
    "yaw_deg": 0,
    "roll_deg": 0,
    "description": "Head pitch -75° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -75,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -75° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 44,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 44° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 108.8,
    "shoulder_sagittal_flexion_deg": -105,
    "elbow_flexion_deg": 41.7,
    "forearm_forward_deg": -142.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~109° (lateral); shoulder extended ~105° behind; elbow bent ~42°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 41.4,
    "shoulder_sagittal_flexion_deg": 75,
    "elbow_flexion_deg": 11.8,
    "forearm_forward_deg": 84.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~41°; shoulder flexed ~75° forward; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 95,
    "hip_abduction_deg": 180,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 166.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~95° (hip flexion); abducted ~180° outward; knee bent ~15°."
  },
  "right_leg": {
    "hip_flexion_deg": 90,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 151.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~90° (hip flexion); knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.334,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.176,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.435,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": 0.176,
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
      "value": -105,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~109° (lateral); shoulder extended ~105° behind; elbow bent ~42°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.74699999999993 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -75° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -75° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 44° (low confidence).
- L arm: Left arm: arm abducted ~109° (lateral); shoulder extended ~105° behind; elbow bent ~42°.
- R arm: Right arm: arm abducted ~41°; shoulder flexed ~75° forward; elbow straight.
- L leg: Left leg: thigh forward ~95° (hip flexion); abducted ~180° outward; knee bent ~15°.
- R leg: Right leg: thigh forward ~90° (hip flexion); knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-105,"band":[-60,180],"ctx":"Left arm: arm abducted ~109° (lateral); shoulder extended ~105° behind; elbow bent ~42°.","verdict":"outside_band_review"}]