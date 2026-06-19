<div align="center">

# CareerForge

**مساعد ذكاء اصطناعي للبحث عن وظيفة، يعثر على الإعلانات، ويكتب سيراً ذاتية وخطابات تغطية مُخصَّصة، ويُجمّعها إلى ملفات PDF جاهزة للطباعة — كل ذلك على جهازك الخاص.**

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

> _هذه ترجمة مجتمعية بمساعدة الآلة (نسخة تجريبية). النسخة الإنجليزية من README هي المرجع المعتمد؛ في حال وجود أي اختلاف، فالنصّ الإنجليزي هو الحاسم._

---

> **جديد هنا؟ ابدأ بالدليل.** أسهل طريقة لفهم CareerForge هي موقع التوثيق — البدء السريع، وجميع الأوامر الثلاثة، ولوحة المعلومات مع عروض حية، والخصوصية، والأسئلة الشائعة. لا حاجة إلى أي برمجة لقراءته.
>
> - 🌐 **اقرأه الآن:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — مُستضاف، لا شيء لتثبيته.
> - 📊 **تنقّل في لوحة المعلومات:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — الواجهة الحقيقية ببيانات تجريبية خيالية، للقراءة فقط.
> - 💻 **تفضّل التشغيل المحلي؟** شغّل `npm run dev` داخل [`docs-site/`](docs-site/) (أو راجع [ملف README الخاص به](docs-site/README.md) للبناء الثابت بأمر واحد).

## ما هذا؟

CareerForge هو مجموعة أدوات للبحث عن وظيفة تشغّلها داخل **Claude Code** — مساعد ذكاء اصطناعي يعيش في الطرفية لديك. تكتب الأوامر ومطالبات بلغة إنجليزية بسيطة؛ والذكاء الاصطناعي ينجز العمل. لا حاجة إلى أي معرفة برمجية.

إليك ما يمكنه فعله من أجلك اليوم:

| الخطوة | تقول | ما يحدث |
|------|---------|-------------|
| **1. ابنِ ملفك الشخصي** | `/setup` | يقرأ Claude سيرتك الذاتية الحالية، أو تصدير LinkedIn، أو الشهادات، أو يجري معك مقابلة — ثم يكتب ملف المرشّح الخاص بك |
| **2. اعثر على وظائف جديدة** | `/search` | يبحث Claude في بوابات الوظائف التي أعددتها، ويُزيل التكرار مقابل الوظائف التي رأيتها بالفعل، ويُقيّم مدى ملاءمة كلٍّ منها، ويعرض لك جدولاً مُرتَّباً |
| **3. تقدّم** | `/apply <url or paste>` | يُقيّم Claude مدى ملاءمتك، ويُخصّص سيرتك الذاتية، ويكتب خطاب تغطية بلغة الإعلان، ويُكلّف مراجِعاً ثانياً من الذكاء الاصطناعي بنقد كليهما، ويطبّق التعديلات، ويُجمّع ملفّي PDF، ويُشغّل قائمة تحقّق نهائية |

> **بياناتك لا تغادر جهازك أبداً.** ملفك الشخصي وسيرك الذاتية وخطابات التغطية وسجلّ طلباتك كلها مُخزَّنة محلياً ولا تُرفَع أبداً إلى git.

---

## كيف يعمل — نسخة الثلاث دقائق

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

**ما لا يفعله CareerForge:**
- تقديم الطلبات نيابةً عنك (أنت من يراجع ويُرسل)
- اختلاق مهارات أو خبرات لا تملكها
- رفع أي شيء إلى السحابة

---

## ما تحتاجه

### 1. Claude Code

‏Claude Code هو مساعد الذكاء الاصطناعي الذي يُشغّل CareerForge. ثبّته مرة واحدة:

```bash
npm install -g @anthropic-ai/claude-code
```

ثم سجّل الدخول:

```bash
claude
```

