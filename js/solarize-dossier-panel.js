// ============================================================
// PoseArt Solarize — Dossier Panel UI
// ------------------------------------------------------------
// Injects a "Solarize Validation" panel into the pose-detail sheet
// showing: validation state, person count, support class, contacts,
// anatomy/balance/photography review, camera-coach eligibility,
// render variants, provenance, residual limitations.
// ============================================================

(function (global) {
  'use strict';

  const PANEL_ID = 'solarize-dossier-panel';

  function ensurePanel(sheet) {
    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement('section');
      panel.id = PANEL_ID;
      panel.className = 'solarize-dossier-panel';
      panel.setAttribute('aria-label', 'Solarize pose validation dossier');
      sheet.appendChild(panel);
      injectStyles();
    }
    return panel;
  }

  function injectStyles() {
    if (document.getElementById('solarize-dossier-styles')) return;
    const css = document.createElement('style');
    css.id = 'solarize-dossier-styles';
    css.textContent = `
      .solarize-dossier-panel {
        margin: 14px 16px 8px;
        padding: 12px 14px;
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(15,28,28,0.06), rgba(15,28,28,0.02));
        border: 1px solid rgba(30,122,116,0.22);
        font-size: 12px;
        color: #2C3E50;
      }
      .solarize-dossier-panel .dz-head {
        display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px;
      }
      .solarize-dossier-panel .dz-title {
        font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        color: #1E7A74;
      }
      .solarize-dossier-panel .dz-state {
        font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 999px;
        text-transform: uppercase; letter-spacing: 0.04em;
      }
      .solarize-dossier-panel .dz-state-canonical { background:#1A5649; color:#fff; }
      .solarize-dossier-panel .dz-state-automated_pass_pending_signoff { background:#C9A24C; color:#1a1a1a; }
      .solarize-dossier-panel .dz-state-migrated_pending_review { background:#C96A4C; color:#fff; }
      .solarize-dossier-panel .dz-grid {
        display:grid; grid-template-columns: 1fr 1fr; gap:6px 12px; margin-bottom:8px;
      }
      .solarize-dossier-panel .dz-row { display:flex; justify-content:space-between; gap:6px; }
      .solarize-dossier-panel .dz-k { color:#5D6D7E; font-size:10px; text-transform:uppercase; letter-spacing:0.04em; }
      .solarize-dossier-panel .dz-v { color:#2C3E50; font-weight:600; font-size:11px; }
      .solarize-dossier-panel .dz-section {
        margin-top:8px; padding-top:8px; border-top:1px dashed rgba(30,122,116,0.2);
      }
      .solarize-dossier-panel .dz-section-h {
        font-size:10px; font-weight:700; color:#1E7A74; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:4px;
      }
      .solarize-dossier-panel .dz-roles { display:flex; gap:6px; flex-wrap:wrap; }
      .solarize-dossier-panel .dz-role {
        padding:4px 8px; border-radius:8px; background:rgba(30,122,116,0.1); font-size:10px; font-weight:600; color:#1A5649;
      }
      .solarize-dossier-panel .dz-contact {
        font-size:10px; color:#5D6D7E; padding:2px 0; font-family:ui-monospace,monospace;
      }
      .solarize-dossier-panel .dz-checks { display:flex; gap:4px; flex-wrap:wrap; }
      .solarize-dossier-panel .dz-check {
        font-size:10px; padding:2px 6px; border-radius:6px; display:inline-flex; align-items:center; gap:3px;
      }
      .solarize-dossier-panel .dz-check-ok { background:rgba(76,175,125,0.15); color:#1A5649; }
      .solarize-dossier-panel .dz-check-warn { background:rgba(201,162,76,0.18); color:#8a6a20; }
      .solarize-dossier-panel .dz-check-bad { background:rgba(201,106,76,0.18); color:#8a3a20; }
      .solarize-dossier-panel .dz-variants { display:flex; gap:4px; flex-wrap:wrap; }
      .solarize-dossier-panel .dz-variant {
        font-size:9px; padding:2px 6px; border-radius:5px; background:rgba(45,60,80,0.1); color:#2C3E50;
      }
      .solarize-dossier-panel .dz-residual { font-size:10px; color:#8a6a20; }
      .solarize-dossier-panel .dz-prov { font-size:9px; color:#8aa39e; font-family:ui-monospace,monospace; margin-top:6px; }
      .solarize-dossier-panel .dz-empty { font-size:11px; color:#8aa39e; font-style:italic; }
      .solarize-dossier-panel .dz-people { display:flex; gap:8px; margin-top:6px; }
      .solarize-dossier-panel .dz-person {
        flex:1; padding:6px 8px; border-radius:8px; background:rgba(255,255,255,0.6); border:1px solid rgba(30,122,116,0.15);
      }
      .solarize-dossier-panel .dz-person-h { font-size:10px; font-weight:700; color:#1A5649; margin-bottom:3px; }
      .solarize-dossier-panel .dz-person-j { font-size:9px; color:#5D6D7E; font-family:ui-monospace,monospace; line-height:1.4; }
      @media (prefers-reduced-motion: reduce) { .solarize-dossier-panel * { transition:none!important; animation:none!important; } }
    `;
    document.head.appendChild(css);
  }

  function checkMark(ok, warn) {
    if (ok) return '<span class="dz-check dz-check-ok">✓</span>';
    if (warn) return '<span class="dz-check dz-check-warn">▲</span>';
    return '<span class="dz-check dz-check-bad">✗</span>';
  }

  function render(dossier) {
    if (!dossier) {
      return '<div class="dz-empty">No Solarize dossier for this pose (single-person poses do not require a couple dossier).</div>';
    }
    const vs = dossier.validationStatus || {};
    const stateClass = vs.state === 'canonical' ? 'dz-state-canonical'
      : vs.state === 'automated_pass_pending_signoff' ? 'dz-state-automated_pass_pending_signoff'
      : 'dz-state-migrated_pending_review';
    const stateLabel = vs.state === 'canonical' ? 'Canonical'
      : vs.state === 'automated_pass_pending_signoff' ? 'Automated pass · awaiting sign-off'
      : 'Pending review';

    const anatomyOk = !dossier.anatomy.issues.some((i) => i.severity === 'high');
    const anatomyWarn = dossier.anatomy.issues.some((i) => i.severity === 'medium');
    const balanceOk = dossier.balance.stable;
    const balanceWarn = dossier.balance.issues.some((i) => i.severity === 'medium');
    const contactsOk = !dossier.contacts.issues.some((i) => i.severity === 'high');
    const contactsWarn = dossier.contacts.issues.some((i) => i.severity === 'medium');
    const photoOk = !dossier.photography.issues.some((i) => i.severity === 'high');
    const photoWarn = dossier.photography.issues.some((i) => i.severity !== 'low');

    const peopleHtml = (dossier.targetScene?.targetPeople || []).map((tp) => {
      const sk = tp.canonicalSkeleton || {};
      const joints = Object.entries(sk).slice(0, 6).map(([k, v]) => `${k}:${v}°`).join(' ');
      return `<div class="dz-person"><div class="dz-person-h">${tp.roleName} (${tp.roleId})</div><div class="dz-person-j">${joints}</div></div>`;
    }).join('');

    const contactList = Array.isArray(dossier.contacts) ? dossier.contacts
      : (dossier.targetScene && Array.isArray(dossier.targetScene.contacts) ? dossier.targetScene.contacts : []);
    const contactsHtml = contactList.map((c) => {
      return `<div class="dz-contact">${c.id}: ${c.participantA}.${c.anchorA} ↔ ${c.participantB}.${c.anchorB} (${c.relation})</div>`;
    }).join('') || '<div class="dz-contact">— none —</div>';

    const variantsHtml = (dossier.renderVariants || []).map((v) => {
      return `<span class="dz-variant">${v.view}${v.mirrored ? ' (mirrored)' : ''}</span>`;
    }).join('');

    const residualHtml = (dossier.residualLimitations || []).length
      ? dossier.residualLimitations.map((r) => `<div class="dz-residual">▲ ${r}</div>`).join('')
      : '<div class="dz-residual" style="color:#1A5649">none</div>';

    const blockingHtml = (vs.blocking || []).length
      ? vs.blocking.map((b) => `<div class="dz-residual" style="color:#8a3a20">✗ ${b}</div>`).join('')
      : '';

    return `
      <div class="dz-head">
        <span class="dz-title">Solarize Validation</span>
        <span class="dz-state ${stateClass}">${stateLabel}</span>
      </div>
      <div class="dz-grid">
        <div class="dz-row"><span class="dz-k">People</span><span class="dz-v">${dossier.personCount}</span></div>
        <div class="dz-row"><span class="dz-k">Support</span><span class="dz-v">${dossier.supportClass}</span></div>
        <div class="dz-row"><span class="dz-k">Revision</span><span class="dz-v">v${dossier.revision}</span></div>
        <div class="dz-row"><span class="dz-k">Schema</span><span class="dz-v">v${dossier.schemaRevision}</span></div>
      </div>
      <div class="dz-people">${peopleHtml}</div>
      <div class="dz-section">
        <div class="dz-section-h">Checks</div>
        <div class="dz-checks">
          ${checkMark(dossier.schemaValidation.ok, false)} <span style="font-size:10px">schema</span>
          ${checkMark(anatomyOk, anatomyWarn)} <span style="font-size:10px">anatomy</span>
          ${checkMark(balanceOk, balanceWarn)} <span style="font-size:10px">balance</span>
          ${checkMark(contactsOk, contactsWarn)} <span style="font-size:10px">contacts</span>
          ${checkMark(photoOk, photoWarn)} <span style="font-size:10px">photography</span>
          ${checkMark(dossier.cameraCoachEligibility.eligible, false)} <span style="font-size:10px">coach-eligible</span>
        </div>
      </div>
      <div class="dz-section">
        <div class="dz-section-h">Contacts (${contactList.length})</div>
        ${contactsHtml}
      </div>
      <div class="dz-section">
        <div class="dz-section-h">Render variants</div>
        <div class="dz-variants">${variantsHtml}</div>
      </div>
      ${(vs.blocking || []).length ? `<div class="dz-section"><div class="dz-section-h" style="color:#8a3a20">Blocking</div>${blockingHtml}</div>` : ''}
      <div class="dz-section">
        <div class="dz-section-h">Residual limitations</div>
        ${residualHtml}
      </div>
      <div class="dz-prov">provenance: ${dossier.provenance.source} · migrated by ${dossier.provenance.migratedBy}</div>
    `;
  }

  function update(poseId) {
    const sheet = document.getElementById('pose-detail-sheet') || document.getElementById('screen-session-setup');
    if (!sheet) return;
    const panel = ensurePanel(sheet);
    const dossiers = global.PoseArtDossiers;
    if (!dossiers) { panel.innerHTML = '<div class="dz-empty">Dossiers loading…</div>'; return; }
    const dossier = dossiers.get(poseId);
    panel.innerHTML = render(dossier);
    panel.style.display = dossier ? 'block' : 'none';
  }

  global.PoseArtDossierPanel = Object.freeze({ update, render });
})(window);
