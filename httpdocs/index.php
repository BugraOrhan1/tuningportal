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
  $footer = '<footer><div class="footer-inner"><div><div class="logo-text" style="color:#fff;font-size:18px;margin-bottom:10px">'.$brand['name'].'<span style="color:var(--primary)"> PERFORMANCE</span></div><p style="font-size:12px;color:#78909c">DASHFIX — Uniek Nederlands tuning files platform. High quality ECU files delivered fast by certified engineers.</p><div style="margin-top:12px"><span style="background:var(--primary);color:#fff;padding:4px 8px;font-size:10px">UNIEK MERK • '.strtoupper($brand['domain']).'</span></div></div><div><h4>Snelle links</h4><a href="/">Home</a><a href="/tuning-specs">Tuning specs</a><a href="/login">Inloggen</a></div><div><h4>Contact</h4><p style="font-size:12px;color:#78909c">'.$brand['email'].'<br>'.$brand['phone'].'</p></div></div></footer><script src="/assets/js/app.js"></script><script src="/js/app.js"></script>';
  echo '<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'.htmlspecialchars($title).' — '.$brand['full'].'</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/css/style.css"><link rel="stylesheet" href="/css/style.css"></head><body>'.$topbar.$nav.'<main>'.$body.'</main>'.$footer.'</body></html>';
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
  $makes = $v['makes'];
  $brand = BRAND;
  ob_start();
  include __DIR__ . '/views/homepage.php';
  $body = ob_get_clean();
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
    $brand = BRAND;
    ob_start();
    // Perfect replica van dashboard.fast-chiptuningfiles.com/account/file-services/new-file-service.html (6620 regels)
    // Alleen action en brand aangepast voor DASHFIX
    ?>
    <div class="Crumbs"><div class="Crumbs__links"><p><span><a href="/account"><i class="fa fa-home"></i></a></span> <span class="sep">></span> <span><a href="/account/file-services">File services</a></span> <span class="sep">></span> <span>New file service</span></p></div></div>
    <h1>New file service</h1>
    <div class="Notice Notice--info"><div>Est. delivery 5-10 min — 6 blokken exact zoals origineel</div></div>
    <form method="POST" action="/api/file-services" accept-charset="UTF-8" novalidate id="file-service" data-type-loader-url="/api/v1/type-loader" data-type-loader-error="An error occurred while fetching data. Please try again later." enctype="multipart/form-data"><input name="_token" type="hidden" value="rU9YjdvGNQOREFe1lzcQhbGCp8YeesAQfTz5RPJZ">

            <button type="submit" style="position: absolute; left: -9999px;" tabindex="-1" aria-hidden="true"></button>
    
            <input type="hidden" name="__referrer" value="">
        <input type="hidden" name="__form" value="8fa8b4201a324a1682cca0373d0fc241da29ab1d">
    
    
    
                        <div class="Block">
                    <div class="Block__header">
                Vehicle
            </div>
                <div class="Block__content">
            <div class="Form flex">

                            <div class="fld fld_2 form-group"  >
    

            
        <label for="vehicle[make_id]" class="control-label required">Make</label>
    
                                        <select class="form-control border" data-type-loader="make" required="required" id="vehicle[make_id]" name="vehicle[make_id]"><option value="" selected="selected">Make your choice</option><option value="other">Otherwise, namely</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_2 form-group"  >
    

            
        <label for="vehicle[model_id]" class="control-label required">Model</label>
    
                                        <select class="form-control border" data-type-loader="model" required="required" id="vehicle[model_id]" name="vehicle[model_id]"><option value="" selected="selected">Make your choice</option><option value="other">Otherwise, namely</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_2 form-group"  >
    

            
        <label for="vehicle[generation_id]" class="control-label required">Generation</label>
    
                                        <select class="form-control border" data-type-loader="generation" required="required" id="vehicle[generation_id]" name="vehicle[generation_id]"><option value="" selected="selected">Make your choice</option><option value="other">Otherwise, namely</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_3 form-group"  >
    

            
        <label for="vehicle[engine_id]" class="control-label required">Engine</label>
    
                                        <select class="form-control border" data-type-loader="engine" required="required" id="vehicle[engine_id]" name="vehicle[engine_id]"><option value="" selected="selected">Make your choice</option><option value="other">Otherwise, namely</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_3 form-group"  >
    

            
        <label for="vehicle[ecu_id]" class="control-label required">ECU</label>
    
                                        <select class="form-control border" data-type-loader="ecu" required="required" id="vehicle[ecu_id]" name="vehicle[ecu_id]"><option value="" selected="selected">Make your choice</option><option value="other">Otherwise, namely</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_2 fld_spacer" ></div>

                                <div class="fld fld_2" data-usable="{&quot;urlname&quot;:&quot;vehicle\/make&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;make_id&quot;,&quot;values&quot;:[&quot;other&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="vehicle[make]" type="text">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_2 fld_spacer" ></div>

                                <div class="fld fld_2" data-usable="{&quot;urlname&quot;:&quot;vehicle\/model&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;model_id&quot;,&quot;values&quot;:[&quot;other&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="vehicle[model]" type="text">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_2 fld_spacer" ></div>

                                <div class="fld fld_2" data-usable="{&quot;urlname&quot;:&quot;vehicle\/generation&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;generation_id&quot;,&quot;values&quot;:[&quot;other&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="vehicle[generation]" type="text">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_3 fld_spacer" ></div>

                                <div class="fld fld_3" data-usable="{&quot;urlname&quot;:&quot;vehicle\/engine&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;engine_id&quot;,&quot;values&quot;:[&quot;other&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="vehicle[engine]" type="text">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_3 fld_spacer" ></div>

                                <div class="fld fld_3" data-usable="{&quot;urlname&quot;:&quot;vehicle\/ecu&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;ecu_id&quot;,&quot;values&quot;:[&quot;other&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="vehicle[ecu]" type="text">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_12" >


    <div class="form-group" >

    <div class="form-control-static" id="vehicle[power_increase]" aria-describedby="help-vehicle[power_increase]" ><a href="https://dashboard.tuningportal.dashfix.nl/account/file-services/power-increase/:engine" class="view-power-increase link-color" style="display: none;">View power increase</a></div>

    
    </div>

    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;vehicle\/vehicle_type&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;make_id&quot;,&quot;values&quot;:[&quot;other&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

            
        <label for="vehicle[vehicle_type]" class="control-label" data-required-if-sibling="[{&quot;other&quot;:&quot;make_id&quot;,&quot;values&quot;:[&quot;other&quot;]}]">Vehicle type<span class="optional">(optional)</span></label>
    
                                        <select class="form-control border" id="vehicle[vehicle_type]" name="vehicle[vehicle_type]"><option value="" selected="selected">Make your choice</option><option value="car">Car</option><option value="truck">Truck</option><option value="agriculture">Agriculture</option><option value="bikes">Bike</option><option value="boats">Boat</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_6" >
    
            <label for="vehicle[power_hp]" class="control-label" data-required-without="[{&quot;fields&quot;:[&quot;vehicle[power_kw]&quot;]}]">Engine HP<span class="optional">(optional)</span></label>
    
            <div class="form-group" >
    
                        <input class="form-control border" step="any" min="1" max="10000" name="vehicle[power_hp]" type="number" id="vehicle[power_hp]">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_6" >
    
            <label for="vehicle[power_kw]" class="control-label" data-required-without="[{&quot;fields&quot;:[&quot;vehicle[power_hp]&quot;]}]">Engine kW<span class="optional">(optional)</span></label>
    
            <div class="form-group" >
    
                        <input class="form-control border" step="any" min="1" max="10000" name="vehicle[power_kw]" type="number" id="vehicle[power_kw]">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_6 form-group"  >
    

            
        <label for="vehicle[year]" class="control-label required">Year</label>
    
                                        <select class="form-control border" required="required" id="vehicle[year]" name="vehicle[year]"><option value="" selected="selected">Make your choice</option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option><option value="2023">2023</option><option value="2022">2022</option><option value="2021">2021</option><option value="2020">2020</option><option value="2019">2019</option><option value="2018">2018</option><option value="2017">2017</option><option value="2016">2016</option><option value="2015">2015</option><option value="2014">2014</option><option value="2013">2013</option><option value="2012">2012</option><option value="2011">2011</option><option value="2010">2010</option><option value="2009">2009</option><option value="2008">2008</option><option value="2007">2007</option><option value="2006">2006</option><option value="2005">2005</option><option value="2004">2004</option><option value="2003">2003</option><option value="2002">2002</option><option value="2001">2001</option><option value="2000">2000</option><option value="1999">1999</option><option value="1998">1998</option><option value="1997">1997</option><option value="1996">1996</option><option value="1995">1995</option><option value="1994">1994</option><option value="1993">1993</option><option value="1992">1992</option><option value="1991">1991</option><option value="1990">1990</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_6 form-group"  >
    

            
        <label for="vehicle[gearbox_id]" class="control-label required">Gearbox</label>
    
                                        <select class="form-control border" required="required" id="vehicle[gearbox_id]" name="vehicle[gearbox_id]"><option value="" selected="selected">Make your choice</option><option value="1826">5</option><option value="1827">6</option><option value="1828">7</option><option value="1829">Automatic Transmission</option><option value="1830">CVT</option><option value="1831">DCT</option><option value="1832">DKG</option><option value="1833">DSG</option><option value="1834">DSG6</option><option value="1835">DSG7</option><option value="1836">Multitronic</option><option value="1837">SMG</option><option value="1838">SMG2</option><option value="1839">SMG3</option><option value="1840">Tiptronic</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_6" >
    
            <label for="vehicle[license_plate]" class="control-label">License plate<span class="optional">(optional)</span></label>
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="vehicle[license_plate]" type="text" id="vehicle[license_plate]">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_6" >
    
            <label for="vehicle[vin]" class="control-label">VIN<span class="optional">(optional)</span></label>
    
            <div class="form-group" >
    
                        <input class="form-control border" minlength="17" maxlength="255" name="vehicle[vin]" type="text" id="vehicle[vin]">
            
    
            </div>
    
    
    
            </div>
    
                                <input class="form-control border" name="vehicle[octane_rating_required]" type="hidden">

                                <div class="fld fld_12 form-group"  >
    

            
        <label for="vehicle[octane_rating]" class="control-label">Octane rating<span class="optional">(optional)</span></label>
    
                                        <select class="form-control border" id="vehicle[octane_rating]" name="vehicle[octane_rating]"><option value="" selected="selected">Make your choice</option><option value="91AKI / 95RON">91AKI / 95RON</option><option value="93AKI / 98RON">93AKI / 98RON</option><option value="95AKI / 102RON">95AKI / 102RON</option><option value="Racegas 100+ RON / 105+ RON">Racegas 100+ RON / 105+ RON</option></select>


                    
                            
        
            

            </div>
    
            

            </div>
        </div>
    </div>



                                <div class="Block">
                    <div class="Block__header">
                ECU details
            </div>
                <div class="Block__content">
            <div class="Form flex">

                            <div class="fld fld_3 form-group"  >
    

            
        <label for="tuning[tool_type]" class="control-label required">Tool type</label>
    
                                        <select class="form-control border" required="required" id="tuning[tool_type]" name="tuning[tool_type]"><option value="" selected="selected">Make your choice</option><option value="master">Master</option><option value="slave">Slave</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_3 form-group"  >
    

            
        <label for="tuning[read_method_id]" class="control-label required">Read method</label>
    
                                        <select class="form-control border" required="required" id="tuning[read_method_id]" name="tuning[read_method_id]"><option value="" selected="selected">Make your choice</option><option value="5583">Abrites</option><option value="4548">Alientech Kess</option><option value="4549">Alientech KTAG</option><option value="4550">Alientech Powergate</option><option value="4551">Autotuner Bench</option><option value="4552">Autotuner Bootmode</option><option value="4553">Autotuner OBD</option><option value="4554">bFlash Bench</option><option value="4555">bFlash BOOT</option><option value="4556">bFlash OBD</option><option value="4557">Bitbox</option><option value="4561">CMD BDM</option><option value="4562">CMD Bench</option><option value="4563">CMD OBD</option><option value="4564">CMD Tricore Boottool</option><option value="5580">DFB Technology</option><option value="4565">Dimsport Genius</option><option value="4566">Dimsport New Trasdata</option><option value="5582">Dimtronic</option><option value="4567">Eprom programmer</option><option value="4568">EVC BDM</option><option value="4569">EVC BSL</option><option value="4587">FC200 BENCH</option><option value="4586">FC200 OBD</option><option value="4570">Femto (Bmw tool)</option><option value="4571">FGtech</option><option value="4585">FOXflash BENCH</option><option value="4584">FOXflash OBD</option><option value="4572">Frieling i-Boot</option><option value="4573">Frieling i-Flash</option><option value="4574">Frieling SPI Wizard</option><option value="4575">Galetto</option><option value="4576">Hptuners</option><option value="5581">I/O Terminal</option><option value="4589">KT200 BENCH</option><option value="4588">KT200 OBD</option><option value="4577">Magic Motorsport MAGPRO Bench/FLex</option><option value="4578">Magic Motorsport MAGPRO Bootmode</option><option value="4579">Magic Motorsport MAGPRO OBD</option><option value="4580">MPPS</option><option value="5578">OBD Star</option><option value="4581">PCM-Flash</option><option value="5579">TGFlash</option><option value="other">Otherwise, namely</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_6 fld_spacer" ></div>

                                <div class="fld fld_6" data-usable="{&quot;urlname&quot;:&quot;tuning\/read_method_other&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;read_method_id&quot;,&quot;values&quot;:[&quot;other&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
            <label for="tuning[read_method_other]" class="control-label  required">Read method</label>
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="tuning[read_method_other]" type="text" id="tuning[read_method_other]">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_6 fld_spacer" data-usable="{&quot;urlname&quot;:&quot;tuning\/spacer_2&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;read_method_id&quot;,&quot;values&quot;:[&quot;other&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}"></div>

                                <div class="fld fld_3" >
    
            <label for="tuning[hardware_number]" class="control-label">Hardware number<span class="optional">(optional)</span></label>
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="tuning[hardware_number]" type="text" id="tuning[hardware_number]">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_3" >
    
            <label for="tuning[software_number]" class="control-label">Software number<span class="optional">(optional)</span></label>
    
            <div class="form-group" >
    
                        <input class="form-control border" maxlength="255" name="tuning[software_number]" type="text" id="tuning[software_number]">
            
    
            </div>
    
    
    
            </div>
    
            

            </div>
        </div>
    </div>



                                <div class="Block">
                    <div class="Block__header">
                Tuning type
            </div>
                <div class="Block__content">
            <div class="Form flex">

                            <div class="RadioWrapper fld fld_6 form-group"  >
    
    <fieldset class="border">

    
                                        <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1933"  name="type[tuning_type_id]" type="radio" value="1933">
        <span></span>
        <span>
            Car Tuning (Stage 1) (1.00 credit)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1934"  name="type[tuning_type_id]" type="radio" value="1934">
        <span></span>
        <span>
            Car tuning (Stage 2) (1.20 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1935"  name="type[tuning_type_id]" type="radio" value="1935">
        <span></span>
        <span>
            Car tuning (Stage 3) (5.00 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1939"  name="type[tuning_type_id]" type="radio" value="1939">
        <span></span>
        <span>
            Only options (Car) (0.00 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1937"  name="type[tuning_type_id]" type="radio" value="1937">
        <span></span>
        <span>
            TCU Tuning (Stage1)(includes internal torque and shifting speed faster) (1.00 credit)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1938"  name="type[tuning_type_id]" type="radio" value="1938">
        <span></span>
        <span>
            Only options (TCU) (0.00 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1936"  name="type[tuning_type_id]" type="radio" value="1936">
        <span></span>
        <span>
            Truck/Agriculture tuning (Stage 1) (1.00 credit)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1940"  name="type[tuning_type_id]" type="radio" value="1940">
        <span></span>
        <span>
            Only options (Truck/Agriculture) (0.00 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1948"  name="type[tuning_type_id]" type="radio" value="1948">
        <span></span>
        <span>
            Checksum ( if possible ) (0.50 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1946"  name="type[tuning_type_id]" type="radio" value="1946">
        <span></span>
        <span>
            Immo off (If possible) (1.00 credit)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1941"  name="type[tuning_type_id]" type="radio" value="1941">
        <span></span>
        <span>
            E85 Conversion (2.00 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1942"  name="type[tuning_type_id]" type="radio" value="1942">
        <span></span>
        <span>
            Back to stock (0.20 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1944"  name="type[tuning_type_id]" type="radio" value="1944">
        <span></span>
        <span>
            MapSwitch Simos 18.X Edc17.X Med17.X med9.X MG1 MD1 (5.00 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_1945"  name="type[tuning_type_id]" type="radio" value="1945">
        <span></span>
        <span>
            Tuning file review (0.50 credits)

                    </span>
    </label>

    
    </div>

                            <div class="fld fld_12 " >
    <label class="FancyRadio">
        <input class="border" id="type_tuning_type_id_2078"  name="type[tuning_type_id]" type="radio" value="2078">
        <span></span>
        <span>
            Ecu Clone Service (0.50 credits)

                    </span>
    </label>

    
    </div>

                    
                            
        
            
    </fieldset>

            </div>
    
                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1933&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15296&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15296][tuning_options_list][15296][enabled]" placeholder="File-services::customer.fields.tuning options list.15296.enabled.placeholder" name="type[option_group_15296][tuning_options_list][15296][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            AdBlue / SCR (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="switching off the AdBlue system"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15297&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15297][tuning_options_list][15297][enabled]" placeholder="File-services::customer.fields.tuning options list.15297.enabled.placeholder" name="type[option_group_15297][tuning_options_list][15297][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            AdBlue + DPF off (+1.50 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15297\/tuning_options_list\/15297\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_15297][tuning_options_list][15297][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_15297][tuning_options_list][15297][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15298&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15298][tuning_options_list][15298][enabled]" placeholder="File-services::customer.fields.tuning options list.15298.enabled.placeholder" name="type[option_group_15298][tuning_options_list][15298][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Antilag (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15299&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15299][tuning_options_list][15299][enabled]" placeholder="File-services::customer.fields.tuning options list.15299.enabled.placeholder" name="type[option_group_15299][tuning_options_list][15299][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Cylinder on Demand off (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15300&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15300][tuning_options_list][15300][enabled]" placeholder="File-services::customer.fields.tuning options list.15300.enabled.placeholder" name="type[option_group_15300][tuning_options_list][15300][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Decat (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Switching off the catalyst"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15301&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15301][tuning_options_list][15301][enabled]" placeholder="File-services::customer.fields.tuning options list.15301.enabled.placeholder" name="type[option_group_15301][tuning_options_list][15301][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF / OPF (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to remove the DPF filter"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15302&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15302][tuning_options_list][15302][enabled]" placeholder="File-services::customer.fields.tuning options list.15302.enabled.placeholder" name="type[option_group_15302][tuning_options_list][15302][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF / OPF + EGR (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15303&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15303][tuning_options_list][15303][enabled]" placeholder="File-services::customer.fields.tuning options list.15303.enabled.placeholder" name="type[option_group_15303][tuning_options_list][15303][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DSG Fart (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15304&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15304][tuning_options_list][15304][enabled]" placeholder="File-services::customer.fields.tuning options list.15304.enabled.placeholder" name="type[option_group_15304][tuning_options_list][15304][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DTC (+0.50 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15304\/tuning_options_list\/15304\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_15304][tuning_options_list][15304][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_15304][tuning_options_list][15304][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16822&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16822][tuning_options_list][16822][enabled]" placeholder="File-services::customer.fields.tuning options list.16822.enabled.placeholder" name="type[option_group_16822][tuning_options_list][16822][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Eolys / FAP (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to remove eolys / FAP"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16822\/tuning_options_list\/16822\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_16822][tuning_options_list][16822][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_16822][tuning_options_list][16822][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15305&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15305][tuning_options_list][15305][enabled]" placeholder="File-services::customer.fields.tuning options list.15305.enabled.placeholder" name="type[option_group_15305][tuning_options_list][15305][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            E85 FlexFluel (+2.00 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15306&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15306][tuning_options_list][15306][enabled]" placeholder="File-services::customer.fields.tuning options list.15306.enabled.placeholder" name="type[option_group_15306][tuning_options_list][15306][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            EGR (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15307&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15307][tuning_options_list][15307][enabled]" placeholder="File-services::customer.fields.tuning options list.15307.enabled.placeholder" name="type[option_group_15307][tuning_options_list][15307][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Evaporative Emission Control System (EVAP) (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal of the EVAP"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15308&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15308][tuning_options_list][15308][enabled]" placeholder="File-services::customer.fields.tuning options list.15308.enabled.placeholder" name="type[option_group_15308][tuning_options_list][15308][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Exhaust Flaps (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15309&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15309][tuning_options_list][15309][enabled]" placeholder="File-services::customer.fields.tuning options list.15309.enabled.placeholder" name="type[option_group_15309][tuning_options_list][15309][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Hard Cut limiter (FLames ) (+1.00 credit)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15309\/tuning_options_list\/15309\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15309][tuning_options_list][15309][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15310&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15310][tuning_options_list][15310][enabled]" placeholder="File-services::customer.fields.tuning options list.15310.enabled.placeholder" name="type[option_group_15310][tuning_options_list][15310][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Hot start / cold start FIX (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15311&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15311][tuning_options_list][15311][enabled]" placeholder="File-services::customer.fields.tuning options list.15311.enabled.placeholder" name="type[option_group_15311][tuning_options_list][15311][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Idle RPM (+0.50 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15311\/tuning_options_list\/15311\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15311][tuning_options_list][15311][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15312&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15312][tuning_options_list][15312][enabled]" placeholder="File-services::customer.fields.tuning options list.15312.enabled.placeholder" name="type[option_group_15312][tuning_options_list][15312][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Injector scalin (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15313&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15313][tuning_options_list][15313][enabled]" placeholder="File-services::customer.fields.tuning options list.15313.enabled.placeholder" name="type[option_group_15313][tuning_options_list][15313][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Launch Control (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15314&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15314][tuning_options_list][15314][enabled]" placeholder="File-services::customer.fields.tuning options list.15314.enabled.placeholder" name="type[option_group_15314][tuning_options_list][15314][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            MAF OFF (if possible) (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15315&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15315][tuning_options_list][15315][enabled]" placeholder="File-services::customer.fields.tuning options list.15315.enabled.placeholder" name="type[option_group_15315][tuning_options_list][15315][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Map sensor Set (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15316&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15316][tuning_options_list][15316][enabled]" placeholder="File-services::customer.fields.tuning options list.15316.enabled.placeholder" name="type[option_group_15316][tuning_options_list][15316][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Neutral RPM (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15317&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15317][tuning_options_list][15317][enabled]" placeholder="File-services::customer.fields.tuning options list.15317.enabled.placeholder" name="type[option_group_15317][tuning_options_list][15317][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            NOx off (only Petrol cars) (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15318&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15318][tuning_options_list][15318][enabled]" placeholder="File-services::customer.fields.tuning options list.15318.enabled.placeholder" name="type[option_group_15318][tuning_options_list][15318][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            O2 OFF (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15319&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15319][tuning_options_list][15319][enabled]" placeholder="File-services::customer.fields.tuning options list.15319.enabled.placeholder" name="type[option_group_15319][tuning_options_list][15319][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            OPF OFF (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15320&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15320][tuning_options_list][15320][enabled]" placeholder="File-services::customer.fields.tuning options list.15320.enabled.placeholder" name="type[option_group_15320][tuning_options_list][15320][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            OPF + EGR OFF (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15321&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15321][tuning_options_list][15321][enabled]" placeholder="File-services::customer.fields.tuning options list.15321.enabled.placeholder" name="type[option_group_15321][tuning_options_list][15321][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Performance Gauge BMW/Mini/VAG (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15322&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15322][tuning_options_list][15322][enabled]" placeholder="File-services::customer.fields.tuning options list.15322.enabled.placeholder" name="type[option_group_15322][tuning_options_list][15322][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Pop &amp; bang/crackle map (+1.00 credit)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15322\/tuning_options_list\/15322\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15322.loudness.placeholder" name="type[option_group_15322][tuning_options_list][15322][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15322\/tuning_options_list\/15322\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15322][tuning_options_list][15322][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15323&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15323][tuning_options_list][15323][enabled]" placeholder="File-services::customer.fields.tuning options list.15323.enabled.placeholder" name="type[option_group_15323][tuning_options_list][15323][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Pop &amp; bang/crackle map (Sport/button) (+1.20 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15323\/tuning_options_list\/15323\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15323.loudness.placeholder" name="type[option_group_15323][tuning_options_list][15323][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15323\/tuning_options_list\/15323\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15323][tuning_options_list][15323][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15324&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15324][tuning_options_list][15324][enabled]" placeholder="File-services::customer.fields.tuning options list.15324.enabled.placeholder" name="type[option_group_15324][tuning_options_list][15324][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Readiness Monitor (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15325&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15325][tuning_options_list][15325][enabled]" placeholder="File-services::customer.fields.tuning options list.15325.enabled.placeholder" name="type[option_group_15325][tuning_options_list][15325][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Rev Limiter (+0.20 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15325\/tuning_options_list\/15325\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15325][tuning_options_list][15325][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15326&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15326][tuning_options_list][15326][enabled]" placeholder="File-services::customer.fields.tuning options list.15326.enabled.placeholder" name="type[option_group_15326][tuning_options_list][15326][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Warranty Patch (BMW/Mini/VAG) (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="CVN"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15327&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15327][tuning_options_list][15327][enabled]" placeholder="File-services::customer.fields.tuning options list.15327.enabled.placeholder" name="type[option_group_15327][tuning_options_list][15327][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Secundairy Air Pump (SAP) (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15328&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15328][tuning_options_list][15328][enabled]" placeholder="File-services::customer.fields.tuning options list.15328.enabled.placeholder" name="type[option_group_15328][tuning_options_list][15328][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Smoke mapping (Diesel) (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15329&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15329][tuning_options_list][15329][enabled]" placeholder="File-services::customer.fields.tuning options list.15329.enabled.placeholder" name="type[option_group_15329][tuning_options_list][15329][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Start / Stop system off (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15330&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15330][tuning_options_list][15330][enabled]" placeholder="File-services::customer.fields.tuning options list.15330.enabled.placeholder" name="type[option_group_15330][tuning_options_list][15330][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Startup roar (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15331&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15331][tuning_options_list][15331][enabled]" placeholder="File-services::customer.fields.tuning options list.15331.enabled.placeholder" name="type[option_group_15331][tuning_options_list][15331][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Swirl Flaps off (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15332&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15332][tuning_options_list][15332][enabled]" placeholder="File-services::customer.fields.tuning options list.15332.enabled.placeholder" name="type[option_group_15332][tuning_options_list][15332][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Torque Monitoring off (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15333&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15333][tuning_options_list][15333][enabled]" placeholder="File-services::customer.fields.tuning options list.15333.enabled.placeholder" name="type[option_group_15333][tuning_options_list][15333][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            V-Max Off (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15334&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1933],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15334][tuning_options_list][15334][enabled]" placeholder="File-services::customer.fields.tuning options list.15334.enabled.placeholder" name="type[option_group_15334][tuning_options_list][15334][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            V-Max Limited to custom speed (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1934&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15335&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15335][tuning_options_list][15335][enabled]" placeholder="File-services::customer.fields.tuning options list.15335.enabled.placeholder" name="type[option_group_15335][tuning_options_list][15335][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            AdBlue / SCR (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15336&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15336][tuning_options_list][15336][enabled]" placeholder="File-services::customer.fields.tuning options list.15336.enabled.placeholder" name="type[option_group_15336][tuning_options_list][15336][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Antilag (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15337&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15337][tuning_options_list][15337][enabled]" placeholder="File-services::customer.fields.tuning options list.15337.enabled.placeholder" name="type[option_group_15337][tuning_options_list][15337][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Cat Heating (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15338&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15338][tuning_options_list][15338][enabled]" placeholder="File-services::customer.fields.tuning options list.15338.enabled.placeholder" name="type[option_group_15338][tuning_options_list][15338][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Cylinder on Demand off (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15339&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15339][tuning_options_list][15339][enabled]" placeholder="File-services::customer.fields.tuning options list.15339.enabled.placeholder" name="type[option_group_15339][tuning_options_list][15339][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Decat (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15341&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15341][tuning_options_list][15341][enabled]" placeholder="File-services::customer.fields.tuning options list.15341.enabled.placeholder" name="type[option_group_15341][tuning_options_list][15341][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DSG Farts (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15340&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15340][tuning_options_list][15340][enabled]" placeholder="File-services::customer.fields.tuning options list.15340.enabled.placeholder" name="type[option_group_15340][tuning_options_list][15340][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            E85 FlexFluel (+2.00 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15342&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15342][tuning_options_list][15342][enabled]" placeholder="File-services::customer.fields.tuning options list.15342.enabled.placeholder" name="type[option_group_15342][tuning_options_list][15342][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            EGR (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15343&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15343][tuning_options_list][15343][enabled]" placeholder="File-services::customer.fields.tuning options list.15343.enabled.placeholder" name="type[option_group_15343][tuning_options_list][15343][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15344&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15344][tuning_options_list][15344][enabled]" placeholder="File-services::customer.fields.tuning options list.15344.enabled.placeholder" name="type[option_group_15344][tuning_options_list][15344][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF + EGR OFF (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15345&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15345][tuning_options_list][15345][enabled]" placeholder="File-services::customer.fields.tuning options list.15345.enabled.placeholder" name="type[option_group_15345][tuning_options_list][15345][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DTC off (free)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15345\/tuning_options_list\/15345\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_15345][tuning_options_list][15345][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_15345][tuning_options_list][15345][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15346&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15346][tuning_options_list][15346][enabled]" placeholder="File-services::customer.fields.tuning options list.15346.enabled.placeholder" name="type[option_group_15346][tuning_options_list][15346][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Evaporative Emission Control System ( EVAP ) (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15347&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15347][tuning_options_list][15347][enabled]" placeholder="File-services::customer.fields.tuning options list.15347.enabled.placeholder" name="type[option_group_15347][tuning_options_list][15347][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Exhaust flaps (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15348&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15348][tuning_options_list][15348][enabled]" placeholder="File-services::customer.fields.tuning options list.15348.enabled.placeholder" name="type[option_group_15348][tuning_options_list][15348][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Hard Cut limiter (FLames ) (+0.50 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15348\/tuning_options_list\/15348\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15348][tuning_options_list][15348][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15349&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15349][tuning_options_list][15349][enabled]" placeholder="File-services::customer.fields.tuning options list.15349.enabled.placeholder" name="type[option_group_15349][tuning_options_list][15349][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            cold start FIX / Hot Start FIX (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15350&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15350][tuning_options_list][15350][enabled]" placeholder="File-services::customer.fields.tuning options list.15350.enabled.placeholder" name="type[option_group_15350][tuning_options_list][15350][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Idle RPM (+0.50 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15350\/tuning_options_list\/15350\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15350][tuning_options_list][15350][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15351&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15351][tuning_options_list][15351][enabled]" placeholder="File-services::customer.fields.tuning options list.15351.enabled.placeholder" name="type[option_group_15351][tuning_options_list][15351][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Launch controle (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15352&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15352][tuning_options_list][15352][enabled]" placeholder="File-services::customer.fields.tuning options list.15352.enabled.placeholder" name="type[option_group_15352][tuning_options_list][15352][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            MAF OFF (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15353&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15353][tuning_options_list][15353][enabled]" placeholder="File-services::customer.fields.tuning options list.15353.enabled.placeholder" name="type[option_group_15353][tuning_options_list][15353][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Neutral RPM (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15354&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15354][tuning_options_list][15354][enabled]" placeholder="File-services::customer.fields.tuning options list.15354.enabled.placeholder" name="type[option_group_15354][tuning_options_list][15354][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            NOx off (only Petrol cars) (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15355&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15355][tuning_options_list][15355][enabled]" placeholder="File-services::customer.fields.tuning options list.15355.enabled.placeholder" name="type[option_group_15355][tuning_options_list][15355][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            OPF OFF (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15356&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15356][tuning_options_list][15356][enabled]" placeholder="File-services::customer.fields.tuning options list.15356.enabled.placeholder" name="type[option_group_15356][tuning_options_list][15356][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Performance Gauge BMW/Mini/VAG (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15357&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15357][tuning_options_list][15357][enabled]" placeholder="File-services::customer.fields.tuning options list.15357.enabled.placeholder" name="type[option_group_15357][tuning_options_list][15357][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Pop &amp; bang/crackle map (+1.00 credit)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15357\/tuning_options_list\/15357\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15357.loudness.placeholder" name="type[option_group_15357][tuning_options_list][15357][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15357\/tuning_options_list\/15357\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15357][tuning_options_list][15357][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15358&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15358][tuning_options_list][15358][enabled]" placeholder="File-services::customer.fields.tuning options list.15358.enabled.placeholder" name="type[option_group_15358][tuning_options_list][15358][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Pop &amp; bang/crackle map (Sport/button) (+1.20 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15358\/tuning_options_list\/15358\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15358.loudness.placeholder" name="type[option_group_15358][tuning_options_list][15358][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15358\/tuning_options_list\/15358\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15358][tuning_options_list][15358][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15359&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15359][tuning_options_list][15359][enabled]" placeholder="File-services::customer.fields.tuning options list.15359.enabled.placeholder" name="type[option_group_15359][tuning_options_list][15359][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Readiness Monitor (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15360&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15360][tuning_options_list][15360][enabled]" placeholder="File-services::customer.fields.tuning options list.15360.enabled.placeholder" name="type[option_group_15360][tuning_options_list][15360][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Rev Limiter (free)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15360\/tuning_options_list\/15360\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15360][tuning_options_list][15360][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15361&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15361][tuning_options_list][15361][enabled]" placeholder="File-services::customer.fields.tuning options list.15361.enabled.placeholder" name="type[option_group_15361][tuning_options_list][15361][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Secundairy Air Pump (SAP) (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15362&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15362][tuning_options_list][15362][enabled]" placeholder="File-services::customer.fields.tuning options list.15362.enabled.placeholder" name="type[option_group_15362][tuning_options_list][15362][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            START/STOP SYSTEM OFF (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15363&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15363][tuning_options_list][15363][enabled]" placeholder="File-services::customer.fields.tuning options list.15363.enabled.placeholder" name="type[option_group_15363][tuning_options_list][15363][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Swirl Flaps off (+0.20 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15364&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15364][tuning_options_list][15364][enabled]" placeholder="File-services::customer.fields.tuning options list.15364.enabled.placeholder" name="type[option_group_15364][tuning_options_list][15364][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Torque Monitoring off (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15365&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15365][tuning_options_list][15365][enabled]" placeholder="File-services::customer.fields.tuning options list.15365.enabled.placeholder" name="type[option_group_15365][tuning_options_list][15365][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            V-Max Off (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15366&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1934],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15366][tuning_options_list][15366][enabled]" placeholder="File-services::customer.fields.tuning options list.15366.enabled.placeholder" name="type[option_group_15366][tuning_options_list][15366][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Warranty Patch (BMW/Mini/VAG) (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="CVN"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1935&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15165&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15165][tuning_options_list][15165][enabled]" placeholder="File-services::customer.fields.tuning options list.15165.enabled.placeholder" name="type[option_group_15165][tuning_options_list][15165][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Injector scaling (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15166&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15166][tuning_options_list][15166][enabled]" placeholder="File-services::customer.fields.tuning options list.15166.enabled.placeholder" name="type[option_group_15166][tuning_options_list][15166][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Map sensor set (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15167&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15167][tuning_options_list][15167][enabled]" placeholder="File-services::customer.fields.tuning options list.15167.enabled.placeholder" name="type[option_group_15167][tuning_options_list][15167][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Swirl Flaps (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15168&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15168][tuning_options_list][15168][enabled]" placeholder="File-services::customer.fields.tuning options list.15168.enabled.placeholder" name="type[option_group_15168][tuning_options_list][15168][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            MAF OFF (if possible) (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15169&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15169][tuning_options_list][15169][enabled]" placeholder="File-services::customer.fields.tuning options list.15169.enabled.placeholder" name="type[option_group_15169][tuning_options_list][15169][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Map Sensor set (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15170&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15170][tuning_options_list][15170][enabled]" placeholder="File-services::customer.fields.tuning options list.15170.enabled.placeholder" name="type[option_group_15170][tuning_options_list][15170][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Anti lag (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15172&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15172][tuning_options_list][15172][enabled]" placeholder="File-services::customer.fields.tuning options list.15172.enabled.placeholder" name="type[option_group_15172][tuning_options_list][15172][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Launch Control (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15173&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15173][tuning_options_list][15173][enabled]" placeholder="File-services::customer.fields.tuning options list.15173.enabled.placeholder" name="type[option_group_15173][tuning_options_list][15173][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Hard Cut limiter (FLames ) (+1.00 credit)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15173\/tuning_options_list\/15173\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15173][tuning_options_list][15173][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15174&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15174][tuning_options_list][15174][enabled]" placeholder="File-services::customer.fields.tuning options list.15174.enabled.placeholder" name="type[option_group_15174][tuning_options_list][15174][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Warranty patch (Bmw/Mini/VAG) (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15175&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15175][tuning_options_list][15175][enabled]" placeholder="File-services::customer.fields.tuning options list.15175.enabled.placeholder" name="type[option_group_15175][tuning_options_list][15175][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Perf gauge Bmw/Mini (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15171&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15171][tuning_options_list][15171][enabled]" placeholder="File-services::customer.fields.tuning options list.15171.enabled.placeholder" name="type[option_group_15171][tuning_options_list][15171][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Pop &amp; bang/crackle map (+1.00 credit)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15171\/tuning_options_list\/15171\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15171.loudness.placeholder" name="type[option_group_15171][tuning_options_list][15171][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15171\/tuning_options_list\/15171\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15171][tuning_options_list][15171][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15382&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1935],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15382][tuning_options_list][15382][enabled]" placeholder="File-services::customer.fields.tuning options list.15382.enabled.placeholder" name="type[option_group_15382][tuning_options_list][15382][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Pop &amp; bang/crackle map (Sport/button) (+1.00 credit)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15382\/tuning_options_list\/15382\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15382.loudness.placeholder" name="type[option_group_15382][tuning_options_list][15382][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15382\/tuning_options_list\/15382\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15382][tuning_options_list][15382][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1939&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15256&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15256][tuning_options_list][15256][enabled]" placeholder="File-services::customer.fields.tuning options list.15256.enabled.placeholder" name="type[option_group_15256][tuning_options_list][15256][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            AdBlue / SCR (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Removal of AdBlue / SCR"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15257&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15257][tuning_options_list][15257][enabled]" placeholder="File-services::customer.fields.tuning options list.15257.enabled.placeholder" name="type[option_group_15257][tuning_options_list][15257][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            AdBlue / SCR + DPF (+1.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal AdBlue / SCR + DPF"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15257\/tuning_options_list\/15257\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_15257][tuning_options_list][15257][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_15257][tuning_options_list][15257][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16321&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16321][tuning_options_list][16321][enabled]" placeholder="File-services::customer.fields.tuning options list.16321.enabled.placeholder" name="type[option_group_16321][tuning_options_list][16321][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            AdBlue / SCR + DPF + EGR (+2.00 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal AdBlue + DPF + EGR"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15203&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15203][tuning_options_list][15203][enabled]" placeholder="File-services::customer.fields.tuning options list.15203.enabled.placeholder" name="type[option_group_15203][tuning_options_list][15203][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Anti lag (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="anti-lag system (ALS) is used on turbocharged engines to minimize turbo lag"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15268&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15268][tuning_options_list][15268][enabled]" placeholder="File-services::customer.fields.tuning options list.15268.enabled.placeholder" name="type[option_group_15268][tuning_options_list][15268][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Cat Heating (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to stop long cat heating"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15223&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15223][tuning_options_list][15223][enabled]" placeholder="File-services::customer.fields.tuning options list.15223.enabled.placeholder" name="type[option_group_15223][tuning_options_list][15223][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Checksumm (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to correct the checksumm"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15224&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15224][tuning_options_list][15224][enabled]" placeholder="File-services::customer.fields.tuning options list.15224.enabled.placeholder" name="type[option_group_15224][tuning_options_list][15224][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Cylinder on Demand off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Cilinder on Demand off"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15225&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15225][tuning_options_list][15225][enabled]" placeholder="File-services::customer.fields.tuning options list.15225.enabled.placeholder" name="type[option_group_15225][tuning_options_list][15225][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Decat (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal of the catalyst please write down DTC codes if present"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15258&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15258][tuning_options_list][15258][enabled]" placeholder="File-services::customer.fields.tuning options list.15258.enabled.placeholder" name="type[option_group_15258][tuning_options_list][15258][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF OFF (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn Diesel particle filter off"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15259&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15259][tuning_options_list][15259][enabled]" placeholder="File-services::customer.fields.tuning options list.15259.enabled.placeholder" name="type[option_group_15259][tuning_options_list][15259][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF + EGR OFF (+1.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal DPF and EGR"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15226&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15226][tuning_options_list][15226][enabled]" placeholder="File-services::customer.fields.tuning options list.15226.enabled.placeholder" name="type[option_group_15226][tuning_options_list][15226][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DSG Farts (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="programming DSG farts"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15227&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15227][tuning_options_list][15227][enabled]" placeholder="File-services::customer.fields.tuning options list.15227.enabled.placeholder" name="type[option_group_15227][tuning_options_list][15227][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DTC off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to Remove DTC P-Codes"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15227\/tuning_options_list\/15227\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_15227][tuning_options_list][15227][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_15227][tuning_options_list][15227][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15229&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15229][tuning_options_list][15229][enabled]" placeholder="File-services::customer.fields.tuning options list.15229.enabled.placeholder" name="type[option_group_15229][tuning_options_list][15229][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            EGR off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="EGR Removal"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15260&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15260][tuning_options_list][15260][enabled]" placeholder="File-services::customer.fields.tuning options list.15260.enabled.placeholder" name="type[option_group_15260][tuning_options_list][15260][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Exhaust flaps (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Reprogramming Exhaust flaps"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16821&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16821][tuning_options_list][16821][enabled]" placeholder="File-services::customer.fields.tuning options list.16821.enabled.placeholder" name="type[option_group_16821][tuning_options_list][16821][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Eolys / FAP (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to remove eolys / FAP"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16821\/tuning_options_list\/16821\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_16821][tuning_options_list][16821][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_16821][tuning_options_list][16821][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15228&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15228][tuning_options_list][15228][enabled]" placeholder="File-services::customer.fields.tuning options list.15228.enabled.placeholder" name="type[option_group_15228][tuning_options_list][15228][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            E85 Conversion (+2.00 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="E85 Conversion"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15270&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15270][tuning_options_list][15270][enabled]" placeholder="File-services::customer.fields.tuning options list.15270.enabled.placeholder" name="type[option_group_15270][tuning_options_list][15270][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Evaporative Emission Control System ( EVAP ) (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal of the EVAP"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15271&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15271][tuning_options_list][15271][enabled]" placeholder="File-services::customer.fields.tuning options list.15271.enabled.placeholder" name="type[option_group_15271][tuning_options_list][15271][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Hard Cut limiter (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Loud popcorn limiter"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15271\/tuning_options_list\/15271\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15271][tuning_options_list][15271][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15272&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15272][tuning_options_list][15272][enabled]" placeholder="File-services::customer.fields.tuning options list.15272.enabled.placeholder" name="type[option_group_15272][tuning_options_list][15272][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Hot Start FIX (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15273&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15273][tuning_options_list][15273][enabled]" placeholder="File-services::customer.fields.tuning options list.15273.enabled.placeholder" name="type[option_group_15273][tuning_options_list][15273][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Idle RPM (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Idle speed RPM , specify RPM of wich"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15273\/tuning_options_list\/15273\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15273][tuning_options_list][15273][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15274&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15274][tuning_options_list][15274][enabled]" placeholder="File-services::customer.fields.tuning options list.15274.enabled.placeholder" name="type[option_group_15274][tuning_options_list][15274][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Launch control (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Launch controle is an electronic aid to assist driver to accelerate rapidly from a standing start"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15275&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15275][tuning_options_list][15275][enabled]" placeholder="File-services::customer.fields.tuning options list.15275.enabled.placeholder" name="type[option_group_15275][tuning_options_list][15275][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            MAF OFF (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn the mass airflow sensor off"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15276&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15276][tuning_options_list][15276][enabled]" placeholder="File-services::customer.fields.tuning options list.15276.enabled.placeholder" name="type[option_group_15276][tuning_options_list][15276][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Map sensor Set (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to recalibrate the map Sensor to the ecu"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15277&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15277][tuning_options_list][15277][enabled]" placeholder="File-services::customer.fields.tuning options list.15277.enabled.placeholder" name="type[option_group_15277][tuning_options_list][15277][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Neutral RPM (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Remove the RPM while standing in idle"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15278&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15278][tuning_options_list][15278][enabled]" placeholder="File-services::customer.fields.tuning options list.15278.enabled.placeholder" name="type[option_group_15278][tuning_options_list][15278][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            NOx off (only Petrol cars) (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn off the NOX / O2 Sensor"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15279&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15279][tuning_options_list][15279][enabled]" placeholder="File-services::customer.fields.tuning options list.15279.enabled.placeholder" name="type[option_group_15279][tuning_options_list][15279][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            O2 OFF (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn off O2 sensors off"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15280&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15280][tuning_options_list][15280][enabled]" placeholder="File-services::customer.fields.tuning options list.15280.enabled.placeholder" name="type[option_group_15280][tuning_options_list][15280][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            OPF OFF (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn off the otto particle filter"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15281&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15281][tuning_options_list][15281][enabled]" placeholder="File-services::customer.fields.tuning options list.15281.enabled.placeholder" name="type[option_group_15281][tuning_options_list][15281][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            OPF + EGR (+1.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn Diesel particle filter off + EGR"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15282&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15282][tuning_options_list][15282][enabled]" placeholder="File-services::customer.fields.tuning options list.15282.enabled.placeholder" name="type[option_group_15282][tuning_options_list][15282][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Performance Gauge Vag/Mini/Bmw (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to rescale the performace monitor of the car"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15283&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15283][tuning_options_list][15283][enabled]" placeholder="File-services::customer.fields.tuning options list.15283.enabled.placeholder" name="type[option_group_15283][tuning_options_list][15283][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Pop &amp; bang/crackle map (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn on the overrun"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15283\/tuning_options_list\/15283\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15283.loudness.placeholder" name="type[option_group_15283][tuning_options_list][15283][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15283\/tuning_options_list\/15283\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15283][tuning_options_list][15283][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15284&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15284][tuning_options_list][15284][enabled]" placeholder="File-services::customer.fields.tuning options list.15284.enabled.placeholder" name="type[option_group_15284][tuning_options_list][15284][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Pop &amp; bang/crackle map (Sport/button) (+1.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn on the overrun"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15284\/tuning_options_list\/15284\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15284.loudness.placeholder" name="type[option_group_15284][tuning_options_list][15284][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15284\/tuning_options_list\/15284\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15284][tuning_options_list][15284][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15285&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15285][tuning_options_list][15285][enabled]" placeholder="File-services::customer.fields.tuning options list.15285.enabled.placeholder" name="type[option_group_15285][tuning_options_list][15285][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Readiness Calibration (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="make all readiness calibration pass"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15286&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15286][tuning_options_list][15286][enabled]" placeholder="File-services::customer.fields.tuning options list.15286.enabled.placeholder" name="type[option_group_15286][tuning_options_list][15286][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Rev Limiter (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="adjust the maximum engine speed rpm"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15286\/tuning_options_list\/15286\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15286][tuning_options_list][15286][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15287&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15287][tuning_options_list][15287][enabled]" placeholder="File-services::customer.fields.tuning options list.15287.enabled.placeholder" name="type[option_group_15287][tuning_options_list][15287][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Secundairy Air Pump (SAP) (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="remove the SAP"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15288&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15288][tuning_options_list][15288][enabled]" placeholder="File-services::customer.fields.tuning options list.15288.enabled.placeholder" name="type[option_group_15288][tuning_options_list][15288][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Smoke mapping (Diesel) (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to create alot of smoke"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15289&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15289][tuning_options_list][15289][enabled]" placeholder="File-services::customer.fields.tuning options list.15289.enabled.placeholder" name="type[option_group_15289][tuning_options_list][15289][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Start / Stop system off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn of the Start/Stop system"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15290&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15290][tuning_options_list][15290][enabled]" placeholder="File-services::customer.fields.tuning options list.15290.enabled.placeholder" name="type[option_group_15290][tuning_options_list][15290][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Swirl Flaps off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="To remove the Flaps/Swirl"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15291&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15291][tuning_options_list][15291][enabled]" placeholder="File-services::customer.fields.tuning options list.15291.enabled.placeholder" name="type[option_group_15291][tuning_options_list][15291][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Torque Monitoring off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="turning off Torque Monitoring"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15292&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15292][tuning_options_list][15292][enabled]" placeholder="File-services::customer.fields.tuning options list.15292.enabled.placeholder" name="type[option_group_15292][tuning_options_list][15292][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            V-Max Off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="to turn off the speedlimit"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15293&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15293][tuning_options_list][15293][enabled]" placeholder="File-services::customer.fields.tuning options list.15293.enabled.placeholder" name="type[option_group_15293][tuning_options_list][15293][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            V-Max Limited to custom speed (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Vmax limited to Specific Speed"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15294&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15294][tuning_options_list][15294][enabled]" placeholder="File-services::customer.fields.tuning options list.15294.enabled.placeholder" name="type[option_group_15294][tuning_options_list][15294][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Warranty Patch (BMW/MINI/VAG) (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="SVN PATCH"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15295&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1939],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15295][tuning_options_list][15295][enabled]" placeholder="File-services::customer.fields.tuning options list.15295.enabled.placeholder" name="type[option_group_15295][tuning_options_list][15295][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Startup roar (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1937&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16057&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16057][tuning_options_list][16057][enabled]" placeholder="File-services::customer.fields.tuning options list.16057.enabled.placeholder" name="type[option_group_16057][tuning_options_list][16057][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Activate Launch (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Activate Launch"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16057\/tuning_options_list\/16057\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_16057][tuning_options_list][16057][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16058&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16058][tuning_options_list][16058][enabled]" placeholder="File-services::customer.fields.tuning options list.16058.enabled.placeholder" name="type[option_group_16058][tuning_options_list][16058][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Clutch Pressure (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Clutch Pressure"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16059&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16059][tuning_options_list][16059][enabled]" placeholder="File-services::customer.fields.tuning options list.16059.enabled.placeholder" name="type[option_group_16059][tuning_options_list][16059][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Custom Shifting RPM (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Custom Shifting RPM"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16060&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16060][tuning_options_list][16060][enabled]" placeholder="File-services::customer.fields.tuning options list.16060.enabled.placeholder" name="type[option_group_16060][tuning_options_list][16060][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Gear Display (if possible) (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="mostly BMW ZF gearbox can have this function"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16060\/tuning_options_list\/16060\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.16060.loudness.placeholder" name="type[option_group_16060][tuning_options_list][16060][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16060\/tuning_options_list\/16060\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_16060][tuning_options_list][16060][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16060\/tuning_options_list\/16060\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_16060][tuning_options_list][16060][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_16060][tuning_options_list][16060][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16061&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16061][tuning_options_list][16061][enabled]" placeholder="File-services::customer.fields.tuning options list.16061.enabled.placeholder" name="type[option_group_16061][tuning_options_list][16061][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Kick Down Delete (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="remove Kick Down in manual mode"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16062&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16062][tuning_options_list][16062][enabled]" placeholder="File-services::customer.fields.tuning options list.16062.enabled.placeholder" name="type[option_group_16062][tuning_options_list][16062][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Launch Control RPM change (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Launch Control RPM change"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16062\/tuning_options_list\/16062\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_16062][tuning_options_list][16062][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16063&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16063][tuning_options_list][16063][enabled]" placeholder="File-services::customer.fields.tuning options list.16063.enabled.placeholder" name="type[option_group_16063][tuning_options_list][16063][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Modified Take Off (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="commonly used for the DQ200 transmission (clutch/vibration problem)"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16064&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16064][tuning_options_list][16064][enabled]" placeholder="File-services::customer.fields.tuning options list.16064.enabled.placeholder" name="type[option_group_16064][tuning_options_list][16064][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Neutral RPM (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Neutral RPM Off"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16065&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1937],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16065][tuning_options_list][16065][enabled]" placeholder="File-services::customer.fields.tuning options list.16065.enabled.placeholder" name="type[option_group_16065][tuning_options_list][16065][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Up Shift Delete (+0.20 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="remove Up Shift in manual mode"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1938&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16066&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16066][tuning_options_list][16066][enabled]" placeholder="File-services::customer.fields.tuning options list.16066.enabled.placeholder" name="type[option_group_16066][tuning_options_list][16066][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Activate Launch (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="when TCU doesn&#039;t have from factory so to add the functionality (not always possible)"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16067&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16067][tuning_options_list][16067][enabled]" placeholder="File-services::customer.fields.tuning options list.16067.enabled.placeholder" name="type[option_group_16067][tuning_options_list][16067][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Clutch Pressure (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Clutch Pressure increase ( if possible )"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16068&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16068][tuning_options_list][16068][enabled]" placeholder="File-services::customer.fields.tuning options list.16068.enabled.placeholder" name="type[option_group_16068][tuning_options_list][16068][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Custom Shifting RPM (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Custom Shifting RPM"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16069&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16069][tuning_options_list][16069][enabled]" placeholder="File-services::customer.fields.tuning options list.16069.enabled.placeholder" name="type[option_group_16069][tuning_options_list][16069][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Gear Display (if possible) (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Gear Display ( for BMW ZF gearbox)"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16070&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16070][tuning_options_list][16070][enabled]" placeholder="File-services::customer.fields.tuning options list.16070.enabled.placeholder" name="type[option_group_16070][tuning_options_list][16070][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Kick Down Delete (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="remove Kick Down in manual mode"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16071&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16071][tuning_options_list][16071][enabled]" placeholder="File-services::customer.fields.tuning options list.16071.enabled.placeholder" name="type[option_group_16071][tuning_options_list][16071][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Launch Control RPM change (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="when launch control need other RPM range"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16071\/tuning_options_list\/16071\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_16071][tuning_options_list][16071][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16072&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16072][tuning_options_list][16072][enabled]" placeholder="File-services::customer.fields.tuning options list.16072.enabled.placeholder" name="type[option_group_16072][tuning_options_list][16072][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Modified Take Off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="for DQ200 gearbox"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16073&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16073][tuning_options_list][16073][enabled]" placeholder="File-services::customer.fields.tuning options list.16073.enabled.placeholder" name="type[option_group_16073][tuning_options_list][16073][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Neutral RPM (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="remove the Neutral Rpm limit of gearbox"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16074&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1938],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16074][tuning_options_list][16074][enabled]" placeholder="File-services::customer.fields.tuning options list.16074.enabled.placeholder" name="type[option_group_16074][tuning_options_list][16074][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Up Shift Delete (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Up Shift Delete manual mode"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1936&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1936],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15178&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1936],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15178][tuning_options_list][15178][enabled]" placeholder="File-services::customer.fields.tuning options list.15178.enabled.placeholder" name="type[option_group_15178][tuning_options_list][15178][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            AdBlue / SCR (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15176&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1936],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15176][tuning_options_list][15176][enabled]" placeholder="File-services::customer.fields.tuning options list.15176.enabled.placeholder" name="type[option_group_15176][tuning_options_list][15176][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15368&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1936],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15368][tuning_options_list][15368][enabled]" placeholder="File-services::customer.fields.tuning options list.15368.enabled.placeholder" name="type[option_group_15368][tuning_options_list][15368][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF + EGR OFF (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15177&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1936],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15177][tuning_options_list][15177][enabled]" placeholder="File-services::customer.fields.tuning options list.15177.enabled.placeholder" name="type[option_group_15177][tuning_options_list][15177][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DTC (+0.50 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15177\/tuning_options_list\/15177\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_15177][tuning_options_list][15177][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_15177][tuning_options_list][15177][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15179&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1936],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15179][tuning_options_list][15179][enabled]" placeholder="File-services::customer.fields.tuning options list.15179.enabled.placeholder" name="type[option_group_15179][tuning_options_list][15179][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            EGR (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15367&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1936],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15367][tuning_options_list][15367][enabled]" placeholder="File-services::customer.fields.tuning options list.15367.enabled.placeholder" name="type[option_group_15367][tuning_options_list][15367][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            V-Max Off (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1940&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15220&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15220][tuning_options_list][15220][enabled]" placeholder="File-services::customer.fields.tuning options list.15220.enabled.placeholder" name="type[option_group_15220][tuning_options_list][15220][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            AdBlue / SCR (+2.00 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16076&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16076][tuning_options_list][16076][enabled]" placeholder="File-services::customer.fields.tuning options list.16076.enabled.placeholder" name="type[option_group_16076][tuning_options_list][16076][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Decat / O2 (not OPF/DPF off) (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal of catalyst"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15216&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15216][tuning_options_list][15216][enabled]" placeholder="File-services::customer.fields.tuning options list.15216.enabled.placeholder" name="type[option_group_15216][tuning_options_list][15216][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DTC Removal (+1.00 credit)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15216\/tuning_options_list\/15216\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_15216][tuning_options_list][15216][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_15216][tuning_options_list][15216][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15209&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15209][tuning_options_list][15209][enabled]" placeholder="File-services::customer.fields.tuning options list.15209.enabled.placeholder" name="type[option_group_15209][tuning_options_list][15209][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            DPF Removal (+1.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15210&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15210][tuning_options_list][15210][enabled]" placeholder="File-services::customer.fields.tuning options list.15210.enabled.placeholder" name="type[option_group_15210][tuning_options_list][15210][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            EGR Removal (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16077&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16077][tuning_options_list][16077][enabled]" placeholder="File-services::customer.fields.tuning options list.16077.enabled.placeholder" name="type[option_group_16077][tuning_options_list][16077][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            MAF off (if possible) (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal of MAF sensor"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16078&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16078][tuning_options_list][16078][enabled]" placeholder="File-services::customer.fields.tuning options list.16078.enabled.placeholder" name="type[option_group_16078][tuning_options_list][16078][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            NOx off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal of NOx Senor"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15215&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15215][tuning_options_list][15215][enabled]" placeholder="File-services::customer.fields.tuning options list.15215.enabled.placeholder" name="type[option_group_15215][tuning_options_list][15215][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            START/STOP SYSTEM OFF (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_16075&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_16075][tuning_options_list][16075][enabled]" placeholder="File-services::customer.fields.tuning options list.16075.enabled.placeholder" name="type[option_group_16075][tuning_options_list][16075][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Swirl Flaps off (+0.50 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="removal Swirl Flaps"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15212&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1940],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15212][tuning_options_list][15212][enabled]" placeholder="File-services::customer.fields.tuning options list.15212.enabled.placeholder" name="type[option_group_15212][tuning_options_list][15212][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Vmax Removal (+0.50 credits)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1946&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15370&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15370][tuning_options_list][15370][enabled]" placeholder="File-services::customer.fields.tuning options list.15370.enabled.placeholder" name="type[option_group_15370][tuning_options_list][15370][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Bosch M3.X.X (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15261&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15261][tuning_options_list][15261][enabled]" placeholder="File-services::customer.fields.tuning options list.15261.enabled.placeholder" name="type[option_group_15261][tuning_options_list][15261][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            MED17.X (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15263&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15263][tuning_options_list][15263][enabled]" placeholder="File-services::customer.fields.tuning options list.15263.enabled.placeholder" name="type[option_group_15263][tuning_options_list][15263][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Med9.X (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15264&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15264][tuning_options_list][15264][enabled]" placeholder="File-services::customer.fields.tuning options list.15264.enabled.placeholder" name="type[option_group_15264][tuning_options_list][15264][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Me7.X (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15265&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15265][tuning_options_list][15265][enabled]" placeholder="File-services::customer.fields.tuning options list.15265.enabled.placeholder" name="type[option_group_15265][tuning_options_list][15265][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            EDC15 (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15266&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15266][tuning_options_list][15266][enabled]" placeholder="File-services::customer.fields.tuning options list.15266.enabled.placeholder" name="type[option_group_15266][tuning_options_list][15266][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            EDC16 (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15267&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15267][tuning_options_list][15267][enabled]" placeholder="File-services::customer.fields.tuning options list.15267.enabled.placeholder" name="type[option_group_15267][tuning_options_list][15267][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            EDC17.X (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15369&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15369][tuning_options_list][15369][enabled]" placeholder="File-services::customer.fields.tuning options list.15369.enabled.placeholder" name="type[option_group_15369][tuning_options_list][15369][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Marelli 4MV (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15371&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15371][tuning_options_list][15371][enabled]" placeholder="File-services::customer.fields.tuning options list.15371.enabled.placeholder" name="type[option_group_15371][tuning_options_list][15371][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Marelli 4LV (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15372&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15372][tuning_options_list][15372][enabled]" placeholder="File-services::customer.fields.tuning options list.15372.enabled.placeholder" name="type[option_group_15372][tuning_options_list][15372][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Simos 3 (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15373&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15373][tuning_options_list][15373][enabled]" placeholder="File-services::customer.fields.tuning options list.15373.enabled.placeholder" name="type[option_group_15373][tuning_options_list][15373][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Simos 6 (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15374&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15374][tuning_options_list][15374][enabled]" placeholder="File-services::customer.fields.tuning options list.15374.enabled.placeholder" name="type[option_group_15374][tuning_options_list][15374][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Simos 7 (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15375&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15375][tuning_options_list][15375][enabled]" placeholder="File-services::customer.fields.tuning options list.15375.enabled.placeholder" name="type[option_group_15375][tuning_options_list][15375][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Simos 9 (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15376&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15376][tuning_options_list][15376][enabled]" placeholder="File-services::customer.fields.tuning options list.15376.enabled.placeholder" name="type[option_group_15376][tuning_options_list][15376][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Simos 11 (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15377&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15377][tuning_options_list][15377][enabled]" placeholder="File-services::customer.fields.tuning options list.15377.enabled.placeholder" name="type[option_group_15377][tuning_options_list][15377][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Simos 12 (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15254&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15254][tuning_options_list][15254][enabled]" placeholder="File-services::customer.fields.tuning options list.15254.enabled.placeholder" name="type[option_group_15254][tuning_options_list][15254][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Simos 18 (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15378&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15378][tuning_options_list][15378][enabled]" placeholder="File-services::customer.fields.tuning options list.15378.enabled.placeholder" name="type[option_group_15378][tuning_options_list][15378][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            PSA MD1CS003 / 042 (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="MCU ID NEEDED (CHIP ID XXXXXXXXXXXXXX)"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15379&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15379][tuning_options_list][15379][enabled]" placeholder="File-services::customer.fields.tuning options list.15379.enabled.placeholder" name="type[option_group_15379][tuning_options_list][15379][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Renault MD1CS006 (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="MCU ID NEEDED (CHIP ID XXXXXXXXXXXXXX)"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15380&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15380][tuning_options_list][15380][enabled]" placeholder="File-services::customer.fields.tuning options list.15380.enabled.placeholder" name="type[option_group_15380][tuning_options_list][15380][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Other (free)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15388&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15388][tuning_options_list][15388][enabled]" placeholder="File-services::customer.fields.tuning options list.15388.enabled.placeholder" name="type[option_group_15388][tuning_options_list][15388][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            VAG DSG ( ALL VERSIONS ) (+1.00 credit) <i class="fa fa-info-circle" tabindex="0" data-tooltip="Eeprom + FLash needed"></i>

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_17203&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1946],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_17203][tuning_options_list][17203][enabled]" placeholder="File-services::customer.fields.tuning options list.17203.enabled.placeholder" name="type[option_group_17203][tuning_options_list][17203][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Delphi Dcm6.2 VAG (+2.00 credits) <i class="fa fa-info-circle" tabindex="0" data-tooltip="bootmode"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_17203\/tuning_options_list\/17203\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_17203][tuning_options_list][17203][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_17203][tuning_options_list][17203][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

                                <div class="fld fld_12 fld--no-margin" data-usable="{&quot;urlname&quot;:&quot;type\/tuning_options_label_1941&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1941],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    <h5 class="fld__label">Optional tuning options</h5>
                </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15221&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1941],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15221][tuning_options_list][15221][enabled]" placeholder="File-services::customer.fields.tuning options list.15221.enabled.placeholder" name="type[option_group_15221][tuning_options_list][15221][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Stage 1 (+1.00 credit)

                    </span>
    </label>

    
    </div>

            



        </div>
    </div>

                                <div class="fld fld_4" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15381&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;tuning_type_id&quot;,&quot;values&quot;:[1941],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="type[option_group_15381][tuning_options_list][15381][enabled]" placeholder="File-services::customer.fields.tuning options list.15381.enabled.placeholder" name="type[option_group_15381][tuning_options_list][15381][enabled]" type="checkbox" value="1">
        <span></span>
        <span>
            Stage 2 (+1.20 credits)

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group"  data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15381\/tuning_options_list\/15381\/loudness&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    

    
                                        <select class="form-control border" placeholder="File-services::customer.fields.tuning options list.15381.loudness.placeholder" name="type[option_group_15381][tuning_options_list][15381][loudness]"><option value="" selected="selected">Specify desired configuration</option><option value="loud">Loud (-30 degrees)</option><option value="normal">Normal (-15 degrees)</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15381\/tuning_options_list\/15381\/rpm&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
    
    
            <div class="form-group" >
    
                        <input class="form-control border" placeholder="Specify desired RPM value (3500 RPM and up recommended)" maxlength="255" name="type[option_group_15381][tuning_options_list][15381][rpm]" type="text">
            
    
            </div>
    
    
    
            </div>
    
                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;type\/option_group_15381\/tuning_options_list\/15381\/diagnostic_trouble_codes&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;enabled&quot;,&quot;values&quot;:[&quot;1&quot;],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="fld__label">
            <strong>The meaning of a DTC can differ per brand so look carefully at the description</strong>
        </div>
    
    <div class="form-group">
        <input id="dtc-selection"
            class="form-control border-all dtc-selection"
            type="text"
            placeholder="Specify desired DTC&#039;s to be turned off"
            data-selected-dtcs-name="type[option_group_15381][tuning_options_list][15381][diagnostic_trouble_codes]"
        >
        <input class="form-control border-all" name="type[option_group_15381][tuning_options_list][15381][diagnostic_trouble_codes]" hidden type="text" value="">
    </div>

        </div>

            



        </div>
    </div>

            

            </div>
        </div>
    </div>



                                <div class="Block">
                    <div class="Block__header">
                File to modify
            </div>
                <div class="Block__content">
            <div class="Form flex">

                            <div class="fld fld_12 FileUploader WordBreak" >
            <div class="form-group" >
        <div class="Vue">
        <single-uploader
            format="file-services.original"
            type="file"
            download=""
            :original-asset="null"
            :crop-data="null"
            metadata="{&quot;customer_id&quot;:44260}"
            :can-edit-filename="false"
            :translations="{&quot;cms-media::file.empty.file&quot;:&quot;No file uploaded yet&quot;,&quot;cms-media::file.dropzone.drop&quot;:&quot;Drop your file(s) here&quot;,&quot;cms-media::file.dropzone.button&quot;:&quot;or click to browse&quot;,&quot;cms-media::file.button.delete&quot;:&quot;Delete&quot;,&quot;cms-media::file.button.delete_confirm&quot;:&quot;Are you sure you want to remove the file \&quot;:name\&quot;?&quot;,&quot;cms-media::file.button.download&quot;:&quot;Download&quot;,&quot;cms-media::file.button.edit_filename&quot;:&quot;Edit filename&quot;,&quot;cms-media::cropper.too_small&quot;:&quot;The image is too small to resize.&quot;,&quot;cms-media::cropper.rotate_left&quot;:&quot;Rotate counterclockwise&quot;,&quot;cms-media::cropper.rotate_right&quot;:&quot;Rotate clockwise&quot;,&quot;cms-media::cropper.reset&quot;:&quot;Reset&quot;,&quot;cms-media::cropper.cancel&quot;:&quot;Cancel&quot;,&quot;cms-media::cropper.save&quot;:&quot;Save&quot;,&quot;cms-media::cropper.saving&quot;:&quot;Saving the crop can take up to 20 seconds.&quot;,&quot;forms::buttons.cancel&quot;:&quot;Cancel&quot;,&quot;forms::buttons.save_and_continue&quot;:&quot;Save and continue&quot;,&quot;forms::buttons.save_and_close&quot;:&quot;Save and close&quot;,&quot;forms::buttons.save&quot;:&quot;Save&quot;,&quot;forms::buttons.confirm&quot;:&quot;Confirm&quot;}"
            :accept="[]"
            :max-upload-size="20971520"
            original-error=""
            input="file[original_asset_id]"
            :input-attributes="{&quot;class&quot;:&quot;form-control border&quot;,&quot;required&quot;:&quot;required&quot;}"
        >
            <div style="display: none;" v-pre>
                <input type="hidden" name="file[original_asset_id]" value="">
            </div>
            <template #label>
                                    <label for="file[original_asset_id]" class="control-label required">File to modify</label>

                    
                                                </template>
            <template #info>
                <div class="FileUploader__info">
                    Only files smaller than 20MB
                </div>
            </template>
        </single-uploader>
    </div>
            </div>
    </div>

                                <div class="fld fld_12 FileUploader WordBreak" data-usable="{&quot;urlname&quot;:&quot;file\/tcu_asset_id&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;\/type\/tuning_type_id&quot;,&quot;values&quot;:[]}],&quot;operator&quot;:&quot;or&quot;,&quot;style&quot;:&quot;hidden&quot;}">
            <div class="form-group" >
        <div class="Vue">
        <single-uploader
            format="file-services.tcu"
            type="file"
            download=""
            :original-asset="null"
            :crop-data="null"
            metadata="{&quot;customer_id&quot;:44260}"
            :can-edit-filename="false"
            :translations="{&quot;cms-media::file.empty.file&quot;:&quot;No file uploaded yet&quot;,&quot;cms-media::file.dropzone.drop&quot;:&quot;Drop your file(s) here&quot;,&quot;cms-media::file.dropzone.button&quot;:&quot;or click to browse&quot;,&quot;cms-media::file.button.delete&quot;:&quot;Delete&quot;,&quot;cms-media::file.button.delete_confirm&quot;:&quot;Are you sure you want to remove the file \&quot;:name\&quot;?&quot;,&quot;cms-media::file.button.download&quot;:&quot;Download&quot;,&quot;cms-media::file.button.edit_filename&quot;:&quot;Edit filename&quot;,&quot;cms-media::cropper.too_small&quot;:&quot;The image is too small to resize.&quot;,&quot;cms-media::cropper.rotate_left&quot;:&quot;Rotate counterclockwise&quot;,&quot;cms-media::cropper.rotate_right&quot;:&quot;Rotate clockwise&quot;,&quot;cms-media::cropper.reset&quot;:&quot;Reset&quot;,&quot;cms-media::cropper.cancel&quot;:&quot;Cancel&quot;,&quot;cms-media::cropper.save&quot;:&quot;Save&quot;,&quot;cms-media::cropper.saving&quot;:&quot;Saving the crop can take up to 20 seconds.&quot;,&quot;forms::buttons.cancel&quot;:&quot;Cancel&quot;,&quot;forms::buttons.save_and_continue&quot;:&quot;Save and continue&quot;,&quot;forms::buttons.save_and_close&quot;:&quot;Save and close&quot;,&quot;forms::buttons.save&quot;:&quot;Save&quot;,&quot;forms::buttons.confirm&quot;:&quot;Confirm&quot;}"
            :accept="[]"
            :max-upload-size="20971520"
            original-error=""
            input="file[tcu_asset_id]"
            :input-attributes="{&quot;class&quot;:&quot;form-control border&quot;}"
        >
            <div style="display: none;" v-pre>
                <input type="hidden" name="file[tcu_asset_id]" value="">
            </div>
            <template #label>
                                    <label for="file[tcu_asset_id]" class="control-label  required">TCU file</label>

                    
                                                </template>
            <template #info>
                <div class="FileUploader__info">
                    Only files smaller than 20MB
                </div>
            </template>
        </single-uploader>
    </div>
            </div>
    </div>

                                <div class="fld fld_12" >
            <h5 class="fld__label fld--no-margin">
            <label for="file[attachments]" class="control-label">Optional attachments <i class="fa fa-info-circle" tabindex="0" data-tooltip="Extra files that can be used for tuning the file. Such as data logs, dynographs, or DTC reports."></i><span class="optional">(optional)</span></label>

                    </h5>
        <div class="FileUploader__info">
            Only files smaller than 20MB
        </div>
        <div class="Vue">
        <files
            columns="5"
            :items="[]"
            :translations="{&quot;cms-media::cropper.too_small&quot;:&quot;The image is too small to resize.&quot;,&quot;cms-media::cropper.rotate_left&quot;:&quot;Rotate counterclockwise&quot;,&quot;cms-media::cropper.rotate_right&quot;:&quot;Rotate clockwise&quot;,&quot;cms-media::cropper.reset&quot;:&quot;Reset&quot;,&quot;cms-media::cropper.cancel&quot;:&quot;Cancel&quot;,&quot;cms-media::cropper.save&quot;:&quot;Save&quot;,&quot;cms-media::cropper.saving&quot;:&quot;Saving the crop can take up to 20 seconds.&quot;,&quot;cms::dates.long&quot;:&quot;DD-MM-YYYY [at] HH:mm&quot;,&quot;cms::datagrids.columns.updated_at&quot;:&quot;Last modification&quot;,&quot;forms::buttons.save&quot;:&quot;Save&quot;,&quot;forms::buttons.cancel&quot;:&quot;Cancel&quot;,&quot;forms::files.buttons.add&quot;:&quot;Add&quot;,&quot;forms::files.buttons.drop&quot;:&quot;Drop your file(s) here&quot;,&quot;forms::files.buttons.search&quot;:&quot;or click to browse&quot;,&quot;forms::files.datagrid.title&quot;:&quot;Title&quot;,&quot;forms::files.datagrid.type&quot;:&quot;Type&quot;,&quot;forms::files.datagrid.filename&quot;:&quot;Filename&quot;,&quot;forms::files.datagrid.downloads&quot;:&quot;Downloads&quot;,&quot;forms::files.edit.title&quot;:&quot;Edit&quot;,&quot;forms::files.multiselect.all&quot;:&quot;Select all&quot;,&quot;forms::files.multiselect.none&quot;:&quot;Select none&quot;,&quot;forms::files.multiselect.inverse&quot;:&quot;Invert selection&quot;}"
            :row-template="{&quot;contents&quot;:&quot;&lt;div class=\&quot;Form flex\&quot;&gt;&lt;input class=\&quot;form-control border\&quot; required=\&quot;required\&quot; name=\&quot;file[attachments][__NAMEa1__][asset_id]\&quot; type=\&quot;hidden\&quot;&gt;\n&lt;input class=\&quot;form-control border\&quot; required=\&quot;required\&quot; name=\&quot;file[attachments][__NAMEa1__][updated_at]\&quot; type=\&quot;hidden\&quot;&gt;\n&lt;div class=\&quot;fld fld_12\&quot; &gt;\n    \n            &lt;label for=\&quot;file[attachments][__NAMEa1__][title]\&quot; class=\&quot;control-label required\&quot;&gt;Title&lt;\/label&gt;\n    \n            &lt;div class=\&quot;form-group\&quot; &gt;\n    \n                        &lt;input class=\&quot;form-control border\&quot; required=\&quot;required\&quot; maxlength=\&quot;255\&quot; name=\&quot;file[attachments][__NAMEa1__][title]\&quot; type=\&quot;text\&quot; id=\&quot;file[attachments][__NAMEa1__][title]\&quot;&gt;\n            \n    \n            &lt;\/div&gt;\n    \n    \n    \n            &lt;\/div&gt;\n    &lt;\/div&gt;&quot;,&quot;asset&quot;:null,&quot;labels&quot;:true}
"
            :extra-columns="null"
            extra-columns-translation-group=""
            row-title=""
            prototype-name="__NAMEa1__"
            format="file-service.attachment"
            metadata="{&quot;customer_id&quot;:44260,&quot;owner&quot;:&quot;customer&quot;,&quot;owner_label&quot;:&quot;Customer&quot;}"
            :accept="[]"
            :crop-data="false"
            :simple="true"
            :compact="false"
            :downloads="false"
            input="file[attachments]"
            type="file"
            :original-errors="[]"
            deletable="1"
        >
            <div style="display: none;" v-pre>
                            </div>
        </files>
    </div>
</div>

            

            </div>
        </div>
    </div>



                                <div class="Block">
                    <div class="Block__header">
                Modified parts
            </div>
                <div class="Block__content">
            <div class="Form flex">

                            <div class="fld fld_7 form-group"  >
    

            
        <label for="modified_parts_form[has_modified_parts]" class="control-label required">Does the car have modified parts?</label>
    
                                        <select class="form-control border" required="required" id="modified_parts_form[has_modified_parts]" name="modified_parts_form[has_modified_parts]"><option value="" selected="selected">Make your choice</option><option value="1">Yes</option><option value="0">No</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_7" data-usable="{&quot;urlname&quot;:&quot;modified_parts_form\/modified_parts_notice&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;has_modified_parts&quot;,&quot;values&quot;:[1],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">

<div class="Notice Notice--neutral"><div>In order to provide you with the best possible service, we would like to ask you to complete the list below in as much detail as possible.</div></div>

    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;modified_parts_form\/modified_parts&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;has_modified_parts&quot;,&quot;values&quot;:[1],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">
        <div class="Form flex">



                            <div class="fld fld_12" >
        <div class="Form flex">



                            <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="modified_parts_form[modified_parts][modified_parts_installed?][modified]" name="modified_parts_form[modified_parts][modified_parts_installed?][modified]" type="checkbox" value="1">
        <span></span>
        <span>
            modified parts installed? <i class="fa fa-info-circle" tabindex="0" data-tooltip="File-services::customer.fields.modified.tooltip"></i>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;modified_parts_form\/modified_parts\/modified_parts_installed?\/remarks&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;modified&quot;,&quot;values&quot;:[1],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">

    <label for="modified_parts_form[modified_parts][modified_parts_installed?][remarks]" class="control-label">Remarks<span class="optional">(optional)</span></label>

    <div class="form-group" >

    <textarea class="form-control border" name="modified_parts_form[modified_parts][modified_parts_installed?][remarks]" cols="50" id="modified_parts_form[modified_parts][modified_parts_installed?][remarks]"></textarea>




    </div>
    </div>

            



        </div>
    </div>

            



        </div>
    </div>

                                <div class="fld fld_12" data-usable="{&quot;urlname&quot;:&quot;modified_parts_form\/modified_parts_remarks&quot;,&quot;fields&quot;:[{&quot;path&quot;:&quot;has_modified_parts&quot;,&quot;values&quot;:[1],&quot;not&quot;:false}],&quot;operator&quot;:&quot;and&quot;,&quot;style&quot;:&quot;hidden&quot;}">

    <label for="modified_parts_form[modified_parts_remarks]" class="control-label">Remarks<span class="optional">(optional)</span></label>

    <div class="form-group" >

    <textarea class="form-control border" name="modified_parts_form[modified_parts_remarks]" cols="50" id="modified_parts_form[modified_parts_remarks]"></textarea>




    </div>
    </div>

            

            </div>
        </div>
    </div>



                                <div class="Block">
                    <div class="Block__header">
                Service
            </div>
                <div class="Block__content">
            <div class="Form flex">

                            <div class="fld fld_6 form-group"  >
    

            
        <label for="extra[time_frame]" class="control-label required">Time frame</label>
    
                                        <select class="form-control border" required="required" id="extra[time_frame]" name="extra[time_frame]"><option value="" selected="selected">Make your choice</option><option value="asap">ASAP</option><option value="max_3">2-3 hours</option><option value="max_6">5-6 hours</option></select>


                    
                            
        
            

            </div>
    
                                <div class="fld fld_12" >

    <label for="extra[info]" class="control-label">Info<span class="optional">(optional)</span></label>

    <div class="form-group" >

    <textarea class="form-control border" name="extra[info]" cols="50" id="extra[info]"></textarea>




    </div>
    </div>

                                <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="extra[terms_and_conditions]" required="required" name="extra[terms_and_conditions]" type="checkbox" value="1">
        <span></span>
        <span>
            I have read and agree to the <a href="/legal/terms-and-conditions" title="View the Terms and conditions" target="_blank">Terms and conditions</a>

                    </span>
    </label>

    
    </div>

                                <div class="fld fld_12 form-group" >
    <label class="FancyCheckbox">
        <input class="border" id="extra[refund_policy]" required="required" name="extra[refund_policy]" type="checkbox" value="1">
        <span></span>
        <span>
            I have read and agree to the <a href="/legal/refund-policy" title="View the Refund policy" target="_blank">Refund policy</a>

                    </span>
    </label>

    
    </div>

            

            </div>
        </div>
    </div>



            
    
    </form>
    <?php
    $body = ob_get_clean();
    render('New file service', $body);
    exit;
  }
  render('Account', '<div class="container" style="padding:40px"><h1>Account — '.htmlspecialchars($path).'</h1><p><a href="/account">Terug</a></p></div>');
  exit;
}

// 404
http_response_code(404);
render('404', '<div class="container" style="padding:40px"><h1>404 — Pagina niet gevonden</h1><p><a href="/">Terug naar home</a></p></div>');
