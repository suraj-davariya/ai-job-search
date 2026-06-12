"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { appendRowAction } from "@/app/actions/tracker";
import { STATUSES } from "@/lib/domain/status";
import { toast } from "@/lib/toast";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  status: z.enum(STATUSES),
  sector: z.string().optional(),
  role_type: z.string().optional(),
  channel: z.string().optional(),
  contact_person: z.string().optional(),
  fit_rating: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0).max(100).optional(),
  ),
  source: z.string().optional(),
});

type FormValues = z.input<typeof schema>;

/**
 * Minimal react-hook-form resolver backed by zod. `@hookform/resolvers` isn't
 * available offline, so we adapt the schema by hand — same contract RHF expects.
 */
function zodResolver(s: typeof schema): Resolver<FormValues> {
  return async (values) => {
    const parsed = s.safeParse(values);
    if (parsed.success) return { values: parsed.data as FormValues, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !errors[key]) errors[key] = { type: issue.code, message: issue.message };
    }
    return { values: {}, errors: errors as never };
  };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * "+ New application" dialog (REQ-5006): captures required date/company/role/
 * status plus optional fields and appends a row via the server action (empty
 * cv/cover). On success the action revalidates `/applications`, so the new row
 * appears immediately. Keyboard-dismissible (Esc); focus is trapped to the
 * dialog and the page `<main>` is inert while open.
 */
export function NewDialog({ disabled = false }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground opacity-90 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" aria-hidden />
        New application
      </button>
      {open ? <Dialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function Dialog({ onClose }: { onClose: () => void }) {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = "new-app-title";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { date: today(), status: "Draft" },
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    firstFieldRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  async function onValid(values: FormValues) {
    // Drop empty optional strings so the row stays clean.
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== "" && v != null),
    ) as FormValues;

    const res = await appendRowAction(payload as never);
    if ("error" in res) {
      toast(`Couldn't add application: ${res.error}`, "error");
      return;
    }
    toast("Application added");
    onClose();
  }

  const { ref: dateRef, ...dateField } = register("date");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id={titleId} className="text-base font-semibold">
            New application
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>

        <form
          onSubmit={handleSubmit(onValid)}
          className="grid grid-cols-2 gap-4 px-5 py-4"
          noValidate
        >
          <Field label="Date" error={errors.date?.message}>
            <input
              type="date"
              ref={(el) => {
                dateRef(el);
                firstFieldRef.current = el;
              }}
              {...dateField}
              className={input}
            />
          </Field>
          <Field label="Status" error={errors.status?.message}>
            <select {...register("status")} className={input}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Company" error={errors.company?.message}>
            <input {...register("company")} className={input} />
          </Field>
          <Field label="Role" error={errors.role?.message}>
            <input {...register("role")} className={input} />
          </Field>
          <Field label="Sector">
            <input {...register("sector")} className={input} />
          </Field>
          <Field label="Role type">
            <input {...register("role_type")} className={input} />
          </Field>
          <Field label="Channel">
            <input {...register("channel")} className={input} />
          </Field>
          <Field label="Contact">
            <input {...register("contact_person")} className={input} />
          </Field>
          <Field label="Fit (0–100)" error={errors.fit_rating?.message}>
            <input
              type="number"
              min={0}
              max={100}
              {...register("fit_rating")}
              className={input}
            />
          </Field>
          <Field label="Source URL">
            <input {...register("source")} className={input} />
          </Field>

          <div className="col-span-2 mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground opacity-90 hover:opacity-100 disabled:opacity-50"
            >
              Add application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const input =
  "w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:border-primary focus:outline-none";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1 text-sm">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
      {error ? (
        <span role="alert" className="block text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  );
}
