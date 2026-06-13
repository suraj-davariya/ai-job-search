/**
 * Minimal toast bus (no third-party toast lib — offline + hand-rolled, matching
 * the rest of the dashboard UI). A module-level subscriber set lets any client
 * component fire a transient message that the single mounted <Toaster> renders.
 */
export type ToastKind = "success" | "error";
export interface ToastMessage {
  id: number;
  text: string;
  kind: ToastKind;
}

type Listener = (msg: ToastMessage) => void;

const listeners = new Set<Listener>();
let seq = 0;

export function toast(text: string, kind: ToastKind = "success"): void {
  const msg: ToastMessage = { id: ++seq, text, kind };
  for (const l of listeners) l(msg);
}

export function subscribeToToasts(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
