/**
 * TuningPortal Core Engine
 * Cascading vehicle dropdowns, specs loader, dynamic dyno chart, fuel gauge, and modals.
 */

(function () {
  'use strict';

  let vehicleTree = null;
  let currentSpecs = null;
  let currentStage = 'stage1';
  let dynoChartInstance = null;
  let selectedOptions = new Set();

  // Elements
  const makeSelect = document.getElementById('make-select');
  const modelSelect = document.getElementById('model-select');
  const genSelect = document.getElementById('gen-select');
  const engineSelect = document.getElementById('engine-select');
  const calcBtn = document.getElementById('calc-btn');
  const resultsContainer = document.getElementById('results-view');

  // Load tree data
  async function loadTreeData() {
    try {
      // First try API
      const res = await fetch('/api/makes');
      if (res.ok) {
        const data = await res.json();
        populateMakes(data.makes.map(m => m.name));
        return;
      }
    } catch (e) {
      console.log('Falling back to static tree...');
    }

    try {
      const res = await fetch('/data/tree.json');
      if (res.ok) {
        vehicleTree = await res.json();
        populateMakes(Object.keys(vehicleTree));
      }
    } catch (err) {
      console.error('Failed to load vehicle tree:', err);
    }
  }

  function populateMakes(makes) {
    if (!makeSelect) return;
    makeSelect.innerHTML = '<option value="0">Selecteer uw Merk</option>';

    makes.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      makeSelect.appendChild(opt);
    });

    // Default select Volkswagen if available
    if (makes.includes('Volkswagen')) {
      makeSelect.value = 'Volkswagen';
      onMakeChange();
    }
  }

  async function onMakeChange() {
    const make = makeSelect.value;
    modelSelect.innerHTML = '<option value="0">Selecteer uw Model</option>';
    genSelect.innerHTML = '<option value="0">Selecteer uw Bouwjaar</option>';
    engineSelect.innerHTML = '<option value="0">Selecteer uw Type</option>';

    modelSelect.disabled = true;
    genSelect.disabled = true;
    engineSelect.disabled = true;

    if (!make || make === '0') return;

    let models = [];
    try {
      const res = await fetch(`/api/models?make=${encodeURIComponent(make)}`);
      if (res.ok) {
        const data = await res.json();
        models = data.models.map(m => m.name);
      }
    } catch (e) {}

    if (!models.length && vehicleTree && vehicleTree[make]) {
      models = Object.keys(vehicleTree[make].models);
    }

    models.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      modelSelect.appendChild(opt);
    });

    modelSelect.disabled = false;

    // Default select Golf if Volkswagen
    if (make === 'Volkswagen' && models.includes('Golf')) {
      modelSelect.value = 'Golf';
      onModelChange();
    }
  }

  async function onModelChange() {
    const make = makeSelect.value;
    const model = modelSelect.value;
    genSelect.innerHTML = '<option value="0">Selecteer uw Bouwjaar</option>';
    engineSelect.innerHTML = '<option value="0">Selecteer uw Type</option>';

    genSelect.disabled = true;
    engineSelect.disabled = true;

    if (!model || model === '0') return;

    let gens = [];
    try {
      const res = await fetch(`/api/generations?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`);
      if (res.ok) {
        const data = await res.json();
        gens = data.generations.map(g => g.name);
      }
    } catch (e) {}

    if (!gens.length && vehicleTree && vehicleTree[make]?.models?.[model]) {
      gens = Object.keys(vehicleTree[make].models[model].generations);
    }

    gens.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      genSelect.appendChild(opt);
    });

    genSelect.disabled = false;

    // Default select Golf 7 if available
    const golf7 = gens.find(g => g.includes('Golf 7 - 2012'));
    if (golf7) {
      genSelect.value = golf7;
      onGenChange();
    }
  }

  async function onGenChange() {
    const make = makeSelect.value;
    const model = modelSelect.value;
    const gen = genSelect.value;
    engineSelect.innerHTML = '<option value="0">Selecteer uw Type</option>';
    engineSelect.disabled = true;

    if (!gen || gen === '0') return;

    let engines = [];
    try {
      const res = await fetch(`/api/engines?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&generation=${encodeURIComponent(gen)}`);
      if (res.ok) {
        const data = await res.json();
        engines = data.engines;
      }
    } catch (e) {}

    if (!engines.length && vehicleTree && vehicleTree[make]?.models?.[model]?.generations?.[gen]) {
      engines = vehicleTree[make].models[model].generations[gen].engines;
    }

    engines.forEach(eng => {
      const opt = document.createElement('option');
      opt.value = eng.name;
      opt.textContent = eng.name;
      opt.setAttribute('data-id', eng.id);
      engineSelect.appendChild(opt);
    });

    engineSelect.disabled = false;

    // Default select 1.2 TSI 85pk if available
    const tsi85 = engines.find(e => e.name.includes('1.2 TSI 85pk'));
    if (tsi85) {
      engineSelect.value = tsi85.name;
      loadSpecs();
    }
  }

  // Load specs for selected engine
  async function loadSpecs() {
    const make = makeSelect.value;
    const model = modelSelect.value;
    const gen = genSelect.value;
    const engine = engineSelect.value;

    if (!make || !model || !gen || !engine || engine === '0') return;

    try {
      const res = await fetch(`/api/tuning-specs?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&generation=${encodeURIComponent(gen)}&engine=${encodeURIComponent(engine)}`);
      if (res.ok) {
        const data = await res.json();
        currentSpecs = data.vehicle;
        renderResults();
        return;
      }
    } catch (e) {}

    // Fallback: try per-make json
    try {
      const slug = make.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const res = await fetch(`/data/makes_data/${slug}.json`);
      if (res.ok) {
        const makeData = await res.json();
        const engObj = makeData.models[model].generations[gen].engines[engine];
        currentSpecs = {
          make,
          model,
          generation: gen,
          engine,
          ...engObj
        };
        renderResults();
      }
    } catch (err) {
      console.error('Error fetching specs:', err);
    }
  }

  // Render results
  function renderResults() {
    if (!currentSpecs) return;

    if (resultsContainer) {
      resultsContainer.style.display = 'block';
    }

    // Vehicle Title & Fuel badge
    const titleEl = document.getElementById('res-vehicle-title');
    const fuelBadgeEl = document.getElementById('res-fuel-badge');
    if (titleEl) {
      titleEl.textContent = `${currentSpecs.make} ${currentSpecs.model} ${currentSpecs.engine}`;
    }
    if (fuelBadgeEl) {
      fuelBadgeEl.textContent = currentSpecs.fuel || 'Benzine';
      fuelBadgeEl.className = 'badge-fuel ' + (currentSpecs.fuel || '').toLowerCase();
    }

    updateStageDisplay();
    renderEngineSpecs();
    renderExtraOptions();
    renderDynoGraph();
    renderFuelGauge();

    // Scroll smoothly to results if calculated
    if (window.innerWidth <= 768 && resultsContainer) {
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Update stats according to stage
  function updateStageDisplay() {
    if (!currentSpecs) return;
    const stgData = currentSpecs[currentStage] || currentSpecs.stage1;

    // Vermogen
    const hpPctEl = document.getElementById('res-hp-pct');
    const hpValEl = document.getElementById('res-hp-val');
    const hpGainEl = document.getElementById('res-hp-gain');
    const hpOrigEl = document.getElementById('res-hp-orig');

    if (hpPctEl) hpPctEl.textContent = `+${stgData.hp_pct}%`;
    if (hpValEl) hpValEl.textContent = `${stgData.tuned_hp} hp`;
    if (hpGainEl) hpGainEl.innerHTML = `<svg width="18" height="18" fill="#10b981" viewBox="0 0 210 210"><path d="M179.07,105L30.93,210V0L179.07,105z"/></svg>+${stgData.hp_gain} hp`;
    if (hpOrigEl) hpOrigEl.innerHTML = `<b>Original:</b> ${stgData.orig_hp} hp`;

    // Koppel
    const nmPctEl = document.getElementById('res-nm-pct');
    const nmValEl = document.getElementById('res-nm-val');
    const nmGainEl = document.getElementById('res-nm-gain');
    const nmOrigEl = document.getElementById('res-nm-orig');

    if (nmPctEl) nmPctEl.textContent = `+${stgData.nm_pct}%`;
    if (nmValEl) nmValEl.textContent = `${stgData.tuned_nm} nm`;
    if (nmGainEl) nmGainEl.innerHTML = `<svg width="18" height="18" fill="#10b981" viewBox="0 0 210 210"><path d="M179.07,105L30.93,210V0L179.07,105z"/></svg>+${stgData.nm_gain} nm`;
    if (nmOrigEl) nmOrigEl.innerHTML = `<b>Original:</b> ${stgData.orig_nm} nm`;

    // Brandstof
    const fuelPctEl = document.getElementById('res-fuel-pct');
    const fuelValEl = document.getElementById('res-fuel-val');
    const fuelDiffEl = document.getElementById('res-fuel-diff');
    const fuelOrigEl = document.getElementById('res-fuel-orig');

    if (fuelPctEl) fuelPctEl.textContent = `+${stgData.fuel_pct}%`;
    if (fuelValEl) fuelValEl.textContent = `${stgData.tuned_fuel} L/100km`;
    if (fuelDiffEl) fuelDiffEl.innerHTML = `<svg width="18" height="18" fill="#10b981" viewBox="0 0 210 210"><path d="M179.07,105L30.93,210V0L179.07,105z"/></svg>${stgData.fuel_diff} L/100km`;
    if (fuelOrigEl) fuelOrigEl.innerHTML = `<b>Original:</b> ${stgData.orig_fuel} L/100km`;

    // Notice text
    const noticeEl = document.getElementById('res-stage-notice');
    if (noticeEl) {
      if (currentStage === 'stage1') {
        noticeEl.textContent = 'Raadpleeg uw tuner voor meer informatie over de mogelijkheden en voordelen van Stage 2 en Stage 3 tuning.';
      } else if (currentStage === 'stage2') {
        noticeEl.textContent = 'Stage 2 vereist mechanische aanpassingen (bijv. sportdownpipe / decat, upgraded intercooler en inlaatsysteem) voor optimaal vermogen.';
      } else if (currentStage === 'stage3') {
        noticeEl.textContent = 'Stage 3 omvat een geüpgradede hybride turbocompressor, injectoren, hogedruk brandstofpomp en op maat gemaakte dyno kalibratie.';
      } else if (currentStage === 'eco') {
        noticeEl.textContent = 'Eco Chiptuning focust op koppelverhoging bij lage toeren voor maximaal brandstofrendement en verlaagde CO2-uitstoot.';
      }
    }
  }

  // Render Engine Specs
  function renderEngineSpecs() {
    const listEl = document.getElementById('res-specs-list');
    if (!listEl || !currentSpecs) return;

    const specs = [
      { label: 'Cilinderinhoud', value: currentSpecs.displacement || '1197 CC' },
      { label: 'Compressieverhouding', value: currentSpecs.compression || '10,5 : 1' },
      { label: 'Type ECU', value: currentSpecs.ecu_type || 'Bosch MED17.5.21' },
      { label: 'Boring X slag', value: currentSpecs.bore_stroke || '71,0 X 75,6 mm' },
      { label: 'Motornummer', value: currentSpecs.engine_code || 'CBZA' }
    ];

    listEl.innerHTML = specs.map(s => `
      <div class="specs-row">
        <span class="specs-label">${s.label}</span>
        <span class="specs-value">${s.value}</span>
      </div>
    `).join('');
  }

  // Render Extra Options
  function renderExtraOptions() {
    const gridEl = document.getElementById('res-options-grid');
    if (!gridEl || !currentSpecs) return;

    const options = currentSpecs.options || [
      { id: 'hard_cut', name: 'Hard cut limiter' },
      { id: 'pops_bangs', name: 'Pops & Bangs' },
      { id: 'egr_off', name: 'EGR OFF' },
      { id: 'adblue_off', name: 'Ad blue OFF' },
      { id: 'dpf_off', name: 'DPF OFF' },
      { id: 'swirl_flaps', name: 'Swirl flaps' },
      { id: 'decat', name: 'Decat' },
      { id: 'immo_off', name: 'IMMO off' },
      { id: 'vmax', name: 'VMAX verwijdering' },
      { id: 'start_stop', name: 'Start-Stop OFF' }
    ];

    gridEl.innerHTML = options.map(opt => `
      <div class="option-chip ${selectedOptions.has(opt.id) ? 'selected' : ''}" data-opt-id="${opt.id}" data-opt-name="${opt.name}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" width="18" height="18">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
        </svg>
        <span>${opt.name}</span>
      </div>
    `).join('');

    // Attach click handlers
    gridEl.querySelectorAll('.option-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.getAttribute('data-opt-id');
        if (selectedOptions.has(id)) {
          selectedOptions.delete(id);
          chip.classList.remove('selected');
        } else {
          selectedOptions.add(id);
          chip.classList.add('selected');
        }
      });
    });
  }

  // Render Dyno Graph
  function renderDynoGraph() {
    const canvas = document.getElementById('dyno-canvas');
    if (!canvas || !currentSpecs) return;

    const ctx = canvas.getContext('2d');
    const dyno = currentSpecs.dyno || {
      rpm: [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500],
      orig_hp: [35, 52, 68, 78, 85, 85, 84, 82, 80, 75, 68],
      tuned_hp: [55, 82, 110, 128, 138, 140, 139, 138, 135, 128, 118],
      orig_nm: [120, 155, 160, 160, 155, 145, 135, 120, 105, 90, 75],
      tuned_nm: [170, 230, 235, 235, 230, 215, 195, 175, 150, 125, 100]
    };

    // If Chart.js is loaded, use Chart.js
    if (window.Chart) {
      if (dynoChartInstance) {
        dynoChartInstance.destroy();
      }

      dynoChartInstance = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: dyno.rpm.map(r => r + ' rpm'),
          datasets: [
            {
              label: 'Origineel Vermogen (hp)',
              data: dyno.orig_hp,
              borderColor: 'rgba(148, 163, 184, 0.7)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.35,
              pointRadius: 2,
              yAxisID: 'y'
            },
            {
              label: 'Tuned Vermogen (hp)',
              data: dyno.tuned_hp,
              borderColor: '#0685c5',
              backgroundColor: 'rgba(6, 133, 197, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointRadius: 3,
              pointHoverRadius: 6,
              yAxisID: 'y'
            },
            {
              label: 'Origineel Koppel (Nm)',
              data: dyno.orig_nm,
              borderColor: 'rgba(251, 191, 36, 0.6)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.35,
              pointRadius: 2,
              yAxisID: 'y1'
            },
            {
              label: 'Tuned Koppel (Nm)',
              data: dyno.tuned_nm,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointRadius: 3,
              pointHoverRadius: 6,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              labels: {
                color: '#cbd5e1',
                font: { family: 'Open Sans', size: 11 }
              }
            },
            tooltip: {
              backgroundColor: '#0f172a',
              titleColor: '#fff',
              bodyColor: '#e2e8f0',
              borderColor: '#334155',
              borderWidth: 1
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
              ticks: { color: '#94a3b8' }
            },
            y: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'Vermogen (hp)', color: '#0685c5' },
              grid: { color: 'rgba(255, 255, 255, 0.06)' },
              ticks: { color: '#0685c5' }
            },
            y1: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: 'Koppel (Nm)', color: '#10b981' },
              grid: { drawOnChartArea: false },
              ticks: { color: '#10b981' }
            }
          }
        }
      });
      return;
    }

    // Direct High-Resolution HTML5 Canvas Dyno Curve Fallback
    const width = canvas.width = canvas.parentElement.clientWidth || 450;
    const height = canvas.height = 300;

    ctx.clearRect(0, 0, width, height);

    // Draw dark background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 40; x < width - 20; x += (width - 60) / 5) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, height - 30);
      ctx.stroke();
    }
    for (let y = 30; y < height - 30; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Draw curves
    const maxVal = Math.max(...dyno.tuned_nm, ...dyno.tuned_hp) * 1.15;
    function plot(points, color, dashed) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = dashed ? 2 : 3;
      if (dashed) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);

      points.forEach((val, i) => {
        const x = 45 + i * ((width - 70) / (points.length - 1));
        const y = (height - 35) - (val / maxVal) * (height - 65);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    plot(dyno.orig_hp, '#94a3b8', true);
    plot(dyno.tuned_hp, '#0685c5', false);
    plot(dyno.orig_nm, '#f59e0b', true);
    plot(dyno.tuned_nm, '#10b981', false);

    // Draw legend
    ctx.font = '11px Open Sans';
    ctx.fillStyle = '#0685c5';
    ctx.fillText('■ Tuned HP', 50, 18);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('┄ Orig HP', 130, 18);
    ctx.fillStyle = '#10b981';
    ctx.fillText('■ Tuned Nm', 200, 18);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('┄ Orig Nm', 280, 18);
  }

  // Render Fuel Economy Radial Gauge
  function renderFuelGauge() {
    const canvas = document.getElementById('fuel-gauge-canvas');
    if (!canvas || !currentSpecs) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 160;
    const height = canvas.height = 160;

    const stgData = currentSpecs[currentStage] || currentSpecs.stage1;
    const orig = stgData.orig_fuel || 5.0;
    const tuned = stgData.tuned_fuel || 4.4;

    const centerVal = document.getElementById('fuel-gauge-center-val');
    if (centerVal) {
      centerVal.textContent = tuned.toFixed(1);
    }

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 62;

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Savings progress
    const pct = Math.min(1.0, (orig - tuned) / 2.0); // scaled savings
    const endAngle = 0.75 * Math.PI + (1.5 * Math.PI * Math.max(0.2, (10 - tuned) / 10));

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, endAngle);
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0685c5');
    grad.addColorStop(1, '#10b981');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Stage Switcher
  function initStageTabs() {
    document.querySelectorAll('.stage-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.stage-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentStage = btn.getAttribute('data-stage') || 'stage1';
        updateStageDisplay();
        renderDynoGraph();
        renderFuelGauge();
      });
    });
  }

  // Modals (Booking & File Service)
  function initModals() {
    const bookModal = document.getElementById('booking-modal');
    const fsModal = document.getElementById('file-service-modal');

    // Open booking modal
    document.querySelectorAll('.btn-open-booking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (bookModal) {
          bookModal.classList.add('active');
          if (currentSpecs) {
            const carInput = document.getElementById('book-vehicle');
            if (carInput) carInput.value = `${currentSpecs.make} ${currentSpecs.model} ${currentSpecs.engine}`;
          }
        }
      });
    });

    // Open file service modal
    document.querySelectorAll('.btn-open-file-service').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (fsModal) {
          fsModal.classList.add('active');
          if (currentSpecs) {
            const carInput = document.getElementById('fs-vehicle');
            if (carInput) carInput.value = `${currentSpecs.make} ${currentSpecs.model} ${currentSpecs.engine}`;
          }
        } else {
          window.location.href = '/dashboard.html';
        }
      });
    });

    // Close buttons
    document.querySelectorAll('.modal-close, .modal-backdrop-close').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    // Booking form submit
    const bookForm = document.getElementById('booking-form');
    if (bookForm) {
      bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = bookForm.querySelector('button[type="submit"]');
        const origText = btn.textContent;
        btn.textContent = 'Verzenden...';
        btn.disabled = true;

        try {
          const res = await fetch('/api/appointment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: document.getElementById('book-name')?.value,
              phone: document.getElementById('book-phone')?.value,
              email: document.getElementById('book-email')?.value,
              vehicle: document.getElementById('book-vehicle')?.value,
              date: document.getElementById('book-date')?.value,
              notes: document.getElementById('book-notes')?.value
            })
          });
          const data = await res.json();
          alert(data.message || 'Afspraak succesvol aangevraagd!');
          bookModal.classList.remove('active');
          bookForm.reset();
        } catch (err) {
          alert('Aanvraag ontvangen! Wij nemen contact met u op.');
          bookModal.classList.remove('active');
        } finally {
          btn.textContent = origText;
          btn.disabled = false;
        }
      });
    }
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    loadTreeData();

    if (makeSelect) makeSelect.addEventListener('change', onMakeChange);
    if (modelSelect) modelSelect.addEventListener('change', onModelChange);
    if (genSelect) genSelect.addEventListener('change', onGenChange);
    if (engineSelect) engineSelect.addEventListener('change', loadSpecs);
    if (calcBtn) calcBtn.addEventListener('click', loadSpecs);

    initStageTabs();
    initModals();

    // Window resize dyno redraw
    window.addEventListener('resize', () => {
      if (currentSpecs) {
        renderDynoGraph();
      }
    });
  });

})();
