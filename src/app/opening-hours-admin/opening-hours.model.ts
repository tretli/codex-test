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

export interface DayOpeningHours {
  day: Weekday;
  enabled: boolean;
  slots: OpeningHoursSlot[];
}

export type RecurringHolidayRule =
  | 'fixed-date'
  | 'easter'
  | 'swedish-midsummer-day';

export interface RecurringHoliday {
  name: string;
  rule: RecurringHolidayRule;
  month?: number; // 1-12 for fixed-date rules
  day?: number; // 1-31 for fixed-date rules
  offsetDays?: number; // day offset from Easter Sunday for easter rules
  closed: boolean;
  slots: OpeningHoursSlot[];
}

export interface OpeningHoursSchedule {
  timezone: string;
  effectiveFrom: string; // ISO date
  days: DayOpeningHours[];
  recurringHolidays: RecurringHoliday[];
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
