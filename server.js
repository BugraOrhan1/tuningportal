const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Paths
const dataDir = path.join(__dirname, 'data');
const treePath = path.join(dataDir, 'tree.json');
const dtcPath = path.join(dataDir, 'dtc-codes.json');

// Cache in-memory
let tree = {};
let dtcs = [];
try {
  if (fs.existsSync(treePath)) {
    tree = JSON.parse(fs.readFileSync(treePath, 'utf8'));
  }
  if (fs.existsSync(dtcPath)) {
    dtcs = JSON.parse(fs.readFileSync(dtcPath, 'utf8'));
  }
} catch (e) {
  console.error('Error loading data:', e);
}

// In-memory data for file services, credits, tickets
let fileServices = [
  {
    id: 1,
    order_number: "FS-2026-9812",
    customer_id: "user-1",
    make: "Volkswagen",
    model: "Golf",
    generation: "Golf 7 - 2012 - 2016",
    engine: "1.2 TSI 85pk",
    ecu: "Bosch MED17.5.21",
    license_plate: "12-GTR-8",
    vin: "WVWZZZAUZFP089123",
    year: "2015",
    gearbox: "Handgeschakeld",
    tool: "Autotuner",
    read_method: "OBD",
    hardware_nr: "04E907309A",
    software_nr: "04E906016F",
    tuning_type: "Stage 1",
    tuning_options: "Pops & Bangs, VMAX off",
    credits_cost: 1.5,
    status: "Gereed",
    original_filename: "Golf7_1.2TSI_85hp_ori.bin",
    tuned_filename: "Golf7_1.2TSI_140hp_Stage1_Pops.bin",
    notes: "Graag pop and bang op AC knop",
    created_at: "2026-09-23 18:30"
  },
  {
    id: 2,
    order_number: "FS-2026-9811",
    customer_id: "user-1",
    make: "BMW",
    model: "3 Series",
    generation: "F30 / F31 / F34 - 2012 - 2019",
    engine: "320i 184pk (B48 LCI)",
    ecu: "Bosch MG1CS003",
    license_plate: "K-881-TX",
    vin: "WBA8A11000K123456",
    year: "2017",
    gearbox: "Automaat 8HP",
    tool: "bFlash",
    read_method: "OBD",
    hardware_nr: "8688402",
    software_nr: "8691234",
    tuning_type: "Stage 1",
    tuning_options: "Sport display callibration",
    credits_cost: 1.0,
    status: "Voltooid",
    original_filename: "BMW_320i_B48_ori.bin",
    tuned_filename: "BMW_320i_260hp_Stage1.bin",
    notes: "Klant wil lineaire koppelopbouw",
    created_at: "2026-09-22 14:15"
  },
  {
    id: 3,
    order_number: "FS-2026-9809",
    customer_id: "user-1",
    make: "Audi",
    model: "A3",
    generation: "8V - 2012 - 2020",
    engine: "2.0 TDI CR 150pk",
    ecu: "Bosch EDC17C64",
    license_plate: "6-ZTK-90",
    vin: "WAUZZZ8V1EA098765",
    year: "2016",
    gearbox: "S-Tronic DSG",
    tool: "KESS3",
    read_method: "Bench",
    hardware_nr: "04L906021M",
    software_nr: "9978",
    tuning_type: "Stage 1",
    tuning_options: "EGR OFF, DPF OFF",
    credits_cost: 1.5,
    status: "Voltooid",
    original_filename: "Audi_A3_20TDI_ori.bin",
    tuned_filename: "Audi_A3_195hp_Stg1_EGR_DPF_off.bin",
    notes: "EGR en DPF softwarematig dicht",
    created_at: "2026-09-21 11:20"
  }
];

let creditBalance = 15;
let transactions = [
  { id: 1, invoice_number: "INV-2026-0421", customer_id: "user-1", credits: 10, amount: 650.00, status: "Betaald", description: "10 File Service Credits Bundel", created_at: "2026-09-20" },
  { id: 2, invoice_number: "INV-2026-0388", customer_id: "user-1", credits: 5, amount: 350.00, status: "Betaald", description: "5 File Service Credits Bundel", created_at: "2026-09-10" }
];

let tickets = [
  { id: 1, ticket_number: "TCK-8821", customer_id: "user-1", file_service_id: "FS-2026-9812", subject: "Vraag over pops & bangs loudness", message: "Is het mogelijk om de pops iets luider te maken?", status: "Beantwoord", priority: "Normaal", created_at: "2026-09-23 19:10" },
  { id: 2, ticket_number: "TCK-8815", customer_id: "user-1", file_service_id: "", subject: "Vraag over KESS3 Slave koppeling", message: "Kan ik mijn KESS3 slave aan jullie master koppelen?", status: "Gesloten", priority: "Laag", created_at: "2026-09-18 10:45" }
];

