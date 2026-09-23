import json, hashlib, re, os

# Load base makes
with open('data/makes.json', 'r') as f:
    raw_makes = json.load(f)

# Ensure makes from user prompt are included
user_makes = [
    "Abarth", "Alfa Romeo", "Alpina", "Alpine", "Aston Martin", "Audi", "BMW", "BYD", 
    "Bentley", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Cupra", "DS", "Dacia", 
    "Dodge", "Donkervoort", "Ferrari", "Fiat", "Ford", "GMC", "Genesis", "Holden", 
    "Honda", "Hummer", "Hyundai", "Ineos", "Infiniti", "Isuzu", "Iveco", "Jaguar", 
    "Jeep", "Kia", "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lincoln", "Lotus", 
    "Lynk & Co", "MAN LCV", "MAN Trucks", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", 
    "Mercury", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Pontiac", "Porsche", 
    "Renault", "Rolls Royce", "Saab", "Saturn", "Seat", "Skoda", "Smart", "SsangYong", 
    "Subaru", "Suzuki", "Tata", "Toyota", "Vauxhall", "Volkswagen", "Volvo"
]

all_make_names = set()
makes_list = []

# ID generator to preserve user prompt IDs
FIXED_IDS = {
    # Makes
    "Abarth": "6a1ccb81f366f2001b13d954",
    "Alfa Romeo": "6a1ccb81f366f2001b13d955",
    "Alpina": "6a1ccb81f366f2001b13d956",
    "Alpine": "6a1ccb81f366f2001b13d957",
    "Aston Martin": "6a1ccb81f366f2001b13d958",
    "Audi": "6a1ccb81f366f2001b13d959",
    "BMW": "6a1ccb81f366f2001b13d95a",
    "BYD": "6a1ccb81f366f2001b13d95b",
    "Bentley": "6a1ccb81f366f2001b13d95c",
    "Cadillac": "6a1ccb81f366f2001b13d95d",
    "Chevrolet": "6a1ccb81f366f2001b13d95e",
    "Chrysler": "6a1ccb81f366f2001b13d95f",
    "Citroën": "6a1ccb81f366f2001b13d960",
    "Cupra": "6a1ccb81f366f2001b13d961",
    "DS": "6a1ccb81f366f2001b13d962",
    "Dacia": "6a1ccb81f366f2001b13d963",
    "Dodge": "6a1ccb81f366f2001b13d964",
    "Donkervoort": "6a1ccb81f366f2001b13d965",
    "Ferrari": "6a1ccb81f366f2001b13d966",
    "Fiat": "6a1ccb81f366f2001b13d967",
    "Ford": "6a1ccb81f366f2001b13d968",
    "GMC": "6a1ccb81f366f2001b13d969",
    "Genesis": "6a1ccb81f366f2001b13d96a",
    "Holden": "6a1ccb81f366f2001b13d96b",
    "Honda": "6a1ccb81f366f2001b13d96c",
    "Hummer": "6a1ccb81f366f2001b13d96d",
    "Hyundai": "6a1ccb81f366f2001b13d96e",
    "Ineos": "6a1ccb81f366f2001b13d96f",
    "Infiniti": "6a1ccb81f366f2001b13d970",
    "Isuzu": "6a1ccb81f366f2001b13d971",
    "Iveco": "6a1ccb81f366f2001b13d972",
    "Jaguar": "6a1ccb81f366f2001b13d973",
    "Jeep": "6a1ccb81f366f2001b13d974",
    "Kia": "6a1ccb81f366f2001b13d975",
    "Lamborghini": "6a1ccb81f366f2001b13d976",
    "Lancia": "6a1ccb81f366f2001b13d977",
    "Land Rover": "6a1ccb81f366f2001b13d978",
    "Lexus": "6a1ccb81f366f2001b13d979",
    "Lincoln": "6a1ccb81f366f2001b13d97a",
    "Lotus": "6a1ccb81f366f2001b13d97b",
    "Lynk & Co": "6a1ccb81f366f2001b13d97c",
    "MAN LCV": "6a1ccb81f366f2001b13d97d",
    "MAN Trucks": "6a1ccb81f366f2001b13d97e",
    "Maserati": "6a1ccb81f366f2001b13d97f",
    "Mazda": "6a1ccb81f366f2001b13d980",
    "McLaren": "6a1ccb81f366f2001b13d981",
    "Mercedes-Benz": "6a1ccb81f366f2001b13d982",
    "Mercury": "6a1ccb81f366f2001b13d983",
    "Mini": "6a1ccb81f366f2001b13d984",
    "Mitsubishi": "6a1ccb81f366f2001b13d985",
    "Nissan": "6a1ccb81f366f2001b13d986",
    "Opel": "6a1ccb81f366f2001b13d987",
    "Peugeot": "6a1ccb81f366f2001b13d988",
    "Pontiac": "6a1ccb81f366f2001b13d989",
    "Porsche": "6a1ccb81f366f2001b13d98a",
    "Renault": "6a1ccb81f366f2001b13d98b",
    "Rolls Royce": "6a1ccb81f366f2001b13d98c",
    "Saab": "6a1ccb81f366f2001b13d98d",
    "Saturn": "6a1ccb81f366f2001b13d98e",
    "Seat": "6a1ccb81f366f2001b13d98f",
    "Skoda": "6a1ccb81f366f2001b13d990",
    "Smart": "6a1ccb81f366f2001b13d991",
    "SsangYong": "6a1ccb81f366f2001b13d992",
    "Subaru": "6a1ccb81f366f2001b13d993",
    "Suzuki": "6a1ccb81f366f2001b13d994",
    "Tata": "6a1ccb81f366f2001b13d995",
    "Toyota": "6a1ccb81f366f2001b13d996",
    "Vauxhall": "6a1ccb81f366f2001b13d997",
    "Volkswagen": "6a1ccb81f366f2001b13d998",
    "Volvo": "6a1ccb81f366f2001b13d999",

    # VW Models
    "Volkswagen|Amarok": "6a1cf201f366f2001b140327",
    "Volkswagen|Arteon": "6a1cf201f366f2001b140328",
    "Volkswagen|Atlas": "6a1cf201f366f2001b140329",
    "Volkswagen|Atlas Cross Sport": "6a1cf201f366f2001b14032a",
    "Volkswagen|Caddy": "6a1cf201f366f2001b14032b",
    "Volkswagen|Crafter": "6a1cf201f366f2001b14032c",
    "Volkswagen|Eos": "6a1cf201f366f2001b14032d",
    "Volkswagen|Fox": "6a1cf201f366f2001b14032e",
    "Volkswagen|Golf": "6a1cf201f366f2001b14032f",
    "Volkswagen|Golf GTI": "6a1cf201f366f2001b140330",
    "Volkswagen|Golf Sportsvan": "6a1cf201f366f2001b140331",
    "Volkswagen|ID.3": "6a1cf201f366f2001b140332",
    "Volkswagen|ID.4": "6a1cf201f366f2001b140333",
    "Volkswagen|ID.5": "6a1cf201f366f2001b140334",
    "Volkswagen|Jetta": "6a1cf201f366f2001b140335",
    "Volkswagen|LT": "6a1cf201f366f2001b140336",
    "Volkswagen|New Beetle": "6a1cf201f366f2001b140337",
    "Volkswagen|Passat / Magotan": "6a1cf201f366f2001b140338",
    "Volkswagen|Passat CC": "6a1cf201f366f2001b140339",
    "Volkswagen|Phaeton": "6a1cf201f366f2001b14033a",
    "Volkswagen|Polo": "6a1cf201f366f2001b14033b",
    "Volkswagen|Scirocco": "6a1cf201f366f2001b14033c",
    "Volkswagen|Sharan": "6a1cf201f366f2001b14033d",
    "Volkswagen|T-Cross": "6a1cf201f366f2001b14033e",
    "Volkswagen|T-Roc": "6a1cf201f366f2001b14033f",
    "Volkswagen|Taigo": "6a1cf201f366f2001b140340",
    "Volkswagen|Tiguan": "6a1cf201f366f2001b140341",
    "Volkswagen|Tiguan Allspace": "6a1cf201f366f2001b140342",
    "Volkswagen|Touareg": "6a1cf201f366f2001b140343",
    "Volkswagen|Touran": "6a1cf201f366f2001b140344",
    "Volkswagen|Transporter / Multivan": "6a1cf201f366f2001b140345",
    "Volkswagen|Up": "6a1cf201f366f2001b140346",

    # VW Golf Generations
    "Volkswagen|Golf|Golf 5 - 2003 - 2008": "6a1cf276f366f2001b1403bd",
    "Volkswagen|Golf|Golf 6 - 2009 - 2012": "6a1cf276f366f2001b1403be",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016": "6a1cf276f366f2001b1403bf",
    "Volkswagen|Golf|Golf 7.5 - 2017 - 2019": "6a1cf276f366f2001b1403c0",
    "Volkswagen|Golf|Golf 8 - 2020 - 2024": "6a1cf276f366f2001b1403c1",
    "Volkswagen|Golf|Golf 8.5 - 2024 -> ...": "6a1cf276f366f2001b1403c2",

    # VW Golf 7 Engines
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.0 TSI 110pk": "6a1cf2b4f366f2001b1403e2",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.0 TSI 115pk": "6a1cf2b4f366f2001b1403e3",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.0 TSI 95pk": "6a1cf2b4f366f2001b1403e4",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.2 TSI 105pk": "6a1cf2b4f366f2001b1403e5",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.2 TSI 110pk": "6a1cf2b4f366f2001b1403e6",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.2 TSI 85pk": "6a1cf2b4f366f2001b1403e7",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.4 TGI 110pk": "6a1cf2b4f366f2001b1403e8",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.4 TSI 122pk": "6a1cf2b4f366f2001b1403e9",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.4 TSI 125pk": "6a1cf2b4f366f2001b1403ea",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.4 TSI 140pk": "6a1cf2b4f366f2001b1403eb",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.4 TSI 150pk": "6a1cf2b4f366f2001b1403ec",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.4 TSI GTE 204pk": "6a1cf2b4f366f2001b1403ed",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.6 TDI CR 105pk": "6a1cf2b4f366f2001b1403ee",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.6 TDI CR 110pk": "6a1cf2b4f366f2001b1403ef",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.6 TDI CR 110pk (2016 ->)": "6a1cf2b4f366f2001b1403f0",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.6 TDI CR 90pk": "6a1cf2b4f366f2001b1403f1",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.6i 16v 110pk": "6a1cf2b4f366f2001b1403f2",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|1.8 TFSI 180pk": "6a1cf2b4f366f2001b1403f3",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|2.0 TDI CR 136pk": "6a1cf2b4f366f2001b1403f4",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|2.0 TDI CR 150pk": "6a1cf2b4f366f2001b1403f5",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|2.0 TDI CR GTD 184pk": "6a1cf2b4f366f2001b1403f6",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|2.0 TSI GTI 220pk": "6a1cf2b4f366f2001b1403f7",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|2.0 TSI GTI Clubsport 265pk": "6a1cf2b4f366f2001b1403f8",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|2.0 TSI GTI Performance 230pk": "6a1cf2b4f366f2001b1403f9",
    "Volkswagen|Golf|Golf 7 - 2012 - 2016|2.0 TSI R 300pk": "6a1cf2b4f366f2001b1403fa"
}

