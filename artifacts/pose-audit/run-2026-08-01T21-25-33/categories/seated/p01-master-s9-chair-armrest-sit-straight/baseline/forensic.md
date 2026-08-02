# Forensic Baseline — p01-master-s9-chair-armrest-sit-straight
- name: Sitting on Armrest Straight Posture Back Arch
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on the armrest of the chair with both hands touching the armrest. Bend the legs, one foot touching the floor and the other slightly elevated. Keep the posture straight with an arched back, facing the camera.
- tip: Perch on the front edge of the armrest with core engaged to keep the seated balance believable while still arching the spine.

## Raw joint config
```json
{
  "spine": -16,
  "neck": -6,
  "hips": 0,
  "globalTilt": 5,
  "globalRoll": 0,
  "globalTwist": 10,
  "leftShoulder": -25,
  "rightShoulder": -37,
  "leftElbow": 100,
  "rightElbow": 100,
  "shoulderFwdL": 10,
  "shoulderFwdR": 10,
  "leftHip": 45,
  "rightHip": 55,
  "leftKnee": 55,
  "rightKnee": 70,
  "leftAnkle": 5,
  "rightAnkle": 10,
  "hipAbductL": 6,
  "hipAbductR": 10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -9.9,
    "yaw_deg": 0,
    "roll_deg": -7.7,
    "description": "Head pitch -10° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -10.8,
    "lateral_flexion_deg": -1.9,
    "axial_rotation_deg": 9.9,
    "description": "Torso flexion -11° (+: forward), lateral -2° (+: figure's right), axial rotation proxy 10°."
  },
  "pelvis": {
    "tilt_deg": -4.9,
    "list_deg": 0,
    "yaw_deg": 9.9,
    "description": "Pelvic list 0° (+: left hip lower), yaw 10°, anterior/posterior tilt proxy -5° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 48.7,
    "shoulder_sagittal_flexion_deg": 17.1,
    "elbow_flexion_deg": 71.5,
    "forearm_forward_deg": 38.8,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~49°; shoulder flexed ~17° forward; elbow bent ~72°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 61.1,
    "shoulder_sagittal_flexion_deg": -10.7,
    "elbow_flexion_deg": 84.2,
    "forearm_forward_deg": 54.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~61° (lateral); elbow ~right-angle (84°)."
  },
  "left_leg": {
    "hip_flexion_deg": 38.7,
    "hip_abduction_deg": -15.7,
    "knee_flexion_deg": 54.6,
    "foot_forward_deg": 157.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~39°; knee bent ~55°."
  },
  "right_leg": {
    "hip_flexion_deg": 50.7,
    "hip_abduction_deg": -3.6,
    "knee_flexion_deg": 68.5,
    "foot_forward_deg": -174.3,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~51°; knee bent ~68°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.11,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.125,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.009,
    "com_z": -0.052,
    "foot_x_range": [
      0.005,
      0.178
    ],
    "over_support": false,
    "feet_min_y": -0.11,
    "floating": false,
    "ground_penetration": false,
    "description": "COM outside foot support base (balance risk)."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 91.49553000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -11° (+: forward), lateral -2° (+: figure's right), axial rotation proxy 10°.
- Head: Head pitch -10° (+: forward/down), roll -8° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 10°, anterior/posterior tilt proxy -5° (low confidence).
- L arm: Left arm: arm abducted ~49°; shoulder flexed ~17° forward; elbow bent ~72°.
- R arm: Right arm: arm abducted ~61° (lateral); elbow ~right-angle (84°).
- L leg: Left leg: thigh forward ~39°; knee bent ~55°.
- R leg: Right leg: thigh forward ~51°; knee bent ~68°.
- Balance: COM outside foot support base (balance risk). (floating=false)