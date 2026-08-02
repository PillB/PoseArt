# Forensic Baseline — p01-master-s11-chair-armrest-sit-hair
- name: Sitting on Armrest Hand on Hip Hand in Hair Eyes Closed
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on the armrest with one hand on the hip and the other touching the hair. Bend the legs with feet barely touching the floor, positioned apart with knees together. Keep the posture straight with an arched back, tilt the face toward the camera with eyes closed.
- tip: Tilt the head slightly into the raised arm to create a natural connection between the elbow and the face.

## Raw joint config
```json
{
  "spine": -15,
  "neck": -8.8,
  "hips": 16,
  "globalTilt": 8,
  "globalRoll": 5,
  "globalTwist": 18,
  "leftShoulder": -95,
  "rightShoulder": -130,
  "leftElbow": 55,
  "rightElbow": 45,
  "shoulderFwdL": 25,
  "shoulderFwdR": 22,
  "leftHip": 50,
  "rightHip": 55,
  "leftKnee": 65,
  "rightKnee": 60,
  "leftAnkle": 8,
  "rightAnkle": 8,
  "hipAbductL": -10,
  "hipAbductR": -12
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -4.3,
    "yaw_deg": 0,
    "roll_deg": -15.3,
    "description": "Head pitch -4° (+: forward/down), roll -15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -6.7,
    "lateral_flexion_deg": -7.2,
    "axial_rotation_deg": 17.2,
    "description": "Torso flexion -7° (+: forward), lateral -7° (+: figure's right), axial rotation proxy 17°."
  },
  "pelvis": {
    "tilt_deg": -12,
    "list_deg": 19.4,
    "yaw_deg": 14.6,
    "description": "Pelvic list 19° (+: left hip lower), yaw 15°, anterior/posterior tilt proxy -12° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 114.3,
    "shoulder_sagittal_flexion_deg": 154.1,
    "elbow_flexion_deg": 48.8,
    "forearm_forward_deg": 109.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~114° (lateral); shoulder flexed ~154° forward; elbow bent ~49°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 153.5,
    "shoulder_sagittal_flexion_deg": 178.8,
    "elbow_flexion_deg": 21.9,
    "forearm_forward_deg": 154.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~154° abduction); shoulder flexed ~179° forward; elbow bent ~22°."
  },
  "left_leg": {
    "hip_flexion_deg": 40.2,
    "hip_abduction_deg": -27.4,
    "knee_flexion_deg": 64.5,
    "foot_forward_deg": 172.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~40°; knee bent ~64°."
  },
  "right_leg": {
    "hip_flexion_deg": 40.8,
    "hip_abduction_deg": 52,
    "knee_flexion_deg": 53.2,
    "foot_forward_deg": 179.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~41°; abducted ~52° outward; knee bent ~53°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.017,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.143,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.046,
    "com_z": -0.022,
    "foot_x_range": [
      0.172,
      0.792
    ],
    "over_support": false,
    "feet_min_y": -0.017,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
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
| auto | true | 89.2440000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -7° (+: forward), lateral -7° (+: figure's right), axial rotation proxy 17°.
- Head: Head pitch -4° (+: forward/down), roll -15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 19° (+: left hip lower), yaw 15°, anterior/posterior tilt proxy -12° (low confidence).
- L arm: Left arm: arm abducted ~114° (lateral); shoulder flexed ~154° forward; elbow bent ~49°.
- R arm: Right arm: arm overhead (~154° abduction); shoulder flexed ~179° forward; elbow bent ~22°.
- L leg: Left leg: thigh forward ~40°; knee bent ~64°.
- R leg: Right leg: thigh forward ~41°; abducted ~52° outward; knee bent ~53°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]