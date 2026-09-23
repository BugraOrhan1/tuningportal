<?php
/**
 * TuningPortal API for Mijndomein.nl Hosting
 * Native PHP 7.4 - 8.3 compatible
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataPath = __DIR__ . '/../data';
if (!file_dir_exists($dataPath)) {
    $dataPath = __DIR__ . '/data';
}

function file_dir_exists($p) {
    return is_dir($p) || file_exists($p);
}

// Helper to load tree
function getTree($dataPath) {
    $treeFile = $dataPath . '/tree.json';
    if (file_exists($treeFile)) {
        return json_decode(file_get_contents($treeFile), true);
    }
    return [];
}

// Helper to load make data
function getMakeData($dataPath, $makeName) {
    $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $makeName), '-'));
    $file = $dataPath . '/makes_data/' . $slug . '.json';
    if (file_exists($file)) {
        return json_decode(file_get_contents($file), true);
    }
    return null;
}

// Helper for SQLite
function getDbConnection($dataPath) {
    $dbFile = $dataPath . '/tuningportal.db';
    if (file_exists($dbFile)) {
        try {
            $pdo = new PDO('sqlite:' . $dbFile);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        } catch (Exception $e) {
            return null;
        }
    }
    return null;
}

// Router
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'] ?? '/';

// Clean path
$basePath = '/api';
if (strpos($path, $basePath) === 0) {
    $endpoint = substr($path, strlen($basePath));
} else {
    $endpoint = $path;
}
$endpoint = rtrim($endpoint, '/');
if ($endpoint === '') $endpoint = '/';

// Route: /v1/type-loader (Fast-Chiptuningfiles compatible)
if ($endpoint === '/v1/type-loader' || isset($_GET['type_loader'])) {
    $tree = getTree($dataPath);
    $selectedMake = $_GET['make'] ?? null;
    $selectedModel = $_GET['model'] ?? null;
    $selectedGen = $_GET['generation'] ?? null;
    $selectedEngine = $_GET['engine'] ?? null;
    $selectedEcu = $_GET['ecu'] ?? null;
    $parentId = $_GET['parent_id'] ?? null;

    if ($parentId) {
        foreach ($tree as $mName => $mVal) {
            if ($mVal['id'] === $parentId || strcasecmp($mName, $parentId) === 0) {
                $selectedMake = $mName;
                break;
            }
            foreach ($mVal['models'] ?? [] as $moName => $moVal) {
                if ($moVal['id'] === $parentId || strcasecmp($moName, $parentId) === 0) {
                    $selectedMake = $mName;
                    $selectedModel = $moName;
                    break 2;
                }
                foreach ($moVal['generations'] ?? [] as $geName => $geVal) {
                    if ($geVal['id'] === $parentId || strcasecmp($geName, $parentId) === 0) {
                        $selectedMake = $mName;
                        $selectedModel = $moName;
                        $selectedGen = $geName;
                        break 3;
                    }
                }
            }
        }
    }

    $makes = [];
    foreach ($tree as $name => $m) {
        $makes[] = [
            'id' => $m['id'],
            'name' => $name,
            'urlname' => strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $name), '-'))
        ];
    }

    $models = [];
    if ($selectedMake && isset($tree[$selectedMake])) {
        foreach ($tree[$selectedMake]['models'] as $mName => $mObj) {
            $models[] = [
                'id' => $mObj['id'],
                'name' => $mName
            ];
        }
    }

    $generations = [];
    if ($selectedMake && $selectedModel && isset($tree[$selectedMake]['models'][$selectedModel])) {
        foreach ($tree[$selectedMake]['models'][$selectedModel]['generations'] as $gName => $gObj) {
            $generations[] = [
                'id' => $gObj['id'],
                'name' => $gName
            ];
        }
    }

    $engines = [];
    $ecus = [];
    if ($selectedMake && $selectedModel && $selectedGen && isset($tree[$selectedMake]['models'][$selectedModel]['generations'][$selectedGen])) {
        $genObj = $tree[$selectedMake]['models'][$selectedModel]['generations'][$selectedGen];
        foreach ($genObj['engines'] as $eng) {
            $engines[] = [
                'id' => $eng['id'],
                'name' => $eng['name'],
                'fuel' => $eng['fuel'],
                'orig_hp' => $eng['orig_hp'],
                'tuned_hp' => $eng['tuned_hp'],
                'orig_nm' => $eng['orig_nm'],
                'tuned_nm' => $eng['tuned_nm']
            ];
        }
        $ecus = [
            ['id' => 'ecu_1', 'name' => 'Bosch MED17 / EDC17 / MG1'],
            ['id' => 'ecu_2', 'name' => 'Continental Simos / Delphi'],
            ['id' => 'ecu_3', 'name' => 'Siemens / Marelli']
        ];
    }

    echo json_encode([
        'choices' => [
            'makes' => $makes,
            'models' => $models,
            'generations' => $generations,
            'engines' => $engines,
            'ecus' => $ecus
        ],
        'selected' => [
            'make' => $selectedMake,
            'model' => $selectedModel,
            'generation' => $selectedGen,
            'engine' => $selectedEngine,
            'ecu' => $selectedEcu
        ],
        'url' => '/tuning-specs'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Route: /makes
if ($endpoint === '/makes') {
    $tree = getTree($dataPath);
    $makes = [];
    foreach ($tree as $name => $m) {
        $makes[] = ['id' => $m['id'], 'name' => $name];
    }
    echo json_encode(['makes' => $makes], JSON_UNESCAPED_UNICODE);
    exit;
}

// Route: /models
if ($endpoint === '/models') {
    $make = $_GET['make'] ?? '';
    $tree = getTree($dataPath);
    $models = [];
    if ($make && isset($tree[$make])) {
        foreach ($tree[$make]['models'] as $name => $m) {
            $models[] = ['id' => $m['id'], 'name' => $name];
        }
    }
    echo json_encode(['models' => $models], JSON_UNESCAPED_UNICODE);
    exit;
}

// Route: /generations
if ($endpoint === '/generations') {
    $make = $_GET['make'] ?? '';
    $model = $_GET['model'] ?? '';
    $tree = getTree($dataPath);
    $generations = [];
    if ($make && $model && isset($tree[$make]['models'][$model])) {
        foreach ($tree[$make]['models'][$model]['generations'] as $name => $g) {
            $generations[] = ['id' => $g['id'], 'name' => $name];
        }
    }
    echo json_encode(['generations' => $generations], JSON_UNESCAPED_UNICODE);
    exit;
}

// Route: /engines
if ($endpoint === '/engines') {
    $make = $_GET['make'] ?? '';
    $model = $_GET['model'] ?? '';
    $generation = $_GET['generation'] ?? '';
    $tree = getTree($dataPath);
    $engines = [];
    if ($make && $model && $generation && isset($tree[$make]['models'][$model]['generations'][$generation])) {
        $engines = $tree[$make]['models'][$model]['generations'][$generation]['engines'];
    }
    echo json_encode(['engines' => $engines], JSON_UNESCAPED_UNICODE);
    exit;
}

// Route: /tuning-specs
if ($endpoint === '/tuning-specs') {
    $make = $_GET['make'] ?? '';
    $model = $_GET['model'] ?? '';
    $generation = $_GET['generation'] ?? '';
    $engine = $_GET['engine'] ?? '';
    $engineId = $_GET['engine_id'] ?? $_GET['id'] ?? '';

    // First try SQLite if available
    $pdo = getDbConnection($dataPath);
    if ($pdo) {
        if ($engineId) {
            $stmt = $pdo->prepare("SELECT * FROM engines WHERE id = ? LIMIT 1");
            $stmt->execute([$engineId]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM engines WHERE make_name = ? AND model_name = ? AND gen_name = ? AND engine_name = ? LIMIT 1");
            $stmt->execute([$make, $model, $generation, $engine]);
        }
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            echo json_encode([
                'success' => true,
                'vehicle' => [
                    'id' => $row['id'],
                    'make' => $row['make_name'],
                    'model' => $row['model_name'],
                    'generation' => $row['gen_name'],
                    'engine' => $row['engine_name'],
                    'fuel' => $row['fuel'],
                    'displacement' => $row['displacement'],
                    'compression' => $row['compression'],
                    'ecu_type' => $row['ecu_type'],
                    'bore_stroke' => $row['bore_stroke'],
                    'engine_code' => $row['engine_code'],
                    'stage1' => json_decode($row['stage1_json'], true),
                    'stage2' => json_decode($row['stage2_json'], true),
                    'stage3' => json_decode($row['stage3_json'], true),
                    'eco' => json_decode($row['eco_json'], true),
                    'dyno' => json_decode($row['dyno_json'], true),
                    'options' => json_decode($row['options_json'], true)
                ]
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // Fallback: Read JSON make file
    if ($make) {
        $makeData = getMakeData($dataPath, $make);
        if ($makeData && isset($makeData['models'][$model]['generations'][$generation]['engines'][$engine])) {
            $engObj = $makeData['models'][$model]['generations'][$generation]['engines'][$engine];
            echo json_encode([
                'success' => true,
                'vehicle' => array_merge([
                    'make' => $make,
                    'model' => $model,
                    'generation' => $generation,
                    'engine' => $engine
                ], $engObj)
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Voertuig niet gevonden'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Route: /dtc
if ($endpoint === '/dtc') {
    $code = strtoupper(trim($_GET['code'] ?? $_GET['query'] ?? ''));
    $pdo = getDbConnection($dataPath);
    if ($pdo && $code) {
        $stmt = $pdo->prepare("SELECT * FROM dtc_codes WHERE code LIKE ? OR description LIKE ? LIMIT 50");
        $stmt->execute(["%$code%", "%$code%"]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'count' => count($results), 'results' => $results], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Fallback from dtc-codes.json
    $dtcFile = $dataPath . '/dtc-codes.json';
    if (file_exists($dtcFile)) {
        $allDtcs = json_decode(file_get_contents($dtcFile), true);
        $matches = [];
        foreach ($allDtcs as $d) {
            if (strpos(strtoupper($d['code']), $code) !== false || (isset($d['description']) && stripos($d['description'], $code) !== false)) {
                $matches[] = $d;
                if (count($matches) >= 50) break;
            }
        }
        echo json_encode(['success' => true, 'count' => count($matches), 'results' => $matches], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(['success' => true, 'results' => []]);
    exit;
}

// Route: /file-services
if ($endpoint === '/file-services') {
    $pdo = getDbConnection($dataPath);
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = $_POST;
        if (empty($data)) {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true) ?: [];
        }

        $orderNumber = 'FS-' . date('Y') . '-' . rand(1000, 9999);
        $uploadedFileName = 'original_file.bin';

        if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../uploads';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            $safeName = $orderNumber . '_' . basename($_FILES['file']['name']);
            move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . '/' . $safeName);
            $uploadedFileName = $safeName;
        }

        $creditsCost = floatval($data['credits_cost'] ?? 1.0);
        $make = $data['make'] ?? '';
        $model = $data['model'] ?? '';
        $generation = $data['generation'] ?? '';
        $engine = $data['engine'] ?? '';
        $ecu = $data['ecu'] ?? '';
        $licensePlate = $data['license_plate'] ?? '';
        $vin = $data['vin'] ?? '';
        $year = $data['year'] ?? date('Y');
        $gearbox = $data['gearbox'] ?? 'Handgeschakeld';
        $tool = $data['tool'] ?? 'Autotuner';
        $readMethod = $data['read_method'] ?? 'OBD';
        $hardwareNr = $data['hardware_nr'] ?? '';
        $softwareNr = $data['software_nr'] ?? '';
        $tuningType = $data['tuning_type'] ?? 'Stage 1';
        $tuningOptions = $data['tuning_options'] ?? '';
        $notes = $data['notes'] ?? '';

        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO file_services 
                (order_number, customer_id, make, model, generation, engine, ecu, license_plate, vin, year, gearbox, tool, read_method, hardware_nr, software_nr, tuning_type, tuning_options, credits_cost, status, original_filename, tuned_filename, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $orderNumber, 'user-1', $make, $model, $generation, $engine, $ecu, $licensePlate, $vin, $year, $gearbox, $tool, $readMethod, $hardwareNr, $softwareNr, $tuningType, $tuningOptions, $creditsCost, 'In Behandeling', $uploadedFileName, '', $notes
            ]);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Bestand succesvol ingediend! Onze tuners gaan direct aan de slag.',
            'order_number' => $orderNumber,
            'status' => 'In Behandeling',
            'estimated_time' => '20 - 45 minuten'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // GET file services
    if ($pdo) {
        $stmt = $pdo->query("SELECT * FROM file_services ORDER BY id DESC LIMIT 50");
        $files = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'services' => $files], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(['success' => true, 'services' => []]);
    exit;
}

// Route: /credits
if ($endpoint === '/credits') {
    $pdo = getDbConnection($dataPath);
    $balance = 15; // default demo credits
    $transactions = [];

    if ($pdo) {
        $stmt = $pdo->query("SELECT * FROM transactions ORDER BY id DESC LIMIT 20");
        $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $creditsToAdd = intval($input['credits'] ?? 5);
        $amount = floatval($input['amount'] ?? 350.00);
        $inv = 'INV-' . date('Y') . '-' . rand(1000, 9999);

        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO transactions (invoice_number, customer_id, credits, amount, status, description) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$inv, 'user-1', $creditsToAdd, $amount, 'Betaald', "$creditsToAdd File Service Credits Bundel"]);
        }

        echo json_encode([
            'success' => true,
            'message' => "Er zijn $creditsToAdd credits toegevoegd aan uw account!",
            'invoice_number' => $inv,
            'new_balance' => $balance + $creditsToAdd
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(['balance' => $balance, 'transactions' => $transactions], JSON_UNESCAPED_UNICODE);
    exit;
}

// Route: /tickets
if ($endpoint === '/tickets') {
    $pdo = getDbConnection($dataPath);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $tckNr = 'TCK-' . rand(1000, 9999);
        $subject = $input['subject'] ?? 'Nieuwe vraag';
        $message = $input['message'] ?? '';
        $fsId = $input['file_service_id'] ?? '';
        $priority = $input['priority'] ?? 'Normaal';

        if ($pdo) {
            $stmt = $pdo->prepare("INSERT INTO tickets (ticket_number, customer_id, file_service_id, subject, message, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$tckNr, 'user-1', $fsId, $subject, $message, 'Open', $priority]);
        }

        echo json_encode(['success' => true, 'ticket_number' => $tckNr, 'message' => 'Ticket succesvol aangemaakt!'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($pdo) {
        $stmt = $pdo->query("SELECT * FROM tickets ORDER BY id DESC");
        $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'tickets' => $tickets], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(['success' => true, 'tickets' => []]);
    exit;
}

// Route: /contact
if ($endpoint === '/contact') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    echo json_encode([
        'success' => true,
        'message' => 'Hartelijk dank voor uw aanvraag. Wij nemen binnen 1 werkdag contact met u op.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Default 404
http_response_code(404);
echo json_encode(['error' => 'API endpoint not found', 'endpoint' => $endpoint]);
