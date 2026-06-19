_この文書はコミュニティによる機械翻訳支援の翻訳（ベータ版）です。正本は英語版の README であり、内容に相違がある場合は英語版が優先されます。_

<div align="center">

# CareerForge

**求人を見つけ、応募先に合わせた CV とカバーレターを作成し、印刷可能な PDF にコンパイルする AI 求職アシスタント — すべてあなた自身のマシン上で。**

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

> **はじめての方へ。まずはガイドから。** CareerForge を理解する最も親しみやすい方法はドキュメントサイトです — クイックスタート、3 つのコマンドすべて、ライブデモ付きのダッシュボード、プライバシー、FAQ を網羅しています。読むのにプログラミングの知識は必要ありません。
>
> - 🌐 **今すぐ読む:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — ホスティング済みで、インストール不要。
> - 📊 **ダッシュボードを操作してみる:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — 架空のサンプルデータ上で動く実際の UI、読み取り専用。
> - 💻 **ローカルがお好みですか？** [`docs-site/`](docs-site/) の中で `npm run dev` を実行してください（ワンコマンドの静的ビルドについては [その README](docs-site/README.md) を参照）。

## これは何？

CareerForge は **Claude Code** の中で実行する求職ツールキットです — Claude Code はあなたのターミナルに住む AI アシスタントです。コマンドや平易な英語のプロンプトを入力すると、AI が作業を行います。プログラミングの知識は不要です。

現在、CareerForge があなたのためにできることは次のとおりです。

| ステップ | 入力する内容 | 起こること |
|------|---------|-------------|
| **1. プロフィールを作成** | `/setup` | Claude があなたの既存の CV、LinkedIn エクスポート、卒業証書を読み取るか、インタビュー形式で質問し、候補者プロフィールを作成します |
| **2. 新しい求人を探す** | `/search` | Claude が設定済みの求人ポータルを検索し、すでに見た求人と重複排除し、それぞれの適合度をスコア付けして、ランク付けされた表を表示します |
| **3. 応募する** | `/apply <url or paste>` | Claude が適合度をスコア付けし、CV を応募先に合わせて調整し、求人の言語でカバーレターを書き、2 つ目の AI レビュアーに両方を批評させ、編集を反映し、2 つの PDF をコンパイルし、最終確認チェックリストを実行します |

> **あなたのデータがマシンの外に出ることはありません。** プロフィール、CV、カバーレター、応募ログはすべてローカルに保存され、git にコミットされることはありません。

---

## 仕組み — 3 分でわかる版

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

**CareerForge がしないこと:**
- あなたに代わって応募を送信すること（あなたが確認して送信します）
- あなたが持っていないスキルや経験を創作すること
- 何かをクラウドにアップロードすること

---

## 必要なもの

### 1. Claude Code

Claude Code は CareerForge を実行する AI アシスタントです。一度だけインストールします。

```bash
npm install -g @anthropic-ai/claude-code
```

その後、ログインします。

```bash
claude
```

