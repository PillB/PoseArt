# Forensic Baseline — p08-male-se8-floor-lean-bench-legs-extended
- name: Floor Seated Leaning Against Bench
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on the floor with your back leaning against a tufted bench or ottoman. Extend both legs forward, crossing at the ankles. Rest one arm along the top of the bench and let the other rest on the floor or thigh. Gaze off to the side.
- tip: Let the head and upper back sink into the bench for support rather than holding the torso rigidly upright.

## Raw joint config
```json
{
  "spine": -20,
  "neck": -10,
  "hips": -5,
  "globalTilt": 18,
  "globalRoll": 5,
  "globalTwist": 15,
  "leftShoulder": -35,
  "rightShoulder": -20,
  "leftElbow": 55,
  "rightElbow": 65,
  "shoulderFwdL": -5,
  "shoulderFwdR": 10,
  "leftHip": 15,
  "rightHip": 18,
  "leftKnee": 10,
  "rightKnee": 12,
  "leftAnkle": -8,
  "rightAnkle": -8,
  "hipAbductL": 5,
  "hipAbductR": 3
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 0.3,
    "yaw_deg": 0,
    "roll_deg": -14.7,
    "description": "Head pitch 0° (+: forward/down), roll -15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -1.9,
    "lateral_flexion_deg": -5.5,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion -2° (+: forward), lateral -6° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": -15.4,
    "list_deg": 0,
    "yaw_deg": 15.8,
    "description": "Pelvic list 0° (+: left hip lower), yaw 16°, anterior/posterior tilt proxy -15° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 45.3,
    "shoulder_sagittal_flexion_deg": 32.7,
    "elbow_flexion_deg": 47.8,
    "forearm_forward_deg": 41.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~45°; shoulder flexed ~33° forward; elbow bent ~48°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 48.6,
    "shoulder_sagittal_flexion_deg": -17.7,
    "elbow_flexion_deg": 46.5,
    "forearm_forward_deg": 25.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~49°; shoulder extended ~18° behind; elbow bent ~46°."
  },
  "left_leg": {
    "hip_flexion_deg": -2.9,
    "hip_abduction_deg": -4.2,
    "knee_flexion_deg": 10.4,
    "foot_forward_deg": 55.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 2.1,
    "hip_abduction_deg": -2.7,
    "knee_flexion_deg": 12.1,
    "foot_forward_deg": 61.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.872,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.857,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": -0.032,
    "com_z": 0.025,
    "foot_x_range": [
      -0.053,
      0.168
    ],
    "over_support": true,
    "feet_min_y": -0.872,
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
| auto | true | 89.99550000000006 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -2° (+: forward), lateral -6° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch 0° (+: forward/down), roll -15° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 0° (+: left hip lower), yaw 16°, anterior/posterior tilt proxy -15° (low confidence).
- L arm: Left arm: arm abducted ~45°; shoulder flexed ~33° forward; elbow bent ~48°.
- R arm: Right arm: arm abducted ~49°; shoulder extended ~18° behind; elbow bent ~46°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM over foot support base. (floating=false)