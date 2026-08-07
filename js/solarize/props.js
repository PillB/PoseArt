// ============================================================
// PoseArt Solarize — Props & Support Architecture (Solarize §17)
// ------------------------------------------------------------
// Explicit prop records + contact anchors. Replaces prose-driven
// prop inference. Provides placement/contact editing helpers for
// the custom pose editor.
// ============================================================

import { makePropRecord, makeContactConstraint, PROP_TYPES, validatePropRecord } from './canonical-schema.js';

// Canonical contact surface names per prop type.
export const PROP_CONTACT_SURFACES = Object.freeze({
  wall: ['front-face', 'side-face'],
  floor: ['ground-plane'],
  chair: ['seat', 'backrest', 'armrest-left', 'armrest-right'],
  stool: ['seat'],
  bench: ['seat', 'backrest'],
  table: ['top', 'edge'],
  bed: ['mattress', 'pillow'],
  couch: ['seat', 'backrest', 'armrest-left', 'armrest-right'],
  railing: ['top-rail', 'post'],
  doorframe: ['left-jamb', 'right-jamb', 'top'],
  platform: ['top', 'side'],
  userDefined: ['surface'],
});

// Canonical body anchors that commonly contact props.
export const BODY_ANCHORS = Object.freeze([
  'leftHand', 'rightHand', 'leftElbow', 'rightElbow',
  'leftFoot', 'rightFoot', 'leftKnee', 'rightKnee',
  'hips', 'back', 'head', 'leftShoulder', 'rightShoulder',
]);

// Map a body anchor to canonical landmark name(s) for distance checks.
export function anchorToLandmarks(anchor) {
  return {
    leftHand: ['leftWrist'], rightHand: ['rightWrist'],
    leftElbow: ['leftElbow'], rightElbow: ['rightElbow'],
    leftFoot: ['leftAnkle'], rightFoot: ['rightAnkle'],
    leftKnee: ['leftKnee'], rightKnee: ['rightKnee'],
    hips: ['leftHip', 'rightHip'], back: ['leftHip', 'rightHip'],
    head: ['nose'], leftShoulder: ['leftShoulder'], rightShoulder: ['rightShoulder'],
  }[anchor] || [];
}

// Build a prop contact constraint between a person role and a prop.
export function makeBodyToPropContact({ id, roleId, bodyAnchor, propId, propSurface, relation = 'support', targetDistance = 0.0, tolerance = 0.06 }) {
  return makeContactConstraint({
    id, participantA: roleId, anchorA: landmarkForBodyAnchor(bodyAnchor),
    participantB: `prop:${propId}`, anchorB: propSurface,
    relation, targetDistance, tolerance, visibilityRequired: true,
  });
}

function landmarkForBodyAnchor(anchor) {
  const m = {
    leftHand: 'leftWrist', rightHand: 'rightWrist',
    leftElbow: 'leftElbow', rightElbow: 'rightElbow',
    leftFoot: 'leftAnkle', rightFoot: 'rightAnkle',
    leftKnee: 'leftKnee', rightKnee: 'rightKnee',
    hips: 'leftHip', back: 'rightHip', head: 'nose',
    leftShoulder: 'leftShoulder', rightShoulder: 'rightShoulder',
  };
  return m[anchor] || 'leftWrist';
}

// Editor helper: nudge a prop's transform.
export function moveProp(prop, dx, dy) {
  const t = { ...prop.transform, x: clamp(prop.transform.x + dx), y: clamp(prop.transform.y + dy) };
  return { ...prop, transform: t };
}

// Editor helper: validate a prop + return normalized record.
export function normalizeProp(input) {
  const rec = makePropRecord(input);
  const v = validatePropRecord(rec);
  if (!v.ok) return { ok: false, errors: v.errors, prop: null };
  if (!Array.isArray(rec.contactSurfaces) || !rec.contactSurfaces.length) {
    rec.contactSurfaces = PROP_CONTACT_SURFACES[rec.type] || ['surface'];
  }
  return { ok: true, errors: [], prop: rec };
}

// Detect if a pose's instructions mention prop types — used ONLY during
// migration (never as the runtime architecture). Solarize §17.
export function inferPropsFromText(text) {
  if (!text) return [];
  const lower = String(text).toLowerCase();
  const found = [];
  const lex = [
    ['wall', 'wall'], ['floor', 'floor'], ['ground', 'floor'], ['chair', 'chair'],
    ['stool', 'stool'], ['bench', 'bench'], ['table', 'table'], ['bed', 'bed'],
    ['couch', 'couch'], ['sofa', 'couch'], ['railing', 'railing'], ['rail', 'railing'],
    ['doorframe', 'doorframe'], ['door frame', 'doorframe'], ['platform', 'platform'],
  ];
  for (const [kw, type] of lex) {
    if (lower.includes(kw)) found.push(type);
  }
  return [...new Set(found)];
}

function clamp(v) { return Math.max(0, Math.min(1, v)); }

// Verify a body-to-prop contact against observed landmarks + prop geometry.
export function evaluatePropContact(contact, observedByRole, props) {
  const prop = props.find((p) => `prop:${p.propId}` === contact.participantB);
  if (!prop) return { satisfied: false, reason: 'missing_prop', excluded: false };
  const person = observedByRole[contact.participantA];
  if (!person) return { satisfied: false, reason: 'missing_person', excluded: false };
  const lm = (person.imageLandmarks || person.landmarks || {})[contact.anchorA];
  if (!lm) return { satisfied: false, reason: 'missing_anchor', excluded: true };
  if (contact.visibilityRequired && (lm.visibility || lm.confidence || 0) < 0.3) {
    return { satisfied: false, reason: 'low_visibility', excluded: true };
  }
  // Prop contact point: project the named surface to the body anchor's position
  // for surfaces that span a dimension (wall = vertical, floor = horizontal).
  const anchorPoint = { x: lm.x, y: lm.y };
  const surfPoint = propSurfacePoint(prop, contact.anchorB, anchorPoint);
  const d = Math.hypot(lm.x - surfPoint.x, lm.y - surfPoint.y);
  return {
    satisfied: d <= contact.targetDistance + contact.tolerance,
    distance: d,
    threshold: contact.targetDistance + contact.tolerance,
    excluded: false,
  };
}

// propSurfacePoint: returns the contact point on the prop's named surface.
// For vertical surfaces (wall, doorframe jamb) the point projects to the
// body anchor's y so a tall wall can contact a shoulder at any height.
function propSurfacePoint(prop, surface, anchorPoint) {
  const { x, y } = prop.transform;
  const { w, h } = prop.dimensions;
  switch (surface) {
    case 'seat': return { x, y: y - h / 2 };
    case 'top': return { x, y: y - h / 2 };
    case 'backrest': return { x, y: y - h };
    case 'ground-plane': return { x: anchorPoint?.x ?? x, y: 0.95 };
    case 'front-face':
      // Wall/front-face: vertical surface — project to anchor's y.
      return { x, y: anchorPoint?.y ?? y };
    case 'side-face':
      return { x: anchorPoint?.x ?? x, y: anchorPoint?.y ?? y };
    case 'edge': return { x: x + w / 2, y: y - h / 2 };
    case 'mattress': return { x, y: y - h / 2 };
    case 'top-rail': return { x, y: y - h / 2 };
    case 'post': return { x, y };
    default: return { x, y };
  }
}
