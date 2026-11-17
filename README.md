# Web Glowup

Statische Website für [web-glowup.com](https://web-glowup.com). Web Glowup baut individuelle Websites für lokale Betriebe in den USA (Restaurants, Salons, Zahnarztpraxen, Fitnessstudios, Läden). Die öffentliche Seite ist auf Englisch. Sie besteht aus reinem HTML, CSS und JavaScript, ohne Build-Schritt, und lässt sich direkt über GitHub Pages ausliefern.

## Lokal ansehen

Im Projektordner:

```bash
python3 -m http.server 4731
```

Danach im Browser [http://127.0.0.1:4731/](http://127.0.0.1:4731/) öffnen.

## Preise, Demo-Link und Formular

Alles, was sich oft ändert, steht in `js/site-config.js`:

- `priceFrom`, `priceMax` — daraus entsteht der Satz «From $199 up to $1,500. Price by quote.»
- `budgetChoices` — Stufen im Quote-Formular. `{from}` und `{max}` werden als Dollar-Betrag eingesetzt. Runde Zwischenwerte bei einem anderen Rahmen kurz prüfen
- `demoUrl` — Link zum Beispielprojekt, standardmässig `./demo/`
- `formEndpoint` — Formspree-Adresse. Den Platzhalter `https://formspree.io/f/xxxxxxxx` ersetzen
- `email` — Empfänger, solange das Formular noch nicht verbunden ist

Solange der Formspree-Platzhalter steht, schickt das Formular nichts an einen Server. Es öffnet eine E-Mail an `hello@web-glowup.com` mit den ausgefüllten Feldern.

## Legal und Privacy

`legal.html` und `privacy.html` sind englische Vorlagen (Legal / Imprint und Privacy Policy). Markierte Felder («Add») vor dem öffentlichen Start ersetzen oder streichen. Das ist keine Rechtsberatung.

## Eigene Domain wieder aktivieren

Solange `web-glowup.com` noch nicht registriert ist, läuft die Seite unter https://morriss-creator.github.io/web-glowup/. Die Datei `CNAME` wurde deshalb vorübergehend entfernt. Sobald die Domain registriert ist:

1. Im Hauptordner eine Datei `CNAME` anlegen, die nur diese eine Zeile enthält: `web-glowup.com`
2. Bei Hostpoint in der DNS-Zone von `web-glowup.com` vier **A**-Einträge für die nackte Domain (Name leer bzw. `@`) anlegen: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Für `www` einen **CNAME** auf `morriss-creator.github.io` anlegen.
4. In `404.html` die drei Pfade `/web-glowup/…` wieder auf `/…` ändern (also `/assets/favicon.svg`, `/css/styles.css` und `/`), weil die Seite dann direkt unter der Domain liegt.
5. In GitHub unter Settings → Pages die Custom Domain `web-glowup.com` eintragen und nach dem Zertifikat **Enforce HTTPS** einschalten. Details siehe unten.

## Auf GitHub Pages veröffentlichen

1. Dieses Repository auf GitHub bringen, Branch `main`.
2. Unter **Settings → Pages → Build and deployment** als Quelle **Deploy from a branch** wählen, Branch `main`, Ordner **`/ (root)`**.
3. Unter **Custom domain** zuerst `web-glowup.com` eintragen und speichern, bevor die DNS-Einträge beim Hoster auf GitHub zeigen. So sinkt das Risiko, dass jemand anders die Domain für eine GitHub-Pages-Seite verwendet. Die Datei `CNAME` ist im Moment absichtlich nicht im Repository, siehe Abschnitt «Eigene Domain wieder aktivieren».
4. Die Datei `.nojekyll` sorgt dafür, dass GitHub Pages die Dateien unverändert ausliefert und nicht durch Jekyll schickt.
5. Warten, bis die Domain in den Pages-Einstellungen als korrekt erkannt ist. Danach **Enforce HTTPS** einschalten.

## Domain bei Hostpoint auf GitHub Pages zeigen

Die Nameserver bleiben bei Hostpoint. Es werden nur DNS-Einträge geändert. MX-Einträge für E-Mail nicht löschen, sonst kommt keine Post an.

1. Im Hostpoint Control Panel anmelden.
2. Die Domain `web-glowup.com` öffnen und die DNS-Zone bearbeiten (Domains → DNS-Zone).
3. A- und AAAA-Einträge der nackten Domain entfernen, die auf ein Hostpoint-Parking oder ein altes Hosting zeigen. MX-, TXT- und NS-Einträge behalten.
4. Für die nackte Domain vier **A**-Einträge anlegen. Das Namensfeld leer lassen (das ist `@`):

   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`

5. Ebenfalls für die nackte Domain vier **AAAA**-Einträge, damit IPv6 funktioniert:

   - `2606:50c0:8000::153`
   - `2606:50c0:8001::153`
   - `2606:50c0:8002::153`
   - `2606:50c0:8003::153`

6. Für `www` einen **CNAME** anlegen. Name: `www`. Ziel: `morriss-creator.github.io`. Wenn das Panel einen Punkt am Ende verlangt: `morriss-creator.github.io.` Die eigene Domain nicht zusätzlich anhängen, sonst entsteht ein Name wie `benutzer.github.io.web-glowup.com`.
7. Speichern. Die Verteilung dauert oft einige Minuten, selten bis zu 24 Stunden.
8. Prüfen:

   ```bash
   dig web-glowup.com +short
   dig www.web-glowup.com +short
   ```

9. In GitHub Pages **Enforce HTTPS** aktivieren, sobald das Zertifikat bereit ist. Weitere A- oder AAAA-Einträge auf der nackten Domain können das Zertifikat verhindern.
10. Keine Wildcard-Einträge wie `*.web-glowup.com` anlegen.

In GitHub ist `web-glowup.com` die Custom Domain. `www` zeigt per CNAME auf GitHub Pages und wird auf die nackte Domain umgeleitet, sobald beides auf GitHub zeigt.

## Dateien

- `index.html` — Startseite (Englisch)
- `demo/` — Beispielprojekt Trattoria Linde, klar als Sample gekennzeichnet
- `legal.html`, `privacy.html` — englische Vorlagen
- `404.html` — Hinweis, wenn eine Adresse fehlt
- `css/`, `js/`, `assets/` — Gestaltung, Skripte, Logo und Schriften
- `.nojekyll` — GitHub Pages (`CNAME` kommt später dazu, siehe oben)
