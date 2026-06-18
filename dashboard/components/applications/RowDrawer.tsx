"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ExternalLink, FileText, FileX, Play, X } from "lucide-react";
import type { TrackerRow } from "@/lib/domain/status";
import { StatusPill } from "./StatusPill";
import { FitBadge } from "./FitBadge";
import { ProvenancePanel } from "./ProvenancePanel";

/** Split text into plain spans and clickable links for any http(s) URLs. */
function linkify(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:underline"
      >
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * A CV / cover-letter link that probes the file with a HEAD request on mount
 * (REQ-5005): a present file renders a "view PDF" link, a missing one renders a
 * "file not found" badge instead of a broken link.
 */
function FileLink({ label, file }: { label: string; file: string }) {
  const t = useTranslations("applications");
  const [state, setState] = useState<"checking" | "ok" | "missing">("checking");

  useEffect(() => {
    let active = true;
    const href = `/api/file?path=${encodeURIComponent(file)}`;
    fetch(href, { method: "HEAD" })
      .then((res) => active && setState(res.ok ? "ok" : "missing"))
      .catch(() => active && setState("missing"));
    return () => {
      active = false;
    };
  }, [file]);

  const href = `/api/file?path=${encodeURIComponent(file)}`;

  if (state === "missing") {
    return (
      <span
        data-testid="file-missing"
        className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-xs text-destructive"
      >
        <FileX className="h-3.5 w-3.5" aria-hidden />
        {t("drawer.fileNotFound", { label })}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-disabled={state === "checking"}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs text-primary hover:bg-muted/60"
    >
      <FileText className="h-3.5 w-3.5" aria-hidden />
      {label}
      <ExternalLink className="h-3 w-3 opacity-60" aria-hidden />
    </a>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{value || <span className="text-muted-foreground">—</span>}</dd>
    </div>
  );
}

/**
 * Side drawer with a row's full record (REQ-5005). Opens over the list without
 * navigating, so list scroll is preserved. Keyboard-dismissible (Esc); focus
 * moves to the close button on open and is restored on close; the page `<main>`
 * is marked `inert` while open so the drawer is the only interactive region.
 */
export function RowDrawer({
  row,
  onClose,
}: {
  row: TrackerRow;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = "row-drawer-title";
  const t = useTranslations("applications");

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay — click to dismiss. */}
      <div
        data-testid="drawer-overlay"
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-card shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-base font-semibold leading-tight">
              {row.company}
            </h2>
            <p className="text-sm text-muted-foreground">{row.role}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("drawer.closeDetails")}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mb-4 flex items-center gap-3">
            <StatusPill status={row.status} />
            <FitBadge value={row.fit_rating} />
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Field label={t("drawer.date")} value={<span className="tabular-nums">{row.date}</span>} />
            <Field
              label={t("drawer.lastUpdated")}
              value={<span className="tabular-nums">{row.last_updated}</span>}
            />
            <Field label={t("drawer.sector")} value={row.sector} />
            <Field label={t("drawer.roleType")} value={row.role_type} />
            <Field label={t("drawer.channel")} value={row.channel} />
            <Field label={t("drawer.contact")} value={row.contact_person} />
          </dl>

          <div className="mt-4 space-y-1">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("drawer.notes")}
            </h3>
            <p className="whitespace-pre-wrap break-words text-sm">
              {row.notes ? linkify(row.notes) : <span className="text-muted-foreground">—</span>}
            </p>
          </div>

          <div className="mt-5 space-y-2">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("drawer.documents")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {row.cv_file ? (
                <FileLink label={t("drawer.cv")} file={row.cv_file} />
              ) : (
                <span className="text-xs text-muted-foreground">{t("drawer.noCv")}</span>
              )}
              {row.cover_letter_file ? (
                <FileLink label={t("drawer.coverLetter")} file={row.cover_letter_file} />
              ) : (
                <span className="text-xs text-muted-foreground">{t("drawer.noCover")}</span>
              )}
              {row.source ? (
                <a
                  href={row.source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs text-primary hover:bg-muted/60"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  {t("drawer.sourcePosting")}
                </a>
              ) : null}
            </div>
            {row.source ? (
              <Link
                href={`/console?command=apply&url=${encodeURIComponent(row.source)}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs hover:bg-muted/60"
              >
                <Play className="h-3.5 w-3.5 text-primary" aria-hidden />
                {t("drawer.rerunApply")}
              </Link>
            ) : null}
          </div>

          <ProvenancePanel company={row.company} role={row.role} />
        </div>
      </div>
    </div>
  );
}
