import { RecurringHoliday, RuleV2, TimeSlotV2 } from './opening-hours.model';

export function mapRuleToHoliday(
  rule: RuleV2,
  calculateDateRangeLength: (rangeStart: string, rangeEnd: string) => number
): RecurringHoliday | null {
  const slots = mapSlotsFromV2(rule.slots);
  const closed = slots.length === 0;
  const closedExitType = rule.defaultClosed.action;

  if (rule.scope === 'single-date') {
    return {
      name: rule.name,
      rule: 'single-date',
      singleDate: rule.appliesOn.date ?? '',
      lengthDays: 1,
      closed,
      slots,
      closedExitType
    };
  }

  if (rule.scope === 'date-range') {
    const rangeStart = rule.appliesOn.dateFrom ?? '';
    const rangeEnd = rule.appliesOn.dateTo ?? '';
    return {
      name: rule.name,
      rule: 'date-range',
      rangeStart,
      rangeEnd,
      weekdays: rule.appliesOn.weekdays ?? [],
      lengthDays: calculateDateRangeLength(rangeStart, rangeEnd),
      closed,
      slots,
      closedExitType
    };
  }

  if (rule.scope !== 'recurring') {
    return null;
  }

  const recurring = rule.appliesOn.recurring;
  if (!recurring) {
    return null;
  }

  if (recurring.kind === 'fixed-date') {
    return {
      name: rule.name,
      rule: 'fixed-date',
      month: recurring.month ?? 1,
      day: recurring.day ?? 1,
      lengthDays: recurring.lengthDays ?? 1,
      closed,
      slots,
      closedExitType
    };
  }

  if (recurring.kind === 'easter-offset') {
    return {
      name: rule.name,
      rule: 'easter',
      offsetDays: recurring.offsetDays ?? 0,
      lengthDays: recurring.lengthDays ?? 1,
      closed,
      slots,
      closedExitType
    };
  }

  if (recurring.kind === 'rrule') {
    return {
      name: rule.name,
      rule: 'rrule',
      rrule: recurring.rrule ?? '',
      lengthDays: recurring.lengthDays ?? 1,
      closed,
      slots,
      closedExitType
    };
  }

  return null;
}

export function mapRecurringToV2(
  holiday: RecurringHoliday
): RuleV2['appliesOn']['recurring'] | undefined {
  if (holiday.rule === 'fixed-date') {
    return {
      kind: 'fixed-date',
      month: holiday.month,
      day: holiday.day,
      lengthDays: holiday.lengthDays
    };
  }
  if (holiday.rule === 'easter') {
    return {
      kind: 'easter-offset',
      offsetDays: holiday.offsetDays,
      lengthDays: holiday.lengthDays
    };
  }
  if (holiday.rule === 'rrule') {
    return {
      kind: 'rrule',
      rrule: holiday.rrule,
      lengthDays: holiday.lengthDays
    };
  }
  return undefined;
}

export function mapSlotsToV2(slots: RecurringHoliday['slots']): TimeSlotV2[] {
  return slots.map((slot) => ({
    start: slot.opensAt,
    end: slot.closesAt,
    action: slot.openExitType
  }));
}

export function mapSlotsFromV2(slots: TimeSlotV2[]): RecurringHoliday['slots'] {
  return slots.map((slot) => ({
    opensAt: slot.start,
    closesAt: slot.end,
    openExitType: slot.action
  }));
}
