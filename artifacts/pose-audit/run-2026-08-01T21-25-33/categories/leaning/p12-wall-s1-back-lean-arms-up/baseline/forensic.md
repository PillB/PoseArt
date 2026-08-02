# Forensic Baseline — p12-wall-s1-back-lean-arms-up
- name: Wall Back-Lean Arms Overhead
- category: leaning | difficulty: Beginner | angle: undefined
- instructions: Stand with the back and shoulders resting against the wall. Raise both arms overhead, elbows bent, hands framing the face or resting on the wall above the head. Bend one knee and place that foot flat against the wall behind you for support, letting the hips push slightly forward off the wall. Tilt t
- tip: Push the supporting foot firmly into the wall and let the hips float slightly forward off the wall surface, this creates a subtle S-curve instead of a flat silhouette.

## Raw joint config
```json
{
  "spine": -14,
  "hips": 16,
  "neck": -6.6,
  "leftShoulder": -110,
  "rightShoulder": -110,
  "leftElbow": 100,
  "rightElbow": 100,
  "hipAbductL": 15,
  "hipAbductR": 0,
  "leftHip": 55,
  "rightHip": -5,
  "leftKnee": 95,
  "rightKnee": 8,
  "leftAnkle": 10,
  "rightAnkle": 0,
  "shoulderFwdL": -30,
  "shoulderFwdR": -30,
  "globalTilt": -10,
  "globalTwist": 0,
  "globalRoll": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -24.1,
    "yaw_deg": 0,
    "roll_deg": -7,
    "description": "Head pitch -24° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -24,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -24° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 9.5,
    "list_deg": 15.2,
    "yaw_deg": 2.7,
    "description": "Pelvic list 15° (+: left hip lower), yaw 3°, anterior/posterior tilt proxy 9° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 146.4,
    "shoulder_sagittal_flexion_deg": 150.8,
    "elbow_flexion_deg": 70.5,
    "forearm_forward_deg": 157,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~146° abduction); shoulder flexed ~151° forward; elbow bent ~70°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 146.4,
    "shoulder_sagittal_flexion_deg": 150.8,
    "elbow_flexion_deg": 70.5,
    "forearm_forward_deg": 157,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm overhead (~146° abduction); shoulder flexed ~151° forward; elbow bent ~70°."
  },
  "left_leg": {
    "hip_flexion_deg": 65,
    "hip_abduction_deg": -54.9,
    "knee_flexion_deg": 77.1,
    "foot_forward_deg": -129.7,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~65°; knee ~right-angle (77°)."
  },
  "right_leg": {
    "hip_flexion_deg": 5,
    "hip_abduction_deg": 16.1,
    "knee_flexion_deg": 8.2,
    "foot_forward_deg": 70.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~16° outward; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.278,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.771,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.155,
    "foot_x_range": [
      0.321,
      0.45
    ],
    "over_support": false,
    "feet_min_y": -0.771,
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
| auto | true | 92.24289000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -24° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -24° (+: forward/down), roll -7° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 15° (+: left hip lower), yaw 3°, anterior/posterior tilt proxy 9° (low confidence).
- L arm: Left arm: arm overhead (~146° abduction); shoulder flexed ~151° forward; elbow bent ~70°.
- R arm: Right arm: arm overhead (~146° abduction); shoulder flexed ~151° forward; elbow bent ~70°.
- L leg: Left leg: thigh forward ~65°; knee ~right-angle (77°).
- R leg: Right leg: thigh near neutral; abducted ~16° outward; knee straight.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"},{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]