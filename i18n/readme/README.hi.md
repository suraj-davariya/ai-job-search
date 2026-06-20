_यह एक समुदाय/मशीन-सहायता प्राप्त अनुवाद (बीटा) है। प्रामाणिक संस्करण [अंग्रेज़ी README](../../README.md) है — किसी भी अंतर या संदेह की स्थिति में अंग्रेज़ी संस्करण को ही अंतिम माना जाए।_

<div align="center">

# CareerForge

**एक AI नौकरी-खोज सहायक जो पोस्टिंग खोजता है, अनुकूलित CV और कवर लेटर लिखता है, और उन्हें प्रिंट-तैयार PDF में संकलित करता है — सब कुछ आपकी अपनी मशीन पर।**

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

> **यहाँ नए हैं? गाइड से शुरुआत करें।** CareerForge को समझने का सबसे आसान तरीका दस्तावेज़ीकरण साइट है — Quick Start, सभी तीन कमांड, लाइव डेमो वाला डैशबोर्ड, गोपनीयता, और FAQ। इसे पढ़ने के लिए किसी प्रोग्रामिंग की ज़रूरत नहीं।
>
> - 🌐 **अभी पढ़ें:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — होस्टेड, कुछ भी इंस्टॉल करने की ज़रूरत नहीं।
> - 📊 **डैशबोर्ड पर क्लिक करके देखें:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — काल्पनिक नमूना डेटा पर असली UI, केवल-पढ़ने योग्य।
> - 💻 **स्थानीय पसंद है?** [`docs-site/`](docs-site/) के अंदर `npm run dev` चलाएँ (या एक-कमांड स्थिर बिल्ड के लिए [इसका README](docs-site/README.md) देखें)।

## यह क्या है?

CareerForge एक नौकरी-खोज टूलकिट है जिसे आप **Claude Code** के अंदर चलाते हैं — एक AI सहायक जो आपके टर्मिनल में रहता है। आप कमांड और सरल अंग्रेज़ी में प्रॉम्प्ट टाइप करते हैं; काम AI करता है। किसी प्रोग्रामिंग ज्ञान की आवश्यकता नहीं।

आज यह आपके लिए जो कर सकता है, वह यहाँ है:

| चरण | आप कहते हैं | क्या होता है |
|------|---------|-------------|
| **1. अपनी प्रोफ़ाइल बनाएँ** | `/setup` | Claude आपका मौजूदा CV, LinkedIn एक्सपोर्ट, डिप्लोमा पढ़ता है, या आपका साक्षात्कार लेता है — फिर आपकी उम्मीदवार प्रोफ़ाइल लिखता है |
| **2. नई नौकरियाँ खोजें** | `/search` | Claude आपके कॉन्फ़िगर किए गए जॉब पोर्टल खोजता है, पहले देखी गई नौकरियों के विरुद्ध डुप्लिकेट हटाता है, हर एक को मेल के लिए स्कोर करता है, और आपको एक रैंक की गई तालिका दिखाता है |
| **3. आवेदन करें** | `/apply <url or paste>` | Claude आपका मेल स्कोर करता है, आपका CV अनुकूलित करता है, पोस्टिंग की भाषा में कवर लेटर लिखता है, दूसरे AI समीक्षक से दोनों की समीक्षा कराता है, संपादन लागू करता है, दो PDF संकलित करता है, और एक अंतिम सत्यापन चेकलिस्ट चलाता है |

> **आपका डेटा कभी आपकी मशीन से बाहर नहीं जाता।** आपकी प्रोफ़ाइल, CV, कवर लेटर और आवेदन लॉग सभी स्थानीय रूप से संग्रहीत होते हैं और कभी git में कमिट नहीं किए जाते।

---

## यह कैसे काम करता है — 3-मिनट का संस्करण

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

**CareerForge जो नहीं करता:**
- आपकी ओर से आवेदन जमा करना (आप समीक्षा करके भेजते हैं)
- ऐसे कौशल या अनुभव गढ़ना जो आपके पास नहीं हैं
- क्लाउड पर कुछ भी अपलोड करना

---

## आपको क्या चाहिए

### 1. Claude Code

Claude Code वह AI सहायक है जो CareerForge चलाता है। इसे एक बार इंस्टॉल करें:

```bash
npm install -g @anthropic-ai/claude-code
```

फिर लॉग इन करें:

```bash
claude
```

