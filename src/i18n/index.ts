import { en, type UiKey } from './en';

const dictionaries: Record<string, Partial<Record<UiKey, string>>> = { en };

export function t(key: UiKey, locale = 'en', vars: Record<string, string | number> = {}): string {
  let s = dictionaries[locale]?.[key] ?? en[key];
  for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}
