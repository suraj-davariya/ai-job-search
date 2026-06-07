# documents/

This directory holds your personal source documents — CVs, LinkedIn exports,
degree certificates, reference letters, and past application records.

**All subdirectories are gitignored.** Their contents never leave your machine.

---

## Subdirectory Guide

| Folder | What to put here | Accepted formats |
|--------|-----------------|-----------------|
| `cv/` | Your existing CVs or résumés | `.pdf`, `.docx`, `.txt`, `.md` |
| `linkedin/` | LinkedIn data export (`export.zip` or extracted files) | any |
| `diplomas/` | Degree certificates, transcripts | `.pdf`, `.jpg`, `.png` |
| `references/` | Reference letters from employers or academics | `.pdf`, `.docx`, `.txt` |
| `applications/` | Records of past applications (auto-populated by `/apply`) | any |

---

## Usage

Place your documents in the relevant folders above, then run:

```
/setup
```

The AI will scan `documents/cv/` (and optionally other folders) to extract
your profile information — work history, education, skills, and preferences.

---

## Privacy

Everything in this directory stays on your machine. The gitignore rules
exclude all contents from version control. Only this `README.md` is tracked.
