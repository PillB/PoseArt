# Forensic Baseline — p15-chair-s1-thinker-crossed-ankles
- name: Chair Thinker with Crossed Ankles
- category: seated | difficulty: Beginner | angle: undefined
- instructions: Sit sideways on the chair seat with both legs brought together and crossed at the ankles, angled to one side. Rest the near forearm across the top knee, bring the far hand up to rest under the chin. Turn shoulders slightly toward camera, chin down, direct steady gaze.
- tip: Keep the spine tall even while resting the chin on the hand — collapsing the chest reads as slouching, not relaxed.

## Raw joint config
```json
{
  "spine": 8,
  "neck": -8.2,
  "hips": -18,
  "globalTilt": 5,
  "globalRoll": 3,
  "globalTwist": 32,
  "leftShoulder": -70,
  "rightShoulder": -35,
  "leftElbow": 95,
  "rightElbow": 60,
  "shoulderFwdL": 30,
  "shoulderFwdR": 15,
  "leftHip": 85,
  "rightHip": 88,
  "leftKnee": 100,
  "rightKnee": 95,
  "leftAnkle": -5,
  "rightAnkle": -8,
  "hipAbductL": -10,
  "hipAbductR": -8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 15.4,
    "yaw_deg": 0,
    "roll_deg": -3.1,
    "description": "Head pitch 15° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 11,
    "lateral_flexion_deg": 4,
    "axial_rotation_deg": 27.9,
    "description": "Torso flexion 11° (+: forward), lateral 4° (+: figure's right), axial rotation proxy 28°."
  },
  "pelvis": {
    "tilt_deg": 5.3,
    "list_deg": -14.9,
    "yaw_deg": 27.8,
    "description": "Pelvic list -15° (+: left hip lower), yaw 28°, anterior/posterior tilt proxy 5° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 93.1,
    "shoulder_sagittal_flexion_deg": -121.2,
    "elbow_flexion_deg": 94.8,
    "forearm_forward_deg": 86.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~93° (lateral); shoulder extended ~121° behind; elbow ~right-angle (95°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 45.8,
    "shoulder_sagittal_flexion_deg": -57.7,
    "elbow_flexion_deg": 49.5,
    "forearm_forward_deg": 1.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~46°; shoulder extended ~58° behind; elbow bent ~49°."
  },
  "left_leg": {
    "hip_flexion_deg": 81.4,
    "hip_abduction_deg": -25.2,
    "knee_flexion_deg": 86.5,
    "foot_forward_deg": -134.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~81° (hip flexion); knee ~right-angle (86°)."
  },
  "right_leg": {
    "hip_flexion_deg": 83.8,
    "hip_abduction_deg": 75.1,
    "knee_flexion_deg": 92.6,
    "foot_forward_deg": -139.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~84° (hip flexion); abducted ~75° outward; knee ~right-angle (93°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.47,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.475,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.022,
    "com_z": 0.072,
    "foot_x_range": [
      -0.421,
      0.144
    ],
    "over_support": true,
    "feet_min_y": 0.47,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -121.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~93° (lateral); shoulder extended ~121° behind; elbow ~right-angle (95°).",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 90.74412000000034 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 11° (+: forward), lateral 4° (+: figure's right), axial rotation proxy 28°.
- Head: Head pitch 15° (+: forward/down), roll -3° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -15° (+: left hip lower), yaw 28°, anterior/posterior tilt proxy 5° (low confidence).
- L arm: Left arm: arm abducted ~93° (lateral); shoulder extended ~121° behind; elbow ~right-angle (95°).
- R arm: Right arm: arm abducted ~46°; shoulder extended ~58° behind; elbow bent ~49°.
- L leg: Left leg: thigh forward ~81° (hip flexion); knee ~right-angle (86°).
- R leg: Right leg: thigh forward ~84° (hip flexion); abducted ~75° outward; knee ~right-angle (93°).
- Balance: COM over foot support base. (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-121.2,"band":[-60,180],"ctx":"Left arm: arm abducted ~93° (lateral); shoulder extended ~121° behind; elbow ~right-angle (95°).","verdict":"outside_band_review"}]