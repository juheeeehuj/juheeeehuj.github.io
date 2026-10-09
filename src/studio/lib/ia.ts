/**
 * IA address content model — see IA_CLASS_규칙.md / content-sync skill.
 * className (IA address) === JSON key (1:1). Design/structure stay in code;
 * only *values* live here and round-trip through the CMS.
 *
 * This template assumes a ko-source project: the live screens are Korean, so
 * values land in `value.ko`. `value.en` is filled only from an /en build
 * (IA §7.7) — until then it stays "" and is reported as "번역 필요" (never guessed).
 */

export type Locale = "ko" | "en";

/** Human-readable text fields are locale maps: { ko, en }. */
export type LocaleMap = Partial<Record<Locale, string>>;

export type TextField = { type: "text"; value: LocaleMap; i18n?: boolean };
export type ImageField = { type: "image"; src: string; alt: LocaleMap };
export type LinkField = { type: "link"; label: LocaleMap; href: string };
export type IconField = { type: "icon"; name: string };
export type ListField = { type: "list"; items: Slot[] };
/**
 * Operator on/off switch — locale-independent (never translated). This is the
 * one **operator-editable state**: distinct from computed UI state (nav-active,
 * IA §8.6) which code derives and the CMS hides. Used for banner/popup 노출 등.
 */
export type ToggleField = { type: "toggle"; value: boolean };
/**
 * Optional display window for time-boxed blocks (배너/팝업). Empty/absent bound =
 * open-ended. `start`/`end` are ISO `YYYY-MM-DD` (date) or `YYYY-MM-DDTHH:mm`
 * (datetime) strings. Locale-independent. Visibility = `isWithinSchedule` (field.ts).
 */
export type ScheduleField = { type: "schedule"; start?: string; end?: string };

export type Field =
  | TextField
  | ImageField
  | LinkField
  | IconField
  | ListField
  | ToggleField
  | ScheduleField;

/** A "slot" map: role name (title/body/image/...) -> field (or nested slot). */
export type Slot = Record<string, Field>;

export interface ContentMeta {
  page: string;
  locale: Locale;
  /** Render/edit order of top-level IA addresses (IA §1.5: 순서 = 배열). */
  order?: string[];
  /**
   * Section type per address: { "home_sec1": "hero", "home_sec2": "highlights" }.
   * The FO renders by TYPE (not address), so a section added by cloning an
   * existing type (IA §1.5 "확장 = 기존 섹션 복제") shows up automatically.
   * Sibling to `order` so the section body stays pure slots. Absent → FO has no
   * renderer for it (skipped) — verify warns. (IA §1.5 / §9.0)
   */
  types?: Record<string, string>;
  /**
   * Addresses kept OUT of the live site render but still editable in the CMS —
   * a section-level 노출/미노출 flag. Hidden sections stay in `order`/`types` so
   * they remain in the editor list and can be cloned as templates ("~처럼 추가"),
   * but the FO skips them (renderableAddresses). Absent → nothing hidden.
   */
  hidden?: string[];
}

/** content/{page}.json shape. */
export interface Content {
  _meta: ContentMeta;
  [address: string]: Slot | ContentMeta;
}

/** Pick the value for the current render locale; fall back to ko, then en, then "". */
export function tx(map: LocaleMap | undefined, locale: Locale = "ko"): string {
  if (!map) return "";
  return map[locale] || map.ko || map.en || "";
}

export const FIELD_TYPES = ["text", "image", "link", "icon", "list", "toggle", "schedule"] as const;
export type FieldType = (typeof FIELD_TYPES)[number];
