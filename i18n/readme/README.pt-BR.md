_Esta é uma tradução comunitária e assistida por máquina (beta). O [README em inglês](../../README.md) é a versão canônica; em caso de divergência, ele prevalece._

<div align="center">

# CareerForge

**Um assistente de busca de empregos com IA que encontra vagas, escreve CVs e cartas de apresentação sob medida e os compila em PDFs prontos para impressão — tudo na sua própria máquina.**

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

> **Novo por aqui? Comece pelo guia.** A maneira mais amigável de entender o CareerForge é o site de documentação — Início Rápido, todos os três comandos, o painel com demonstrações ao vivo, privacidade e FAQ. Não é preciso saber programar para lê-lo.
>
> - 🌐 **Leia agora:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — hospedado, nada a instalar.
> - 📊 **Navegue pelo painel:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — a interface real com dados de exemplo fictícios, somente leitura.
> - 💻 **Prefere local?** Execute `npm run dev` dentro de [`docs-site/`](docs-site/) (ou veja [o README dele](docs-site/README.md) para o build estático em um comando).

## O que é isto?

O CareerForge é um conjunto de ferramentas de busca de empregos que você executa dentro do **Claude Code** — um assistente de IA que vive no seu terminal. Você digita comandos e instruções em linguagem natural; a IA faz o trabalho. Não é necessário conhecimento de programação.

Eis o que ele pode fazer por você hoje:

| Etapa | Você diz | O que acontece |
|------|---------|-------------|
| **1. Monte seu perfil** | `/setup` | O Claude lê seu CV existente, exportação do LinkedIn, diplomas ou entrevista você — e então escreve seu perfil de candidato |
| **2. Encontre novas vagas** | `/search` | O Claude busca nos portais de emprego que você configurou, remove duplicatas de vagas já vistas, pontua a aderência de cada uma e mostra uma tabela ordenada |
| **3. Candidate-se** | `/apply <url ou texto colado>` | O Claude pontua sua aderência, adapta seu CV, escreve uma carta de apresentação no idioma da vaga, faz com que um segundo revisor de IA critique ambos, aplica as edições, compila dois PDFs e executa uma lista de verificação final |

> **Seus dados nunca saem da sua máquina.** Seu perfil, CVs, cartas de apresentação e registro de candidaturas são todos armazenados localmente e nunca enviados ao git.

---

## Como funciona — a versão de 3 minutos

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

**O que o CareerForge não faz:**
- Enviar candidaturas em seu nome (você revisa e envia)
- Inventar competências ou experiências que você não tem
- Subir qualquer coisa para a nuvem

---

## O que você precisa

### 1. Claude Code

O Claude Code é o assistente de IA que executa o CareerForge. Instale uma vez:

```bash
npm install -g @anthropic-ai/claude-code
```

Depois faça login:

```bash
claude
```

