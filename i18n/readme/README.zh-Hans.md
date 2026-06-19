*本文档为社区/机器辅助翻译（测试版）。如有任何歧义，请以英文版 README 为准（英文为权威版本）。*

<div align="center">

# CareerForge

**一款 AI 求职助手，帮你查找招聘信息、撰写量身定制的简历和求职信，并将它们编译为可直接打印的 PDF — 全部在你自己的机器上完成。**

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

> **初次使用？请从指南开始。** 了解 CareerForge 最友好的方式是文档站点 — 包含快速开始、全部命令、带实时演示的面板、隐私说明和常见问题。阅读它不需要任何编程知识。
>
> - 🌐 **立即阅读：** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — 在线托管，无需安装。
> - 📊 **点击体验面板：** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — 基于虚构示例数据的真实 UI，只读模式。
> - 💻 **更喜欢本地运行？** 在 [`docs-site/`](docs-site/) 内运行 `npm run dev`（或参阅[其 README](docs-site/README.md) 了解一条命令完成静态构建的方法）。

## 这是什么？

CareerForge 是一个在 **Claude Code** 内运行的求职工具包 — Claude Code 是一个驻留在你终端中的 AI 助手。你输入命令和大白话提示，AI 来完成工作。无需任何编程知识。

以下是它现在就能为你做的事：

| 步骤 | 你说 | 发生了什么 |
|------|---------|-------------|
| **1. 构建个人档案** | `/setup` | Claude 读取你现有的简历、LinkedIn 导出文件、学历证书，或对你进行访谈 — 然后撰写你的候选人档案 |
| **2. 查找新职位** | `/search` | Claude 搜索你配置的招聘门户，与你已经看过的职位去重，为每个职位评估匹配度，并向你展示一个排序后的表格 |
| **3. 申请** | `/apply <url 或粘贴文本>` | Claude 评估你的匹配度，量身定制你的简历，用招聘信息的语言撰写求职信，让第二个 AI 审阅者评审两份文档，应用修改，编译两份 PDF，并运行最终的核查清单 |

> **你的数据永远不会离开你的机器。** 你的个人档案、简历、求职信和申请记录全部存储在本地，永远不会提交到 git。

---

## 工作原理 — 3 分钟速览

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

**CareerForge 不会做的事：**
- 代替你提交申请（你审阅并发送）
- 编造你不具备的技能或经历
- 向云端上传任何内容

---

## 你需要准备什么

### 1. Claude Code

Claude Code 是运行 CareerForge 的 AI 助手。只需安装一次：

```bash
npm install -g @anthropic-ai/claude-code
```

然后登录：

```bash
claude
```

