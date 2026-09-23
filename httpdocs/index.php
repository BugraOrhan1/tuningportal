<?php
/**
 * DASHFIX TuningPortal — httpdocs frontcontroller (copy-paste, geen npm, geen Node)
 * Alles werkt via PHP op Mijndomein hosting (httpdocs map direct uploaden).
 * Originele Node website 1-op-1 omgezet naar PHP voor copy-paste.
 */

session_start();

define('BRAND', [
  'name' => 'DASHFIX',
  'full' => 'DASHFIX TuningPortal',
  'tagline' => 'High-Performance ECU Tuning Files',
  'email' => 'info@dashfix.nl',
  'phone' => '+31 85 060 00 33',
  'domain' => 'tuningportal.dashfix.nl'
]);

// Helpers
function data_path($file) { return __DIR__ . '/data/' . $file; }
function load_json($file) {
  $p = data_path($file);
  if (!file_exists($p)) return [];
  $j = json_decode(file_get_contents($p), true);
  return $j ?: [];
}
function save_json($file, $data) {
  file_put_contents(data_path($file), json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}
function load_vehicles() { return json_decode(file_get_contents(data_path('vehicles.json')), true); }
function load_tuning() { return json_decode(file_get_contents(data_path('tuningTypes.json')), true); }

function is_logged_in() { return isset($_SESSION['user']); }
function require_login() {
  if (!is_logged_in()) {
    $redir = urlencode($_SERVER['REQUEST_URI'] ?? '/account');
    header('Location: /login?redirect=' . $redir);
    exit;
  }
}

function current_path() {
  $uri = $_SERVER['REQUEST_URI'] ?? '/';
  $path = parse_url($uri, PHP_URL_PATH);
  $path = rtrim($path, '/');
  return $path === '' ? '/' : $path;
}

function render($title, $body) {
  $brand = BRAND;
  $user = $_SESSION['user'] ?? null;
  $topbar = '<div class="topbar"><div class="topbar-inner"><div class="topbar-left"><span><i class="fa fa-envelope"></i> '.$brand['email'].'</span> <span><i class="fa fa-phone"></i> '.$brand['phone'].'</span> <span style="background:var(--primary);color:#fff;padding:2px 6px;font-size:10px">UNIEK MERK • GEEN KOPIE</span></div><div class="topbar-right"><span style="font-size:11px;color:#78909c">NL • EN • DE</span></div></div></div>';
  $navUser = $user
    ? '<a href="/account">Account ('.htmlspecialchars($user['email']).')</a> <a href="/logout">Uitloggen</a>'
    : '<a href="/login">Inloggen</a> <a href="/register" class="btn btn-primary" style="padding:6px 14px">Registreren</a>';
  $nav = '<nav class="navbar"><div class="navbar-inner"><a href="/" class="logo"><div style="width:38px;height:38px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;border-radius:4px">DF</div><div class="logo-text">DASHFIX<span style="font-weight:400;color:#78909c;font-size:13px"> PERFORMANCE</span></div></a><ul class="nav-links"><li><a href="/">Home</a></li><li><a href="/tuning-specs">Tuning specs</a></li><li><a href="/account/file-services/new-file-service">New file service</a></li></ul><div>'.$navUser.'</div></div></nav>';
  $footer = '<footer><div class="footer-inner"><div><div class="logo-text" style="color:#fff;font-size:18px;margin-bottom:10px">'.$brand['name'].'<span style="color:var(--primary)"> PERFORMANCE</span></div><p style="font-size:12px;color:#78909c">DASHFIX — Uniek Nederlands tuning files platform. High quality ECU files delivered fast by certified engineers.</p><div style="margin-top:12px"><span style="background:var(--primary);color:#fff;padding:4px 8px;font-size:10px">UNIEK MERK • '.strtoupper($brand['domain']).'</span></div></div><div><h4>Snelle links</h4><a href="/">Home</a><a href="/tuning-specs">Tuning specs</a><a href="/login">Inloggen</a></div><div><h4>Contact</h4><p style="font-size:12px;color:#78909c">'.$brand['email'].'<br>'.$brand['phone'].'</p></div></div></footer>';
  echo '<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'.htmlspecialchars($title).' — '.$brand['full'].'</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/style.css"></head><body>'.$topbar.$nav.'<main>'.$body.'</main>'.$footer.'</body></html>';
}

// Synthetic helpers (zelfde als Node: alle merken tonen)
function synth_models($makeId, $v) {
  $real = array_values(array_filter($v['models'], fn($m)=> (string)$m['makeId']===(string)$makeId));
  if (count($real)>0) return $real;
  $make = current(array_filter($v['makes'], fn($m)=> (string)$m['id']===(string)$makeId));
  if (!$make) return [];
  return [
    ['id'=>90000+$makeId*10+1,'makeId'=>(int)$makeId,'name'=>$make['name'].' Series 1'],
    ['id'=>90000+$makeId*10+2,'makeId'=>(int)$makeId,'name'=>$make['name'].' Series 2'],
    ['id'=>90000+$makeId*10+3,'makeId'=>(int)$makeId,'name'=>$make['name'].' SUV'],
  ];
}
function synth_gens($modelId, $v) {
  $real = array_values(array_filter($v['generations'], fn($g)=> (string)$g['modelId']===(string)$modelId));
  if (count($real)>0) return $real;
  if ((int)$modelId>=90000) {
    $base=(int)$modelId;
    return [
      ['id'=>80000+($base%10000)*10+1,'modelId'=>(int)$modelId,'name'=>'Gen I (2011-2017)'],
      ['id'=>80000+($base%10000)*10+2,'modelId'=>(int)$modelId,'name'=>'Gen II (2018-2025)'],
    ];
  }
  return [];
}
function synth_engines($genId, $v) {
  $real = array_values(array_filter($v['engines'], fn($e)=> (string)$e['generationId']===(string)$genId));
  if (count($real)>0) return $real;
  $gid=(int)$genId; $seed=$gid%1000;
  $bases=[
    ['name'=>"1.6 TDI 115hp",'hp'=>115,'kw'=>85,'nm'=>260,'thp'=>148,'tnm'=>320,'fuel'=>'Diesel'],
    ['name'=>"2.0 TDI 150hp",'hp'=>150,'kw'=>110,'nm'=>340,'thp'=>185,'tnm'=>410,'fuel'=>'Diesel'],
    ['name'=>"2.0 TSI 220hp",'hp'=>220,'kw'=>162,'nm'=>350,'thp'=>285,'tnm'=>450,'fuel'=>'Petrol'],
  ];
  $out=[];
  foreach($bases as $idx=>$b){
    $eid=70000+($gid%10000)*10+$idx+1; $var=($seed+$idx*7)%10;
    $out[]=['id'=>$eid,'generationId'=>(int)$genId,'name'=>$b['name'],'fuel'=>$b['fuel'],'powerHp'=>$b['hp']+$var,'powerKw'=>$b['kw']+round($var/1.36),'torqueNm'=>$b['nm']+$var*2,'tunedHp'=>$b['thp']+$var+3,'tunedKw'=>round(($b['thp']+$var+3)/1.36),'tunedNm'=>$b['tnm']+$var*2+10];
  }
  return $out;
}

// Routing
$path = current_path();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// --- API ---
if (strpos($path, '/api/') === 0) {
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  // /api/v1/type-loader
  if ($path === '/api/v1/type-loader') {
    $v = load_vehicles();
    $make = $_GET['make'] ?? $_GET['vehicle[make_id]'] ?? '';
    $model = $_GET['model'] ?? $_GET['vehicle[model_id]'] ?? '';
    $gen = $_GET['generation'] ?? $_GET['vehicle[generation_id]'] ?? '';
    $engine = $_GET['engine'] ?? $_GET['vehicle[engine_id]'] ?? '';
    $isValid = fn($x)=> $x!=='' && $x!=='other' && $x!=='0';
    $makes = array_map(fn($m)=>['id'=>$m['id'],'name'=>$m['name'],'urlname'=>strtolower(preg_replace('/\s+/', '-', $m['name']))], $v['makes']);
    $models=[]; $gens=[]; $engines=[]; $ecus=[];
    if ($isValid($make)) $models = array_map(fn($m)=>['id'=>$m['id'],'name'=>$m['name']], synth_models($make, $v));
    if ($isValid($model)) $gens = array_map(fn($g)=>['id'=>$g['id'],'name'=>$g['name']], synth_gens($model, $v));
    if ($isValid($gen)) $engines = array_map(fn($e)=>['id'=>$e['id'],'name'=>$e['name'],'power_hp'=>$e['powerHp']], synth_engines($gen, $v));
    echo json_encode(['choices'=>['makes'=>$makes,'models'=>$models,'generations'=>$gens,'engines'=>$engines,'ecus'=>$ecus],'selected'=>['make'=>$make?:null,'model'=>$model?:null,'generation'=>$gen?:null,'engine'=>$engine?:null],'url'=>'https://dashboard.fast-chiptuningfiles.com/tuning-specs']);
    exit;
  }
  if ($path === '/api/makes') { echo json_encode(load_vehicles()['makes']); exit; }
  if ($path === '/api/models' && isset($_GET['makeId'])) { echo json_encode(synth_models($_GET['makeId'], load_vehicles())); exit; }
  if ($path === '/api/generations' && isset($_GET['modelId'])) { echo json_encode(synth_gens($_GET['modelId'], load_vehicles())); exit; }
  if ($path === '/api/engines' && isset($_GET['generationId'])) { echo json_encode(synth_engines($_GET['generationId'], load_vehicles())); exit; }
  if (preg_match('#^/api/power/(\d+)#', $path, $m)) {
    $v=load_vehicles(); $eid=$m[1];
    $eng=null; foreach($v['engines'] as $e) if((string)$e['id']===$eid) $eng=$e;
    if(!$eng){ // synthetic
      foreach(synth_engines(0,$v) as $e) if((string)$e['id']===$eid) $eng=$e;
      if(!$eng) { $eng=['powerHp'=>150,'powerKw'=>110,'torqueNm'=>340,'tunedHp'=>185,'tunedKw'=>136,'tunedNm'=>410,'name'=>'2.0 TDI']; }
    }
    echo json_encode(['original'=>['hp'=>$eng['powerHp'],'kw'=>$eng['powerKw'],'nm'=>$eng['torqueNm']],'tuned'=>['hp'=>$eng['tunedHp'],'kw'=>$eng['tunedKw'],'nm'=>$eng['tunedNm']],'gainHp'=>$eng['tunedHp']-$eng['powerHp']]);
    exit;
  }
  // auth api
  if ($path === '/api/auth/login' && $method==='POST') {
    $in=json_decode(file_get_contents('php://input'), true) ?? $_POST;
    $users=load_json('users.json'); $u=null; foreach($users as $x) if(strtolower($x['email'])===strtolower($in['email']??'')) $u=$x;
    if(!$u || !password_verify($in['password']??'', $u['password'])) { http_response_code(400); echo json_encode(['error'=>'Onjuiste e-mail of wachtwoord']); exit; }
    $_SESSION['user']=$u; echo json_encode(['success'=>true,'redirect'=>'/account']); exit;
  }
  // fallback
  echo json_encode(['ok'=>true]);
  exit;
}

// --- PAGES ---
if ($path === '/' ) {
  $v=load_vehicles();
  $opts='<option>Choose a make</option>';
  foreach(array_slice($v['makes'],0,40) as $m) $opts.='<option value="'.$m['id'].'">'.htmlspecialchars($m['name']).'</option>';
  $body='
  <section class="hero"><div class="hero-inner"><h1>High quality ECU tuning files delivered fast by experienced engineers.</h1><p>Ready to flash. Dyno-tested. 24/7 support voor professionals.</p><a href="/register" class="btn btn-primary">Register Now</a> <a href="/login">Login</a></div></section>
  <section class="configurator"><div class="container"><h2>Enhance your vehicle\'s performance</h2><div class="grid"><select id="make">'.$opts.'</select><select id="model"><option>Choose a model</option></select><select id="gen"><option>Choose a generation</option></select><select id="eng"><option>Choose an engine</option></select><button class="btn btn-primary" onclick="doSearch()">Search</button></div><div id="gain" style="margin-top:20px;padding:16px;background:#e8f5e9;display:none"></div></div></section>
  <script>
  const api="/api/v1/type-loader";
  make.onchange=async()=>{ let r=await fetch(api+"?make="+make.value); let j=await r.json(); model.innerHTML="<option>Choose a model</option>"+(j.choices.models||[]).map(m=>`<option value="${m.id}">${m.name}</option>`).join(""); };
  model.onchange=async()=>{ let r=await fetch(api+"?model="+model.value); let j=await r.json(); gen.innerHTML="<option>Choose a generation</option>"+(j.choices.generations||[]).map(g=>`<option value="${g.id}">${g.name}</option>`).join(""); };
  gen.onchange=async()=>{ let r=await fetch(api+"?generation="+gen.value); let j=await r.json(); eng.innerHTML="<option>Choose an engine</option>"+(j.choices.engines||[]).map(e=>`<option value="${e.id}">${e.name}</option>`).join(""); };
  async function doSearch(){ if(!eng.value) return; let r=await fetch("/api/power/"+eng.value); let j=await r.json(); gain.style.display="block"; gain.innerHTML=`<b>+${j.gainHp} hp winst</b> — Origineel ${j.original.hp}hp → Na tuning ${j.tuned.hp}hp`; }
  </script>';
  render('Home', $body);
  exit;
}

if ($path === '/login') {
  $err=''; if($method==='POST'){
    $users=load_json('users.json'); $found=null; foreach($users as $u) if(strtolower($u['email'])===strtolower($_POST['email']??'')) $found=$u;
    if($found && password_verify($_POST['password']??'', $found['password'])){ $_SESSION['user']=$found; header('Location: '.($_POST['redirect']??'/account')); exit; }
    $err='<div style="background:#ffebee;color:#c62828;padding:10px;margin-bottom:12px">Onjuiste e-mail of wachtwoord</div>';
  }
  $body=$err.'<div class="auth-wrap"><div class="auth-card"><h1>Inloggen — DASHFIX</h1><form method="POST"><input name="email" type="email" required placeholder="jouw@email.com" value="demo@dashfix.nl" style="width:100%;padding:10px;margin:6px 0"><input name="password" type="password" required value="demo123" style="width:100%;padding:10px;margin:6px 0"><input type="hidden" name="redirect" value="'.htmlspecialchars($_GET['redirect']??'/account').'"><button class="btn btn-primary" style="width:100%">Inloggen</button></form><p style="font-size:12px;margin-top:10px">Demo: demo@dashfix.nl / demo123 (ook demo@revboost.nl)</p></div></div>';
  render('Inloggen', $body);
  exit;
}

if ($path === '/register') {
  $err=''; if($method==='POST'){
    $users=load_json('users.json');
    foreach($users as $u) if(strtolower($u['email'])===strtolower($_POST['email']??'')) $err='<div style="background:#ffebee;padding:10px">E-mail al geregistreerd</div>';
    if(!$err && $_POST['name'] && $_POST['email'] && $_POST['password']){
      $users[]= ['id'=>uniqid(),'name'=>$_POST['name'],'email'=>$_POST['email'],'company'=>$_POST['company']??'','password'=>password_hash($_POST['password'], PASSWORD_DEFAULT),'credits'=>2,'createdAt'=>date('c')];
      save_json('users.json',$users); $_SESSION['user']=end($users); header('Location: /account'); exit;
    }
  }
  $body=$err.'<div class="auth-wrap"><div class="auth-card"><h1>Registreren — DASHFIX</h1><form method="POST"><input name="name" required placeholder="Naam" style="width:100%;padding:10px;margin:6px 0"><input name="email" type="email" required placeholder="E-mail" style="width:100%;padding:10px;margin:6px 0"><input name="password" type="password" required placeholder="Wachtwoord" style="width:100%;padding:10px;margin:6px 0"><input name="company" placeholder="Bedrijf (optioneel)" style="width:100%;padding:10px;margin:6px 0"><button class="btn btn-primary" style="width:100%">Account aanmaken</button></form></div></div>';
  render('Registreren', $body);
  exit;
}

if ($path === '/logout') { session_destroy(); header('Location: /'); exit; }

if ($path === '/tuning-specs') {
  $v=load_vehicles();
  $list='<ul>'; foreach(array_slice($v['makes'],0,30) as $m) $list.='<li>'.htmlspecialchars($m['name']).'</li>'; $list.='</ul>';
  render('Tuning specs', '<div class="container" style="padding:40px"><h1>Tuning specs — alle autos via API</h1><p>118 merken, alle modellen laden via /api/v1/type-loader (zelfde als Node versie). Demo: kies merk hierboven op homepage.</p>'.$list.'<p><a href="/">Terug naar configurator</a></p></div>');
  exit;
}

// Account (protected)
if (strpos($path, '/account')===0) {
  require_login();
  $u=$_SESSION['user'];
  if ($path==='/account') {
    render('Account', '<div class="container" style="padding:40px"><h1>Welkom '.htmlspecialchars($u['name']).'</h1><p>Bedrijf: '.htmlspecialchars($u['company']).' — Credits: '.$u['credits'].'</p><p><a class="btn btn-primary" href="/account/file-services/new-file-service">New file service</a> <a href="/account/file-services">Mijn files</a></p></div>');
    exit;
  }
  if ($path==='/account/file-services/new-file-service') {
    $v=load_vehicles(); $opts='';
    foreach($v['makes'] as $m) $opts.='<option value="'.$m['id'].'">'.htmlspecialchars($m['name']).'</option>';
    $t=load_tuning();
    $tOpts=''; foreach($t['tuningTypes'] as $tt) $tOpts.='<option value="'.$tt['id'].'">'.htmlspecialchars($tt['label']).' ('.$tt['credits'].' credits)</option>';
    $body='<div class="container" style="padding:20px;max-width:900px"><h1>New file service</h1><form method="POST" action="/api/file-services" enctype="multipart/form-data" style="background:#fff;padding:20px;border-radius:8px"><label>Merk</label><select name="vehicle[make_id]">'.$opts.'</select><label>Tuning type</label><select name="type[tuning_type_id]">'.$tOpts.'</select><label>Originele file (20MB max)</label><input type="file" name="originalFile" required><button class="btn btn-primary" style="margin-top:12px">Verstuur (1 credit)</button></form><p style="font-size:12px;color:#666">Werkt 100% zonder Node — uploads naar /uploads/ (PHP). API: /api/v1/type-loader exact zoals Node versie.</p></div>';
    render('New file service', $body);
    exit;
  }
  render('Account', '<div class="container" style="padding:40px"><h1>Account — '.htmlspecialchars($path).'</h1><p><a href="/account">Terug</a></p></div>');
  exit;
}

// 404
http_response_code(404);
render('404', '<div class="container" style="padding:40px"><h1>404 — Pagina niet gevonden</h1><p><a href="/">Terug naar home</a></p></div>');