O Claude Code requer uma [conta Anthropic](https://claude.ai). Os planos Free e Pro funcionam; o Pro é recomendado para uso intenso.

> **Não sabe o que é o Claude Code?** Pense nele como um assistente de terminal inteligente que pode ler arquivos, pesquisar na web e executar comandos — guiado pelas instruções do CareerForge.

### 2. LaTeX (para geração de PDF)

O CareerForge compila seu CV e sua carta de apresentação em PDF usando LaTeX. São necessários dois compiladores:

| Compilador | Usado para | Por quê |
|----------|----------|-----|
| `lualatex` | CV | Exigido pelos pacotes `fontawesome` e `lato` |
| `xelatex` | Carta de apresentação | Exigido pelo `fontspec` para as fontes incluídas |

**macOS** (recomendado — instala ambos os compiladores):
```bash
brew install --cask mactex
```
Ou baixe em [tug.org/mactex](https://www.tug.org/mactex/).

Após a instalação, adicione os pacotes extras do CV:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** Instale o [MiKTeX](https://miktex.org/download) — ele baixa os pacotes ausentes automaticamente.

### 3. Python 3.10+ _(opcional — para referências salariais)_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## Início Rápido

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

## Comandos em detalhe

### `/setup` — Monte seu perfil de candidato

Preenche sete arquivos de perfil a partir dos seus dados reais. O Claude faz perguntas ou lê seus documentos — sem digitação se você tiver arquivos.

**Três caminhos de integração:**

| Caminho | Quando usar |
|------|-------------|
| **A — Escanear documentos** | Você tem CVs, uma exportação do LinkedIn, diplomas ou cartas de referência na pasta `documents/` |
| **B — Importar um CV** | Você tem um único CV organizado e quer um início rápido |
| **C — Entrevista ao vivo** | Começando do zero; o Claude entrevista você |

**Exemplos de instruções:**

```
/setup
```
```
/setup --section search
```
> _(Vai direto para a atualização dos seus portais de emprego e preferências de localização sem refazer a entrevista completa.)_

```
/setup --section experience
```
> _(Atualiza apenas seu histórico de trabalho — útil após uma troca de emprego.)_

**O que é construído:**

| Arquivo | Conteúdo |
|------|---------|
| `01-candidate-profile.md` | Identidade, formação, histórico de trabalho, competências, projetos |
| `02-behavioral-profile.md` | Estilo de trabalho, preferências de cultura, motivações |
| `03-writing-style.md` | _(framework estático — sem dados pessoais)_ |
| `04-job-evaluation.md` | Seus pontos fortes/fracos, objetivos de carreira |
| `05-cv-templates.md` | Declarações de perfil por tipo de cargo |
| `06-cover-letter-templates.md` | _(modelos estáticos)_ |
| `07-interview-prep.md` | Histórias STAR da sua experiência |
| `search-queries.md` | Seus portais de emprego, buscas e níveis de localização |

---

### `/search` — Encontre novas vagas

Busca nos portais de emprego que você configurou via pesquisa na web, remove duplicatas de vagas já vistas, atribui um sinal de aderência (Alta / Média / Baixa) e apresenta uma tabela ordenada. Quando você escolhe um número, a vaga é entregue diretamente ao `/apply`.

**Argumentos:**

| Sintaxe | Comportamento |
|--------|-----------|
| `/search` | Executa suas 3 principais categorias de busca prioritárias |
| `/search data science` | Prioriza categorias que correspondem a "data science" |
| `/search broad` | Executa todas as categorias de busca configuradas |

**Exemplos de instruções:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**Exemplo de saída:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **Todos os portais vêm da sua configuração.** Nada é fixado no código — adicione qualquer portal de vagas (LinkedIn, Indeed, Jobindex, Stepstone, etc.) ao `search-queries.md` e ele será incluído automaticamente.

---

### `/apply` — Produza um CV e uma carta de apresentação sob medida

Recebe uma URL de vaga ou uma descrição colada e executa todo o fluxo de candidatura:

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

| Argumento | Comportamento |
|----------|-----------|
| _(padrão)_ | Fluxo completo com revisor (`--review=full`) |
| `--review=quick` | O revisor pula a pesquisa sobre a empresa — mais rápido, menor custo |
| `--review=none` | Pula o revisor por completo — mais rápido, menor custo |

**Exemplos de instruções:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

Ou cole a descrição da vaga diretamente:

```
/apply
[paste job description here]
```

**O que você recebe:**

| Saída | Localização |
|--------|---------|
| CV (PDF, 2 páginas, inglês) | `cv/main_<company>.pdf` |
| Carta de apresentação (PDF, 1 página, idioma da vaga) | `cover_letters/cover_<company>_<role>.pdf` |
| Linha da candidatura | `job_search_tracker.csv` |
| Avaliação de aderência | Na conversa |

**Pontuação de aderência (5 dimensões):**

| Dimensão | Peso |
|-----------|--------|
| Correspondência de competências técnicas | 30% |
| Alinhamento de carreira | 30% |
| Correspondência de experiência | 25% |
| Aderência comportamental / cultural | 15% |
| Localização e logística | Passa / Não passa |

Veredito: **Forte** (75+) · **Boa** (60–74) · **Moderada** (45–59) · **Fraca** (30–44) · **Ruim** (<30)

> **Regra de idioma:** a carta de apresentação é sempre escrita no idioma da vaga. Uma vaga em dinamarquês → carta em dinamarquês. O CV é sempre em inglês.

---

### `/upskill` — Encontre suas lacunas de competências e um plano para fechá-las

Compara seu perfil com a demanda e produz um mapa de calor de lacunas priorizado, um
plano de aprendizado construído a partir de recursos **reais, pesquisados na web**, e uma ordem de estudo
ciente de dependências — e então salva tudo como um relatório que o painel pode mostrar a você.

**Dois modos:**

| Sintaxe | Modo | O que analisa |
|--------|------|------------------|
| `/upskill` | Agregado | Todas as vagas no seu rastreador, ponderadas para que os cargos em que você *menos* se encaixa contem mais |
| `/upskill <url>` | Direcionado | Uma única vaga (cole o texto se a URL não puder ser obtida) |

**O que você recebe:**

| Saída | Localização |
|--------|---------|
| Mapa de calor de lacunas (Crítica / Alta / Média / Baixa) | Na conversa |
| Plano de aprendizado — 2–3 recursos por lacuna, com direção de estudo + estimativa de tempo | No relatório |
| Ordem de estudo com tempo total | No relatório |
| Relatório salvo (com a variação desde a última execução no modo agregado) | `upskill/report-*.md` |

Os relatórios aparecem na aba **Capacitação** do painel. Nada é fabricado — cada
recurso vem de uma pesquisa ao vivo na web, e um rastreador vazio recebe um empurrão honesto para o
modo direcionado em vez de um relatório vazio.

---

### `/expand` — Faça seu perfil crescer a partir de tudo o que você já fez

Encontra competências que você tem mas não anotou — a partir dos seus documentos, dos seus repositórios públicos do
**GitHub** e da web — e as **adiciona** ao seu perfil. Nunca edita nem
remove o que já está lá.

**Como funciona:**

1. **Escaneia** `documents/`, seus repositórios do GitHub (READMEs, linguagens, tópicos) e
   outros links do perfil (portfólio, Kaggle, Scholar).
2. **Enriquece** cada achado por meio de pesquisa na web — tanto uma busca direta (ementas de cursos,
   listas de competências de certificações, documentação de ferramentas) quanto inferência sobre os métodos e cadeias de ferramentas
   que o trabalho implica.
3. **Mostra um mapa de competências** agrupado por categoria, cada item rastreado até sua origem e
   marcado como direto / inferido — para sua revisão *antes* de qualquer coisa ser gravada.
4. **Adiciona apenas o que você aprova**, cada item com uma nota de origem como *(Coursera — Deep
   Learning Specialisation)*. Essas notas tornam as reexecuções idempotentes, e traços comportamentais
   inferidos são claramente rotulados.

**Exemplos de instruções:**

```
/expand
```
```
/expand github
```
> _(Prioriza seus repositórios do GitHub como a fonte a explorar.)_

Como toda adição é aditiva e anotada com a origem, você pode executar `/expand` novamente
após um novo curso ou projeto e ele traz apenas o que é genuinamente novo.

---

### `/reset` — Recomece, com segurança

Limpa seus dados pessoais para que você possa começar de novo — uma nova direção de carreira, um perfil
renovado ou a entrega do repositório a outra pessoa — **sem** tocar no framework que
faz o CareerForge funcionar.

**Escopos:**

| Sintaxe | Limpa |
|--------|--------|
| `/reset profile` | Seus arquivos de competências do perfil (de volta aos modelos em branco) |
| `/reset documents` | Seus arquivos em `documents/` (estrutura de pastas + README mantidos) |
| `/reset all` | Ambos |

Ele sempre **mostra primeiro um inventário** (o que será limpo vs. o que é preservado),
e **nada acontece até você digitar `RESET`** em maiúsculas — qualquer outra resposta cancela. O
guia de estilo de escrita, o framework de pontuação, os modelos de carta de apresentação e o framework de preparação para entrevistas
nunca são tocados; apenas seus dados são. Não há desfazer, então ele aponta para o seu
histórico do git como única recuperação e, em seguida, sugere executar `/setup` para reconstruir.

---

## O painel de acompanhamento

Uma interface web apenas local que **lê e grava atomicamente o seu `job_search_tracker.csv` como a única fonte de verdade**, visualiza seu funil e pode acionar a CLI (`/apply`, `/upskill`, consultas salariais) a partir do navegador. É um complemento opcional — excluí-lo deixa seus dados e o fluxo do `/apply` intactos.

> **Experimente sem instalar →** [**Demonstração ao vivo**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — um passeio somente leitura com dados de exemplo fictícios. A edição, o Console e as prévias em PDF estão desativados ali (eles precisam do aplicativo rodando localmente); todo o resto é a interface real.

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| Superfície | O que faz |
|---------|--------------|
| **Candidaturas** | Ordenar/filtrar/buscar no rastreador; edições inline de status + notas (atômicas, protegidas por máquina de estados); `+ Nova`; gaveta de detalhes com prévia de PDF protegida |
| **Visão geral** | Cartões de KPI (total, enviadas 7d/30d, aderência média, taxa de entrevistas) + gráficos semanais/de status/de aderência/de calendário — um honesto `—` quando o mínimo de amostra não é atingido |
| **Console** | Executar comandos da lista permitida e transmitir a saída ao vivo; reexecução por empresa de `/apply`, `/upskill` e consultas salariais |
| **Empresas · Salário · Capacitação · Perfil · Configurações** | Visões agrupadas/com referências/de relatório/de perfil; preferências de tema + somente leitura |

**Local por design:** vincula apenas ao `127.0.0.1` (sem LAN, sem autenticação, sem contas), não faz chamadas de rede externas, executa comandos via uma lista permitida fixa sem shell e não armazena segredos. Um modo `--read-only` desativa todas as edições e ações. Veja [`dashboard/README.md`](dashboard/README.md) e [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md).

> Requer Node 18+. A camada de ação (executar comandos a partir do navegador) precisa dos binários `claude` e/ou `python3` no `PATH`; quando ausentes, esses gatilhos são desativados e o restante continua funcionando.

---

> **Todos os comandos planejados já foram lançados.** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand` e `/reset` estão todos ativos (v1.0–v1.2). Veja o [Roteiro](#roteiro) para o que vem
> a seguir.

---

## Sessão de exemplo

Eis um passo a passo realista de ponta a ponta.

**1. Configuração inicial**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. Buscando vagas**

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

**3. Candidatando-se**

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

## Privacidade

| Dado | Onde fica | Enviado ao git? |
|------|----------------|-------------------|
| Perfil do candidato | `.claude/skills/job-application-assistant/` | Não |
| CVs e cartas de apresentação gerados | `cv/output/`, `cover_letters/output/` | Não |
| Rastreador de candidaturas | `job_search_tracker.csv` | Não |
| Registro de vagas vistas | `job_scraper/seen_jobs.json` | Não |
| Documentos de origem | `documents/` | Não |
| Dados salariais | `salary_data.json` | Não |

O `.gitignore` impõe todas essas exclusões. Se você publicar seu fork no GitHub, **use um repositório privado** para que seus arquivos de perfil nunca sejam expostos.

---

## Estrutura de diretórios

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

## Compilando os modelos manualmente

Se quiser testar os modelos LaTeX de forma independente:

**CV** (execute a partir do diretório `cv/`):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**Carta de apresentação** (execute a partir de `cover_letters/` — o diretório de trabalho importa para o carregamento das fontes):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Roteiro

| Marco | Status | O que entrega |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ Concluído | `/setup`, `/apply` (sem revisor), compilação de PDF |
| **v1.0** (Epics 6–8) | ✅ Concluído | Agente revisor, `/search`, rastreador de candidaturas |
| **v1.0 — Painel** (Epic 9) | ✅ Concluído | Painel de acompanhamento local em `127.0.0.1:4480` — ver/editar o rastreador, análises, executar comandos a partir do navegador |
| **v1.1** (Epics 10–11) | ✅ Concluído | Análise de lacunas de competências `/upskill` + plano de aprendizado, e expansão de competências `/expand` a partir dos seus docs, GitHub e da web |
| **v1.2** (Epic 12) | ✅ Concluído | `/reset`, framework de preparação para entrevistas, padrão de adaptador de portal ADR-0004 + exemplo, agente de pesquisa |
| **v2.0** | 💡 Futuro | Marketplace de modelos, adaptadores de portal da comunidade, GUI |

Veja o plano completo em [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md).

---

## Documentação

**Comece aqui →** [`docs-site/`](docs-site/) — o **site** de documentação: um guia que prioriza o iniciante para todo o produto (Início Rápido, todos os três comandos, o painel com demonstrações ao vivo, seus dados, privacidade, FAQ, glossário). Execute-o localmente com `npm run dev` dentro de `docs-site/`, ou gere-o estático com `npm run build`.

Documentação de engenharia (especificações, arquitetura, planos):

| Caminho | Conteúdo |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | Requisitos funcionais completos (IDs `REQ-####`) |
| [`docs/architecture/`](docs/architecture/) | Pilha de tecnologia, design de componentes, ADRs |
| [`docs/plan/`](docs/plan/) | Marcos, épicos, divisão do trabalho |
| [`docs/development/`](docs/development/) | Padrões de código, estrutura do projeto, guia de contribuição |
| [`docs/testing/`](docs/testing/) | Estratégia de testes, casos de teste (IDs `TC-####`) |
| [`docs/glossary.md`](docs/glossary.md) | Termos canônicos |

---

## Contribuindo

Contribuições são bem-vindas — novos modelos de CV/carta de apresentação, pacotes de localidade, adaptadores de portal, correções de bugs e melhorias na documentação ajudam.

> ⚠️ **Use um fork privado.** Seu perfil de candidato fica no mesmo diretório que o código-fonte. Trabalhe sempre em um repositório privado do GitHub para manter seus dados pessoais fora da internet pública.

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para o guia completo, convenção de nomes de branch, checklist de PR e como adicionar um novo portal de emprego ou localidade.

---

## Licença

MIT — veja [LICENSE](LICENSE). ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
