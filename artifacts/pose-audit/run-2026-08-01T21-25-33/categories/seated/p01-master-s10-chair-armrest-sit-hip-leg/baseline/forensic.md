# Forensic Baseline — p01-master-s10-chair-armrest-sit-hip-leg
- name: Sitting on Armrest Hand on Hip Hand on Leg
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on the armrest with one hand on the hip and the other touching the leg. Bend the legs with feet barely touching the floor, positioned apart with knees together. Keep the posture straight with an arched back, turned toward the camera.
- tip: Keep the supporting hand on the leg light so the arm reads relaxed instead of braced.

## Raw joint config
```json
{
  "spine": -15,
  "neck": -6,
  "hips": 16,
  "globalTilt": 6,
  "globalRoll": 4,
  "globalTwist": 20,
  "leftShoulder": -95,
  "rightShoulder": -40,
  "leftElbow": 55,
  "rightElbow": 85,
  "shoulderFwdL": 25,
  "shoulderFwdR": 10,
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
    "pitch_deg": -6.6,
    "yaw_deg": 0,
    "roll_deg": -12.6,
    "description": "Head pitch -7° (+: forward/down), roll -13° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -8.5,
    "lateral_flexion_deg": -7.1,
    "axial_rotation_deg": 18.9,
    "description": "Torso flexion -9° (+: forward), lateral -7° (+: figure's right), axial rotation proxy 19°."
  },
  "pelvis": {
    "tilt_deg": -10.7,
    "list_deg": 18.6,
    "yaw_deg": 16.8,
    "description": "Pelvic list 19° (+: left hip lower), yaw 17°, anterior/posterior tilt proxy -11° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 115.2,
    "shoulder_sagittal_flexion_deg": 153.3,
    "elbow_flexion_deg": 48.8,
    "forearm_forward_deg": 111.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~115° (lateral); shoulder flexed ~153° forward; elbow bent ~49°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 66.9,
    "shoulder_sagittal_flexion_deg": -35.6,
    "elbow_flexion_deg": 74.7,
    "forearm_forward_deg": 55.6,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~67° (lateral); shoulder extended ~36° behind; elbow bent ~75°."
  },
  "left_leg": {
    "hip_flexion_deg": 41.6,
    "hip_abduction_deg": -29.1,
    "knee_flexion_deg": 64.5,
    "foot_forward_deg": 175,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~42°; knee bent ~64°."
  },
  "right_leg": {
    "hip_flexion_deg": 41.2,
    "hip_abduction_deg": 53.1,
    "knee_flexion_deg": 53.2,
    "foot_forward_deg": -178,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~41°; abducted ~53° outward; knee bent ~53°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.005,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.154,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.044,
    "com_z": -0.037,
    "foot_x_range": [
      0.193,
      0.807
    ],
    "over_support": false,
    "feet_min_y": 0.005,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
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
| auto | true | 89.9954999999999 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -9° (+: forward), lateral -7° (+: figure's right), axial rotation proxy 19°.
- Head: Head pitch -7° (+: forward/down), roll -13° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 19° (+: left hip lower), yaw 17°, anterior/posterior tilt proxy -11° (low confidence).
- L arm: Left arm: arm abducted ~115° (lateral); shoulder flexed ~153° forward; elbow bent ~49°.
- R arm: Right arm: arm abducted ~67° (lateral); shoulder extended ~36° behind; elbow bent ~75°.
- L leg: Left leg: thigh forward ~42°; knee bent ~64°.
- R leg: Right leg: thigh forward ~41°; abducted ~53° outward; knee bent ~53°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]