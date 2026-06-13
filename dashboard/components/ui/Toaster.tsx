"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { subscribeToToasts, type ToastMessage } from "@/lib/toast";
import { cn } from "@/lib/utils";

/** App-wide toast outlet. Mount once (in the shell); fed by lib/toast `toast()`. */
export function Toaster() {
  const [msgs, setMsgs] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return subscribeToToasts((msg) => {
      setMsgs((m) => [...m, msg]);
      setTimeout(() => {
        setMsgs((m) => m.filter((x) => x.id !== msg.id));
      }, 3000);
    });
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2"
    >
      {msgs.map((m) => (
        <div
          key={m.id}
          className={cn(
            "pointer-events-auto flex items-center gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg",
            m.kind === "error"
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-border bg-card text-foreground",
          )}
        >
          {m.kind === "error" ? (
            <AlertTriangle className="h-4 w-4" aria-hidden />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden />
          )}
          {m.text}
        </div>
      ))}
    </div>
  );
}
