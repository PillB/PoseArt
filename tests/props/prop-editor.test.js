// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = readFileSync(resolve(__dirname, '../../js/solarize-prop-editor.js'), 'utf8');

// Load the prop editor into a jsdom sandbox (it attaches to window).
function loadEditor() {
  const win = {
    document: {
      getElementById() { return null; },
      createElement(t) { return { tagName: t.toUpperCase(), style: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } }, setAttribute() {}, appendChild() {}, getContext() { return { clearRect() {}, fillRect() {}, strokeRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() {}, fill() {}, arc() {}, fillText() {}, setLineDash() {} }; }, }; },
      head: { appendChild() {} },
    },
    showToast() {},
  };
  const fn = new Function('window', src + '\n; return window.PoseArtPropEditor;');
  return fn(win);
}

describe('Solarize §17 — Prop & Contact Editor', () => {
  let editor;
  beforeEach(() => { editor = loadEditor(); editor.reset(); });

  it('exposes the canonical API', () => {
    expect(typeof editor.addProp).toBe('function');
    expect(typeof editor.removeProp).toBe('function');
    expect(typeof editor.updateProp).toBe('function');
    expect(typeof editor.addContact).toBe('function');
    expect(typeof editor.removeContact).toBe('function');
    expect(typeof editor.updateContact).toBe('function');
    expect(typeof editor.getState).toBe('function');
    expect(typeof editor.loadState).toBe('function');
    expect(typeof editor.inferFromDescription).toBe('function');
  });

  it('addProp creates an explicit PropRecord with required fields', () => {
    const id = editor.addProp('chair');
    const s = editor.getState();
    expect(s.props).toHaveLength(1);
    const p = s.props[0];
    expect(p.propId).toBe(id);
    expect(p.type).toBe('chair');
    expect(p.transform).toHaveProperty('x');
    expect(p.transform).toHaveProperty('y');
    expect(p.dimensions).toHaveProperty('w');
    expect(p.dimensions).toHaveProperty('h');
    expect(p.contactSurfaces).toContain('seat');
    expect(p.requiredOrOptional).toBe('required');
    expect(p.occlusionPolicy).toBe('opaque');
    expect(p.rendering).toHaveProperty('color');
  });

  it('addProp supports all canonical prop types (wall, floor, chair, bench, table, bed, railing, etc.)', () => {
    const types = editor.PROP_TYPES;
    expect(types).toContain('wall');
    expect(types).toContain('floor');
    expect(types).toContain('chair');
    expect(types).toContain('bench');
    expect(types).toContain('table');
    expect(types).toContain('bed');
    expect(types).toContain('railing');
    expect(types).toContain('doorframe');
    expect(types).toContain('platform');
    for (const t of types) {
      editor.reset();
      editor.addProp(t);
      expect(editor.getState().props[0].type).toBe(t);
    }
  });

  it('updateProp changes type and refreshes contactSurfaces', () => {
    const id = editor.addProp('chair');
    editor.updateProp(id, 'type', 'wall');
    const p = editor.getState().props[0];
    expect(p.type).toBe('wall');
    expect(p.contactSurfaces).toContain('front-face');
  });

  it('updateProp changes transform and dimensions', () => {
    const id = editor.addProp('chair');
    editor.updateProp(id, 'x', 0.3);
    editor.updateProp(id, 'y', 0.7);
    editor.updateProp(id, 'w', 0.4);
    editor.updateProp(id, 'h', 0.2);
    const p = editor.getState().props[0];
    expect(p.transform.x).toBeCloseTo(0.3);
    expect(p.transform.y).toBeCloseTo(0.7);
    expect(p.dimensions.w).toBeCloseTo(0.4);
    expect(p.dimensions.h).toBeCloseTo(0.2);
  });

  it('updateProp toggles requiredOrOptional', () => {
    const id = editor.addProp('chair');
    editor.updateProp(id, 'requiredOrOptional', 'optional');
    expect(editor.getState().props[0].requiredOrOptional).toBe('optional');
  });

  it('removeProp deletes the prop AND its contacts', () => {
    const id = editor.addProp('chair');
    editor.addContact(); // binds to prop:chair by default
    expect(editor.getState().contacts).toHaveLength(1);
    editor.removeProp(id);
    expect(editor.getState().props).toHaveLength(0);
    expect(editor.getState().contacts).toHaveLength(0);
  });

  it('addContact refuses when no prop exists', () => {
    expect(editor.addContact()).toBeNull();
    expect(editor.getState().contacts).toHaveLength(0);
  });

  it('addContact creates a ContactConstraint binding a body anchor to a prop surface', () => {
    const pid = editor.addProp('chair');
    const cid = editor.addContact();
    const c = editor.getState().contacts[0];
    expect(c.id).toBe(cid);
    expect(c.participantA).toBe('A');
    expect(c.anchorA).toBe('leftWrist');
    expect(c.participantB).toBe(`prop:${pid}`);
    expect(c.anchorB).toBe('seat'); // chair default surface
    expect(c.relation).toBe('touch');
    expect(typeof c.tolerance).toBe('number');
    expect(c.visibilityRequired).toBe(true);
  });

  it('updateContact changes the body anchor', () => {
    editor.addProp('chair');
    const cid = editor.addContact();
    editor.updateContact(cid, 'anchorA', 'rightWrist');
    expect(editor.getState().contacts[0].anchorA).toBe('rightWrist');
  });

  it('updateContact changes the target prop and auto-updates anchorB to a valid surface', () => {
    editor.addProp('chair');
    const wallId = editor.addProp('wall');
    const cid = editor.addContact();
    editor.updateContact(cid, 'participantB', `prop:${wallId}`);
    const c = editor.getState().contacts[0];
    expect(c.participantB).toBe(`prop:${wallId}`);
    expect(['front-face', 'side-face']).toContain(c.anchorB);
  });

  it('updateContact changes relation and tolerance', () => {
    editor.addProp('chair');
    const cid = editor.addContact();
    editor.updateContact(cid, 'relation', 'support');
    editor.updateContact(cid, 'tolerance', 0.15);
    const c = editor.getState().contacts[0];
    expect(c.relation).toBe('support');
    expect(c.tolerance).toBeCloseTo(0.15);
  });

  it('removeContact deletes a single contact', () => {
    editor.addProp('chair');
    const c1 = editor.addContact();
    const c2 = editor.addContact();
    editor.removeContact(c1);
    const s = editor.getState();
    expect(s.contacts).toHaveLength(1);
    expect(s.contacts[0].id).toBe(c2);
  });

  it('loadState restores props + contacts', () => {
    const id = editor.addProp('wall');
    const cid = editor.addContact();
    const snap = editor.getState();
    editor.reset();
    expect(editor.getState().props).toHaveLength(0);
    editor.loadState(snap);
    const s = editor.getState();
    expect(s.props).toHaveLength(1);
    expect(s.props[0].propId).toBe(id);
    expect(s.contacts).toHaveLength(1);
    expect(s.contacts[0].id).toBe(cid);
  });

  it('inferFromDescription adds props from prose (migration hint only, §17)', () => {
    editor.inferFromDescription('Lean against a wall with one hand on a chair');
    const types = editor.getState().props.map((p) => p.type);
    expect(types).toContain('wall');
    expect(types).toContain('chair');
  });

  it('inferFromDescription does not duplicate an existing prop type', () => {
    editor.addProp('wall');
    editor.inferFromDescription('Lean against a wall');
    expect(editor.getState().props.filter((p) => p.type === 'wall')).toHaveLength(1);
  });

  it('reset clears all props + contacts', () => {
    editor.addProp('chair');
    editor.addContact();
    editor.reset();
    expect(editor.getState().props).toHaveLength(0);
    expect(editor.getState().contacts).toHaveLength(0);
  });

  it('BODY_ANCHORS includes the canonical contact points', () => {
    const a = editor.BODY_ANCHORS;
    expect(a).toContain('leftWrist');
    expect(a).toContain('rightWrist');
    expect(a).toContain('leftAnkle');
    expect(a).toContain('rightAnkle');
    expect(a).toContain('leftHip');
    expect(a).toContain('nose');
  });

  it('PROP_SURFACES maps each type to valid surface names', () => {
    const s = editor.PROP_SURFACES;
    expect(s.chair).toContain('seat');
    expect(s.wall).toContain('front-face');
    expect(s.floor).toContain('ground-plane');
    expect(s.bed).toContain('mattress');
    expect(s.railing).toContain('top-rail');
  });
});
