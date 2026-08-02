# Forensic Baseline — p13-floor-s2-recline-look-up
- name: Floor Recline with Head Tilted Back
- category: reclining | difficulty: Intermediate | angle: undefined
- instructions: Sit on the floor and lean back, propping the torso up on both hands placed behind the hips. Bend both knees and let them fall gently to one side. Drop the head back and let the mouth fall softly open, allowing the window light to backlight the throat and hair.
- tip: Press firmly through the palms to lift the chest and create a long open line from the hips to the chin; a collapsed arm reads as tired rather than sensual.

## Raw joint config
```json
{
  "spine": -22,
  "neck": 25,
  "hips": 0,
  "leftShoulder": -60,
  "rightShoulder": -48,
  "leftElbow": 12,
  "rightElbow": 15,
  "shoulderFwdL": -35,
  "shoulderFwdR": -35,
  "leftHip": 20,
  "rightHip": 20,
  "leftKnee": 95,
  "rightKnee": 100,
  "leftAnkle": -5,
  "rightAnkle": 0,
  "hipAbductL": -15,
  "hipAbductR": -18,
  "globalTwist": 5,
  "globalRoll": 12,
  "globalTilt": -55
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -75.8,
    "yaw_deg": 0,
    "roll_deg": 48.7,
    "description": "Head pitch -76° (+: forward/down), roll 49° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -78.2,
    "lateral_flexion_deg": -32.7,
    "axial_rotation_deg": 5,
    "description": "Torso flexion -78° (+: forward), lateral -33° (+: figure's right), axial rotation proxy 5°."
  },
  "pelvis": {
    "tilt_deg": 39.2,
    "list_deg": 11.7,
    "yaw_deg": 5,
    "description": "Pelvic list 12° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 39° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 128.1,
    "shoulder_sagittal_flexion_deg": 130,
    "elbow_flexion_deg": 12.6,
    "forearm_forward_deg": 131.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~128° abduction); shoulder flexed ~130° forward; elbow straight."
  },
  "right_arm": {
    "shoulder_abduction_deg": 141.5,
    "shoulder_sagittal_flexion_deg": 133.3,
    "elbow_flexion_deg": 15.1,
    "forearm_forward_deg": 129.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~142° abduction); shoulder flexed ~133° forward; elbow bent ~15°."
  },
  "left_leg": {
    "hip_flexion_deg": 73.5,
    "hip_abduction_deg": 23.2,
    "knee_flexion_deg": 91.6,
    "foot_forward_deg": -136.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~74° (hip flexion); abducted ~23° outward; knee ~right-angle (92°)."
  },
  "right_leg": {
    "hip_flexion_deg": 79.8,
    "hip_abduction_deg": 69.6,
    "knee_flexion_deg": 94.5,
    "foot_forward_deg": -127.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~80° (hip flexion); abducted ~70° outward; knee ~right-angle (94°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.355,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.492,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.066,
    "com_z": -0.418,
    "foot_x_range": [
      -0.463,
      0.386
    ],
    "over_support": true,
    "feet_min_y": 0.355,
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
| auto | true | 100.7470000000001 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -78° (+: forward), lateral -33° (+: figure's right), axial rotation proxy 5°.
- Head: Head pitch -76° (+: forward/down), roll 49° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 12° (+: left hip lower), yaw 5°, anterior/posterior tilt proxy 39° (low confidence).
- L arm: Left arm: arm overhead (~128° abduction); shoulder flexed ~130° forward; elbow straight.
- R arm: Right arm: arm overhead (~142° abduction); shoulder flexed ~133° forward; elbow bent ~15°.
- L leg: Left leg: thigh forward ~74° (hip flexion); abducted ~23° outward; knee ~right-angle (92°).
- R leg: Right leg: thigh forward ~80° (hip flexion); abducted ~70° outward; knee ~right-angle (94°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]