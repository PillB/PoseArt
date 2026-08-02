# Forensic Baseline — shoulder-lean
- name: Shoulder Lean
- category: leaning | difficulty: Beginner | angle: Front
- instructions: Press both shoulder blades flat against the wall while walking the feet one step forward, letting the hips settle slightly ahead of the shoulders. Cross the arms or let them hang loose at your sides.
- tip: Step the feet away from the wall — that gap creates a flattering, subtle recline angle.

## Raw joint config
```json
{
  "spine": -14,
  "hips": 5,
  "neck": -5,
  "leftShoulder": -16,
  "rightShoulder": 2,
  "leftElbow": 95,
  "rightElbow": 95,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftKnee": 10,
  "rightKnee": 10,
  "shoulderFwdL": 4,
  "shoulderFwdR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -14.1,
    "yaw_deg": 0,
    "roll_deg": -5,
    "description": "Head pitch -14° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 5,
    "yaw_deg": 0,
    "description": "Pelvic list 5° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 40.1,
    "shoulder_sagittal_flexion_deg": 13.4,
    "elbow_flexion_deg": 57.4,
    "forearm_forward_deg": 36.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~40°; elbow bent ~57°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 19,
    "shoulder_sagittal_flexion_deg": 17.2,
    "elbow_flexion_deg": 35.8,
    "forearm_forward_deg": 15.2,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~19°; shoulder flexed ~17° forward; elbow bent ~36°."
  },
  "left_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -15,
    "knee_flexion_deg": 10,
    "foot_forward_deg": 67.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": -5,
    "knee_flexion_deg": 10.3,
    "foot_forward_deg": 66.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee straight."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.826,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.835,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": -0.08,
    "foot_x_range": [
      -0.025,
      0.197
    ],
    "over_support": true,
    "feet_min_y": -0.835,
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
| auto | true | 98.24354999999977 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -14° (+: forward/down), roll -5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 5° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~40°; elbow bent ~57°.
- R arm: Right arm: arm abducted ~19°; shoulder flexed ~17° forward; elbow bent ~36°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM over foot support base. (floating=false)