Claude Code 需要一个 [Anthropic 账户](https://claude.ai)。免费版和 Pro 版都可使用；重度使用推荐 Pro 版。

> **不确定 Claude Code 是什么？** 可以把它理解为一个智能终端助手，能够读取文件、搜索网络并运行命令 — 在 CareerForge 指令的引导下工作。

### 2. LaTeX（用于生成 PDF）

CareerForge 使用 LaTeX 将你的简历和求职信编译为 PDF。需要两个编译器：

| 编译器 | 用于 | 原因 |
|----------|----------|-----|
| `lualatex` | 简历 | `fontawesome` 和 `lato` 宏包所需 |
| `xelatex` | 求职信 | 内置字体所需的 `fontspec` |

**macOS**（推荐 — 同时安装两个编译器）：
```bash
brew install --cask mactex
```
或从 [tug.org/mactex](https://www.tug.org/mactex/) 下载。

安装后，添加额外的简历宏包：
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux（TeX Live）：**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows：** 安装 [MiKTeX](https://miktex.org/download) — 它会自动获取缺失的宏包。

### 3. Python 3.10+ _（可选 — 用于薪资基准）_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## 快速开始

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

## 命令详解

### `/setup` — 构建你的候选人档案

根据你的真实数据填充七个档案文件。Claude 会提问或读取你的文档 — 如果你有文件，则无需打字。

**三条上手路径：**

| 路径 | 何时使用 |
|------|-------------|
| **A — 扫描文档** | 你在 `documents/` 文件夹中有简历、LinkedIn 导出文件、学历证书或推荐信 |
| **B — 导入简历** | 你有一份干净的简历，想要快速开始 |
| **C — 实时访谈** | 从零开始；Claude 对你进行访谈 |

**示例提示：**

```
/setup
```
```
/setup --section search
```
> _（直接跳转到更新你的目标招聘门户和地点偏好，无需重新运行完整访谈。）_

```
/setup --section experience
```
> _（仅更新你的工作履历 — 在换工作后很有用。）_

**将会构建什么：**

| 文件 | 内容 |
|------|---------|
| `01-candidate-profile.md` | 身份、教育、工作履历、技能、项目 |
| `02-behavioral-profile.md` | 工作风格、文化偏好、动机 |
| `03-writing-style.md` | _（静态框架 — 无个人数据）_ |
| `04-job-evaluation.md` | 你的强项/弱项、职业目标 |
| `05-cv-templates.md` | 按职位类型划分的个人简介陈述 |
| `06-cover-letter-templates.md` | _（静态模板）_ |
| `07-interview-prep.md` | 来自你经历的 STAR 故事 |
| `search-queries.md` | 你的目标招聘门户、查询、地点层级 |

---

### `/search` — 查找新的招聘信息

通过网络搜索查找你配置的招聘门户，与你已经看过的职位去重，赋予匹配信号（高 / 中 / 低），并展示一个排序后的表格。当你选择一个编号时，该职位会直接交给 `/apply`。

**参数：**

| 语法 | 行为 |
|--------|-----------|
| `/search` | 运行你的前 3 个优先查询类别 |
| `/search data science` | 优先匹配“data science”的类别 |
| `/search broad` | 运行所有已配置的查询类别 |

**示例提示：**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**示例输出：**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **所有门户都来自你的配置。** 没有任何硬编码 — 将任何招聘网站（LinkedIn、Indeed、Jobindex、Stepstone 等）添加到 `search-queries.md`，它就会被自动纳入。

---

### `/apply` — 生成量身定制的简历和求职信

接受一个职位 URL 或粘贴的描述，并运行完整的申请流程：

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**参数：**

| 参数 | 行为 |
|----------|-----------|
| _（默认）_ | 带审阅者的完整流程（`--review=full`） |
| `--review=quick` | 审阅者跳过公司研究 — 更快、成本更低 |
| `--review=none` | 完全跳过审阅者 — 最快、成本最低 |

**示例提示：**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

或直接粘贴职位描述：

```
/apply
[paste job description here]
```

**你将得到：**

| 输出 | 位置 |
|--------|---------|
| 简历（PDF，2 页，英文） | `cv/main_<company>.pdf` |
| 求职信（PDF，1 页，招聘信息语言） | `cover_letters/cover_<company>_<role>.pdf` |
| 申请记录行 | `job_search_tracker.csv` |
| 匹配度评估 | 在对话中 |

**匹配度评分（5 个维度）：**

| 维度 | 权重 |
|-----------|--------|
| 技术技能匹配 | 30% |
| 职业契合度 | 30% |
| 经验匹配 | 25% |
| 行为 / 文化契合度 | 15% |
| 地点与后勤 | 通过 / 不通过 |

结论：**强**（75+）· **良好**（60–74）· **中等**（45–59）· **弱**（30–44）· **差**（<30）

> **语言规则：** 求职信始终用招聘信息的语言撰写。丹麦语招聘信息 → 丹麦语求职信。简历始终为英文。

---

### `/upskill` — 找出你的技能差距及弥补计划

将你的档案与市场需求进行对比，生成一张按优先级排列的差距热力图、一份由**真实的、网络搜索而来的**资源构建的学习计划，以及一套考虑了依赖关系的学习顺序 — 然后将这一切保存为面板可以展示给你的报告。

**两种模式：**

| 语法 | 模式 | 分析内容 |
|--------|------|------------------|
| `/upskill` | 聚合 | 你追踪器中的每个职位，加权处理使你*最不*匹配的职位权重最高 |
| `/upskill <url>` | 定向 | 单个招聘信息（若 URL 无法抓取，请粘贴文本） |

**你将得到：**

| 输出 | 位置 |
|--------|---------|
| 差距热力图（严重 / 高 / 中 / 低） | 在对话中 |
| 学习计划 — 每个差距 2–3 项资源，附学习方向 + 时间估算 | 在报告中 |
| 含总时长的学习顺序 | 在报告中 |
| 已保存的报告（聚合模式下含自上次运行以来的增量） | `upskill/report-*.md` |

报告会出现在面板的 **Upskill** 标签页中。不会编造任何内容 — 每项资源都来自实时网络搜索，而空追踪器会得到一个诚实的提示，建议你转向定向模式，而不是生成一份空报告。

---

### `/expand` — 从你已做过的一切中丰富你的档案

找出你拥有但尚未写下的能力 — 来自你的文档、你公开的 **GitHub** 仓库以及网络 — 并将它们**添加**到你的档案中。它绝不会编辑或删除已有内容。

**工作原理：**

1. **扫描** `documents/`、你的 GitHub 仓库（README、语言、主题），以及其他档案链接（作品集、Kaggle、Scholar）。
2. **通过网络搜索丰富**每一项发现 — 既有直接查询（课程大纲、认证技能清单、工具文档），也有对工作所隐含的方法和工具链的推断。
3. **向你展示一张能力地图**，按类别分组，每一项都溯源至其来源并标记为直接 / 推断 — 供你在任何内容写入*之前*审阅。
4. **仅添加你批准的内容**，每一项都附有来源注释，如 *(Coursera — Deep Learning Specialisation)*。这些注释使重新运行具有幂等性，推断出的行为特质也会被清晰标注。

**示例提示：**

```
/expand
```
```
/expand github
```
> _（优先以你的 GitHub 仓库作为挖掘来源。）_

由于每次添加都是增量式且带有来源注释，你可以在完成一门新课程或新项目后再次运行 `/expand`，它只会纳入真正新增的内容。

---

### `/reset` — 安全地重新开始

清除你的个人数据，让你可以重新开始 — 一个新的职业方向、一份全新的档案，或将仓库交给他人 — 而**不会**触及让 CareerForge 运转的框架。

**范围：**

| 语法 | 清除内容 |
|--------|--------|
| `/reset profile` | 你的档案技能文件（恢复为空白模板） |
| `/reset documents` | 你在 `documents/` 中的文件（保留文件夹结构 + README） |
| `/reset all` | 两者都清除 |

它总是**先向你展示一份清单**（将清除什么 vs. 将保留什么），并且**在你以大写输入 `RESET` 之前不会有任何动作** — 任何其他回复都会取消操作。写作风格指南、评分框架、求职信模板和面试准备框架永远不会被触及；只清除你的数据。没有撤销功能，因此它会指引你将 git 历史作为唯一的恢复途径，然后建议运行 `/setup` 来重建。

---

## 追踪面板

一个仅限本地的 Web UI，它**将你的 `job_search_tracker.csv` 作为唯一可信来源进行读取和原子写入**，可视化你的求职流程，并可从浏览器驱动 CLI（`/apply`、`/upskill`、薪资查询）。它是一个可选的配套工具 — 删除它不会影响你的数据和 `/apply` 流程。

> **无需安装即可试用 →** [**在线演示**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — 一个基于虚构示例数据的只读演练。编辑、控制台和 PDF 预览在那里都已禁用（它们需要应用在本地运行）；其余部分都是真实的 UI。

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| 界面 | 功能 |
|---------|--------------|
| **Applications** | 对追踪器进行排序/筛选/搜索；行内编辑状态 + 备注（原子操作、受状态机守护）；`+ New`；带受保护 PDF 预览的详情抽屉 |
| **Overview** | KPI 卡片（总数、7 天/30 天投递数、平均匹配度、面试率）+ 周/状态/匹配度/日历图表 — 未达样本下限时诚实显示 `—` |
| **Console** | 运行允许列表中的命令并实时流式输出；按公司重新运行 `/apply`、`/upskill` 和薪资查询 |
| **Companies · Salary · Upskill · Profile · Settings** | 分组/基准/报告/档案视图；主题 + 只读偏好设置 |

**本地设计：** 仅绑定 `127.0.0.1`（无局域网、无认证、无账户），不发起任何出站网络调用，通过固定的允许列表（无 shell）运行命令，且不存储任何密钥。`--read-only` 模式会禁用每一项编辑和操作。参阅 [`dashboard/README.md`](dashboard/README.md) 和 [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md)。

> 需要 Node 18+。操作层（从浏览器运行命令）需要 `PATH` 中存在 `claude` 和/或 `python3` 二进制文件；当它们缺失时，相应的触发会被禁用，其余部分继续工作。

---

> **所有计划中的命令均已发布。** `/setup`、`/search`、`/apply`、`/upskill`、
> `/expand` 和 `/reset` 全部上线（v1.0–v1.2）。后续内容请参阅 [Roadmap](#roadmap)。

---

## 示例会话

以下是一个真实的端到端演练。

**1. 首次设置**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. 搜索职位**

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

**3. 申请**

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

## 隐私

| 数据 | 存放位置 | 是否提交到 git？ |
|------|----------------|-------------------|
| 候选人档案 | `.claude/skills/job-application-assistant/` | 否 |
| 生成的简历和求职信 | `cv/output/`、`cover_letters/output/` | 否 |
| 申请追踪器 | `job_search_tracker.csv` | 否 |
| 已见职位登记表 | `job_scraper/seen_jobs.json` | 否 |
| 源文档 | `documents/` | 否 |
| 薪资数据 | `salary_data.json` | 否 |

`.gitignore` 会强制执行所有这些排除项。如果你将自己的 fork 推送到 GitHub，**请使用私有仓库**，以确保你的档案文件永不暴露。

---

## 目录结构

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

## 手动编译模板

如果你想独立测试 LaTeX 模板：

**简历**（从 `cv/` 目录运行）：
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**求职信**（从 `cover_letters/` 运行 — 工作目录对字体加载很重要）：
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## 路线图

| 里程碑 | 状态 | 交付内容 |
|-----------|--------|-----------|
| **MVP**（Epics 1–5） | ✅ 已完成 | `/setup`、`/apply`（无审阅者）、PDF 编译 |
| **v1.0**（Epics 6–8） | ✅ 已完成 | 审阅者代理、`/search`、申请追踪器 |
| **v1.0 — 面板**（Epic 9） | ✅ 已完成 | 位于 `127.0.0.1:4480` 的本地追踪面板 — 查看/编辑追踪器、分析、从浏览器运行命令 |
| **v1.1**（Epics 10–11） | ✅ 已完成 | `/upskill` 技能差距分析 + 学习计划，以及从你的文档、GitHub 和网络进行能力扩充的 `/expand` |
| **v1.2**（Epic 12） | ✅ 已完成 | `/reset`、面试准备框架、ADR-0004 门户适配器模式 + 示例、研究代理 |
| **v2.0** | 💡 未来 | 模板市场、社区门户适配器、图形界面 |

完整计划请参阅 [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md)。

---

## 文档

**从这里开始 →** [`docs-site/`](docs-site/) — 文档**网站**：一份面向新手的整个产品指南（快速开始、全部命令、带实时演示的面板、你的数据、隐私、常见问题、术语表）。在 `docs-site/` 内用 `npm run dev` 本地运行它，或用 `npm run build` 构建为静态站点。

工程文档（规范、架构、计划）：

| 路径 | 内容 |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | 完整的功能需求（`REQ-####` ID） |
| [`docs/architecture/`](docs/architecture/) | 技术栈、组件设计、ADR |
| [`docs/plan/`](docs/plan/) | 里程碑、Epic、工作分解 |
| [`docs/development/`](docs/development/) | 编码规范、项目结构、贡献指南 |
| [`docs/testing/`](docs/testing/) | 测试策略、测试用例（`TC-####` ID） |
| [`docs/glossary.md`](docs/glossary.md) | 权威术语 |

---

## 参与贡献

欢迎贡献 — 新的简历/求职信模板、本地化语言包、门户适配器、错误修复和文档改进都大有帮助。

> ⚠️ **请使用私有 fork。** 你的候选人档案与源代码位于同一目录中。请始终在私有 GitHub 仓库中工作，以使你的个人数据远离公共互联网。

完整指南、分支命名、PR 检查清单，以及如何添加新的招聘门户或本地化语言包，请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 许可证

MIT — 参阅 [LICENSE](LICENSE)。 ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