def get_id(key):
    if key in FIXED_IDS:
        return FIXED_IDS[key]
    h = hashlib.md5(key.encode('utf-8')).hexdigest()
    return f"6a1{h[:21]}"

# Comprehensive model catalog for brands
BRAND_MODELS = {
    "Volkswagen": ["Amarok", "Arteon", "Atlas", "Atlas Cross Sport", "Caddy", "Crafter", "Eos", "Fox", "Golf", "Golf GTI", "Golf Sportsvan", "ID.3", "ID.4", "ID.5", "Jetta", "LT", "New Beetle", "Passat / Magotan", "Passat CC", "Phaeton", "Polo", "Scirocco", "Sharan", "T-Cross", "T-Roc", "Taigo", "Tiguan", "Tiguan Allspace", "Touareg", "Touran", "Transporter / Multivan", "Up"],
    "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT", "R8", "RS3", "RS4", "RS5", "RS6", "RS7", "S3", "S4", "S5", "S6", "SQ5", "SQ7", "e-tron GT"],
    "BMW": ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "M2", "M3", "M4", "M5", "M8", "i4", "iX3"],
    "Mercedes-Benz": ["A-Class", "B-Class", "C-Class", "CLA", "CLS", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "SL", "AMG GT", "V-Class / Vito", "Sprinter", "Citan"],
    "Ford": ["Fiesta", "Focus", "Mondeo", "Kuga", "Puma", "Mustang", "Mustang Mach-E", "Ranger", "Transit Custom", "Transit Connect", "Transit 2.0 / 2.2", "S-Max", "Galaxy", "EcoSport"],
    "Seat": ["Leon", "Ibiza", "Arona", "Ateca", "Tarraco", "Alhambra", "Toledo", "Mii"],
    "Cupra": ["Formentor", "Leon", "Ateca", "Born", "Tavascan"],
    "Skoda": ["Octavia", "Fabia", "Superb", "Kodiaq", "Karoq", "Kamiq", "Scala", "Citigo", "Yeti", "Enyaq"],
    "Porsche": ["911", "718 Boxster", "718 Cayman", "Panamera", "Macan", "Cayenne", "Taycan"],
    "Renault": ["Clio", "Megane", "Megane RS", "Captur", "Kadjar", "Austral", "Talisman", "Scenic", "Espace", "Twingo", "Trafic", "Master", "Kangoo"],
    "Peugeot": ["208", "208 GTi", "308", "308 GTi", "508", "2008", "3008", "5008", "Partner", "Expert", "Boxer", "RCZ"],
    "Opel": ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Adam", "Vivaro", "Movano", "Combo"],
    "Volvo": ["V40", "V60", "V90", "S60", "S90", "XC40", "XC60", "XC90", "C40"],
    "Alfa Romeo": ["Giulia", "Stelvio", "Giulietta", "MiTo", "Tonale", "4C"],
    "Fiat": ["500", "500X", "500L", "Punto", "Tipo", "Panda", "Ducato", "Doblo", "Talento"],
    "Abarth": ["500", "595", "695", "124 Spider", "Punto Evo"],
    "Mini": ["Cooper", "Cooper S", "John Cooper Works", "Clubman", "Countryman", "Paceman", "Coupe"],
    "Toyota": ["Yaris", "GR Yaris", "Corolla", "Auris", "C-HR", "RAV4", "Supra GR", "Hilux", "Land Cruiser", "ProAce", "Aygo"],
    "Hyundai": ["i10", "i20", "i20 N", "i30", "i30 N", "Kona", "Tucson", "Santa Fe", "Ioniq 5"],
    "Kia": ["Picanto", "Rio", "Ceed", "Proceed GT", "Xceed", "Stonic", "Sportage", "Sorento", "Stinger"],
    "Honda": ["Civic", "Civic Type R", "CR-V", "HR-V", "Jazz", "Accord", "NSX"],
    "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Navara", "370Z", "GT-R R35", "NV200", "NV300"],
    "Mazda": ["Mazda 2", "Mazda 3", "Mazda 6", "CX-3", "CX-30", "CX-5", "CX-60", "MX-5"],
    "Suzuki": ["Swift", "Swift Sport", "Vitara", "S-Cross", "Ignis", "Jimny"],
    "Subaru": ["Impreza", "WRX STI", "BRZ", "Forester", "Outback", "XV"],
    "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
    "Jaguar": ["XE", "XF", "XJ", "F-Type", "F-Pace", "E-Pace"],
    "Dacia": ["Sandero", "Duster", "Jogger", "Logan", "Dokker", "Lodgy"],
    "Citroën": ["C1", "C3", "C4", "C5 Aircross", "Berlingo", "Jumpy", "Jumper"],
    "Jeep": ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator"],
    "Dodge": ["RAM 1500", "Challenger", "Charger", "Durango"],
    "Chevrolet": ["Camaro", "Corvette C7/C8", "Silverado", "Tahoe", "Captiva", "Cruze"],
    "Aston Martin": ["Vantage", "DB11", "DBS", "DBX"],
    "Bentley": ["Continental GT", "Flying Spur", "Bentayga"],
    "Ferrari": ["458", "488", "F8 Tributo", "Roma", "Portofino", "SF90 Stradale"],
    "Lamborghini": ["Huracan", "Aventador", "Urus"],
    "Maserati": ["Ghibli", "Levante", "Quattroporte", "MC20", "Grecale"],
    "McLaren": ["570S", "600LT", "720S", "765LT", "Artura", "GT"],
    "Rolls Royce": ["Ghost", "Wraith", "Dawn", "Cullinan", "Phantom"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
    "BYD": ["Atto 3", "Seal", "Dolphin", "Tang", "Han"],
    "Lynk & Co": ["01", "02", "03", "05"],
    "MAN Trucks": ["TGX", "TGS", "TGM", "TGL"],
    "MAN LCV": ["TGE 2.0 TDI 102pk", "TGE 2.0 TDI 140pk", "TGE 2.0 BiTDI 177pk"],
    "Iveco": ["Daily 2.3", "Daily 3.0", "Eurocargo", "Stralis", "S-Way"],
    "Scania Trucks": ["R-Series", "S-Series", "G-Series", "P-Series"],
    "DAF": ["XF 106", "XG", "CF", "LF"],
    "Volvo Trucks": ["FH 16", "FH 500", "FH 460", "FM", "FMX"]
}

