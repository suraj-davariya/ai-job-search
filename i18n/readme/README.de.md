_Hinweis: Dies ist eine von der Community erstellte, maschinell unterstützte Übersetzung (Beta). Die englische README ist die maßgebliche Fassung._

<div align="center">

# CareerForge

**Ein KI-Assistent für die Jobsuche, der Stellenanzeigen findet, maßgeschneiderte Lebensläufe und Anschreiben verfasst und sie zu druckfertigen PDFs kompiliert – alles auf Ihrem eigenen Rechner.**

<!-- Try it live — hosted on GitHub Pages, no install needed -->
[![Live Docs](https://img.shields.io/badge/Docs-Live%20site-D97757?logo=githubpages&logoColor=white)](https://suraj-davariya.github.io/ai-job-search/)
[![Live Dashboard Demo](https://img.shields.io/badge/Dashboard-Live%20demo-D97757?logo=nextdotjs&logoColor=white)](https://suraj-davariya.github.io/ai-job-search/dashboard/)

<!-- What it is — AI-native identity -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-D97757?logo=anthropic&logoColor=white)](https://claude.com/claude-code)
[![AI-Native](https://img.shields.io/badge/AI--Native-Agentic%20workflow-8A4FFF)](docs/architecture/architecture-overview.md)
[![Agents](https://img.shields.io/badge/Agents-Reviewer%20%2B%20Research-8A4FFF)](.claude/agents/)
[![Skills](https://img.shields.io/badge/Skills-3-8A4FFF)](.claude/skills/)
[![Commands](https://img.shields.io/badge/Commands-setup%20%C2%B7%20search%20%C2%B7%20apply%20%C2%B7%20upskill%20%C2%B7%20expand%20%C2%B7%20reset-8A4FFF)](.claude/commands/)
[![Prompt-as-code](https://img.shields.io/badge/Architecture-Prompt--as--code-6E56CF)](docs/architecture/)

<!-- How it's built — modern stack, privacy, reach -->
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](dashboard/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](dashboard/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](dashboard/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](dashboard/)
[![LaTeX](https://img.shields.io/badge/PDF-LaTeX-008080?logo=latex&logoColor=white)](cv/)
[![docs-site CI](https://github.com/suraj-davariya/ai-job-search/actions/workflows/docs-site.yml/badge.svg)](https://github.com/suraj-davariya/ai-job-search/actions/workflows/docs-site.yml)
[![Local-first](https://img.shields.io/badge/Privacy-Local--first-2E7D32)](docs/architecture/technology-stack.md)
[![Country-agnostic](https://img.shields.io/badge/Reach-Country--agnostic-1565C0)](docs/requirements/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

> **Neu hier? Starten Sie mit der Anleitung.** Der freundlichste Weg, CareerForge zu verstehen, ist die Dokumentationsseite – Schnellstart, alle drei Befehle, das Dashboard mit Live-Demos, Datenschutz und FAQ. Es sind keine Programmierkenntnisse nötig, um sie zu lesen.
>
> - 🌐 **Jetzt lesen:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** – gehostet, nichts zu installieren.
> - 📊 **Klicken Sie sich durch das Dashboard:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** – die echte Benutzeroberfläche mit fiktiven Beispieldaten, schreibgeschützt.
> - 💻 **Lieber lokal?** Führen Sie `npm run dev` in [`docs-site/`](docs-site/) aus (oder lesen Sie [die zugehörige README](docs-site/README.md) für den Ein-Befehl-Static-Build).

## Was ist das?

CareerForge ist ein Werkzeugkasten für die Jobsuche, den Sie innerhalb von **Claude Code** ausführen – einem KI-Assistenten, der in Ihrem Terminal lebt. Sie geben Befehle und Eingaben in einfachem Deutsch (bzw. Englisch) ein; die KI erledigt die Arbeit. Keine Programmierkenntnisse erforderlich.

Das kann es heute für Sie tun:

| Schritt | Sie sagen | Was passiert |
|------|---------|-------------|
| **1. Profil erstellen** | `/setup` | Claude liest Ihren vorhandenen Lebenslauf, LinkedIn-Export, Zeugnisse oder führt ein Interview mit Ihnen – und schreibt dann Ihr Kandidatenprofil |
| **2. Neue Jobs finden** | `/search` | Claude durchsucht Ihre konfigurierten Jobportale, entfernt Duplikate gegenüber bereits gesehenen Jobs, bewertet jeden auf Passung und zeigt Ihnen eine sortierte Tabelle |
| **3. Bewerben** | `/apply <URL oder einfügen>` | Claude bewertet Ihre Passung, passt Ihren Lebenslauf an, schreibt ein Anschreiben in der Sprache der Anzeige, lässt einen zweiten KI-Prüfer beide kritisch begutachten, übernimmt die Änderungen, kompiliert zwei PDFs und führt eine abschließende Verifizierungs-Checkliste durch |

> **Ihre Daten verlassen niemals Ihren Rechner.** Ihr Profil, Ihre Lebensläufe, Anschreiben und Ihr Bewerbungsprotokoll werden alle lokal gespeichert und niemals in Git eingecheckt.

---

## Wie es funktioniert – die 3-Minuten-Version

```
Your documents                  CareerForge                     Output
─────────────    ──────────────────────────────────────    ──────────────
  CV / LinkedIn  →  /setup  →  Candidate profile           Profile files
                                    ↓
  Job portals    →  /search →  Ranked job list              Console table
  (configured)           ↓
                      Pick a job
                           ↓
  Job posting    →  /apply  →  Fit score & verdict
                               Tailored CV  (2 pages)  →  cv/main_<co>.pdf
                               Cover letter (1 page)   →  cover_letters/cover_<co>.pdf
                               Reviewer critique
                               Revision pass
                               Verification checklist
```

**Was CareerForge nicht tut:**
- Bewerbungen in Ihrem Namen absenden (Sie prüfen und versenden selbst)
- Fähigkeiten oder Erfahrungen erfinden, die Sie nicht haben
- Irgendetwas in die Cloud hochladen

---

## Was Sie brauchen

### 1. Claude Code

Claude Code ist der KI-Assistent, der CareerForge ausführt. Installieren Sie ihn einmalig:

```bash
npm install -g @anthropic-ai/claude-code
```

Dann melden Sie sich an:

```bash
claude
```

Claude Code erfordert ein [Anthropic-Konto](https://claude.ai). Die Tarife Free und Pro funktionieren beide; Pro wird für intensive Nutzung empfohlen.

> **Nicht sicher, was Claude Code ist?** Stellen Sie es sich als intelligenten Terminal-Assistenten vor, der Dateien lesen, im Web suchen und Befehle ausführen kann – geleitet von den CareerForge-Anweisungen.

### 2. LaTeX (für die PDF-Erstellung)

CareerForge kompiliert Ihren Lebenslauf und Ihr Anschreiben mit LaTeX zu PDF. Zwei Compiler werden benötigt:

| Compiler | Verwendet für | Warum |
|----------|----------|-----|
| `lualatex` | Lebenslauf | Erforderlich für die Pakete `fontawesome` und `lato` |
| `xelatex` | Anschreiben | Erforderlich für `fontspec` bei gebündelten Schriftarten |

**macOS** (empfohlen – installiert beide Compiler):
```bash
brew install --cask mactex
```
Oder von [tug.org/mactex](https://www.tug.org/mactex/) herunterladen.

Fügen Sie nach der Installation die zusätzlichen CV-Pakete hinzu:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** Installieren Sie [MiKTeX](https://miktex.org/download) – es lädt fehlende Pakete automatisch nach.

### 3. Python 3.10+ _(optional – für Gehalts-Benchmarking)_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## Schnellstart

```bash
# 1. Clone the repo
git clone https://github.com/suraj-davariya/ai-job-search.git
cd ai-job-search

# 2. Open CareerForge in Claude Code
claude

# 3. Build your profile (answer Claude's questions or point it at your documents)
/setup

# 4. Search for jobs
/search

# 5. Apply to one
/apply https://company.com/jobs/your-role
```

---

## Befehle im Detail

### `/setup` – Ihr Kandidatenprofil erstellen

Füllt sieben Profildateien aus Ihren echten Daten. Claude stellt Fragen oder liest Ihre Dokumente – kein Tippen, wenn Sie Dateien haben.

**Drei Onboarding-Pfade:**

| Pfad | Wann verwenden |
|------|-------------|
| **A – Dokumente scannen** | Sie haben Lebensläufe, einen LinkedIn-Export, Zeugnisse oder Referenzschreiben im Ordner `documents/` |
| **B – Lebenslauf importieren** | Sie haben einen einzelnen, sauberen Lebenslauf und möchten schnell starten |
| **C – Live-Interview** | Sie fangen bei null an; Claude interviewt Sie |

**Beispiel-Eingaben:**

```
/setup
```
```
/setup --section search
```
> _(Springt direkt zur Aktualisierung Ihrer Ziel-Jobportale und Standortpräferenzen, ohne das gesamte Interview erneut durchzuführen.)_

```
/setup --section experience
```
> _(Aktualisiert nur Ihre Berufserfahrung – nützlich nach einem Jobwechsel.)_

**Was erstellt wird:**

| Datei | Inhalt |
|------|---------|
| `01-candidate-profile.md` | Identität, Ausbildung, Berufserfahrung, Fähigkeiten, Projekte |
| `02-behavioral-profile.md` | Arbeitsstil, Kulturpräferenzen, Motivationen |
| `03-writing-style.md` | _(statisches Framework – keine persönlichen Daten)_ |
| `04-job-evaluation.md` | Ihre Stärken/Schwächen, Karriereziele |
| `05-cv-templates.md` | Profiltexte je Positionstyp |
| `06-cover-letter-templates.md` | _(statische Vorlagen)_ |
| `07-interview-prep.md` | STAR-Geschichten aus Ihrer Erfahrung |
| `search-queries.md` | Ihre Ziel-Jobportale, Suchanfragen, Standort-Ebenen |

---

### `/search` – Neue Stellenanzeigen finden

Durchsucht Ihre konfigurierten Jobportale per Websuche, entfernt Duplikate gegenüber bereits gesehenen Jobs, vergibt ein Passungssignal (Hoch / Mittel / Niedrig) und präsentiert eine sortierte Tabelle. Wenn Sie eine Nummer auswählen, wird der Job direkt an `/apply` übergeben.

**Argumente:**

| Syntax | Verhalten |
|--------|-----------|
| `/search` | Führt Ihre 3 wichtigsten Suchkategorien aus |
| `/search data science` | Priorisiert Kategorien, die zu „data science“ passen |
| `/search broad` | Führt alle konfigurierten Suchkategorien aus |

**Beispiel-Eingaben:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**Beispielausgabe:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **Alle Portale stammen aus Ihrer Konfiguration.** Nichts ist fest codiert – fügen Sie ein beliebiges Jobportal (LinkedIn, Indeed, Jobindex, Stepstone usw.) zu `search-queries.md` hinzu, und es wird automatisch berücksichtigt.

---

### `/apply` – Einen maßgeschneiderten Lebenslauf und ein Anschreiben erstellen

Nimmt eine Job-URL oder eine eingefügte Beschreibung und durchläuft die vollständige Bewerbungspipeline:

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**Argumente:**

| Argument | Verhalten |
|----------|-----------|
| _(Standard)_ | Vollständige Pipeline mit Prüfer (`--review=full`) |
| `--review=quick` | Prüfer überspringt Unternehmensrecherche – schneller, geringere Kosten |
| `--review=none` | Prüfer komplett überspringen – am schnellsten, geringste Kosten |

**Beispiel-Eingaben:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

Oder fügen Sie die Stellenbeschreibung direkt ein:

```
/apply
[paste job description here]
```

**Was Sie erhalten:**

| Ausgabe | Speicherort |
|--------|---------|
| Lebenslauf (PDF, 2 Seiten, Englisch) | `cv/main_<company>.pdf` |
| Anschreiben (PDF, 1 Seite, Sprache der Anzeige) | `cover_letters/cover_<company>_<role>.pdf` |
| Bewerbungseintrag | `job_search_tracker.csv` |
| Passungsbewertung | Im Gespräch |

**Passungsbewertung (5 Dimensionen):**

| Dimension | Gewichtung |
|-----------|--------|
| Übereinstimmung der technischen Fähigkeiten | 30 % |
| Karriereausrichtung | 30 % |
| Übereinstimmung der Erfahrung | 25 % |
| Verhaltens- / Kulturpassung | 15 % |
| Standort & Logistik | Bestanden / Nicht bestanden |

Urteil: **Stark** (75+) · **Gut** (60–74) · **Mäßig** (45–59) · **Schwach** (30–44) · **Schlecht** (<30)

> **Sprachregel:** Das Anschreiben wird immer in der Sprache der Stellenanzeige verfasst. Eine dänische Anzeige → dänisches Anschreiben. Der Lebenslauf ist immer auf Englisch.

---

### `/upskill` – Ihre Qualifikationslücken und einen Plan zu deren Schließung finden

Vergleicht Ihr Profil mit der Nachfrage und erstellt eine priorisierte Lücken-Heatmap, einen
Lernplan aus **echten, im Web recherchierten** Ressourcen sowie eine abhängigkeitsbewusste Lernreihenfolge
– und speichert alles als Bericht, den das Dashboard Ihnen anzeigen kann.

**Zwei Modi:**

| Syntax | Modus | Was analysiert wird |
|--------|------|------------------|
| `/upskill` | Aggregiert | Jeder Job in Ihrem Tracker, gewichtet, sodass die Positionen, zu denen Sie *am wenigsten* passen, am stärksten zählen |
| `/upskill <url>` | Gezielt | Eine Anzeige (fügen Sie den Text ein, falls die URL nicht abgerufen werden kann) |

**Was Sie erhalten:**

| Ausgabe | Speicherort |
|--------|---------|
| Lücken-Heatmap (Kritisch / Hoch / Mittel / Niedrig) | Im Gespräch |
| Lernplan – 2–3 Ressourcen pro Lücke, mit Lernrichtung + Zeitschätzung | Im Bericht |
| Lernreihenfolge mit Gesamtzeit | Im Bericht |
| Gespeicherter Bericht (mit Delta seit dem letzten Lauf im aggregierten Modus) | `upskill/report-*.md` |

Berichte erscheinen im Tab **Weiterbildung** des Dashboards. Nichts wird erfunden – jede
Ressource stammt aus einer Live-Websuche, und ein leerer Tracker erhält einen ehrlichen Hinweis auf den
gezielten Modus statt eines leeren Berichts.

---

### `/expand` – Ihr Profil aus allem ausbauen, was Sie bereits getan haben

Findet Kompetenzen, die Sie haben, aber nicht aufgeschrieben haben – aus Ihren Dokumenten, Ihren öffentlichen
**GitHub**-Repos und dem Web – und **fügt** sie Ihrem Profil hinzu. Es bearbeitet oder
entfernt nie das, was bereits vorhanden ist.

**Wie es funktioniert:**

1. **Scannt** `documents/`, Ihre GitHub-Repositories (READMEs, Sprachen, Themen) und
   andere Profillinks (Portfolio, Kaggle, Scholar).
2. **Reichert** jeden Fund per Websuche an – sowohl eine direkte Suche (Kurslehrpläne,
   Skill-Listen von Zertifizierungen, Tool-Dokumentationen) als auch Rückschlüsse auf die Methoden und Toolchains,
   die die Arbeit nahelegt.
3. **Zeigt Ihnen eine Kompetenzkarte**, gruppiert nach Kategorie, jedes Element auf seine Quelle zurückgeführt und
   als direkt / abgeleitet markiert – zur Prüfung *bevor* etwas geschrieben wird.
4. **Fügt nur hinzu, was Sie genehmigen**, jeweils mit einem Quellenhinweis wie *(Coursera – Deep
   Learning Specialisation)*. Diese Hinweise machen erneute Läufe idempotent, und abgeleitete
   Verhaltensmerkmale sind klar gekennzeichnet.

**Beispiel-Eingaben:**

```
/expand
```
```
/expand github
```
> _(Priorisiert Ihre GitHub-Repositories als die zu durchsuchende Quelle.)_

Da jede Ergänzung additiv und quellenannotiert ist, können Sie `/expand` nach einem neuen Kurs
oder Projekt erneut ausführen, und es bringt nur das herein, was wirklich neu ist.

---

### `/reset` – Sicher von vorn beginnen

Löscht Ihre persönlichen Daten, damit Sie neu anfangen können – eine neue Karriererichtung, ein frisches
Profil oder die Übergabe des Repos an jemand anderen – **ohne** das Framework anzutasten, das
CareerForge zum Laufen bringt.

**Geltungsbereiche:**

| Syntax | Löscht |
|--------|--------|
| `/reset profile` | Ihre Profil-Skill-Dateien (zurück zu leeren Vorlagen) |
| `/reset documents` | Ihre Dateien in `documents/` (Ordnerstruktur + README bleiben erhalten) |
| `/reset all` | Beides |

Es **zeigt Ihnen immer zuerst eine Inventarübersicht** (was gelöscht wird vs. was erhalten bleibt),
und **nichts passiert, bis Sie `RESET`** in Großbuchstaben eingeben – jede andere Antwort bricht ab. Der
Schreibstil-Leitfaden, das Bewertungs-Framework, die Anschreiben-Vorlagen und das Interview-Vorbereitungs-Framework
werden nie angetastet; nur Ihre Daten. Es gibt kein Rückgängig, daher verweist es Sie auf Ihre
Git-Historie als einzige Wiederherstellung und schlägt dann vor, `/setup` zum Neuaufbau auszuführen.

---

## Das Tracking-Dashboard

Eine rein lokale Web-Benutzeroberfläche, die **Ihre `job_search_tracker.csv` als einzige Quelle der Wahrheit liest und atomar schreibt**, Ihre Pipeline visualisiert und die CLI (`/apply`, `/upskill`, Gehaltssuchen) aus dem Browser steuern kann. Es ist ein optionaler Begleiter – ein Löschen lässt Ihre Daten und die `/apply`-Pipeline unberührt.

> **Ohne Installation ausprobieren →** [**Live-Demo**](https://suraj-davariya.github.io/ai-job-search/dashboard/) – eine schreibgeschützte Tour mit fiktiven Beispieldaten. Bearbeiten, die Konsole und PDF-Vorschauen sind dort deaktiviert (sie benötigen die lokal laufende App); alles andere ist die echte Benutzeroberfläche.

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| Bereich | Was er tut |
|---------|--------------|
| **Bewerbungen** | Tracker sortieren/filtern/durchsuchen; Inline-Bearbeitung von Status + Notizen (atomar, durch Statusautomat geschützt); `+ Neu`; Detail-Drawer mit geschützter PDF-Vorschau |
| **Übersicht** | KPI-Karten (gesamt, beworben 7T/30T, Ø Passung, Gesprächsquote) + Diagramme zu Woche/Status/Passung/Kalender – ehrliches `—`, wenn eine Mindestmenge an Daten nicht erreicht wird |
| **Konsole** | Zugelassene Befehle ausführen und ihre Ausgabe live streamen; je Unternehmen `/apply`, `/upskill` und Gehaltssuchen erneut ausführen |
| **Unternehmen · Gehalt · Weiterbildung · Profil · Einstellungen** | Gruppierte/Benchmark-/Bericht-/Profilansichten; Design- + Schreibschutz-Präferenzen |

**Lokal konzipiert:** bindet nur an `127.0.0.1` (kein LAN, keine Authentifizierung, keine Konten), tätigt keine ausgehenden Netzwerkaufrufe, führt Befehle über eine feste Zulassungsliste ohne Shell aus und speichert keine Geheimnisse. Ein `--read-only`-Modus deaktiviert jede Bearbeitung und Aktion. Siehe [`dashboard/README.md`](dashboard/README.md) und [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md).

> Erfordert Node 18+. Die Aktionsschicht (Ausführen von Befehlen aus dem Browser) benötigt die Binärdateien `claude` und/oder `python3` im `PATH`; fehlen sie, werden diese Auslöser deaktiviert, und der Rest funktioniert weiter.

---

> **Alle geplanten Befehle wurden ausgeliefert.** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand` und `/reset` sind alle live (v1.0–v1.2). Siehe die [Roadmap](#roadmap) für das, was als
> Nächstes kommt.

---

## Beispielsitzung

Hier ist eine realistische End-to-End-Durchgang.

**1. Erstmalige Einrichtung**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. Jobsuche**

```
you:   /search
claude: Searching your configured portals for the last 14 days…
        Found 9 new positions (3 high, 4 medium, 2 low match)

         #  Fit     Title                Company      Location
         1  High    ML Engineer          Acme Corp    Amsterdam
         2  High    Data Scientist       BetaTech     Remote (EU)
         3  Medium  Analytics Engineer   Gamma GmbH   Berlin
        …
        Want me to evaluate any of these? Just give me the number(s).

you:   1
```

**3. Bewerben**

```
claude: Running full pipeline for Acme Corp — ML Engineer.

        Fit Evaluation
        ──────────────────────────────────────────────
        Technical Skills Match    92/100  Strong
        Career Alignment          85/100  Strong
        Experience Match          78/100  Good
        Behavioural Fit           80/100  Strong
        Location & Logistics      Pass
        ──────────────────────────────────────────────
        Weighted Total            84 — Strong Fit ✓

        Proceed with drafting?

you:   Yes

claude: Drafting CV and cover letter…
        Spawning reviewer agent…
        Applying reviewer edits…
        Compiling cv/main_acme_corp.tex → main_acme_corp.pdf ✓ (2 pages)
        Compiling cover_letters/cover_acme_corp_ml_engineer.tex → …pdf ✓ (1 page)
        Verification checklist: all 15 items passed.

        Files ready for review:
          • cv/main_acme_corp.pdf
          • cover_letters/cover_acme_corp_ml_engineer.pdf
```

---

## Datenschutz

| Daten | Wo sie liegen | In Git eingecheckt? |
|------|----------------|-------------------|
| Kandidatenprofil | `.claude/skills/job-application-assistant/` | Nein |
| Generierte Lebensläufe & Anschreiben | `cv/output/`, `cover_letters/output/` | Nein |
| Bewerbungs-Tracker | `job_search_tracker.csv` | Nein |
| Register gesehener Jobs | `job_scraper/seen_jobs.json` | Nein |
| Quelldokumente | `documents/` | Nein |
| Gehaltsdaten | `salary_data.json` | Nein |

Die `.gitignore` erzwingt alle diese Ausschlüsse. Wenn Sie Ihren Fork zu GitHub pushen, **verwenden Sie ein privates Repository**, damit Ihre Profildateien niemals offengelegt werden.

---

## Verzeichnisstruktur

```
ai-job-search/
│
├── .claude/
│   ├── commands/              # Slash commands you type in Claude Code
│   │   ├── setup.md           # /setup  — build your profile
│   │   ├── apply.md           # /apply  — full application pipeline
│   │   ├── search.md          # /search — discover new job postings
│   │   ├── upskill.md         # /upskill — skill-gap analysis + learning plan
│   │   ├── expand.md          # /expand — competency expansion (additive)
│   │   └── reset.md           # /reset  — clear data, preserve framework
│   │
│   └── skills/
│       ├── job-application-assistant/   # AI knowledge for CV/CL/interview work
│       │   ├── 01-candidate-profile.md  # Your identity, experience, skills
│       │   ├── 02-behavioral-profile.md # Working style, culture fit
│       │   ├── 03-writing-style.md      # Rules: no em-dashes, no buzzwords…
│       │   ├── 04-job-evaluation.md     # 5-dimension scoring framework
│       │   ├── 05-cv-templates.md       # LaTeX CV guide + tailoring rules
│       │   ├── 06-cover-letter-templates.md
│       │   └── 07-interview-prep.md     # STAR stories + practice questions
│       │
│       ├── job-scraper/
│       │   ├── SKILL.md                 # Job-search workflow (REQ-1001–1012)
│       │   └── search-queries.md        # Your portals, queries, location tiers
│       │
│       └── career-development/
│           └── SKILL.md                 # Skill-gap analysis (REQ-3001–3011)
│
├── cv/
│   ├── cfcv.cls               # Custom LaTeX CV class (compile with lualatex)
│   └── main_example.tex       # CV template — copy per application
│
├── cover_letters/
│   ├── cfcl.cls               # Custom LaTeX cover letter class (xelatex)
│   ├── main_example.tex       # Cover letter template
│   └── OpenFonts/fonts/       # Bundled Lato, Raleway, FontAwesome 6 Free TTFs
│
├── documents/                 # Drop your source docs here (gitignored)
│   ├── cv/                    # Existing CVs (PDF or DOCX)
│   ├── linkedin/              # LinkedIn data export
│   ├── diplomas/
│   ├── references/
│   └── applications/
│
├── dashboard/                 # Local tracking dashboard (Next.js, loopback-only)
│   ├── app/                   #   App Router pages + API routes
│   ├── lib/                   #   pure core: parsers, atomic writer, allowlist…
│   ├── components/            #   applications · dashboard · console · views
│   ├── README.md              #   how to launch + security/privacy model
│   └── ARCHITECTURE.md        #   layers, file contracts, perf baseline
│
├── docs-site/                 # Documentation website (newcomer-first guide)
├── upskill/                   # Upskill reports (report-*.md)
│
├── tools/
│   └── convert_salary_excel.py   # Excel → salary_data.json (Epic 7, stub)
│
├── salary_lookup.py           # Salary benchmarking CLI (used by the dashboard)
├── job_search_tracker.csv     # 14-column application log (gitignored)
└── job_scraper/               # Deduplication state (gitignored)
```

---

## Vorlagen manuell kompilieren

Wenn Sie die LaTeX-Vorlagen unabhängig testen möchten:

**Lebenslauf** (aus dem Verzeichnis `cv/` ausführen):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**Anschreiben** (aus `cover_letters/` ausführen – das Arbeitsverzeichnis ist für das Laden der Schriftarten wichtig):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Roadmap

| Meilenstein | Status | Was ausgeliefert wird |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ Abgeschlossen | `/setup`, `/apply` (ohne Prüfer), PDF-Kompilierung |
| **v1.0** (Epics 6–8) | ✅ Abgeschlossen | Prüfer-Agent, `/search`, Bewerbungs-Tracker |
| **v1.0 — Dashboard** (Epic 9) | ✅ Abgeschlossen | Lokales Tracking-Dashboard unter `127.0.0.1:4480` — Tracker ansehen/bearbeiten, Analysen, Befehle aus dem Browser ausführen |
| **v1.1** (Epics 10–11) | ✅ Abgeschlossen | `/upskill` Qualifikationslücken-Analyse + Lernplan und `/expand` Kompetenzausbau aus Ihren Dokumenten, GitHub und dem Web |
| **v1.2** (Epic 12) | ✅ Abgeschlossen | `/reset`, Interview-Vorbereitungs-Framework, ADR-0004 Portal-Adapter-Muster + Beispiel, Recherche-Agent |
| **v2.0** | 💡 Zukunft | Vorlagen-Marktplatz, Community-Portal-Adapter, GUI |

Siehe den vollständigen Plan in [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md).

---

## Dokumentation

**Starten Sie hier →** [`docs-site/`](docs-site/) – die Dokumentations-**Website**: eine einsteigerfreundliche Anleitung zum gesamten Produkt (Schnellstart, alle drei Befehle, das Dashboard mit Live-Demos, Ihre Daten, Datenschutz, FAQ, Glossar). Führen Sie sie lokal mit `npm run dev` in `docs-site/` aus oder bauen Sie sie statisch mit `npm run build`.

Technische Dokumentation (Spezifikationen, Architektur, Pläne):

| Pfad | Inhalt |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | Vollständige funktionale Anforderungen (`REQ-####`-IDs) |
| [`docs/architecture/`](docs/architecture/) | Technologie-Stack, Komponentendesign, ADRs |
| [`docs/plan/`](docs/plan/) | Meilensteine, Epics, Arbeitsaufschlüsselung |
| [`docs/development/`](docs/development/) | Coding-Standards, Projektstruktur, Beitragsleitfaden |
| [`docs/testing/`](docs/testing/) | Teststrategie, Testfälle (`TC-####`-IDs) |
| [`docs/glossary.md`](docs/glossary.md) | Kanonische Begriffe |

---

## Mitwirken

Beiträge sind willkommen – neue CV-/Anschreiben-Vorlagen, Locale-Pakete, Portal-Adapter, Fehlerbehebungen und Dokumentationsverbesserungen helfen alle.

> ⚠️ **Verwenden Sie einen privaten Fork.** Ihr Kandidatenprofil liegt im selben Verzeichnis wie der Quellcode. Arbeiten Sie immer in einem privaten GitHub-Repository, um Ihre persönlichen Daten aus dem öffentlichen Internet herauszuhalten.

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für den vollständigen Leitfaden, Branch-Benennung, PR-Checkliste und wie man ein neues Jobportal oder eine Locale hinzufügt.

---

## Lizenz

MIT – siehe [LICENSE](LICENSE). ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
