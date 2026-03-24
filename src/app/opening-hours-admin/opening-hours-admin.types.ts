import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  ExitOutcomeId,
  RecurringHoliday,
  RecurringHolidayRule,
  Weekday
} from './opening-hours.model';

export type SlotForm = FormGroup<{
  opensAt: FormControl<string>;
  closesAt: FormControl<string>;
  openExitType: FormControl<ExitOutcomeId>;
}>;

export type DayForm = FormGroup<{
  name: FormControl<string>;
  days: FormControl<Weekday[]>;
  slots: FormArray<SlotForm>;
  closedExitType: FormControl<ExitOutcomeId>;
}>;

export type HolidayForm = FormGroup<{
  name: FormControl<string>;
  rule: FormControl<RecurringHolidayRule>;
  month: FormControl<number | null>;
  day: FormControl<number | null>;
  offsetDays: FormControl<number | null>;
  rrule: FormControl<string | null>;
  rangeStart: FormControl<string | null>;
  rangeEnd: FormControl<string | null>;
  singleDate: FormControl<string | null>;
  weekdays: FormControl<Weekday[]>;
  lengthDays: FormControl<number>;
  closed: FormControl<boolean>;
  slots: FormArray<SlotForm>;
  closedExitType: FormControl<ExitOutcomeId>;
}>;

export type HolidayFormValue = {
  name: string;
  rule: RecurringHolidayRule;
  month: number | null;
  day: number | null;
  offsetDays: number | null;
  rrule: string | null;
  rangeStart: string | null;
  rangeEnd: string | null;
  singleDate: string | null;
  weekdays: Weekday[];
  lengthDays: number;
  closed: boolean;
  slots: {
    opensAt: string;
    closesAt: string;
    openExitType: ExitOutcomeId;
  }[];
  closedExitType: ExitOutcomeId;
};

export type HolidayTemplate = {
  id: string;
  label: string;
  holiday: RecurringHoliday;
};

export type TimezoneOption = {
  value: string;
  label: string;
};

export type ExitTypeOption = {
  value: ExitOutcomeId;
  label: string;
  color: string;
};
