# Forensic Baseline — p10-bench-s5-side-recline-arm-up
- name: Side Recline Along Bench, Arm Overhead
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Lie on your side along the full length of the bench. Extend the legs along the bench and raise the top arm overhead, resting the hand behind the head. Let the bottom arm support the head or rest along the bench.
- tip: Create a visible waist-to-hip curve by keeping the top hip slightly rolled forward rather than stacking the hips directly on top of each other.

## Raw joint config
```json
{
  "spine": 10,
  "neck": 10,
  "hips": -8,
  "leftShoulder": -131,
  "rightShoulder": 60,
  "leftElbow": 100,
  "rightElbow": 75,
  "shoulderFwdL": 10,
  "shoulderFwdR": 30,
  "leftHip": 10,
  "rightHip": 8,
  "leftKnee": 12,
  "rightKnee": 15,
  "leftAnkle": -5,
  "rightAnkle": -5,
  "hipAbductL": 0,
  "hipAbductR": 0,
  "globalTwist": 5,
  "globalRoll": 40,
  "globalTilt": -82
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -72.9,
    "yaw_deg": 0,
    "roll_deg": -23.9,
    "description": "Head pitch -73° (+: forward/down), roll -24° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -79,
    "lateral_flexion_deg": -55,
    "axial_rotation_deg": 5,
    "description": "Torso flexion -79° (+: forward), lateral -55° (+: figure's right), axial rotation proxy 5°."
  },
  "pelvis": {
    "tilt_deg": 44.7,
    "list_deg": 32.1,
    "yaw_deg": -2.9,
    "description": "Pelvic list 32° (+: left hip lower), yaw -3°, anterior/posterior tilt proxy 45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 37.3,
    "shoulder_sagittal_flexion_deg": -66.2,
    "elbow_flexion_deg": 43.2,
    "forearm_forward_deg": -110.9,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~37°; shoulder extended ~66° behind; elbow bent ~43°."
  },
  "right_arm": {
    "shoulder_abduction_deg": -55,
    "shoulder_sagittal_flexion_deg": 70.7,
    "elbow_flexion_deg": 44.8,
    "forearm_forward_deg": 46.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm at side; shoulder flexed ~71° forward; elbow bent ~45°."
  },
  "left_leg": {
    "hip_flexion_deg": 89.6,
    "hip_abduction_deg": 83.4,
    "knee_flexion_deg": 12.2,
    "foot_forward_deg": 148,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~90° (hip flexion); abducted ~83° outward; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 88.1,
    "hip_abduction_deg": -50,
    "knee_flexion_deg": 15,
    "foot_forward_deg": 149.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~88° (hip flexion); knee bent ~15°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.084,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.215,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.105,
    "com_z": -0.431,
    "foot_x_range": [
      -0.359,
      -0.063
    ],
    "over_support": true,
    "feet_min_y": 0.084,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -66.2,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm abducted ~37°; shoulder extended ~66° behind; elbow bent ~43°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_abduction",
      "value": -55,
      "band": [
        0,
        180
      ],
      "ctx": "Right arm: arm at side; shoulder flexed ~71° forward; elbow bent ~45°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 112.99699999999994 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -79° (+: forward), lateral -55° (+: figure's right), axial rotation proxy 5°.
- Head: Head pitch -73° (+: forward/down), roll -24° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 32° (+: left hip lower), yaw -3°, anterior/posterior tilt proxy 45° (low confidence).
- L arm: Left arm: arm abducted ~37°; shoulder extended ~66° behind; elbow bent ~43°.
- R arm: Right arm: arm at side; shoulder flexed ~71° forward; elbow bent ~45°.
- L leg: Left leg: thigh forward ~90° (hip flexion); abducted ~83° outward; knee straight.
- R leg: Right leg: thigh forward ~88° (hip flexion); knee bent ~15°.
- Balance: COM over foot support base. (floating=false)
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-66.2,"band":[-60,180],"ctx":"Left arm: arm abducted ~37°; shoulder extended ~66° behind; elbow bent ~43°.","verdict":"outside_band_review"},{"joint":"right_shoulder_abduction","value":-55,"band":[0,180],"ctx":"Right arm: arm at side; shoulder flexed ~71° forward; elbow bent ~45°.","verdict":"outside_band_review"}]