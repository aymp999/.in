// AYMP Planetary Research Database bridge + 9-planet cards
(function () {
  'use strict';

  const PLANETARY_DB_URL = 'data/planetary_research_database_v1.json';
  const GUIDANCE_DB_URL = 'data/aymp_cosmic_yantra_herb_tantric_guidance_v2.json';
  const originalFetch = window.fetch.bind(window);
  let planetaryPromise = null;

  function loadPlanetaryDatabase() {
    if (!planetaryPromise) {
      planetaryPromise = originalFetch(PLANETARY_DB_URL, { cache: 'no-store' }).then(function (response) {
        if (!response.ok) throw new Error('Planetary Research Database could not be loaded.');
        return response.json();
      });
    }
    return planetaryPromise;
  }

  function mergePlanetaryResearch(guidanceDb, planetaryDb) {
    const result = Object.assign({}, guidanceDb);
    const sourcePlanets = Array.isArray(planetaryDb.planets) ? planetaryDb.planets : [];
    result.planetary_analysis = Object.assign({}, result.planetary_analysis || {});
    result.planetary_analysis.planets = sourcePlanets.map(function (planet) {
      const research = planet.research || {};
      return {
        id: planet.id, name_en: planet.name_en, name_ta: planet.name_ta, order: planet.order,
        planetary_position: research.position || '', house: research.house || '', sign: research.sign || '',
        strength_or_challenge: [research.strength || '', research.challenge || ''].filter(Boolean).join(' / '),
        research_interpretation: research.research_interpretation || '', affected_status: research.affected_status || 'pending',
        source_references: research.source_references || [], verification_status: research.verification_status || 'pending',
        approved_links: planet.approved_links || { herb_ids: [], yantra_ids: [], mantra_ids: [], talisman_ids: [] }
      };
    });
    result.planetary_research_database = {
      id: planetaryDb.database && planetaryDb.database.id,
      name: planetaryDb.database && planetaryDb.database.name,
      version: planetaryDb.database && planetaryDb.database.version,
      status_policy: planetaryDb.database && planetaryDb.database.status_policy
    };
    return result;
  }

  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf(GUIDANCE_DB_URL) === -1) return originalFetch(input, init);
    return Promise.all([
      originalFetch(input, init).then(function (response) {
        if (!response.ok) throw new Error('Guidance database could not be loaded.');
        return response.json();
      }),
      loadPlanetaryDatabase()
    ]).then(function (values) {
      return new Response(JSON.stringify(mergePlanetaryResearch(values[0], values[1])), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    });
  };

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>\"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c];
    });
  }

  function addStyles() {
    if (document.getElementById('aympPlanetCardsCSS')) return;
    const style = document.createElement('style');
    style.id = 'aympPlanetCardsCSS';
    style.textContent = `
      .aymp-planetary-section{margin-top:18px;padding:15px;border:1px solid rgba(255,215,120,.18);border-radius:18px;background:rgba(255,255,255,.025)}
      .aymp-planetary-section h3{margin:0 0 4px}.aymp-planetary-subtitle{margin:0 0 12px;opacity:.65;font-size:.8rem}
      .aymp-planet-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
      .aymp-planet-card{position:relative;min-height:92px;padding:13px;border:1px solid rgba(255,215,120,.18);border-radius:13px;background:linear-gradient(145deg,rgba(255,215,120,.09),rgba(255,255,255,.035));color:#fff;text-align:left;cursor:pointer}
      .aymp-planet-card:hover{border-color:#ffd66a}.aymp-planet-order{position:absolute;right:9px;top:7px;color:#ffd66a;font-size:.7rem}.aymp-planet-card strong{display:block;font-size:.98rem}.aymp-planet-card small{display:block;opacity:.62;margin-top:4px}.aymp-planet-status{display:inline-block;margin-top:9px;font-size:.65rem;color:#ffd66a}
      .aymp-planet-overlay{position:fixed;inset:0;z-index:100002;background:rgba(0,0,0,.84);padding:14px;overflow:auto}.aymp-planet-detail{position:relative;max-width:650px;margin:5vh auto;padding:19px;border-radius:18px;background:#171026;color:#fff;border:1px solid rgba(255,215,120,.25);box-shadow:0 20px 70px #000}.aymp-planet-detail-head{display:flex;justify-content:space-between;align-items:start}.aymp-planet-detail-head h3{display:inline;margin:0 8px}.aymp-planet-detail-head small{opacity:.62}.aymp-planet-detail-head>div>span{color:#ffd66a}.aymp-planet-detail-head button{border:0;background:none;color:#fff;font-size:30px;cursor:pointer}
      .aymp-planet-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:14px}.aymp-planet-fields label{font-size:.7rem;opacity:.68}.aymp-planet-fields input{display:block;width:100%;margin-top:3px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#ffd66a;box-sizing:border-box}
      .aymp-planet-note{margin-top:10px;padding:11px;border-radius:10px;background:rgba(255,215,120,.06)}.aymp-planet-note p{margin:5px 0 0;opacity:.7;font-size:.8rem;line-height:1.4}.aymp-planet-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:9px}.aymp-planet-links div{padding:9px;border:1px dashed rgba(255,255,255,.13);border-radius:8px;font-size:.75rem}.aymp-planet-links span{display:block;margin-top:3px;color:#ffd66a;font-size:.7rem}.aymp-planet-verification{font-size:.7rem;opacity:.5}
      .aymp-sacred-mantra-box{position:relative!important;padding:14px 16px!important;border:1px solid rgba(255,215,0,.9)!important;border-radius:15px!important;background:radial-gradient(circle at 50% 0%,rgba(255,215,0,.20),rgba(255,255,255,.025) 72%)!important;box-shadow:0 0 12px rgba(255,215,0,.48),0 0 30px rgba(255,215,0,.22),inset 0 0 18px rgba(255,215,0,.08)!important;animation:aympSacredMantraPulse 2.4s ease-in-out infinite!important}
      .aymp-sacred-mantra-box b{color:#ffe36e!important;text-shadow:0 0 8px rgba(255,215,0,.9),0 0 18px rgba(255,215,0,.4)!important}
      .aymp-sacred-mantra-box span{color:#fff4b0!important;text-shadow:0 0 7px rgba(255,215,0,.35)!important}
      @keyframes aympSacredMantraPulse{0%,100%{transform:scale(1);box-shadow:0 0 12px rgba(255,215,0,.42),0 0 28px rgba(255,215,0,.18),inset 0 0 16px rgba(255,215,0,.06)!important}50%{transform:scale(1.012);box-shadow:0 0 22px rgba(255,215,0,.82),0 0 46px rgba(255,215,0,.30),inset 0 0 24px rgba(255,215,0,.12)!important}}
      @media(max-width:600px){.aymp-planet-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.aymp-planet-fields,.aymp-planet-links{grid-template-columns:1fr}.aymp-planet-detail{margin:2vh auto;padding:14px}.aymp-sacred-mantra-box{padding:12px 13px!important}}
    `;
    document.head.appendChild(style);
  }

  async function mountCards() {
    addStyles();
    const form = document.getElementById('guidanceForm');
    if (!form || document.getElementById('aympPlanetaryResearchSection')) return;
    try {
      const db = await loadPlanetaryDatabase();
      const section = document.createElement('section');
      section.id = 'aympPlanetaryResearchSection';
      section.className = 'aymp-planetary-section';
      section.innerHTML = '<h3>🌌 9 Planetary Research</h3><p class="aymp-planetary-subtitle">Select a planet to view its current AYMP research record.</p><div class="aymp-planet-grid">' + (db.planets || []).map(function (p) {
        return '<button type="button" class="aymp-planet-card" data-planet="' + esc(p.id) + '"><span class="aymp-planet-order">' + esc(p.order) + '</span><strong>' + esc(p.name_en) + '</strong><small>' + esc(p.name_ta) + '</small><span class="aymp-planet-status">' + esc((p.research || {}).verification_status || 'pending') + '</span></button>';
      }).join('') + '</div>';
      form.appendChild(section);

      section.querySelectorAll('.aymp-planet-card').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const p = (db.planets || []).find(function (item) { return item.id === btn.dataset.planet; });
          if (!p) return;
          const r = p.research || {}, l = p.approved_links || {};
          const overlay = document.createElement('div'); overlay.className = 'aymp-planet-overlay';
          overlay.innerHTML = '<div class="aymp-planet-detail"><div class="aymp-planet-detail-head"><div><span>' + esc(p.order) + '</span><h3>' + esc(p.name_en) + '</h3><small>' + esc(p.name_ta) + '</small></div><button type="button" id="aympPlanetClose">×</button></div>' +
            '<div class="aymp-planet-fields"><label>Planetary Position<input value="' + esc(r.position) + '" readonly></label><label>House<input value="' + esc(r.house) + '" readonly></label><label>Sign<input value="' + esc(r.sign) + '" readonly></label><label>Strength<input value="' + esc(r.strength) + '" readonly></label><label>Challenge<input value="' + esc(r.challenge) + '" readonly></label><label>Affected Status<input value="' + esc(r.affected_status || 'pending') + '" readonly></label></div>' +
            '<div class="aymp-planet-note"><b>Research Interpretation</b><p>' + esc(r.research_interpretation || 'Pending approved AYMP research entry.') + '</p></div>' +
            '<div class="aymp-planet-links"><div><b>Approved Herbs</b><span>' + esc((l.herb_ids || []).join(', ') || 'Pending') + '</span></div><div><b>Approved Yantras</b><span>' + esc((l.yantra_ids || []).join(', ') || 'Pending') + '</span></div><div class="aymp-sacred-mantra-box"><b>AYMP Sacred Mantra</b><span>' + esc((l.mantra_ids || []).join(', ') || 'Pending') + '</span></div><div><b>Talisman Records</b><span>' + esc((l.talisman_ids || []).join(', ') || 'Pending') + '</span></div></div>' +
            '<p class="aymp-planet-verification">Verification: ' + esc(r.verification_status || 'pending') + '</p></div>';
          document.body.appendChild(overlay); overlay.querySelector('#aympPlanetClose').onclick = function () { overlay.remove(); }; overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
        });
      });
    } catch (error) { console.error('AYMP Planetary Research:', error); }
  }

  window.AYMPPlanetaryResearch = { databaseUrl: PLANETARY_DB_URL, version: '1.0.0', load: loadPlanetaryDatabase };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountCards); else mountCards();
})();