// Helper to get make data
function getMakeData(makeName) {
  const slug = makeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const makeFile = path.join(dataDir, 'makes_data', `${slug}.json`);
  if (fs.existsSync(makeFile)) {
    return JSON.parse(fs.readFileSync(makeFile, 'utf8'));
  }
  return null;
}

// ======================== API ROUTES ========================

// Fast-Chiptuningfiles compatible type-loader
app.get(['/api/v1/type-loader', '/api/type-loader'], (req, res) => {
  let { make, model, generation, engine, ecu, parent_id, target } = req.query;

  if (parent_id) {
    for (const mName of Object.keys(tree)) {
      if (tree[mName].id === parent_id || mName.toLowerCase() === parent_id.toLowerCase()) {
        make = mName;
        break;
      }
      for (const moName of Object.keys(tree[mName].models || {})) {
        if (tree[mName].models[moName].id === parent_id || moName.toLowerCase() === parent_id.toLowerCase()) {
          make = mName;
          model = moName;
          break;
        }
        for (const genName of Object.keys(tree[mName].models[moName].generations || {})) {
          if (tree[mName].models[moName].generations[genName].id === parent_id || genName.toLowerCase() === parent_id.toLowerCase()) {
            make = mName;
            model = moName;
            generation = genName;
            break;
          }
        }
      }
    }
  }

  const makes = Object.keys(tree).map(name => ({
    id: tree[name].id,
    name: name,
    urlname: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }));

  let models = [];
  if (make && tree[make]) {
    models = Object.keys(tree[make].models).map(name => ({
      id: tree[make].models[name].id,
      name: name
    }));
  }

  let generations = [];
  if (make && model && tree[make]?.models?.[model]) {
    generations = Object.keys(tree[make].models[model].generations).map(name => ({
      id: tree[make].models[model].generations[name].id,
      name: name
    }));
  }

  let engines = [];
  let ecus = [];
  if (make && model && generation && tree[make]?.models?.[model]?.generations?.[generation]) {
    engines = tree[make].models[model].generations[generation].engines.map(eng => ({
      id: eng.id,
      name: eng.name,
      fuel: eng.fuel,
      orig_hp: eng.orig_hp,
      tuned_hp: eng.tuned_hp,
      orig_nm: eng.orig_nm,
      tuned_nm: eng.tuned_nm
    }));

    ecus = [
      { id: 'ecu_1', name: 'Bosch MED17 / EDC17 / MG1' },
      { id: 'ecu_2', name: 'Continental Simos / Delphi' },
      { id: 'ecu_3', name: 'Siemens / Marelli' }
    ];
  }

  res.json({
    choices: {
      makes,
      models,
      generations,
      engines,
      ecus
    },
    selected: {
      make: make || null,
      model: model || null,
      generation: generation || null,
      engine: engine || null,
      ecu: ecu || null
    },
    url: '/tuning-specs'
  });
});

// /api/makes
app.get('/api/makes', (req, res) => {
  const makes = Object.keys(tree).map(name => ({ id: tree[name].id, name }));
  res.json({ makes });
});

// /api/models
app.get('/api/models', (req, res) => {
  const { make } = req.query;
  let models = [];
  if (make && tree[make]) {
    models = Object.keys(tree[make].models).map(name => ({
      id: tree[make].models[name].id,
      name
    }));
  }
  res.json({ models });
});

// /api/generations
app.get('/api/generations', (req, res) => {
  const { make, model } = req.query;
  let generations = [];
  if (make && model && tree[make]?.models?.[model]) {
    generations = Object.keys(tree[make].models[model].generations).map(name => ({
      id: tree[make].models[model].generations[name].id,
      name
    }));
  }
  res.json({ generations });
});

// /api/engines
app.get('/api/engines', (req, res) => {
  const { make, model, generation } = req.query;
  let engines = [];
  if (make && model && generation && tree[make]?.models?.[model]?.generations?.[generation]) {
    engines = tree[make].models[model].generations[generation].engines;
  }
  res.json({ engines });
});

// /api/tuning-specs
app.get('/api/tuning-specs', (req, res) => {
  const { make, model, generation, engine, engine_id, id } = req.query;
  const targetId = engine_id || id;

  // Search by make
  if (make) {
    const makeData = getMakeData(make);
    if (makeData?.models?.[model]?.generations?.[generation]?.engines?.[engine]) {
      const engObj = makeData.models[model].generations[generation].engines[engine];
      return res.json({
        success: true,
        vehicle: {
          make,
          model,
          generation,
          engine,
          ...engObj
        }
      });
    }
  }

  // If targetId is passed, search across makes
  if (targetId) {
    for (const mName of Object.keys(tree)) {
      const makeData = getMakeData(mName);
      if (!makeData) continue;
      for (const mo of Object.keys(makeData.models || {})) {
        for (const gen of Object.keys(makeData.models[mo].generations || {})) {
          const engines = makeData.models[mo].generations[gen].engines || {};
          for (const engKey of Object.keys(engines)) {
            const eng = engines[engKey];
            if (eng.id === targetId) {
              return res.json({
                success: true,
                vehicle: {
                  make: mName,
                  model: mo,
                  generation: gen,
                  engine: engKey,
                  ...eng
                }
              });
            }
          }
        }
      }
    }
  }

  res.status(404).json({ success: false, error: 'Voertuig niet gevonden' });
});

