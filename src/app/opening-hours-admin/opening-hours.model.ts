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
  isOpen: boolean;
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
  days: Weekday[];
  slots: OpeningHoursSlot[];
  closedExitType: ExitOutcome;
  closedExitReason?: string;
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
  closedExitReason?: string;
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

export const WEEKDAYS: ReadonlyArray<{ key: Weekday; label: string }> = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' }
] as const;
