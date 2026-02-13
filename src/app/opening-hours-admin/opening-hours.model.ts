export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface OpeningHoursSlot {
  opensAt: string; // HH:mm
  closesAt: string; // HH:mm
  openExitType: ExitOutcome;
}

export enum ExitOutcome {
  Allow = 'allow', // Continue normally.
  AllowWithMessage = 'allow-with-message', // Continue and surface an informational message.
  Defer = 'defer', // Do not process now; retry/schedule later.
  Escalate = 'escalate', // Hand off to a higher tier or special handling path.
  Review = 'review', // Hold for human/policy review before proceeding.
  DenyWithMessage = 'deny-with-message', // Stop: play message before do not proceed.
  Deny = 'deny' // Hard stop: do not proceed.
}

export interface WeeklyOpeningHoursRecord {
  name?: string;
  days: Weekday[];
  slots: OpeningHoursSlot[];
  closedExitType: ExitOutcome;
}

export type RecurringHolidayRule =
  | 'fixed-date'
  | 'easter'
  | 'swedish-midsummer-day'
  | 'swedish-midsummer-eve'
  | 'date-range'
  | 'single-date';

export interface RecurringHoliday {
  name: string;
  rule: RecurringHolidayRule;
  month?: number; // 1-12 for fixed-date rules
  day?: number; // 1-31 for fixed-date rules
  offsetDays?: number; // day offset from Easter Sunday for easter rules
  rangeStart?: string; // ISO date for date-range rules
  rangeEnd?: string; // ISO date for date-range rules
  singleDate?: string; // ISO date for single-date rules
  weekdays?: Weekday[]; // selected weekdays for date-range rules
  lengthDays: number; // number of consecutive days the holiday applies
  closed: boolean;
  slots: OpeningHoursSlot[];
  closedExitType: ExitOutcome;
}

export interface DateRangeHoliday extends RecurringHoliday {
  rule: 'date-range';
  rangeStart: string; // ISO date
  rangeEnd: string; // ISO date
  weekdays: Weekday[];
}

export interface SingleDateHoliday extends RecurringHoliday {
  rule: 'single-date';
  singleDate: string; // ISO date
}

export interface OpeningHoursSchedule {
  timezone: string;
  days: WeeklyOpeningHoursRecord[];
  recurringHolidays: RecurringHoliday[];
  dateRanges: DateRangeHoliday[];
  singleDates: SingleDateHoliday[];
}

export type RuleScopeV2 =
  | 'weekly'
  | 'recurring'
  | 'date-range'
  | 'single-date';

export type ActionV2 =
  | 'allow'
  | 'allow-with-message'
  | 'defer'
  | 'escalate'
  | 'review'
  | 'deny'
  | 'deny-with-message';

export interface TimeSlotV2 {
  start: string; // HH:mm
  end: string; // HH:mm
  action: ActionV2;
}

export interface RuleAppliesOnV2 {
  weekdays?: Weekday[];
  date?: string; // ISO date for single-date
  dateFrom?: string; // ISO date for date-range
  dateTo?: string; // ISO date for date-range
  recurring?: {
    kind:
      | 'fixed-date'
      | 'easter-offset'
      | 'swedish-midsummer-day'
      | 'swedish-midsummer-eve';
    month?: number;
    day?: number;
    offsetDays?: number;
    lengthDays?: number;
  };
}

export interface RuleV2 {
  id: string;
  name: string;
  scope: RuleScopeV2;
  priority: number;
  appliesOn: RuleAppliesOnV2;
  slots: TimeSlotV2[];
  defaultClosed: {
    action: ActionV2;
  };
}

export interface OpeningHoursScheduleV2 {
  timezone: string;
  rules: RuleV2[];
}

export function toOpeningHoursScheduleV2(
  schedule: OpeningHoursSchedule
): OpeningHoursScheduleV2 {
  const rules: RuleV2[] = [];
  let priority = 1;

  schedule.singleDates.forEach((singleDate, index) => {
    rules.push({
      id: `single-date-${index + 1}`,
      name: singleDate.name,
      scope: 'single-date',
      priority: priority++,
      appliesOn: { date: singleDate.singleDate },
      slots: mapSlotsToV2(singleDate.slots),
      defaultClosed: {
        action: mapExitToAction(singleDate.closedExitType)
      }
    });
  });

  schedule.recurringHolidays.forEach((holiday, index) => {
    rules.push({
      id: `recurring-${index + 1}`,
      name: holiday.name,
      scope: 'recurring',
      priority: priority++,
      appliesOn: {
        recurring: mapRecurringToV2(holiday)
      },
      slots: mapSlotsToV2(holiday.slots),
      defaultClosed: {
        action: mapExitToAction(holiday.closedExitType)
      }
    });
  });

  schedule.dateRanges.forEach((range, index) => {
    rules.push({
      id: `date-range-${index + 1}`,
      name: range.name,
      scope: 'date-range',
      priority: priority++,
      appliesOn: {
        dateFrom: range.rangeStart,
        dateTo: range.rangeEnd,
        weekdays: range.weekdays
      },
      slots: mapSlotsToV2(range.slots),
      defaultClosed: {
        action: mapExitToAction(range.closedExitType)
      }
    });
  });

  schedule.days.forEach((weekly, index) => {
    rules.push({
      id: `weekly-${index + 1}`,
      name: weekly.name || `Weekly ${index + 1}`,
      scope: 'weekly',
      priority: priority++,
      appliesOn: {
        weekdays: weekly.days
      },
      slots: mapSlotsToV2(weekly.slots),
      defaultClosed: {
        action: mapExitToAction(weekly.closedExitType)
      }
    });
  });

  return {
    timezone: schedule.timezone,
    rules
  };
}

