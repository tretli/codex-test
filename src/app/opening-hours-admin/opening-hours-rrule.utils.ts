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
  const parsed = parseRRule(rrule);
  if (!parsed || parsed['FREQ'] !== 'YEARLY') {
    return null;
  }

  const months = parseIntegerList(parsed['BYMONTH']).filter(
    (month) => month >= 1 && month <= 12
  );
  const targetMonths =
    months.length > 0 ? months : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const byMonthDays = parseIntegerList(parsed['BYMONTHDAY']);
  const bySetPos = parseIntegerList(parsed['BYSETPOS']);
  const byDayRules = parseByDayList(parsed['BYDAY']);

  const candidates: Date[] = [];
  targetMonths.forEach((month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month - 1, day);
      if (!matchesByMonthDay(day, daysInMonth, byMonthDays)) {
        continue;
      }
      if (!matchesByDay(date, byDayRules, daysInMonth)) {
        continue;
      }
      candidates.push(date);
    }
  });

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => a.getTime() - b.getTime());
  const selected = applyBySetPos(candidates, bySetPos);
  if (selected.length === 0) {
    return null;
  }
  return selected[0];
}

type ParsedRRule = Record<string, string>;

type ByDayRule = {
  ordinal: number | null;
  weekday: number;
};

function parseRRule(rrule: string | undefined): ParsedRRule | null {
  const normalized = (rrule ?? '').trim().toUpperCase();
  if (!normalized) {
    return null;
  }

  const parsed: ParsedRRule = {};
  const parts = normalized.split(';');
  for (const part of parts) {
    const [rawKey, rawValue] = part.split('=');
    const key = rawKey?.trim();
    const value = rawValue?.trim();
    if (!key || !value) {
      return null;
    }
    parsed[key] = value;
  }
  return parsed;
}

function parseIntegerList(value: string | undefined): number[] {
  if (!value) {
    return [];
  }
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((num) => Number.isInteger(num));
}

function parseByDayList(value: string | undefined): ByDayRule[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((token) => parseByDayToken(token.trim()))
    .filter((rule): rule is ByDayRule => rule !== null);
}

function parseByDayToken(token: string): ByDayRule | null {
  const match = /^([+-]?\d+)?(MO|TU|WE|TH|FR|SA|SU)$/.exec(token);
  if (!match) {
    return null;
  }

  const ordinalRaw = match[1];
  const weekdayToken = match[2];
  const weekdayMap: Record<string, number> = {
    SU: 0,
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6
  };
  return {
    ordinal: ordinalRaw ? Number(ordinalRaw) : null,
    weekday: weekdayMap[weekdayToken]
  };
}

function matchesByMonthDay(
  dayOfMonth: number,
  daysInMonth: number,
  byMonthDays: number[]
): boolean {
  if (byMonthDays.length === 0) {
    return true;
  }

  return byMonthDays.some((ruleDay) => {
    if (ruleDay > 0) {
      return dayOfMonth === ruleDay;
    }
    if (ruleDay < 0) {
      return dayOfMonth === daysInMonth + ruleDay + 1;
    }
    return false;
  });
}

function matchesByDay(
  date: Date,
  byDayRules: ByDayRule[],
  daysInMonth: number
): boolean {
  if (byDayRules.length === 0) {
    return true;
  }

  return byDayRules.some((rule) => {
    if (date.getDay() !== rule.weekday) {
      return false;
    }

    if (rule.ordinal === null) {
      return true;
    }

    return matchesOrdinalWeekday(date, rule.ordinal, daysInMonth);
  });
}

function matchesOrdinalWeekday(
  date: Date,
  ordinal: number,
  daysInMonth: number
): boolean {
  if (ordinal === 0) {
    return false;
  }

  const targetDay = date.getDate();
  const weekday = date.getDay();

  if (ordinal > 0) {
    let count = 0;
    for (let day = 1; day <= targetDay; day += 1) {
      if (new Date(date.getFullYear(), date.getMonth(), day).getDay() === weekday) {
        count += 1;
      }
    }
    return count === ordinal;
  }

  let countFromEnd = 0;
  for (let day = daysInMonth; day >= targetDay; day -= 1) {
    if (new Date(date.getFullYear(), date.getMonth(), day).getDay() === weekday) {
      countFromEnd += 1;
    }
  }
  return countFromEnd === Math.abs(ordinal);
}

function applyBySetPos(candidates: Date[], bySetPos: number[]): Date[] {
  if (bySetPos.length === 0) {
    return candidates;
  }

  const selected: Date[] = [];
  bySetPos.forEach((pos) => {
    if (pos === 0) {
      return;
    }
    const index = pos > 0 ? pos - 1 : candidates.length + pos;
    if (index >= 0 && index < candidates.length) {
      selected.push(candidates[index]);
    }
  });
  return selected;
}

export function getDateForRRule(rrule: string | undefined, year: number): Date | null {
  return getDateForSupportedRRule(rrule, year);
}
