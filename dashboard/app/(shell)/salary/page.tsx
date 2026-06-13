import { readSalary, type SalaryData } from "@/lib/data/salary";
import { getConfig } from "@/lib/config";
import { binAvailability } from "@/lib/run/bins";
import { PageSection, EmptyState } from "@/components/shell/page-shell";
import { SalaryLookup } from "@/components/salary/SalaryLookup";

export const dynamic = "force-dynamic";

/** First array-valued property of the salary file → a generic table. */
function firstTable(data: SalaryData): { key: string; rows: Record<string, unknown>[] } | null {
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
      return { key, rows: value as Record<string, unknown>[] };
    }
  }
  return null;
}

export default async function SalaryPage() {
  const [salary, { python3 }] = await Promise.all([
    readSalary(),
    binAvailability(),
  ]);
  const { readOnly } = getConfig();
  const table = salary ? firstTable(salary) : null;
  const columns = table ? Object.keys(table.rows[0]) : [];

  return (
    <PageSection
      title="Salary"
      description="Browse your salary benchmarks and run a company lookup."
    >
      <div className="space-y-4">
        {salary === null ? (
          <EmptyState
            title="No salary data"
            hint="Add salary_data.json to the repo root (or import an Excel sheet with tools/convert_salary_excel.py). Until then, the lookup below still works."
            milestone="REQ-5014"
          />
        ) : table ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <caption className="px-3 py-2 text-left text-xs text-muted-foreground">
                {table.key} ({table.rows.length})
              </caption>
              <thead className="border-b border-border bg-card text-left text-muted-foreground">
                <tr>
                  {columns.map((c) => (
                    <th key={c} className="px-3 py-2.5">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0">
                    {columns.map((c) => (
                      <td key={c} className="px-3 py-2.5">
                        {String(r[c] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <pre className="overflow-auto rounded-xl border border-border bg-card/50 p-4 text-xs text-muted-foreground">
            {JSON.stringify(salary, null, 2)}
          </pre>
        )}

        <SalaryLookup pythonOk={python3} readOnly={readOnly} />
      </div>
    </PageSection>
  );
}
