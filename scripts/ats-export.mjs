#!/usr/bin/env node
// ATS-safe CV export + parse self-check (REQ-2063, REQ-2064, ADR-0003).
//
// The polished LaTeX PDF stays the primary, human-facing output. This produces the
// machine-parseable companions ATS systems prefer — a .docx and a .txt — from one
// ATS-safe Markdown source (so all three artifacts stay content-equivalent), then
// verifies the compiled PDF is itself parseable.
//
// Usage:
//   node scripts/ats-export.mjs --md cv/main_acme.ats.md --out cv/output \
//        [--pdf cv/output/main_acme.pdf] [--name "Ada Lovelace"] [--keywords "python,llm,docker"]
//
// Behavior (graceful degradation, ARCH-0005 — never blocks delivery, REQ-2064):
//   • .txt  — via pandoc if present, else a built-in Markdown stripper (always works)
//   • .docx — via pandoc if present, else skipped with a note (install pandoc to enable)
//   • parse self-check — via `pdftotext` if present, else skipped with a note
// Exit code is always 0; problems are reported as warnings for the human to act on.

import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, join, extname } from 'node:path';

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
function has(cmd) {
  return spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd]).status === 0;
}

const mdPath = arg('md');
const outDir = arg('out', '.');
const pdfPath = arg('pdf');
const name = arg('name');
const keywords = (arg('keywords') || '').split(',').map((s) => s.trim()).filter(Boolean);

if (!mdPath) {
  console.error('✖ --md <ats-markdown> is required');
  process.exit(2); // usage error (distinct from a soft warning)
}

mkdirSync(outDir, { recursive: true });
const base = basename(mdPath, extname(mdPath)).replace(/\.ats$/, '');
const txtOut = join(outDir, `${base}.txt`);
const docxOut = join(outDir, `${base}.docx`);
const md = readFileSync(mdPath, 'utf8');
const pandoc = has('pandoc');
const warnings = [];

// --- .txt ---
if (pandoc) {
  try {
    execFileSync('pandoc', [mdPath, '-t', 'plain', '-o', txtOut]);
    console.log(`✔ ${txtOut} (pandoc)`);
  } catch (e) {
    warnings.push(`pandoc failed for .txt (${e.message}); wrote stripped fallback`);
    writeFileSync(txtOut, stripMarkdown(md));
    console.log(`✔ ${txtOut} (fallback)`);
  }
} else {
  writeFileSync(txtOut, stripMarkdown(md));
  console.log(`✔ ${txtOut} (fallback — install pandoc for higher-fidelity text)`);
}

// --- .docx ---
if (pandoc) {
  try {
    execFileSync('pandoc', [mdPath, '-o', docxOut]);
    console.log(`✔ ${docxOut} (pandoc)`);
  } catch (e) {
    warnings.push(`pandoc failed for .docx: ${e.message}`);
  }
} else {
  warnings.push('.docx skipped — install pandoc (https://pandoc.org) to generate the Word export');
}

// --- parse self-check on the PDF (REQ-2064) ---
if (pdfPath) {
  if (has('pdftotext')) {
    try {
      const text = execFileSync('pdftotext', [pdfPath, '-']).toString();
      const norm = text.toLowerCase();
      const checks = [];
      if (name) checks.push(['name', norm.includes(name.toLowerCase())]);
      for (const h of ['experience', 'education', 'skills'])
        checks.push([`section:${h}`, norm.includes(h)]);
      for (const k of keywords) checks.push([`keyword:${k}`, norm.includes(k.toLowerCase())]);
      const failed = checks.filter(([, ok]) => !ok).map(([n]) => n);
      if (failed.length === 0) {
        console.log(`✔ ATS parse self-check passed (${checks.length} fields recoverable from PDF)`);
      } else {
        console.log(`⚠ ATS parse self-check: not recoverable from PDF → ${failed.join(', ')}`);
        console.log(`  The .txt/.docx exports are the ATS-safe fallback for these fields.`);
      }
    } catch (e) {
      warnings.push(`pdftotext failed: ${e.message}`);
    }
  } else {
    warnings.push('parse self-check skipped — install poppler (pdftotext) to verify PDF parseability');
  }
}

if (warnings.length) {
  console.log('\nNotes:');
  for (const w of warnings) console.log(`  • ${w}`);
}

function stripMarkdown(s) {
  return s
    .replace(/^---[\s\S]*?---\n/, '')        // front-matter
    .replace(/^#{1,6}\s+/gm, '')             // headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')       // bold
    .replace(/\*([^*]+)\*/g, '$1')           // italic
    .replace(/`([^`]+)`/g, '$1')             // inline code
    .replace(/^\s*[-*+]\s+/gm, '• ')         // bullets
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}
