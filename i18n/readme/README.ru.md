<div align="center">

# CareerForge

**ИИ-помощник для поиска работы, который находит вакансии, пишет адаптированные резюме и сопроводительные письма и компилирует их в готовые к печати PDF — всё на вашем собственном компьютере.**

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

> _Это перевод, сделанный сообществом с помощью машинного перевода (бета). Канонической версией является английский README — при любых расхождениях полагайтесь на него._

---

> **Впервые здесь? Начните с руководства.** Самый удобный способ разобраться в CareerForge — сайт документации: Быстрый старт, все три команды, панель с живыми демо, приватность и FAQ. Чтобы его читать, программирование не требуется.
>
> - 🌐 **Читать прямо сейчас:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — размещено онлайн, ничего не нужно устанавливать.
> - 📊 **Пройдитесь по панели:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — реальный интерфейс на вымышленных примерах данных, только для чтения.
> - 💻 **Предпочитаете локально?** Запустите `npm run dev` внутри [`docs-site/`](docs-site/) (или см. [его README](docs-site/README.md) для статической сборки одной командой).

## Что это такое?

CareerForge — это набор инструментов для поиска работы, который вы запускаете внутри **Claude Code** — ИИ-помощника, живущего в вашем терминале. Вы вводите команды и обычные текстовые запросы; работу выполняет ИИ. Знания программирования не требуются.

Вот что он может сделать для вас уже сегодня:

| Шаг | Вы говорите | Что происходит |
|------|---------|-------------|
| **1. Создать профиль** | `/setup` | Claude читает ваше существующее резюме, экспорт из LinkedIn, дипломы или проводит интервью — затем пишет ваш профиль кандидата |
| **2. Найти новые вакансии** | `/search` | Claude ищет по настроенным вами порталам вакансий, отсеивает уже виденные, оценивает соответствие каждой и показывает ранжированную таблицу |
| **3. Откликнуться** | `/apply <url or paste>` | Claude оценивает ваше соответствие, адаптирует резюме, пишет сопроводительное письмо на языке вакансии, второй ИИ-рецензент критикует оба документа, правки применяются, компилируются два PDF и выполняется финальный контрольный список проверки |

> **Ваши данные никогда не покидают ваш компьютер.** Ваш профиль, резюме, сопроводительные письма и журнал заявок хранятся локально и никогда не коммитятся в git.

---

## Как это работает — версия за 3 минуты

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

**Чего CareerForge не делает:**
- Не подаёт заявки за вас (вы проверяете и отправляете сами)
- Не выдумывает навыки или опыт, которых у вас нет
- Не загружает ничего в облако

---

## Что вам понадобится

### 1. Claude Code

Claude Code — это ИИ-помощник, который запускает CareerForge. Установите его один раз:

```bash
npm install -g @anthropic-ai/claude-code
```

Затем войдите:

```bash
claude
```