// /api/dtc
app.get('/api/dtc', (req, res) => {
  const q = (req.query.code || req.query.query || '').toUpperCase().trim();
  if (!q) {
    return res.json({ success: true, count: 0, results: [] });
  }

  const results = dtcs.filter(d => 
    d.code.includes(q) || (d.description && d.description.toUpperCase().includes(q))
  ).slice(0, 50);

  res.json({ success: true, count: results.length, results });
});

// /api/file-services
app.get('/api/file-services', (req, res) => {
  res.json({ success: true, services: fileServices });
});

app.post('/api/file-services', (req, res) => {
  const data = req.body;
  const orderNumber = `FS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newService = {
    id: fileServices.length + 1,
    order_number: orderNumber,
    customer_id: "user-1",
    make: data.make || "Onbekend",
    model: data.model || "",
    generation: data.generation || "",
    engine: data.engine || "",
    ecu: data.ecu || "Bosch",
    license_plate: data.license_plate || "XX-XX-XX",
    vin: data.vin || "WVWZZZ...",
    year: data.year || new Date().getFullYear().toString(),
    gearbox: data.gearbox || "Handgeschakeld",
    tool: data.tool || "Autotuner",
    read_method: data.read_method || "OBD",
    hardware_nr: data.hardware_nr || "",
    software_nr: data.software_nr || "",
    tuning_type: data.tuning_type || "Stage 1",
    tuning_options: data.tuning_options || "Standaard",
    credits_cost: parseFloat(data.credits_cost || 1.0),
    status: "In Behandeling",
    original_filename: data.original_filename || "ecu_orig.bin",
    tuned_filename: "",
    notes: data.notes || "",
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  fileServices.unshift(newService);
  creditBalance = Math.max(0, creditBalance - newService.credits_cost);

  res.json({
    success: true,
    message: "Bestand succesvol ontvangen! Onze WinOLS chiptuning specialisten zijn gestart.",
    order_number: orderNumber,
    status: "In Behandeling",
    estimated_time: "20 - 45 minuten",
    new_balance: creditBalance
  });
});

// /api/credits
app.get('/api/credits', (req, res) => {
  res.json({ balance: creditBalance, transactions });
});

app.post('/api/buy-credits', (req, res) => {
  const { credits, amount } = req.body;
  const creditsToAdd = parseInt(credits || 5);
  const cost = parseFloat(amount || 350.00);
  const inv = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  creditBalance += creditsToAdd;
  transactions.unshift({
    id: transactions.length + 1,
    invoice_number: inv,
    customer_id: "user-1",
    credits: creditsToAdd,
    amount: cost,
    status: "Betaald",
    description: `${creditsToAdd} File Service Credits Bundel`,
    created_at: new Date().toISOString().substring(0, 10)
  });

  res.json({
    success: true,
    message: `Succesvol €${cost.toFixed(2)} betaald. Er zijn ${creditsToAdd} credits toegevoegd!`,
    invoice_number: inv,
    new_balance: creditBalance
  });
});

// /api/tickets
app.get('/api/tickets', (req, res) => {
  res.json({ success: true, tickets });
});

app.post('/api/tickets', (req, res) => {
  const data = req.body;
  const tckNr = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTicket = {
    id: tickets.length + 1,
    ticket_number: tckNr,
    customer_id: "user-1",
    file_service_id: data.file_service_id || "",
    subject: data.subject || "Vraag",
    message: data.message || "",
    status: "Open",
    priority: data.priority || "Normaal",
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
  tickets.unshift(newTicket);
  res.json({ success: true, ticket_number: tckNr, message: "Ticket succesvol ingediend! Wij reageren binnen gemiddeld 15 minuten." });
});

// /api/contact & appointment
app.post(['/api/contact', '/api/appointment'], (req, res) => {
  res.json({
    success: true,
    message: "Bedankt voor uw aanvraag! Wij hebben uw verzoek ontvangen en nemen binnen 1 werkdag telefonisch of per e-mail contact met u op."
  });
});

// Static files
app.use(express.static(path.join(__dirname)));
app.use('/data', express.static(dataDir));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Fallback HTML routes
app.get('/iframe', (req, res) => res.sendFile(path.join(__dirname, 'iframe.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/tools', (req, res) => res.sendFile(path.join(__dirname, 'tools.html')));
app.get('/dtc', (req, res) => res.sendFile(path.join(__dirname, 'dtc.html')));
app.get('/credits', (req, res) => res.sendFile(path.join(__dirname, 'credits.html')));

// Catch-all
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  if (fs.existsSync(path.join(__dirname, 'index.html'))) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.send('TuningPortal API running');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TuningPortal server listening on http://0.0.0.0:${PORT}`);
});
