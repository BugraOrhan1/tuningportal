# MIJNDOMEIN.NL — TuningPortal htdocs (XAMPP)

**Domein: mijndomein.nl — info@mijndomein.nl**

## Plaatsen in XAMPP
1. Kopieer de map `mijndomein` naar:
   ```
   C:\xampp\htdocs\mijndomein\
   ```
   Of kopieer alle bestanden direct naar `C:\xampp\htdocs\` als je het als root wilt.

2. Node.js installeren (v22) en in de map:
   ```
   cd C:\xampp\htdocs\mijndomein
   npm install
   npm start
   ```
   Draait op http://localhost:3000  → via Apache proxy http://localhost/mijndomein

## Of direct via Node (aanrader)
```
npm install
npm start
# http://localhost:3000 of https://mijndomein.nl (na reverse proxy)
```

## Inloggen
- demo@mijndomein.nl / demo123 (maak eerst via Registreren of gebruik demo@revboost.nl)
- Alle auto's laden via /api/v1/type-loader (exact zoals dashboard.fast-chiptuningfiles.com)
