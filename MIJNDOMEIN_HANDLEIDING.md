# TuningPortal &mdash; Handleiding voor Mijndomein.nl Webhosting

Deze handleiding legt stap voor stap uit hoe u het complete **TuningPortal** chiptuning platform en de voertuigselector widget uploadt en configureert op uw **Mijndomein.nl** webhostingpakket.

---

## 1. Wat is er gebouwd?

Het platform is een volwaardige, snelle en mobielvriendelijke chiptuning website inclusief klant- en tunersportaal:

1. **`index.html`** &mdash; De homepage met interactieve voertuigkiezer (Merk &rarr; Model &rarr; Generatie &rarr; Motor), live vermogenswinst, koppelgrafiek (Dyno testbankcurve), brandstofbesparingsmeter, Stage 1/2/3 tabbladen, slave tools overzicht en direct offerte/afspraak boekingssysteem.
2. **`iframe.html`** &mdash; Een op zichzelf staande, embeddable widget die 1-op-1 aansluit op uw referentieontwerp. Ideaal om via een `<iframe>` in te sluiten op uw WordPress, Webflow, Shopify of HTML website met automatische hoogteaanpassing via `postMessage`.
3. **`dashboard.html`** &mdash; Het complete Tuner File Service portaal (gebaseerd op het Fast-Chiptuningfiles dashboard):
   - Nieuwe tuningfile aanvragen met voertuigwizard via de database API.
   - ECU type, uitleesmethode (OBD, Bench, Boot) en tool selectie (Autotuner, KESS3, bFlash, Flex, CMDFlash).
   - Extra opties (Pops & Bangs met luidheid, EGR OFF, DPF OFF, AdBlue OFF, Decat, DTC OFF).
   - Sleep-en-neerzet ECU bestandsupload (`.bin`, `.ori`, `.zip`).
   - Live creditssaldo en iDEAL opwaardeer-flow.
   - Support ticket helpdesk en bestandsdownloads.
4. **`tools.html`** &mdash; Hardware en flasher catalogus met alle officiële slave tools (Autotuner, Alientech KESS3, bFlash, Magic Motorsport FLEX, CMDFlash, Autoflasher) met duidelijke uitleg over Master vs Slave samenwerking.
5. **`dtc.html`** &mdash; Uitgebreide OBD-II storingscode database met **8.709 foutcodes** (P-, C-, B-, U-codes), betekenis, mogelijke oorzaken en directe DTC OFF deactivatie-oplossing.
6. **`api/index.php`** &mdash; PHP REST API die out-of-the-box werkt op de Apache / PHP hosting van Mijndomein.nl.
7. **`data/`** &mdash; Complete database met 120 automerken, honderden modellen, generaties en 15.490 motortypes, inclusief de testauto *Volkswagen Golf 7 1.2 TSI 85pk* (85pk &rarr; 140pk +65%, 160Nm &rarr; 235Nm +47%, Bosch MED17.5.21 / MED17.5.25 / DQ200).

---

## 2. Installatie op Mijndomein.nl

Mijndomein gebruikt een standaard Apache webserveromgeving waarbij alle openbare bestanden van uw website in de hoofdmap **`httpdocs`** horen te staan.

### Optie A: Uploaden via Bestandsbeheer (Snelste methode)
1. Log in op uw beheeromgeving op **Mijndomein.nl** en ga naar **Webhosting** &rarr; **Bestandsbeheer (File Manager)**.
2. Navigeer naar de map `httpdocs`.
3. Upload het kant-en-klare archiefbestand **`httpdocs.zip`** naar deze map.
4. Klik met de rechtermuisknop op `httpdocs.zip` en kies **Uitpakken (Extract)**.
5. Zorg ervoor dat de bestanden rechtstreeks in `httpdocs` staan (zodat `index.html`, `.htaccess`, `api/`, `assets/` en `data/` direct onder `httpdocs/` vallen).
6. Verwijder het bestand `httpdocs.zip` na het uitpakken.

### Optie B: Uploaden via FTP (FileZilla)
1. Open uw FTP-programma (bijvoorbeeld **FileZilla**).
2. Verbind met de FTP-gegevens die u van Mijndomein heeft ontvangen:
   - **Host:** `ftp.uwdomeinnaam.nl` (of het server IP-adres van Mijndomein)
   - **Gebruikersnaam:** Uw FTP-gebruikersnaam
   - **Wachtwoord:** Uw FTP-wachtwoord
   - **Poort:** 21 (of SFTP poort 22)
3. Open aan de serverzijde (rechts) de map **`httpdocs/`**.
4. Sleep alle bestanden en mappen van het project naar de `httpdocs/` map:
   ```text
   httpdocs/
   ├── .htaccess
   ├── index.html
   ├── iframe.html
   ├── dashboard.html
   ├── tools.html
   ├── dtc.html
   ├── api/
   │   ├── .htaccess
   │   └── index.php
   ├── assets/
   │   ├── css/tuningportal.css
   │   ├── js/tuning-core.js
   │   └── img/ (alle tool logo's, banners en afbeeldingen)
   └── data/
       ├── makes.json
       ├── tree.json
       ├── dtc-codes.json
       ├── tuningportal.db
       └── makes_data/ (120 merk JSON-bestanden)
   ```

---

## 3. PHP & Server Instellingen op Mijndomein

Op Mijndomein.nl staat alles standaard al optimaal ingesteld voor dit platform:

