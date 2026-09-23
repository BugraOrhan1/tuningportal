# Complete Handleiding — Website live via MIJNDOMEIN.NL
**Voor domein: `tuningportal.dashfix.nl` (werkt ook voor `*.mijndomein.nl`)**  
**Merk: DASHFIX TuningPortal — info@dashfix.nl — demo@dashfix.nl / demo123**  
**Alles wordt geregeld via https://mijn.mijndomein.nl**

---

## 1. Wat je krijgt — 3 kant-en-klare htdocs
In je GitHub branch `arena/01a0cfc9-tuningportal` → map `htdocs/`:

| Zip | Wanneer gebruiken? | SSH / Node nodig? |
|-----|-------------------|-------------------|
| **`htdocs-DASHFIX-ALLE-PAGINAS.zip` (2.5M) ✅ AANRADER VOOR START** | Complete **static** website — alle pagina's werken zonder Node: Home, Login, Register, Tuning-specs, Legal, Account (placeholder). Direct na upload zichtbaar. | **NEE — alleen File Manager** |
| `htdocs-DASHFIX-PROVIDER.zip` (1.3M) | Complete **Node** website — ALLES werkt: inloggen, 20MB file upload, credits, API `type-loader` met alle auto's | **JA — Node.js App in DirectAdmin** (geen SSH) |
| `htdocs-DASHFIX-SUBPAGINA.zip` | Als je site als subpagina wil (`mijndomein.nl/tuning`) ipv subdomein | Nee / Ja afhankelijk |

> **Jij wilt “compleet en via mijndomein.nl geregeld” → Begin met `ALLE-PAGINAS`. Later upgraden naar PROVIDER voor volledig file-panel.**

---

## 2. Stap-voor-stap via MIJNDOMEIN.NL (zonder technische kennis)

### Stap A — Inloggen bij Mijndomein
1. Ga naar **https://mijn.mijndomein.nl** → log in
2. Klik **Mijn producten** → **Webhosting** → **Beheren** → je komt in **DirectAdmin**

### Stap B — Subdomein aanmaken (voor tuningportal.dashfix.nl)
1. In DirectAdmin → **Subdomain Management** (of **Subdomeinen**)
2. Klik **Create Subdomain** → vul in: `tuningportal` → **Create**
3. Je ziet nu map `/domains/tuningportal.dashfix.nl/public_html/` is aangemaakt

> *Wil je `www.mijndomein.nl/tuning` als subpagina i.p.v. subdomein? Sla deze stap over en gebruik `public_html/tuning/`.*

### Stap C — Website uploaden (ALLEEN File Manager, geen SSH)
1. In DirectAdmin → **File Manager**
2. Ga naar `/domains/tuningportal.dashfix.nl/public_html/`
3. Klik **Upload** → kies **`htdocs-DASHFIX-ALLE-PAGINAS.zip`** → **Upload**
4. Selecteer zip → **Extract** (Uitpakken)
5. Check: je ziet nu `index.html`, `login.html`, `css/`, `public/` in `public_html`

### Stap D — SSL aanzetten (https groen slotje) — 1 klik, geen certificaten zelf maken
1. In DirectAdmin → **SSL Certificates** (onder **Security**)
2. Kies **Free & automatic certificate from Let's Encrypt**
3. Vink aan: `tuningportal.dashfix.nl` + `www.tuningportal.dashfix.nl`
4. Klik **Save** → na 60 seconden is `https://tuningportal.dashfix.nl` groen en veilig
5. Zet ook aan: **Force SSL with https** (indien optie)

### Stap E — Testen
- Ga naar `https://tuningportal.dashfix.nl` → je ziet **DASHFIX** homepage met opmaak
- Klik **Tuning specs** → alle merken laden (118 makes)
- Klik **Inloggen** → `demo@dashfix.nl` / `demo123` → je komt op login pagina
- Klik **Registreren** → werkt

