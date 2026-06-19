<div align="center">

# CareerForge

**Un assistant de recherche d'emploi piloté par l'IA qui trouve des offres, rédige des CV et des lettres de motivation sur mesure, puis les compile en PDF prêts à imprimer — le tout sur votre propre machine.**

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

> _Ceci est une traduction communautaire assistée par machine (bêta). En cas de divergence, le [README en anglais](../../README.md) fait foi._

---

> **Nouveau ici ? Commencez par le guide.** La manière la plus accessible de comprendre CareerForge est le site de documentation — Démarrage rapide, toutes les commandes, le tableau de bord avec ses démos en direct, la confidentialité et la FAQ. Aucune connaissance en programmation n'est nécessaire pour le lire.
>
> - 🌐 **Lisez-le maintenant :** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — hébergé, rien à installer.
> - 📊 **Parcourez le tableau de bord :** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — la véritable interface sur des données d'exemple fictives, en lecture seule.
> - 💻 **Vous préférez le local ?** Lancez `npm run dev` dans [`docs-site/`](docs-site/) (ou consultez [son README](docs-site/README.md) pour le build statique en une commande).

## Qu'est-ce que c'est ?

CareerForge est une boîte à outils de recherche d'emploi que vous exécutez dans **Claude Code** — un assistant IA qui vit dans votre terminal. Vous tapez des commandes et des invites en langage courant ; l'IA fait le travail. Aucune connaissance en programmation requise.

Voici ce qu'il peut faire pour vous aujourd'hui :

| Étape | Ce que vous dites | Ce qui se passe |
|------|---------|-------------|
| **1. Constituer votre profil** | `/setup` | Claude lit votre CV existant, votre export LinkedIn, vos diplômes, ou vous interviewe — puis rédige votre profil de candidat |
| **2. Trouver de nouvelles offres** | `/search` | Claude recherche sur les portails d'emploi que vous avez configurés, dédoublonne par rapport aux offres déjà vues, évalue l'adéquation de chacune et vous présente un tableau classé |
| **3. Postuler** | `/apply <url ou texte collé>` | Claude évalue votre adéquation, adapte votre CV, rédige une lettre de motivation dans la langue de l'offre, fait critiquer les deux par un second relecteur IA, applique les modifications, compile deux PDF et exécute une liste de vérification finale |

> **Vos données ne quittent jamais votre machine.** Votre profil, vos CV, vos lettres de motivation et votre journal de candidatures sont tous stockés localement et ne sont jamais versionnés dans git.

---

## Comment ça marche — la version en 3 minutes

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

**Ce que CareerForge ne fait pas :**
- Soumettre des candidatures à votre place (vous relisez et envoyez)
- Inventer des compétences ou une expérience que vous n'avez pas
- Téléverser quoi que ce soit dans le cloud

---

## Ce dont vous avez besoin

### 1. Claude Code

Claude Code est l'assistant IA qui exécute CareerForge. Installez-le une fois :

```bash
npm install -g @anthropic-ai/claude-code
```

Puis connectez-vous :

```bash
claude
```

