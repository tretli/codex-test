import { ExitOutcome, RecurringHoliday } from './opening-hours.model';
import {
  NORWEGIAN_BOTS_OG_BEDEDAG_RRULE,
  SWEDISH_MIDSUMMER_DAY_RRULE,
  SWEDISH_MIDSUMMER_EVE_RRULE
} from './opening-hours-rrule.utils';
import { HolidayTemplate } from './opening-hours-admin.types';

export function createDefaultHolidayTemplates(): ReadonlyArray<HolidayTemplate> {
  return [
    createEasterTemplate('easter-week', 'Easter Week', -8, 10),
    createEasterTemplate('easter', 'Easter', -3, 5),
    createFixedTemplate('christmas', 'Christmas', 12, 24, 9),
    createFixedTemplate('boxing-week', 'Boxing Week', 12, 25, 7),
    createFixedTemplate("new-years", "New Year's", 1, 1, 1),
    createEasterTemplate('palm-sunday', 'Palm Sunday', -7, 1),
    createEasterTemplate('norwegian-fastelavn', 'Norwegian Fastelavn', -49, 1),
    createEasterTemplate('pre-easter-wednesday', 'Pre-easter Wednesday', -4, 1),
    createEasterTemplate('maundy-thursday', 'Maundy Thursday', -3, 1),
    createEasterTemplate('good-friday', 'Good Friday', -2, 1),
    createEasterTemplate('easter-eve', 'Easter Eve', -1, 1),
    createEasterTemplate('easter-sunday', 'Easter Sunday', 0, 1),
    createEasterTemplate('easter-monday', 'Easter Monday', 1, 1),
    createFixedTemplate('labour-day', 'Labour day', 5, 1, 1),
    createFixedTemplate(
      'norwegian-constitution-day',
      'Norwegian Constitution day',
      5,
      17,
      1
    ),
    createEasterTemplate('ascension-day', 'Ascension day', 39, 1),
    createEasterTemplate('pentecost-saturday', 'Pentecost Saturday', 48, 1),
    createEasterTemplate('pentecost', 'Pentecost', 49, 1),
    createEasterTemplate('whit-monday', 'Whit Monday', 50, 1),
    createFixedTemplate('december-23rd', 'December 23rd', 12, 23, 1),
    createFixedTemplate('christmas-eve', 'Christmas Eve', 12, 24, 1),
    createFixedTemplate('christmas-day', 'Christmas Day', 12, 25, 1),
    createFixedTemplate("st-stephens-day", "St. Stephen's Day", 12, 26, 1),
    createFixedTemplate("new-years-eve", "New Year's Eve", 12, 31, 1),
    createFixedTemplate('test', 'Test', 2, 22, 1),
    createFixedTemplate('national-day-sweden', 'National day of Sweden', 6, 6, 1),
    createFixedTemplate('national-day-finland', 'National day of Finland', 12, 6, 1),
    createEasterTemplate('great-prayer-day', 'Great Prayer Day', 26, 1),
    createFixedTemplate('national-day-denmark', 'National day of Denmark', 6, 5, 1),
    createFixedTemplate('all-saints-day', 'All Saints Day', 11, 1, 1),
    createRRuleTemplate(
      'bots-og-bededag',
      'Bots- og bededag',
      NORWEGIAN_BOTS_OG_BEDEDAG_RRULE,
      1
    ),
    createFixedTemplate('epiphany', 'Epiphany', 1, 6, 1),
    createRRuleTemplate(
      'midsummers-day',
      "Midsummer's Day",
      SWEDISH_MIDSUMMER_DAY_RRULE,
      1
    ),
    createRRuleTemplate(
      'midsummers-evening',
      "Midsummer's Evening",
      SWEDISH_MIDSUMMER_EVE_RRULE,
      1
    )
  ];
}

function createFixedTemplate(
  id: string,
  label: string,
  month: number,
  day: number,
  lengthDays: number
): HolidayTemplate {
  return {
    id,
    label,
    holiday: {
      name: label,
      rule: 'fixed-date',
      month,
      day,
      lengthDays,
      closed: true,
      slots: [],
      closedExitType: ExitOutcome.Deny
    }
  };
}

function createEasterTemplate(
  id: string,
  label: string,
  offsetDays: number,
  lengthDays: number
): HolidayTemplate {
  return {
    id,
    label,
    holiday: {
      name: label,
      rule: 'easter',
      offsetDays,
      lengthDays,
      closed: true,
      slots: [],
      closedExitType: ExitOutcome.Deny
    }
  };
}

function createRRuleTemplate(
  id: string,
  label: string,
  rrule: string,
  lengthDays: number
): HolidayTemplate {
  const holiday: RecurringHoliday = {
    name: label,
    rule: 'rrule',
    rrule,
    lengthDays,
    closed: true,
    slots: [],
    closedExitType: ExitOutcome.Deny
  };
  return { id, label, holiday };
}
