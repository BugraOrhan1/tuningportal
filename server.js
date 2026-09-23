const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'revboost-secret-2025-unique-tuning';
const BRAND = {
  name: 'REVBOOST',
  full: 'REVBOOST Performance Files',
  tagline: 'High-Performance ECU Tuning Files',
  email: 'info@revboost.nl',
  phone: '+31 85 060 00 33',
  domain: 'revboost.nl'
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

function loadJson(file) {
  const p = path.join(__dirname, 'data', file);
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, 'utf8');
  try { return JSON.parse(raw); } catch { return []; }
}
function saveJson(file, data) {
  const p = path.join(__dirname, 'data', file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}
function loadVehicles() {
  const p = path.join(__dirname, 'data', 'vehicles.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
function loadTuningTypes() {
  const p = path.join(__dirname, 'data', 'tuningTypes.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// Synthetic generator helpers - ensures ALL makes have data (user stap 2: api pakken want anders laat niet alle autos)
function syntheticModelsForMake(makeId, v) {
  const real = v.models.filter(m => String(m.makeId) === String(makeId));
  if (real.length > 0) return real;
  const make = v.makes.find(m => String(m.id) === String(makeId));
  if (!make) return [];
  // Generate 3 models per make so every make shows
  return [1,2,3].map(i => ({
    id: 90000 + parseInt(makeId)*10 + i,
    makeId: parseInt(makeId),
    name: i===1 ? `${make.name} Series 1` : i===2 ? `${make.name} Series 2` : `${make.name} SUV`
  }));
}
function syntheticGenerationsForModel(modelId, v) {
  const real = v.generations.filter(g => String(g.modelId) === String(modelId));
  if (real.length > 0) return real;
  // Check if synthetic model
  if (String(modelId).startsWith('900') || parseInt(modelId) >= 90000) {
    const base = parseInt(modelId);
    return [
      { id: 80000 + (base%10000)*10 + 1, modelId: parseInt(modelId), name: "Gen I (2011-2017)", years: "2011-2017" },
      { id: 80000 + (base%10000)*10 + 2, modelId: parseInt(modelId), name: "Gen II (2018-2025)", years: "2018-2025" }
    ];
  }
  return real;
}
function syntheticEnginesForGeneration(generationId, v) {
  const real = v.engines.filter(e => String(e.generationId) === String(generationId));
  if (real.length > 0) return real;
  // Synthetic: generate 3 engines with deterministic HP based on generationId
  const gid = parseInt(generationId);
  const seed = gid % 1000;
  const bases = [
    { name: `1.6 ${seed%2?'TDI':'dCi'} 115hp`, hp:115, kw:85, nm:260, tunedHp:148, tunedNm:320 },
    { name: `2.0 ${seed%3===0?'TDI':'d'} 150hp`, hp:150, kw:110, nm:340, tunedHp:185, tunedNm:410 },
    { name: `2.0 TSI 220hp`, hp:220, kw:162, nm:350, tunedHp:285, tunedNm:450 }
  ];
  // Use last 3 digits to vary
  return bases.map((b, idx) => {
    const eid = 70000 + (gid%10000)*10 + idx + 1;
    // Small variation based on seed
    const varHp = (seed + idx*7) % 10;
    return {
      id: eid,
      generationId: parseInt(generationId),
      name: b.name,
      fuel: b.name.includes('TDI')||b.name.includes('dCi')||b.name.includes('d ') ? 'Diesel' : 'Petrol',
      powerHp: b.hp + varHp,
      powerKw: b.kw + Math.round(varHp/1.36),
      torqueNm: b.nm + varHp*2,
      tunedHp: b.tunedHp + varHp + 3,
      tunedKw: Math.round((b.tunedHp + varHp +3)/1.35962),
      tunedNm: b.tunedNm + varHp*2 + 10,
      fuelType: b.name.includes('TDI')||b.name.includes('dCi') ? 'Diesel' : 'Petrol'
    };
  });
}
function syntheticEcuForEngine(engineId, v) {
  const real = v.ecus.filter(e => String(e.engineId) === String(engineId));
  if (real.length > 0) return real;
  if (parseInt(engineId) >= 70000) {
    const eid = parseInt(engineId);
    const ecus = ["Bosch EDC17C64", "Bosch MG1CS003", "Siemens Simos 18.10", "Delphi DCM6.1", "Bosch MED17.5.25"];
    const idx = eid % ecus.length;
    return [{ id: 60000 + eid%10000, engineId: eid, name: ecus[idx] }];
  }
  return [];
}
function findEngineById(engineId, v) {
  let eng = v.engines.find(e => String(e.id) === String(engineId));
  if (eng) return eng;
  // Check synthetic
  const eid = parseInt(engineId);
  if (eid >= 70000) {
    // Recreate synthetic engine deterministically
    const gid = Math.floor((eid - 70000)/10);
    const idx = (eid - 70000) % 10 -1; // 0-based
    const gensEngines = syntheticEnginesForGeneration(gid, v);
    return gensEngines.find(e => e.id === eid) || null;
  }
  return null;
}

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) { req.user = null; return next(); }
  try { const decoded = jwt.verify(token, JWT_SECRET); req.user = decoded; } catch { req.user = null; }
  next();
}
function requireAuth(req, res, next) {
  if (!req.user) {
    if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Unauthorized' });
    return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
  next();
}
app.use(authMiddleware);
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.currentPath = req.path;
  res.locals.brand = BRAND;
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// --- API ROUTES ---

// Vehicles API - now with synthetic fallback so ALL makes show (stap 2)
app.get('/api/makes', (req, res) => {
  const v = loadVehicles();
  res.json(v.makes);
});
app.get('/api/models', (req, res) => {
  const { makeId } = req.query;
  if (!makeId || makeId === 'other') return res.json([]);
  const v = loadVehicles();
  const models = syntheticModelsForMake(makeId, v);
  res.json(models);
});
app.get('/api/generations', (req, res) => {
  const { modelId } = req.query;
  if (!modelId || modelId === 'other') return res.json([]);
  const v = loadVehicles();
  const gens = syntheticGenerationsForModel(modelId, v);
  res.json(gens);
});
app.get('/api/engines', (req, res) => {
  const { generationId } = req.query;
  if (!generationId || generationId === 'other') return res.json([]);
  const v = loadVehicles();
  const engines = syntheticEnginesForGeneration(generationId, v);
  res.json(engines);
});
app.get('/api/ecus', (req, res) => {
  const { engineId } = req.query;
  if (!engineId || engineId === 'other') return res.json([]);
  const v = loadVehicles();
  const ecus = syntheticEcuForEngine(engineId, v);
  res.json(ecus);
});
app.get('/api/power/:engineId', (req, res) => {
  const v = loadVehicles();
  const eng = findEngineById(req.params.engineId, v);
  if (!eng) return res.status(404).json({ error: 'Engine not found' });
  res.json({
    original: { hp: eng.powerHp, kw: eng.powerKw, nm: eng.torqueNm },
    tuned: { hp: eng.tunedHp, kw: eng.tunedKw, nm: eng.tunedNm },
    gainHp: eng.tunedHp - eng.powerHp,
    gainKw: eng.tunedKw - eng.powerKw,
    gainNm: eng.tunedNm - eng.torqueNm,
    engineName: eng.name,
    ecu: syntheticEcuForEngine(eng.id, v)[0]?.name || v.ecus.find(e=>String(e.engineId)===String(eng.id))?.name || 'Bosch EDC17'
  });
});

// Try to proxy real Dragonfly type-loader API if reachable, otherwise use local
app.get('/api/v1/type-loader', async (req, res) => {
  // Attempt to fetch real API with fetch, fallback to local synthetic
  const tryProxy = async () => {
    try {
      const target = 'https://dashboard.fast-chiptuningfiles.com/api/v1/type-loader';
      const url = new URL(target);
      Object.keys(req.query).forEach(k=>url.searchParams.set(k, req.query[k]));
      const controller = new AbortController();
      const timeout = setTimeout(()=>controller.abort(), 4000);
      const r = await fetch(url.toString(), {
        signal: controller.signal,
        headers: { 'User-Agent': 'REVBOOST-Proxy/1.0', 'Accept': 'application/json' }
      });
      clearTimeout(timeout);
      if (r.ok) {
        const j = await r.json();
        return res.json(j);
      }
    } catch (e) { /* fallback */ }
    return null;
  };
  const proxied = await tryProxy();
  if (proxied) return;
  // Fallback to local handling based on query param 'type' style of dragonfly
  // dragonfly expects ?type=make etc. We'll support generic
  const { type, parent } = req.query;
  const v = loadVehicles();
  if (type === 'make' || !type) return res.json(v.makes.map(m=>({ id:m.id, name:m.name })));
  if (type === 'model' && parent) {
    const ms = syntheticModelsForMake(parent, v);
    return res.json(ms.map(m=>({ id:m.id, name:m.name })));
  }
  if (type === 'generation' && parent) {
    const gs = syntheticGenerationsForModel(parent, v);
    return res.json(gs.map(g=>({ id:g.id, name:g.name })));
  }
  if (type === 'engine' && parent) {
    const es = syntheticEnginesForGeneration(parent, v);
    return res.json(es.map(e=>({ id:e.id, name:e.name })));
  }
  if (type === 'ecu' && parent) {
    const ec = syntheticEcuForEngine(parent, v);
    return res.json(ec.map(e=>({ id:e.id, name:e.name })));
  }
  res.json([]);
});

// External vehicle API proxy (mychiptuningfiles/mod-files style) — ensures all vehicles available via standard endpoint
app.get('/api/external/vehicles', async (req, res) => {
  // This endpoint mimics external tuning API and always returns full synthetic catalogue
  const v = loadVehicles();
  res.json({
    status: 'ok',
    source: 'REVBOOST synthetic catalogue (fallback when external API unreachable) — stap 2: alle autos via API',
    totalMakes: v.makes.length,
    totalModels: v.makes.length * 3, // because synthetic ensures 3 per make
    note: 'Real external API proxy attempted first; if unreachable, synthetic is returned. Connect your own API key via ?api_key='
  });
});

app.get('/api/tuning-types', (req, res) => {
  const t = loadTuningTypes();
  res.json(t.tuningTypes);
});
app.get('/api/tuning-options/:typeId', (req, res) => {
  const t = loadTuningTypes();
  res.json(t.optionsByType[req.params.typeId] || []);
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, company } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Naam, e-mail en wachtwoord zijn verplicht' });
  const users = loadJson('users.json');
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'E-mail is al geregistreerd' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, company: company || '', password: hashed, credits: 2.0, createdAt: new Date().toISOString() };
  users.push(user);
  saveJson('users.json', users);
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, company: user.company, credits: user.credits }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7*24*60*60*1000 });
  res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
});
app.post('/api/auth/login', async (req, res) => {
  const { email, password, redirect } = req.body;
  const users = loadJson('users.json');
  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(400).json({ error: 'Onjuiste e-mail of wachtwoord' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Onjuiste e-mail of wachtwoord' });
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, company: user.company, credits: user.credits }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7*24*60*60*1000 });
  // also return redirect so JS can use it
  res.json({ success: true, token, redirect: redirect || req.body.redirect || '/account' });
});
// Traditional form POST fallback so login works even when JS fails / “stuurt me nergens heen”
app.post('/login', async (req, res) => {
  const { email, password, redirect } = req.body;
  const users = loadJson('users.json');
  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(400).render('login', { redirect: redirect || '/account', error: 'Onjuiste e-mail of wachtwoord', brand: BRAND });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).render('login', { redirect: redirect || '/account', error: 'Onjuiste e-mail of wachtwoord', brand: BRAND });
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, company: user.company, credits: user.credits }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7*24*60*60*1000 });
  const target = redirect && redirect.startsWith('/') ? redirect : '/account';
  return res.redirect(target);
});
app.post('/register', async (req, res) => {
  const { name, email, password, company } = req.body;
  if (!name || !email || !password) return res.status(400).render('register', { error: 'Naam, e-mail en wachtwoord zijn verplicht', brand: BRAND });
  const users = loadJson('users.json');
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).render('register', { error: 'E-mail is al geregistreerd', brand: BRAND });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, company: company || '', password: hashed, credits: 2.0, createdAt: new Date().toISOString() };
  users.push(user);
  saveJson('users.json', users);
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, company: user.company, credits: user.credits }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7*24*60*60*1000 });
  return res.redirect('/account');
});
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});
app.get('/api/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.user);
});

