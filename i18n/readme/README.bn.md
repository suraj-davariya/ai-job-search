_এটি একটি সম্প্রদায়/মেশিন-সহায়তায় তৈরি অনুবাদ (বিটা)। প্রামাণিক সংস্করণ হলো [ইংরেজি README](../../README.md) — যেকোনো পার্থক্য বা সন্দেহের ক্ষেত্রে ইংরেজি সংস্করণকেই চূড়ান্ত হিসেবে গণ্য করা হবে।_

<div align="center">

# CareerForge

**একটি AI চাকরি-খোঁজ সহায়ক যা পোস্টিং খুঁজে বের করে, অনুকূলিত CV ও কভার লেটার লেখে, এবং সেগুলোকে প্রিন্ট-প্রস্তুত PDF-তে সংকলন করে — সবকিছুই আপনার নিজের মেশিনে।**

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

> **এখানে নতুন? গাইড দিয়ে শুরু করুন।** CareerForge বোঝার সবচেয়ে সহজ উপায় হলো ডকুমেন্টেশন সাইট — Quick Start, সব কয়টি কমান্ড, সরাসরি ডেমো সহ ড্যাশবোর্ড, প্রাইভেসি, এবং FAQ। এটি পড়তে কোনো প্রোগ্রামিং জ্ঞানের প্রয়োজন নেই।
>
> - 🌐 **এখনই পড়ুন:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — হোস্টেড, ইনস্টল করার কিছু নেই।
> - 📊 **ড্যাশবোর্ডে ঘুরে দেখুন:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — কাল্পনিক নমুনা ডেটার উপর আসল UI, শুধু-পঠন।
> - 💻 **স্থানীয়ভাবে চালাতে চান?** [`docs-site/`](docs-site/)-এর ভিতরে `npm run dev` চালান (অথবা এক-কমান্ড স্ট্যাটিক বিল্ডের জন্য [এর README](docs-site/README.md) দেখুন)।

## এটি কী?

CareerForge হলো একটি চাকরি-খোঁজ টুলকিট যা আপনি **Claude Code**-এর ভিতরে চালান — একটি AI সহায়ক যা আপনার টার্মিনালে বাস করে। আপনি কমান্ড ও সাধারণ ইংরেজি প্রম্পট টাইপ করেন; AI কাজটি করে দেয়। কোনো প্রোগ্রামিং জ্ঞানের প্রয়োজন নেই।

আজ এটি আপনার জন্য যা করতে পারে:

| ধাপ | আপনি বলেন | যা ঘটে |
|------|---------|-------------|
| **১. আপনার প্রোফাইল তৈরি করুন** | `/setup` | Claude আপনার বিদ্যমান CV, LinkedIn এক্সপোর্ট, ডিপ্লোমা পড়ে, বা আপনার ইন্টারভিউ নেয় — তারপর আপনার প্রার্থী প্রোফাইল লেখে |
| **২. নতুন চাকরি খুঁজুন** | `/search` | Claude আপনার কনফিগার করা চাকরির পোর্টালে খোঁজে, আগে দেখা চাকরিগুলোর সাথে ডিডুপ্লিকেট করে, প্রতিটিকে উপযুক্ততার জন্য স্কোর দেয়, এবং একটি র‍্যাঙ্কড টেবিল দেখায় |
| **৩. আবেদন করুন** | `/apply <url or paste>` | Claude আপনার উপযুক্ততা স্কোর করে, আপনার CV অনুকূলিত করে, পোস্টিংয়ের ভাষায় একটি কভার লেটার লেখে, একটি দ্বিতীয় AI পর্যালোচক দুটিরই সমালোচনা করে, সম্পাদনাগুলো প্রয়োগ করে, দুটি PDF সংকলন করে, এবং একটি চূড়ান্ত যাচাই চেকলিস্ট চালায় |

> **আপনার ডেটা কখনো আপনার মেশিন ছাড়ে না।** আপনার প্রোফাইল, CV, কভার লেটার, এবং আবেদন লগ সবই স্থানীয়ভাবে সংরক্ষিত থাকে এবং কখনো git-এ কমিট করা হয় না।

---

## এটি কীভাবে কাজ করে — ৩-মিনিটের সংস্করণ

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

