# cover_letters/

Cover letter LaTeX templates, custom class, and bundled fonts for CareerForge.

---

## Files

| File | Purpose |
|------|---------|
| `cfcl.cls` | Custom LaTeX class — defines all macros, colours, and font loading |
| `main_example.tex` | Generic one-page template with `{{TOKEN}}` placeholders |
| `OpenFonts/fonts/Lato/` | Bundled Lato TTF files (body font, OFL licence) |
| `OpenFonts/fonts/Raleway/` | Bundled Raleway TTF files (optional display use, OFL licence) |
| `OpenFonts/fonts/FontAwesome6Free/` | FontAwesome 6 Free TTF files (icons, FA Free licence) |
| `output/` | Generated cover letter files — gitignored, never committed |

---

## Compiling

**Always compile from this directory** (`cover_letters/`) so fontspec can
resolve the `OpenFonts/fonts/` paths:

```bash
cd cover_letters
xelatex main_example.tex
# Output: main_example.pdf (should be exactly 1 page)
```

---

## Generating a Cover Letter for a New Role

The AI skill (`/apply`) reads `main_example.tex`, fills in the `{{TOKEN}}`
placeholders from your candidate profile and the job posting, and saves the
result as `cover_letters/main_<Company>_<Role>.tex`. It then compiles to PDF
from this directory.

Generated files are gitignored — they are personal output and never committed.

---

## Font Sources and Licences

| Font | Source | Licence |
|------|--------|---------|
| Lato | [Google Fonts](https://fonts.google.com/specimen/Lato) | OFL 1.1 |
| Raleway | [Google Fonts](https://fonts.google.com/specimen/Raleway) | OFL 1.1 |
| FontAwesome 6 Free | [fontawesome.com](https://fontawesome.com/icons) | FA Free Licence |

All licences permit bundling and redistribution. Full licence texts:
- OFL: https://scripts.sil.org/OFL
- FA Free: https://fontawesome.com/license/free

---

## Adding a New Icon

1. Find the icon at https://fontawesome.com/icons (filter: Free)
2. Click the icon → copy the Unicode codepoint (e.g., `f1fa`)
3. Determine which font file contains it:
   - Brands icons (GitHub, LinkedIn, Twitter…) → `fa-brands-400.ttf` → use `\FAbrands`
   - All others → `fa-solid-900.ttf` → use `\FAsolid`
4. Add a macro to `cfcl.cls`:

```latex
\newcommand{\faIconName}{{\FAsolid\char"F1FA}}  % icon-name
```

5. Use in your template: `\citem{\faIconName}{your text}`
