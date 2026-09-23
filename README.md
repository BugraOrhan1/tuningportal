# TuningPortal — Fast-Chiptuningfiles Clone

High-fidelity clone van **https://fast-chiptuningfiles.com/** met voertuig-configurator (PK-gain via API), klanten login rechtsboven, en volledig file-panel.

## Stap 1 — Homepage zoals fast-chiptuningfiles.com
- Hero met “Buy 1 credit Get 1 free” banner, 3 badges (FAST TURNAROUND, DYNO-TESTED, 24/7 SUPPORT)
- **Configurator**: Make → Model → Generation → Engine → Search → API toont origineel vs. tuned PK/kW/Nm + gain (voorbeeld: 150hp → 185hp +35hp) en ECU.
- Sections: stats, welcome, 6 features (Stage 1/2/3, Pop&Bang, DPF, EGR), prijzen (Master/Slave/EVC tabs), Maximum Performance, 3 steps, why us, FAQs, contact.
- Responsive, oranje #EB5310 primary, Roboto, cards, shadows.

## Stap 2 — Inloggen rechts boven (klanten file-panel)
- Rechts boven in navbar: **Inloggen / Registreren** wanneer uitgelogd, **File Panel + avatar** wanneer ingelogd.
- `/login` en `/register` met JWT (httpOnly cookie, 7 dagen). Authenticatie via `bcryptjs`.
- `requireAuth` middleware beschermt alle `/account/*` en `/api/file-services` routes — zonder account redirect naar `/login?redirect=...`.
- Demo account: `demo@fast.local / demo123` (5 credits). Of registreer zelf.

## Stap 3 & 4 — File Service (exacte functie, pixel-perfect replica)

Repliceert 1-op-1 de HTML uit stap 3:

- **Vehicle**: Make/Model/Generation/Engine/ECU cascades via `/api/*` (type-loader style), “Otherwise, namely” velden, HP↔kW auto-conversie (1 kW=1.35962 hp), Year, Gearbox (15 opties), License plate, VIN, Octane, Vehicle type (alleen bij “other” make), “View power increase” link die modal toont.
- **ECU details**: Tool type (Master/Slave), Read method (44 opties + Other), Hardware/Software numbers.
- **Tuning type**: 15 types (Stage 1/2/3, Only options, TCU, Truck, Checksum, Immo off, E85, etc.) met credits. Per type dynamische **Optional tuning options** (3-col grid) met credits, hasRPM/hasLoudness/hasDTC extra velden, conditional visibility exact zoals `data-usable` in origineel.
- **File to modify**: drag&drop + browse, 20MB limit, original file verplicht, TCU file optioneel, optional attachments multi-upload met lijst, progress.
- **Modified parts**: Has modified parts? Yes/No → conditional Notice + checkboxes + remarks.
- **Service**: Time frame (ASAP/2-3h/5-6h), Info textarea, Terms & Refund checkboxes verplicht.
- **Submit**: multipart `/api/file-services` met multer, berekent totale credits (tuning type + opties), slaat op in `data/fileServices.json`, estimated delivery “5 minuten - 10 minuten”, status `processing`.

## Tech Stack
- **Backend**: Node 22, Express 5, EJS, JWT, bcryptjs, multer, cors, uuid
- **Frontend**: Vanilla JS (geen build), CSS custom (geen framework), Font Awesome
- **Data**: `data/vehicles.json` (80+ makes, 30+ models, 14 generations, 16 engines + ECUs met tuned gains), `data/tuningTypes.json`, `data/users.json`, `data/fileServices.json`
- **APIs**: `/api/makes`, `/api/models?makeId=`, `/api/generations?modelId=`, `/api/engines?generationId=`, `/api/ecus?engineId=`, `/api/power/:engineId`, `/api/tuning-types`, `/api/tuning-options/:typeId`, `/api/auth/*`, `/api/file-services`, `/api/diagnostic-codes`

## Runnen
```bash
npm install
npm start          # http://0.0.0.0:3000
# of
npm run dev
```

## Routes
- `/` homepage, `/tuning-specs`, `/login`, `/register`
- `/account` dashboard, `/account/file-services`, `/account/file-services/new-file-service`, `/account/file-services/:id`
- `/account/support-tickets`, `/account/buy-credits`, `/account/transactions`, `/account/orders`, `/account/profile`
- `/legal/:page`

Preview proxy: bindt op `0.0.0.0:3000`, werkt met `https://{port}-{sandboxId}.e2b.app`.
