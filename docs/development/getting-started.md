# Development — Getting Started

> **Purpose:** Step-by-step instructions for a developer to set up their local environment, install dependencies, configure API keys, and run CareerForge CLI commands.
>
> **Status:** Draft
> **Last updated:** 2026-06-05
> **Owner persona:** Staff Engineer

---

## Prerequisites

Before setting up CareerForge, ensure your local system meets the following requirements:

### 1. Python Environment
- Python version **3.10** or higher is required.
- We recommend using **`uv`** as the fast package installer and manager.

### 2. TypeScript / Node.js
- Node.js **18.x** or higher, or **Bun** runtime.
- Package manager of choice (e.g., `npm` or `bun`).

### 3. LaTeX Toolchain
CareerForge compiles professional PDF materials using specific TeX engines. Ensure the following are installed and available on your system `PATH`:
- **LuaLaTeX** (typically bundled with TeX Live or MacTeX; used for CVs)
- **XeLaTeX** (used for Cover Letters to load custom system fonts)
- **Tectonic** (Optional fallback; single-binary TeX engine)

---

## Installation & Bootstrapping

Follow these steps to initialize the repository:

1. **Clone the repository** (or your private fork):
   ```bash
   git clone https://github.com/your-org/careerforge.git
   cd careerforge
   ```

2. **Run the bootstrap script**:
   This script verifies prerequisites, creates required directories, installs Python/Node dependencies, and sets up git pre-commit hooks.
   ```bash
   ./tools/bootstrap.sh
   ```

3. **Verify LaTeX Engines**:
   Ensure compilation tools are executable:
   ```bash
   lualatex --version
   xelatex --version
   ```

---

## Environment & Configuration

CareerForge relies on environment variables for LLM provider access. Copy the template settings file and fill in your keys:

```bash
cp settings/env.template.json settings/env.json
```

Open `settings/env.json` and configure:

```json
{
  "LLM_PROVIDER": "anthropic",
  "ANTHROPIC_API_KEY": "your-key-here",
  "OPENAI_API_KEY": "optional-fallback-key",
  "LOCAL_LATEX_PATH": "/usr/local/bin",
  "DOCKER_FALLBACK": false
}
```

> [!WARNING]
> Never commit `settings/env.json` or any file containing API keys. The `.gitignore` file contains rules to actively block them.

---

## Preparing Seed Data

To test the onboarding command:
1. Place a few of your existing text/PDF resumes, cover letters, or bio documents inside the `/documents/` directory.
2. Ensure you have no private files or non-work-related documents there to prevent accidental parsing of sensitive PII.

---

## Running CLI Commands

Execute commands using the CLI runner:

```bash
# Setup your profile (Path A - Document scanning)
npm run cli -- /setup --path documents --section all

# Evaluate and generate cover letter/CV for a target job posting
npm run cli -- /apply "https://example-careers.com/jobs/staff-engineer-123"

# Search for jobs
npm run cli -- /search --keywords "Staff Engineer" --location "Remote"
```
