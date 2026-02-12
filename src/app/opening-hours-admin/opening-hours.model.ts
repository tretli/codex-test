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
}

export interface WeeklyOpeningHoursRecord {
  days: Weekday[];
  slots: OpeningHoursSlot[];
}

export type RecurringHolidayRule =
  | 'fixed-date'
  | 'easter'
  | 'swedish-midsummer-day'
  | 'swedish-midsummer-eve'
  | 'date-range';

export interface RecurringHoliday {
  name: string;
  rule: RecurringHolidayRule;
  month?: number; // 1-12 for fixed-date rules
  day?: number; // 1-31 for fixed-date rules
  offsetDays?: number; // day offset from Easter Sunday for easter rules
  rangeStart?: string; // ISO date for date-range rules
  rangeEnd?: string; // ISO date for date-range rules
  weekdays?: Weekday[]; // selected weekdays for date-range rules
  lengthDays: number; // number of consecutive days the holiday applies
  closed: boolean;
  slots: OpeningHoursSlot[];
}

export interface DateRangeHoliday extends RecurringHoliday {
  rule: 'date-range';
  rangeStart: string; // ISO date
  rangeEnd: string; // ISO date
  weekdays: Weekday[];
}

export interface OpeningHoursSchedule {
  timezone: string;
  days: WeeklyOpeningHoursRecord[];
  recurringHolidays: RecurringHoliday[];
  dateRanges: DateRangeHoliday[];
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