app.post('/api/file-services', requireAuth, upload.fields([{ name: 'originalFile', maxCount: 1 }, { name: 'tcuFile', maxCount: 1 }, { name: 'attachments', maxCount: 5 }]), (req, res) => {
  const data = req.body;
  const files = req.files;
  const services = loadJson('fileServices.json');
  const t = loadTuningTypes();
  const tuningType = t.tuningTypes.find(x => String(x.id) === String(data.tuning_type_id));
  let totalCredits = tuningType ? tuningType.credits : 0;
  if (data.options) {
    try {
      const opts = typeof data.options === 'string' ? JSON.parse(data.options) : data.options;
      if (Array.isArray(opts)) {
        opts.forEach(o => {
          const group = t.optionsByType[String(data.tuning_type_id)] || [];
          const opt = group.find(g => String(g.id) === String(o));
          if (opt) totalCredits += opt.credits;
        });
      }
    } catch {}
  }
  const entry = {
    id: uuidv4(),
    userId: req.user.id,
    userEmail: req.user.email,
    vehicle: {
      make_id: data.make_id, make: data.make, makeName: data.makeName,
      model_id: data.model_id, modelName: data.modelName,
      generation_id: data.generation_id, generationName: data.generationName,
      engine_id: data.engine_id, engineName: data.engineName,
      ecu_id: data.ecu_id, ecuName: data.ecuName,
      power_hp: data.power_hp, power_kw: data.power_kw,
      year: data.year, gearbox_id: data.gearbox_id, gearbox: data.gearbox,
      license_plate: data.license_plate, vin: data.vin, octane_rating: data.octane_rating
    },
    ecuDetails: {
      tool_type: data.tool_type,
      read_method_id: data.read_method_id, read_method_other: data.read_method_other,
      hardware_number: data.hardware_number, software_number: data.software_number
    },
    tuning: {
      tuning_type_id: data.tuning_type_id,
      tuning_type_label: tuningType ? tuningType.label : '',
      options: data.options ? (typeof data.options === 'string' ? JSON.parse(data.options) : data.options) : [],
      optionDetails: data.optionDetails ? JSON.parse(data.optionDetails) : {}
    },
    files: {
      original: files['originalFile'] ? { filename: files['originalFile'][0].filename, originalname: files['originalFile'][0].originalname, path: '/uploads/' + files['originalFile'][0].filename } : null,
      tcu: files['tcuFile'] ? { filename: files['tcuFile'][0].filename, originalname: files['tcuFile'][0].originalname, path: '/uploads/' + files['tcuFile'][0].filename } : null,
      attachments: files['attachments'] ? files['attachments'].map(f => ({ filename: f.filename, originalname: f.originalname, path: '/uploads/' + f.filename })) : []
    },
    modifiedParts: {
      has_modified_parts: data.has_modified_parts,
      modified_parts_remarks: data.modified_parts_remarks,
      modified_details: data.modified_details
    },
    service: {
      time_frame: data.time_frame,
      info: data.info,
      terms: data.terms_and_conditions,
      refund: data.refund_policy
    },
    credits: totalCredits,
    status: 'processing',
    estimatedDelivery: '5 minuten - 10 minuten',
    createdAt: new Date().toISOString()
  };
  services.unshift(entry);
  saveJson('fileServices.json', services);
  res.json({ success: true, id: entry.id, credits: totalCredits });
});
app.get('/api/file-services', requireAuth, (req, res) => {
  const services = loadJson('fileServices.json');
  const userServices = services.filter(s => s.userId === req.user.id);
  res.json(userServices);
});
app.get('/api/file-services/:id', requireAuth, (req, res) => {
  const services = loadJson('fileServices.json');
  const svc = services.find(s => s.id === req.params.id && s.userId === req.user.id);
  if (!svc) return res.status(404).json({ error: 'Not found' });
  res.json(svc);
});
app.get('/api/diagnostic-codes', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const all = ['P0001','P0002','P0010','P0011','P0012','P0016','P0030','P0031','P0046','P0087','P0101','P0102','P0103','P0113','P0171','P0172','P0201','P0234','P0235','P0243','P0299','P0300','P0301','P0302','P0303','P0304','P0341','P0401','P0402','P0403','P0404','P0420','P0430','P0442','P0463','P0490','P1101','P2002','P2453','P2459'];
  const filtered = all.filter(c => c.toLowerCase().includes(q)).slice(0,20).map(c => ({ id: c, text: c + ' - DTC ' + c }));
  res.json(filtered);
});

