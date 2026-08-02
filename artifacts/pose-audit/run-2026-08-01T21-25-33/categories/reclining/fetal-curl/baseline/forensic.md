# Forensic Baseline — fetal-curl
- name: Fetal Curl
- category: reclining | difficulty: Beginner | angle: Side
- instructions: Lie on the side and draw both knees up toward the chest, chin tucked and arms curled in close to the torso. A protective, introspective curled shape.
- tip: Let the top arm separate slightly from the body so it does not flatten the silhouette

## Raw joint config
```json
{
  "globalTilt": 80,
  "globalRoll": -30,
  "spine": 20,
  "neck": -4.5,
  "leftHip": 70,
  "rightHip": 65,
  "leftKnee": 110,
  "rightKnee": 105,
  "leftElbow": 60,
  "rightElbow": 50,
  "rightShoulder": 12
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 96.6,
    "yaw_deg": 0,
    "roll_deg": -127.1,
    "description": "Head pitch 97° (+: forward/down), roll -127° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": 98.7,
    "lateral_flexion_deg": -150,
    "axial_rotation_deg": 0,
    "description": "Torso flexion 99° (+: forward), lateral -150° (+: figure's right), axial rotation proxy 0°."
  },
  "pelvis": {
    "tilt_deg": -44.6,
    "list_deg": -26.6,
    "yaw_deg": 0,
    "description": "Pelvic list -27° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 142.4,
    "shoulder_sagittal_flexion_deg": -110.1,
    "elbow_flexion_deg": 26.8,
    "forearm_forward_deg": -88.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm overhead (~142° abduction); shoulder extended ~110° behind; elbow bent ~27°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 96.8,
    "shoulder_sagittal_flexion_deg": -91.7,
    "elbow_flexion_deg": 15.9,
    "forearm_forward_deg": -75.4,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~97° (lateral); shoulder extended ~92° behind; elbow bent ~16°."
  },
  "left_leg": {
    "hip_flexion_deg": -11.5,
    "hip_abduction_deg": 30,
    "knee_flexion_deg": 110,
    "foot_forward_deg": 153.1,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; abducted ~30° outward; knee ~right-angle (110°)."
  },
  "right_leg": {
    "hip_flexion_deg": -17.2,
    "hip_abduction_deg": -30,
    "knee_flexion_deg": 105,
    "foot_forward_deg": 142.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh extended ~17° behind; knee ~right-angle (105°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.127,
      "relation": "elevated"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.303,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.018,
    "com_z": 0.443,
    "foot_x_range": [
      -0.26,
      0.012
    ],
    "over_support": true,
    "feet_min_y": -0.303,
    "floating": false,
    "ground_penetration": false,
    "description": "COM over foot support base."
  },
  "anomalies": [
    {
      "type": "elbow_above_shoulder",
      "side": "L",
      "note": "may be intended if arms overhead"
    }
  ],
  "plausibility_flags": [
    {
      "joint": "left_shoulder_flexion",
      "value": -110.1,
      "band": [
        -60,
        180
      ],
      "ctx": "Left arm: arm overhead (~142° abduction); shoulder extended ~110° behind; elbow bent ~27°.",
      "verdict": "outside_band_review"
    },
    {
      "joint": "right_shoulder_flexion",
      "value": -91.7,
      "band": [
        -60,
        180
      ],
      "ctx": "Right arm: arm abducted ~97° (lateral); shoulder extended ~92° behind; elbow bent ~16°.",
      "verdict": "outside_band_review"
    }
  ],
  "overall_confidence": 0.75
}
```

## View results
| view | state_changed | yaw | pitch |
|------|---------------|-----|-------|
| auto | true | 110.73952999999973 | 25 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion 99° (+: forward), lateral -150° (+: figure's right), axial rotation proxy 0°.
- Head: Head pitch 97° (+: forward/down), roll -127° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list -27° (+: left hip lower), yaw 0°, anterior/posterior tilt proxy -45° (low confidence).
- L arm: Left arm: arm overhead (~142° abduction); shoulder extended ~110° behind; elbow bent ~27°.
- R arm: Right arm: arm abducted ~97° (lateral); shoulder extended ~92° behind; elbow bent ~16°.
- L leg: Left leg: thigh near neutral; abducted ~30° outward; knee ~right-angle (110°).
- R leg: Right leg: thigh extended ~17° behind; knee ~right-angle (105°).
- Balance: COM over foot support base. (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]
- Plausibility flags: [{"joint":"left_shoulder_flexion","value":-110.1,"band":[-60,180],"ctx":"Left arm: arm overhead (~142° abduction); shoulder extended ~110° behind; elbow bent ~27°.","verdict":"outside_band_review"},{"joint":"right_shoulder_flexion","value":-91.7,"band":[-60,180],"ctx":"Right arm: arm abducted ~97° (lateral); shoulder extended ~92° behind; elbow bent ~16°.","verdict":"outside_band_review"}]