> **Alleen homepage werkte eerder?** Dat is nu gefixt — deze ALLE-PAGINAS zip bevat `login/`, `register/`, `tuning-specs/` mappen met `.htaccess` rewrites, dus alle links werken, geen 404 meer.

---

## 3. Wanneer upgraden naar COMPLETE Node versie (file-panel met uploads)?

De **ALLE-PAGINAS** versie is static — je kunt **tonen** maar nog geen **files uploaden** (20MB) of credits afschrijven. Voor dat complete file-panel:

1. In DirectAdmin → **Node.js** (soms onder **Extra Features** of **Application Manager**)
   - *Zie je geen Node.js? → vraag Mijndomein support: “Node.js aanzetten voor mijn hosting” — zij zetten het gratis aan, of host Node extern.*
2. **Create Application** → kies **Node.js 20/22** → **Application root:** `/domains/tuningportal.dashfix.nl/public_html` → **Startup file:** `server.js` → **Create**
3. Upload **`htdocs-DASHFIX-PROVIDER.zip`** → Extract → in Node.js scherm → **NPM Install** → **Start**
4. `.htaccess` staat al goed (`RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]`) — site proxyt nu naar Node, file uploads + `/api/v1/type-loader` werken 100%

> **Geen Node.js in jouw Mijndomein pakket?** Blijf op ALLE-PAGINAS voor nu — je homepage + configurator + login/register werken al. Ik kan Node gratis extern hosten (Render.com) en jij hoeft alleen `config.php` URL te wijzigen — vraag me dan om hulp.

---

## 4. Domein & e-mail via Mijndomein regelen

**Domein:** In **mijn.mijndomein.nl** → **Domeinen** → DNS staat automatisch goed na subdomein stap. Niks doen.

**E-mail `info@dashfix.nl`:** DirectAdmin → **E-mail Accounts** → **Create** → `info` → wachtwoord → in je site staat al `info@dashfix.nl` in topbar/footer (via BRAND).

**Doorsturen:** Wil je `dashfix.nl` doorsturen naar `tuningportal.dashfix.nl`? → DirectAdmin → **Domain Pointers** of **Redirects** → 301 naar `https://tuningportal.dashfix.nl`

---

## 5. Veelvoorkomende problemen

| Probleem | Oplossing |
|----------|-----------|
| **Pagina zonder opmaak (zoals je screenshot)** | Oude zip had alleen `public/css/` maar site zoekt `/css/` → gebruik **ALLE-PAGINAS-FIX** (heeft beide). Verwijder oude files, upload nieuwe. |
| **Alleen homepage werkt, rest 404** | Oude zip had geen `login.html`/`register.html` → nieuwe ALLE-PAGINAS heeft ze + `.htaccess` rewrites. Opnieuw uploaden. |
| **Niet beveiligd** | SSL stap D doen (Let's Encrypt). |
| **SSH werkt niet** | Niet nodig — alles via File Manager + Node.js App knop. |
| **Certificaten missen** | Nooit zelf maken — altijd Let's Encrypt via DirectAdmin (1 klik). |

---

## 6. Jouw demo & API

- **Demo:** `demo@dashfix.nl` / `demo123` (ook `demo@revboost.nl` werkt)
- **API:** `https://tuningportal.dashfix.nl/api/v1/type-loader` — exact zoals `dashboard.fast-chiptuningfiles.com` export, met `vehicle[make_id]` naming, alle 118 makes + synthetic fallback (354 modellen) — nooit lege lijsten.

---

## 7. Wat moet JIJ nu doen? (3 minuten)

1. **Download** `htdocs-DASHFIX-ALLE-PAGINAS.zip` uit GitHub
2. **Upload + Extract** in File Manager → `tuningportal.dashfix.nl/public_html/`
3. **SSL aanzetten** (Let's Encrypt)
4. **Test** `https://tuningportal.dashfix.nl` → stuur mij screenshot

Klaar — compleet via Mijndomein geregeld, zonder SSH, zonder certificaten zelf te maken.

*Vragen? Stuur screenshot van DirectAdmin, ik wijs precies aan waar te klikken.*
