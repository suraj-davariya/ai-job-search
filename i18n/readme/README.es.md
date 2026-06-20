*Esta es una traducción comunitaria y asistida por máquina (beta). El [README en inglés](../../README.md) es la versión canónica; ante cualquier discrepancia, prevalece el inglés.*

<div align="center">

# CareerForge

**Un asistente de búsqueda de empleo con IA que encuentra ofertas, redacta CV y cartas de presentación adaptados, y los compila en PDF listos para imprimir — todo en tu propia máquina.**

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

> **¿Nuevo por aquí? Empieza con la guía.** La forma más sencilla de entender CareerForge es el sitio de documentación — Inicio rápido, los tres comandos, el panel con demostraciones en vivo, privacidad y preguntas frecuentes. No hace falta saber programar para leerlo.
>
> - 🌐 **Léelo ahora:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — alojado, nada que instalar.
> - 📊 **Recorre el panel:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — la interfaz real con datos de ejemplo ficticios, de solo lectura.
> - 💻 **¿Prefieres local?** Ejecuta `npm run dev` dentro de [`docs-site/`](docs-site/) (o consulta [su README](docs-site/README.md) para la compilación estática con un solo comando).

## ¿Qué es esto?

CareerForge es un conjunto de herramientas de búsqueda de empleo que ejecutas dentro de **Claude Code** — un asistente de IA que vive en tu terminal. Tú escribes comandos e indicaciones en lenguaje natural; la IA hace el trabajo. No se requieren conocimientos de programación.

Esto es lo que puede hacer por ti hoy:

| Paso | Tú dices | Qué ocurre |
|------|---------|-------------|
| **1. Construye tu perfil** | `/setup` | Claude lee tu CV existente, tu exportación de LinkedIn, tus diplomas, o te entrevista — y luego redacta tu perfil de candidatura |
| **2. Encuentra nuevos empleos** | `/search` | Claude busca en tus portales de empleo configurados, descarta duplicados frente a los empleos que ya has visto, puntúa el ajuste de cada uno y te muestra una tabla ordenada |
| **3. Postúlate** | `/apply <url o pega>` | Claude puntúa tu ajuste, adapta tu CV, redacta una carta de presentación en el idioma de la oferta, hace que un segundo revisor de IA critique ambos, aplica las ediciones, compila dos PDF y ejecuta una lista de verificación final |

> **Tus datos nunca salen de tu máquina.** Tu perfil, tus CV, tus cartas de presentación y tu registro de candidaturas se almacenan todos localmente y nunca se suben a git.

---

## Cómo funciona — la versión de 3 minutos

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

**Lo que CareerForge no hace:**
- Enviar candidaturas en tu nombre (tú revisas y envías)
- Inventar competencias o experiencia que no tienes
- Subir nada a la nube

---

## Qué necesitas

### 1. Claude Code

Claude Code es el asistente de IA que ejecuta CareerForge. Instálalo una vez:

```bash
npm install -g @anthropic-ai/claude-code
```

Luego inicia sesión:

```bash
claude
```

