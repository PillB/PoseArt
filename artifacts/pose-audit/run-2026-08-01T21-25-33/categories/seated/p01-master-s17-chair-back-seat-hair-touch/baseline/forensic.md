# Forensic Baseline — p01-master-s17-chair-back-seat-hair-touch
- name: Sitting on Chair Back Hand on Armrest Hand in Hair
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on the back of the chair with one hand touching the armrest and the other touching the hair. Bend the knees with one leg lower than the other, crossed at shin level. Keep posture straight with an arched back. Tilt the face away from the camera with eyes closed.
- tip: Balance weight centrally over the chair back before adjusting the arms, to avoid tipping while perched high up.

## Raw joint config
```json
{
  "spine": -20,
  "neck": -9.9,
  "hips": 0,
  "globalTilt": 10,
  "globalRoll": 8,
  "globalTwist": 20,
  "leftShoulder": -30,
  "rightShoulder": -130,
  "leftElbow": 81,
  "rightElbow": 45,
  "shoulderFwdL": 10,
  "shoulderFwdR": 20,
  "leftHip": 55,
  "rightHip": 70,
  "leftKnee": 70,
  "rightKnee": 50,
  "leftAnkle": 8,
  "rightAnkle": 6,
  "hipAbductL": 6,
  "hipAbductR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -6.7,
    "yaw_deg": 0,
    "roll_deg": -20.3,
    "description": "Head pitch -7° (+: forward/down), roll -20° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -9.6,
    "lateral_flexion_deg": -11.5,
    "axial_rotation_deg": 18.9,
    "description": "Torso flexion -10° (+: forward), lateral -11° (+: figure's right), axial rotation proxy 19°."
  },
  "pelvis": {
    "tilt_deg": -9.3,
    "list_deg": 7.5,
    "yaw_deg": 18.9,
    "description": "Pelvic list 7° (+: left hip lower), yaw 19°, anterior/posterior tilt proxy -9° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 43.9,
    "shoulder_sagittal_flexion_deg": 27.5,
    "elbow_flexion_deg": 65.2,
    "forearm_forward_deg": 43.3,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~44°; shoulder flexed ~27° forward; elbow bent ~65°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 153,
    "shoulder_sagittal_flexion_deg": 172.8,
    "elbow_flexion_deg": 22.9,
    "forearm_forward_deg": 148.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~153° abduction); shoulder flexed ~173° forward; elbow bent ~23°."
  },
  "left_leg": {
    "hip_flexion_deg": 43.9,
    "hip_abduction_deg": -33.7,
    "knee_flexion_deg": 69.4,
    "foot_forward_deg": -179.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~44°; knee bent ~69°."
  },
  "right_leg": {
    "hip_flexion_deg": 60.2,
    "hip_abduction_deg": 50.7,
    "knee_flexion_deg": 49.5,
    "foot_forward_deg": 175.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~60°; abducted ~51° outward; knee bent ~49°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.097,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.194,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.074,
    "com_z": -0.034,
    "foot_x_range": [
      0.152,
      0.562
    ],
    "over_support": false,
    "feet_min_y": 0.097,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
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
| auto | true | 90.00000000000001 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -10° (+: forward), lateral -11° (+: figure's right), axial rotation proxy 19°.
- Head: Head pitch -7° (+: forward/down), roll -20° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 7° (+: left hip lower), yaw 19°, anterior/posterior tilt proxy -9° (low confidence).
- L arm: Left arm: arm abducted ~44°; shoulder flexed ~27° forward; elbow bent ~65°.
- R arm: Right arm: arm overhead (~153° abduction); shoulder flexed ~173° forward; elbow bent ~23°.
- L leg: Left leg: thigh forward ~44°; knee bent ~69°.
- R leg: Right leg: thigh forward ~60°; abducted ~51° outward; knee bent ~49°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]