# Forensic Baseline — p17-tubes-s2-seated-lean-back-hands-support
- name: Seated Lean Back with Hand Support
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit atop a single tall tube, then lean the torso back and place both hands behind you on the tube's edge for support. Extend one leg forward and let the other bend with the foot resting on a lower tube. Tilt the head back slightly and gaze into camera.
- tip: Keep the wrists directly under the shoulders when supporting your weight to avoid strain and keep the line clean.

## Raw joint config
```json
{
  "spine": 20,
  "neck": -15,
  "hips": -10,
  "globalTilt": 20,
  "globalRoll": 5,
  "globalTwist": 10,
  "leftShoulder": -20,
  "rightShoulder": -25,
  "leftElbow": 30,
  "rightElbow": 12,
  "shoulderFwdL": -10,
  "shoulderFwdR": -10,
  "leftHip": 40,
  "rightHip": 95,
  "leftKnee": 15,
  "rightKnee": 90,
  "leftAnkle": -10,
  "rightAnkle": 5,
  "hipAbductL": -5,
  "hipAbductR": -8
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 42.6,
    "yaw_deg": 0,
    "roll_deg": -15,
    "description": "Head pitch 43° (+: forward/down), roll -15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 39.3,
    "lateral_flexion_deg": 3.3,
    "axial_rotation_deg": 9.9,
    "description": "Torso flexion 39° (+: forward), lateral 3° (+: figure's right), axial rotation proxy 10°."
  },
  "pelvis": {
    "tilt_deg": -16.8,
    "list_deg": -4.5,
    "yaw_deg": 12.9,
    "description": "Pelvic list -5° (+: left hip lower), yaw 13°, anterior/posterior tilt proxy -17° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 48.2,
    "shoulder_sagittal_flexion_deg": -24.3,
    "elbow_flexion_deg": 20.6,
    "forearm_forward_deg": 2.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~48°; shoulder extended ~24° behind; elbow bent ~21°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 57.7,
    "shoulder_sagittal_flexion_deg": -48.2,
    "elbow_flexion_deg": 8.6,
    "forearm_forward_deg": -35.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~58°; shoulder extended ~48° behind; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 21.9,
    "hip_abduction_deg": 7.3,
    "knee_flexion_deg": 14.8,
    "foot_forward_deg": 82.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~22°; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 75.6,
    "hip_abduction_deg": 32.3,
    "knee_flexion_deg": 89.8,
    "foot_forward_deg": -133.6,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~76° (hip flexion); abducted ~32° outward; knee ~right-angle (90°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.697,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.43,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0.012,
    "com_z": 0.249,
    "foot_x_range": [
      -0.262,
      0.16
    ],
    "over_support": true,
    "feet_min_y": -0.697,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 92.24549999999974 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 39° (+: forward), lateral 3° (+: figure's right), axial rotation proxy 10°.
- Head: Head pitch 43° (+: forward/down), roll -15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -5° (+: left hip lower), yaw 13°, anterior/posterior tilt proxy -17° (low confidence).
- L arm: Left arm: arm abducted ~48°; shoulder extended ~24° behind; elbow bent ~21°.
- R arm: Right arm: arm abducted ~58°; shoulder extended ~48° behind; elbow straight.
- L leg: Left leg: thigh forward ~22°; knee straight.
- R leg: Right leg: thigh forward ~76° (hip flexion); abducted ~32° outward; knee ~right-angle (90°).
- Balance: COM over foot support base. (floating=false)