Для Claude Code нужна [учётная запись Anthropic](https://claude.ai). Подходят и Free, и Pro; для интенсивного использования рекомендуется Pro.

> **Не уверены, что такое Claude Code?** Думайте о нём как об умном терминальном помощнике, который может читать файлы, искать в интернете и выполнять команды — руководствуясь инструкциями CareerForge.

### 2. LaTeX (для генерации PDF)

CareerForge компилирует ваше резюме и сопроводительное письмо в PDF с помощью LaTeX. Нужны два компилятора:

| Компилятор | Используется для | Зачем |
|----------|----------|-----|
| `lualatex` | Резюме | Требуется пакетами `fontawesome` и `lato` |
| `xelatex` | Сопроводительное письмо | Требуется `fontspec` для встроенных шрифтов |

**macOS** (рекомендуется — устанавливает оба компилятора):
```bash
brew install --cask mactex
```
Или скачайте с [tug.org/mactex](https://www.tug.org/mactex/).

После установки добавьте дополнительные пакеты для резюме:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** Установите [MiKTeX](https://miktex.org/download) — он автоматически подгружает недостающие пакеты.

### 3. Python 3.10+ _(опционально — для анализа зарплат)_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## Быстрый старт

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

## Команды подробно

### `/setup` — Создать профиль кандидата

Заполняет семь файлов профиля на основе ваших реальных данных. Claude задаёт вопросы или читает ваши документы — печатать ничего не нужно, если у вас есть файлы.

**Три пути онбординга:**

| Путь | Когда использовать |
|------|-------------|
| **A — Сканировать документы** | У вас есть резюме, экспорт из LinkedIn, дипломы или рекомендательные письма в папке `documents/` |
| **B — Импортировать резюме** | У вас есть одно чистое резюме и вы хотите быстро начать |
| **C — Живое интервью** | Начинаете с нуля; Claude проводит с вами интервью |

**Примеры запросов:**

```
/setup
```
```
/setup --section search
```
> _(Сразу переходит к обновлению целевых порталов вакансий и предпочтений по местоположению без повторного полного интервью.)_

```
/setup --section experience
```
> _(Обновляет только историю работы — полезно после смены работы.)_

**Что создаётся:**

| Файл | Содержимое |
|------|---------|
| `01-candidate-profile.md` | Личность, образование, история работы, навыки, проекты |
| `02-behavioral-profile.md` | Стиль работы, предпочтения по культуре, мотивация |
| `03-writing-style.md` | _(статичная основа — без личных данных)_ |
| `04-job-evaluation.md` | Ваши сильные/слабые стороны, карьерные цели |
| `05-cv-templates.md` | Описания профиля по типам должностей |
| `06-cover-letter-templates.md` | _(статичные шаблоны)_ |
| `07-interview-prep.md` | STAR-истории из вашего опыта |
| `search-queries.md` | Ваши целевые порталы вакансий, запросы, уровни местоположения |

---

### `/search` — Найти новые вакансии

Ищет по настроенным вами порталам вакансий через веб-поиск, отсеивает уже виденные вакансии, присваивает сигнал соответствия (High / Medium / Low) и показывает ранжированную таблицу. Когда вы выбираете номер, вакансия сразу передаётся в `/apply`.

**Аргументы:**

| Синтаксис | Поведение |
|--------|-----------|
| `/search` | Запускает 3 ваши приоритетные категории запросов |
| `/search data science` | Приоритизирует категории, соответствующие «data science» |
| `/search broad` | Запускает все настроенные категории запросов |

**Примеры запросов:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**Пример вывода:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **Все порталы берутся из вашей конфигурации.** Ничего не зашито в код — добавьте любую доску вакансий (LinkedIn, Indeed, Jobindex, Stepstone и т. д.) в `search-queries.md`, и она автоматически будет учитываться.

---

### `/apply` — Создать адаптированное резюме и сопроводительное письмо

Принимает URL вакансии или вставленное описание и запускает полный конвейер подачи заявки:

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**Аргументы:**

| Аргумент | Поведение |
|----------|-----------|
| _(по умолчанию)_ | Полный конвейер с рецензентом (`--review=full`) |
| `--review=quick` | Рецензент пропускает исследование компании — быстрее, дешевле |
| `--review=none` | Полностью пропустить рецензента — быстрее всего, дешевле всего |

**Примеры запросов:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

Или вставьте описание вакансии напрямую:

```
/apply
[paste job description here]
```

**Что вы получаете:**

| Результат | Расположение |
|--------|---------|
| Резюме (PDF, 2 страницы, английский) | `cv/main_<company>.pdf` |
| Сопроводительное письмо (PDF, 1 страница, язык вакансии) | `cover_letters/cover_<company>_<role>.pdf` |
| Строка заявки | `job_search_tracker.csv` |
| Оценка соответствия | В диалоге |

**Оценка соответствия (5 измерений):**

| Измерение | Вес |
|-----------|--------|
| Соответствие технических навыков | 30% |
| Карьерное соответствие | 30% |
| Соответствие опыта | 25% |
| Поведенческое / культурное соответствие | 15% |
| Местоположение и логистика | Зачёт / Незачёт |

Вердикт: **Strong** (75+) · **Good** (60–74) · **Moderate** (45–59) · **Weak** (30–44) · **Poor** (<30)

> **Правило языка:** сопроводительное письмо всегда пишется на языке вакансии. Вакансия на датском → сопроводительное письмо на датском. Резюме всегда на английском.

---

### `/upskill` — Найти пробелы в навыках и план по их закрытию

Сравнивает ваш профиль со спросом и создаёт приоритизированную тепловую карту пробелов, план обучения из **реальных найденных в интернете** ресурсов и порядок изучения с учётом зависимостей — затем сохраняет всё это как отчёт, который панель может вам показать.

**Два режима:**

| Синтаксис | Режим | Что анализирует |
|--------|------|------------------|
| `/upskill` | Агрегированный | Каждую вакансию в вашем трекере, со взвешиванием так, что роли, которым вы соответствуете *меньше всего*, считаются наиболее значимыми |
| `/upskill <url>` | Точечный | Одну вакансию (вставьте текст, если URL не загружается) |

**Что вы получаете:**

| Результат | Расположение |
|--------|---------|
| Тепловая карта пробелов (Critical / High / Medium / Low) | В диалоге |
| План обучения — 2–3 ресурса на пробел, с направлением изучения + оценкой времени | В отчёте |
| Порядок изучения с общим временем | В отчёте |
| Сохранённый отчёт (с дельтой относительно прошлого запуска в агрегированном режиме) | `upskill/report-*.md` |

Отчёты появляются во вкладке **Upskill** панели. Ничего не выдумывается — каждый ресурс берётся из живого веб-поиска, а пустой трекер получает честную подсказку перейти в точечный режим вместо пустого отчёта.

---

### `/expand` — Развить профиль на основе всего, что вы уже сделали

Находит компетенции, которые у вас есть, но которые вы не записали — из ваших документов, ваших публичных репозиториев **GitHub** и интернета — и **добавляет** их в ваш профиль. Он никогда не редактирует и не удаляет уже существующее.

**Как это работает:**

1. **Сканирует** `documents/`, ваши репозитории GitHub (README, языки, темы) и другие ссылки профиля (портфолио, Kaggle, Scholar).
2. **Обогащает** каждую находку через веб-поиск — как прямой поиск (программы курсов, списки навыков сертификатов, документация инструментов), так и вывод о методах и наборах инструментов, которые подразумевает работа.
3. **Показывает вам карту компетенций**, сгруппированную по категориям, где каждый элемент привязан к своему источнику и помечен как прямой / выведенный — для вашей проверки *перед* тем, как что-либо будет записано.
4. **Добавляет только то, что вы одобрили**, каждое с пометкой источника вроде *(Coursera — Deep Learning Specialisation)*. Эти пометки делают повторные запуски идемпотентными, а выведенные поведенческие черты чётко помечены.

**Примеры запросов:**

```
/expand
```
```
/expand github
```
> _(Приоритизирует ваши репозитории GitHub как источник для анализа.)_

Поскольку каждое добавление аддитивно и снабжено пометкой источника, вы можете снова запустить `/expand` после нового курса или проекта, и он добавит только то, что действительно ново.

---

### `/reset` — Начать заново, безопасно

Очищает ваши личные данные, чтобы вы могли начать заново — новое карьерное направление, свежий профиль или передача репозитория кому-то ещё — **не затрагивая** основу, которая заставляет CareerForge работать.

**Области действия:**

| Синтаксис | Очищает |
|--------|--------|
| `/reset profile` | Файлы навыков вашего профиля (возврат к пустым шаблонам) |
| `/reset documents` | Ваши файлы в `documents/` (структура папок + README сохраняются) |
| `/reset all` | И то, и другое |

Он всегда **сначала показывает вам опись** (что будет очищено, а что сохранено), и **ничего не происходит, пока вы не введёте `RESET`** заглавными буквами — любой другой ответ отменяет операцию. Руководство по стилю письма, система оценки, шаблоны сопроводительных писем и основа подготовки к интервью никогда не затрагиваются; очищаются только ваши данные. Отмены нет, поэтому он указывает вам на историю git как единственный способ восстановления, а затем предлагает запустить `/setup` для повторного создания.

---

## Панель отслеживания

Локальный веб-интерфейс, который **читает и атомарно записывает ваш `job_search_tracker.csv` как единственный источник истины**, визуализирует вашу воронку и может управлять CLI (`/apply`, `/upskill`, поиск зарплат) прямо из браузера. Это опциональный спутник — его удаление оставляет ваши данные и конвейер `/apply` нетронутыми.

> **Попробуйте без установки →** [**Живое демо**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — обзор только для чтения с вымышленными примерами данных. Редактирование, Консоль и предпросмотр PDF там отключены (для них нужно приложение, запущенное локально); всё остальное — реальный интерфейс.

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| Раздел | Что он делает |
|---------|--------------|
| **Applications** | Сортировка/фильтрация/поиск по трекеру; встроенные правки статуса + заметок (атомарные, защищённые конечным автоматом); `+ New`; выдвижная панель с защищённым предпросмотром PDF |
| **Overview** | Карточки KPI (всего, откликов за 7/30 дней, средн. соответствие, доля собеседований) + графики по неделям/статусам/соответствию/календарю — честное `—`, когда не достигнут минимум выборки |
| **Console** | Запуск разрешённых команд и трансляция их вывода вживую; повторный запуск `/apply`, `/upskill` и поиска зарплат по каждой компании |
| **Companies · Salary · Upskill · Profile · Settings** | Сгруппированные/сравнительные/отчётные/профильные представления; настройки темы + режима только для чтения |

**Локально по замыслу:** привязывается только к `127.0.0.1` (без LAN, без авторизации, без учётных записей), не делает исходящих сетевых вызовов, запускает команды по фиксированному списку разрешений без оболочки и не хранит секретов. Режим `--read-only` отключает все правки и действия. См. [`dashboard/README.md`](dashboard/README.md) и [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md).

> Требуется Node 18+. Слой действий (запуск команд из браузера) требует наличия бинарников `claude` и/или `python3` в `PATH`; при их отсутствии эти триггеры отключаются, а остальное продолжает работать.

---

> **Все запланированные команды выпущены.** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand` и `/reset` — все активны (v1.0–v1.2). См. [Дорожную карту](#дорожная-карта) для дальнейших планов.

---

## Пример сессии

Вот реалистичный сквозной пример от начала до конца.

**1. Первоначальная настройка**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. Поиск вакансий**

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

**3. Подача заявки**

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

## Приватность

| Данные | Где хранятся | Коммитятся в git? |
|------|----------------|-------------------|
| Профиль кандидата | `.claude/skills/job-application-assistant/` | Нет |
| Сгенерированные резюме и сопроводительные письма | `cv/output/`, `cover_letters/output/` | Нет |
| Трекер заявок | `job_search_tracker.csv` | Нет |
| Реестр виденных вакансий | `job_scraper/seen_jobs.json` | Нет |
| Исходные документы | `documents/` | Нет |
| Данные о зарплате | `salary_data.json` | Нет |

`.gitignore` обеспечивает все эти исключения. Если вы отправляете свой форк на GitHub, **используйте приватный репозиторий**, чтобы файлы вашего профиля никогда не были раскрыты.

---

## Структура каталогов

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

## Ручная компиляция шаблонов

Если вы хотите протестировать шаблоны LaTeX отдельно:

**Резюме** (запускать из каталога `cv/`):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**Сопроводительное письмо** (запускать из `cover_letters/` — рабочий каталог важен для загрузки шрифтов):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Дорожная карта

| Веха | Статус | Что выпускается |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ Готово | `/setup`, `/apply` (без рецензента), компиляция PDF |
| **v1.0** (Epics 6–8) | ✅ Готово | Агент-рецензент, `/search`, трекер заявок |
| **v1.0 — Dashboard** (Epic 9) | ✅ Готово | Локальная панель отслеживания на `127.0.0.1:4480` — просмотр/правка трекера, аналитика, запуск команд из браузера |
| **v1.1** (Epics 10–11) | ✅ Готово | `/upskill` — анализ пробелов в навыках + план обучения, и `/expand` — расширение компетенций из ваших документов, GitHub и интернета |
| **v1.2** (Epic 12) | ✅ Готово | `/reset`, основа подготовки к интервью, паттерн адаптера портала ADR-0004 + пример, агент исследований |
| **v2.0** | 💡 В будущем | Маркетплейс шаблонов, адаптеры порталов от сообщества, GUI |

См. полный план в [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md).

---

## Документация

**Начните здесь →** [`docs-site/`](docs-site/) — **сайт** документации: руководство, ориентированное на новичков, по всему продукту (Быстрый старт, все три команды, панель с живыми демо, ваши данные, приватность, FAQ, глоссарий). Запустите его локально с `npm run dev` внутри `docs-site/` или соберите статически с `npm run build`.

Инженерная документация (спецификации, архитектура, планы):

| Путь | Содержимое |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | Полные функциональные требования (идентификаторы `REQ-####`) |
| [`docs/architecture/`](docs/architecture/) | Технологический стек, проектирование компонентов, ADR |
| [`docs/plan/`](docs/plan/) | Вехи, эпики, разбивка работ |
| [`docs/development/`](docs/development/) | Стандарты кодирования, структура проекта, руководство по вкладу |
| [`docs/testing/`](docs/testing/) | Стратегия тестирования, тест-кейсы (идентификаторы `TC-####`) |
| [`docs/glossary.md`](docs/glossary.md) | Канонические термины |

---

## Участие

Вклад приветствуется — новые шаблоны резюме/сопроводительных писем, языковые пакеты, адаптеры порталов, исправления ошибок и улучшения документации помогают всем.

> ⚠️ **Используйте приватный форк.** Ваш профиль кандидата находится в том же каталоге, что и исходный код. Всегда работайте в приватном репозитории GitHub, чтобы ваши личные данные не попали в открытый интернет.

См. [CONTRIBUTING.md](CONTRIBUTING.md) для полного руководства, именования веток, чек-листа PR и того, как добавить новый портал вакансий или локаль.

---

## Лицензия

MIT — см. [LICENSE](LICENSE). ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
