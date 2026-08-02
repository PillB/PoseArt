# Forensic Baseline — p12-wall-s5-profile-hand-wall
- name: Side Profile Hand on Wall
- category: leaning | difficulty: Beginner | angle: undefined
- instructions: Stand in profile a small distance from the wall. Extend the near arm to press the palm flat against the wall at shoulder height, elbow slightly bent. Cross the far leg in front for a model stance, and turn the head to look back at the camera. Keep the torso upright with a small lean into the support
- tip: Keep a slight bend in the supporting elbow rather than locking it straight, this reads more relaxed and less stiff in photos.

## Raw joint config
```json
{
  "spine": -14,
  "neck": 27,
  "hips": 8,
  "leftShoulder": -85,
  "rightShoulder": -15,
  "leftElbow": 38,
  "rightElbow": 15,
  "shoulderFwdL": -20,
  "shoulderFwdR": 0,
  "leftHip": -5,
  "rightHip": -5,
  "leftKnee": 5,
  "rightKnee": 15,
  "leftAnkle": 0,
  "rightAnkle": -8,
  "hipAbductL": 0,
  "hipAbductR": 5,
  "globalTwist": 15,
  "globalRoll": 0,
  "globalTilt": 0
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": -21.9,
    "yaw_deg": 0,
    "roll_deg": 22.8,
    "description": "Head pitch -22° (+: forward/down), roll 23° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -13.5,
    "lateral_flexion_deg": -3.7,
    "axial_rotation_deg": 14.5,
    "description": "Torso flexion -14° (+: forward), lateral -4° (+: figure's right), axial rotation proxy 15°."
  },
  "pelvis": {
    "tilt_deg": -2.1,
    "list_deg": 7.9,
    "yaw_deg": 14.4,
    "description": "Pelvic list 8° (+: left hip lower), yaw 14°, anterior/posterior tilt proxy -2° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 116.1,
    "shoulder_sagittal_flexion_deg": 113.4,
    "elbow_flexion_deg": 36.4,
    "forearm_forward_deg": 105.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~116° (lateral); shoulder flexed ~113° forward; elbow bent ~36°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 40.1,
    "shoulder_sagittal_flexion_deg": 4.4,
    "elbow_flexion_deg": 10.5,
    "forearm_forward_deg": 16.1,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~40°; elbow straight."
  },
  "left_leg": {
    "hip_flexion_deg": -6.9,
    "hip_abduction_deg": -6.5,
    "knee_flexion_deg": 5.6,
    "foot_forward_deg": 55,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": -5.6,
    "hip_abduction_deg": 1.6,
    "knee_flexion_deg": 15.2,
    "foot_forward_deg": 57.2,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh near neutral; knee bent ~15°."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.884,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": -0.849,
      "relation": "planted"
    }
  ],
  "balance": {
    "com_x": -0.021,
    "com_z": -0.077,
    "foot_x_range": [
      -0.009,
      0.262
    ],
    "over_support": false,
    "feet_min_y": -0.884,
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
| auto | true | 93.75299999999999 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -14° (+: forward), lateral -4° (+: figure's right), axial rotation proxy 15°.
- Head: Head pitch -22° (+: forward/down), roll 23° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 8° (+: left hip lower), yaw 14°, anterior/posterior tilt proxy -2° (low confidence).
- L arm: Left arm: arm abducted ~116° (lateral); shoulder flexed ~113° forward; elbow bent ~36°.
- R arm: Right arm: arm abducted ~40°; elbow straight.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh near neutral; knee bent ~15°.
- Balance: COM outside foot support base (balance risk). (floating=false)
- Anomalies: [{"type":"elbow_above_shoulder","side":"L","note":"may be intended if arms overhead"}]