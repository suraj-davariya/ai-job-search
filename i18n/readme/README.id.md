<div align="center">

# CareerForge

**Asisten pencarian kerja bertenaga AI yang menemukan lowongan, menulis CV dan surat lamaran yang disesuaikan, lalu mengompilasinya menjadi PDF siap cetak — semuanya di mesin Anda sendiri.**

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

> _Ini adalah terjemahan komunitas/berbantuan mesin (beta). Versi bahasa Inggris dari README ([`README.md`](../../README.md)) adalah sumber yang baku dan paling otoritatif. Jika ada perbedaan, ikuti versi bahasa Inggris._

---

> **Baru di sini? Mulai dengan panduannya.** Cara paling ramah untuk memahami CareerForge adalah situs dokumentasi — Quick Start, ketiga perintah, dasbor dengan demo langsung, privasi, dan FAQ. Tidak perlu kemampuan pemrograman untuk membacanya.
>
> - 🌐 **Baca sekarang:** **[suraj-davariya.github.io/ai-job-search](https://suraj-davariya.github.io/ai-job-search/)** — ter-hosting, tidak ada yang perlu diinstal.
> - 📊 **Jelajahi dasbornya:** **[suraj-davariya.github.io/ai-job-search/dashboard](https://suraj-davariya.github.io/ai-job-search/dashboard/)** — UI asli dengan data contoh fiktif, hanya-baca.
> - 💻 **Lebih suka lokal?** Jalankan `npm run dev` di dalam [`docs-site/`](docs-site/) (atau lihat [README-nya](docs-site/README.md) untuk build statis satu perintah).

## Apa ini?

CareerForge adalah perangkat pencarian kerja yang Anda jalankan di dalam **Claude Code** — asisten AI yang hidup di terminal Anda. Anda mengetik perintah dan prompt dalam bahasa sehari-hari; AI yang melakukan pekerjaannya. Tidak diperlukan pengetahuan pemrograman.

Berikut yang dapat dilakukannya untuk Anda hari ini:

| Langkah | Anda katakan | Yang terjadi |
|------|---------|-------------|
| **1. Bangun profil Anda** | `/setup` | Claude membaca CV Anda yang sudah ada, ekspor LinkedIn, ijazah, atau mewawancarai Anda — lalu menulis profil kandidat Anda |
| **2. Temukan pekerjaan baru** | `/search` | Claude mencari di portal kerja yang Anda konfigurasikan, menghapus duplikat terhadap pekerjaan yang sudah Anda lihat, menilai kecocokan masing-masing, dan menampilkan tabel berperingkat |
| **3. Lamar** | `/apply <url atau tempel>` | Claude menilai kecocokan Anda, menyesuaikan CV Anda, menulis surat lamaran dalam bahasa lowongan, meminta peninjau AI kedua mengkritisi keduanya, menerapkan suntingan, mengompilasi dua PDF, dan menjalankan daftar periksa verifikasi akhir |

> **Data Anda tidak pernah meninggalkan mesin Anda.** Profil, CV, surat lamaran, dan log lamaran Anda semuanya disimpan secara lokal dan tidak pernah di-commit ke git.

---

## Cara kerjanya — versi 3 menit

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

**Yang tidak dilakukan CareerForge:**
- Mengirimkan lamaran atas nama Anda (Anda yang meninjau dan mengirim)
- Mengarang keterampilan atau pengalaman yang tidak Anda miliki
- Mengunggah apa pun ke cloud

---

## Apa yang Anda butuhkan

### 1. Claude Code

Claude Code adalah asisten AI yang menjalankan CareerForge. Instal sekali:

```bash
npm install -g @anthropic-ai/claude-code
```

Lalu masuk:

```bash
claude
```

Claude Code memerlukan [akun Anthropic](https://claude.ai). Paket Free dan Pro keduanya berfungsi; Pro direkomendasikan untuk penggunaan berat.

> **Belum yakin apa itu Claude Code?** Anggap saja sebagai asisten terminal cerdas yang dapat membaca berkas, mencari di web, dan menjalankan perintah — dipandu oleh instruksi CareerForge.

### 2. LaTeX (untuk pembuatan PDF)

CareerForge mengompilasi CV dan surat lamaran Anda menjadi PDF menggunakan LaTeX. Diperlukan dua kompiler:

| Kompiler | Digunakan untuk | Mengapa |
|----------|----------|-----|
| `lualatex` | CV | Diperlukan oleh paket `fontawesome` dan `lato` |
| `xelatex` | Surat lamaran | Diperlukan oleh `fontspec` untuk font bawaan |

**macOS** (direkomendasikan — memasang kedua kompiler):
```bash
brew install --cask mactex
```
Atau unduh dari [tug.org/mactex](https://www.tug.org/mactex/).

Setelah memasang, tambahkan paket CV tambahan:
```bash
sudo tlmgr install fontawesome lato tcolorbox dashrule enumitem multirow \
                   ifmtarg fontaxes mweights pgfopts
```

**Linux (TeX Live):**
```bash
sudo apt-get install texlive-full   # Debian/Ubuntu
```

**Windows:** Pasang [MiKTeX](https://miktex.org/download) — paket yang hilang akan diambil secara otomatis.

### 3. Python 3.10+ _(opsional — untuk benchmarking gaji)_

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

## Perintah secara mendalam

### `/setup` — Bangun profil kandidat Anda

Mengisi tujuh berkas profil dari data nyata Anda. Claude mengajukan pertanyaan atau membaca dokumen Anda — tanpa perlu mengetik jika Anda punya berkas.

**Tiga jalur orientasi:**

| Jalur | Kapan digunakan |
|------|-------------|
| **A — Pindai dokumen** | Anda memiliki CV, ekspor LinkedIn, ijazah, atau surat referensi di folder `documents/` |
| **B — Impor CV** | Anda memiliki satu CV yang rapi dan ingin memulai dengan cepat |
| **C — Wawancara langsung** | Memulai dari awal; Claude mewawancarai Anda |

**Contoh prompt:**

```
/setup
```
```
/setup --section search
```
> _(Langsung memperbarui portal kerja target dan preferensi lokasi Anda tanpa menjalankan ulang seluruh wawancara.)_

```
/setup --section experience
```
> _(Memperbarui hanya riwayat kerja Anda — berguna setelah perpindahan kerja.)_

**Yang dibangun:**

| Berkas | Isi |
|------|---------|
| `01-candidate-profile.md` | Identitas, pendidikan, riwayat kerja, keterampilan, proyek |
| `02-behavioral-profile.md` | Gaya kerja, preferensi budaya, motivasi |
| `03-writing-style.md` | _(kerangka statis — tanpa data pribadi)_ |
| `04-job-evaluation.md` | Area kuat/lemah Anda, tujuan karier |
| `05-cv-templates.md` | Pernyataan profil per jenis peran |
| `06-cover-letter-templates.md` | _(templat statis)_ |
| `07-interview-prep.md` | Cerita STAR dari pengalaman Anda |
| `search-queries.md` | Portal kerja target, kueri, dan tingkatan lokasi Anda |

---

### `/search` — Temukan lowongan pekerjaan baru

Mencari di portal kerja yang Anda konfigurasikan melalui pencarian web, menghapus duplikat terhadap pekerjaan yang sudah Anda lihat, memberikan sinyal kecocokan (Tinggi / Sedang / Rendah), dan menyajikan tabel berperingkat. Saat Anda memilih sebuah nomor, pekerjaan itu langsung diserahkan ke `/apply`.

**Argumen:**

| Sintaks | Perilaku |
|--------|-----------|
| `/search` | Menjalankan 3 kategori kueri prioritas teratas Anda |
| `/search data science` | Memprioritaskan kategori yang cocok dengan "data science" |
| `/search broad` | Menjalankan semua kategori kueri yang dikonfigurasi |

**Contoh prompt:**

```
/search
```
```
/search machine learning
```
```
/search broad
```

**Contoh keluaran:**

```
Found 7 new positions (2 high, 3 medium, 2 low match)

 #  Fit     Title                    Company        Location        Deadline   URL
 1  High    Senior Data Engineer     Acme Corp      Amsterdam, NL   2026-06-20  …
 2  High    ML Platform Engineer     Beta Labs      Remote (EU)     Open        …
 3  Medium  Data Analyst             Gamma AG       Berlin, DE      2026-06-15  …
…

Want me to evaluate any of these in detail? Just give me the number(s).
```

> **Semua portal berasal dari konfigurasi Anda.** Tidak ada yang di-hardcode — tambahkan papan kerja mana pun (LinkedIn, Indeed, Jobindex, Stepstone, dll.) ke `search-queries.md` dan portal itu otomatis disertakan.

---

### `/apply` — Hasilkan CV dan surat lamaran yang disesuaikan

Mengambil URL pekerjaan atau deskripsi yang ditempel dan menjalankan seluruh alur lamaran:

```
Step 0  Parse posting (URL or paste)
Step 1  Score fit across 5 dimensions → verdict + approval gate
Step 2  Draft tailored CV (English, 2 pages) + cover letter (posting language, 1 page)
Step 3  Spawn a fresh AI reviewer → critique both documents
Step 4  Apply reviewer edits + verify every company claim independently
Step 5  Compile PDFs (lualatex for CV, xelatex for cover letter) → inspect layout
Step 6  Record application in tracker → run full verification checklist
```

**Argumen:**

| Argumen | Perilaku |
|----------|-----------|
| _(default)_ | Alur penuh dengan peninjau (`--review=full`) |
| `--review=quick` | Peninjau melewati riset perusahaan — lebih cepat, biaya lebih rendah |
| `--review=none` | Lewati peninjau sepenuhnya — tercepat, biaya terendah |

**Contoh prompt:**

```
/apply https://careers.acme.com/jobs/senior-data-engineer-42
```
```
/apply --review=quick https://careers.acme.com/jobs/ml-platform-engineer
```

Atau tempel deskripsi pekerjaan secara langsung:

```
/apply
[paste job description here]
```

**Yang Anda dapatkan:**

| Keluaran | Lokasi |
|--------|---------|
| CV (PDF, 2 halaman, bahasa Inggris) | `cv/main_<company>.pdf` |
| Surat lamaran (PDF, 1 halaman, bahasa lowongan) | `cover_letters/cover_<company>_<role>.pdf` |
| Baris lamaran | `job_search_tracker.csv` |
| Evaluasi kecocokan | Dalam percakapan |

**Penilaian kecocokan (5 dimensi):**

| Dimensi | Bobot |
|-----------|--------|
| Kecocokan Keterampilan Teknis | 30% |
| Keselarasan Karier | 30% |
| Kecocokan Pengalaman | 25% |
| Kecocokan Perilaku / Budaya | 15% |
| Lokasi & Logistik | Lulus / Gagal |

Putusan: **Strong** (75+) · **Good** (60–74) · **Moderate** (45–59) · **Weak** (30–44) · **Poor** (<30)

> **Aturan bahasa:** surat lamaran selalu ditulis dalam bahasa lowongan pekerjaan. Lowongan berbahasa Denmark → surat lamaran berbahasa Denmark. CV selalu dalam bahasa Inggris.

---

### `/upskill` — Temukan kesenjangan keterampilan Anda dan rencana untuk menutupnya

Membandingkan profil Anda dengan permintaan pasar dan menghasilkan heatmap kesenjangan berprioritas, sebuah
rencana belajar yang dibangun dari sumber **nyata, hasil pencarian web**, dan urutan belajar yang sadar-ketergantungan
— lalu menyimpan semuanya sebagai laporan yang dapat ditampilkan dasbor kepada Anda.

**Dua mode:**

| Sintaks | Mode | Yang dianalisis |
|--------|------|------------------|
| `/upskill` | Agregat | Setiap pekerjaan di pelacak Anda, dibobotkan agar peran yang paling *tidak* Anda cocoki paling diperhitungkan |
| `/upskill <url>` | Bersasaran | Satu lowongan (tempel teksnya jika URL tidak dapat diambil) |

**Yang Anda dapatkan:**

| Keluaran | Lokasi |
|--------|---------|
| Heatmap kesenjangan (Kritis / Tinggi / Sedang / Rendah) | Dalam percakapan |
| Rencana belajar — 2–3 sumber per kesenjangan, dengan arah belajar + estimasi waktu | Dalam laporan |
| Urutan belajar dengan total waktu | Dalam laporan |
| Laporan tersimpan (dengan delta sejak-eksekusi-terakhir pada mode agregat) | `upskill/report-*.md` |

Laporan muncul di tab **Upskill** dasbor. Tidak ada yang dikarang — setiap
sumber berasal dari pencarian web langsung, dan pelacak yang kosong mendapat dorongan jujur menuju
mode bersasaran alih-alih laporan kosong.

---

### `/expand` — Kembangkan profil Anda dari segala yang sudah Anda lakukan

Menemukan kompetensi yang Anda miliki tetapi belum Anda tuliskan — dari dokumen Anda, repositori
**GitHub** publik Anda, dan web — lalu **menambahkannya** ke profil Anda. Ia tidak pernah menyunting atau
menghapus apa yang sudah ada di sana.

**Cara kerjanya:**

1. **Memindai** `documents/`, repositori GitHub Anda (README, bahasa, topik), dan
   tautan profil lain (portofolio, Kaggle, Scholar).
2. **Memperkaya** setiap temuan melalui pencarian web — baik pencarian langsung (silabus kursus,
   daftar keterampilan sertifikasi, dokumentasi alat) maupun inferensi tentang metode dan toolchain
   yang tersirat dari pekerjaan tersebut.
3. **Menunjukkan kepada Anda peta kompetensi** yang dikelompokkan per kategori, setiap item ditelusuri ke sumbernya dan
   ditandai langsung / terinferensi — untuk Anda tinjau *sebelum* apa pun ditulis.
4. **Menambahkan hanya yang Anda setujui**, masing-masing dengan catatan sumber seperti *(Coursera — Deep
   Learning Specialisation)*. Catatan tersebut membuat eksekusi ulang idempoten, dan sifat
   perilaku yang terinferensi diberi label dengan jelas.

**Contoh prompt:**

```
/expand
```
```
/expand github
```
> _(Memprioritaskan repositori GitHub Anda sebagai sumber yang akan digali.)_

Karena setiap penambahan bersifat aditif dan beranotasi sumber, Anda dapat menjalankan `/expand` lagi
setelah kursus atau proyek baru dan ia hanya memasukkan yang benar-benar baru.

---

### `/reset` — Mulai dari awal, dengan aman

Menghapus data pribadi Anda agar Anda bisa memulai lagi — arah karier baru, profil yang segar,
atau menyerahkan repo kepada orang lain — **tanpa** menyentuh kerangka yang
membuat CareerForge bekerja.

**Cakupan:**

| Sintaks | Menghapus |
|--------|--------|
| `/reset profile` | Berkas keterampilan profil Anda (kembali ke templat kosong) |
| `/reset documents` | Berkas Anda di `documents/` (struktur folder + README dipertahankan) |
| `/reset all` | Keduanya |

Ia selalu **menunjukkan inventaris terlebih dahulu** (apa yang akan dihapus vs. apa yang dipertahankan),
dan **tidak ada yang terjadi sampai Anda mengetik `RESET`** dengan huruf kapital — balasan lain apa pun membatalkan. Panduan
gaya menulis, kerangka penilaian, templat surat lamaran, dan kerangka persiapan wawancara
tidak pernah disentuh; hanya data Anda yang dihapus. Tidak ada urungan, jadi ia mengarahkan Anda ke
riwayat git sebagai satu-satunya pemulihan, lalu menyarankan menjalankan `/setup` untuk membangun ulang.

---

## Dasbor pelacakan

UI web khusus-lokal yang **membaca dan menulis secara atomik `job_search_tracker.csv` Anda sebagai satu-satunya sumber kebenaran**, memvisualkan alur Anda, dan dapat menjalankan CLI (`/apply`, `/upskill`, pencarian gaji) dari peramban. Ini adalah pendamping opsional — menghapusnya tidak mengubah data Anda maupun alur `/apply`.

> **Coba tanpa memasang →** [**Demo langsung**](https://suraj-davariya.github.io/ai-job-search/dashboard/) — panduan hanya-baca dengan data contoh fiktif. Pengeditan, Konsol, dan pratinjau PDF dinonaktifkan di sana (semuanya memerlukan aplikasi yang berjalan secara lokal); selebihnya adalah UI asli.

```bash
cd dashboard
npm install
npm run build
npm run serve          # prints  ▶  http://127.0.0.1:4480/
```

| Permukaan | Yang dilakukannya |
|---------|--------------|
| **Applications** | Urutkan/saring/cari pelacak; suntingan status + catatan inline (atomik, dijaga mesin-status); `+ New`; laci detail dengan pratinjau PDF terjaga |
| **Overview** | Kartu KPI (total, dilamar 7h/30h, rata-rata kecocokan, tingkat wawancara) + grafik mingguan/status/kecocokan/kalender — `—` yang jujur saat ambang sampel belum terpenuhi |
| **Console** | Jalankan perintah dari daftar izin dan alirkan keluarannya secara langsung; jalankan ulang `/apply`, `/upskill`, dan pencarian gaji per-perusahaan |
| **Companies · Salary · Upskill · Profile · Settings** | Tampilan terkelompok/terbenchmark/laporan/profil; preferensi tema + hanya-baca |

**Lokal sejak rancangannya:** hanya mengikat `127.0.0.1` (tanpa LAN, tanpa autentikasi, tanpa akun), tidak melakukan panggilan jaringan keluar, menjalankan perintah melalui daftar izin tetap tanpa shell, dan tidak menyimpan rahasia. Mode `--read-only` menonaktifkan setiap suntingan dan tindakan. Lihat [`dashboard/README.md`](dashboard/README.md) dan [`dashboard/ARCHITECTURE.md`](dashboard/ARCHITECTURE.md).

> Memerlukan Node 18+. Lapisan tindakan (menjalankan perintah dari peramban) memerlukan biner `claude` dan/atau `python3` di `PATH`; saat tidak ada, pemicu tersebut dinonaktifkan dan sisanya tetap berfungsi.

---

> **Semua perintah yang direncanakan telah dirilis.** `/setup`, `/search`, `/apply`, `/upskill`,
> `/expand`, dan `/reset` semuanya aktif (v1.0–v1.2). Lihat [Roadmap](#roadmap) untuk yang
> berikutnya.

---

## Contoh sesi

Berikut panduan ujung-ke-ujung yang realistis.

**1. Penyiapan pertama kali**

```
you:   /setup
claude: I found files in documents/cv/ and documents/linkedin/. I'll scan them.
        … (reads your CV) …
        Here is what I extracted. [shows proposed profile content]
        Shall I write this to your profile files?
you:   Yes
claude: Done. Your profile is ready.
```

**2. Mencari pekerjaan**

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

**3. Melamar**

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

## Privasi

| Data | Tempat penyimpanan | Di-commit ke git? |
|------|----------------|-------------------|
| Profil kandidat | `.claude/skills/job-application-assistant/` | Tidak |
| CV & surat lamaran yang dihasilkan | `cv/output/`, `cover_letters/output/` | Tidak |
| Pelacak lamaran | `job_search_tracker.csv` | Tidak |
| Registri pekerjaan-terlihat | `job_scraper/seen_jobs.json` | Tidak |
| Dokumen sumber | `documents/` | Tidak |
| Data gaji | `salary_data.json` | Tidak |

Berkas `.gitignore` menegakkan semua pengecualian ini. Jika Anda mendorong fork Anda ke GitHub, **gunakan repositori privat** agar berkas profil Anda tidak pernah terekspos.

---

## Struktur direktori

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

## Mengompilasi templat secara manual

Jika Anda ingin menguji templat LaTeX secara mandiri:

**CV** (jalankan dari direktori `cv/`):
```bash
cd cv
lualatex main_example.tex
# → main_example.pdf
```

**Surat lamaran** (jalankan dari `cover_letters/` — direktori kerja penting untuk pemuatan font):
```bash
cd cover_letters
xelatex main_example.tex
# → main_example.pdf
```

---

## Roadmap

| Milestone | Status | Yang dirilis |
|-----------|--------|-----------|
| **MVP** (Epics 1–5) | ✅ Selesai | `/setup`, `/apply` (tanpa peninjau), kompilasi PDF |
| **v1.0** (Epics 6–8) | ✅ Selesai | Agen peninjau, `/search`, pelacak lamaran |
| **v1.0 — Dashboard** (Epic 9) | ✅ Selesai | Dasbor pelacakan lokal di `127.0.0.1:4480` — lihat/sunting pelacak, analitik, jalankan perintah dari peramban |
| **v1.1** (Epics 10–11) | ✅ Selesai | Analisis kesenjangan keterampilan `/upskill` + rencana belajar, dan ekspansi kompetensi `/expand` dari dokumen, GitHub, dan web Anda |
| **v1.2** (Epic 12) | ✅ Selesai | `/reset`, kerangka persiapan wawancara, pola adaptor portal ADR-0004 + contoh, agen riset |
| **v2.0** | 💡 Mendatang | Marketplace templat, adaptor portal komunitas, GUI |

Lihat rencana lengkapnya di [`docs/plan/delivery-strategy.md`](docs/plan/delivery-strategy.md).

---

## Dokumentasi

**Mulai di sini →** [`docs-site/`](docs-site/) — **situs web** dokumentasi: panduan ramah-pemula untuk seluruh produk (Quick Start, ketiga perintah, dasbor dengan demo langsung, data Anda, privasi, FAQ, glosarium). Jalankan secara lokal dengan `npm run dev` di dalam `docs-site/`, atau build statis dengan `npm run build`.

Dokumentasi rekayasa (spesifikasi, arsitektur, rencana):

| Jalur | Isi |
|------|----------|
| [`docs/requirements/`](docs/requirements/) | Persyaratan fungsional lengkap (ID `REQ-####`) |
| [`docs/architecture/`](docs/architecture/) | Tumpukan teknologi, desain komponen, ADR |
| [`docs/plan/`](docs/plan/) | Milestone, epik, rincian pekerjaan |
| [`docs/development/`](docs/development/) | Standar pengodean, struktur proyek, panduan kontribusi |
| [`docs/testing/`](docs/testing/) | Strategi pengujian, kasus uji (ID `TC-####`) |
| [`docs/glossary.md`](docs/glossary.md) | Istilah baku |

---

## Berkontribusi

Kontribusi sangat diterima — templat CV/surat lamaran baru, paket lokal, adaptor portal, perbaikan bug, dan peningkatan dokumentasi semuanya membantu.

> ⚠️ **Gunakan fork privat.** Profil kandidat Anda berada di direktori yang sama dengan kode sumber. Selalu bekerja di repositori GitHub privat agar data pribadi Anda tetap di luar internet publik.

Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan lengkap, penamaan branch, daftar periksa PR, dan cara menambahkan portal kerja atau lokal baru.

---

## Lisensi

MIT — lihat [LICENSE](LICENSE). ![Repo views](https://komarev.com/ghpvc/?username=suraj-davariya-ai-job-search&label=Repo%20views&color=D97757)
