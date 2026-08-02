# Forensic Baseline — back-arch-wall
- name: Back Arch Wall
- category: leaning | difficulty: Advanced | angle: Side
- instructions: Rest the lower back and hips against the wall for anchor, then arch the upper spine away from it, letting the head tilt back and arms drift outward. Keep the hips pressed to the wall throughout.
- tip: Only arch as far as feels controlled — the wall is there for safety, not to overextend the spine.

## Raw joint config
```json
{
  "spine": -24,
  "hips": 5,
  "neck": 4.8,
  "leftShoulder": -20,
  "leftElbow": 40,
  "rightElbow": 20,
  "hipAbductL": 10,
  "hipAbductR": 10,
  "leftKnee": 10,
  "rightKnee": 10,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -24.1,
    "yaw_deg": 0,
    "roll_deg": 4.8,
    "description": "Head pitch -24° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -24,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion -24° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 5,
    "yaw_deg": 0,
    "description": "Pelvic list 5° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 44.5,
    "shoulder_sagittal_flexion_deg": 30.4,
    "elbow_flexion_deg": 30.6,
    "forearm_forward_deg": 45.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~44°; shoulder flexed ~30° forward; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 22.8,
    "shoulder_sagittal_flexion_deg": 25.8,
    "elbow_flexion_deg": 12.4,
    "forearm_forward_deg": 30,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~23°; shoulder flexed ~26° forward; elbow straight."
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
    "com_z": -0.134,
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
| auto | true | 93.7440000000002 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -24° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch -24° (+: forward/down), roll 5° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 5° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~44°; shoulder flexed ~30° forward; elbow bent ~31°.
- R arm: Right arm: arm abducted ~23°; shoulder flexed ~26° forward; elbow straight.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee straight.
- Balance: COM over foot support base. (floating=false)