Claude Code requiert un [compte Anthropic](https://claude.ai). Les forfaits Free et Pro fonctionnent tous les deux ; le forfait Pro est recommandé pour un usage intensif.

> **Vous ne savez pas ce qu'est Claude Code ?** Voyez-le comme un assistant de terminal intelligent capable de lire des fichiers, de chercher sur le web et d'exécuter des commandes — guidé par les instructions de CareerForge.

### 2. LaTeX (pour la génération de PDF)

CareerForge compile votre CV et votre lettre de motivation en PDF avec LaTeX. Deux compilateurs sont nécessaires :

| Compilateur | Utilisé pour | Pourquoi |
|----------|----------|-----|
| `lualatex` | CV | Requis par les paquets `fontawesome` et `lato` |
| `xelatex` | Lettre de motivation | Requis par `fontspec` pour les polices intégrées |

**macOS** (recommandé — installe les deux compilateurs) :
```bash
brew install --cask mactex
```
Ou téléchargez depuis [tug.org/mactex](https://www.tug.org/mactex/).

Après l'installation, ajoutez les paquets supplémentaires du CV :
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live) :**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows :** Installez [MiKTeX](https://miktex.org/download) — il récupère automatiquement les paquets manquants.

### 3. Python 3.10+ _(optionnel — pour l'analyse comparative des salaires)_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## Démarrage rapide

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

## Les commandes en détail

### `/setup` — Constituer votre profil de candidat

Remplit sept fichiers de profil à partir de vos données réelles. Claude pose des questions ou lit vos documents — aucune saisie si vous avez des fichiers.

**Trois parcours d'intégration :**

| Parcours | Quand l'utiliser |
|------|-------------|
| **A — Scanner des documents** | Vous avez des CV, un export LinkedIn, des diplômes ou des lettres de recommandation dans le dossier `documents/` |
| **B — Importer un CV** | Vous avez un seul CV bien structuré et voulez démarrer vite |
| **C — Entretien en direct** | Vous partez de zéro ; Claude vous interviewe |

**Exemples d'invites :**

```
/setup
```
```
/setup --section search
```
> _(Passe directement à la mise à jour de vos portails d'emploi cibles et de vos préférences de localisation sans relancer l'entretien complet.)_

```
/setup --section experience
```
> _(Met à jour uniquement votre parcours professionnel — utile après un changement de poste.)_

**Ce qui est construit :**

| Fichier | Contenu |
|------|---------|
| `01-candidate-profile.md` | Identité, formation, parcours professionnel, compétences, projets |
| `02-behavioral-profile.md` | Style de travail, préférences culturelles, motivations |
| `03-writing-style.md` | _(cadre statique — aucune donnée personnelle)_ |
| `04-job-evaluation.md` | Vos points forts/faibles, objectifs de carrière |
| `05-cv-templates.md` | Énoncés de profil par type de poste |
| `06-cover-letter-templates.md` | _(modèles statiques)_ |
| `07-interview-prep.md` | Récits STAR tirés de votre expérience |
| `search-queries.md` | Vos portails d'emploi cibles, requêtes, niveaux de localisation |

---

### `/search` — Trouver de nouvelles offres d'emploi

Recherche sur les portails d'emploi que vous avez configurés via une recherche web, dédoublonne par rapport aux offres déjà vues, attribue un signal d'adéquation (Élevé / Moyen / Faible) et présente un tableau classé. Lorsque vous choisissez un numéro, l'offre est transmise directement à `/apply`.

**Arguments :**

| Syntaxe | Comportement |
|--------|-----------|
| `/search` | Exécute vos 3 catégories de requêtes prioritaires |
| `/search data science` | Priorise les catégories correspondant à « data science » |
| `/search broad` | Exécute toutes les catégories de requêtes configurées |

**Exemples d'invites :**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**Exemple de sortie :**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **Tous les portails proviennent de votre config.** Rien n'est codé en dur — ajoutez n'importe quel site d'emploi (LinkedIn, Indeed, Jobindex, Stepstone, etc.) à `search-queries.md` et il est automatiquement inclus.

---

### `/apply` — Produire un CV et une lettre de motivation sur mesure

Prend une URL d'offre ou une description collée et exécute le pipeline de candidature complet :

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**Arguments :**

| Argument | Comportement |
|----------|-----------|
| _(par défaut)_ | Pipeline complet avec relecteur (`--review=full`) |
| `--review=quick` | Le relecteur ignore la recherche sur l'entreprise — plus rapide, moins coûteux |
| `--review=none` | Ignore complètement le relecteur — le plus rapide, le moins coûteux |

**Exemples d'invites :**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

Ou collez directement la description de l'offre :

```
/apply
[paste job description here]
```

**Ce que vous obtenez :**

| Sortie | Emplacement |
|--------|---------|
| CV (PDF, 2 pages, anglais) | `cv/main_<company>.pdf` |
| Lettre de motivation (PDF, 1 page, langue de l'offre) | `cover_letters/cover_<company>_<role>.pdf` |
| Ligne de candidature | `job_search_tracker.csv` |
| Évaluation d'adéquation | Dans la conversation |

**Évaluation de l'adéquation (5 dimensions) :**

| Dimension | Pondération |
|-----------|--------|
| Adéquation des compétences techniques | 30 % |
| Alignement de carrière | 30 % |
| Adéquation de l'expérience | 25 % |
| Adéquation comportementale / culturelle | 15 % |
| Localisation et logistique | Réussite / Échec |

Verdict : **Forte** (75+) · **Bonne** (60–74) · **Modérée** (45–59) · **Faible** (30–44) · **Insuffisante** (< 30)

> **Règle de langue :** la lettre de motivation est toujours rédigée dans la langue de l'offre. Une offre en danois → une lettre en danois. Le CV est toujours en anglais.

---

### `/upskill` — Identifier vos écarts de compétences et un plan pour les combler

Compare votre profil à la demande et produit une carte de chaleur des écarts hiérarchisée, un
plan d'apprentissage bâti à partir de ressources **réelles, issues d'une recherche web**, et un ordre d'étude
tenant compte des dépendances — puis sauvegarde le tout sous forme de rapport que le tableau de bord peut vous présenter.

**Deux modes :**

| Syntaxe | Mode | Ce qu'il analyse |
|--------|------|------------------|
| `/upskill` | Agrégé | Chaque offre de votre suivi, pondérée pour que les postes qui vous correspondent *le moins* comptent le plus |
| `/upskill <url>` | Ciblé | Une seule offre (collez le texte si l'URL ne se charge pas) |

**Ce que vous obtenez :**

| Sortie | Emplacement |
|--------|---------|
| Carte de chaleur des écarts (Critique / Élevé / Moyen / Faible) | Dans la conversation |
| Plan d'apprentissage — 2 à 3 ressources par écart, avec orientation d'étude + estimation de temps | Dans le rapport |
| Ordre d'étude avec temps total | Dans le rapport |
| Rapport sauvegardé (avec écart depuis la dernière exécution en mode agrégé) | `upskill/report-*.md` |

Les rapports apparaissent dans l'onglet **Montée en compétences** du tableau de bord. Rien n'est inventé — chaque
ressource provient d'une recherche web en direct, et un suivi vide reçoit une suggestion honnête vers le
mode ciblé plutôt qu'un rapport vide.

---

### `/expand` — Enrichir votre profil à partir de tout ce que vous avez déjà fait

Trouve des compétences que vous possédez mais n'avez pas consignées — à partir de vos documents, de vos dépôts
**GitHub** publics et du web — et les **ajoute** à votre profil. Il ne modifie ni ne
supprime jamais ce qui existe déjà.

**Comment ça marche :**

1. **Scanne** `documents/`, vos dépôts GitHub (README, langages, sujets) et
   d'autres liens de profil (portfolio, Kaggle, Scholar).
2. **Enrichit** chaque trouvaille via une recherche web — à la fois une recherche directe (programmes de cours,
   listes de compétences de certifications, documentation d'outils) et une inférence sur les méthodes et chaînes d'outils
   que le travail implique.
3. **Vous montre une carte de compétences** regroupée par catégorie, chaque élément tracé jusqu'à sa source et
   marqué direct / inféré — pour votre relecture *avant* toute écriture.
4. **N'ajoute que ce que vous approuvez**, chacun avec une note de source comme *(Coursera — Deep
   Learning Specialisation)*. Ces notes rendent les ré-exécutions idempotentes, et les traits
   comportementaux inférés sont clairement étiquetés.

**Exemples d'invites :**

```
/expand
```
```
/expand github
```
> _(Priorise vos dépôts GitHub comme source à exploiter.)_

Comme chaque ajout est additif et annoté par sa source, vous pouvez relancer `/expand`
après un nouveau cours ou projet et il n'importe que ce qui est réellement nouveau.

---

### `/reset` — Recommencer, en toute sécurité

Efface vos données personnelles pour que vous puissiez repartir — une nouvelle orientation de carrière, un
profil tout neuf, ou la transmission du dépôt à quelqu'un d'autre — **sans** toucher au cadre qui
fait fonctionner CareerForge.

**Portées :**

| Syntaxe | Efface |
|--------|--------|
| `/reset profile` | Vos fichiers de compétences de profil (retour aux modèles vierges) |
| `/reset documents` | Vos fichiers dans `documents/` (structure du dossier + README conservés) |
| `/reset all` | Les deux |

Il **vous montre toujours un inventaire d'abord** (ce qui sera effacé vs. ce qui est conservé),
et **rien ne se passe tant que vous ne tapez pas `RESET`** en majuscules — toute autre réponse annule. Le
guide de style rédactionnel, le cadre d'évaluation, les modèles de lettres de motivation et le cadre de préparation aux entretiens
ne sont jamais touchés ; seules vos données le sont. Il n'y a pas d'annulation, alors il vous oriente vers votre
historique git comme seule récupération, puis suggère de lancer `/setup` pour reconstruire.

---

## Le tableau de bord de suivi

Une interface web exclusivement locale qui **lit et écrit de manière atomique votre `job_search_tracker.csv` comme unique source de vérité**, visualise votre pipeline et peut piloter la CLI (`/apply`, `/upskill`, recherches de salaire) depuis le navigateur. C'est un compagnon optionnel — le supprimer laisse vos données et le pipeline `/apply` intacts.

> **Essayez-le sans installer →** [**Démo en direct**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — une visite en lecture seule avec des données d'exemple fictives. L'édition, la Console et les aperçus PDF y sont désactivés (ils nécessitent l'application en local) ; tout le reste est la véritable interface.

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| Surface | Ce qu'elle fait |
|---------|--------------|
| **Candidatures** | Trier/filtrer/rechercher dans le suivi ; modifications de statut + notes en ligne (atomiques, protégées par machine à états) ; `+ Nouvelle` ; tiroir de détail avec aperçu PDF protégé |
| **Vue d'ensemble** | Cartes d'indicateurs (total, envoyées 7 j/30 j, adéquation moy., taux d'entretien) + graphiques hebdomadaires/statut/adéquation/calendrier — un honnête `—` lorsqu'un seuil d'échantillon n'est pas atteint |
| **Console** | Exécuter les commandes autorisées et diffuser leur sortie en direct ; relancer `/apply`, `/upskill` et les recherches de salaire par entreprise |
| **Entreprises · Salaire · Montée en compétences · Profil · Paramètres** | Vues groupées/comparées/rapports/profil ; préférences de thème + lecture seule |

**Local par conception :** se lie uniquement à `127.0.0.1` (pas de LAN, pas d'authentification, pas de comptes), n'effectue aucun appel réseau sortant, exécute les commandes via une liste blanche fixe sans shell, et ne stocke aucun secret. Un mode `--read-only` désactive toute modification et action. Voir [`dashboard/README.md`](dashboard/README.md) et [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md).

> Nécessite Node 18+. La couche d'action (exécution de commandes depuis le navigateur) nécessite les binaires `claude` et/ou `python3` dans le `PATH` ; en leur absence, ces déclencheurs sont désactivés et le reste continue de fonctionner.

---

> **Toutes les commandes prévues sont livrées.** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand` et `/reset` sont toutes actives (v1.0–v1.2). Consultez la [Feuille de route](#feuille-de-route) pour la suite.

---

## Exemple de session

Voici un parcours réaliste de bout en bout.

**1. Première configuration**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. Recherche d'offres**

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

**3. Candidature**

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

## Confidentialité

| Donnée | Où elle réside | Versionnée dans git ? |
|------|----------------|-------------------|
| Profil de candidat | `.claude/skills/job-application-assistant/` | Non |
| CV et lettres de motivation générés | `cv/output/`, `cover_letters/output/` | Non |
| Suivi des candidatures | `job_search_tracker.csv` | Non |
| Registre des offres déjà vues | `job_scraper/seen_jobs.json` | Non |
| Documents sources | `documents/` | Non |
| Données salariales | `salary_data.json` | Non |

Le `.gitignore` applique toutes ces exclusions. Si vous poussez votre fork sur GitHub, **utilisez un dépôt privé** afin que vos fichiers de profil ne soient jamais exposés.

---

## Structure des dossiers

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

## Compiler les modèles manuellement

Si vous souhaitez tester les modèles LaTeX de manière indépendante :

**CV** (à exécuter depuis le dossier `cv/`) :
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**Lettre de motivation** (à exécuter depuis `cover_letters/` — le répertoire de travail importe pour le chargement des polices) :
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Feuille de route

| Jalon | Statut | Ce qui est livré |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ Terminé | `/setup`, `/apply` (sans relecteur), compilation PDF |
| **v1.0** (Epics 6–8) | ✅ Terminé | Agent relecteur, `/search`, suivi des candidatures |
| **v1.0 — Tableau de bord** (Epic 9) | ✅ Terminé | Tableau de bord de suivi local sur `127.0.0.1:4480` — voir/modifier le suivi, analyses, exécuter des commandes depuis le navigateur |
| **v1.1** (Epics 10–11) | ✅ Terminé | Analyse d'écarts de compétences `/upskill` + plan d'apprentissage, et expansion de compétences `/expand` à partir de vos docs, GitHub et du web |
| **v1.2** (Epic 12) | ✅ Terminé | `/reset`, cadre de préparation aux entretiens, motif d'adaptateur de portail ADR-0004 + exemple, agent de recherche |
| **v2.0** | 💡 À venir | Place de marché de modèles, adaptateurs de portails communautaires, interface graphique |

Consultez le plan complet dans [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md).

---

## Documentation

**Commencez ici →** [`docs-site/`](docs-site/) — le **site web** de documentation : un guide pensé pour les débutants couvrant l'ensemble du produit (Démarrage rapide, toutes les commandes, le tableau de bord avec ses démos en direct, vos données, la confidentialité, la FAQ, le glossaire). Exécutez-le en local avec `npm run dev` dans `docs-site/`, ou compilez-le en statique avec `npm run build`.

Documentation technique (spécifications, architecture, plans) :

| Chemin | Contenu |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | Exigences fonctionnelles complètes (identifiants `REQ-####`) |
| [`docs/architecture/`](docs/architecture/) | Pile technologique, conception des composants, ADR |
| [`docs/plan/`](docs/plan/) | Jalons, epics, découpage du travail |
| [`docs/development/`](docs/development/) | Standards de codage, structure du projet, guide de contribution |
| [`docs/testing/`](docs/testing/) | Stratégie de test, cas de test (identifiants `TC-####`) |
| [`docs/glossary.md`](docs/glossary.md) | Termes canoniques |

---

## Contribuer

Les contributions sont les bienvenues — nouveaux modèles de CV/lettres de motivation, packs de localisation, adaptateurs de portails, corrections de bugs et améliorations de la documentation, tout aide.

> ⚠️ **Utilisez un fork privé.** Votre profil de candidat se trouve dans le même répertoire que le code source. Travaillez toujours dans un dépôt GitHub privé pour garder vos données personnelles hors de l'internet public.

Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour le guide complet, le nommage des branches, la liste de vérification des PR et comment ajouter un nouveau portail d'emploi ou une localisation.

---

## Licence

MIT — voir [LICENSE](LICENSE). ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