Claude Code には [Anthropic アカウント](https://claude.ai)が必要です。Free プランと Pro プランのどちらでも動作します。負荷の高い利用には Pro を推奨します。

> **Claude Code が何か分かりませんか？** ファイルを読み、ウェブを検索し、コマンドを実行できる賢いターミナルアシスタント — CareerForge の指示に導かれて動くもの、と考えてください。

### 2. LaTeX（PDF 生成用）

CareerForge は LaTeX を使って CV とカバーレターを PDF にコンパイルします。2 つのコンパイラが必要です。

| コンパイラ | 用途 | 理由 |
|----------|----------|-----|
| `lualatex` | CV | `fontawesome` と `lato` パッケージに必要 |
| `xelatex` | カバーレター | バンドルフォントのために `fontspec` に必要 |

**macOS**（推奨 — 両方のコンパイラをインストールします）:
```bash
brew install --cask mactex
```
または [tug.org/mactex](https://www.tug.org/mactex/) からダウンロードしてください。

インストール後、追加の CV パッケージを入れます。
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux（TeX Live）:**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** [MiKTeX](https://miktex.org/download) をインストールしてください — 不足しているパッケージを自動的に取得します。

### 3. Python 3.10+ _（オプション — 給与ベンチマーク用）_

```bash
python3 --version    # must be 3.10+
pip install openpyxl # only needed if importing salary data from Excel
```

---

## クイックスタート

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

## コマンド詳細

### `/setup` — 候補者プロフィールを作成

あなたの実データから 7 つのプロフィールファイルを生成します。Claude が質問するか、あなたのドキュメントを読み取ります — ファイルがあれば入力は不要です。

**3 つのオンボーディング経路:**

| 経路 | 使う場面 |
|------|-------------|
| **A — ドキュメントをスキャン** | `documents/` フォルダに CV、LinkedIn エクスポート、卒業証書、推薦状がある場合 |
| **B — CV をインポート** | きれいな単一の CV があり、すぐに始めたい場合 |
| **C — ライブインタビュー** | ゼロから始める場合。Claude があなたにインタビューします |

**プロンプトの例:**

```
/setup
```
```
/setup --section search
```
> _（フルインタビューを再実行せずに、対象の求人ポータルと勤務地の希望の更新に直接ジャンプします。）_

```
/setup --section experience
```
> _（職歴だけを更新します — 転職後に便利です。）_

**作成されるもの:**

| ファイル | 内容 |
|------|---------|
| `01-candidate-profile.md` | 個人情報、学歴、職歴、スキル、プロジェクト |
| `02-behavioral-profile.md` | 仕事のスタイル、文化的な好み、モチベーション |
| `03-writing-style.md` | _（静的なフレームワーク — 個人データなし）_ |
| `04-job-evaluation.md` | あなたの強み・弱み、キャリア目標 |
| `05-cv-templates.md` | 職種区分ごとのプロフィール文 |
| `06-cover-letter-templates.md` | _（静的テンプレート）_ |
| `07-interview-prep.md` | あなたの経験からの STAR ストーリー |
| `search-queries.md` | 対象の求人ポータル、クエリ、勤務地ティア |

---

### `/search` — 新しい求人を見つける

設定済みの求人ポータルをウェブ検索で調べ、すでに見た求人と重複排除し、適合度シグナル（High / Medium / Low）を割り当て、ランク付けされた表を提示します。番号を選ぶと、その求人はそのまま `/apply` に引き渡されます。

**引数:**

| 構文 | 動作 |
|--------|-----------|
| `/search` | 優先度上位 3 つのクエリカテゴリを実行 |
| `/search data science` | 「data science」に一致するカテゴリを優先 |
| `/search broad` | 設定済みのすべてのクエリカテゴリを実行 |

**プロンプトの例:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**出力の例:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **すべてのポータルはあなたの設定から取得されます。** ハードコードされているものは何もありません — 任意の求人サイト（LinkedIn、Indeed、Jobindex、Stepstone など）を `search-queries.md` に追加すれば、自動的に含まれます。

---

### `/apply` — 応募先に合わせた CV とカバーレターを作成

求人 URL または貼り付けた説明文を受け取り、応募パイプライン全体を実行します。

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**引数:**

| 引数 | 動作 |
|----------|-----------|
| _（デフォルト）_ | レビュアーを含むフルパイプライン（`--review=full`） |
| `--review=quick` | レビュアーが企業調査をスキップ — より速く、低コスト |
| `--review=none` | レビュアーを完全にスキップ — 最速、最低コスト |

**プロンプトの例:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

または、求人の説明文を直接貼り付けます。

```
/apply
[paste job description here]
```

**得られるもの:**

| 出力 | 場所 |
|--------|---------|
| CV（PDF、2 ページ、英語） | `cv/main_<company>.pdf` |
| カバーレター（PDF、1 ページ、求人の言語） | `cover_letters/cover_<company>_<role>.pdf` |
| 応募の行 | `job_search_tracker.csv` |
| 適合度評価 | 会話の中で |

**適合度スコアリング（5 つの次元）:**

| 次元 | 重み |
|-----------|--------|
| 技術スキルの一致 | 30% |
| キャリアの整合性 | 30% |
| 経験の一致 | 25% |
| 行動・文化フィット | 15% |
| 勤務地とロジスティクス | 合否 |

判定: **Strong**（75+）· **Good**（60〜74）· **Moderate**（45〜59）· **Weak**（30〜44）· **Poor**（30 未満）

> **言語ルール:** カバーレターは常に求人の言語で書かれます。デンマーク語の求人 → デンマーク語のカバーレター。CV は常に英語です。

---

### `/upskill` — スキルギャップとそれを埋める計画を見つける

あなたのプロフィールを需要と比較し、優先度付けされたギャップのヒートマップ、**実際にウェブ検索された**リソースから構築された学習計画、依存関係を考慮した学習順序を生成します — そしてそのすべてを、ダッシュボードが表示できるレポートとして保存します。

**2 つのモード:**

| 構文 | モード | 分析対象 |
|--------|------|------------------|
| `/upskill` | 集約 | トラッカー内のすべての求人を、最も適合度が*低い*職種が最も重く数えられるよう重み付け |
| `/upskill <url>` | ターゲット | 単一の求人（URL を取得できない場合はテキストを貼り付け） |

**得られるもの:**

| 出力 | 場所 |
|--------|---------|
| ギャップのヒートマップ（Critical / High / Medium / Low） | 会話の中で |
| 学習計画 — ギャップごとに 2〜3 個のリソース、学習の方向性と所要時間の見積もり付き | レポートの中で |
| 合計時間付きの学習順序 | レポートの中で |
| 保存されたレポート（集約モードでは前回実行からの差分付き） | `upskill/report-*.md` |

レポートはダッシュボードの **Upskill** タブに表示されます。創作されるものは何もありません — すべてのリソースはライブのウェブ検索から得られ、トラッカーが空の場合は空のレポートではなく、ターゲットモードへの率直な後押しが行われます。

---

### `/expand` — これまでに行ってきたすべてからプロフィールを成長させる

あなたが持っているのにまだ書き留めていないコンピテンシーを — あなたのドキュメント、公開された **GitHub** リポジトリ、ウェブから — 見つけ出し、プロフィールに**追加**します。既存の内容を編集したり削除したりすることは決してありません。

**仕組み:**

1. `documents/`、あなたの GitHub リポジトリ（README、言語、トピック）、その他のプロフィールリンク（ポートフォリオ、Kaggle、Scholar）を**スキャン**します。
2. 各発見事項を、直接のルックアップ（コースシラバス、認定スキルリスト、ツールのドキュメント）と、その作業が示唆する手法やツールチェーンの推論の両方を通じて、ウェブ検索で**充実させます**。
3. カテゴリ別にグループ化された**コンピテンシーマップを表示**します。各項目は出典まで追跡され、直接 / 推論のいずれかが示されます — 何かが書き込まれる*前*にあなたが確認できます。
4. あなたが承認したものだけを**追加**します。それぞれに *(Coursera — Deep Learning Specialisation)* のような出典メモが付きます。これらのメモにより再実行は冪等になり、推論された行動特性は明確にラベル付けされます。

**プロンプトの例:**

```
/expand
```
```
/expand github
```
> _（採掘元のソースとしてあなたの GitHub リポジトリを優先します。）_

すべての追加が追加的で出典付きであるため、新しいコースやプロジェクトの後に `/expand` を再実行しても、本当に新しいものだけが取り込まれます。

---

### `/reset` — 安全にやり直す

個人データを消去して、新たに始められるようにします — 新しいキャリアの方向性、まっさらなプロフィール、あるいはリポジトリを誰かに引き渡すとき — **しかも** CareerForge を機能させるフレームワークには手を触れません。

**スコープ:**

| 構文 | 消去対象 |
|--------|--------|
| `/reset profile` | プロフィールのスキルファイル（空白のテンプレートに戻す） |
| `/reset documents` | `documents/` 内のあなたのファイル（フォルダ構造と README は保持） |
| `/reset all` | 両方 |

実行前に必ず**インベントリを表示**し（消去されるもの対保持されるもの）、**`RESET` を大文字で入力するまで何も起こりません** — それ以外の応答はすべてキャンセルになります。ライティングスタイルガイド、スコアリングフレームワーク、カバーレターテンプレート、面接準備フレームワークには決して触れません。消去されるのはあなたのデータだけです。取り消しはできないため、唯一の復旧手段として git 履歴を案内し、その後 `/setup` を実行して再構築することを提案します。

---

## トラッキングダッシュボード

**`job_search_tracker.csv` を単一の信頼できる情報源として読み取り、アトミックに書き込む**ローカル専用のウェブ UI です。パイプラインを可視化し、ブラウザから CLI（`/apply`、`/upskill`、給与ルックアップ）を駆動できます。オプションのコンパニオンであり、削除してもあなたのデータと `/apply` パイプラインはそのまま残ります。

> **インストールせずに試す →** [**ライブデモ**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — 架空のサンプルデータによる読み取り専用のウォークスルー。そこでは編集、コンソール、PDF プレビューは無効です（ローカルでアプリを実行する必要があります）。それ以外はすべて実際の UI です。

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| 画面 | 機能 |
|---------|--------------|
| **Applications** | トラッカーの並べ替え・絞り込み・検索、インラインでのステータス + メモ編集（アトミック、状態機械でガード）、`+ New`、ガード付き PDF プレビューを備えた詳細ドロワー |
| **Overview** | KPI カード（合計、7 日 / 30 日の応募、平均適合度、面接率）+ 週次 / ステータス / 適合度 / カレンダーチャート — サンプル下限に満たない場合は正直に `—` を表示 |
| **Console** | 許可リストのコマンドを実行し出力をライブでストリーム、企業ごとの `/apply`、`/upskill`、給与ルックアップの再実行 |
| **Companies · Salary · Upskill · Profile · Settings** | グループ化 / ベンチマーク / レポート / プロフィールのビュー、テーマ + 読み取り専用の設定 |

**設計上ローカル:** `127.0.0.1` のみにバインド（LAN なし、認証なし、アカウントなし）、外向きのネットワーク呼び出しを一切行わず、シェルを介さず固定の許可リストでコマンドを実行し、シークレットを保存しません。`--read-only` モードはすべての編集と操作を無効にします。[`dashboard/README.md`](dashboard/README.md) と [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md) を参照してください。

> Node 18+ が必要です。アクションレイヤー（ブラウザからのコマンド実行）には `claude` および / または `python3` バイナリが `PATH` 上に必要です。存在しない場合、それらのトリガーは無効になり、残りは動作し続けます。

---

> **計画されていたコマンドはすべてリリース済みです。** `/setup`、`/search`、`/apply`、`/upskill`、
> `/expand`、`/reset` はすべて稼働中です（v1.0〜v1.2）。次に来るものについては [ロードマップ](#roadmap) を参照してください。

---

## セッションの例

現実的なエンドツーエンドのウォークスルーを示します。

**1. 初回セットアップ**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. 求人の検索**

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

**3. 応募**

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

## プライバシー

| データ | 保存場所 | git にコミット？ |
|------|----------------|-------------------|
| 候補者プロフィール | `.claude/skills/job-application-assistant/` | いいえ |
| 生成された CV とカバーレター | `cv/output/`, `cover_letters/output/` | いいえ |
| 応募トラッカー | `job_search_tracker.csv` | いいえ |
| 既見求人のレジストリ | `job_scraper/seen_jobs.json` | いいえ |
| 元のドキュメント | `documents/` | いいえ |
| 給与データ | `salary_data.json` | いいえ |

`.gitignore` がこれらの除外をすべて強制します。フォークを GitHub にプッシュする場合は、プロフィールファイルが決して露出しないよう、**プライベートリポジトリを使用してください**。

---

## ディレクトリ構造

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

## テンプレートを手動でコンパイルする

LaTeX テンプレートを単独でテストしたい場合:

**CV**（`cv/` ディレクトリから実行）:
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**カバーレター**（`cover_letters/` から実行 — フォント読み込みのため作業ディレクトリが重要です）:
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## ロードマップ

| マイルストーン | ステータス | リリース内容 |
|-----------|--------|-----------|
| **MVP**（Epics 1–5） | ✅ 完了 | `/setup`、`/apply`（レビュアーなし）、PDF コンパイル |
| **v1.0**（Epics 6–8） | ✅ 完了 | レビュアーエージェント、`/search`、応募トラッカー |
| **v1.0 — Dashboard**（Epic 9） | ✅ 完了 | `127.0.0.1:4480` のローカルトラッキングダッシュボード — トラッカーの表示 / 編集、分析、ブラウザからのコマンド実行 |
| **v1.1**（Epics 10–11） | ✅ 完了 | `/upskill` スキルギャップ分析 + 学習計画、および `/expand` によるドキュメント・GitHub・ウェブからのコンピテンシー拡張 |
| **v1.2**（Epic 12） | ✅ 完了 | `/reset`、面接準備フレームワーク、ADR-0004 ポータルアダプターパターン + 例、リサーチエージェント |
| **v2.0** | 💡 将来 | テンプレートマーケットプレイス、コミュニティ製ポータルアダプター、GUI |

完全な計画は [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md) を参照してください。

---

## ドキュメント

**ここから始めましょう →** [`docs-site/`](docs-site/) — ドキュメント**ウェブサイト**: 製品全体を初心者目線で案内するガイド（クイックスタート、3 つのコマンドすべて、ライブデモ付きのダッシュボード、あなたのデータ、プライバシー、FAQ、用語集）。`docs-site/` の中で `npm run dev` を実行してローカルで動かすか、`npm run build` で静的にビルドしてください。

エンジニアリングドキュメント（仕様、アーキテクチャ、計画）:

| パス | 内容 |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | 完全な機能要件（`REQ-####` ID） |
| [`docs/architecture/`](docs/architecture/) | 技術スタック、コンポーネント設計、ADR |
| [`docs/plan/`](docs/plan/) | マイルストーン、エピック、作業分解 |
| [`docs/development/`](docs/development/) | コーディング標準、プロジェクト構造、コントリビューションガイド |
| [`docs/testing/`](docs/testing/) | テスト戦略、テストケース（`TC-####` ID） |
| [`docs/glossary.md`](docs/glossary.md) | 正規の用語 |

---

## コントリビューション

コントリビューションを歓迎します — 新しい CV / カバーレターテンプレート、ロケールパック、ポータルアダプター、バグ修正、ドキュメント改善はどれも役立ちます。

> ⚠️ **プライベートフォークを使用してください。** あなたの候補者プロフィールはソースコードと同じディレクトリにあります。個人データを公開インターネットから守るため、常にプライベートな GitHub リポジトリで作業してください。

完全なガイド、ブランチ命名、PR チェックリスト、新しい求人ポータルやロケールの追加方法については [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

---

## ライセンス

MIT — [LICENSE](LICENSE) を参照してください。 ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
