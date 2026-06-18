# Contributing Translations

Thank you for helping make CareerForge usable in your language. **Every language you
add is real value to that language's job seekers.** You do not need to write code to
translate — only to edit text files.

## The short version

1. Find your language's BCP-47 code in [`_meta/languages.json`](_meta/languages.json).
   If it isn't listed, add an entry (copy the shape of an existing one) — that's all it
   takes to register a new language.
2. Copy the English files you want to translate from `ui/en/` into `ui/<your-code>/`,
   and translate the **values** (never the keys).
3. Open a pull request. Translations are reviewed like code; you'll be credited in the
   git history and on the Weblate project.

## Preferred path: Weblate (no Git needed)

Most translators use **Weblate**, a web UI where you translate string-by-string with
machine-translation suggestions to start from. See [`_meta/weblate.md`](_meta/weblate.md)
for the project link. Weblate commits back to this `i18n/` tree automatically.

## What to translate

- `ui/<code>/*.json` — dashboard + CLI strings (ICU MessageFormat — see below)
- `readme/README.<code>.md` — the localized README
- `glossary/<code>/glossary.md` — the user-facing glossary

Do **not** translate the internal engineering spec under `docs/` — it stays English.

## ICU MessageFormat rules

- Translate values, keep keys identical: `"nav.applications": "Applications"` → `"Applications"` only.
- Keep named placeholders unchanged: `"Hello {name}"` → keep `{name}`.
- Use the correct plural forms for your language (Arabic, Russian, Polish and many
  Indic languages have more than two): `"{count, plural, one {# job} other {# jobs}}"`.
  Add the categories your language needs (`zero`, `two`, `few`, `many`).
- Never invent meaning. If a string is ambiguous, ask in the PR rather than guessing.

## After translating (maintainers)

```
node scripts/i18n-parity-check.mjs --stamp <code>   # record the English baseline you translated from
node scripts/i18n-parity-check.mjs                  # confirm completeness
```

When a language reaches the completeness threshold and passes human review, flip its
`status` to `released` in the registry. Until then it ships as **beta** with a
"needs review" note — which is fine; a beta translation still helps real people.

## A note on machine translation

We seed new languages with machine translation so coverage is broad from day one, then
humans refine. If you spot a machine-translated string that's wrong or unnatural, fixing
it is one of the most valuable contributions you can make.