Claude Code के लिए एक [Anthropic खाता](https://claude.ai) आवश्यक है। Free और Pro दोनों योजनाएँ काम करती हैं; भारी उपयोग के लिए Pro की अनुशंसा की जाती है।

> **Claude Code क्या है, इस बारे में अनिश्चित हैं?** इसे एक स्मार्ट टर्मिनल सहायक समझें जो फ़ाइलें पढ़ सकता है, वेब खोज सकता है, और कमांड चला सकता है — CareerForge निर्देशों द्वारा निर्देशित।

### 2. LaTeX (PDF निर्माण के लिए)

CareerForge आपके CV और कवर लेटर को LaTeX का उपयोग करके PDF में संकलित करता है। दो कंपाइलर आवश्यक हैं:

| कंपाइलर | किसके लिए | क्यों |
|----------|----------|-----|
| `lualatex` | CV | `fontawesome` और `lato` पैकेजों के लिए आवश्यक |
| `xelatex` | कवर लेटर | बंडल किए गए फ़ॉन्ट के लिए `fontspec` हेतु आवश्यक |

**macOS** (अनुशंसित — दोनों कंपाइलर इंस्टॉल करता है):
```bash
brew install --cask mactex
```
या [tug.org/mactex](https://www.tug.org/mactex/) से डाउनलोड करें।

इंस्टॉल करने के बाद, अतिरिक्त CV पैकेज जोड़ें:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** [MiKTeX](https://miktex.org/download) इंस्टॉल करें — यह छूटे हुए पैकेज स्वतः प्राप्त कर लेता है।

### 3. Python 3.10+ _(वैकल्पिक — वेतन बेंचमार्किंग के लिए)_

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

## कमांड विस्तार से

### `/setup` — अपनी उम्मीदवार प्रोफ़ाइल बनाएँ

आपके असली डेटा से सात प्रोफ़ाइल फ़ाइलें भरता है। Claude प्रश्न पूछता है या आपके दस्तावेज़ पढ़ता है — यदि आपके पास फ़ाइलें हैं तो टाइप करने की ज़रूरत नहीं।

**तीन ऑनबोर्डिंग रास्ते:**

| रास्ता | कब उपयोग करें |
|------|-------------|
| **A — दस्तावेज़ स्कैन करें** | आपके पास `documents/` फ़ोल्डर में CV, LinkedIn एक्सपोर्ट, डिप्लोमा, या संदर्भ पत्र हैं |
| **B — CV आयात करें** | आपके पास एक साफ़-सुथरा CV है और आप तेज़ शुरुआत चाहते हैं |
| **C — लाइव साक्षात्कार** | शून्य से शुरुआत; Claude आपका साक्षात्कार लेता है |

**उदाहरण प्रॉम्प्ट:**

```
/setup
```
```
/setup --section search
```
> _(पूरा साक्षात्कार दोबारा चलाए बिना सीधे आपके लक्षित जॉब पोर्टल और स्थान प्राथमिकताओं को अद्यतन करने पर जाता है।)_

```
/setup --section experience
```
> _(केवल आपका कार्य इतिहास अद्यतन करता है — नौकरी बदलने के बाद उपयोगी।)_

**क्या बनता है:**

| फ़ाइल | सामग्री |
|------|---------|
| `01-candidate-profile.md` | पहचान, शिक्षा, कार्य इतिहास, कौशल, प्रोजेक्ट |
| `02-behavioral-profile.md` | कार्यशैली, संस्कृति प्राथमिकताएँ, प्रेरणाएँ |
| `03-writing-style.md` | _(स्थिर ढाँचा — कोई व्यक्तिगत डेटा नहीं)_ |
| `04-job-evaluation.md` | आपके मज़बूत/कमज़ोर क्षेत्र, करियर लक्ष्य |
| `05-cv-templates.md` | भूमिका प्रकार के अनुसार प्रोफ़ाइल कथन |
| `06-cover-letter-templates.md` | _(स्थिर टेम्पलेट)_ |
| `07-interview-prep.md` | आपके अनुभव से STAR कहानियाँ |
| `search-queries.md` | आपके लक्षित जॉब पोर्टल, क्वेरी, स्थान स्तर |

---

### `/search` — नई जॉब पोस्टिंग खोजें

वेब खोज के माध्यम से आपके कॉन्फ़िगर किए गए जॉब पोर्टल खोजता है, पहले देखी गई नौकरियों के विरुद्ध डुप्लिकेट हटाता है, एक मेल संकेत (High / Medium / Low) सौंपता है, और एक रैंक की गई तालिका प्रस्तुत करता है। जब आप कोई संख्या चुनते हैं, तो नौकरी सीधे `/apply` को सौंप दी जाती है।

**तर्क (Arguments):**

| सिंटैक्स | व्यवहार |
|--------|-----------|
| `/search` | आपकी शीर्ष 3 प्राथमिकता वाली क्वेरी श्रेणियाँ चलाता है |
| `/search data science` | "data science" से मेल खाती श्रेणियों को प्राथमिकता देता है |
| `/search broad` | सभी कॉन्फ़िगर की गई क्वेरी श्रेणियाँ चलाता है |

**उदाहरण प्रॉम्प्ट:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**उदाहरण आउटपुट:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **सभी पोर्टल आपके कॉन्फ़िग से आते हैं।** कुछ भी हार्डकोड नहीं है — `search-queries.md` में कोई भी जॉब बोर्ड (LinkedIn, Indeed, Jobindex, Stepstone, आदि) जोड़ें और यह स्वतः शामिल हो जाता है।

---

### `/apply` — एक अनुकूलित CV और कवर लेटर बनाएँ

एक जॉब URL या चिपकाया गया विवरण लेता है और पूरी आवेदन पाइपलाइन चलाता है:

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**तर्क (Arguments):**

| तर्क | व्यवहार |
|----------|-----------|
| _(डिफ़ॉल्ट)_ | समीक्षक के साथ पूरी पाइपलाइन (`--review=full`) |
| `--review=quick` | समीक्षक कंपनी शोध छोड़ देता है — तेज़, कम लागत |
| `--review=none` | समीक्षक पूरी तरह छोड़ें — सबसे तेज़, सबसे कम लागत |

**उदाहरण प्रॉम्प्ट:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

या जॉब विवरण सीधे चिपकाएँ:

```
/apply
[paste job description here]
```

**आपको क्या मिलता है:**

| आउटपुट | स्थान |
|--------|---------|
| CV (PDF, 2 पृष्ठ, अंग्रेज़ी) | `cv/main_<company>.pdf` |
| कवर लेटर (PDF, 1 पृष्ठ, पोस्टिंग भाषा) | `cover_letters/cover_<company>_<role>.pdf` |
| आवेदन पंक्ति | `job_search_tracker.csv` |
| मेल मूल्यांकन | बातचीत में |

**मेल स्कोरिंग (5 आयाम):**

| आयाम | भार |
|-----------|--------|
| तकनीकी कौशल मेल | 30% |
| करियर संरेखण | 30% |
| अनुभव मेल | 25% |
| व्यवहारिक / संस्कृति मेल | 15% |
| स्थान और लॉजिस्टिक्स | पास / फेल |

निर्णय: **मज़बूत** (75+) · **अच्छा** (60–74) · **मध्यम** (45–59) · **कमज़ोर** (30–44) · **खराब** (<30)

> **भाषा नियम:** कवर लेटर हमेशा जॉब पोस्टिंग की भाषा में लिखा जाता है। डेनिश पोस्टिंग → डेनिश कवर लेटर। CV हमेशा अंग्रेज़ी में होता है।

---

### `/upskill` — अपने कौशल अंतराल और उन्हें भरने की योजना खोजें

आपकी प्रोफ़ाइल की माँग से तुलना करता है और एक प्राथमिकता-क्रमित अंतराल हीटमैप, **असली, वेब-खोजे गए** संसाधनों से बनी एक सीखने की योजना, और एक निर्भरता-जागरूक अध्ययन क्रम बनाता है — फिर यह सब एक रिपोर्ट के रूप में सहेजता है जिसे डैशबोर्ड आपको दिखा सकता है।

**दो मोड:**

| सिंटैक्स | मोड | यह क्या विश्लेषण करता है |
|--------|------|------------------|
| `/upskill` | समग्र | आपके ट्रैकर की हर नौकरी, इस तरह भारित कि जिन भूमिकाओं के लिए आप *सबसे कम* मेल खाते हैं वे सबसे अधिक गिनी जाएँ |
| `/upskill <url>` | लक्षित | एक पोस्टिंग (यदि URL प्राप्त न हो तो पाठ चिपकाएँ) |

**आपको क्या मिलता है:**

| आउटपुट | स्थान |
|--------|---------|
| अंतराल हीटमैप (Critical / High / Medium / Low) | बातचीत में |
| सीखने की योजना — प्रति अंतराल 2–3 संसाधन, अध्ययन दिशा + समय अनुमान के साथ | रिपोर्ट में |
| कुल समय के साथ अध्ययन क्रम | रिपोर्ट में |
| सहेजी गई रिपोर्ट (समग्र मोड में पिछली-रन के बाद के अंतर के साथ) | `upskill/report-*.md` |

रिपोर्टें डैशबोर्ड के **Upskill** टैब में दिखाई देती हैं। कुछ भी गढ़ा नहीं जाता — हर संसाधन एक लाइव वेब खोज से आता है, और एक खाली ट्रैकर को खाली रिपोर्ट के बजाय लक्षित मोड की ओर एक ईमानदार संकेत मिलता है।

---

### `/expand` — आपके अब तक किए हर काम से अपनी प्रोफ़ाइल बढ़ाएँ

ऐसी दक्षताएँ खोजता है जो आपके पास हैं पर लिखी नहीं गईं — आपके दस्तावेज़ों, आपके सार्वजनिक **GitHub** रिपॉज़िटरी, और वेब से — और उन्हें आपकी प्रोफ़ाइल में **जोड़ता** है। यह पहले से मौजूद चीज़ों को कभी संपादित या हटाता नहीं।

**यह कैसे काम करता है:**

1. **स्कैन करता है** `documents/`, आपकी GitHub रिपॉज़िटरी (README, भाषाएँ, टॉपिक), और अन्य प्रोफ़ाइल लिंक (पोर्टफ़ोलियो, Kaggle, Scholar)।
2. **समृद्ध करता है** हर खोज को वेब खोज के माध्यम से — एक सीधी खोज (कोर्स सिलेबस, प्रमाणन कौशल सूची, टूल डॉक्स) और इस अनुमान दोनों से कि कार्य किन विधियों और टूलचेन को निहित करता है।
3. **आपको एक दक्षता मानचित्र दिखाता है** श्रेणी के अनुसार समूहित, हर आइटम अपने स्रोत तक खोजा गया और प्रत्यक्ष / अनुमानित के रूप में चिह्नित — कुछ भी लिखे जाने से *पहले* आपकी समीक्षा के लिए।
4. **केवल वही जोड़ता है जिसे आप स्वीकृत करते हैं**, हर एक के साथ एक स्रोत नोट जैसे *(Coursera — Deep Learning Specialisation)*। वे नोट्स पुनः-रन को निष्क्रिय (idempotent) बनाते हैं, और अनुमानित व्यवहारिक गुण स्पष्ट रूप से लेबल किए जाते हैं।

**उदाहरण प्रॉम्प्ट:**

```
/expand
```
```
/expand github
```
> _(आपकी GitHub रिपॉज़िटरी को खोदने के स्रोत के रूप में प्राथमिकता देता है।)_

चूँकि हर जोड़ अतिरिक्त (additive) और स्रोत-व्याख्यायित है, आप किसी नए कोर्स या प्रोजेक्ट के बाद `/expand` फिर से चला सकते हैं और यह केवल वही लाता है जो वास्तव में नया है।

---

### `/reset` — सुरक्षित रूप से फिर से शुरू करें

आपका व्यक्तिगत डेटा साफ़ करता है ताकि आप फिर से शुरुआत कर सकें — एक नई करियर दिशा, एक ताज़ा प्रोफ़ाइल, या रिपॉज़िटरी किसी और को सौंपना — उस ढाँचे को **छुए बिना** जो CareerForge को काम करने लायक बनाता है।

**दायरे (Scopes):**

| सिंटैक्स | क्या साफ़ करता है |
|--------|--------|
| `/reset profile` | आपकी प्रोफ़ाइल स्किल फ़ाइलें (वापस खाली टेम्पलेट पर) |
| `/reset documents` | `documents/` में आपकी फ़ाइलें (फ़ोल्डर संरचना + README रखी जाती हैं) |
| `/reset all` | दोनों |

यह हमेशा **पहले आपको एक सूची दिखाता है** (क्या साफ़ होगा बनाम क्या सुरक्षित रहेगा), और **जब तक आप बड़े अक्षरों में `RESET` टाइप नहीं करते तब तक कुछ नहीं होता** — कोई भी अन्य उत्तर रद्द कर देता है। लेखन-शैली गाइड, स्कोरिंग ढाँचा, कवर-लेटर टेम्पलेट, और साक्षात्कार-तैयारी ढाँचा कभी नहीं छुए जाते; केवल आपका डेटा ही। कोई पूर्ववत (undo) नहीं है, इसलिए यह आपको पुनर्प्राप्ति के एकमात्र साधन के रूप में आपके git इतिहास की ओर इशारा करता है, फिर पुनर्निर्माण के लिए `/setup` चलाने का सुझाव देता है।

---

## ट्रैकिंग डैशबोर्ड

एक केवल-स्थानीय वेब UI जो **एकल सत्य स्रोत के रूप में आपकी `job_search_tracker.csv` को पढ़ता और परमाणु रूप से (atomically) लिखता है**, आपकी पाइपलाइन को दृश्यबद्ध करता है, और ब्राउज़र से CLI (`/apply`, `/upskill`, वेतन खोज) चला सकता है। यह एक वैकल्पिक सहयोगी है — इसे हटाने से आपका डेटा और `/apply` पाइपलाइन अछूते रहते हैं।

> **बिना इंस्टॉल किए आज़माएँ →** [**लाइव डेमो**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — काल्पनिक नमूना डेटा के साथ एक केवल-पढ़ने योग्य पूर्वावलोकन। वहाँ संपादन, कंसोल और PDF पूर्वावलोकन अक्षम हैं (इन्हें ऐप के स्थानीय रूप से चलने की ज़रूरत है); बाकी सब असली UI है।

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| सतह | यह क्या करता है |
|---------|--------------|
| **Applications** | ट्रैकर को क्रमबद्ध/फ़िल्टर/खोजें; इनलाइन स्थिति + टिप्पणी संपादन (परमाणु, स्टेट-मशीन-सुरक्षित); `+ New`; सुरक्षित PDF पूर्वावलोकन के साथ विवरण ड्रॉअर |
| **Overview** | KPI कार्ड (कुल, आवेदित 7d/30d, औसत मेल, साक्षात्कार दर) + साप्ताहिक/स्थिति/मेल/कैलेंडर चार्ट — नमूना न्यूनतम पूरा न होने पर ईमानदार `—` |
| **Console** | अनुमत कमांड चलाएँ और उनका आउटपुट लाइव स्ट्रीम करें; प्रति-कंपनी पुनः-रन `/apply`, `/upskill`, और वेतन खोज |
| **Companies · Salary · Upskill · Profile · Settings** | समूहित/बेंचमार्क/रिपोर्ट/प्रोफ़ाइल दृश्य; थीम + केवल-पढ़ने की प्राथमिकताएँ |

> **डिज़ाइन से स्थानीय:** केवल `127.0.0.1` से बाँधता है (कोई LAN नहीं, कोई auth नहीं, कोई खाता नहीं), कोई बाहरी नेटवर्क कॉल नहीं करता, बिना शेल के एक निश्चित अनुमत-सूची के माध्यम से कमांड चलाता है, और कोई रहस्य संग्रहीत नहीं करता। एक `--read-only` मोड हर संपादन और क्रिया को अक्षम कर देता है। देखें [`dashboard/README.md`](dashboard/README.md) और [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md)।

> Node 18+ आवश्यक। क्रिया परत (ब्राउज़र से कमांड चलाना) को `PATH` पर `claude` और/या `python3` बाइनरी की ज़रूरत है; अनुपस्थित होने पर वे ट्रिगर अक्षम हो जाते हैं और बाकी काम करता रहता है।

---

> **सभी नियोजित कमांड शिप हो चुके हैं।** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand`, और `/reset` सभी लाइव हैं (v1.0–v1.2)। आगे क्या है, इसके लिए [Roadmap](#roadmap) देखें।

---

## उदाहरण सत्र

यहाँ एक यथार्थवादी आद्योपांत (end-to-end) पूर्वाभ्यास है।

**1. पहली-बार सेटअप**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. नौकरियाँ खोजना**

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

**3. आवेदन करना**

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

## गोपनीयता

| डेटा | यह कहाँ रहता है | git में कमिट? |
|------|----------------|-------------------|
| उम्मीदवार प्रोफ़ाइल | `.claude/skills/job-application-assistant/` | नहीं |
| बनाए गए CV और कवर लेटर | `cv/output/`, `cover_letters/output/` | नहीं |
| आवेदन ट्रैकर | `job_search_tracker.csv` | नहीं |
| देखी-गई-नौकरियाँ रजिस्ट्री | `job_scraper/seen_jobs.json` | नहीं |
| स्रोत दस्तावेज़ | `documents/` | नहीं |
| वेतन डेटा | `salary_data.json` | नहीं |

`.gitignore` इन सभी बहिष्करणों को लागू करता है। यदि आप अपना फ़ोर्क GitHub पर पुश करते हैं, तो **एक निजी रिपॉज़िटरी का उपयोग करें** ताकि आपकी प्रोफ़ाइल फ़ाइलें कभी उजागर न हों।

---

## डायरेक्टरी संरचना

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

## टेम्पलेट मैन्युअल रूप से संकलित करना

यदि आप LaTeX टेम्पलेट को स्वतंत्र रूप से परखना चाहते हैं:

**CV** (`cv/` डायरेक्टरी से चलाएँ):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**कवर लेटर** (`cover_letters/` से चलाएँ — फ़ॉन्ट लोडिंग के लिए वर्किंग डायरेक्टरी मायने रखती है):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Roadmap

| मील का पत्थर | स्थिति | क्या शिप होता है |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ पूर्ण | `/setup`, `/apply` (बिना समीक्षक), PDF संकलन |
| **v1.0** (Epics 6–8) | ✅ पूर्ण | समीक्षक एजेंट, `/search`, आवेदन ट्रैकर |
| **v1.0 — Dashboard** (Epic 9) | ✅ पूर्ण | `127.0.0.1:4480` पर स्थानीय ट्रैकिंग डैशबोर्ड — ट्रैकर देखें/संपादित करें, विश्लेषण, ब्राउज़र से कमांड चलाएँ |
| **v1.1** (Epics 10–11) | ✅ पूर्ण | `/upskill` कौशल-अंतराल विश्लेषण + सीखने की योजना, और आपके दस्तावेज़ों, GitHub और वेब से `/expand` दक्षता विस्तार |
| **v1.2** (Epic 12) | ✅ पूर्ण | `/reset`, साक्षात्कार-तैयारी ढाँचा, ADR-0004 पोर्टल-एडाप्टर पैटर्न + उदाहरण, शोध एजेंट |
| **v2.0** | 💡 भविष्य | टेम्पलेट मार्केटप्लेस, समुदाय पोर्टल एडाप्टर, GUI |

पूरी योजना [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md) में देखें।

---

## दस्तावेज़ीकरण

**यहाँ से शुरू करें →** [`docs-site/`](docs-site/) — दस्तावेज़ीकरण **वेबसाइट**: पूरे उत्पाद के लिए नवागंतुक-प्रथम गाइड (Quick Start, सभी तीन कमांड, लाइव डेमो वाला डैशबोर्ड, आपका डेटा, गोपनीयता, FAQ, शब्दावली)। इसे स्थानीय रूप से `docs-site/` के अंदर `npm run dev` से चलाएँ, या `npm run build` से स्थिर बनाएँ।

इंजीनियरिंग दस्तावेज़ीकरण (विनिर्देश, आर्किटेक्चर, योजनाएँ):

| पथ | सामग्री |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | पूर्ण कार्यात्मक आवश्यकताएँ (`REQ-####` IDs) |
| [`docs/architecture/`](docs/architecture/) | प्रौद्योगिकी स्टैक, कंपोनेंट डिज़ाइन, ADRs |
| [`docs/plan/`](docs/plan/) | मील के पत्थर, एपिक, कार्य विभाजन |
| [`docs/development/`](docs/development/) | कोडिंग मानक, प्रोजेक्ट संरचना, योगदान गाइड |
| [`docs/testing/`](docs/testing/) | परीक्षण रणनीति, परीक्षण मामले (`TC-####` IDs) |
| [`docs/glossary.md`](docs/glossary.md) | प्रामाणिक शब्द |

---

## योगदान

योगदान का स्वागत है — नए CV/कवर-लेटर टेम्पलेट, लोकेल पैक, पोर्टल एडाप्टर, बग फ़िक्स, और दस्तावेज़ीकरण सुधार सभी मदद करते हैं।

> ⚠️ **एक निजी फ़ोर्क का उपयोग करें।** आपकी उम्मीदवार प्रोफ़ाइल स्रोत कोड के समान डायरेक्टरी में रहती है। अपने व्यक्तिगत डेटा को सार्वजनिक इंटरनेट से दूर रखने के लिए हमेशा एक निजी GitHub रिपॉज़िटरी में काम करें।

पूरी गाइड, ब्रांच नामकरण, PR चेकलिस्ट, और नया जॉब पोर्टल या लोकेल कैसे जोड़ें, इसके लिए [CONTRIBUTING.md](CONTRIBUTING.md) देखें।

---

## लाइसेंस

MIT — देखें [LICENSE](LICENSE)। ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
