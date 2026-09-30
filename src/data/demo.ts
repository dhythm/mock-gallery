export const DEMO_TODAY = "2026-09-30";

let seq = 100;

export function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${seq}`;
}

export function isPast(isoDate: string) {
  return isoDate < DEMO_TODAY;
}

export function shortDate(isoDate: string) {
  const [, month, day] = isoDate.split("-");
  return `${Number(month)}/${Number(day)}`;
}