- **PHP Versie:** Kies in het Mijndomein controlepaneel voor **PHP 8.1, 8.2 of 8.3** (PHP 7.4 werkt ook).
- **SQLite3 / PDO:** De PHP SQLite3 module is standaard geactiveerd op Mijndomein. Mocht de server SQLite niet ondersteunen, dan schakelt `api/index.php` automatisch en transparant over naar de razendsnelle JSON-opslag in `data/makes_data/` en `data/tree.json`.
- **Mod_Rewrite:** Apache `mod_rewrite` is standaard ingeschakeld. Het meegeleverde `.htaccess` bestand regelt automatisch:
  - Het doorsturen van alle `/api/*` verzoeken naar `api/index.php`.
  - CORS-headers (`Access-Control-Allow-Origin: *`) zodat de iframe widget en API ook probleemloos werken vanaf andere subdomeinen of websites.
  - Gzip compressie en browser caching voor supersnelle laadtijden.
  - Beveiliging van de SQLite database tegen directe downloads.

---

## 4. Hoe integreert u het Iframe op uw eigen website?

Wilt u de voertuigkiezer widget insluiten op een bestaande website (bijv. WordPress, Wix, Webflow of Squarespace)? Gebruik dan de onderstaande eenvoudige HTML embed-code:

```html
<!-- TuningPortal Voertuigkiezer Widget -->
<iframe 
  id="tuningportal-widget" 
  src="https://www.uwdomeinnaam.nl/iframe.html" 
  width="100%" 
  height="750" 
  frameborder="0" 
  scrolling="no" 
  style="border: none; max-width: 100%; width: 100%; min-height: 700px; overflow: hidden; display: block;" 
  allow="clipboard-write">
</iframe>

<!-- Automatische hoogte-aanpassing script (optioneel, voor perfecte responsiviteit) -->
<script>
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'tuningportal_resize') {
      var iframe = document.getElementById('tuningportal-widget');
      if (iframe && e.data.height) {
        iframe.style.height = (e.data.height + 20) + 'px';
      }
    }
  });
</script>
```

### Specifieke auto vooraf selecteren in het Iframe
U kunt een auto direct laten inladen via de URL parameter `engine_id` of `id`:
```text
https://www.uwdomeinnaam.nl/iframe.html?id=6a1cf2b4f366f2001b1403e7
```

---

## 5. API Endpoints Overzicht

Het platform beschikt over een complete RESTful API die zowel werkt via `http://localhost:3000` (Node.js preview) als via `https://uwdomeinnaam.nl/api/` (PHP productie op Mijndomein):

| Endpoint | Methode | Beschrijving |
| :--- | :--- | :--- |
| `/api/makes` | `GET` | Geeft alle 120 automerken terug met ID en naam. |
| `/api/models?make=Volkswagen` | `GET` | Geeft alle modellen van het gekozen merk terug. |
| `/api/generations?make=Volkswagen&model=Golf` | `GET` | Geeft alle bouwjaren en generaties terug. |
| `/api/engines?make=Volkswagen&model=Golf&generation=Golf 7 - 2012 - 2016` | `GET` | Geeft alle motoren terug met vermogen en brandstoftype. |
| `/api/tuning-specs?id=6a1cf2b4f366f2001b1403e7` | `GET` | Geeft de complete tuningspecificaties terug (Stage 1/2/3, koppel, pk, winstpercentages, brandstofbesparing, ECU type, cilinderinhoud, boring x slag). |
| `/api/v1/type-loader` | `GET` | Compatibiliteitsendpoint voor Fast-Chiptuningfiles widgets. |
| `/api/dtc?code=P0401` | `GET` | Doorzoekt de 8.709 storingscodes op foutcode of trefwoord. |
| `/api/file-services` | `GET / POST` | Beheer en indienen van chiptuning bestanden via het dashboard. |
| `/api/credits` | `GET` | Geeft het huidige creditsaldo en transactiehistorie terug. |
| `/api/buy-credits` | `POST` | Opwaarderen van credits (iDEAL betaalsimulatie). |
| `/api/tickets` | `GET / POST` | Aanmaken en bekijken van support tickets. |

---

## 6. Verificatie & Testen

Na het uploaden naar Mijndomein kunt u de werking eenvoudig controleren:
1. Open in uw browser: `https://www.uwdomeinnaam.nl/` &rarr; De complete homepage laadt met het donkere moderne design.
2. Selecteer in de autozoeker: **Volkswagen** &rarr; **Golf** &rarr; **Golf 7 - 2012 - 2016** &rarr; **1.2 TSI 85pk**.
   - Origineel vermogen: **85 pk** &rarr; Na Stage 1 tuning: **140 pk** (+55 pk / +65%).
   - Origineel koppel: **160 Nm** &rarr; Na Stage 1 tuning: **235 Nm** (+75 Nm / +47%).
   - Brandstofverbruik: **4.9 L/100km** &rarr; **4.4 L/100km** (10% besparing).
   - ECU type: **Bosch MED17.5.21 & Bosch MED17.5.25 & Temic DQ200**.
   - Motorcode: **CBZA**.
3. Open `https://www.uwdomeinnaam.nl/iframe.html` &rarr; Het embeddable widget laadt zelfstandig en toont direct de grafiek en opties.
4. Open `https://www.uwdomeinnaam.nl/dashboard.html` &rarr; Test de file upload wizard, credit calculator en DTC opzoekfunctie.
5. Open `https://www.uwdomeinnaam.nl/dtc.html` &rarr; Zoek op `P0401` of `P0420` en controleer de resultaten.
6. Open `https://www.uwdomeinnaam.nl/tools.html` &rarr; Bekijk de slave tools en test het offerte-aanvraagformulier.
