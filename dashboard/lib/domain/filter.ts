/**
 * Filter state ↔ URL query (REQ-5002). Pure functions, runnable on server (SSR)
 * and client (URL ↔ controls). Filter state lives in the URL so a filtered view
 * is shareable within a session.
 */
import { isStatus, type Status, type TrackerRow } from "./status";

export interface FilterState {
  q: string; // free text over company/role/notes
  status: Status[]; // multi-select
  fit_min: number | null;
  fit_max: number | null;
  role_type: string;
  channel: string;
  from: string; // YYYY-MM-DD inclusive
  to: string; // YYYY-MM-DD inclusive
}

export function emptyFilter(): FilterState {
  return {
    q: "",
    status: [],
    fit_min: null,
    fit_max: null,
    role_type: "",
    channel: "",
    from: "",
    to: "",
  };
}

/** Parse a query string (with or without a leading "?") into FilterState. */
export function parse(query: string): FilterState {
  const sp = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  const num = (k: string): number | null => {
    const v = sp.get(k);
    if (v == null || v.trim() === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    q: sp.get("q") ?? "",
    status: (sp.get("status") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => isStatus(s)) as Status[],
    fit_min: num("fit_min"),
    fit_max: num("fit_max"),
    role_type: sp.get("role_type") ?? "",
    channel: sp.get("channel") ?? "",
    from: sp.get("from") ?? "",
    to: sp.get("to") ?? "",
  };
}

/**
 * Serialize FilterState to a stable, human-readable query string, omitting
 * empty/default fields. Commas in `status` are kept literal (not %2C) so the
 * URL stays readable and round-trips exactly.
 */
export function serialize(state: FilterState): string {
  const parts: string[] = [];
  if (state.q) parts.push(`q=${encodeURIComponent(state.q)}`);
  if (state.status.length) parts.push(`status=${state.status.join(",")}`);
  if (state.fit_min != null) parts.push(`fit_min=${state.fit_min}`);
  if (state.fit_max != null) parts.push(`fit_max=${state.fit_max}`);
  if (state.role_type) parts.push(`role_type=${encodeURIComponent(state.role_type)}`);
  if (state.channel) parts.push(`channel=${encodeURIComponent(state.channel)}`);
  if (state.from) parts.push(`from=${state.from}`);
  if (state.to) parts.push(`to=${state.to}`);
  return parts.join("&");
}

/** Apply a filter to rows. Pure; preserves input order. */
export function applyFilter(rows: TrackerRow[], state: FilterState): TrackerRow[] {
  const q = state.q.trim().toLowerCase();
  const statusSet = new Set<Status>(state.status);

  return rows.filter((r) => {
    if (q) {
      const hay = `${r.company} ${r.role} ${r.notes}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (statusSet.size && !statusSet.has(r.status)) return false;
    if (state.fit_min != null && r.fit_rating < state.fit_min) return false;
    if (state.fit_max != null && r.fit_rating > state.fit_max) return false;
    if (state.role_type && r.role_type !== state.role_type) return false;
    if (state.channel && r.channel !== state.channel) return false;
    if (state.from && r.date < state.from) return false;
    if (state.to && r.date > state.to) return false;
    return true;
  });
}
