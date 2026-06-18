#!/usr/bin/env node
// i18n parity / staleness check (REQ-7006, NFR-0020, ADR-0007).
//
// English (i18n/ui/en/**.json) is the source of truth. Each translated language
// records, in i18n/ui/<lang>/_source.json, the SHA-256 of each English namespace
// file it was translated from. This script:
//   • reports per-language completeness (translated keys / English keys)
//   • flags STALE namespaces (English changed since translation) and MISSING keys
//   • fails CI if any *released* language is below the completeness threshold or stale
//     (beta languages are reported but never fail the build)
//
// Usage:
//   node scripts/i18n-parity-check.mjs              # report + CI gate
//   node scripts/i18n-parity-check.mjs --json       # machine-readable report
//   node scripts/i18n-parity-check.mjs --stamp <lang>   # record current English
//                                                       # hashes for <lang> after translating
//
// Dependency-free (Node stdlib only).

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const UI = join(ROOT, 'i18n', 'ui');
const REGISTRY = join(ROOT, 'i18n', '_meta', 'languages.json');
const RELEASED_THRESHOLD = 0.95; // NFR-0020: a released language must be ≥95% complete

const sha = (s) => createHash('sha256').update(s).digest('hex');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

// Flatten nested ICU JSON to dotted leaf keys.
function leafKeys(obj, prefix = '', out = new Set()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) leafKeys(v, key, out);
    else out.add(key);
  }
  return out;
}

const enDir = join(UI, 'en');
if (!existsSync(enDir)) {
  console.error('✖ No English source catalog at i18n/ui/en — nothing to check.');
  process.exit(1);
}
const namespaces = readdirSync(enDir).filter((f) => f.endsWith('.json'));
const enHashes = {};
const enKeys = {};
let enKeyTotal = 0;
for (const ns of namespaces) {
  const raw = readFileSync(join(enDir, ns), 'utf8');
  enHashes[ns] = sha(raw);
  enKeys[ns] = leafKeys(JSON.parse(raw));
  enKeyTotal += enKeys[ns].size;
}

// --stamp <lang>: record the English hashes the language was just translated from.
const stampIdx = process.argv.indexOf('--stamp');
if (stampIdx !== -1) {
  const lang = process.argv[stampIdx + 1];
  if (!lang) { console.error('✖ --stamp requires a language code'); process.exit(1); }
  writeFileSync(join(UI, lang, '_source.json'), JSON.stringify(enHashes, null, 2) + '\n');
  console.log(`✔ Stamped ${lang} against current English source (${namespaces.length} namespaces).`);
  process.exit(0);
}

const registry = readJson(REGISTRY).languages;
const report = [];
let ciFail = false;

for (const lang of registry) {
  if (lang.code === 'en') continue;
  const langDir = join(UI, lang.code);
  const recorded = existsSync(join(langDir, '_source.json')) ? readJson(join(langDir, '_source.json')) : {};
  let translatedKeys = 0;
  const stale = [];
  const missing = [];
  for (const ns of namespaces) {
    const nsPath = join(langDir, ns);
    if (!existsSync(nsPath)) { missing.push(ns); continue; }
    const tKeys = leafKeys(readJson(nsPath));
    for (const k of enKeys[ns]) if (tKeys.has(k)) translatedKeys++;
    if (recorded[ns] !== enHashes[ns]) stale.push(ns);
  }
  const completeness = enKeyTotal ? translatedKeys / enKeyTotal : 0;
  const entry = {
    code: lang.code, status: lang.status, quality: lang.quality,
    completeness: Math.round(completeness * 1000) / 10,
    staleNamespaces: stale, missingNamespaces: missing,
  };
  report.push(entry);
  if (lang.status === 'released' && (completeness < RELEASED_THRESHOLD || stale.length || missing.length)) {
    ciFail = true;
    entry.ciViolation = true;
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ threshold: RELEASED_THRESHOLD, enKeyTotal, languages: report }, null, 2));
} else {
  console.log(`\ni18n parity — English source: ${namespaces.length} namespaces, ${enKeyTotal} keys`);
  console.log(`Released threshold: ${RELEASED_THRESHOLD * 100}% complete + not stale\n`);
  for (const r of report) {
    const tag = r.ciViolation ? '✖' : r.status === 'released' ? '✔' : '·';
    const flags = [
      r.staleNamespaces.length ? `${r.staleNamespaces.length} stale` : '',
      r.missingNamespaces.length ? `${r.missingNamespaces.length} missing` : '',
      r.quality === 'low-resource' ? 'low-resource' : '',
    ].filter(Boolean).join(', ');
    console.log(`  ${tag} ${r.code.padEnd(8)} ${String(r.completeness).padStart(5)}%  [${r.status}]${flags ? '  ' + flags : ''}`);
  }
  console.log('');
}

if (ciFail) {
  console.error('✖ One or more RELEASED languages are incomplete or stale. Fix translations or mark them beta.');
  process.exit(1);
}
