# Forensic Baseline — bench-lean-side
- name: Bench Lean Side
- category: leaning | difficulty: Beginner | angle: Side
- instructions: Stand beside a park bench and lean one hip against its armrest, resting a hand loosely on the backrest with fingers draped rather than gripping. Cross the feet at the ankle for a relaxed stance.
- tip: Drape the fingers over the bench back instead of gripping it to keep the hand looking soft.

## Raw joint config
```json
{
  "spine": 14,
  "hips": 10,
  "neck": -8.8,
  "leftShoulder": -10,
  "rightShoulder": 8,
  "leftElbow": 30,
  "rightElbow": 20,
  "hipAbductL": 10,
  "hipAbductR": -10,
  "leftHip": 14,
  "leftKnee": 85,
  "rightKnee": 85,
  "leftAnkle": -15,
  "rightAnkle": -15,
  "shoulderFwdL": -1,
  "shoulderFwdR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 14.2,
    "yaw_deg": 0,
    "roll_deg": -8.8,
    "description": "Head pitch 14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 14,
    "lateral_flexion_deg": 0,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": 0,
    "list_deg": 9.9,
    "yaw_deg": 0,
    "description": "Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 33.6,
    "shoulder_sagittal_flexion_deg": -14.7,
    "elbow_flexion_deg": 16.1,
    "forearm_forward_deg": 4.5,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~34°; elbow bent ~16°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 16.5,
    "shoulder_sagittal_flexion_deg": -12,
    "elbow_flexion_deg": 5.2,
    "forearm_forward_deg": -6.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~16°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": 14,
    "hip_abduction_deg": -20.6,
    "knee_flexion_deg": 78,
    "foot_forward_deg": 141.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee ~right-angle (78°)."
  },
  "right_leg": {
    "hip_flexion_deg": 0,
    "hip_abduction_deg": 20,
    "knee_flexion_deg": 79.6,
    "foot_forward_deg": 127.9,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; abducted ~20° outward; knee ~right-angle (80°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.191,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.278,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": 0,
    "com_z": 0.08,
    "foot_x_range": [
      0.161,
      0.499
    ],
    "over_support": false,
    "feet_min_y": -0.278,
    "floating": true,
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
| auto | true | 89.99550000000008 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 14° (+: forward), lateral 0° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 14° (+: forward/down), roll -9° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 10° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy 0° (low confidence).
- L arm: Left arm: arm abducted ~34°; elbow bent ~16°.
- R arm: Right arm: arm abducted ~16°; elbow straight.
- L leg: Left leg: thigh near neutral; knee ~right-angle (78°).
- R leg: Right leg: thigh near neutral; abducted ~20° outward; knee ~right-angle (80°).
- Balance: COM outside foot support base (balance risk). (floating=true)