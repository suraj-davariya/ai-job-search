import {
  PencilLine,
  Send,
  Users,
  Trophy,
  XCircle,
  Undo2,
  Archive,
  type LucideIcon,
} from "lucide-react";
import type { Status } from "@/lib/domain/status";
import { cn } from "@/lib/utils";

/**
 * Status badge — always pairs a label with an icon so meaning never relies on
 * color alone (NFR-0015 color independence). Colors are harmonized with the
 * warm palette: Interview gold, Offer green, terminal states muted gray.
 */
const STYLES: Record<Status, { icon: LucideIcon; className: string }> = {
  Draft: { icon: PencilLine, className: "border-border text-muted-foreground" },
  Sent: { icon: Send, className: "border-sky-500/30 text-sky-400" },
  Interview: { icon: Users, className: "border-accent/40 text-accent" },
  Offer: { icon: Trophy, className: "border-emerald-500/40 text-emerald-400" },
  Rejected: { icon: XCircle, className: "border-border text-muted-foreground" },
  Withdrawn: { icon: Undo2, className: "border-border text-muted-foreground" },
  Closed: { icon: Archive, className: "border-border text-muted-foreground" },
};

export function StatusPill({ status }: { status: Status }) {
  const style = STYLES[status] ?? STYLES.Draft;
  const Icon = style.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style.className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {status}
    </span>
  );
}
