import type { ReactNode } from "react";

/** Section wrapper with a heading + optional description, for page bodies. */
export function PageSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/**
 * Empty-state placeholder. Used by M0 page stubs and, later, by real pages
 * when a data file is missing/empty (ARCH-0005 graceful degradation, §5).
 */
export function EmptyState({
  title,
  hint,
  milestone,
}: {
  title: string;
  hint?: string;
  milestone?: string;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-10 text-center">
      <p className="text-sm font-medium">{title}</p>
      {hint ? (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{hint}</p>
      ) : null}
      {milestone ? (
        <span className="mt-4 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          {milestone}
        </span>
      ) : null}
    </div>
  );
}
