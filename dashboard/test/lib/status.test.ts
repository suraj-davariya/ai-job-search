import { describe, it, expect } from "vitest";
import {
  STATUSES,
  ALLOWED_NEXT,
  MUTED,
  assertTransition,
} from "@/lib/domain/status";

describe("status machine", () => {
  it("has the seven canonical statuses", () => {
    expect(STATUSES).toEqual([
      "Draft",
      "Sent",
      "Interview",
      "Offer",
      "Rejected",
      "Withdrawn",
      "Closed",
    ]);
  });

  it("allows Draft→Sent and Sent→Interview", () => {
    expect(() => assertTransition("Draft", "Sent")).not.toThrow();
    expect(() => assertTransition("Sent", "Interview")).not.toThrow();
  });

  it("allows a no-op (same status)", () => {
    expect(() => assertTransition("Offer", "Offer")).not.toThrow();
  });

  it("rejects illegal transitions", () => {
    expect(() => assertTransition("Draft", "Offer")).toThrow(/not allowed/i);
    expect(() => assertTransition("Offer", "Sent")).toThrow(
      /terminal|not allowed/i,
    );
  });

  it("marks Rejected/Withdrawn/Closed muted", () => {
    expect(MUTED.has("Rejected")).toBe(true);
    expect(MUTED.has("Draft")).toBe(false);
  });

  it("exposes terminal statuses with no forward transitions", () => {
    expect(ALLOWED_NEXT.Offer).toEqual([]);
    expect(ALLOWED_NEXT.Closed).toEqual([]);
  });
});
