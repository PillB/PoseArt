# Forensic Baseline — p01-master-s2-chair-hand-forehead
- name: Chair Sit One Arm Elevated Hand to Forehead
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit in the chair with legs extended and slightly bent, crossed at the shin with pointed toes. Rest one arm on the armrest; raise the other arm, bending the elbow so the hand touches the forehead. Drop shoulders, elongate the neck, and look away from the camera.
- tip: Lift the raised elbow slightly forward of the shoulder line to lengthen the torso and avoid collapsing the ribcage.

## Raw joint config
```json
{
  "spine": 10,
  "hips": 5,
  "neck": -6.6,
  "leftShoulder": -35,
  "rightShoulder": -90,
  "leftElbow": 95,
  "rightElbow": 140,
  "hipAbductL": 6,
  "hipAbductR": -12,
  "leftHip": 50,
  "rightHip": 65,
  "leftKnee": 45,
  "rightKnee": 35,
  "leftAnkle": 12,
  "rightAnkle": 10,
  "shoulderFwdL": 8,
  "shoulderFwdR": -60,
  "globalTilt": 8,
  "globalTwist": 15,
  "globalRoll": 4
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 19.2,
    "yaw_deg": 0,
    "roll_deg": -5.8,
    "description": "Head pitch 19° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 17.4,
    "lateral_flexion_deg": 0.8,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion 17° (+: forward), lateral 1° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": -8.9,
    "list_deg": 8.7,
    "yaw_deg": 13.8,
    "description": "Pelvic list 9° (+: left hip lower), yaw 14°, anterior/posterior tilt proxy -9° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 57.2,
    "shoulder_sagittal_flexion_deg": -13,
    "elbow_flexion_deg": 76.6,
    "forearm_forward_deg": 48.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~57°; elbow ~right-angle (77°)."
  },
  "right_arm": {
    "shoulder_abduction_deg": 114.4,
    "shoulder_sagittal_flexion_deg": 120.5,
    "elbow_flexion_deg": 121.7,
    "forearm_forward_deg": 156.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~114° (lateral); shoulder flexed ~121° forward; elbow deeply bent (~122°)."
  },
  "left_leg": {
    "hip_flexion_deg": 39.8,
    "hip_abduction_deg": -29.9,
    "knee_flexion_deg": 44,
    "foot_forward_deg": 158.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~40°; knee bent ~44°."
  },
  "right_leg": {
    "hip_flexion_deg": 55.2,
    "hip_abduction_deg": 47.3,
    "knee_flexion_deg": 33.8,
    "foot_forward_deg": 162.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~55°; abducted ~47° outward; knee bent ~34°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.147,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.025,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.115,
    "foot_x_range": [
      0.217,
      0.645
    ],
    "over_support": false,
    "feet_min_y": -0.147,
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
| auto | true | 90.74249999999999 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 17° (+: forward), lateral 1° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch 19° (+: forward/down), roll -6° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 9° (+: left hip lower), yaw 14°, anterior/posterior tilt proxy -9° (low confidence).
- L arm: Left arm: arm abducted ~57°; elbow ~right-angle (77°).
- R arm: Right arm: arm abducted ~114° (lateral); shoulder flexed ~121° forward; elbow deeply bent (~122°).
- L leg: Left leg: thigh forward ~40°; knee bent ~44°.
- R leg: Right leg: thigh forward ~55°; abducted ~47° outward; knee bent ~34°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]