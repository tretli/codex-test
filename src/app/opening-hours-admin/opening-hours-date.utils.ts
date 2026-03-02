export function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export function getSwedishMidsummerDayDate(year: number): Date {
  for (let day = 20; day <= 26; day += 1) {
    const candidate = new Date(year, 5, day);
    if (candidate.getDay() === 6) {
      return candidate;
    }
  }
  return new Date(year, 5, 20);
}

export function getSwedishMidsummerEveDate(year: number): Date {
  for (let day = 19; day <= 25; day += 1) {
    const candidate = new Date(year, 5, day);
    if (candidate.getDay() === 5) {
      return candidate;
    }
  }
  const fallback = getSwedishMidsummerDayDate(year);
  fallback.setDate(fallback.getDate() - 1);
  return fallback;
}

export function getNorwegianBotsOgBededagDate(year: number): Date {
  for (let day = 31; day >= 25; day -= 1) {
    const candidate = new Date(year, 9, day);
    if (candidate.getDay() === 0) {
      return candidate;
    }
  }
  return new Date(year, 9, 31);
}

export const SWEDISH_MIDSUMMER_DAY_RRULE =
  'FREQ=YEARLY;BYMONTH=6;BYDAY=SA;BYMONTHDAY=20,21,22,23,24,25,26';
export const SWEDISH_MIDSUMMER_EVE_RRULE =
  'FREQ=YEARLY;BYMONTH=6;BYDAY=FR;BYMONTHDAY=19,20,21,22,23,24,25';
export const NORWEGIAN_BOTS_OG_BEDEDAG_RRULE =
  'FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU';

export function getDateForSupportedRRule(
  rrule: string | undefined,
  year: number
): Date | null {
  const normalized = (rrule ?? '').trim().toUpperCase();

  if (normalized === SWEDISH_MIDSUMMER_DAY_RRULE) {
    return getSwedishMidsummerDayDate(year);
  }
  if (normalized === SWEDISH_MIDSUMMER_EVE_RRULE) {
    return getSwedishMidsummerEveDate(year);
  }
  if (normalized === NORWEGIAN_BOTS_OG_BEDEDAG_RRULE) {
    return getNorwegianBotsOgBededagDate(year);
  }
  return null;
}

