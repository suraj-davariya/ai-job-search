import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { createTranslator, createFormatter } from "use-intl";

/**
 * next-intl test harness.
 *
 * Component tests render components in isolation (no NextIntlClientProvider),
 * so we mock next-intl's client + server APIs to resolve the REAL English
 * catalogs via use-intl's `createTranslator`. English is the default locale, so
 * every existing assertion on user-facing English text stays valid.
 */
import common from "../../i18n/ui/en/common.json";
import dashboard from "../../i18n/ui/en/dashboard.json";
import applications from "../../i18n/ui/en/applications.json";
import consoleNs from "../../i18n/ui/en/console.json";
import settings from "../../i18n/ui/en/settings.json";
import salary from "../../i18n/ui/en/salary.json";
import errors from "../../i18n/ui/en/errors.json";

const messages = {
  common,
  dashboard,
  applications,
  console: consoleNs,
  settings,
  salary,
  errors,
} as Record<string, unknown>;

const LOCALE = "en";

function translator(namespace?: string) {
  return createTranslator({ locale: LOCALE, messages, namespace });
}

vi.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => translator(namespace),
  useLocale: () => LOCALE,
  useMessages: () => messages,
  useFormatter: () => createFormatter({ locale: LOCALE }),
  NextIntlClientProvider: ({ children }: { children: unknown }) => children,
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async (arg?: string | { namespace?: string }) =>
    translator(typeof arg === "string" ? arg : arg?.namespace),
  getLocale: async () => LOCALE,
  getMessages: async () => messages,
  getFormatter: async () => createFormatter({ locale: LOCALE }),
  setRequestLocale: () => {},
}));