Claude Code requiere una [cuenta de Anthropic](https://claude.ai). Los planes Free y Pro funcionan ambos; se recomienda Pro para un uso intensivo.

> **¿No sabes qué es Claude Code?** Piénsalo como un asistente de terminal inteligente que puede leer archivos, buscar en la web y ejecutar comandos — guiado por las instrucciones de CareerForge.

### 2. LaTeX (para la generación de PDF)

CareerForge compila tu CV y tu carta de presentación a PDF usando LaTeX. Se necesitan dos compiladores:

| Compilador | Usado para | Por qué |
|----------|----------|-----|
| `lualatex` | CV | Requerido por los paquetes `fontawesome` y `lato` |
| `xelatex` | Carta de presentación | Requerido por `fontspec` para las fuentes incluidas |

**macOS** (recomendado — instala ambos compiladores):
```bash
brew install --cask mactex
```
O descárgalo desde [tug.org/mactex](https://www.tug.org/mactex/).

Después de instalar, añade los paquetes adicionales del CV:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** Instala [MiKTeX](https://miktex.org/download) — descarga los paquetes que falten automáticamente.

### 3. Python 3.10+ _(opcional — para referencias salariales)_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## Inicio rápido

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

## Comandos en detalle

### `/setup` — Construye tu perfil de candidatura

Rellena siete archivos de perfil a partir de tus datos reales. Claude hace preguntas o lee tus documentos — sin escribir nada si tienes archivos.

**Tres vías de incorporación:**

| Vía | Cuándo usarla |
|------|-------------|
| **A — Escanear documentos** | Tienes CV, una exportación de LinkedIn, diplomas o cartas de referencia en la carpeta `documents/` |
| **B — Importar un CV** | Tienes un único CV limpio y quieres un comienzo rápido |
| **C — Entrevista en vivo** | Empiezas desde cero; Claude te entrevista |

**Indicaciones de ejemplo:**

```
/setup
```
```
/setup --section search
```
> _(Pasa directamente a actualizar tus portales de empleo objetivo y tus preferencias de ubicación sin volver a ejecutar toda la entrevista.)_

```
/setup --section experience
```
> _(Actualiza solo tu historial laboral — útil tras un cambio de empleo.)_

**Qué se construye:**

| Archivo | Contenido |
|------|---------|
| `01-candidate-profile.md` | Identidad, formación, historial laboral, competencias, proyectos |
| `02-behavioral-profile.md` | Estilo de trabajo, preferencias culturales, motivaciones |
| `03-writing-style.md` | _(marco estático — sin datos personales)_ |
| `04-job-evaluation.md` | Tus áreas fuertes/débiles, objetivos profesionales |
| `05-cv-templates.md` | Declaraciones de perfil por tipo de puesto |
| `06-cover-letter-templates.md` | _(plantillas estáticas)_ |
| `07-interview-prep.md` | Historias STAR a partir de tu experiencia |
| `search-queries.md` | Tus portales de empleo objetivo, consultas, niveles de ubicación |

---

### `/search` — Encuentra nuevas ofertas de empleo

Busca en tus portales de empleo configurados mediante búsqueda web, descarta duplicados frente a los empleos que ya has visto, asigna una señal de ajuste (Alto / Medio / Bajo) y presenta una tabla ordenada. Cuando eliges un número, el empleo se entrega directamente a `/apply`.

**Argumentos:**

| Sintaxis | Comportamiento |
|--------|-----------|
| `/search` | Ejecuta tus 3 categorías de consulta prioritarias |
| `/search data science` | Prioriza las categorías que coinciden con "data science" |
| `/search broad` | Ejecuta todas las categorías de consulta configuradas |

**Indicaciones de ejemplo:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**Salida de ejemplo:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **Todos los portales provienen de tu configuración.** Nada está codificado de forma fija — añade cualquier portal de empleo (LinkedIn, Indeed, Jobindex, Stepstone, etc.) a `search-queries.md` y se incluye automáticamente.

---

### `/apply` — Produce un CV y una carta de presentación adaptados

Toma una URL de empleo o una descripción pegada y ejecuta toda la canalización de candidatura:

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**Argumentos:**

| Argumento | Comportamiento |
|----------|-----------|
| _(por defecto)_ | Canalización completa con revisor (`--review=full`) |
| `--review=quick` | El revisor omite la investigación de la empresa — más rápido, menor coste |
| `--review=none` | Omite el revisor por completo — el más rápido, el de menor coste |

**Indicaciones de ejemplo:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

O pega la descripción del empleo directamente:

```
/apply
[paste job description here]
```

**Lo que obtienes:**

| Salida | Ubicación |
|--------|---------|
| CV (PDF, 2 páginas, en inglés) | `cv/main_<company>.pdf` |
| Carta de presentación (PDF, 1 página, idioma de la oferta) | `cover_letters/cover_<company>_<role>.pdf` |
| Fila de candidatura | `job_search_tracker.csv` |
| Evaluación de ajuste | En la conversación |

**Puntuación de ajuste (5 dimensiones):**

| Dimensión | Peso |
|-----------|--------|
| Coincidencia de competencias técnicas | 30% |
| Alineación profesional | 30% |
| Coincidencia de experiencia | 25% |
| Ajuste conductual / cultural | 15% |
| Ubicación y logística | Apto / No apto |

Veredicto: **Fuerte** (75+) · **Bueno** (60–74) · **Moderado** (45–59) · **Débil** (30–44) · **Pobre** (<30)

> **Regla de idioma:** la carta de presentación siempre se escribe en el idioma de la oferta de empleo. Una oferta en danés → carta de presentación en danés. El CV siempre está en inglés.

---

### `/upskill` — Encuentra tus carencias de competencias y un plan para cerrarlas

Compara tu perfil con la demanda y produce un mapa de calor de carencias priorizado, un
plan de aprendizaje construido a partir de recursos **reales, buscados en la web**, y un orden de estudio
consciente de las dependencias — y luego lo guarda todo como un informe que el panel puede mostrarte.

**Dos modos:**

| Sintaxis | Modo | Qué analiza |
|--------|------|------------------|
| `/upskill` | Agregado | Cada empleo de tu registro, ponderado de modo que los puestos que *menos* te encajan cuenten más |
| `/upskill <url>` | Dirigido | Una sola oferta (pega el texto si la URL no se puede obtener) |

**Lo que obtienes:**

| Salida | Ubicación |
|--------|---------|
| Mapa de calor de carencias (Crítica / Alta / Media / Baja) | En la conversación |
| Plan de aprendizaje — 2–3 recursos por carencia, con dirección de estudio + estimación de tiempo | En el informe |
| Orden de estudio con tiempo total | En el informe |
| Informe guardado (con la diferencia desde la última ejecución en modo agregado) | `upskill/report-*.md` |

Los informes aparecen en la pestaña **Mejora de competencias** del panel. Nada se inventa — cada
recurso proviene de una búsqueda web en vivo, y un registro vacío recibe un empujón honesto hacia
el modo dirigido en lugar de un informe vacío.

---

### `/expand` — Haz crecer tu perfil a partir de todo lo que ya has hecho

Encuentra competencias que tienes pero no has anotado — a partir de tus documentos, tus repositorios
públicos de **GitHub** y la web — y las **añade** a tu perfil. Nunca edita ni
elimina lo que ya está ahí.

**Cómo funciona:**

1. **Escanea** `documents/`, tus repositorios de GitHub (README, lenguajes, temas) y
   otros enlaces de perfil (portafolio, Kaggle, Scholar).
2. **Enriquece** cada hallazgo mediante búsqueda web — tanto una consulta directa (temarios de cursos,
   listas de competencias de certificaciones, documentación de herramientas) como inferencias sobre los métodos y las cadenas de herramientas
   que el trabajo implica.
3. **Te muestra un mapa de competencias** agrupado por categoría, cada elemento rastreado hasta su fuente y
   marcado como directo / inferido — para tu revisión *antes* de que se escriba nada.
4. **Añade solo lo que apruebas**, cada elemento con una nota de fuente como *(Coursera — Deep
   Learning Specialisation)*. Esas notas hacen que las reejecuciones sean idempotentes, y los rasgos
   conductuales inferidos se etiquetan con claridad.

**Indicaciones de ejemplo:**

```
/expand
```
```
/expand github
```
> _(Prioriza tus repositorios de GitHub como fuente a explotar.)_

Como cada adición es aditiva y está anotada con su fuente, puedes volver a ejecutar `/expand`
tras un nuevo curso o proyecto y solo incorporará lo que sea genuinamente nuevo.

---

### `/reset` — Vuelve a empezar, de forma segura

Borra tus datos personales para que puedas empezar de nuevo — una nueva dirección profesional, un perfil
nuevo, o pasar el repositorio a otra persona — **sin** tocar el marco que
hace funcionar a CareerForge.

**Alcances:**

| Sintaxis | Borra |
|--------|--------|
| `/reset profile` | Tus archivos de competencias del perfil (de vuelta a plantillas en blanco) |
| `/reset documents` | Tus archivos en `documents/` (se conservan la estructura de carpetas + README) |
| `/reset all` | Ambos |

Siempre **te muestra primero un inventario** (qué se borrará frente a qué se conserva),
y **no ocurre nada hasta que escribas `RESET`** en mayúsculas — cualquier otra respuesta cancela. La
guía de estilo de escritura, el marco de puntuación, las plantillas de cartas de presentación y el marco de preparación de entrevistas nunca se tocan; solo tus datos. No hay deshacer, así que te señala tu
historial de git como única recuperación, y luego sugiere ejecutar `/setup` para reconstruir.

---

## El panel de seguimiento

Una interfaz web solo local que **lee y escribe atómicamente tu `job_search_tracker.csv` como única fuente de verdad**, visualiza tu flujo y puede impulsar la CLI (`/apply`, `/upskill`, consultas salariales) desde el navegador. Es un complemento opcional — eliminarlo deja intactos tus datos y la canalización de `/apply`.

> **Pruébalo sin instalar →** [**Demostración en vivo**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — un recorrido de solo lectura con datos de ejemplo ficticios. La edición, la Consola y las vistas previas en PDF están desactivadas allí (requieren la app ejecutándose localmente); todo lo demás es la interfaz real.

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| Superficie | Qué hace |
|---------|--------------|
| **Candidaturas** | Ordena/filtra/busca en el registro; ediciones de estado + notas en línea (atómicas, protegidas por máquina de estados); `+ Nueva`; cajón de detalle con vista previa de PDF protegida |
| **Resumen** | Tarjetas de KPI (total, enviadas 7d/30d, ajuste medio, tasa de entrevistas) + gráficos semanales/de estado/de ajuste/de calendario — un honesto `—` cuando no se alcanza un umbral mínimo de muestra |
| **Consola** | Ejecuta comandos permitidos y transmite su salida en directo; reejecución por empresa de `/apply`, `/upskill` y consultas salariales |
| **Empresas · Salario · Mejora de competencias · Perfil · Ajustes** | Vistas agrupadas/de referencia/de informe/de perfil; preferencias de tema + solo lectura |

**Local por diseño:** se vincula únicamente a `127.0.0.1` (sin LAN, sin autenticación, sin cuentas), no realiza llamadas de red salientes, ejecuta comandos mediante una lista de permitidos fija sin shell, y no almacena secretos. Un modo `--read-only` desactiva toda edición y acción. Consulta [`dashboard/README.md`](dashboard/README.md) y [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md).

> Requiere Node 18+. La capa de acciones (ejecutar comandos desde el navegador) necesita los binarios `claude` y/o `python3` en el `PATH`; cuando faltan, esos disparadores se desactivan y el resto sigue funcionando.

---

> **Todos los comandos planificados ya están disponibles.** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand` y `/reset` están todos activos (v1.0–v1.2). Consulta la [Hoja de ruta](#hoja-de-ruta) para ver lo que
> viene a continuación.

---

## Sesión de ejemplo

Este es un recorrido realista de principio a fin.

**1. Configuración por primera vez**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. Búsqueda de empleos**

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

**3. Postulación**

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

## Privacidad

| Dato | Dónde reside | ¿Subido a git? |
|------|----------------|-------------------|
| Perfil de candidatura | `.claude/skills/job-application-assistant/` | No |
| CV y cartas de presentación generados | `cv/output/`, `cover_letters/output/` | No |
| Registro de candidaturas | `job_search_tracker.csv` | No |
| Registro de empleos vistos | `job_scraper/seen_jobs.json` | No |
| Documentos de origen | `documents/` | No |
| Datos salariales | `salary_data.json` | No |

El archivo `.gitignore` impone todas estas exclusiones. Si subes tu fork a GitHub, **usa un repositorio privado** para que tus archivos de perfil nunca queden expuestos.

---

## Estructura de directorios

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

## Compilar las plantillas manualmente

Si quieres probar las plantillas de LaTeX de forma independiente:

**CV** (ejecuta desde el directorio `cv/`):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**Carta de presentación** (ejecuta desde `cover_letters/` — el directorio de trabajo importa para la carga de fuentes):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Hoja de ruta

| Hito | Estado | Qué incluye |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ Completo | `/setup`, `/apply` (sin revisor), compilación de PDF |
| **v1.0** (Epics 6–8) | ✅ Completo | Agente revisor, `/search`, registro de candidaturas |
| **v1.0 — Panel** (Epic 9) | ✅ Completo | Panel de seguimiento local en `127.0.0.1:4480` — ver/editar el registro, analíticas, ejecutar comandos desde el navegador |
| **v1.1** (Epics 10–11) | ✅ Completo | Análisis de carencias de competencias + plan de aprendizaje con `/upskill`, y expansión de competencias con `/expand` a partir de tus documentos, GitHub y la web |
| **v1.2** (Epic 12) | ✅ Completo | `/reset`, marco de preparación de entrevistas, patrón de adaptador de portal ADR-0004 + ejemplo, agente de investigación |
| **v2.0** | 💡 Futuro | Mercado de plantillas, adaptadores de portal comunitarios, interfaz gráfica |

Consulta el plan completo en [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md).

---

## Documentación

**Empieza aquí →** [`docs-site/`](docs-site/) — el **sitio web** de documentación: una guía orientada a recién llegados sobre todo el producto (Inicio rápido, los tres comandos, el panel con demostraciones en vivo, tus datos, privacidad, preguntas frecuentes, glosario). Ejecútalo localmente con `npm run dev` dentro de `docs-site/`, o compílalo de forma estática con `npm run build`.

Documentación de ingeniería (especificaciones, arquitectura, planes):

| Ruta | Contenido |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | Requisitos funcionales completos (IDs `REQ-####`) |
| [`docs/architecture/`](docs/architecture/) | Pila tecnológica, diseño de componentes, ADR |
| [`docs/plan/`](docs/plan/) | Hitos, epics, desglose del trabajo |
| [`docs/development/`](docs/development/) | Estándares de código, estructura del proyecto, guía de contribución |
| [`docs/testing/`](docs/testing/) | Estrategia de pruebas, casos de prueba (IDs `TC-####`) |
| [`docs/glossary.md`](docs/glossary.md) | Términos canónicos |

---

## Contribuir

Las contribuciones son bienvenidas — nuevas plantillas de CV/carta de presentación, paquetes de idioma, adaptadores de portal, correcciones de errores y mejoras de la documentación, todo ayuda.

> ⚠️ **Usa un fork privado.** Tu perfil de candidatura vive en el mismo directorio que el código fuente. Trabaja siempre en un repositorio privado de GitHub para mantener tus datos personales fuera de la internet pública.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para la guía completa, la nomenclatura de ramas, la lista de verificación de PR y cómo añadir un nuevo portal de empleo o idioma.

---

## Licencia

MIT — consulta [LICENSE](LICENSE). ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
