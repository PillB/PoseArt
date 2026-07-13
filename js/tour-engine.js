// PoseArt v2.1 — persistent tour/sequence engine.
(function(global) {
  'use strict';
  const SECTION_TYPES = ['glamour', 'dynamic', 'couple', 'fine-art', 'custom'];
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const library = () => (typeof POSES_LIBRARY !== 'undefined' ? POSES_LIBRARY : {});

  class TourEngine {
    constructor() { this.session = null; }

    createTour(name, description = '') {
      const tour = { id: uid('tour'), name: String(name || 'Untitled Tour').trim(), description: String(description || '').trim(), sections: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      return global.saveTour(tour);
    }

    addSection(tourId, sectionName, sectionType = 'custom') {
      const tour = global.getTour(tourId);
      if (!tour) throw new Error('Tour not found');
      const section = { id: uid('section'), name: String(sectionName || `Section ${tour.sections.length + 1}`).trim(), type: SECTION_TYPES.includes(sectionType) ? sectionType : 'custom', poseIds: [] };
      tour.sections.push(section); tour.updatedAt = new Date().toISOString(); global.saveTour(tour); return clone(section);
    }

    addPoseToSection(tourId, sectionId, poseId) {
      const { tour, section } = this._section(tourId, sectionId);
      if (!library()[poseId] && !String(poseId).startsWith('custom-')) throw new Error('Pose not found');
      if (!section.poseIds.includes(poseId)) section.poseIds.push(poseId);
      tour.updatedAt = new Date().toISOString(); global.saveTour(tour); return clone(section);
    }

    removePoseFromSection(tourId, sectionId, poseId) {
      const { tour, section } = this._section(tourId, sectionId);
      section.poseIds = section.poseIds.filter(id => String(id) !== String(poseId));
      tour.updatedAt = new Date().toISOString(); global.saveTour(tour); return clone(section);
    }

    reorderSection(tourId, sectionId, newOrder) {
      const { tour, section } = this._section(tourId, sectionId);
      if (Array.isArray(newOrder)) {
        const allowed = new Set(section.poseIds.map(String));
        if (newOrder.length !== section.poseIds.length || newOrder.some(id => !allowed.has(String(id)))) throw new Error('Invalid pose order');
        section.poseIds = newOrder.slice();
      } else {
        const from = tour.sections.findIndex(item => String(item.id) === String(sectionId));
        const to = Math.max(0, Math.min(Number(newOrder) || 0, tour.sections.length - 1));
        tour.sections.splice(to, 0, tour.sections.splice(from, 1)[0]);
      }
      tour.updatedAt = new Date().toISOString(); global.saveTour(tour); return clone(tour);
    }

    startTour(tourId) {
      const tour = global.getTour(tourId);
      if (!tour || !tour.sections.some(section => section.poseIds.length)) throw new Error('Add at least one pose before starting');
      const firstSectionIndex = tour.sections.findIndex(section => section.poseIds.length);
      this.session = { tourId: tour.id, sectionIndex: firstSectionIndex, poseIndex: 0, startedAt: new Date().toISOString(), captures: [] };
      return this.getState();
    }

    getState() {
      if (!this.session) return null;
      const tour = global.getTour(this.session.tourId);
      if (!tour) return null;
      const section = tour.sections[this.session.sectionIndex];
      return { ...clone(this.session), tour: clone(tour), section: clone(section), poseId: section?.poseIds[this.session.poseIndex] || null };
    }

    nextPose() { return this._movePose(1); }
    prevPose() { return this._movePose(-1); }
    nextSection() { return this._moveSection(1); }
    prevSection() { return this._moveSection(-1); }

    jumpToPose(poseId) {
      const state = this.getState(); if (!state) return null;
      for (let s = 0; s < state.tour.sections.length; s += 1) {
        const p = state.tour.sections[s].poseIds.findIndex(id => String(id) === String(poseId));
        if (p > -1) { this.session.sectionIndex = s; this.session.poseIndex = p; return this.getState(); }
      }
      return null;
    }

    captureInTour(dataUrl, options = {}) {
      const state = this.getState(); if (!state) throw new Error('No active tour session');
      const pose = library()[state.poseId] || { name: options.poseName || 'Custom Pose' };
      const item = { id: Date.now(), dataUrl: dataUrl || null, isSim: !dataUrl, poseId: state.poseId, poseName: pose.name, score: options.score ?? 100, timestamp: new Date().toISOString(), favorite: false, filter: 'original', tourId: state.tour.id, sectionId: state.section.id, sectionName: state.section.name };
      global.addToGallery(item); this.session.captures.push(item.id); return clone(item);
    }

    getTourPhotos(tourId, sectionId) {
      return global.getGallery().filter(item => String(item.tourId) === String(tourId) && (sectionId == null || String(item.sectionId) === String(sectionId)));
    }

    searchPosesInTour(query) {
      const state = this.getState(); if (!state) return [];
      const needle = String(query || '').trim().toLowerCase();
      const ids = [...new Set(state.tour.sections.flatMap(section => section.poseIds))];
      return ids.map(id => library()[id]).filter(Boolean).filter(pose => !needle || `${pose.name} ${pose.instructions || ''}`.toLowerCase().includes(needle));
    }

    _section(tourId, sectionId) {
      const tour = global.getTour(tourId); if (!tour) throw new Error('Tour not found');
      const section = tour.sections.find(item => String(item.id) === String(sectionId)); if (!section) throw new Error('Section not found');
      return { tour, section };
    }
    _movePose(delta) {
      const state = this.getState(); if (!state) return null;
      const next = this.session.poseIndex + delta;
      if (next >= 0 && next < state.section.poseIds.length) this.session.poseIndex = next;
      else if (delta > 0) return this._moveSection(1);
      else if (delta < 0) return this._moveSection(-1, true);
      return this.getState();
    }
    _moveSection(delta, lastPose = false) {
      const state = this.getState(); if (!state) return null;
      let index = this.session.sectionIndex + delta;
      while (index >= 0 && index < state.tour.sections.length && !state.tour.sections[index].poseIds.length) index += delta;
      if (index < 0 || index >= state.tour.sections.length) return this.getState();
      this.session.sectionIndex = index;
      this.session.poseIndex = lastPose ? state.tour.sections[index].poseIds.length - 1 : 0;
      return this.getState();
    }
  }

  global.TourEngine = TourEngine;
  global.tourEngine = global.tourEngine || new TourEngine();
})(window);
