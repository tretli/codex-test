import { TimeRuleProfileItem, TimezoneItem } from '../../contracts/ivr-lookup-contracts';

export const TIMEZONE_FIXTURES: TimezoneItem[] = [
  { id: 'UTC', label: 'UTC' },
  { id: 'Europe/Oslo', label: 'Europe/Oslo' },
  { id: 'America/New_York', label: 'America/New_York' }
];

export const TIME_PROFILE_FIXTURES: TimeRuleProfileItem[] = [
  { id: 10, name: 'Weekdays 08-16' },
  { id: 11, name: '24x7' }
];
