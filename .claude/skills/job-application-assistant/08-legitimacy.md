<!-- Static framework (preserved through /reset). The posting-legitimacy gate (REQ-8001–8005, business-rules §10). -->

# Posting Legitimacy Gate

Before tailoring anything, assess whether a posting is **genuine and safe to engage
with**. This protects the user from scams, ghost jobs, and exploitative listings —
which are common everywhere and especially in cross-border markets (REQ-8001).

## A separate gate — not part of the fit score

Legitimacy is assessed **independently** of the 0–100 fit score (business-rules §10,
owner-locked decision). A scam can be a perfect skills match; folding legitimacy into the
fit score would let it average out to a high "apply" number and slip through. So the
output is a **standalone verdict**, surfaced **before** drafting begins.

## The verdict

| Verdict | Meaning | Action |
|---------|---------|--------|
| **Verified** | Identifiable legitimate employer; no material red flags. | Proceed normally. |
| **Caution** | Some unverifiable elements or minor flags. | Proceed, but tell the user what to check (e.g. confirm the recruiter, verify the domain). |
| **Suspicious** | One or more strong scam signals. | Strongly discourage; explain why. **Never auto-block** — the user decides (ARCH-0006). |

## How to assess

1. Load the red-flag catalog: `trust-safety/scam-patterns.json` (`globalSignals` +
   any `byRegion` entries matching the active locale pack, REQ-8005).
2. Check the posting and any employer/contact details against each signal. Use web
   search to corroborate the employer's identity, domain, and the contact where possible.
3. Weigh **cited evidence** — quote the specific phrase or fact that triggered a signal.
4. Map to a verdict using the severity guidance in the catalog (one `high` signal ⇒
   usually Suspicious; multiple `medium` ⇒ Caution/Suspicious).

## Invariants

- **Warn, never block (ARCH-0006).** Present the verdict and reasons; the user decides.
- **No fabricated accusations (ARCH-0007).** Never call a posting a scam without citing
  the specific evidence. If you are unsure, say so honestly and use **Caution**, not
  **Suspicious**.
- **Fail open (ARCH-0005).** If legitimacy signals can't be gathered (e.g. the posting
  can't be fetched), proceed with a neutral note rather than blocking the pipeline.

## Ghost jobs

Long-open, repeatedly reposted, or never-closing listings may be **ghost jobs** (posted
without genuine intent to hire). Flag these as a Caution signal; this ties to posting
liveness (REQ-1011, REQ-1015) in the search flow.
