# Forensic Baseline — p12-wall-s9-side-stretch-wall
- name: Side Stretch with Wall Support
- category: leaning | difficulty: Beginner | angle: undefined
- instructions: Stand facing the wall at a slight angle with one shoulder or forearm resting lightly against it for balance. Reach the far arm up and over the head, stretching the torso into a long lateral line. Cross the legs at the ankle and turn the face toward the camera.
- tip: Keep even, relaxed weight on both feet even though the legs are crossed, so the stretch reads as elegant rather than off-balance.

## Raw joint config
```json
{
  "spine": 14,
  "neck": -5.5,
  "hips": -12,
  "leftShoulder": -136,
  "rightShoulder": -70,
  "leftElbow": 32,
  "rightElbow": 75,
  "shoulderFwdL": -3,
  "shoulderFwdR": -20,
  "leftHip": -5,
  "rightHip": -8,
  "leftKnee": 5,
  "rightKnee": 14,
  "leftAnkle": 0,
  "rightAnkle": -8,
  "hipAbductL": 0,
  "hipAbductR": 5,
  "globalTwist": 5,
  "globalRoll": 14,
  "globalTilt": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 15.2,
    "yaw_deg": 0,
    "roll_deg": -18.2,
    "description": "Head pitch 15° (+: forward/down), roll -18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14.3,
    "lateral_flexion_deg": -12.8,
    "axial_rotation_deg": 5,
    "description": "Torso flexion 14° (+: forward), lateral -13° (+: figure's right), axial rotation proxy 5°."
  },
  "pelvis": {
    "tilt_deg": 1,
    "list_deg": 1.9,
    "yaw_deg": 4.9,
    "description": "Pelvic list 2° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 1° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 143.9,
    "shoulder_sagittal_flexion_deg": -167.7,
    "elbow_flexion_deg": 14.5,
    "forearm_forward_deg": 174.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~144° abduction); shoulder extended ~168° behind; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 107.4,
    "shoulder_sagittal_flexion_deg": 173,
    "elbow_flexion_deg": 74.8,
    "forearm_forward_deg": 94.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~107° (lateral); shoulder flexed ~173° forward; elbow bent ~75°."
  },
  "left_leg": {
    "hip_flexion_deg": -3.8,
    "hip_abduction_deg": -1.6,
    "knee_flexion_deg": 5.6,
    "foot_forward_deg": 57.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -6.2,
    "hip_abduction_deg": -3.7,
    "knee_flexion_deg": 13.6,
    "foot_forward_deg": 55.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.883,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.872,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": -0.1,
    "com_z": 0.08,
    "foot_x_range": [
      -0.156,
      0.103
    ],
    "over_support": true,
    "feet_min_y": -0.883,
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
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -167.7,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~144° abduction); shoulder extended ~168° behind; elbow straight.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 89.99099999999981 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral -13° (+: figure's right), axial rotation proxy 5°.
- Head: Head pitch 15° (+: forward/down), roll -18° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 2° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 1° (low confidence).
- L arm: Left arm: arm overhead (~144° abduction); shoulder extended ~168° behind; elbow straight.
- R arm: Right arm: arm abducted ~107° (lateral); shoulder flexed ~173° forward; elbow bent ~75°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-167.7,"band":[-60,180],"ctx":"Left arm: arm overhead (~144° abduction); shoulder extended ~168° behind; elbow straight.","verdict":"outside_band_review"}]