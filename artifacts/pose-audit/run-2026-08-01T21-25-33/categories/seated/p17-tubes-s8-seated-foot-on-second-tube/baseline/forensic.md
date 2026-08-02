# Forensic Baseline — p17-tubes-s8-seated-foot-on-second-tube
- name: Seated with Foot Resting on Second Tube
- category: seated | difficulty: Intermediate | angle: undefined
- instructions: Sit on one tube and extend one leg to rest the foot on a second, shorter tube in front of you. Place a hand on your hip and turn the torso into a 3/4 view. Look off to the side with a relaxed, confident expression.
- tip: Keep the extended knee very slightly bent rather than locked straight to keep the leg line soft.

## Raw joint config
```json
{
  "spine": -8,
  "neck": -22,
  "hips": 5,
  "globalTilt": 5,
  "globalRoll": 5,
  "globalTwist": 25,
  "leftShoulder": -60,
  "rightShoulder": -20,
  "leftElbow": 60,
  "rightElbow": 40,
  "shoulderFwdL": 20,
  "shoulderFwdR": 10,
  "leftHip": 20,
  "rightHip": 90,
  "leftKnee": 15,
  "rightKnee": 88,
  "leftAnkle": -5,
  "rightAnkle": -5,
  "hipAbductL": 5,
  "hipAbductR": -5
}
```

## Derived anatomy (front-view body-frame geometry, camera-independent)
```json
{
  "head": {
    "pitch_deg": 6.6,
    "yaw_deg": 0,
    "roll_deg": -26.3,
    "description": "Head pitch 7° (+: forward/down), roll -26° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence)."
  },
  "torso": {
    "flexion_deg": -2.7,
    "lateral_flexion_deg": -6.3,
    "axial_rotation_deg": 22.9,
    "description": "Torso flexion -3° (+: forward), lateral -6° (+: figure's right), axial rotation proxy 23°."
  },
  "pelvis": {
    "tilt_deg": -6.6,
    "list_deg": 9.4,
    "yaw_deg": 22.5,
    "description": "Pelvic list 9° (+: left hip lower), yaw 22°, anterior/posterior tilt proxy -7° (low confidence)."
  },
  "left_arm": {
    "shoulder_abduction_deg": 79.1,
    "shoulder_sagittal_flexion_deg": 47.8,
    "elbow_flexion_deg": 59.5,
    "forearm_forward_deg": 75,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Left arm: arm abducted ~79° (lateral); shoulder flexed ~48° forward; elbow bent ~60°."
  },
  "right_arm": {
    "shoulder_abduction_deg": 44.8,
    "shoulder_sagittal_flexion_deg": -27,
    "elbow_flexion_deg": 27.2,
    "forearm_forward_deg": 9.7,
    "upper_arm_length": 0.412,
    "forearm_length": 0.342,
    "description": "Right arm: arm abducted ~45°; shoulder extended ~27° behind; elbow bent ~27°."
  },
  "left_leg": {
    "hip_flexion_deg": 9.7,
    "hip_abduction_deg": -20.6,
    "knee_flexion_deg": 15,
    "foot_forward_deg": 83.4,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Left leg: thigh near neutral; knee straight."
  },
  "right_leg": {
    "hip_flexion_deg": 87.5,
    "hip_abduction_deg": 86.5,
    "knee_flexion_deg": 86.8,
    "foot_forward_deg": -135.5,
    "thigh_length": 0.43,
    "shank_length": 0.42,
    "description": "Right leg: thigh forward ~87° (hip flexion); abducted ~86° outward; knee ~right-angle (87°)."
  },
  "contacts": [
    {
      "body": "leftFoot",
      "target": "ground",
      "y": -0.722,
      "relation": "planted"
    },
    {
      "body": "rightFoot",
      "target": "ground",
      "y": 0.574,
      "relation": "elevated"
    }
  ],
  "balance": {
    "com_x": -0.042,
    "com_z": -0.006,
    "foot_x_range": [
      0.251,
      0.422
    ],
    "over_support": false,
    "feet_min_y": -0.722,
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
| auto | true | 90.74700000000001 | 0 |
| front | true | 0 | 0 |
| side | true | 90 | 0 |
| quarter | true | 45 | 0 |

## Forensic summary
- Torso: Torso flexion -3° (+: forward), lateral -6° (+: figure's right), axial rotation proxy 23°.
- Head: Head pitch 7° (+: forward/down), roll -26° (+: tilt to figure's right). Yaw not modeled by renderer (low confidence).
- Pelvis: Pelvic list 9° (+: left hip lower), yaw 22°, anterior/posterior tilt proxy -7° (low confidence).
- L arm: Left arm: arm abducted ~79° (lateral); shoulder flexed ~48° forward; elbow bent ~60°.
- R arm: Right arm: arm abducted ~45°; shoulder extended ~27° behind; elbow bent ~27°.
- L leg: Left leg: thigh near neutral; knee straight.
- R leg: Right leg: thigh forward ~87° (hip flexion); abducted ~86° outward; knee ~right-angle (87°).
- Balance: COM outside foot support base (balance risk). (floating=false)