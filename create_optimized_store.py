import json, os, sqlite3, re

print("Loading data/vehicles.json...")
with open('data/vehicles.json', 'r', encoding='utf-8') as f:
    vehicles = json.load(f)

os.makedirs('data/makes_data', exist_ok=True)

# 1. Create lightweight cascading tree
tree = {}
for make_name, make_obj in vehicles.items():
    tree[make_name] = {
        "id": make_obj["id"],
        "name": make_name,
        "models": {}
    }
    for model_name, model_obj in make_obj["models"].items():
        tree[make_name]["models"][model_name] = {
            "id": model_obj["id"],
            "name": model_name,
            "generations": {}
        }
        for gen_name, gen_obj in model_obj["generations"].items():
            tree[make_name]["models"][model_name]["generations"][gen_name] = {
                "id": gen_obj["id"],
                "name": gen_name,
                "engines": [
                    {
                        "id": eng_obj["id"],
                        "name": eng_obj["name"],
                        "fuel": eng_obj["fuel"],
                        "orig_hp": eng_obj["stage1"]["orig_hp"],
                        "tuned_hp": eng_obj["stage1"]["tuned_hp"],
                        "orig_nm": eng_obj["stage1"]["orig_nm"],
                        "tuned_nm": eng_obj["stage1"]["tuned_nm"]
                    }
                    for eng_name, eng_obj in gen_obj["engines"].items()
                ]
            }

with open('data/tree.json', 'w', encoding='utf-8') as f:
    json.dump(tree, f, ensure_ascii=False)
print("Saved data/tree.json, size:", os.path.getsize('data/tree.json'))

# 2. Save individual make files
for make_name, make_obj in vehicles.items():
    slug = re.sub(r'[^a-z0-9]+', '-', make_name.lower()).strip('-')
    with open(f'data/makes_data/{slug}.json', 'w', encoding='utf-8') as f:
        json.dump(make_obj, f, ensure_ascii=False)

print(f"Saved {len(vehicles)} individual make JSON files in data/makes_data/")

# 3. Create SQLite Database
db_path = 'data/tuningportal.db'
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute('''
CREATE TABLE IF NOT EXISTS engines (
    id TEXT PRIMARY KEY,
    make_name TEXT,
    model_name TEXT,
    gen_name TEXT,
    engine_name TEXT,
    fuel TEXT,
    displacement TEXT,
    compression TEXT,
    ecu_type TEXT,
    bore_stroke TEXT,
    engine_code TEXT,
    stage1_json TEXT,
    stage2_json TEXT,
    stage3_json TEXT,
    eco_json TEXT,
    dyno_json TEXT,
    options_json TEXT
)
''')

cur.execute('CREATE INDEX IF NOT EXISTS idx_engine_lookup ON engines(make_name, model_name, gen_name, engine_name)')
cur.execute('CREATE INDEX IF NOT EXISTS idx_engine_id ON engines(id)')

# Insert into sqlite
insert_data = []
for make_name, make_obj in vehicles.items():
    for model_name, model_obj in make_obj["models"].items():
        for gen_name, gen_obj in model_obj["generations"].items():
            for eng_name, eng_obj in gen_obj["engines"].items():
                insert_data.append((
                    eng_obj["id"],
                    make_name,
                    model_name,
                    gen_name,
                    eng_name,
                    eng_obj["fuel"],
                    eng_obj["displacement"],
                    eng_obj["compression"],
                    eng_obj["ecu_type"],
                    eng_obj["bore_stroke"],
                    eng_obj["engine_code"],
                    json.dumps(eng_obj["stage1"]),
                    json.dumps(eng_obj["stage2"]),
                    json.dumps(eng_obj["stage3"]),
                    json.dumps(eng_obj["eco"]),
                    json.dumps(eng_obj["dyno"]),
                    json.dumps(eng_obj["options"])
                ))

