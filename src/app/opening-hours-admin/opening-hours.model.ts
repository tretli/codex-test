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
  openExitType: ExitOutcomeId;
}

export enum ExitOutcome {
  Allow = '1', // Continue normally.
  AllowWithMessage = '2', // Continue and surface an informational message.
  Defer = '3', // Do not process now; retry/schedule later.
  Escalate = '4', // Hand off to a higher tier or special handling path.
  Review = '5', // Hold for human/policy review before proceeding.
  DenyWithMessage = '6', // Stop: play message before do not proceed.
  Deny = '7', // Hard stop: do not proceed.
  Outcome8 = '8', // Reserved generic outcome.
  Outcome9 = '9' // Reserved generic outcome.
}

export const STATIC_EXIT_OUTCOME_IDS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9'
] as const;

export type ExitOutcomeId = (typeof STATIC_EXIT_OUTCOME_IDS)[number];

export interface ExitOutcomeDefinition {
  id: ExitOutcomeId;
  name: string;
  color: string; // hex color
}

export const DEFAULT_EXIT_OUTCOMES: ReadonlyArray<ExitOutcomeDefinition> = [
  { id: ExitOutcome.Allow, name: 'Allow', color: '#2e7d32' },
  { id: ExitOutcome.AllowWithMessage, name: 'Allow with message', color: '#0288d1' },
  { id: ExitOutcome.Defer, name: 'Defer', color: '#6d4c41' },
  { id: ExitOutcome.Escalate, name: 'Escalate', color: '#ef6c00' },
  { id: ExitOutcome.Review, name: 'Review', color: '#5e35b1' },
  { id: ExitOutcome.DenyWithMessage, name: 'Deny with message', color: '#ad1457' },
  { id: ExitOutcome.Deny, name: 'Deny', color: '#c62828' },
  { id: ExitOutcome.Outcome8, name: 'Outcome 8', color: '#00897b' },
  { id: ExitOutcome.Outcome9, name: 'Outcome 9', color: '#546e7a' }
] as const;

const LEGACY_EXIT_OUTCOME_ID_MAP: Record<string, ExitOutcomeId> = {
  allow: ExitOutcome.Allow,
  'allow-with-message': ExitOutcome.AllowWithMessage,
  defer: ExitOutcome.Defer,
  escalate: ExitOutcome.Escalate,
  review: ExitOutcome.Review,
  'deny-with-message': ExitOutcome.DenyWithMessage,
  deny: ExitOutcome.Deny
};

export function isExitOutcomeId(value: string): value is ExitOutcomeId {
  return STATIC_EXIT_OUTCOME_IDS.includes(value as ExitOutcomeId);
}

export function normalizeExitOutcomeId(
  value: string | null | undefined
): ExitOutcomeId {
  if (!value) {
    return ExitOutcome.Allow;
  }
  if (isExitOutcomeId(value)) {
    return value;
  }
  return LEGACY_EXIT_OUTCOME_ID_MAP[value] ?? ExitOutcome.Allow;
}

export function normalizeExitOutcomes(
  exitOutcomes: ExitOutcomeDefinition[]
): ExitOutcomeDefinition[] {
  const normalizedById = new Map<ExitOutcomeId, ExitOutcomeDefinition>();

  exitOutcomes.forEach((item) => {
    const normalizedId = normalizeExitOutcomeId(item.id);
    if (!normalizedById.has(normalizedId)) {
      normalizedById.set(normalizedId, {
        id: normalizedId,
        name: item.name?.trim() || `Outcome ${normalizedId}`,
        color: item.color || '#546e7a'
      });
    }
  });

  return DEFAULT_EXIT_OUTCOMES.map((defaultItem) => {
    const existing = normalizedById.get(defaultItem.id);
    return existing
      ? {
          id: defaultItem.id,
          name: existing.name,
          color: existing.color
        }
      : {
          id: defaultItem.id,
          name: defaultItem.name,
          color: defaultItem.color
        };
  });
}

export interface WeeklyOpeningHoursRecord {
  name?: string;
  days: Weekday[];
  slots: OpeningHoursSlot[];
  closedExitType: ExitOutcomeId;
}

export type RecurringHolidayRule =
  | 'fixed-date'
  | 'easter'
  | 'rrule'
  | 'date-range'
  | 'single-date';

export interface RecurringHoliday {
  name: string;
  rule: RecurringHolidayRule;
  month?: number; // 1-12 for fixed-date rules
  day?: number; // 1-31 for fixed-date rules
  offsetDays?: number; // day offset from Easter Sunday for easter rules
  rrule?: string; // RFC5545 RRULE for recurring rules
  rangeStart?: string; // ISO date for date-range rules
  rangeEnd?: string; // ISO date for date-range rules
  singleDate?: string; // ISO date for single-date rules
  weekdays?: Weekday[]; // selected weekdays for date-range rules
  lengthDays: number; // number of consecutive days the holiday applies
  closed: boolean;
  slots: OpeningHoursSlot[];
  closedExitType: ExitOutcomeId;
}

export type RuleScopeV2 =
  | 'weekly'
  | 'recurring'
  | 'date-range'
  | 'single-date';

export type ActionV2 = ExitOutcomeId;

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
    kind: 'fixed-date' | 'easter-offset' | 'rrule';
    month?: number;
    day?: number;
    offsetDays?: number;
    rrule?: string;
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
  exitOutcomes: ExitOutcomeDefinition[];
  rules: RuleV2[];
}

export function normalizeScheduleV2(
  schedule: OpeningHoursScheduleV2
): OpeningHoursScheduleV2 {
  return {
    ...schedule,
    exitOutcomes: normalizeExitOutcomes(schedule.exitOutcomes),
    rules: schedule.rules.map((rule) => ({
      ...rule,
      slots: rule.slots.map((slot) => ({
        ...slot,
        action: normalizeExitOutcomeId(slot.action)
      })),
      defaultClosed: {
        action: normalizeExitOutcomeId(rule.defaultClosed.action)
      }
    }))
  };
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
