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
  label: string;
  icon: LucideIcon;
}

/** Left-sidebar navigation — mirrors the IA in build-prompt §5. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/salary", label: "Salary", icon: Banknote },
  { href: "/upskill", label: "Upskill", icon: GraduationCap },
  { href: "/console", label: "Console", icon: Terminal },
  { href: "/settings", label: "Settings", icon: Settings },
];
