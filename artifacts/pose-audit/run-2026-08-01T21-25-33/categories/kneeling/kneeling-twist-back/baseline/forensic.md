# Forensic Baseline — kneeling-twist-back
- name: Kneeling Twist Back
- category: kneeling | difficulty: Intermediate | angle: 3/4 View
- instructions: Kneel back onto the heels and wrap both arms around the torso in a self-hug, shoulders relaxed and head tilted down a few degrees. Let the mood read tender and introspective.
- tip: Tuck the chin slightly and close the eyes to deepen the intimate, self-soothing feeling.

## Raw joint config
```json
{
  "spine": 26,
  "neck": 20,
  "leftShoulder": 30,
  "leftElbow": 70,
  "rightShoulder": -60,
  "rightElbow": 50,
  "leftKnee": 80,
  "rightHip": 70,
  "rightKnee": 80,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 27.4,
    "yaw_deg": 0,
    "roll_deg": 20,
    "description": "Head pitch 27° (+: forward/down), roll 20° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 26,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 26° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": -4.9,
    "shoulder_sagittal_flexion_deg": -23.9,
    "elbow_flexion_deg": 26.1,
    "forearm_forward_deg": -15.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm at side; shoulder extended ~24° behind; elbow bent ~26°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 85.1,
    "shoulder_sagittal_flexion_deg": -79.1,
    "elbow_flexion_deg": 49.3,
    "forearm_forward_deg": 74.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~85° (lateral); shoulder extended ~79° behind; elbow bent ~49°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 78.8,
    "foot_forward_deg": 136.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee ~right-angle (79°)."
  },
  "right_leg": {
    "hip_flexion_deg": 70,
    "hip_abduction_deg": -22.3,
    "knee_flexion_deg": 78.8,
    "foot_forward_deg": -153.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~70°; knee ~right-angle (79°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.343,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.391,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.145,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.343,
    "floating": true,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_abduction",
      "value": -4.9,
      "band": [
        0,
        180
      ],
      "ctx": "Left arm: arm at side; shoulder extended ~24° behind; elbow bent ~26°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -79.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~85° (lateral); shoulder extended ~79° behind; elbow bent ~49°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 109.49099999999996 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 26° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 27° (+: forward/down), roll 20° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm at side; shoulder extended ~24° behind; elbow bent ~26°.
- R arm: Right arm: arm abducted ~85° (lateral); shoulder extended ~79° behind; elbow bent ~49°.
- L leg: Left leg: thigh near neutral; knee ~right-angle (79°).
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=true)
- Plausibility flags: [{"joint":"left_shoulder_abduction","value":-4.9,"band":[0,180],"ctx":"Left arm: arm at side; shoulder extended ~24° behind; elbow bent ~26°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-79.1,"band":[-60,180],"ctx":"Right arm: arm abducted ~85° (lateral); shoulder extended ~79° behind; elbow bent ~49°.","verdict":"outside_band_review"}]