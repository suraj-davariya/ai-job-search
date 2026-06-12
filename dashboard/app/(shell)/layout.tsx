import { Sidebar } from "@/components/shell/sidebar";
import { Header } from "@/components/shell/header";
import { Toaster } from "@/components/ui/Toaster";
import { ReadOnlyBanner } from "@/components/shell/read-only-banner";

/** Persistent sidebar + header app shell wrapping every page (build-prompt §5). */
export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <ReadOnlyBanner />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
