# Forensic Baseline — p17-tubes-s3-kneeling-arch-over-tube
- name: Kneeling Arch Over a Tube
- category: seated | difficulty: Advanced | angle: undefined
- instructions: Kneel behind a tube with both knees on the floor, then drape the torso forward and down over the top of the tube, arching the back. Let both arms hang down the far side, hands loosely touching the floor. Turn the head to one side, gazing toward camera.
- tip: Let the tube support your ribcage, not your stomach, to keep the spine's arch smooth and avoid pinching.

## Raw joint config
```json
{
  "spine": -30,
  "neck": 11,
  "hips": 15,
  "globalTilt": 35,
  "globalRoll": 10,
  "globalTwist": 15,
  "leftShoulder": -60,
  "rightShoulder": -65,
  "leftElbow": 30,
  "rightElbow": 15,
  "shoulderFwdL": 25,
  "shoulderFwdR": 25,
  "leftHip": 110,
  "rightHip": 108,
  "leftKnee": 130,
  "rightKnee": 128,
  "leftAnkle": 15,
  "rightAnkle": 15,
  "hipAbductL": -10,
  "hipAbductR": -10
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 1.9,
    "yaw_deg": 0,
    "roll_deg": 0.4,
    "description": "Head pitch 2° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 4.9,
    "lateral_flexion_deg": -8.7,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion 5° (+: forward), lateral -9° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": -31.1,
    "list_deg": 20.7,
    "yaw_deg": 6.1,
    "description": "Pelvic list 21° (+: left hip lower), yaw 6°, anterior/posterior tilt proxy -31° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 75.5,
    "shoulder_sagittal_flexion_deg": 46.7,
    "elbow_flexion_deg": 30.5,
    "forearm_forward_deg": 49.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~75° (lateral); shoulder flexed ~47° forward; elbow bent ~31°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 99.3,
    "shoulder_sagittal_flexion_deg": -125.9,
    "elbow_flexion_deg": 15.6,
    "forearm_forward_deg": -35,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~99° (lateral); shoulder extended ~126° behind; elbow bent ~16°."
  },
  "left_leg": {
    "hip_flexion_deg": 77.8,
    "hip_abduction_deg": -62.3,
    "knee_flexion_deg": 128.5,
    "foot_forward_deg": -81.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh forward ~78° (hip flexion); knee deeply bent (~129°)."
  },
  "right_leg": {
    "hip_flexion_deg": 78.3,
    "hip_abduction_deg": 77.3,
    "knee_flexion_deg": 110.9,
    "foot_forward_deg": -85.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~78° (hip flexion); abducted ~77° outward; knee ~right-angle (111°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": 0.266,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.397,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.049,
    "com_z": 0.094,
    "foot_x_range": [
      -0.086,
      0.536
    ],
    "over_support": true,
    "feet_min_y": 0.266,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "R",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "right_shoulder_flexion",
      "value": -125.9,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~99° (lateral); shoulder extended ~126° behind; elbow bent ~16°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 102.9985300000009 | 15 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 5° (+: forward), lateral -9° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch 2° (+: forward/down), roll 0° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 21° (+: left hip lower), yaw 6°, anterior/posterior tilt proxy -31° (low confidence).
- L arm: Left arm: arm abducted ~75° (lateral); shoulder flexed ~47° forward; elbow bent ~31°.
- R arm: Right arm: arm abducted ~99° (lateral); shoulder extended ~126° behind; elbow bent ~16°.
- L leg: Left leg: thigh forward ~78° (hip flexion); knee deeply bent (~129°).
- R leg: Right leg: thigh forward ~78° (hip flexion); abducted ~77° outward; knee ~right-angle (111°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"R","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"right_shoulder_flexion","value":-125.9,"band":[-60,180],"ctx":"Right arm: arm abducted ~99° (lateral); shoulder extended ~126° behind; elbow bent ~16°.","verdict":"outside_band_review"}]