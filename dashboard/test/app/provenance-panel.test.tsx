import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ProvenancePanel } from "@/components/applications/ProvenancePanel";
import type { Provenance } from "@/lib/data/provenance";

const LEDGER: Provenance = {
  generated: "2026-06-18",
  company: "Acme",
  role: "Engineer",
  claims: [
    {
      claim: "Led migration to Kubernetes",
      source: "01-candidate-profile.md",
      location: "Experience › Acme",
      backed: true,
    },
    {
      claim: "Fluent in Rust",
      source: null,
      location: null,
      backed: false,
      note: "flagged — no profile backing",
    },
  ],
  summary: { total: 2, backed: 1, flagged: 1 },
};

function stubFetch(impl: (url: string) => Partial<Response>) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => Promise.resolve(impl(url) as Response)),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("ProvenancePanel", () => {
  it("renders the audit summary and flags unbacked claims distinctly", async () => {
    stubFetch(() => ({ ok: true, json: async () => LEDGER }));
    render(<ProvenancePanel company="Acme" role="Engineer" />);

    await waitFor(() =>
      expect(screen.getByText(/2 claims · 1 flagged/)).toBeInTheDocument(),
    );
    // Backed claim shows its source › location; flagged claim is visually distinct.
    expect(screen.getByText(/Experience › Acme/)).toBeInTheDocument();
    expect(screen.getByTestId("claim-flagged")).toHaveTextContent("Fluent in Rust");
    expect(screen.getByTestId("claim-backed")).toHaveTextContent(
      "Led migration to Kubernetes",
    );
  });

  it("shows a subtle 'not recorded' line when there is no ledger (404)", async () => {
    stubFetch(() => ({ ok: false }));
    render(<ProvenancePanel company="Nope" role="Role" />);

    await waitFor(() =>
      expect(screen.getByText("No provenance recorded")).toBeInTheDocument(),
    );
    expect(screen.queryByTestId("claim-flagged")).not.toBeInTheDocument();
  });

  it("degrades to 'not recorded' if the fetch rejects (never throws)", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
    render(<ProvenancePanel company="Acme" role="Engineer" />);

    await waitFor(() =>
      expect(screen.getByText("No provenance recorded")).toBeInTheDocument(),
    );
  });
});
