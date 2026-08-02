# Forensic Baseline — p11-armchair-s4-one-leg-kicked-up-armrest
- name: Armchair One Leg Kicked Over Armrest
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Sit in the chair and hook one leg up and over the armrest, extending it out to the side, the other leg stays grounded bent on the seat. One hand grips the same-side armrest, the other rests near the hip. Head turns to camera.
- tip: Flex the extended foot and point through the toes to keep the kicked-up leg looking intentional rather than accidental.

## Raw joint config
```json
{
  "spine": -8,
  "neck": -8,
  "hips": 10,
  "globalTilt": -12,
  "globalRoll": 15,
  "globalTwist": 12,
  "leftShoulder": -60,
  "rightShoulder": -25,
  "leftElbow": 79,
  "rightElbow": 70,
  "shoulderFwdL": 10,
  "shoulderFwdR": 10,
  "leftHip": 118,
  "rightHip": 92,
  "leftKnee": 20,
  "rightKnee": 98,
  "leftAnkle": 8,
  "rightAnkle": -5,
  "hipAbductL": 25,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -19.8,
    "yaw_deg": 0,
    "roll_deg": -27.5,
    "description": "Head pitch -20° (+: forward/down), roll -27° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -20.6,
    "lateral_flexion_deg": -19.3,
    "axial_rotation_deg": 11.7,
    "description": "Torso flexion -21° (+: forward), lateral -19° (+: figure's right), axial rotation proxy 12°."
  },
  "pelvis": {
    "tilt_deg": 9.3,
    "list_deg": 22.4,
    "yaw_deg": 13.5,
    "description": "Pelvic list 22° (+: left hip lower), yaw 13°, anterior/posterior tilt proxy 9° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 67.6,
    "shoulder_sagittal_flexion_deg": 26.6,
    "elbow_flexion_deg": 78.3,
    "forearm_forward_deg": 92.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~68° (lateral); shoulder flexed ~27° forward; elbow ~right-angle (78°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 64.5,
    "shoulder_sagittal_flexion_deg": -3,
    "elbow_flexion_deg": 50.3,
    "forearm_forward_deg": 60.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~65° (lateral); elbow bent ~50°."
  },
  "left_leg": {
    "hip_flexion_deg": 144.3,
    "hip_abduction_deg": -142.3,
    "knee_flexion_deg": 16.3,
    "foot_forward_deg": -139.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~144° (hip flexion); knee bent ~16°."
  },
  "right_leg": {
    "hip_flexion_deg": 111.6,
    "hip_abduction_deg": 132.5,
    "knee_flexion_deg": 94.4,
    "foot_forward_deg": -104.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~112° (hip flexion); abducted ~133° outward; knee ~right-angle (94°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.754,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.669,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.138,
    "com_z": -0.135,
    "foot_x_range": [
      0.148,
      0.371
    ],
    "over_support": false,
    "feet_min_y": 0.669,
    "floating": false,
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
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_hip_flexion",
      "value": 144.3,
      "band": [
        -30,
        130
      ],
      "ctx": "Left leg: thigh forward ~144° (hip flexion); knee bent ~16°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.24057999999984 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -21° (+: forward), lateral -19° (+: figure's right), axial rotation proxy 12°.
- Head: Head pitch -20° (+: forward/down), roll -27° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 22° (+: left hip lower), yaw 13°, anterior/posterior tilt proxy 9° (low confidence).
- L arm: Left arm: arm abducted ~68° (lateral); shoulder flexed ~27° forward; elbow ~right-angle (78°).
- R arm: Right arm: arm abducted ~65° (lateral); elbow bent ~50°.
- L leg: Left leg: thigh forward ~144° (hip flexion); knee bent ~16°.
- R leg: Right leg: thigh forward ~112° (hip flexion); abducted ~133° outward; knee ~right-angle (94°).
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"knee_above_hip","side":"L"},{"type":"knee_above_hip","side":"R"}]
- Plausibility flags: [{"joint":"left_hip_flexion","value":144.3,"band":[-30,130],"ctx":"Left leg: thigh forward ~144° (hip flexion); knee bent ~16°.","verdict":"outside_band_review"}]