يتطلّب Claude Code [حساب Anthropic](https://claude.ai). تعمل خطتا Free وPro كلتاهما؛ ويُوصى بخطة Pro للاستخدام المكثّف.

> **لست متأكداً ما هو Claude Code؟** اعتبره مساعد طرفية ذكياً قادراً على قراءة الملفات والبحث على الويب وتشغيل الأوامر — مُوجَّهاً بتعليمات CareerForge.

### 2. LaTeX (لإنشاء ملفات PDF)

يُجمّع CareerForge سيرتك الذاتية وخطاب التغطية إلى PDF باستخدام LaTeX. وهناك حاجة إلى مُجمِّعَين:

| المُجمِّع | يُستخدَم لـ | لماذا |
|----------|----------|-----|
| `lualatex` | السيرة الذاتية | مطلوب من قِبَل حزمتَي `fontawesome` و`lato` |
| `xelatex` | خطاب التغطية | مطلوب من قِبَل `fontspec` للخطوط المُرفَقة |

**‏macOS** (مُوصى به — يُثبّت كلا المُجمِّعَين):
```bash
brew install --cask mactex
```
أو نزّله من [tug.org/mactex](https://www.tug.org/mactex/).

بعد التثبيت، أضِف حزم السيرة الذاتية الإضافية:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**‏Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**‏Windows:** ثبّت [MiKTeX](https://miktex.org/download) — فهو يجلب الحزم الناقصة تلقائياً.

### 3. ‏Python 3.10+ _(اختياري — لمقارنة الرواتب المرجعية)_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## البدء السريع

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

## الأوامر بالتفصيل

### `/setup` — ابنِ ملف المرشّح الخاص بك

يملأ سبعة ملفات للملف الشخصي من بياناتك الحقيقية. يطرح Claude أسئلة أو يقرأ مستنداتك — لا حاجة إلى الكتابة إن كانت لديك ملفات.

**ثلاثة مسارات للإعداد:**

| المسار | متى يُستخدَم |
|------|-------------|
| **أ — مسح المستندات** | لديك سير ذاتية، أو تصدير LinkedIn، أو شهادات، أو خطابات توصية في مجلّد `documents/` |
| **ب — استيراد سيرة ذاتية** | لديك سيرة ذاتية واحدة نظيفة وتريد بداية سريعة |
| **ج — مقابلة حية** | تبدأ من الصفر؛ يجري معك Claude مقابلة |

**أمثلة على المطالبات:**

```
/setup
```
```
/setup --section search
```
> _(ينتقل مباشرةً إلى تحديث بوابات الوظائف المستهدفة وتفضيلات الموقع دون إعادة تشغيل المقابلة الكاملة.)_

```
/setup --section experience
```
> _(يُحدّث سجلّ عملك فقط — مفيد بعد تغيير وظيفة.)_

**ما الذي يُبنى:**

| الملف | المحتويات |
|------|---------|
| `01-candidate-profile.md` | الهوية، والتعليم، وسجلّ العمل، والمهارات، والمشاريع |
| `02-behavioral-profile.md` | أسلوب العمل، وتفضيلات الثقافة، والدوافع |
| `03-writing-style.md` | _(إطار ثابت — لا بيانات شخصية)_ |
| `04-job-evaluation.md` | جوانب قوّتك/ضعفك، وأهدافك المهنية |
| `05-cv-templates.md` | جُمل تعريفية حسب نوع الوظيفة |
| `06-cover-letter-templates.md` | _(قوالب ثابتة)_ |
| `07-interview-prep.md` | قصص STAR من خبرتك |
| `search-queries.md` | بوابات الوظائف المستهدفة، والاستعلامات، ومستويات الموقع |

---

### `/search` — اعثر على إعلانات وظائف جديدة

يبحث في بوابات الوظائف التي أعددتها عبر البحث على الويب، ويُزيل التكرار مقابل الوظائف التي رأيتها بالفعل، ويُسنِد إشارة ملاءمة (عالية / متوسطة / منخفضة)، ويعرض جدولاً مُرتَّباً. وعندما تختار رقماً، يُسلَّم الوظيفة مباشرةً إلى `/apply`.

**الوسائط:**

| الصيغة | السلوك |
|--------|-----------|
| `/search` | يُشغّل أعلى 3 فئات استعلام ذات أولوية |
| `/search data science` | يُعطي الأولوية للفئات المطابقة لـ "data science" |
| `/search broad` | يُشغّل جميع فئات الاستعلام المُعدَّة |

**أمثلة على المطالبات:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**مثال على المخرجات:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **كل البوابات تأتي من إعداداتك.** لا شيء مُرمَّز بشكل ثابت — أضِف أي لوحة وظائف (LinkedIn، أو Indeed، أو Jobindex، أو Stepstone، إلخ) إلى `search-queries.md` وستُضمَّن تلقائياً.

---

### `/apply` — أنتِج سيرة ذاتية وخطاب تغطية مُخصَّصَين

يأخذ رابط وظيفة أو وصفاً مُلصَقاً ويُشغّل خطّ إنتاج الطلب الكامل:

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**الوسائط:**

| الوسيطة | السلوك |
|----------|-----------|
| _(الافتراضي)_ | خطّ الإنتاج الكامل مع المراجِع (`--review=full`) |
| `--review=quick` | يتخطّى المراجِع بحث الشركة — أسرع وأقل تكلفة |
| `--review=none` | يتخطّى المراجِع كلياً — الأسرع والأقل تكلفة |

**أمثلة على المطالبات:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

أو ألصِق وصف الوظيفة مباشرةً:

```
/apply
[paste job description here]
```

**ما تحصل عليه:**

| المخرَج | الموقع |
|--------|---------|
| السيرة الذاتية (PDF، صفحتان، بالإنجليزية) | `cv/main_<company>.pdf` |
| خطاب التغطية (PDF، صفحة واحدة، بلغة الإعلان) | `cover_letters/cover_<company>_<role>.pdf` |
| صفّ الطلب | `job_search_tracker.csv` |
| تقييم الملاءمة | في المحادثة |

**تقييم الملاءمة (5 أبعاد):**

| البُعد | الوزن |
|-----------|--------|
| مطابقة المهارات التقنية | 30% |
| التوافق المهني | 30% |
| مطابقة الخبرة | 25% |
| الملاءمة السلوكية / الثقافية | 15% |
| الموقع واللوجستيات | نجاح / فشل |

الحُكم: **قوي** (75+) · **جيد** (60–74) · **متوسط** (45–59) · **ضعيف** (30–44) · **ضعيف جداً** (<30)

> **قاعدة اللغة:** يُكتَب خطاب التغطية دائماً بلغة إعلان الوظيفة. إعلان دنماركي ← خطاب تغطية بالدنماركية. والسيرة الذاتية دائماً بالإنجليزية.

---

### `/upskill` — اعثر على فجوات مهاراتك وخطة لسدّها

يقارن ملفك الشخصي مقابل الطلب في السوق ويُنتج خريطة حرارية مُرتَّبة حسب الأولوية للفجوات، وخطة تعلّم مبنية على موارد **حقيقية، مُستخرَجة من البحث على الويب**، وترتيب دراسة يراعي التبعيات — ثم يحفظ كل ذلك كتقرير يمكن للوحة المعلومات عرضه لك.

**وضعان:**

| الصيغة | الوضع | ما الذي يُحلّله |
|--------|------|------------------|
| `/upskill` | تجميعي | كل وظيفة في أداة التتبّع، مُرجَّحة بحيث تُحتسب الوظائف التي تلائمها *الأقل* بالوزن الأكبر |
| `/upskill <url>` | مُستهدَف | إعلان واحد (ألصِق النص إذا تعذّر جلب الرابط) |

**ما تحصل عليه:**

| المخرَج | الموقع |
|--------|---------|
| خريطة حرارية للفجوات (حرجة / عالية / متوسطة / منخفضة) | في المحادثة |
| خطة تعلّم — 2–3 موارد لكل فجوة، مع اتجاه الدراسة + تقدير الوقت | في التقرير |
| ترتيب الدراسة مع الوقت الإجمالي | في التقرير |
| تقرير محفوظ (مع فارق منذ آخر تشغيل في الوضع التجميعي) | `upskill/report-*.md` |

تظهر التقارير في تبويب **Upskill** بلوحة المعلومات. لا شيء مُختلَق — كل مورد يأتي من بحث حيّ على الويب، وأداة التتبّع الفارغة تتلقّى دفعةً صادقة نحو الوضع المُستهدَف بدلاً من تقرير فارغ.

---

### `/expand` — نمِّ ملفك الشخصي من كل ما أنجزته بالفعل

يعثر على الكفاءات التي تملكها ولكنك لم تدوّنها — من مستنداتك، ومستودعات **GitHub** العامة الخاصة بك، والويب — و**يضيفها** إلى ملفك الشخصي. ولا يُعدّل أبداً أو يزيل ما هو موجود بالفعل.

**كيف يعمل:**

1. **يمسح** `documents/`، ومستودعات GitHub الخاصة بك (ملفات README، واللغات، والمواضيع)، وروابط الملف الشخصي الأخرى (الأعمال، وKaggle، وScholar).
2. **يُثري** كل اكتشاف عبر البحث على الويب — بحثٌ مباشر (مناهج الدورات، وقوائم مهارات الشهادات، ووثائق الأدوات) واستنتاجٌ عن الأساليب وسلاسل الأدوات التي يدلّ عليها العمل.
3. **يعرض لك خريطة كفاءات** مُجمَّعة حسب الفئة، كل عنصر متتبَّع إلى مصدره ومُعلَّم بأنه مباشر / مُستنتَج — لمراجعتك *قبل* كتابة أي شيء.
4. **يضيف فقط ما توافق عليه**، كل عنصر بملاحظة مصدر مثل *(Coursera — Deep Learning Specialisation)*. تجعل هذه الملاحظات عمليات إعادة التشغيل غير مكرِّرة، وتُعلَّم السمات السلوكية المُستنتَجة بوضوح.

**أمثلة على المطالبات:**

```
/expand
```
```
/expand github
```
> _(يُعطي الأولوية لمستودعات GitHub الخاصة بك كمصدر للتنقيب.)_

ولأن كل إضافة تراكمية ومُعلَّمة بالمصدر، يمكنك تشغيل `/expand` مجدداً بعد دورة أو مشروع جديد، فلا يجلب سوى ما هو جديد فعلاً.

---

### `/reset` — ابدأ من جديد، بأمان

يمسح بياناتك الشخصية لتبدأ من جديد — اتجاه مهني جديد، أو ملف شخصي جديد، أو تسليم المستودع لشخص آخر — **دون** المساس بالإطار الذي يجعل CareerForge يعمل.

**النطاقات:**

| الصيغة | يمسح |
|--------|--------|
| `/reset profile` | ملفات مهارات ملفك الشخصي (تعود إلى قوالب فارغة) |
| `/reset documents` | ملفاتك في `documents/` (تُحفَظ بنية المجلّد + ملف README) |
| `/reset all` | كلاهما |

يعرض لك دائماً **جرداً أولاً** (ما الذي سيُمسَح مقابل ما الذي سيُحفَظ)، و**لا يحدث شيء حتى تكتب `RESET`** بأحرف كبيرة — وأي ردّ آخر يُلغي العملية. لا يُمسّ أبداً دليل أسلوب الكتابة، وإطار التقييم، وقوالب خطابات التغطية، وإطار التحضير للمقابلات؛ بل تُمسّ بياناتك فقط. لا يوجد تراجع، لذا فهو يُحيلك إلى سجلّ git الخاص بك بوصفه وسيلة الاسترداد الوحيدة، ثم يقترح تشغيل `/setup` لإعادة البناء.

---

## لوحة تتبّع الطلبات

واجهة ويب محلية فقط **تقرأ ملف `job_search_tracker.csv` الخاص بك وتكتب إليه بشكل ذرّي بوصفه المصدر الوحيد للحقيقة**، وتُصوّر مسار طلباتك، ويمكنها تشغيل واجهة CLI (`/apply`، و`/upskill`، وعمليات البحث عن الرواتب) من المتصفح. وهي رفيق اختياري — حذفها يترك بياناتك وخطّ إنتاج `/apply` دون مساس.

> **جرّبها دون تثبيت ←** [**العرض الحي**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — جولة للقراءة فقط ببيانات تجريبية خيالية. التحرير، ووحدة التحكّم، ومعاينات PDF معطّلة هناك (فهي تحتاج إلى تشغيل التطبيق محلياً)؛ وكل شيء آخر هو الواجهة الحقيقية.

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| السطح | ما يفعله |
|---------|--------------|
| **Applications** | فرز/تصفية/بحث في أداة التتبّع؛ تحرير الحالة والملاحظات داخل السطر (ذرّي، محمي بآلة حالات)؛ `+ New`؛ درج تفاصيل مع معاينة PDF محمية |
| **Overview** | بطاقات مؤشّرات الأداء (الإجمالي، والتقديم خلال 7 أيام/30 يوماً، ومتوسّط الملاءمة، ومعدّل المقابلات) + رسوم بيانية أسبوعية/للحالة/للملاءمة/تقويمية — مع `—` صادقة عند عدم بلوغ حدّ أدنى من العيّنة |
| **Console** | تشغيل الأوامر المسموح بها وبثّ مخرجاتها مباشرةً؛ إعادة تشغيل `/apply`، و`/upskill`، وعمليات البحث عن الرواتب لكل شركة |
| **Companies · Salary · Upskill · Profile · Settings** | عروض مُجمَّعة/مرجعية/تقارير/الملف الشخصي؛ تفضيلات المظهر والقراءة فقط |

**محلي بحكم التصميم:** يرتبط بـ `127.0.0.1` فقط (لا شبكة محلية، ولا مصادقة، ولا حسابات)، ولا يُجري أي اتصالات شبكية خارجية، ويُشغّل الأوامر عبر قائمة سماح ثابتة دون صدفة (shell)، ولا يخزّن أي أسرار. ويعطّل وضع `--read-only` كل عملية تحرير وإجراء. راجع [`dashboard/README.md`](dashboard/README.md) و[`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md).

> يتطلّب Node 18+. تحتاج طبقة الإجراءات (تشغيل الأوامر من المتصفح) إلى ثنائيات `claude` و/أو `python3` على `PATH`؛ وعند غيابها، تُعطَّل تلك المُحفِّزات ويستمرّ الباقي في العمل.

---

> **جميع الأوامر المُخطَّط لها قد صدرت.** `/setup`، و`/search`، و`/apply`، و`/upskill`،
> و`/expand`، و`/reset` كلها متاحة (v1.0–v1.2). راجع [خارطة الطريق](#roadmap) لمعرفة ما هو
> قادم.

---

## مثال على جلسة

إليك جولة واقعية من البداية إلى النهاية.

**1. الإعداد لأول مرة**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. البحث عن وظائف**

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

**3. التقديم**

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

## الخصوصية

| البيانات | أين تعيش | مُرفَعة إلى git؟ |
|------|----------------|-------------------|
| ملف المرشّح | `.claude/skills/job-application-assistant/` | لا |
| السير الذاتية وخطابات التغطية المُولَّدة | `cv/output/`, `cover_letters/output/` | لا |
| أداة تتبّع الطلبات | `job_search_tracker.csv` | لا |
| سجلّ الوظائف المرئية | `job_scraper/seen_jobs.json` | لا |
| المستندات المصدرية | `documents/` | لا |
| بيانات الرواتب | `salary_data.json` | لا |

يفرض ملف `.gitignore` كل هذه الاستثناءات. وإذا دفعت نسختك المتفرّعة إلى GitHub، **فاستخدم مستودعاً خاصاً** كي لا تتعرّض ملفات ملفك الشخصي أبداً.

---

## بنية المجلّدات

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

## تجميع القوالب يدوياً

إذا أردت اختبار قوالب LaTeX بشكل مستقل:

**السيرة الذاتية** (شغّلها من مجلّد `cv/`):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**خطاب التغطية** (شغّله من `cover_letters/` — مجلّد العمل مهمّ لتحميل الخطوط):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## خارطة الطريق

| المرحلة | الحالة | ما يصدر |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ مكتمل | `/setup`، و`/apply` (بلا مراجِع)، وتجميع PDF |
| **v1.0** (Epics 6–8) | ✅ مكتمل | وكيل المراجِع، و`/search`، وأداة تتبّع الطلبات |
| **v1.0 — Dashboard** (Epic 9) | ✅ مكتمل | لوحة تتبّع محلية على `127.0.0.1:4480` — عرض/تحرير أداة التتبّع، وتحليلات، وتشغيل الأوامر من المتصفح |
| **v1.1** (Epics 10–11) | ✅ مكتمل | تحليل فجوات المهارات `/upskill` + خطة التعلّم، وتوسيع الكفاءات `/expand` من مستنداتك، وGitHub، والويب |
| **v1.2** (Epic 12) | ✅ مكتمل | `/reset`، وإطار التحضير للمقابلات، ونمط مُحوّل البوابات ADR-0004 + مثال، ووكيل البحث |
| **v2.0** | 💡 مستقبلاً | سوق القوالب، ومُحوّلات بوابات من المجتمع، وواجهة رسومية |

راجع الخطة الكاملة في [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md).

---

## التوثيق

**ابدأ من هنا ←** [`docs-site/`](docs-site/) — **موقع** التوثيق: دليل يبدأ بالوافدين الجدد للمنتج بأكمله (البدء السريع، وجميع الأوامر الثلاثة، ولوحة المعلومات مع عروض حية، وبياناتك، والخصوصية، والأسئلة الشائعة، والمسرد). شغّله محلياً بـ `npm run dev` داخل `docs-site/`، أو ابنِه بشكل ثابت بـ `npm run build`.

التوثيق الهندسي (المواصفات، والمعمارية، والخطط):

| المسار | المحتويات |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | متطلّبات وظيفية كاملة (معرّفات `REQ-####`) |
| [`docs/architecture/`](docs/architecture/) | المكدّس التقني، وتصميم المكوّنات، وسجلّات القرارات المعمارية |
| [`docs/plan/`](docs/plan/) | المراحل، والملاحم، وتفصيل العمل |
| [`docs/development/`](docs/development/) | معايير البرمجة، وبنية المشروع، ودليل المساهمة |
| [`docs/testing/`](docs/testing/) | استراتيجية الاختبار، وحالات الاختبار (معرّفات `TC-####`) |
| [`docs/glossary.md`](docs/glossary.md) | المصطلحات المعتمدة |

---

## المساهمة

المساهمات مُرحَّب بها — قوالب سير ذاتية/خطابات تغطية جديدة، وحِزم لغوية، ومُحوّلات بوابات، وإصلاحات للعلل، وتحسينات للتوثيق، كلها تساعد.

> ⚠️ **استخدم نسخة متفرّعة خاصة.** يعيش ملف المرشّح الخاص بك في المجلّد نفسه الذي يحوي الشيفرة المصدرية. اعمل دائماً في مستودع GitHub خاص لإبقاء بياناتك الشخصية بعيدة عن الإنترنت العام.

راجع [CONTRIBUTING.md](CONTRIBUTING.md) للدليل الكامل، وتسمية الفروع، وقائمة تحقّق طلبات السحب، وكيفية إضافة بوابة وظائف أو لغة جديدة.

---

## الترخيص

‏MIT — راجع [LICENSE](LICENSE). ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
