# Forensic Baseline — p12-wall-s3-forehead-rest
- name: Forehead Rest Against Wall
- category: leaning | difficulty: Intermediate | angle: undefined
- instructions: Face the wall directly and lean forward to rest the forehead or side of the face gently against it. Place both palms flat on the wall at shoulder height for support. Push the hips back and away from the wall to create a long curved line through the back. Bend one knee slightly and let the opposite l
- tip: Keep the hips pushed well back and the spine long; this creates the elegant curve and prevents the pose from looking hunched.

## Raw joint config
```json
{
  "spine": -22,
  "neck": -10,
  "hips": 0,
  "leftShoulder": -60,
  "rightShoulder": -72,
  "leftElbow": 45,
  "rightElbow": 25,
  "shoulderFwdL": -35,
  "shoulderFwdR": -35,
  "leftHip": -20,
  "rightHip": -10,
  "leftKnee": 15,
  "rightKnee": 5,
  "leftAnkle": 0,
  "rightAnkle": 0,
  "hipAbductL": 0,
  "hipAbductR": 0,
  "globalTwist": 0,
  "globalRoll": 0,
  "globalTilt": -35
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -57.3,
    "yaw_deg": 0,
    "roll_deg": -16.8,
    "description": "Head pitch -57° (+: forward/down), roll -17° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -57,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -57° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 29.8,
    "list_deg": 0,
    "yaw_deg": 0,
    "description": "Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 30° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 124.8,
    "shoulder_sagittal_flexion_deg": 118.6,
    "elbow_flexion_deg": 45.2,
    "forearm_forward_deg": 117.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~125° abduction); shoulder flexed ~119° forward; elbow bent ~45°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 134.4,
    "shoulder_sagittal_flexion_deg": 132.3,
    "elbow_flexion_deg": 25.3,
    "forearm_forward_deg": 128.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~134° abduction); shoulder flexed ~132° forward; elbow bent ~25°."
  },
  "left_leg": {
    "hip_flexion_deg": 15,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 86.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~15°; knee bent ~15°."
  },
  "right_leg": {
    "hip_flexion_deg": 25,
    "hip_abduction_deg": 0,
    "knee_flexion_deg": 5.7,
    "foot_forward_deg": 86.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~25°; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.747,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.722,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.346,
    "foot_x_range": [
      -0.17,
      0.17
    ],
    "over_support": true,
    "feet_min_y": -0.747,
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
| auto | true | 100.00449999999995 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -57° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -57° (+: forward/down), roll -17° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 30° (low confidence).
- L arm: Left arm: arm overhead (~125° abduction); shoulder flexed ~119° forward; elbow bent ~45°.
- R arm: Right arm: arm overhead (~134° abduction); shoulder flexed ~132° forward; elbow bent ~25°.
- L leg: Left leg: thigh forward ~15°; knee bent ~15°.
- R leg: Right leg: thigh forward ~25°; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]