import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { RecurringHolidayRule, Weekday } from './opening-hours.model';

export type DateParser = (value: string) => Date | null;

export function slotFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const opensAt = control.get('opensAt')?.value as string | null;
    const closesAt = control.get('closesAt')?.value as string | null;
    const start = parseTimeToMinutes(opensAt);
    const end = parseTimeToMinutes(closesAt);

    if (start === null || end === null) {
      return { timeFormat: true };
    }

    if (start >= end) {
      return { timeOrder: true };
    }

    return null;
  };
}

export function weeklyRecordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDays = (control.get('days')?.value as Weekday[] | null) ?? [];
    if (selectedDays.length === 0) {
      return { daysRequired: true };
    }

    const slots = (control.get('slots') as FormArray | null)?.controls ?? [];
    if (slots.length === 0) {
      return { slotRequired: true };
    }

    if (slots.some((slot) => slot.invalid)) {
      return { slotInvalid: true };
    }

    const ranges = slots
      .map((slot) => slotRange(slot))
      .filter((value): value is { start: number; end: number } => value !== null)
      .sort((a, b) => a.start - b.start);

    for (let i = 1; i < ranges.length; i += 1) {
      if (ranges[i].start < ranges[i - 1].end) {
        return { slotOverlap: true };
      }
    }

    return null;
  };
}

export function weekdaysOverlapValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const recordForms = (control as FormArray).controls;
    const usedDays = new Set<string>();

    for (const recordForm of recordForms) {
      const days = (recordForm.get('days')?.value as Weekday[] | null) ?? [];
      for (const day of days) {
        if (usedDays.has(day)) {
          return { weekdayOverlap: true };
        }
        usedDays.add(day);
      }
    }

    return null;
  };
}

export function holidayFormValidator(parseDateInput: DateParser): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rule = control.get('rule')?.value as RecurringHolidayRule | null;
    const closed = control.get('closed')?.value as boolean | null;
    const slots = (control.get('slots') as FormArray | null)?.controls ?? [];

    if (rule === 'date-range') {
      const rangeStartRaw = control.get('rangeStart')?.value as string | null;
      const rangeEndRaw = control.get('rangeEnd')?.value as string | null;
      const weekdays = (control.get('weekdays')?.value as Weekday[] | null) ?? [];
      if (!rangeStartRaw || !rangeEndRaw) {
        return { dateRangeRequired: true };
      }
      if (weekdays.length === 0) {
        return { dateRangeWeekdaysRequired: true };
      }

      const start = parseDateInput(rangeStartRaw);
      const end = parseDateInput(rangeEndRaw);
      if (!start || !end) {
        return { dateRangeFormat: true };
      }

      if (end.getTime() < start.getTime()) {
        return { dateRangeOrder: true };
      }
    }

    if (rule === 'single-date') {
      const singleDateRaw = control.get('singleDate')?.value as string | null;
      if (!singleDateRaw) {
        return { singleDateRequired: true };
      }
      const singleDate = parseDateInput(singleDateRaw);
      if (!singleDate) {
        return { singleDateFormat: true };
      }
    }

    if (!closed) {
      if (slots.length === 0) {
        return { slotRequired: true };
      }

      if (slots.some((slot) => slot.invalid)) {
        return { slotInvalid: true };
      }

      const ranges = slots
        .map((slot) => slotRange(slot))
        .filter((value): value is { start: number; end: number } => value !== null)
        .sort((a, b) => a.start - b.start);

      for (let i = 1; i < ranges.length; i += 1) {
        if (ranges[i].start < ranges[i - 1].end) {
          return { slotOverlap: true };
        }
      }
    }

    return null;
  };
}

export function dateRangeOverlapValidator(parseDateInput: DateParser): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const holidayForms = (control as FormArray).controls;
    const ranges = holidayForms
      .filter((holidayForm) => holidayForm.get('rule')?.value === 'date-range')
      .map((holidayForm) => {
        const start = parseDateInput(
          (holidayForm.get('rangeStart')?.value as string | null) ?? ''
        );
        const end = parseDateInput(
          (holidayForm.get('rangeEnd')?.value as string | null) ?? ''
        );
        const weekdays = (holidayForm.get('weekdays')?.value as Weekday[] | null) ?? [];
        if (!start || !end) {
          return null;
        }
        return { start, end, weekdays };
      })
      .filter(
        (range): range is { start: Date; end: Date; weekdays: Weekday[] } =>
          range !== null
      )
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    for (let i = 0; i < ranges.length; i += 1) {
      for (let j = i + 1; j < ranges.length; j += 1) {
        // Because ranges are sorted by start, later ranges will not overlap once this is true.
        if (ranges[j].start.getTime() > ranges[i].end.getTime()) {
          break;
        }

        const datesOverlap = ranges[j].start.getTime() <= ranges[i].end.getTime();
        if (!datesOverlap) {
          continue;
        }

        const weekdaysOverlap = ranges[i].weekdays.some((day) =>
          ranges[j].weekdays.includes(day)
        );

        if (weekdaysOverlap) {
          return { dateRangeOverlap: true };
        }
      }
    }

    return null;
  };
}

function parseTimeToMinutes(value: string | null): number | null {
  if (!value) {
    return null;
  }

  if (value === '24:00') {
    return 24 * 60;
  }

  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

function slotRange(control: AbstractControl): { start: number; end: number } | null {
  const opensAt = control.get('opensAt')?.value as string | null;
  const closesAt = control.get('closesAt')?.value as string | null;
  const start = parseTimeToMinutes(opensAt);
  const end = parseTimeToMinutes(closesAt);
  if (start === null || end === null || start >= end) {
    return null;
  }
  return { start, end };
}
