// ============================================================
// PoseArt Solarize — Prop & Contact Editor (Solarize §17)
// ------------------------------------------------------------
// Adds explicit prop-position editing + contact anchors to the
// custom pose editor. Replaces prose-driven prop inference.
// The saved custom pose includes explicit props[] + contacts[]
// arrays (canonical PropRecord / ContactConstraint shapes).
// ============================================================

(function (global) {
  'use strict';

  const PROP_TYPES = ['wall', 'floor', 'chair', 'stool', 'bench', 'table', 'bed', 'couch', 'railing', 'doorframe', 'platform', 'userDefined'];
  const PROP_TYPE_LABELS = {
    wall: 'Wall', floor: 'Floor', chair: 'Chair', stool: 'Stool', bench: 'Bench',
    table: 'Table', bed: 'Bed', couch: 'Couch', railing: 'Railing',
    doorframe: 'Doorframe', platform: 'Platform', userDefined: 'Custom',
  };
  const BODY_ANCHORS = [
    'leftWrist', 'rightWrist', 'leftElbow', 'rightElbow',
    'leftAnkle', 'rightAnkle', 'leftKnee', 'rightKnee',
    'leftHip', 'rightHip', 'nose', 'leftShoulder', 'rightShoulder',
  ];
  const PROP_SURFACES = {
    wall: ['front-face', 'side-face'], floor: ['ground-plane'],
    chair: ['seat', 'backrest', 'armrest-left', 'armrest-right'],
    stool: ['seat'], bench: ['seat', 'backrest'], table: ['top', 'edge'],
    bed: ['mattress', 'pillow'], couch: ['seat', 'backrest', 'armrest-left', 'armrest-right'],
    railing: ['top-rail', 'post'], doorframe: ['left-jamb', 'right-jamb', 'top'],
    platform: ['top', 'side'], userDefined: ['surface'],
  };

  // Editor state (module-local; one editor instance).
  let _props = [];
  let _contacts = [];
  let _nextPropId = 1;
  let _nextContactId = 1;
  let _overlayCanvas = null;
  let _overlayCtx = null;

  function reset() {
    _props = []; _contacts = []; _nextPropId = 1; _nextContactId = 1;
    renderPropList(); renderContactList(); drawOverlay();
  }

  function getState() {
    return {
      props: JSON.parse(JSON.stringify(_props)),
      contacts: JSON.parse(JSON.stringify(_contacts)),
    };
  }

  function loadState(state) {
    _props = JSON.parse(JSON.stringify(state?.props || []));
    _contacts = JSON.parse(JSON.stringify(state?.contacts || []));
    _nextPropId = Math.max(1, ..._props.map((p) => parseInt(String(p.propId).replace(/\D/g, '')) || 0)) + 1;
    _nextContactId = Math.max(1, ..._contacts.map((c) => parseInt(String(c.id).replace(/\D/g, '')) || 0)) + 1;
    renderPropList(); renderContactList(); drawOverlay();
  }

  // ---- Prop CRUD ----
  function addProp(type = 'chair') {
    const propId = 'prop' + _nextPropId++;
    _props.push({
      propId, type,
      transform: { x: 0.5, y: 0.8, rotation: 0 },
      dimensions: { w: 0.25, h: 0.15 },
      contactSurfaces: PROP_SURFACES[type] || ['surface'],
      occlusionPolicy: 'opaque',
      rendering: { color: type === 'wall' ? '#8a8a8a' : type === 'floor' ? '#6b6b6b' : '#a07840', alpha: 0.5 },
      requiredOrOptional: 'required',
    });
    renderPropList(); drawOverlay();
    return propId;
  }

  function removeProp(propId) {
    _props = _props.filter((p) => p.propId !== propId);
    _contacts = _contacts.filter((c) => c.participantA !== `prop:${propId}` && c.participantB !== `prop:${propId}`);
    renderPropList(); renderContactList(); drawOverlay();
  }

  function updateProp(propId, field, value) {
    const p = _props.find((x) => x.propId === propId);
    if (!p) return;
    if (field === 'type') {
      p.type = value;
      p.contactSurfaces = PROP_SURFACES[value] || ['surface'];
    } else if (field === 'x' || field === 'y') {
      p.transform[field] = parseFloat(value);
    } else if (field === 'w' || field === 'h') {
      p.dimensions[field] = parseFloat(value);
    } else if (field === 'requiredOrOptional') {
      p.requiredOrOptional = value;
    }
    drawOverlay();
  }

  // ---- Contact CRUD ----
  function addContact() {
    const id = 'c' + _nextContactId++;
    const propIds = _props.map((p) => p.propId);
    if (!propIds.length) { (global.showToast || (() => {}))('Add a prop first'); return null; }
    _contacts.push({
      id,
      participantA: 'A', anchorA: 'leftWrist',
      participantB: `prop:${propIds[0]}`, anchorB: PROP_SURFACES[_props[0].type]?.[0] || 'surface',
      relation: 'touch', targetDistance: 0, tolerance: 0.08, visibilityRequired: true,
    });
    renderContactList(); drawOverlay();
    return id;
  }

  function removeContact(id) {
    _contacts = _contacts.filter((c) => c.id !== id);
    renderContactList(); drawOverlay();
  }

  function updateContact(id, field, value) {
    const c = _contacts.find((x) => x.id === id);
    if (!c) return;
    if (field === 'participantA') c.participantA = value;
    else if (field === 'anchorA') c.anchorA = value;
    else if (field === 'participantB') {
      c.participantB = value;
      // auto-update anchorB to a valid surface for the new prop
      const propId = value.replace('prop:', '');
      const prop = _props.find((p) => p.propId === propId);
      if (prop) c.anchorB = PROP_SURFACES[prop.type]?.[0] || 'surface';
    } else if (field === 'anchorB') c.anchorB = value;
    else if (field === 'relation') c.relation = value;
    else if (field === 'tolerance') c.tolerance = parseFloat(value);
    renderContactList(); drawOverlay();
  }

  // ---- Rendering ----
  function ensurePanel() {
    let panel = document.getElementById('solarize-prop-editor-panel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'solarize-prop-editor-panel';
      panel.className = 'solarize-prop-editor';
      panel.setAttribute('aria-label', 'Props and contacts editor');
      const editor = document.getElementById('screen-custom-pose-editor') || document.querySelector('.screen-scroll');
      if (editor) editor.appendChild(panel);
      injectStyles();
    }
    return panel;
  }

  function injectStyles() {
    if (document.getElementById('solarize-prop-editor-styles')) return;
    const css = document.createElement('style');
    css.id = 'solarize-prop-editor-styles';
    css.textContent = `
      .solarize-prop-editor {
        margin: 8px 16px; padding: 12px 14px; border-radius: 12px;
        background: linear-gradient(180deg, rgba(30,122,116,0.05), rgba(15,28,28,0.02));
        border: 1px solid rgba(30,122,116,0.25);
      }
      .spe-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
      .spe-title { font:700 11px/1 var(--font-body, sans-serif); letter-spacing:0.08em; text-transform:uppercase; color:#1E7A74; }
      .spe-btn { font:600 10px/1 sans-serif; padding:5px 10px; border-radius:6px; border:1px solid #1E7A74; background:rgba(30,122,116,0.1); color:#1A5649; cursor:pointer; }
      .spe-btn:hover { background:rgba(30,122,116,0.2); }
      .spe-btn-gold { background:#C9A24C; color:#1a1a1a; border-color:#C9A24C; }
      .spe-btn-gold:hover { background:#d9b25c; }
      .spe-prop-card { background:rgba(255,255,255,0.5); border:1px solid rgba(30,122,116,0.15); border-radius:8px; padding:8px; margin-bottom:6px; }
      .spe-prop-row { display:flex; gap:6px; align-items:center; margin-bottom:4px; flex-wrap:wrap; }
      .spe-label { font:600 9px/1 sans-serif; color:#5D6D7E; text-transform:uppercase; letter-spacing:0.04em; min-width:32px; }
      .spe-select, .spe-input { font:500 10px/1.4 sans-serif; padding:3px 6px; border:1px solid #ddd; border-radius:4px; background:#fff; color:#2C3E50; }
      .spe-range { width:60px; accent-color:#1E7A74; }
      .spe-prop-id { font:700 10px/1 monospace; color:#1A5649; }
      .spe-contact-card { background:rgba(255,255,255,0.4); border:1px dashed rgba(30,122,116,0.2); border-radius:8px; padding:6px 8px; margin-bottom:4px; font:500 10px/1.4 monospace; color:#5D6D7E; }
      .spe-empty { font:italic 11px/1.4 sans-serif; color:#8aa39e; padding:8px 0; }
      .spe-overlay-wrap { position:relative; width:100%; max-width:280px; margin:8px auto; aspect-ratio:640/480; background:#0e1a1a; border-radius:8px; overflow:hidden; }
      .spe-overlay-canvas { width:100%; height:100%; display:block; }
      .spe-section-h { font:700 9px/1 sans-serif; color:#1E7A74; text-transform:uppercase; letter-spacing:0.06em; margin:8px 0 4px; }
      .spe-remove { font:600 9px/1 sans-serif; padding:3px 6px; border-radius:4px; border:1px solid #C96A4C; background:rgba(201,106,76,0.1); color:#C96A4C; cursor:pointer; }
      .spe-remove:hover { background:rgba(201,106,76,0.2); }
    `;
    document.head.appendChild(css);
  }

  function renderPropList() {
    const panel = ensurePanel();
    const propsHtml = _props.length ? _props.map((p) => {
      const surfaces = PROP_SURFACES[p.type] || ['surface'];
      return `<div class="spe-prop-card" data-prop="${p.propId}">
        <div class="spe-prop-row">
          <span class="spe-prop-id">${p.propId}</span>
          <select class="spe-select" onchange="PoseArtPropEditor.updateProp('${p.propId}','type',this.value)">
            ${PROP_TYPES.map((t) => `<option value="${t}" ${t === p.type ? 'selected' : ''}>${PROP_TYPE_LABELS[t]}</option>`).join('')}
          </select>
          <span class="spe-label">req</span>
          <select class="spe-select" onchange="PoseArtPropEditor.updateProp('${p.propId}','requiredOrOptional',this.value)">
            <option value="required" ${p.requiredOrOptional === 'required' ? 'selected' : ''}>required</option>
            <option value="optional" ${p.requiredOrOptional === 'optional' ? 'selected' : ''}>optional</option>
          </select>
          <button class="spe-remove" onclick="PoseArtPropEditor.removeProp('${p.propId}')">✕</button>
        </div>
        <div class="spe-prop-row">
          <span class="spe-label">x</span><input type="range" class="spe-range" min="0" max="1" step="0.01" value="${p.transform.x}" oninput="PoseArtPropEditor.updateProp('${p.propId}','x',this.value)">
          <span class="spe-label">y</span><input type="range" class="spe-range" min="0" max="1" step="0.01" value="${p.transform.y}" oninput="PoseArtPropEditor.updateProp('${p.propId}','y',this.value)">
        </div>
        <div class="spe-prop-row">
          <span class="spe-label">w</span><input type="range" class="spe-range" min="0.05" max="1" step="0.01" value="${p.dimensions.w}" oninput="PoseArtPropEditor.updateProp('${p.propId}','w',this.value)">
          <span class="spe-label">h</span><input type="range" class="spe-range" min="0.05" max="1" step="0.01" value="${p.dimensions.h}" oninput="PoseArtPropEditor.updateProp('${p.propId}','h',this.value)">
        </div>
      </div>`;
    }).join('') : '<div class="spe-empty">No props. Add a prop to define explicit support/contact geometry (replaces prose inference).</div>';

    const contactsHtml = _contacts.length ? _contacts.map((c) => {
      const propOptions = _props.map((p) => `<option value="prop:${p.propId}" ${`prop:${p.propId}` === c.participantB ? 'selected' : ''}>${p.propId} (${p.type})</option>`).join('');
      const prop = _props.find((p) => `prop:${p.propId}` === c.participantB);
      const surfaceOptions = prop ? (PROP_SURFACES[prop.type] || ['surface']).map((s) => `<option value="${s}" ${s === c.anchorB ? 'selected' : ''}>${s}</option>`).join('') : '';
      return `<div class="spe-contact-card" data-contact="${c.id}">
        <div class="spe-prop-row">
          <span class="spe-prop-id">${c.id}</span>
          <select class="spe-select" onchange="PoseArtPropEditor.updateContact('${c.id}','anchorA',this.value)">
            ${BODY_ANCHORS.map((a) => `<option value="${a}" ${a === c.anchorA ? 'selected' : ''}>${a}</option>`).join('')}
          </select>
          <span style="color:#1E7A74">↔</span>
          <select class="spe-select" onchange="PoseArtPropEditor.updateContact('${c.id}','participantB',this.value)">
            ${propOptions}
          </select>
          <select class="spe-select" onchange="PoseArtPropEditor.updateContact('${c.id}','anchorB',this.value)">
            ${surfaceOptions}
          </select>
          <button class="spe-remove" onclick="PoseArtPropEditor.removeContact('${c.id}')">✕</button>
        </div>
        <div class="spe-prop-row">
          <span class="spe-label">rel</span>
          <select class="spe-select" onchange="PoseArtPropEditor.updateContact('${c.id}','relation',this.value)">
            ${['touch', 'proximity', 'support', 'wrap'].map((r) => `<option value="${r}" ${r === c.relation ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
          <span class="spe-label">tol</span>
          <input type="range" class="spe-range" min="0.02" max="0.3" step="0.01" value="${c.tolerance}" oninput="PoseArtPropEditor.updateContact('${c.id}','tolerance',this.value)">
          <span style="font:600 10px monospace;color:#1A5649">${c.tolerance.toFixed(2)}</span>
        </div>
      </div>`;
    }).join('') : '<div class="spe-empty">No contacts. Add a contact to bind a body anchor to a prop surface.</div>';

    panel.innerHTML = `
      <div class="spe-head">
        <span class="spe-title">Props &amp; Contacts (Solarize §17)</span>
        <div style="display:flex;gap:4px;">
          <button class="spe-btn" onclick="PoseArtPropEditor.addProp('chair')">+ Prop</button>
          <button class="spe-btn" onclick="PoseArtPropEditor.addContact()">+ Contact</button>
        </div>
      </div>
      <div class="spe-overlay-wrap"><canvas class="spe-overlay-canvas" id="spe-overlay" width="280" height="210"></canvas></div>
      <div class="spe-section-h">Props (${_props.length})</div>
      ${propsHtml}
      <div class="spe-section-h">Contacts (${_contacts.length})</div>
      ${contactsHtml}
    `;
    drawOverlay();
  }

  function renderContactList() { renderPropList(); }

  function drawOverlay() {
    const canvas = document.getElementById('spe-overlay');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    // grid
    ctx.strokeStyle = 'rgba(30,122,116,0.1)'; ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo((W * i) / 5, 0); ctx.lineTo((W * i) / 5, H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, (H * i) / 5); ctx.lineTo(W, (H * i) / 5); ctx.stroke(); }
    // props
    for (const p of _props) {
      const x = p.transform.x * W, y = p.transform.y * H, w = p.dimensions.w * W, h = p.dimensions.h * H;
      ctx.fillStyle = p.rendering.color + '88'; ctx.strokeStyle = p.rendering.color; ctx.lineWidth = 2;
      ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeRect(x - w / 2, y - h / 2, w, h);
      ctx.fillStyle = '#fff'; ctx.font = '9px monospace'; ctx.textAlign = 'center';
      ctx.fillText(p.propId + ':' + p.type, x, y - h / 2 - 3);
    }
    // contacts (lines from body anchor estimate to prop surface)
    const anchorEstimate = { leftWrist: [0.36, 0.52], rightWrist: [0.64, 0.52], leftHip: [0.44, 0.55], rightHip: [0.56, 0.55], leftAnkle: [0.42, 0.92], rightAnkle: [0.58, 0.92], nose: [0.5, 0.12], leftShoulder: [0.42, 0.25], rightShoulder: [0.58, 0.25] };
    for (const c of _contacts) {
      const a = anchorEstimate[c.anchorA]; const prop = _props.find((p) => `prop:${p.propId}` === c.participantB);
      if (!a || !prop) continue;
      const ax = a[0] * W, ay = a[1] * H; const px = prop.transform.x * W, py = prop.transform.y * H;
      ctx.strokeStyle = c.relation === 'support' ? '#4CAF7D' : '#C9A24C'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#C96A4C'; ctx.beginPath(); ctx.arc(ax, ay, 3, 0, Math.PI * 2); ctx.fill();
    }
    // body anchor estimates (faint)
    ctx.fillStyle = 'rgba(76,175,125,0.4)';
    for (const [name, [x, y]] of Object.entries(anchorEstimate)) { ctx.beginPath(); ctx.arc(x * W, y * H, 2, 0, Math.PI * 2); ctx.fill(); }
  }

  // ---- Migration helper: infer props from description (migration only, §17) ----
  function inferFromDescription(text) {
    if (!text) return;
    const lower = String(text).toLowerCase();
    const lex = [['wall', 'wall'], ['floor', 'floor'], ['ground', 'floor'], ['chair', 'chair'], ['stool', 'stool'], ['bench', 'bench'], ['table', 'table'], ['bed', 'bed'], ['couch', 'couch'], ['sofa', 'couch'], ['railing', 'railing'], ['rail', 'railing'], ['doorframe', 'doorframe'], ['door frame', 'doorframe'], ['platform', 'platform']];
    for (const [kw, type] of lex) {
      if (lower.includes(kw) && !_props.some((p) => p.type === type)) {
        addProp(type);
      }
    }
  }

  global.PoseArtPropEditor = Object.freeze({
    reset, getState, loadState,
    addProp, removeProp, updateProp,
    addContact, removeContact, updateContact,
    renderPropList, renderContactList, drawOverlay,
    inferFromDescription,
    PROP_TYPES, BODY_ANCHORS, PROP_SURFACES,
  });
})(window);
