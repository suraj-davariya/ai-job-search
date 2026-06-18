# `i18n/` — CareerForge Localization Tree

All static localization lives here, in one tree, so the repository root stays
uncluttered as languages scale (ADR-0007). Adding a language adds files *inside*
this directory — never in the root.

```
i18n/
├── _meta/
│   ├── languages.json          # the Language Registry (REQ-7004) — source of truth for supported languages
│   ├── languages.schema.json   # JSON Schema for the registry
│   └── weblate.md              # Weblate component setup (managed translation)
├── ui/                         # static UI / CLI strings — ICU MessageFormat JSON
│   ├── en/                     # English = source of truth (common, dashboard, applications, console, settings, salary, errors)
│   │   └── *.json
│   └── <code>/                 # one directory per BCP-47 language code
│       ├── *.json
│       └── _source.json        # SHA-256 of each English namespace this translation was made from (staleness baseline, REQ-7006)
├── readme/
│   └── README.<code>.md        # localized READMEs (the root README.md is English/canonical + a language switcher)
├── glossary/
│   └── <code>/glossary.md      # translated user-facing glossary
└── CONTRIBUTING.md             # how to add or update a language
```

## What is and isn't translated

- **Translated (user-facing):** dashboard UI, CLI/command output, README, docs-site,
  glossary, error messages.
- **English-canonical (not translated):** the internal engineering spec
  (`docs/requirements`, `docs/architecture`, `docs/testing`). Industry standard for
  fast-churning contributor docs (ADR-0007).

## Two separate axes

- **Language** (this tree) — the words a surface is written in.
- **Locale / region** (`../locale-packs/`) — a market's conventions (CV norms, photo,
  page size, date/currency, legal clauses), decoupled from language.

## Quality & status

Every language has a `status` (`released` / `beta`) and `quality` (`high` /
`low-resource`) in the registry. Machine-seeded translations start as **beta** and
become **released** only after human review meets the completeness threshold
(NFR-0020). `low-resource` languages (REQ-7011) need extra human review because LLM
output quality is lower there.

## Checking translation health

```
node scripts/i18n-parity-check.mjs          # per-language completeness + staleness; CI gate
node scripts/i18n-parity-check.mjs --stamp <code>   # after translating <code>, record the English baseline
```
