# TuningPortal &mdash; Professioneel Chiptuning & File Service Platform

Volledig responsive chiptuning platform, inclusief embeddable voertuigselector iframe, dyno vermogensgrafieken, klant- & tuner file service portaal, slave tool catalogus en OBD2 DTC storingscode database (8.709 codes). Speciaal geoptimaliseerd voor uitrol op **Mijndomein.nl** (`httpdocs` structuur).

## Inhoud van het Project

- **`index.html`** &mdash; Hoofdwebsite met complete autozoeker, Stage 1/2/3 specificaties, interactieve dyno grafiek, brandstofmeter, diensten en afspraak boeken.
- **`iframe.html`** &mdash; Standalone embeddable widget dat 1-op-1 aansluit op het referentieontwerp. Bevat cross-domain postMessage auto-resizing.
- **`dashboard.html`** &mdash; File service tuner portaal (gebaseerd op het Fast-Chiptuningfiles dashboard) met file upload wizard, credit management, iDEAL simulator en helpdesk tickets.
- **`tools.html`** &mdash; Hardware catalogus met officiële Slave flashers (Autotuner, KESS3, bFlash, Flex, CMDFlash, Autoflasher).
- **`dtc.html`** &mdash; Zoekmachine voor alle 8.709 OBD-II storingscodes met DTC OFF ondersteuning.
- **`api/index.php`** &mdash; Snelle PHP API voor gedeelde hosting op Mijndomein.nl met SQLite en JSON fallback.
- **`server.js`** &mdash; Express backend voor lokale preview en ontwikkeling.
- **`assets/`** &mdash; Stylesheet (`tuningportal.css`), JavaScript engine (`tuning-core.js`) en tool afbeeldingen (`assets/img/`).
- **`data/`** &mdash; 120 automerken, 607 modellen en 15.490 motoren (`tree.json`, `makes_data/*.json`, `dtc-codes.json`, `tuningportal.db`).
- **`httpdocs.zip`** &mdash; Kant-en-klaar ZIP-archief voor directe upload naar Mijndomein.nl Bestandsbeheer.
- **`MIJNDOMEIN_HANDLEIDING.md`** &mdash; Uitgebreide Nederlandse handleiding voor installatie en configuratie.

## Lokaal Starten

```bash
# Dependencies installeren
npm install

# Live server starten op poort 3000
npm start
# of
node server.js
```

Open vervolgens `http://localhost:3000` in uw webbrowser.

## Uitrol naar Mijndomein.nl

Zie **[MIJNDOMEIN_HANDLEIDING.md](MIJNDOMEIN_HANDLEIDING.md)** voor gedetailleerde instructies:
1. Upload de inhoud van dit project of `httpdocs.zip` naar de map `httpdocs` op uw Mijndomein webhosting.
2. Pak het zip-bestand uit in `httpdocs`.
3. Zorg voor PHP 8.1 of hoger. Alles werkt direct out-of-the-box via `.htaccess` en `api/index.php`.