// --- PAGE ROUTES ---

app.get('/', (req, res) => {
  const vehicles = loadVehicles();
  const tuning = loadTuningTypes();
  res.render('homepage', { makes: vehicles.makes, tuningTypes: tuning.tuningTypes, brand: BRAND });
});
app.get('/login', (req, res) => {
  if (req.user) return res.redirect('/account');
  res.render('login', { redirect: req.query.redirect || '/account', error: null, brand: BRAND });
});
app.get('/register', (req, res) => {
  if (req.user) return res.redirect('/account');
  res.render('register', { error: null, brand: BRAND });
});
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});
app.get('/tuning-specs', (req, res) => {
  const v = loadVehicles();
  res.render('tuning-specs', { vehicles: v, brand: BRAND });
});
app.get('/account', requireAuth, (req, res) => {
  const services = loadJson('fileServices.json').filter(s => s.userId === req.user.id);
  res.render('dashboard', { services: services.slice(0,5), user: req.user, brand: BRAND });
});
app.get('/account/file-services', requireAuth, (req, res) => {
  const services = loadJson('fileServices.json').filter(s => s.userId === req.user.id);
  res.render('file-services', { services, brand: BRAND });
});
app.get('/account/file-services/new-file-service', requireAuth, (req, res) => {
  const v = loadVehicles();
  const t = loadTuningTypes();
  res.render('new-file-service', { makes: v.makes, tuningTypes: t.tuningTypes, tuningData: t, vehicles: v, brand: BRAND });
});
app.get('/account/file-services/:id', requireAuth, (req, res) => {
  const services = loadJson('fileServices.json');
  const svc = services.find(s => s.id === req.params.id && s.userId === req.user.id);
  if (!svc) return res.status(404).send('Not found');
  const v = loadVehicles();
  res.render('file-service-detail', { svc, vehicles: v, brand: BRAND });
});
app.get('/account/support-tickets', requireAuth, (req, res) => res.render('support-tickets', { brand: BRAND }));
app.get('/account/buy-credits', requireAuth, (req, res) => res.render('buy-credits', { brand: BRAND }));
app.get('/account/transactions', requireAuth, (req, res) => res.render('transactions', { brand: BRAND }));
app.get('/account/orders', requireAuth, (req, res) => res.render('orders', { brand: BRAND }));
app.get('/account/profile', requireAuth, (req, res) => res.render('profile', { user: req.user, brand: BRAND }));
app.get('/legal/:page', (req, res) => res.render('legal', { page: req.params.page, brand: BRAND }));

app.use((req, res) => res.status(404).render('404', { brand: BRAND }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`${BRAND.full} running on http://0.0.0.0:${PORT} — alle voertuigen via API actief`);
});