cur.executemany('''
INSERT INTO engines VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', insert_data)

# Create DTC table
cur.execute('''
CREATE TABLE IF NOT EXISTS dtc_codes (
    id INTEGER PRIMARY KEY,
    code TEXT,
    description TEXT,
    value TEXT
)
''')
cur.execute('CREATE INDEX IF NOT EXISTS idx_dtc_code ON dtc_codes(code)')

if os.path.exists('data/dtc-codes.json'):
    with open('data/dtc-codes.json', 'r') as f:
        dtcs = json.load(f)
    cur.executemany('INSERT INTO dtc_codes VALUES (?, ?, ?, ?)', [
        (d['id'], d['code'], d.get('description', ''), d.get('value', ''))
        for d in dtcs
    ])

# Create file services table
cur.execute('''
CREATE TABLE IF NOT EXISTS file_services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT,
    customer_id TEXT,
    make TEXT,
    model TEXT,
    generation TEXT,
    engine TEXT,
    ecu TEXT,
    license_plate TEXT,
    vin TEXT,
    year TEXT,
    gearbox TEXT,
    tool TEXT,
    read_method TEXT,
    hardware_nr TEXT,
    software_nr TEXT,
    tuning_type TEXT,
    tuning_options TEXT,
    credits_cost REAL,
    status TEXT,
    original_filename TEXT,
    tuned_filename TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Insert sample file services
sample_files = [
    ("FS-2026-9812", "user-1", "Volkswagen", "Golf", "Golf 7 - 2012 - 2016", "1.2 TSI 85pk", "Bosch MED17.5.21", "12-GTR-8", "WVWZZZAUZFP089123", "2015", "Handgeschakeld", "Autotuner", "OBD", "04E907309A", "04E906016F", "Stage 1", "Pops & Bangs, VMAX off", 1.5, "Gereed", "Golf7_1.2TSI_85hp_ori.bin", "Golf7_1.2TSI_140hp_Stage1_Pops.bin", "Graag pop and bang op AC knop"),
    ("FS-2026-9811", "user-1", "BMW", "3 Series", "F30 / F31 / F34 - 2012 - 2019", "320i 184pk (B48 LCI)", "Bosch MG1CS003", "K-881-TX", "WBA8A11000K123456", "2017", "Automaat 8HP", "bFlash", "OBD", "8688402", "8691234", "Stage 1", "Sport display callibration", 1.0, "Voltooid", "BMW_320i_B48_ori.bin", "BMW_320i_260hp_Stage1.bin", "Klant wil lineaire koppelopbouw"),
    ("FS-2026-9809", "user-1", "Audi", "A3", "8V - 2012 - 2020", "2.0 TDI CR 150pk", "Bosch EDC17C64", "6-ZTK-90", "WAUZZZ8V1EA098765", "2016", "S-Tronic DSG", "KESS3", "Bench", "04L906021M", "9978", "Stage 1", "EGR OFF, DPF OFF", 1.5, "Voltooid", "Audi_A3_20TDI_ori.bin", "Audi_A3_195hp_Stg1_EGR_DPF_off.bin", "EGR en DPF softwarematig dicht")
]

cur.executemany('''
INSERT INTO file_services (order_number, customer_id, make, model, generation, engine, ecu, license_plate, vin, year, gearbox, tool, read_method, hardware_nr, software_nr, tuning_type, tuning_options, credits_cost, status, original_filename, tuned_filename, notes)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', sample_files)

# Credits & Transactions table
cur.execute('''
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT,
    customer_id TEXT,
    credits INTEGER,
    amount REAL,
    status TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

cur.executemany('''
INSERT INTO transactions (invoice_number, customer_id, credits, amount, status, description)
VALUES (?, ?, ?, ?, ?, ?)
''', [
    ("INV-2026-0421", "user-1", 10, 650.00, "Betaald", "10 File Service Credits Bundel"),
    ("INV-2026-0388", "user-1", 5, 350.00, "Betaald", "5 File Service Credits Bundel")
])

# Support Tickets table
cur.execute('''
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number TEXT,
    customer_id TEXT,
    file_service_id TEXT,
    subject TEXT,
    message TEXT,
    status TEXT,
    priority TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

cur.executemany('''
INSERT INTO tickets (ticket_number, customer_id, file_service_id, subject, message, status, priority)
VALUES (?, ?, ?, ?, ?, ?, ?)
''', [
    ("TCK-8821", "user-1", "FS-2026-9812", "Vraag over pops & bangs loudness", "Is het mogelijk om de pops iets luider te maken?", "Beantwoord", "Normaal"),
    ("TCK-8815", "user-1", "", "Vraag over KESS3 Slave koppeling", "Kan ik mijn KESS3 slave aan jullie master koppelen?", "Gesloten", "Laag")
])

conn.commit()
conn.close()

print("Created data/tuningportal.db SQLite database successfully!")
print("DB size:", os.path.getsize(db_path))
