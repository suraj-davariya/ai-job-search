import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  User,
  Banknote,
  GraduationCap,
  Terminal,
  Settings,
} from "lucide-react";

export interface NavItem {
  href: string;
  /** Key under the `common.nav` catalog namespace (REQ-7008). */
  key: string;
  icon: LucideIcon;
}

/** Left-sidebar navigation — mirrors the IA in build-prompt §5. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", key: "dashboard", icon: LayoutDashboard },
  { href: "/applications", key: "applications", icon: Briefcase },
  { href: "/companies", key: "companies", icon: Building2 },
  { href: "/profile", key: "profile", icon: User },
  { href: "/salary", key: "salary", icon: Banknote },
  { href: "/upskill", key: "upskill", icon: GraduationCap },
  { href: "/console", key: "console", icon: Terminal },
  { href: "/settings", key: "settings", icon: Settings },
];