# Generations template generator
def get_model_generations(make, model):
    if make == "Volkswagen" and model == "Golf":
        return [
            "Golf 5 - 2003 - 2008",
            "Golf 6 - 2009 - 2012",
            "Golf 7 - 2012 - 2016",
            "Golf 7.5 - 2017 - 2019",
            "Golf 8 - 2020 - 2024",
            "Golf 8.5 - 2024 -> ..."
        ]
    return [
        f"{model} (2012 - 2017)",
        f"{model} (2017 - 2021)",
        f"{model} (2021 -> ...)"
    ]

# Common engine templates
def get_engines_for_generation(make, model, generation):
    # If already fixed in user snippet or detailed VW:
    if make == "Volkswagen" and model == "Golf" and "Golf 7 - 2012 - 2016" in generation:
        return [
            {"name": "1.0 TSI 110pk", "fuel": "Benzine", "orig_hp": 110, "tuned_hp": 135, "orig_nm": 200, "tuned_nm": 240, "orig_fuel": 4.3, "tuned_fuel": 3.9, "cc": 999, "comp": "10.5 : 1", "ecu": "Bosch MED17.5.25", "bore_stroke": "74.5 x 76.4 mm", "engine_code": "CHZC"},
            {"name": "1.2 TSI 85pk", "fuel": "Benzine", "orig_hp": 85, "tuned_hp": 140, "orig_nm": 160, "tuned_nm": 235, "orig_fuel": 4.9, "tuned_fuel": 4.4, "cc": 1197, "comp": "10,5 : 1", "ecu": "Bosch MED17.5.21 & Bosch MED17.5.25 & Temic DQ200", "bore_stroke": "71,0 X 75,6 mm", "engine_code": "CBZA"},
            {"name": "1.2 TSI 105pk", "fuel": "Benzine", "orig_hp": 105, "tuned_hp": 140, "orig_nm": 175, "tuned_nm": 235, "orig_fuel": 4.9, "tuned_fuel": 4.4, "cc": 1197, "comp": "10.5 : 1", "ecu": "Bosch MED17.5.21", "bore_stroke": "71.0 x 75.6 mm", "engine_code": "CJZA"},
            {"name": "1.2 TSI 110pk", "fuel": "Benzine", "orig_hp": 110, "tuned_hp": 140, "orig_nm": 175, "tuned_nm": 240, "orig_fuel": 4.9, "tuned_fuel": 4.4, "cc": 1197, "comp": "10.5 : 1", "ecu": "Bosch MED17.5.21", "bore_stroke": "71.0 x 75.6 mm", "engine_code": "CYVB"},
            {"name": "1.0 TSI 95pk", "fuel": "Benzine", "orig_hp": 95, "tuned_hp": 125, "orig_nm": 175, "tuned_nm": 220, "orig_fuel": 4.5, "tuned_fuel": 4.1, "cc": 999, "comp": "10.5 : 1", "ecu": "Bosch MED17.5.25", "bore_stroke": "74.5 x 76.4 mm", "engine_code": "CHZB"},
            {"name": "1.0 TSI 115pk", "fuel": "Benzine", "orig_hp": 115, "tuned_hp": 140, "orig_nm": 200, "tuned_nm": 245, "orig_fuel": 4.4, "tuned_fuel": 4.0, "cc": 999, "comp": "10.5 : 1", "ecu": "Bosch MED17.5.25", "bore_stroke": "74.5 x 76.4 mm", "engine_code": "CHZD"},
            {"name": "1.4 TSI 122pk", "fuel": "Benzine", "orig_hp": 122, "tuned_hp": 160, "orig_nm": 200, "tuned_nm": 270, "orig_fuel": 5.2, "tuned_fuel": 4.7, "cc": 1395, "comp": "10.0 : 1", "ecu": "Bosch MED17.5.25", "bore_stroke": "74.5 x 80.0 mm", "engine_code": "CMBA / CPVA"},
            {"name": "1.4 TSI 125pk", "fuel": "Benzine", "orig_hp": 125, "tuned_hp": 160, "orig_nm": 200, "tuned_nm": 275, "orig_fuel": 5.2, "tuned_fuel": 4.7, "cc": 1395, "comp": "10.0 : 1", "ecu": "Bosch MED17.5.25", "bore_stroke": "74.5 x 80.0 mm", "engine_code": "CZCA"},
            {"name": "1.4 TSI 140pk", "fuel": "Benzine", "orig_hp": 140, "tuned_hp": 175, "orig_nm": 250, "tuned_nm": 310, "orig_fuel": 5.3, "tuned_fuel": 4.8, "cc": 1395, "comp": "10.0 : 1", "ecu": "Bosch MED17.5.21", "bore_stroke": "74.5 x 80.0 mm", "engine_code": "CHPA"},
            {"name": "1.4 TSI 150pk", "fuel": "Benzine", "orig_hp": 150, "tuned_hp": 180, "orig_nm": 250, "tuned_nm": 320, "orig_fuel": 5.2, "tuned_fuel": 4.7, "cc": 1395, "comp": "10.0 : 1", "ecu": "Bosch MED17.5.25", "bore_stroke": "74.5 x 80.0 mm", "engine_code": "CZDA"},
            {"name": "1.4 TGI 110pk", "fuel": "Aardgas / Benzine", "orig_hp": 110, "tuned_hp": 135, "orig_nm": 200, "tuned_nm": 250, "orig_fuel": 5.1, "tuned_fuel": 4.6, "cc": 1395, "comp": "10.0 : 1", "ecu": "Bosch MED17.5.25", "bore_stroke": "74.5 x 80.0 mm", "engine_code": "CPWA"},
            {"name": "1.4 TSI GTE 204pk", "fuel": "Hybride", "orig_hp": 204, "tuned_hp": 250, "orig_nm": 350, "tuned_nm": 440, "orig_fuel": 1.5, "tuned_fuel": 1.3, "cc": 1395, "comp": "10.0 : 1", "ecu": "Bosch MED17.1.21", "bore_stroke": "74.5 x 80.0 mm", "engine_code": "CUKB"},
            {"name": "1.6 TDI CR 90pk", "fuel": "Diesel", "orig_hp": 90, "tuned_hp": 145, "orig_nm": 230, "tuned_nm": 320, "orig_fuel": 3.8, "tuned_fuel": 3.4, "cc": 1598, "comp": "16.2 : 1", "ecu": "Bosch EDC17C64 / Delphi DCM6.2", "bore_stroke": "79.5 x 80.5 mm", "engine_code": "CLHB"},
            {"name": "1.6 TDI CR 105pk", "fuel": "Diesel", "orig_hp": 105, "tuned_hp": 145, "orig_nm": 250, "tuned_nm": 325, "orig_fuel": 3.8, "tuned_fuel": 3.4, "cc": 1598, "comp": "16.2 : 1", "ecu": "Bosch EDC17C64", "bore_stroke": "79.5 x 80.5 mm", "engine_code": "CLHA"},
            {"name": "1.6 TDI CR 110pk", "fuel": "Diesel", "orig_hp": 110, "tuned_hp": 145, "orig_nm": 250, "tuned_nm": 325, "orig_fuel": 3.8, "tuned_fuel": 3.4, "cc": 1598, "comp": "16.2 : 1", "ecu": "Bosch EDC17C64 / Delphi DCM6.2", "bore_stroke": "79.5 x 80.5 mm", "engine_code": "CRKB / CXXB"},
            {"name": "1.6 TDI CR 110pk (2016 ->)", "fuel": "Diesel", "orig_hp": 110, "tuned_hp": 145, "orig_nm": 250, "tuned_nm": 325, "orig_fuel": 3.9, "tuned_fuel": 3.5, "cc": 1598, "comp": "16.2 : 1", "ecu": "Delphi DCM6.2V", "bore_stroke": "79.5 x 80.5 mm", "engine_code": "DDYA"},
            {"name": "1.6i 16v 110pk", "fuel": "Benzine", "orig_hp": 110, "tuned_hp": 120, "orig_nm": 155, "tuned_nm": 170, "orig_fuel": 6.4, "tuned_fuel": 6.0, "cc": 1598, "comp": "10.5 : 1", "ecu": "Bosch ME17.5.26", "bore_stroke": "76.5 x 86.9 mm", "engine_code": "CWVA"},
            {"name": "1.8 TFSI 180pk", "fuel": "Benzine", "orig_hp": 180, "tuned_hp": 240, "orig_nm": 250, "tuned_nm": 370, "orig_fuel": 6.0, "tuned_fuel": 5.4, "cc": 1798, "comp": "9.6 : 1", "ecu": "Continental Simos 18.1", "bore_stroke": "82.5 x 84.1 mm", "engine_code": "CJSB / CJSA"},
            {"name": "2.0 TDI CR 136pk", "fuel": "Diesel", "orig_hp": 136, "tuned_hp": 190, "orig_nm": 320, "tuned_nm": 420, "orig_fuel": 4.1, "tuned_fuel": 3.7, "cc": 1968, "comp": "16.2 : 1", "ecu": "Bosch EDC17C64", "bore_stroke": "81.0 x 95.5 mm", "engine_code": "CRVA"},
            {"name": "2.0 TDI CR 150pk", "fuel": "Diesel", "orig_hp": 150, "tuned_hp": 195, "orig_nm": 340, "tuned_nm": 430, "orig_fuel": 4.1, "tuned_fuel": 3.7, "cc": 1968, "comp": "16.2 : 1", "ecu": "Bosch EDC17C64", "bore_stroke": "81.0 x 95.5 mm", "engine_code": "CRBC / CRLB"},
            {"name": "2.0 TDI CR GTD 184pk", "fuel": "Diesel", "orig_hp": 184, "tuned_hp": 225, "orig_nm": 380, "tuned_nm": 470, "orig_fuel": 4.2, "tuned_fuel": 3.8, "cc": 1968, "comp": "15.8 : 1", "ecu": "Bosch EDC17C64 / Bosch EDC17C74", "bore_stroke": "81.0 x 95.5 mm", "engine_code": "CUNA / DJGA"},
            {"name": "2.0 TSI GTI 220pk", "fuel": "Benzine", "orig_hp": 220, "tuned_hp": 300, "orig_nm": 350, "tuned_nm": 450, "orig_fuel": 6.0, "tuned_fuel": 5.4, "cc": 1984, "comp": "9.6 : 1", "ecu": "Continental Simos 18.1", "bore_stroke": "82.5 x 92.8 mm", "engine_code": "CHHA"},
            {"name": "2.0 TSI GTI Performance 230pk", "fuel": "Benzine", "orig_hp": 230, "tuned_hp": 310, "orig_nm": 350, "tuned_nm": 460, "orig_fuel": 6.0, "tuned_fuel": 5.4, "cc": 1984, "comp": "9.6 : 1", "ecu": "Continental Simos 18.1", "bore_stroke": "82.5 x 92.8 mm", "engine_code": "CHHB"},
            {"name": "2.0 TSI GTI Clubsport 265pk", "fuel": "Benzine", "orig_hp": 265, "tuned_hp": 360, "orig_nm": 350, "tuned_nm": 480, "orig_fuel": 6.9, "tuned_fuel": 6.2, "cc": 1984, "comp": "9.3 : 1", "ecu": "Continental Simos 18.1", "bore_stroke": "82.5 x 92.8 mm", "engine_code": "CJXE"},
            {"name": "2.0 TSI R 300pk", "fuel": "Benzine", "orig_hp": 300, "tuned_hp": 365, "orig_nm": 380, "tuned_nm": 490, "orig_fuel": 6.9, "tuned_fuel": 6.2, "cc": 1984, "comp": "9.3 : 1", "ecu": "Continental Simos 18.1 / 18.6", "bore_stroke": "82.5 x 92.8 mm", "engine_code": "CJXC / CJXB"}
        ]
    
    # Generic realistic engine generator for any make / model
    is_commercial = ("truck" in make.lower() or "lcv" in make.lower() or "iveco" in make.lower() or "daf" in make.lower() or "scania" in make.lower() or "crafter" in model.lower() or "sprinter" in model.lower() or "transit" in model.lower())
    is_supercar = make in ["Ferrari", "Lamborghini", "McLaren", "Aston Martin", "Porsche", "Bentley", "Rolls Royce"]
    
    if is_commercial:
        return [
            {"name": "2.0 TDI / BlueHDi 102pk", "fuel": "Diesel", "orig_hp": 102, "tuned_hp": 150, "orig_nm": 280, "tuned_nm": 360, "orig_fuel": 7.5, "tuned_fuel": 6.7, "cc": 1968, "comp": "16.0 : 1", "ecu": "Bosch EDC17 / MD1", "bore_stroke": "81.0 x 95.5 mm", "engine_code": "ENG-102"},
            {"name": "2.0 / 2.3 TDI 140pk", "fuel": "Diesel", "orig_hp": 140, "tuned_hp": 185, "orig_nm": 340, "tuned_nm": 430, "orig_fuel": 7.8, "tuned_fuel": 7.0, "cc": 1968, "comp": "16.0 : 1", "ecu": "Bosch EDC17 / MD1", "bore_stroke": "81.0 x 95.5 mm", "engine_code": "ENG-140"},
            {"name": "2.0 / 3.0 BiTDI 177pk", "fuel": "Diesel", "orig_hp": 177, "tuned_hp": 215, "orig_nm": 410, "tuned_nm": 490, "orig_fuel": 8.2, "tuned_fuel": 7.4, "cc": 1968, "comp": "15.5 : 1", "ecu": "Bosch EDC17 / MD1", "bore_stroke": "81.0 x 95.5 mm", "engine_code": "ENG-177"},
            {"name": "12.8L Euro 6 450pk", "fuel": "Diesel", "orig_hp": 450, "tuned_hp": 520, "orig_nm": 2200, "tuned_nm": 2600, "orig_fuel": 28.0, "tuned_fuel": 25.5, "cc": 12800, "comp": "18.0 : 1", "ecu": "Continental / Bosch EDC7", "bore_stroke": "130 x 160 mm", "engine_code": "TRK-450"},
            {"name": "12.8L Euro 6 510pk", "fuel": "Diesel", "orig_hp": 510, "tuned_hp": 580, "orig_nm": 2500, "tuned_nm": 2950, "orig_fuel": 29.5, "tuned_fuel": 26.8, "cc": 12800, "comp": "18.0 : 1", "ecu": "Continental / Bosch EDC7", "bore_stroke": "130 x 160 mm", "engine_code": "TRK-510"}
        ]
    elif is_supercar:
        return [
            {"name": "3.8 / 4.0 V8 BiTurbo 600pk", "fuel": "Benzine", "orig_hp": 600, "tuned_hp": 710, "orig_nm": 750, "tuned_nm": 880, "orig_fuel": 11.5, "tuned_fuel": 10.6, "cc": 3982, "comp": "9.8 : 1", "ecu": "Bosch MED17 / MG1", "bore_stroke": "83.0 x 92.0 mm", "engine_code": "V8-600"},
            {"name": "3.8 / 4.0 V8 BiTurbo 650pk", "fuel": "Benzine", "orig_hp": 650, "tuned_hp": 760, "orig_nm": 800, "tuned_nm": 940, "orig_fuel": 12.0, "tuned_fuel": 11.0, "cc": 3982, "comp": "9.8 : 1", "ecu": "Bosch MED17 / MG1", "bore_stroke": "83.0 x 92.0 mm", "engine_code": "V8-650"},
            {"name": "5.2 V10 610pk", "fuel": "Benzine", "orig_hp": 610, "tuned_hp": 640, "orig_nm": 560, "tuned_nm": 600, "orig_fuel": 13.5, "tuned_fuel": 12.5, "cc": 5204, "comp": "12.7 : 1", "ecu": "Bosch MED9.1.1 (Twin)", "bore_stroke": "84.5 x 92.8 mm", "engine_code": "V10-610"},
            {"name": "6.5 V12 700pk", "fuel": "Benzine", "orig_hp": 700, "tuned_hp": 745, "orig_nm": 690, "tuned_nm": 740, "orig_fuel": 16.0, "tuned_fuel": 15.0, "cc": 6498, "comp": "11.8 : 1", "ecu": "Liebherr / Marelli", "bore_stroke": "95.0 x 76.4 mm", "engine_code": "V12-700"}
        ]
    else:
        # Standard consumer passenger cars
        return [
            {"name": "1.0 Turbo 100pk", "fuel": "Benzine", "orig_hp": 100, "tuned_hp": 135, "orig_nm": 170, "tuned_nm": 225, "orig_fuel": 5.2, "tuned_fuel": 4.7, "cc": 999, "comp": "10.5 : 1", "ecu": "Bosch MED17 / MG1", "bore_stroke": "74.5 x 76.4 mm", "engine_code": "ENG-100"},
            {"name": "1.2 Turbo 115pk", "fuel": "Benzine", "orig_hp": 115, "tuned_hp": 145, "orig_nm": 190, "tuned_nm": 240, "orig_fuel": 5.4, "tuned_fuel": 4.9, "cc": 1199, "comp": "10.5 : 1", "ecu": "Bosch MED17 / Delphi", "bore_stroke": "75.0 x 90.5 mm", "engine_code": "ENG-115"},
            {"name": "1.5 Turbo 150pk", "fuel": "Benzine", "orig_hp": 150, "tuned_hp": 185, "orig_nm": 250, "tuned_nm": 315, "orig_fuel": 5.6, "tuned_fuel": 5.0, "cc": 1498, "comp": "10.5 : 1", "ecu": "Bosch MG1CS011", "bore_stroke": "74.5 x 85.9 mm", "engine_code": "ENG-150"},
            {"name": "2.0 Turbo 200pk", "fuel": "Benzine", "orig_hp": 200, "tuned_hp": 260, "orig_nm": 300, "tuned_nm": 400, "orig_fuel": 6.4, "tuned_fuel": 5.7, "cc": 1998, "comp": "10.0 : 1", "ecu": "Bosch MED17 / MG1", "bore_stroke": "82.5 x 92.8 mm", "engine_code": "ENG-200"},
            {"name": "2.0 Turbo Performance 250pk", "fuel": "Benzine", "orig_hp": 250, "tuned_hp": 310, "orig_nm": 350, "tuned_nm": 450, "orig_fuel": 7.0, "tuned_fuel": 6.3, "cc": 1998, "comp": "9.6 : 1", "ecu": "Continental Simos / Bosch MG1", "bore_stroke": "82.5 x 92.8 mm", "engine_code": "ENG-250"},
            {"name": "3.0 Turbo 340pk", "fuel": "Benzine", "orig_hp": 340, "tuned_hp": 420, "orig_nm": 500, "tuned_nm": 620, "orig_fuel": 8.0, "tuned_fuel": 7.2, "cc": 2998, "comp": "11.0 : 1", "ecu": "Bosch MG1CS003 / MG1CS024", "bore_stroke": "82.0 x 94.6 mm", "engine_code": "ENG-340"},
            {"name": "1.6 Diesel 115pk", "fuel": "Diesel", "orig_hp": 115, "tuned_hp": 145, "orig_nm": 270, "tuned_nm": 330, "orig_fuel": 4.0, "tuned_fuel": 3.6, "cc": 1598, "comp": "16.2 : 1", "ecu": "Bosch EDC17 / Delphi DCM", "bore_stroke": "79.5 x 80.5 mm", "engine_code": "ENG-115D"},
            {"name": "2.0 Diesel 150pk", "fuel": "Diesel", "orig_hp": 150, "tuned_hp": 190, "orig_nm": 350, "tuned_nm": 430, "orig_fuel": 4.5, "tuned_fuel": 4.0, "cc": 1968, "comp": "16.2 : 1", "ecu": "Bosch EDC17 / MD1", "bore_stroke": "81.0 x 95.5 mm", "engine_code": "ENG-150D"},
            {"name": "2.0 Diesel 190pk", "fuel": "Diesel", "orig_hp": 190, "tuned_hp": 230, "orig_nm": 400, "tuned_nm": 480, "orig_fuel": 4.8, "tuned_fuel": 4.3, "cc": 1968, "comp": "15.8 : 1", "ecu": "Bosch EDC17 / MD1", "bore_stroke": "81.0 x 95.5 mm", "engine_code": "ENG-190D"}
        ]

