# Forensic Baseline — both-knees-arms-up
- name: Both Knees Arms Up
- category: kneeling | difficulty: Intermediate | angle: Front
- instructions: Kneel upright in full profile to camera, hands resting on the thighs. Lift the chin a few degrees to create one clean line from knee to crown, shoulders stacked over hips.
- tip: Check that shoulders and hips sit truly perpendicular to the lens — precision is everything in profile.

## Raw joint config
```json
{
  "spine": -8,
  "leftShoulder": -127,
  "rightShoulder": -114,
  "leftElbow": 70,
  "rightElbow": 70,
  "rightHip": 70,
  "leftKnee": 5,
  "rightKnee": 80,
  "neck": -6,
  "hipAbductL": 8,
  "hipAbductR": 8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -8,
    "yaw_deg": 0,
    "roll_deg": -6,
    "description": "Head pitch -8° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -8,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 150,
    "shoulder_sagittal_flexion_deg": 171.5,
    "elbow_flexion_deg": 35,
    "forearm_forward_deg": 147.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~150° abduction); shoulder flexed ~172° forward; elbow bent ~35°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 137,
    "shoulder_sagittal_flexion_deg": 170,
    "elbow_flexion_deg": 47.4,
    "forearm_forward_deg": 134.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~137° abduction); shoulder flexed ~170° forward; elbow bent ~47°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -8,
    "knee_flexion_deg": 5.6,
    "foot_forward_deg": 61.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
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
      "y": -0.856,
      "relation": "planted"
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
    "com_z": -0.046,
    "foot_x_range": [
      -0.079,
      0.079
    ],
    "over_support": true,
    "feet_min_y": -0.856,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    },
    {
      "type": "elbow_above_shoulder",
      "side": "R",
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
| auto | true | 104.99999999999983 | -10 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -8° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -8° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm overhead (~150° abduction); shoulder flexed ~172° forward; elbow bent ~35°.
- R arm: Right arm: arm overhead (~137° abduction); shoulder flexed ~170° forward; elbow bent ~47°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~70°; knee ~right-angle (79°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]