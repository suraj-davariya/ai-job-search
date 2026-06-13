/**
 * Read layer: user-provided salary_data.json.
 * Returns null when absent so the Salary page renders an empty-state (REQ-5014),
 * never a fabricated value (ARCH-0007).
 */
import { promises as fs } from "node:fs";
import { paths } from "@/lib/paths";
import { IS_DEMO } from "@/lib/demo/flags";
import { DEMO_SALARY } from "@/lib/demo/seed";

export type SalaryData = Record<string, unknown>;

export async function readSalary(
  filePath?: string,
): Promise<SalaryData | null> {
  // Static demo build: serve bundled sample benchmarks.
  if (IS_DEMO) return DEMO_SALARY;

  const file = filePath ?? paths.salaryData();
  try {
    const text = await fs.readFile(file, "utf8");
    return JSON.parse(text) as SalaryData;
  } catch {
    return null;
  }
}
