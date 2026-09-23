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
const JWT_SECRET = process.env.JWT_SECRET || 'tuningportal-secret-2024-fast-chiptuning';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

// Helpers to load data
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

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch {
    req.user = null;
  }
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

// Make user available in views
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.currentPath = req.path;
  next();
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + uuidv4() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// --- API ROUTES ---

// Vehicles API
app.get('/api/makes', (req, res) => {
  const v = loadVehicles();
  res.json(v.makes);
});
app.get('/api/models', (req, res) => {
  const { makeId } = req.query;
  const v = loadVehicles();
  if (!makeId || makeId === 'other') return res.json([]);
  const models = v.models.filter(m => String(m.makeId) === String(makeId));
  res.json(models);
});
app.get('/api/generations', (req, res) => {
  const { modelId } = req.query;
  const v = loadVehicles();
  if (!modelId || modelId === 'other') return res.json([]);
  const gens = v.generations.filter(g => String(g.modelId) === String(modelId));
  res.json(gens);
});
app.get('/api/engines', (req, res) => {
  const { generationId } = req.query;
  const v = loadVehicles();
  if (!generationId || generationId === 'other') return res.json([]);
  const engines = v.engines.filter(e => String(e.generationId) === String(generationId));
  res.json(engines);
});
app.get('/api/ecus', (req, res) => {
  const { engineId } = req.query;
  const v = loadVehicles();
  if (!engineId || engineId === 'other') return res.json([]);
  const ecus = v.ecus.filter(e => String(e.engineId) === String(engineId));
  res.json(ecus);
});
app.get('/api/power/:engineId', (req, res) => {
  const v = loadVehicles();
  const eng = v.engines.find(e => String(e.id) === String(req.params.engineId));
  if (!eng) return res.status(404).json({ error: 'Engine not found' });
  res.json({
    original: { hp: eng.powerHp, kw: eng.powerKw, nm: eng.torqueNm },
    tuned: { hp: eng.tunedHp, kw: eng.tunedKw, nm: eng.tunedNm },
    gainHp: eng.tunedHp - eng.powerHp,
    gainKw: eng.tunedKw - eng.powerKw,
    gainNm: eng.tunedNm - eng.torqueNm
  });
});
// Type loader compatibility for original front-end style
app.get('/api/v1/type-loader', (req, res) => {
  // Not fully used; handle generic
  res.json([]);
});

// Tuning types
app.get('/api/tuning-types', (req, res) => {
  const t = loadTuningTypes();
  res.json(t.tuningTypes);
});
app.get('/api/tuning-options/:typeId', (req, res) => {
  const t = loadTuningTypes();
  res.json(t.optionsByType[req.params.typeId] || []);
});

// Auth APIs
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
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
});
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const users = loadJson('users.json');
  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(400).json({ error: 'Onjuiste e-mail of wachtwoord' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Onjuiste e-mail of wachtwoord' });
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, company: user.company, credits: user.credits }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7*24*60*60*1000 });
  res.json({ success: true });
});
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});
app.get('/api/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not logged in' });
  res.json(req.user);
});

// File services API
app.post('/api/file-services', requireAuth, upload.fields([{ name: 'originalFile', maxCount: 1 }, { name: 'tcuFile', maxCount: 1 }, { name: 'attachments', maxCount: 5 }]), (req, res) => {
  const data = req.body;
  const files = req.files;
  const services = loadJson('fileServices.json');
  // Calculate credits
  const t = loadTuningTypes();
  const tuningType = t.tuningTypes.find(x => String(x.id) === String(data.tuning_type_id));
  let totalCredits = tuningType ? tuningType.credits : 0;
  // Add options
  if (data.options) {
    try {
      const opts = typeof data.options === 'string' ? JSON.parse(data.options) : data.options;
      if (Array.isArray(opts)) {
        opts.forEach(o => {
          // Find option credits
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
  // Mock DTC list
  const all = ['P0001','P0002','P0010','P0011','P0012','P0016','P0030','P0031','P0046','P0087','P0101','P0102','P0103','P0113','P0171','P0172','P0201','P0234','P0235','P0243','P0299','P0300','P0301','P0302','P0303','P0304','P0341','P0401','P0402','P0403','P0404','P0420','P0430','P0442','P0463','P0490','P1101','P2002','P2453','P2459'];
  const filtered = all.filter(c => c.toLowerCase().includes(q)).slice(0,20).map(c => ({ id: c, text: c + ' - DTC ' + c }));
  res.json(filtered);
});

// --- PAGE ROUTES ---

app.get('/', (req, res) => {
  const vehicles = loadVehicles();
  const tuning = loadTuningTypes();
  res.render('homepage', { makes: vehicles.makes, tuningTypes: tuning.tuningTypes });
});
app.get('/login', (req, res) => {
  if (req.user) return res.redirect('/account');
  res.render('login', { redirect: req.query.redirect || '/account', error: null });
});
app.get('/register', (req, res) => {
  if (req.user) return res.redirect('/account');
  res.render('register', { error: null });
});
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});
app.get('/tuning-specs', (req, res) => {
  const v = loadVehicles();
  res.render('tuning-specs', { vehicles: v });
});
app.get('/account', requireAuth, (req, res) => {
  const services = loadJson('fileServices.json').filter(s => s.userId === req.user.id);
  res.render('dashboard', { services: services.slice(0,5), user: req.user });
});
app.get('/account/file-services', requireAuth, (req, res) => {
  const services = loadJson('fileServices.json').filter(s => s.userId === req.user.id);
  res.render('file-services', { services });
});
app.get('/account/file-services/new-file-service', requireAuth, (req, res) => {
  const v = loadVehicles();
  const t = loadTuningTypes();
  res.render('new-file-service', { makes: v.makes, tuningTypes: t.tuningTypes, tuningData: t, vehicles: v });
});
app.get('/account/file-services/:id', requireAuth, (req, res) => {
  const services = loadJson('fileServices.json');
  const svc = services.find(s => s.id === req.params.id && s.userId === req.user.id);
  if (!svc) return res.status(404).send('Not found');
  const v = loadVehicles();
  res.render('file-service-detail', { svc, vehicles: v });
});
app.get('/account/support-tickets', requireAuth, (req, res) => res.render('support-tickets'));
app.get('/account/buy-credits', requireAuth, (req, res) => res.render('buy-credits'));
app.get('/account/transactions', requireAuth, (req, res) => res.render('transactions'));
app.get('/account/orders', requireAuth, (req, res) => res.render('orders'));
app.get('/account/profile', requireAuth, (req, res) => res.render('profile', { user: req.user }));
app.get('/legal/:page', (req, res) => res.render('legal', { page: req.params.page }));

// Fallback 404
app.use((req, res) => res.status(404).render('404'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TuningPortal running on http://0.0.0.0:${PORT}`);
});
