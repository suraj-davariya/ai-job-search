"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { appendRowAction } from "@/app/actions/tracker";
import { STATUSES } from "@/lib/domain/status";
import { toast } from "@/lib/toast";

/** Schema shape (no messages) — the single source of truth for `FormValues`. */
const schemaShape = z.object({
  date: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
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

type FormValues = z.input<typeof schemaShape>;

/**
 * Minimal react-hook-form resolver backed by zod. `@hookform/resolvers` isn't
 * available offline, so we adapt the schema by hand — same contract RHF expects.
 */
function zodResolver(s: typeof schemaShape): Resolver<FormValues> {
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
  const t = useTranslations("applications");

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        title={disabled ? t("new.readOnlyTip") : undefined}
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground opacity-90 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-4 w-4" aria-hidden />
        {t("new.button")}
      </button>
      {open ? <Dialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function Dialog({ onClose }: { onClose: () => void }) {
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const titleId = "new-app-title";
  const t = useTranslations("applications");
  const ts = useTranslations("common");
  const schema = useMemo(
    () =>
      z.object({
        date: z.string().min(1, t("validation.dateRequired")),
        company: z.string().min(1, t("validation.companyRequired")),
        role: z.string().min(1, t("validation.roleRequired")),
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
      }),
    [t],
  );

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
      toast(t("toast.addError", { error: res.error }), "error");
      return;
    }
    toast(t("toast.added"));
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
            {t("new.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("new.close")}
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
          <Field label={t("fields.date")} error={errors.date?.message}>
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
          <Field label={t("fields.status")} error={errors.status?.message}>
            <select {...register("status")} className={input}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ts(`status.${s}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.company")} error={errors.company?.message}>
            <input {...register("company")} className={input} />
          </Field>
          <Field label={t("fields.role")} error={errors.role?.message}>
            <input {...register("role")} className={input} />
          </Field>
          <Field label={t("fields.sector")}>
            <input {...register("sector")} className={input} />
          </Field>
          <Field label={t("fields.roleType")}>
            <input {...register("role_type")} className={input} />
          </Field>
          <Field label={t("fields.channel")}>
            <input {...register("channel")} className={input} />
          </Field>
          <Field label={t("fields.contact")}>
            <input {...register("contact_person")} className={input} />
          </Field>
          <Field label={t("fields.fit")} error={errors.fit_rating?.message}>
            <input
              type="number"
              min={0}
              max={100}
              {...register("fit_rating")}
              className={input}
            />
          </Field>
          <Field label={t("fields.source")}>
            <input {...register("source")} className={input} />
          </Field>

          <div className="col-span-2 mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-muted/60"
            >
              {t("new.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground opacity-90 hover:opacity-100 disabled:opacity-50"
            >
              {t("new.add")}
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
