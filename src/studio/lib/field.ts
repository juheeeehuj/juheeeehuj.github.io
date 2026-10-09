import type { Field, ImageField, LinkField, Locale, Slot } from "./ia";
import { tx } from "./ia";

/** Typed accessors for reading IA slot values in section components. */

export function text(slot: Slot, key: string, locale: Locale): string {
  const f = slot[key] as Field | undefined;
  if (f && f.type === "text") return tx(f.value, locale);
  return "";
}

export function image(slot: Slot, key: string, locale: Locale): { src: string; alt: string } {
  const f = slot[key] as ImageField | undefined;
  if (f && f.type === "image") return { src: f.src, alt: tx(f.alt, locale) };
  return { src: "", alt: "" };
}

export function link(slot: Slot, key: string, locale: Locale): { label: string; href: string } {
  const f = slot[key] as LinkField | undefined;
  if (f && f.type === "link") return { label: tx(f.label, locale), href: f.href };
  return { label: "", href: "#" };
}

export function icon(slot: Slot, key: string): string {
  const f = slot[key] as Field | undefined;
  if (f && f.type === "icon") return f.name;
  return "";
}

export function list(slot: Slot, key: string): Slot[] {
  const f = slot[key] as Field | undefined;
  if (f && f.type === "list") return f.items;
  return [];
}

/** Operator on/off switch (banner/popup 노출 등). Missing → `fallback`. */
export function toggle(slot: Slot, key: string, fallback = false): boolean {
  const f = slot[key] as Field | undefined;
  if (f && f.type === "toggle") return f.value;
  return fallback;
}

/** Display window {start,end}. Empty object = no schedule field (= open-ended). */
export function schedule(slot: Slot, key: string): { start?: string; end?: string } {
  const f = slot[key] as Field | undefined;
  if (f && f.type === "schedule") return { start: f.start, end: f.end };
  return {};
}

/** Parse a schedule bound. Date-only (YYYY-MM-DD) snaps to the day's edge so an
 *  end date of "06-30" shows *through* the 30th, not until its midnight. */
function parseBound(v: string, kind: "start" | "end"): number {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(v);
  const s = dateOnly ? `${v}T${kind === "end" ? "23:59:59.999" : "00:00:00"}` : v;
  return Date.parse(s);
}

/** True if `now` falls within [start, end]; an empty/invalid bound is open-ended. */
export function isWithinSchedule(start: string | undefined, end: string | undefined, now: Date = new Date()): boolean {
  const t = now.getTime();
  if (start) {
    const s = parseBound(start, "start");
    if (!Number.isNaN(s) && t < s) return false;
  }
  if (end) {
    const e = parseBound(end, "end");
    if (!Number.isNaN(e) && t > e) return false;
  }
  return true;
}

/** Should a toggleable + scheduled block (배너/팝업) render now?
 *  enabled toggle must be true AND the schedule window (if any) must contain `now`. */
export function isLiveNow(
  slot: Slot,
  opts: { enabledKey?: string; scheduleKey?: string; now?: Date } = {},
): boolean {
  const { enabledKey = "enabled", scheduleKey = "schedule", now = new Date() } = opts;
  if (!toggle(slot, enabledKey, false)) return false;
  const { start, end } = schedule(slot, scheduleKey);
  return isWithinSchedule(start, end, now);
}