**CareerForge যা করে না:**
- আপনার পক্ষে আবেদন জমা দেয় না (আপনি পর্যালোচনা করে পাঠান)
- আপনার নেই এমন দক্ষতা বা অভিজ্ঞতা বানিয়ে তোলে না
- ক্লাউডে কিছু আপলোড করে না

---

## আপনার যা প্রয়োজন

### 1. Claude Code

Claude Code হলো সেই AI সহায়ক যা CareerForge চালায়। একবার ইনস্টল করুন:

```bash
npm install -g @anthropic-ai/claude-code
```

তারপর লগ ইন করুন:

```bash
claude
```

Claude Code-এর জন্য একটি [Anthropic account](https://claude.ai) প্রয়োজন। Free এবং Pro উভয় প্ল্যানই কাজ করে; ভারী ব্যবহারের জন্য Pro সুপারিশ করা হয়।

> **Claude Code কী তা নিশ্চিত নন?** এটিকে একটি স্মার্ট টার্মিনাল সহায়ক হিসেবে ভাবুন যা ফাইল পড়তে, ওয়েবে খুঁজতে, এবং কমান্ড চালাতে পারে — CareerForge নির্দেশাবলী দ্বারা পরিচালিত।

### 2. LaTeX (PDF তৈরির জন্য)

CareerForge LaTeX ব্যবহার করে আপনার CV ও কভার লেটার PDF-তে সংকলন করে। দুটি কম্পাইলার প্রয়োজন:

| Compiler | যার জন্য ব্যবহৃত | কেন |
|----------|----------|-----|
| `lualatex` | CV | `fontawesome` ও `lato` প্যাকেজের জন্য প্রয়োজনীয় |
| `xelatex` | কভার লেটার | বান্ডিল করা ফন্টের জন্য `fontspec`-এর প্রয়োজনীয় |

**macOS** (সুপারিশকৃত — উভয় কম্পাইলার ইনস্টল করে):
```bash
brew install --cask mactex
```
অথবা [tug.org/mactex](https://www.tug.org/mactex/) থেকে ডাউনলোড করুন।

ইনস্টল করার পর, অতিরিক্ত CV প্যাকেজগুলো যোগ করুন:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** [MiKTeX](https://miktex.org/download) ইনস্টল করুন — এটি অনুপস্থিত প্যাকেজগুলো স্বয়ংক্রিয়ভাবে আনে।

### 3. Python 3.10+ _(ঐচ্ছিক — বেতন বেঞ্চমার্কিংয়ের জন্য)_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## Quick Start

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

## কমান্ডসমূহ বিস্তারিত

### `/setup` — আপনার প্রার্থী প্রোফাইল তৈরি করুন

আপনার আসল ডেটা থেকে সাতটি প্রোফাইল ফাইল পূরণ করে। Claude প্রশ্ন করে বা আপনার নথি পড়ে — ফাইল থাকলে কোনো টাইপিং নেই।

**তিনটি অনবোর্ডিং পথ:**

| পথ | কখন ব্যবহার করবেন |
|------|-------------|
| **A — নথি স্ক্যান** | আপনার `documents/` ফোল্ডারে CV, LinkedIn এক্সপোর্ট, ডিপ্লোমা, বা রেফারেন্স লেটার আছে |
| **B — একটি CV আমদানি** | আপনার একটি পরিষ্কার CV আছে এবং দ্রুত শুরু করতে চান |
| **C — সরাসরি ইন্টারভিউ** | নতুন করে শুরু করছেন; Claude আপনার ইন্টারভিউ নেয় |

**উদাহরণ প্রম্পট:**

```
/setup
```
```
/setup --section search
```
> _(পুরো ইন্টারভিউ পুনরায় না চালিয়ে সরাসরি আপনার লক্ষ্য চাকরির পোর্টাল ও অবস্থানের পছন্দ হালনাগাদে চলে যায়।)_

```
/setup --section experience
```
> _(শুধু আপনার কাজের ইতিহাস হালনাগাদ করে — চাকরি পরিবর্তনের পর কাজে লাগে।)_

**যা তৈরি হয়:**

| ফাইল | বিষয়বস্তু |
|------|---------|
| `01-candidate-profile.md` | পরিচয়, শিক্ষা, কাজের ইতিহাস, দক্ষতা, প্রকল্প |
| `02-behavioral-profile.md` | কাজের ধরন, সংস্কৃতির পছন্দ, প্রেরণা |
| `03-writing-style.md` | _(স্থির কাঠামো — কোনো ব্যক্তিগত ডেটা নেই)_ |
| `04-job-evaluation.md` | আপনার শক্তিশালী/দুর্বল ক্ষেত্র, ক্যারিয়ার লক্ষ্য |
| `05-cv-templates.md` | পদের ধরন অনুযায়ী প্রোফাইল বিবৃতি |
| `06-cover-letter-templates.md` | _(স্থির টেমপ্লেট)_ |
| `07-interview-prep.md` | আপনার অভিজ্ঞতা থেকে STAR গল্প |
| `search-queries.md` | আপনার লক্ষ্য চাকরির পোর্টাল, কোয়েরি, অবস্থান স্তর |

---

### `/search` — নতুন চাকরির পোস্টিং খুঁজুন

ওয়েব সার্চের মাধ্যমে আপনার কনফিগার করা চাকরির পোর্টালে খোঁজে, আগে দেখা চাকরিগুলোর সাথে ডিডুপ্লিকেট করে, একটি উপযুক্ততা সংকেত (High / Medium / Low) নির্ধারণ করে, এবং একটি র‍্যাঙ্কড টেবিল উপস্থাপন করে। আপনি একটি নম্বর বাছাই করলে, চাকরিটি সরাসরি `/apply`-তে হস্তান্তর করা হয়।

**আর্গুমেন্ট:**

| সিনট্যাক্স | আচরণ |
|--------|-----------|
| `/search` | আপনার শীর্ষ ৩টি অগ্রাধিকার কোয়েরি বিভাগ চালায় |
| `/search data science` | "data science" এর সাথে মিলে এমন বিভাগগুলোকে অগ্রাধিকার দেয় |
| `/search broad` | সব কনফিগার করা কোয়েরি বিভাগ চালায় |

**উদাহরণ প্রম্পট:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**উদাহরণ আউটপুট:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **সব পোর্টাল আপনার কনফিগ থেকে আসে।** কিছুই হার্ডকোড করা নেই — যেকোনো জব বোর্ড (LinkedIn, Indeed, Jobindex, Stepstone, ইত্যাদি) `search-queries.md`-তে যোগ করুন এবং তা স্বয়ংক্রিয়ভাবে অন্তর্ভুক্ত হবে।

---

### `/apply` — একটি অনুকূলিত CV ও কভার লেটার তৈরি করুন

একটি চাকরির URL বা পেস্ট করা বিবরণ নেয় এবং সম্পূর্ণ আবেদন পাইপলাইন চালায়:

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**আর্গুমেন্ট:**

| আর্গুমেন্ট | আচরণ |
|----------|-----------|
| _(ডিফল্ট)_ | পর্যালোচক সহ সম্পূর্ণ পাইপলাইন (`--review=full`) |
| `--review=quick` | পর্যালোচক কোম্পানি গবেষণা এড়িয়ে যায় — দ্রুততর, কম খরচে |
| `--review=none` | পর্যালোচক সম্পূর্ণ এড়িয়ে যায় — দ্রুততম, সর্বনিম্ন খরচে |

**উদাহরণ প্রম্পট:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

অথবা চাকরির বিবরণ সরাসরি পেস্ট করুন:

```
/apply
[paste job description here]
```

**আপনি যা পান:**

| আউটপুট | অবস্থান |
|--------|---------|
| CV (PDF, ২ পৃষ্ঠা, ইংরেজি) | `cv/main_<company>.pdf` |
| কভার লেটার (PDF, ১ পৃষ্ঠা, পোস্টিংয়ের ভাষা) | `cover_letters/cover_<company>_<role>.pdf` |
| আবেদন সারি | `job_search_tracker.csv` |
| উপযুক্ততা মূল্যায়ন | কথোপকথনে |

**উপযুক্ততা স্কোরিং (৫টি মাত্রা):**

| মাত্রা | ওজন |
|-----------|--------|
| কারিগরি দক্ষতার মিল | 30% |
| ক্যারিয়ার সামঞ্জস্য | 30% |
| অভিজ্ঞতার মিল | 25% |
| আচরণগত / সাংস্কৃতিক উপযুক্ততা | 15% |
| অবস্থান ও লজিস্টিকস | Pass / Fail |

রায়: **Strong** (75+) · **Good** (60–74) · **Moderate** (45–59) · **Weak** (30–44) · **Poor** (<30)

> **ভাষার নিয়ম:** কভার লেটার সর্বদা চাকরির পোস্টিংয়ের ভাষায় লেখা হয়। একটি ডেনিশ পোস্টিং → ডেনিশ কভার লেটার। CV সর্বদা ইংরেজিতে থাকে।

---

### `/upskill` — আপনার দক্ষতার ঘাটতি ও তা পূরণের পরিকল্পনা খুঁজুন

আপনার প্রোফাইলকে চাহিদার সাথে তুলনা করে এবং একটি অগ্রাধিকার-ভিত্তিক ঘাটতি হিটম্যাপ, **আসল, ওয়েবে-অনুসন্ধান করা** সংস্থান থেকে তৈরি একটি শেখার পরিকল্পনা, এবং নির্ভরতা-সচেতন অধ্যয়ন ক্রম তৈরি করে — তারপর এর সবকিছু একটি রিপোর্ট হিসেবে সংরক্ষণ করে যা ড্যাশবোর্ড আপনাকে দেখাতে পারে।

**দুটি মোড:**

| সিনট্যাক্স | মোড | যা এটি বিশ্লেষণ করে |
|--------|------|------------------|
| `/upskill` | সমষ্টিগত | আপনার ট্র্যাকারের প্রতিটি চাকরি, এমনভাবে ওজন দেওয়া যাতে আপনি *সবচেয়ে কম* উপযুক্ত পদগুলো সবচেয়ে বেশি গণ্য হয় |
| `/upskill <url>` | লক্ষ্যভিত্তিক | একটি পোস্টিং (URL না আনলে টেক্সট পেস্ট করুন) |

**আপনি যা পান:**

| আউটপুট | অবস্থান |
|--------|---------|
| ঘাটতি হিটম্যাপ (Critical / High / Medium / Low) | কথোপকথনে |
| শেখার পরিকল্পনা — প্রতি ঘাটতিতে ২–৩টি সংস্থান, অধ্যয়নের দিকনির্দেশ + সময় অনুমান সহ | রিপোর্টে |
| মোট সময় সহ অধ্যয়ন ক্রম | রিপোর্টে |
| সংরক্ষিত রিপোর্ট (সমষ্টিগত মোডে গত-রানের পর থেকে পার্থক্য সহ) | `upskill/report-*.md` |

রিপোর্টগুলো ড্যাশবোর্ডের **Upskill** ট্যাবে দেখা যায়। কিছুই বানিয়ে তোলা হয় না — প্রতিটি সংস্থান একটি লাইভ ওয়েব সার্চ থেকে আসে, এবং একটি খালি ট্র্যাকার একটি খালি রিপোর্টের পরিবর্তে লক্ষ্যভিত্তিক মোডের দিকে একটি সৎ ইঙ্গিত পায়।

---

### `/expand` — আপনি ইতিমধ্যে যা করেছেন তা থেকে আপনার প্রোফাইল বাড়ান

আপনার কাছে আছে কিন্তু লিখে রাখেননি এমন দক্ষতা খুঁজে বের করে — আপনার নথি, আপনার সর্বজনীন **GitHub** রিপো, এবং ওয়েব থেকে — এবং সেগুলো আপনার প্রোফাইলে **যোগ** করে। এটি কখনো ইতিমধ্যে থাকা কিছু সম্পাদনা বা মুছে ফেলে না।

**এটি কীভাবে কাজ করে:**

1. **স্ক্যান করে** `documents/`, আপনার GitHub রিপোজিটরি (README, ভাষা, টপিক), এবং অন্যান্য প্রোফাইল লিঙ্ক (পোর্টফোলিও, Kaggle, Scholar)।
2. **সমৃদ্ধ করে** প্রতিটি খুঁজে পাওয়া বিষয় ওয়েব সার্চের মাধ্যমে — একটি সরাসরি লুকআপ (কোর্স সিলেবাস, সার্টিফিকেশন দক্ষতা তালিকা, টুল ডকস) এবং কাজটি যে পদ্ধতি ও টুলচেইন বোঝায় সে সম্পর্কে অনুমান, উভয়ই।
3. **আপনাকে একটি দক্ষতার মানচিত্র দেখায়** বিভাগ অনুযায়ী গোষ্ঠীবদ্ধ, প্রতিটি আইটেম তার উৎসে চিহ্নিত এবং সরাসরি / অনুমিত হিসেবে চিহ্নিত — কিছু লেখার *আগে* আপনার পর্যালোচনার জন্য।
4. **শুধু যা আপনি অনুমোদন করেন তা যোগ করে**, প্রতিটির সাথে একটি উৎস নোট যেমন *(Coursera — Deep Learning Specialisation)*। সেই নোটগুলো পুনরায় চালানোকে আইডেমপোটেন্ট করে, এবং অনুমিত আচরণগত বৈশিষ্ট্যগুলো স্পষ্টভাবে লেবেল করা হয়।

**উদাহরণ প্রম্পট:**

```
/expand
```
```
/expand github
```
> _(খনন করার উৎস হিসেবে আপনার GitHub রিপোজিটরিগুলোকে অগ্রাধিকার দেয়।)_

যেহেতু প্রতিটি সংযোজন additive এবং উৎস-চিহ্নিত, আপনি একটি নতুন কোর্স বা প্রকল্পের পরে আবার `/expand` চালাতে পারেন এবং এটি শুধু সত্যিকারের নতুন যা তা-ই আনে।

---

### `/reset` — নিরাপদে নতুন করে শুরু করুন

আপনার ব্যক্তিগত ডেটা মুছে ফেলে যাতে আপনি আবার শুরু করতে পারেন — একটি নতুন ক্যারিয়ার দিক, একটি নতুন প্রোফাইল, বা রিপোটি অন্য কাউকে হস্তান্তর — CareerForge-কে কাজ করানো কাঠামোতে **স্পর্শ না করেই**।

**পরিসর:**

| সিনট্যাক্স | যা মুছে ফেলে |
|--------|--------|
| `/reset profile` | আপনার প্রোফাইল স্কিল ফাইল (খালি টেমপ্লেটে ফিরে) |
| `/reset documents` | `documents/`-এ আপনার ফাইল (ফোল্ডার কাঠামো + README রাখা হয়) |
| `/reset all` | উভয়ই |

এটি সর্বদা **প্রথমে আপনাকে একটি তালিকা দেখায়** (যা মুছে ফেলা হবে বনাম যা সংরক্ষিত থাকবে), এবং **আপনি বড় হাতের অক্ষরে `RESET` টাইপ না করা পর্যন্ত কিছুই ঘটে না** — অন্য যেকোনো উত্তর বাতিল করে। লেখার-শৈলী গাইড, স্কোরিং কাঠামো, কভার-লেটার টেমপ্লেট, এবং ইন্টারভিউ-প্রস্তুতি কাঠামো কখনো স্পর্শ করা হয় না; শুধু আপনার ডেটা মুছে ফেলা হয়। কোনো আনডু নেই, তাই এটি পুনরুদ্ধারের একমাত্র উপায় হিসেবে আপনাকে আপনার git ইতিহাসের দিকে নির্দেশ করে, তারপর পুনর্নির্মাণের জন্য `/setup` চালানোর পরামর্শ দেয়।

---

## ট্র্যাকিং ড্যাশবোর্ড

একটি শুধুমাত্র-স্থানীয় ওয়েব UI যা **আপনার `job_search_tracker.csv`-কে সত্যের একক উৎস হিসেবে পড়ে এবং পারমাণবিকভাবে লেখে**, আপনার পাইপলাইনকে দৃশ্যমান করে, এবং ব্রাউজার থেকে CLI (`/apply`, `/upskill`, বেতন লুকআপ) চালাতে পারে। এটি একটি ঐচ্ছিক সঙ্গী — এটি মুছে ফেললে আপনার ডেটা ও `/apply` পাইপলাইন অক্ষত থাকে।

> **ইনস্টল না করেই চেষ্টা করুন →** [**Live demo**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — কাল্পনিক নমুনা ডেটা সহ একটি শুধু-পঠন ভ্রমণ। সেখানে সম্পাদনা, কনসোল, এবং PDF প্রিভিউ নিষ্ক্রিয় (এগুলোর জন্য অ্যাপটি স্থানীয়ভাবে চালু থাকা প্রয়োজন); বাকি সবকিছু আসল UI।

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| পৃষ্ঠা | যা এটি করে |
|---------|--------------|
| **Applications** | ট্র্যাকার সাজান/ফিল্টার/খুঁজুন; ইনলাইন স্ট্যাটাস + নোট সম্পাদনা (পারমাণবিক, স্টেট-মেশিন-সুরক্ষিত); `+ New`; সুরক্ষিত PDF প্রিভিউ সহ বিস্তারিত ড্রয়ার |
| **Overview** | KPI কার্ড (মোট, ৭দিন/৩০দিনে আবেদন, গড় উপযুক্ততা, ইন্টারভিউ হার) + সাপ্তাহিক/স্ট্যাটাস/উপযুক্ততা/ক্যালেন্ডার চার্ট — নমুনা ফ্লোর পূরণ না হলে সৎ `—` |
| **Console** | অনুমোদিত কমান্ড চালান এবং তাদের আউটপুট সরাসরি স্ট্রিম করুন; কোম্পানি-প্রতি `/apply`, `/upskill`, এবং বেতন লুকআপ পুনরায় চালান |
| **Companies · Salary · Upskill · Profile · Settings** | গোষ্ঠীবদ্ধ/বেঞ্চমার্ক করা/রিপোর্ট/প্রোফাইল ভিউ; থিম + শুধু-পঠন পছন্দ |

**নকশা অনুযায়ী স্থানীয়:** শুধুমাত্র `127.0.0.1`-এ বাঁধে (কোনো LAN নেই, কোনো auth নেই, কোনো অ্যাকাউন্ট নেই), কোনো বহির্গামী নেটওয়ার্ক কল করে না, কোনো শেল ছাড়াই একটি নির্দিষ্ট অনুমোদিত তালিকার মাধ্যমে কমান্ড চালায়, এবং কোনো গোপন তথ্য সংরক্ষণ করে না। একটি `--read-only` মোড প্রতিটি সম্পাদনা ও ক্রিয়া নিষ্ক্রিয় করে। দেখুন [`dashboard/README.md`](dashboard/README.md) এবং [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md)।

> Node 18+ প্রয়োজন। অ্যাকশন স্তর (ব্রাউজার থেকে কমান্ড চালানো) `PATH`-এ `claude` এবং/অথবা `python3` বাইনারি প্রয়োজন; অনুপস্থিত থাকলে, সেই ট্রিগারগুলো নিষ্ক্রিয় হয় এবং বাকিটা কাজ করতে থাকে।

---

> **সব পরিকল্পিত কমান্ড ছাড়া হয়েছে।** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand`, এবং `/reset` সবই লাইভ (v1.0–v1.2)। পরে কী আসছে তার জন্য [Roadmap](#roadmap) দেখুন।

---

## উদাহরণ সেশন

এখানে একটি বাস্তবসম্মত প্রান্ত-থেকে-প্রান্ত ভ্রমণ।

**১. প্রথমবার সেটআপ**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**২. চাকরি খোঁজা**

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

**৩. আবেদন করা**

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

## প্রাইভেসি

| ডেটা | যেখানে থাকে | git-এ কমিট করা? |
|------|----------------|-------------------|
| প্রার্থী প্রোফাইল | `.claude/skills/job-application-assistant/` | না |
| তৈরি করা CV ও কভার লেটার | `cv/output/`, `cover_letters/output/` | না |
| আবেদন ট্র্যাকার | `job_search_tracker.csv` | না |
| দেখা-চাকরির রেজিস্ট্রি | `job_scraper/seen_jobs.json` | না |
| উৎস নথি | `documents/` | না |
| বেতন ডেটা | `salary_data.json` | না |

`.gitignore` এই সব বর্জন প্রয়োগ করে। আপনি যদি আপনার ফর্ক GitHub-এ পুশ করেন, **একটি প্রাইভেট রিপোজিটরি ব্যবহার করুন** যাতে আপনার প্রোফাইল ফাইল কখনো উন্মুক্ত না হয়।

---

## ডিরেক্টরি কাঠামো

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

## টেমপ্লেট ম্যানুয়ালি সংকলন করা

আপনি যদি LaTeX টেমপ্লেটগুলো স্বাধীনভাবে পরীক্ষা করতে চান:

**CV** (`cv/` ডিরেক্টরি থেকে চালান):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**কভার লেটার** (`cover_letters/` থেকে চালান — ফন্ট লোডিংয়ের জন্য কার্যকরী ডিরেক্টরি গুরুত্বপূর্ণ):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Roadmap

| মাইলফলক | স্ট্যাটাস | যা ছাড়া হয় |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ সম্পূর্ণ | `/setup`, `/apply` (পর্যালোচক ছাড়া), PDF সংকলন |
| **v1.0** (Epics 6–8) | ✅ সম্পূর্ণ | পর্যালোচক এজেন্ট, `/search`, আবেদন ট্র্যাকার |
| **v1.0 — Dashboard** (Epic 9) | ✅ সম্পূর্ণ | `127.0.0.1:4480`-এ স্থানীয় ট্র্যাকিং ড্যাশবোর্ড — ট্র্যাকার দেখুন/সম্পাদনা করুন, অ্যানালিটিক্স, ব্রাউজার থেকে কমান্ড চালান |
| **v1.1** (Epics 10–11) | ✅ সম্পূর্ণ | `/upskill` দক্ষতা-ঘাটতি বিশ্লেষণ + শেখার পরিকল্পনা, এবং আপনার নথি, GitHub, ও ওয়েব থেকে `/expand` দক্ষতা সম্প্রসারণ |
| **v1.2** (Epic 12) | ✅ সম্পূর্ণ | `/reset`, ইন্টারভিউ-প্রস্তুতি কাঠামো, ADR-0004 পোর্টাল-অ্যাডাপ্টার প্যাটার্ন + উদাহরণ, গবেষণা এজেন্ট |
| **v2.0** | 💡 ভবিষ্যৎ | টেমপ্লেট মার্কেটপ্লেস, সম্প্রদায় পোর্টাল অ্যাডাপ্টার, GUI |

সম্পূর্ণ পরিকল্পনা দেখুন [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md)-এ।

---

## ডকুমেন্টেশন

**এখান থেকে শুরু করুন →** [`docs-site/`](docs-site/) — ডকুমেন্টেশন **ওয়েবসাইট**: সম্পূর্ণ পণ্যের একটি নবাগত-প্রথম গাইড (Quick Start, সব কয়টি কমান্ড, সরাসরি ডেমো সহ ড্যাশবোর্ড, আপনার ডেটা, প্রাইভেসি, FAQ, শব্দকোষ)। `docs-site/`-এর ভিতরে `npm run dev` দিয়ে স্থানীয়ভাবে চালান, অথবা `npm run build` দিয়ে স্ট্যাটিক বিল্ড করুন।

ইঞ্জিনিয়ারিং ডকুমেন্টেশন (স্পেসিফিকেশন, আর্কিটেকচার, পরিকল্পনা):

| পাথ | বিষয়বস্তু |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | সম্পূর্ণ কার্যকরী প্রয়োজনীয়তা (`REQ-####` IDs) |
| [`docs/architecture/`](docs/architecture/) | প্রযুক্তি স্ট্যাক, কম্পোনেন্ট নকশা, ADRs |
| [`docs/plan/`](docs/plan/) | মাইলফলক, এপিক, কাজের বিভাজন |
| [`docs/development/`](docs/development/) | কোডিং মান, প্রকল্প কাঠামো, অবদান গাইড |
| [`docs/testing/`](docs/testing/) | পরীক্ষার কৌশল, টেস্ট কেস (`TC-####` IDs) |
| [`docs/glossary.md`](docs/glossary.md) | প্রামাণিক পরিভাষা |

---

## অবদান

অবদান স্বাগত — নতুন CV/কভার-লেটার টেমপ্লেট, লোকেল প্যাক, পোর্টাল অ্যাডাপ্টার, বাগ ফিক্স, এবং ডকুমেন্টেশন উন্নতি সবই সাহায্য করে।

> ⚠️ **একটি প্রাইভেট ফর্ক ব্যবহার করুন।** আপনার প্রার্থী প্রোফাইল সোর্স কোডের একই ডিরেক্টরিতে থাকে। আপনার ব্যক্তিগত ডেটা সর্বজনীন ইন্টারনেট থেকে দূরে রাখতে সর্বদা একটি প্রাইভেট GitHub রিপোজিটরিতে কাজ করুন।

সম্পূর্ণ গাইড, ব্রাঞ্চ নামকরণ, PR চেকলিস্ট, এবং কীভাবে একটি নতুন চাকরির পোর্টাল বা লোকেল যোগ করতে হয় তার জন্য দেখুন [CONTRIBUTING.md](CONTRIBUTING.md)।

---

## লাইসেন্স

MIT — দেখুন [LICENSE](LICENSE)। ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
