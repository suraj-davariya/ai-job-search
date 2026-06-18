"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, Check, ShieldCheck } from "lucide-react";
import type { Provenance } from "@/lib/data/provenance";

/**
 * Per-application fabrication-audit panel (REQ-2066). On open it fetches the
 * application's provenance ledger (the same fetch-on-mount pattern as the
 * drawer's file links) and renders the audit summary plus every claim with its
 * backing source. Flagged (unbacked) claims are visually distinct so the user
 * reviews them before submitting. No ledger → a subtle "not recorded" line; the
 * fetch never throws the drawer (ARCH-0005).
 */
export function ProvenancePanel({
  company,
  role,
}: {
  company: string;
  role: string;
}) {
  const t = useTranslations("applications");
  const [state, setState] = useState<"loading" | "none" | "ready">("loading");
  const [data, setData] = useState<Provenance | null>(null);

  useEffect(() => {
    let active = true;
    const href = `/api/provenance?company=${encodeURIComponent(
      company,
    )}&role=${encodeURIComponent(role)}`;
    fetch(href)
      .then(async (res) => {
        if (!active) return;
        if (!res.ok) {
          setState("none");
          return;
        }
        setData((await res.json()) as Provenance);
        setState("ready");
      })
      .catch(() => active && setState("none"));
    return () => {
      active = false;
    };
  }, [company, role]);

  // Avoid a flash while the HEAD-equivalent fetch is in flight.
  if (state === "loading") return null;

  return (
    <div className="mt-5 space-y-2">
      <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
        {t("provenance.title")}
      </h3>

      {state === "none" || !data ? (
        <p className="text-xs text-muted-foreground">{t("provenance.none")}</p>
      ) : (
        <>
          <div
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ${
              data.summary.flagged > 0
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {data.summary.flagged > 0 ? (
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            )}
            {t("provenance.summary", {
              total: data.summary.total,
              flagged: data.summary.flagged,
            })}
          </div>

          <ul className="space-y-2">
            {data.claims.map((c, i) => (
              <li
                key={i}
                data-testid={c.backed ? "claim-backed" : "claim-flagged"}
                className={`rounded-md border px-2.5 py-2 text-xs ${
                  c.backed
                    ? "border-border bg-card"
                    : "border-destructive/40 bg-destructive/10"
                }`}
              >
                <div className="flex items-start gap-1.5">
                  {c.backed ? (
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                      aria-hidden
                    />
                  ) : (
                    <AlertTriangle
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive"
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0 space-y-0.5">
                    <p className="break-words">{c.claim}</p>
                    {c.backed && c.source ? (
                      <p className="text-muted-foreground">
                        {c.location
                          ? t("provenance.backedBy", {
                              source: c.source,
                              location: c.location,
                            })
                          : t("provenance.backedBySource", {
                              source: c.source,
                            })}
                      </p>
                    ) : (
                      <p className="font-medium text-destructive">
                        {c.note ?? t("provenance.flagged")}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