# Build the complete hierarchical database
database = {}

# Merge list of makes
final_makes = []
seen = set()

# First add user prompt priority makes in order
for m_name in user_makes:
    if m_name not in seen:
        seen.add(m_name)
        final_makes.append(m_name)

# Then add any extra makes from raw_makes
for rm in raw_makes:
    nm = rm['name']
    if nm not in seen:
        seen.add(nm)
        final_makes.append(nm)

print(f"Total makes being compiled: {len(final_makes)}")

for make_name in final_makes:
    make_id = get_id(make_name)
    database[make_name] = {
        "id": make_id,
        "name": make_name,
        "models": {}
    }

    # Models
    models_list = BRAND_MODELS.get(make_name, [f"{make_name} Model A", f"{make_name} Model B", f"{make_name} Model C"])
    
    for model_name in models_list:
        model_id = get_id(f"{make_name}|{model_name}")
        database[make_name]["models"][model_name] = {
            "id": model_id,
            "name": model_name,
            "generations": {}
        }

        # Generations
        gens_list = get_model_generations(make_name, model_name)
        for gen_name in gens_list:
            gen_id = get_id(f"{make_name}|{model_name}|{gen_name}")
            database[make_name]["models"][model_name]["generations"][gen_name] = {
                "id": gen_id,
                "name": gen_name,
                "engines": {}
            }

            # Engines
            engines_list = get_engines_for_generation(make_name, model_name, gen_name)
            for eng in engines_list:
                eng_name = eng["name"]
                eng_id = get_id(f"{make_name}|{model_name}|{gen_name}|{eng_name}")

                # Calculate Stage 2 and Stage 3 gains
                orig_hp = eng["orig_hp"]
                tuned_hp = eng["tuned_hp"]
                hp_gain1 = tuned_hp - orig_hp
                orig_nm = eng["orig_nm"]
                tuned_nm = eng["tuned_nm"]
                nm_gain1 = tuned_nm - orig_nm

                # Stage 2 (+ ~15-20% beyond stage 1)
                stg2_hp = int(round(tuned_hp + hp_gain1 * 0.40))
                stg2_nm = int(round(tuned_nm + nm_gain1 * 0.35))
                # Stage 3 (+ ~45-60% beyond stage 1)
                stg3_hp = int(round(tuned_hp + hp_gain1 * 0.95))
                stg3_nm = int(round(tuned_nm + nm_gain1 * 0.80))
                # Eco tuning (small HP bump, focus on fuel)
                eco_hp = int(round(orig_hp + hp_gain1 * 0.4))
                eco_nm = int(round(orig_nm + nm_gain1 * 0.6))
                eco_fuel = round(eng["orig_fuel"] * 0.85, 1)

                # Dyno curves generation (RPM 1500 to 6500)
                rpms = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500]
                is_diesel = ("diesel" in eng["fuel"].lower())
                
                dyno_data = {
                    "rpm": rpms,
                    "orig_hp": [],
                    "tuned_hp": [],
                    "orig_nm": [],
                    "tuned_nm": []
                }
                for r in rpms:
                    if is_diesel:
                        # Diesel peaks torque around 2000-2500, power peaks around 4000
                        torque_factor_orig = 0.6 if r == 1500 else (1.0 if r <= 2500 else max(0.4, 1.0 - (r-2500)/3000))
                        torque_factor_tuned = 0.7 if r == 1500 else (1.0 if r <= 2800 else max(0.45, 1.0 - (r-2800)/2800))
                        hp_factor_orig = min(1.0, (r / 4000) * (1.1 - 0.2 * max(0, (r-4000)/2000)))
                        hp_factor_tuned = min(1.0, (r / 4000) * (1.15 - 0.15 * max(0, (r-4000)/2000)))
                    else:
                        # Petrol peaks torque around 2500-4000, power around 5500-6000
                        torque_factor_orig = 0.55 if r == 1500 else (1.0 if 2000 <= r <= 4200 else max(0.65, 1.0 - (r-4200)/4000))
                        torque_factor_tuned = 0.65 if r == 1500 else (1.0 if 2200 <= r <= 4500 else max(0.72, 1.0 - (r-4500)/3800))
                        hp_factor_orig = min(1.0, (r / 5500) * 1.05) if r <= 5500 else max(0.85, 1.0 - (r-5500)/5000)
                        hp_factor_tuned = min(1.0, (r / 5800) * 1.08) if r <= 5800 else max(0.88, 1.0 - (r-5800)/4500)

                    dyno_data["orig_nm"].append(int(round(orig_nm * torque_factor_orig)))
                    dyno_data["tuned_nm"].append(int(round(tuned_nm * torque_factor_tuned)))
                    dyno_data["orig_hp"].append(int(round(orig_hp * hp_factor_orig)))
                    dyno_data["tuned_hp"].append(int(round(tuned_hp * hp_factor_tuned)))

                database[make_name]["models"][model_name]["generations"][gen_name]["engines"][eng_name] = {
                    "id": eng_id,
                    "name": eng_name,
                    "fuel": eng["fuel"],
                    "displacement": f"{eng['cc']} CC",
                    "compression": eng["comp"],
                    "ecu_type": eng["ecu"],
                    "bore_stroke": eng["bore_stroke"],
                    "engine_code": eng["engine_code"],
                    "stage1": {
                        "orig_hp": orig_hp,
                        "tuned_hp": tuned_hp,
                        "hp_gain": tuned_hp - orig_hp,
                        "hp_pct": int(round(((tuned_hp - orig_hp) / orig_hp) * 100)),
                        "orig_nm": orig_nm,
                        "tuned_nm": tuned_nm,
                        "nm_gain": tuned_nm - orig_nm,
                        "nm_pct": int(round(((tuned_nm - orig_nm) / orig_nm) * 100)),
                        "orig_fuel": eng["orig_fuel"],
                        "tuned_fuel": eng["tuned_fuel"],
                        "fuel_diff": round(eng["tuned_fuel"] - eng["orig_fuel"], 1),
                        "fuel_pct": int(round(((eng["orig_fuel"] - eng["tuned_fuel"]) / eng["orig_fuel"]) * 100))
                    },
                    "stage2": {
                        "orig_hp": orig_hp,
                        "tuned_hp": stg2_hp,
                        "hp_gain": stg2_hp - orig_hp,
                        "hp_pct": int(round(((stg2_hp - orig_hp) / orig_hp) * 100)),
                        "orig_nm": orig_nm,
                        "tuned_nm": stg2_nm,
                        "nm_gain": stg2_nm - orig_nm,
                        "nm_pct": int(round(((stg2_nm - orig_nm) / orig_nm) * 100)),
                        "orig_fuel": eng["orig_fuel"],
                        "tuned_fuel": round(eng["tuned_fuel"] * 0.98, 1),
                        "fuel_diff": round(round(eng["tuned_fuel"] * 0.98, 1) - eng["orig_fuel"], 1),
                        "fuel_pct": int(round(((eng["orig_fuel"] - round(eng["tuned_fuel"] * 0.98, 1)) / eng["orig_fuel"]) * 100))
                    },
                    "stage3": {
                        "orig_hp": orig_hp,
                        "tuned_hp": stg3_hp,
                        "hp_gain": stg3_hp - orig_hp,
                        "hp_pct": int(round(((stg3_hp - orig_hp) / orig_hp) * 100)),
                        "orig_nm": orig_nm,
                        "tuned_nm": stg3_nm,
                        "nm_gain": stg3_nm - orig_nm,
                        "nm_pct": int(round(((stg3_nm - orig_nm) / orig_nm) * 100)),
                        "orig_fuel": eng["orig_fuel"],
                        "tuned_fuel": round(eng["tuned_fuel"] * 1.05, 1),
                        "fuel_diff": round(round(eng["tuned_fuel"] * 1.05, 1) - eng["orig_fuel"], 1),
                        "fuel_pct": 5
                    },
                    "eco": {
                        "orig_hp": orig_hp,
                        "tuned_hp": eco_hp,
                        "hp_gain": eco_hp - orig_hp,
                        "hp_pct": int(round(((eco_hp - orig_hp) / orig_hp) * 100)),
                        "orig_nm": orig_nm,
                        "tuned_nm": eco_nm,
                        "nm_gain": eco_nm - orig_nm,
                        "nm_pct": int(round(((eco_nm - orig_nm) / orig_nm) * 100)),
                        "orig_fuel": eng["orig_fuel"],
                        "tuned_fuel": eco_fuel,
                        "fuel_diff": round(eco_fuel - eng["orig_fuel"], 1),
                        "fuel_pct": 15
                    },
                    "dyno": dyno_data,
                    "options": [
                        {"id": "hard_cut", "name": "Hard cut limiter", "icon": "speedometer", "desc": "Snelle toerenbegrenzer met vlammen / knallen"},
                        {"id": "pops_bangs", "name": "Pops & Bangs", "icon": "fire", "desc": "Plopgeluiden en knallen bij gas loslaten (deceleration)"},
                        {"id": "egr_off", "name": "EGR OFF", "icon": "ban", "desc": "Elektronische uitschakeling van de EGR-klep"},
                        {"id": "adblue_off", "name": "Ad blue OFF", "icon": "droplet", "desc": "Deactivatie van het SCR / AdBlue systeem"},
                        {"id": "dpf_off", "name": "DPF OFF", "icon": "filter", "desc": "Elektronische uitschakeling van het roetfilter"},
                        {"id": "swirl_flaps", "name": "Swirl flaps", "icon": "wind", "desc": "Wervelkleppen softwarematig uitschakelen"},
                        {"id": "decat", "name": "Decat", "icon": "car", "desc": "Uitschakeling van secundaire lambdasonde na katverwijdering"},
                        {"id": "immo_off", "name": "IMMO off", "icon": "key", "desc": "Startonderbreker deactiveren in de motormanagement software"},
                        {"id": "vmax", "name": "VMAX verwijdering", "icon": "gauge-high", "desc": "Verwijdering van de fabrieks topsnelheidsbegrenzer"},
                        {"id": "start_stop", "name": "Start-Stop OFF", "icon": "power-off", "desc": "Permanent uitschakelen of omkeren van Start-Stop geheugen"},
                        {"id": "dtc_off", "name": "DTC OFF", "icon": "wrench", "desc": "Foutcode(s) permanent uitschakelen uit ECU-geheugen"}
                    ]
                }

# Save database
os.makedirs('data', exist_ok=True)
with open('data/vehicles.json', 'w', encoding='utf-8') as f:
    json.dump(database, f, indent=2, ensure_ascii=False)

print(f"Successfully generated data/vehicles.json with {len(database)} makes!")
# Print stats
total_models = sum(len(m["models"]) for m in database.values())
total_engines = sum(
    len(g["engines"]) 
    for m in database.values() 
    for mo in m["models"].values() 
    for g in mo["generations"].values()
)
print(f"Total models: {total_models}, Total engine options: {total_engines}")