function mapSlotsToV2(slots: OpeningHoursSlot[]): TimeSlotV2[] {
  return slots.map((slot) => ({
    start: slot.opensAt,
    end: slot.closesAt,
    action: mapExitToAction(slot.openExitType)
  }));
}

function mapRecurringToV2(
  holiday: RecurringHoliday
): RuleAppliesOnV2['recurring'] | undefined {
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
  if (holiday.rule === 'swedish-midsummer-day') {
    return { kind: 'swedish-midsummer-day', lengthDays: holiday.lengthDays };
  }
  if (holiday.rule === 'swedish-midsummer-eve') {
    return { kind: 'swedish-midsummer-eve', lengthDays: holiday.lengthDays };
  }
  return undefined;
}

function mapExitToAction(exit: ExitOutcome): ActionV2 {
  return exit;
}

export function fromOpeningHoursScheduleV2(
  schedule: OpeningHoursScheduleV2
): OpeningHoursSchedule {
  const days: WeeklyOpeningHoursRecord[] = [];
  const recurringHolidays: RecurringHoliday[] = [];
  const dateRanges: DateRangeHoliday[] = [];
  const singleDates: SingleDateHoliday[] = [];

  const sortedRules = [...schedule.rules].sort((a, b) => a.priority - b.priority);

  sortedRules.forEach((rule, index) => {
    const slots = mapSlotsFromV2(rule.slots);
    const closedExitType = rule.defaultClosed.action as ExitOutcome;

    if (rule.scope === 'weekly') {
      days.push({
        name: rule.name || `Weekly ${index + 1}`,
        days: rule.appliesOn.weekdays ?? [],
        slots,
        closedExitType
      });
      return;
    }

    if (rule.scope === 'single-date') {
      singleDates.push({
        name: rule.name,
        rule: 'single-date',
        singleDate: rule.appliesOn.date ?? '',
        lengthDays: 1,
        closed: slots.length === 0,
        slots,
        closedExitType
      });
      return;
    }

    if (rule.scope === 'date-range') {
      dateRanges.push({
        name: rule.name,
        rule: 'date-range',
        rangeStart: rule.appliesOn.dateFrom ?? '',
        rangeEnd: rule.appliesOn.dateTo ?? '',
        weekdays: rule.appliesOn.weekdays ?? [],
        lengthDays: 1,
        closed: slots.length === 0,
        slots,
        closedExitType
      });
      return;
    }

    const recurring = rule.appliesOn.recurring;
    if (!recurring) {
      return;
    }

    if (recurring.kind === 'fixed-date') {
      recurringHolidays.push({
        name: rule.name,
        rule: 'fixed-date',
        month: recurring.month ?? 1,
        day: recurring.day ?? 1,
        lengthDays: recurring.lengthDays ?? 1,
        closed: slots.length === 0,
        slots,
        closedExitType
      });
      return;
    }

    if (recurring.kind === 'easter-offset') {
      recurringHolidays.push({
        name: rule.name,
        rule: 'easter',
        offsetDays: recurring.offsetDays ?? 0,
        lengthDays: recurring.lengthDays ?? 1,
        closed: slots.length === 0,
        slots,
        closedExitType
      });
      return;
    }

    if (recurring.kind === 'swedish-midsummer-day') {
      recurringHolidays.push({
        name: rule.name,
        rule: 'swedish-midsummer-day',
        lengthDays: recurring.lengthDays ?? 1,
        closed: slots.length === 0,
        slots,
        closedExitType
      });
      return;
    }

    if (recurring.kind === 'swedish-midsummer-eve') {
      recurringHolidays.push({
        name: rule.name,
        rule: 'swedish-midsummer-eve',
        lengthDays: recurring.lengthDays ?? 1,
        closed: slots.length === 0,
        slots,
        closedExitType
      });
    }
  });

  return {
    timezone: schedule.timezone,
    days,
    recurringHolidays,
    dateRanges,
    singleDates
  };
}

function mapSlotsFromV2(slots: TimeSlotV2[]): OpeningHoursSlot[] {
  return slots.map((slot) => ({
    opensAt: slot.start,
    closesAt: slot.end,
    openExitType: slot.action as ExitOutcome
  }));
}

export const WEEKDAYS: ReadonlyArray<{ key: Weekday; label: string }> = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
] as const;
