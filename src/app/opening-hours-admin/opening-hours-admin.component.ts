import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  DateRangeHoliday,
  OpeningHoursSchedule,
  RecurringHoliday,
  RecurringHolidayRule,
  ExitOutcome,
  SingleDateHoliday,
  WeeklyOpeningHoursRecord,
  WEEKDAYS,
  Weekday
} from './opening-hours.model';
import { OpeningHoursService } from './opening-hours.service';
import {
  dateRangeOverlapValidator,
  holidayFormValidator,
  slotFormValidator,
  weeklyRecordValidator,
  weekdaysOverlapValidator
} from './opening-hours.validators';

type SlotForm = FormGroup<{
  opensAt: import('@angular/forms').FormControl<string>;
  closesAt: import('@angular/forms').FormControl<string>;
}>;

type DayForm = FormGroup<{
  days: import('@angular/forms').FormControl<Weekday[]>;
  slots: FormArray<SlotForm>;
  openExitType: import('@angular/forms').FormControl<ExitOutcome>;
  closedExitType: import('@angular/forms').FormControl<ExitOutcome>;
}>;

type HolidayForm = FormGroup<{
  name: import('@angular/forms').FormControl<string>;
  rule: import('@angular/forms').FormControl<RecurringHolidayRule>;
  month: import('@angular/forms').FormControl<number | null>;
  day: import('@angular/forms').FormControl<number | null>;
  offsetDays: import('@angular/forms').FormControl<number | null>;
  rangeStart: import('@angular/forms').FormControl<string | null>;
  rangeEnd: import('@angular/forms').FormControl<string | null>;
  singleDate: import('@angular/forms').FormControl<string | null>;
  weekdays: import('@angular/forms').FormControl<Weekday[]>;
  lengthDays: import('@angular/forms').FormControl<number>;
  closed: import('@angular/forms').FormControl<boolean>;
  slots: FormArray<SlotForm>;
  openExitType: import('@angular/forms').FormControl<ExitOutcome>;
  closedExitType: import('@angular/forms').FormControl<ExitOutcome>;
}>;

type HolidayFormValue = {
  name: string;
  rule: RecurringHolidayRule;
  month: number | null;
  day: number | null;
  offsetDays: number | null;
  rangeStart: string | null;
  rangeEnd: string | null;
  singleDate: string | null;
  weekdays: Weekday[];
  lengthDays: number;
  closed: boolean;
  slots: { opensAt: string; closesAt: string }[];
  openExitType: ExitOutcome;
  closedExitType: ExitOutcome;
};

type HolidayTemplate = {
  id: string;
  label: string;
  holiday: RecurringHoliday;
};

type TimezoneOption = {
  value: string;
  label: string;
};

type ExitTypeOption = {
  value: ExitOutcome;
  label: string;
};

@Component({
  selector: 'app-opening-hours-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './opening-hours-admin.component.html',
  styleUrl: './opening-hours-admin.component.scss'
})
export class OpeningHoursAdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(OpeningHoursService);

  readonly currentYear = new Date().getFullYear();
  readonly weekdays = WEEKDAYS;
  readonly exitTypeOptions: ReadonlyArray<ExitTypeOption> = [
    { value: ExitOutcome.Allow, label: 'Allow' },
    { value: ExitOutcome.AllowWithMessage, label: 'Allow With Message' },
    { value: ExitOutcome.Defer, label: 'Defer' },
    { value: ExitOutcome.Escalate, label: 'Escalate' },
    { value: ExitOutcome.Review, label: 'Review' },
    { value: ExitOutcome.DenyWithMessage, label: 'Deny With Message' },
    { value: ExitOutcome.Deny, label: 'Deny' }
  ];
  readonly timezoneOptions = this.buildTimezoneOptions();
  readonly openTimeOptions = this.buildTimeOptions(15, false);
  readonly closeTimeOptions = this.buildTimeOptions(15, true);
  readonly holidayTemplates: ReadonlyArray<HolidayTemplate> = [
    this.createEasterTemplate('easter-week', 'Easter Week', -8, 10),
    this.createEasterTemplate('easter', 'Easter', -3, 5),
    this.createFixedTemplate('christmas', 'Christmas', 12, 24, 9),
    this.createFixedTemplate('boxing-week', 'Boxing Week', 12, 25, 7),
    this.createFixedTemplate("new-years", "New Year's", 1, 1, 1),
    this.createEasterTemplate('palm-sunday', 'Palm Sunday', -7, 1),
    this.createEasterTemplate(
      'pre-easter-wednesday',
      'Pre-easter Wednesday',
      -4,
      1
    ),
    this.createEasterTemplate('maundy-thursday', 'Maundy Thursday', -3, 1),
    this.createEasterTemplate('good-friday', 'Good Friday', -2, 1),
    this.createEasterTemplate('easter-eve', 'Easter Eve', -1, 1),
    this.createEasterTemplate('easter-sunday', 'Easter Sunday', 0, 1),
    this.createEasterTemplate('easter-monday', 'Easter Monday', 1, 1),
    this.createFixedTemplate('labour-day', 'Labour day', 5, 1, 1),
    this.createFixedTemplate(
      'norwegian-constitution-day',
      'Norwegian Constitution day',
      5,
      17,
      1
    ),
    this.createEasterTemplate('ascension-day', 'Ascension day', 39, 1),
    this.createEasterTemplate(
      'pentecost-saturday',
      'Pentecost Saturday',
      48,
      1
    ),
    this.createEasterTemplate('pentecost', 'Pentecost', 49, 1),
    this.createEasterTemplate('whit-monday', 'Whit Monday', 50, 1),
    this.createFixedTemplate('december-23rd', 'December 23rd', 12, 23, 1),
    this.createFixedTemplate('christmas-eve', 'Christmas Eve', 12, 24, 1),
    this.createFixedTemplate('christmas-day', 'Christmas Day', 12, 25, 1),
    this.createFixedTemplate("st-stephens-day", "St. Stephen's Day", 12, 26, 1),
    this.createFixedTemplate("new-years-eve", "New Year's Eve", 12, 31, 1),
    this.createFixedTemplate('test', 'Test', 2, 22, 1),
    this.createFixedTemplate(
      'national-day-sweden',
      'National day of Sweden',
      6,
      6,
      1
    ),
    this.createFixedTemplate(
      'national-day-finland',
      'National day of Finland',
      12,
      6,
      1
    ),
    this.createEasterTemplate('great-prayer-day', 'Great Prayer Day', 26, 1),
    this.createFixedTemplate(
      'national-day-denmark',
      'National day of Denmark',
      6,
      5,
      1
    ),
    this.createFixedTemplate('all-saints-day', 'All Saints Day', 11, 1, 1),
    this.createFixedTemplate('epiphany', 'Epiphany', 1, 6, 1),
    this.createSwedishMidsummerTemplate(
      'midsummers-day',
      "Midsummer's Day",
      'swedish-midsummer-day',
      1
    ),
    this.createSwedishMidsummerTemplate(
      'midsummers-evening',
      "Midsummer's Evening",
      'swedish-midsummer-eve',
      1
    )
  ].sort((a, b) => this.compareHolidaysByDate(a.holiday, b.holiday));
  readonly defaultHolidayTemplateId = this.holidayTemplates[0].id;

  readonly form = this.fb.nonNullable.group({
    timezone: ['Europe/London', Validators.required],
    days: this.fb.array<DayForm>([], {
      validators: weekdaysOverlapValidator()
    }),
    recurringHolidays: this.fb.array<HolidayForm>([], {
      validators: dateRangeOverlapValidator((value) => this.parseDateInput(value))
    })
  });

  readonly serializedSchedule = computed(() =>
    JSON.stringify(this.service.schedule(), null, 2)
  );

  constructor() {
    this.hydrate(this.service.schedule());
  }

  get dayForms(): FormArray<DayForm> {
    return this.form.controls.days;
  }

  get holidayForms(): FormArray<HolidayForm> {
    return this.form.controls.recurringHolidays;
  }

  slotForms(dayIndex: number): FormArray<SlotForm> {
    return this.dayForms.at(dayIndex).controls.slots;
  }

  hasWeekday(dayIndex: number, day: Weekday): boolean {
    return this.dayForms.at(dayIndex).controls.days.value.includes(day);
  }

  toggleWeekday(dayIndex: number, day: Weekday, checked: boolean): void {
    const control = this.dayForms.at(dayIndex).controls.days;
    const current = control.value;
    if (checked) {
      if (!current.includes(day)) {
        control.setValue([...current, day]);
      }
      return;
    }

    control.setValue(current.filter((selectedDay) => selectedDay !== day));
  }

  addDayRecord(): void {
    this.dayForms.push(
      this.createDayForm({
        days: [],
        slots: [{ opensAt: '09:00', closesAt: '17:00' }],
        openExitType: ExitOutcome.Allow,
        closedExitType: ExitOutcome.Deny
      })
    );
  }

  removeDayRecord(dayIndex: number): void {
    this.dayForms.removeAt(dayIndex);
  }

  addSlot(dayIndex: number): void {
    this.slotForms(dayIndex).push(this.createSlotForm('09:00', '17:00'));
  }

  removeSlot(dayIndex: number, slotIndex: number): void {
    this.slotForms(dayIndex).removeAt(slotIndex);
  }

  addHolidayFromTemplate(templateId: string): void {
    const template = this.holidayTemplates.find((item) => item.id === templateId);
    if (!template) {
      return;
    }

    const alreadyAdded = this.holidayForms.controls.some(
      (holidayForm) => holidayForm.controls.name.value === template.holiday.name
    );

    if (alreadyAdded) {
      return;
    }

    this.holidayForms.push(this.createHolidayForm(template.holiday));
    this.sortHolidayFormsByDate();
  }

  addDateRangeHoliday(): void {
    const today = new Date();
    const start = this.formatIsoDate(today);
    const end = this.formatIsoDate(this.addDays(today, 6));
    const defaultWeekdays: Weekday[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday'
    ];
    const sequence = this.holidayForms.controls.filter(
      (holidayForm) => holidayForm.controls.rule.value === 'date-range'
    ).length + 1;

    this.holidayForms.push(
      this.createHolidayForm({
        name: `Date range ${sequence}`,
        rule: 'date-range',
        rangeStart: start,
        rangeEnd: end,
        weekdays: defaultWeekdays,
        lengthDays: 7,
        closed: true,
        slots: [],
        openExitType: ExitOutcome.Allow,
        closedExitType: ExitOutcome.Deny
      })
    );
    this.sortHolidayFormsByDate();
  }

  addSingleDateHoliday(): void {
    const today = new Date();
    const singleDate = this.formatIsoDate(today);
    const sequence = this.holidayForms.controls.filter(
      (holidayForm) => holidayForm.controls.rule.value === 'single-date'
    ).length + 1;

    this.holidayForms.push(
      this.createHolidayForm({
        name: `Single date ${sequence}`,
        rule: 'single-date',
        singleDate,
        lengthDays: 1,
        closed: true,
        slots: [],
        openExitType: ExitOutcome.Allow,
        closedExitType: ExitOutcome.Deny
      })
    );
    this.sortHolidayFormsByDate();
  }

  removeHoliday(index: number): void {
    this.holidayForms.removeAt(index);
  }

  hasHolidayWeekday(holidayIndex: number, day: Weekday): boolean {
    return this.holidayForms.at(holidayIndex).controls.weekdays.value.includes(day);
  }

  toggleHolidayWeekday(
    holidayIndex: number,
    day: Weekday,
    checked: boolean
  ): void {
    const control = this.holidayForms.at(holidayIndex).controls.weekdays;
    const current = control.value;
    if (checked) {
      if (!current.includes(day)) {
        control.setValue([...current, day]);
      }
      return;
    }

    control.setValue(current.filter((selectedDay) => selectedDay !== day));
  }

  holidaySlotForms(holidayIndex: number): FormArray<SlotForm> {
    return this.holidayForms.at(holidayIndex).controls.slots;
  }

  addHolidaySlot(holidayIndex: number): void {
    this.holidaySlotForms(holidayIndex).push(this.createSlotForm('09:00', '17:00'));
  }

  removeHolidaySlot(holidayIndex: number, slotIndex: number): void {
    this.holidaySlotForms(holidayIndex).removeAt(slotIndex);
  }

  toIsoDateValue(value: string | null): string {
    return this.normalizeDateInput(value) ?? '';
  }

  onDatePicked(
    holidayIndex: number,
    field: 'rangeStart' | 'rangeEnd' | 'singleDate',
    isoDateValue: string
  ): void {
    if (!isoDateValue) {
      return;
    }

    const holidayForm = this.holidayForms.at(holidayIndex);
    holidayForm.controls[field].setValue(this.formatEuropeanDate(isoDateValue));
  }

  openNativeDatePicker(input: HTMLInputElement): void {
    const picker = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof picker.showPicker === 'function') {
      picker.showPicker();
      return;
    }

    input.focus();
    input.click();
  }

  holidaySummary(holidayForm: HolidayForm): string {
    if (holidayForm.controls.rule.value === 'date-range') {
      const rangeStart = holidayForm.controls.rangeStart.value;
      const rangeEnd = holidayForm.controls.rangeEnd.value;
      if (rangeStart && rangeEnd) {
        return `Range: ${this.formatEuropeanDate(rangeStart)} to ${this.formatEuropeanDate(rangeEnd)}`;
      }
      return 'Range: set start and end date';
    }
    if (holidayForm.controls.rule.value === 'single-date') {
      const singleDate = holidayForm.controls.singleDate.value;
      return singleDate
        ? `Date: ${this.formatEuropeanDate(singleDate)}`
        : 'Date: set single date';
    }

    const startDate = this.getHolidayExampleDateForYear(
      {
        rule: holidayForm.controls.rule.value,
        month: holidayForm.controls.month.value ?? undefined,
        day: holidayForm.controls.day.value ?? undefined,
        offsetDays: holidayForm.controls.offsetDays.value ?? undefined,
        rangeStart: holidayForm.controls.rangeStart.value ?? undefined,
        singleDate: holidayForm.controls.singleDate.value ?? undefined
      },
      this.currentYear
    );
    const lengthDays = holidayForm.controls.lengthDays.value;

    if (!startDate) {
      return 'No date example';
    }

    if (lengthDays <= 1) {
      return `Example ${this.currentYear}: ${this.formatEuropeanDate(startDate)}`;
    }

    const endDate = this.addDays(startDate, lengthDays - 1);
    return `Example ${this.currentYear}: ${this.formatEuropeanDate(startDate)} to ${this.formatEuropeanDate(endDate)} (${lengthDays} days)`;
  }

  holidayTemplateLabel(template: HolidayTemplate): string {
    const startDate = this.getHolidayExampleDateForYear(
      template.holiday,
      this.currentYear
    );
    if (!startDate) {
      return template.label;
    }

    if (template.holiday.lengthDays <= 1) {
      return `${template.label} (${this.currentYear}: ${this.formatEuropeanDate(startDate)})`;
    }

    const endDate = this.addDays(startDate, template.holiday.lengthDays - 1);
    return `${template.label} (${this.currentYear}: ${this.formatEuropeanDate(startDate)} to ${this.formatEuropeanDate(endDate)})`;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.service.updateSchedule(this.buildScheduleFromForm());
  }

  trackByDay(_index: number, dayForm: DayForm): string {
    return dayForm.controls.days.value.join('|') || `record-${_index}`;
  }

  private hydrate(schedule: OpeningHoursSchedule): void {
    this.dayForms.clear();
    this.holidayForms.clear();
    schedule.days.forEach((day) => this.dayForms.push(this.createDayForm(day)));
    [...schedule.recurringHolidays, ...schedule.dateRanges, ...schedule.singleDates]
      .sort((a, b) => this.compareHolidaysByDate(a, b))
      .forEach((holiday) =>
      this.holidayForms.push(this.createHolidayForm(holiday))
      );
    this.form.patchValue({
      timezone: schedule.timezone
    });
  }

  private createDayForm(day: WeeklyOpeningHoursRecord): DayForm {
    return this.fb.nonNullable.group({
      days: [day.days],
      slots: this.fb.array(day.slots.map((slot) => this.createSlotForm(slot.opensAt, slot.closesAt))),
      openExitType: [day.openExitType],
      closedExitType: [day.closedExitType]
    }, { validators: weeklyRecordValidator() });
  }

  private createSlotForm(opensAt: string, closesAt: string): SlotForm {
    return this.fb.nonNullable.group({
      opensAt: [opensAt, Validators.required],
      closesAt: [closesAt, Validators.required]
    }, { validators: slotFormValidator() });
  }

  private createHolidayForm(holiday: RecurringHoliday): HolidayForm {
    const rangeStartValue =
      holiday.rule === 'date-range' && holiday.rangeStart
        ? this.formatEuropeanDate(holiday.rangeStart)
        : holiday.rangeStart ?? null;
    const rangeEndValue =
      holiday.rule === 'date-range' && holiday.rangeEnd
        ? this.formatEuropeanDate(holiday.rangeEnd)
        : holiday.rangeEnd ?? null;
    const singleDateValue =
      holiday.rule === 'single-date' && holiday.singleDate
        ? this.formatEuropeanDate(holiday.singleDate)
        : holiday.singleDate ?? null;

    return this.fb.group({
      name: this.fb.nonNullable.control(holiday.name, Validators.required),
      rule: this.fb.nonNullable.control(holiday.rule),
      month: this.fb.control(holiday.month ?? null, [
        Validators.min(1),
        Validators.max(12)
      ]),
      day: this.fb.control(holiday.day ?? null, [
        Validators.min(1),
        Validators.max(31)
      ]),
      offsetDays: this.fb.control(holiday.offsetDays ?? null, [
        Validators.min(-365),
        Validators.max(365)
      ]),
      rangeStart: this.fb.control(rangeStartValue),
      rangeEnd: this.fb.control(rangeEndValue),
      singleDate: this.fb.control(singleDateValue),
      weekdays: this.fb.nonNullable.control(holiday.weekdays ?? []),
      lengthDays: this.fb.nonNullable.control(holiday.lengthDays, [
        Validators.min(1)
      ]),
      closed: this.fb.nonNullable.control(holiday.closed),
      slots: this.fb.array(
        holiday.slots.map((slot) => this.createSlotForm(slot.opensAt, slot.closesAt))
      ),
      openExitType: this.fb.nonNullable.control(holiday.openExitType),
      closedExitType: this.fb.nonNullable.control(holiday.closedExitType)
    }, { validators: holidayFormValidator((value) => this.parseDateInput(value)) });
  }

  private normalizeHoliday(holiday: HolidayFormValue): RecurringHoliday {
    if (holiday.rule === 'fixed-date') {
      return {
        name: holiday.name,
        rule: holiday.rule,
        month: holiday.month ?? 1,
        day: holiday.day ?? 1,
        lengthDays: holiday.lengthDays,
        closed: holiday.closed,
        slots: holiday.closed ? [] : holiday.slots,
        openExitType: holiday.openExitType,
        closedExitType: holiday.closedExitType
      };
    }

    if (holiday.rule === 'easter') {
      return {
        name: holiday.name,
        rule: holiday.rule,
        offsetDays: holiday.offsetDays ?? 0,
        lengthDays: holiday.lengthDays,
        closed: holiday.closed,
        slots: holiday.closed ? [] : holiday.slots,
        openExitType: holiday.openExitType,
        closedExitType: holiday.closedExitType
      };
    }

    if (holiday.rule === 'date-range') {
      const rangeStart =
        this.normalizeDateInput(holiday.rangeStart) ?? this.formatIsoDate(new Date());
      const rangeEnd = this.normalizeDateInput(holiday.rangeEnd) ?? rangeStart;
      return {
        name: holiday.name,
        rule: holiday.rule,
        rangeStart,
        rangeEnd,
        weekdays: holiday.weekdays,
        lengthDays: this.calculateDateRangeLength(rangeStart, rangeEnd),
        closed: holiday.closed,
        slots: holiday.closed ? [] : holiday.slots,
        openExitType: holiday.openExitType,
        closedExitType: holiday.closedExitType
      };
    }

    if (holiday.rule === 'single-date') {
      const singleDate =
        this.normalizeDateInput(holiday.singleDate) ?? this.formatIsoDate(new Date());
      return {
        name: holiday.name,
        rule: holiday.rule,
        singleDate,
        lengthDays: 1,
        closed: holiday.closed,
        slots: holiday.closed ? [] : holiday.slots,
        openExitType: holiday.openExitType,
        closedExitType: holiday.closedExitType
      };
    }

    return {
      name: holiday.name,
      rule: holiday.rule,
      lengthDays: holiday.lengthDays,
      closed: holiday.closed,
      slots: holiday.closed ? [] : holiday.slots,
      openExitType: holiday.openExitType,
      closedExitType: holiday.closedExitType
    };
  }

  private buildScheduleFromForm(): OpeningHoursSchedule {
    const raw = this.form.getRawValue();
    const normalizedHolidays = raw.recurringHolidays.map((holiday) =>
      this.normalizeHoliday(holiday)
    );
    const recurringHolidays = normalizedHolidays.filter(
      (holiday) => holiday.rule !== 'date-range' && holiday.rule !== 'single-date'
    );
    const dateRanges = normalizedHolidays.filter(
      (holiday): holiday is DateRangeHoliday => holiday.rule === 'date-range'
    );
    const singleDates = normalizedHolidays.filter(
      (holiday): holiday is SingleDateHoliday => holiday.rule === 'single-date'
    );

    return {
      timezone: raw.timezone,
      days: raw.days,
      recurringHolidays,
      dateRanges,
      singleDates
    };
  }

  private buildTimeOptions(stepMinutes: number, forCloseTime: boolean): string[] {
    const options: string[] = [];
    const startMinutes = forCloseTime ? stepMinutes : 0;
    const endMinutesExclusive = forCloseTime ? (24 * 60) + stepMinutes : 24 * 60;

    for (
      let totalMinutes = startMinutes;
      totalMinutes < endMinutesExclusive;
      totalMinutes += stepMinutes
    ) {
      if (totalMinutes === 24 * 60) {
        options.push('24:00');
        continue;
      }
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      const hh = String(hour).padStart(2, '0');
      const mm = String(minute).padStart(2, '0');
      options.push(`${hh}:${mm}`);
    }
    return options;
  }

  private getHolidayExampleDateForYear(
    holiday: Pick<
      RecurringHoliday,
      'rule' | 'month' | 'day' | 'offsetDays' | 'rangeStart' | 'singleDate'
    >,
    year: number
  ): Date | null {
    let date: Date | null = null;

    if (holiday.rule === 'fixed-date') {
      if (!holiday.month || !holiday.day) {
        return null;
      }
      date = new Date(year, holiday.month - 1, holiday.day);
    } else if (holiday.rule === 'easter') {
      date = this.getEasterDate(year);
      const offsetDays = holiday.offsetDays ?? 0;
      date.setDate(date.getDate() + offsetDays);
    } else if (holiday.rule === 'swedish-midsummer-day') {
      date = this.getSwedishMidsummerDayDate(year);
    } else if (holiday.rule === 'swedish-midsummer-eve') {
      date = this.getSwedishMidsummerEveDate(year);
    } else if (holiday.rule === 'date-range' && holiday.rangeStart) {
      const parsed = this.parseDateInput(holiday.rangeStart);
      if (parsed) {
        date = parsed;
      }
    } else if (holiday.rule === 'single-date' && holiday.singleDate) {
      const parsed = this.parseDateInput(holiday.singleDate);
      if (parsed) {
        date = parsed;
      }
    }

    return date;
  }

  private getEasterDate(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  private getSwedishMidsummerDayDate(year: number): Date {
    for (let day = 20; day <= 26; day += 1) {
      const candidate = new Date(year, 5, day);
      if (candidate.getDay() === 6) {
        return candidate;
      }
    }
    return new Date(year, 5, 20);
  }

  private getSwedishMidsummerEveDate(year: number): Date {
    for (let day = 19; day <= 25; day += 1) {
      const candidate = new Date(year, 5, day);
      if (candidate.getDay() === 5) {
        return candidate;
      }
    }
    return this.addDays(this.getSwedishMidsummerDayDate(year), -1);
  }

  private formatIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatEuropeanDate(value: Date | string): string {
    const date = typeof value === 'string' ? this.parseDateInput(value) : new Date(value);
    if (!date) {
      return typeof value === 'string' ? value : '';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  private parseIsoDate(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
      return null;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }
    return parsed;
  }

  private parseEuropeanDate(value: string): Date | null {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
    if (!match) {
      return null;
    }
    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }
    return parsed;
  }

  private parseDateInput(value: string): Date | null {
    return this.parseIsoDate(value) ?? this.parseEuropeanDate(value);
  }

  private normalizeDateInput(value: string | null): string | null {
    if (!value) {
      return null;
    }
    const parsed = this.parseDateInput(value);
    return parsed ? this.formatIsoDate(parsed) : null;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private calculateDateRangeLength(rangeStart: string, rangeEnd: string): number {
    const start = this.parseDateInput(rangeStart);
    const end = this.parseDateInput(rangeEnd);
    if (!start || !end) {
      return 1;
    }
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.max(1, Math.floor((end.getTime() - start.getTime()) / msPerDay) + 1);
  }

  private compareHolidaysByDate(a: RecurringHoliday, b: RecurringHoliday): number {
    const aDate = this.getHolidayExampleDateForYear(a, this.currentYear);
    const bDate = this.getHolidayExampleDateForYear(b, this.currentYear);

    if (!aDate && !bDate) {
      return a.name.localeCompare(b.name);
    }
    if (!aDate) {
      return 1;
    }
    if (!bDate) {
      return -1;
    }

    if (aDate.getTime() !== bDate.getTime()) {
      return aDate.getTime() - bDate.getTime();
    }

    return a.name.localeCompare(b.name);
  }

  private sortHolidayFormsByDate(): void {
    this.holidayForms.controls.sort((aForm, bForm) => {
      const aHoliday = this.normalizeHoliday(aForm.getRawValue());
      const bHoliday = this.normalizeHoliday(bForm.getRawValue());
      return this.compareHolidaysByDate(aHoliday, bHoliday);
    });
    this.holidayForms.updateValueAndValidity();
  }

  private createFixedTemplate(
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
        openExitType: ExitOutcome.Allow,
        closedExitType: ExitOutcome.Deny
      }
    };
  }

  private createEasterTemplate(
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
        openExitType: ExitOutcome.Allow,
        closedExitType: ExitOutcome.Deny
      }
    };
  }

  private createSwedishMidsummerTemplate(
    id: string,
    label: string,
    rule: 'swedish-midsummer-day' | 'swedish-midsummer-eve',
    lengthDays: number
  ): HolidayTemplate {
    return {
      id,
      label,
      holiday: {
        name: label,
        rule,
        lengthDays,
        closed: true,
        slots: [],
        openExitType: ExitOutcome.Allow,
        closedExitType: ExitOutcome.Deny
      }
    };
  }

  private buildTimezoneOptions(): TimezoneOption[] {
    const intlWithTimezones = Intl as typeof Intl & {
      supportedValuesOf?: (key: 'timeZone') => string[];
    };
    const fromIntl = intlWithTimezones.supportedValuesOf?.('timeZone');
    if (fromIntl && fromIntl.length > 0) {
      return fromIntl
        .map((timezone) => ({
          value: timezone,
          label: `${timezone} (${this.getUtcOffsetLabel(timezone)})`
        }))
        .sort((a, b) => {
          const offsetDiff =
            this.getUtcOffsetMinutes(a.value) - this.getUtcOffsetMinutes(b.value);
          if (offsetDiff !== 0) {
            return offsetDiff;
          }
          return a.value.localeCompare(b.value);
        });
    }

    return [
      'Europe/Oslo',
      'Europe/Stockholm',
      'Europe/Copenhagen',
      'Europe/Helsinki',
      'Europe/London',
      'Europe/Berlin',
      'UTC'
    ]
      .map((timezone) => ({
        value: timezone,
        label: `${timezone} (${this.getUtcOffsetLabel(timezone)})`
      }))
      .sort((a, b) => {
        const offsetDiff =
          this.getUtcOffsetMinutes(a.value) - this.getUtcOffsetMinutes(b.value);
        if (offsetDiff !== 0) {
          return offsetDiff;
        }
        return a.value.localeCompare(b.value);
      });
  }

  private getUtcOffsetLabel(timezone: string): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    });
    const offsetPart = formatter
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')?.value;

    if (!offsetPart) {
      return 'UTC';
    }

    if (offsetPart === 'GMT' || offsetPart === 'UTC') {
      return 'UTC+00:00';
    }

    const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(offsetPart);
    if (!match) {
      return offsetPart.replace('GMT', 'UTC');
    }

    const sign = match[1];
    const hours = String(Number(match[2])).padStart(2, '0');
    const minutes = match[3] ?? '00';
    return `UTC${sign}${hours}:${minutes}`;
  }

  private getUtcOffsetMinutes(timezone: string): number {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    });
    const offsetPart = formatter
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')?.value;

    if (!offsetPart || offsetPart === 'GMT' || offsetPart === 'UTC') {
      return 0;
    }

    const match = /^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(offsetPart);
    if (!match) {
      return 0;
    }

    const sign = match[1] === '-' ? -1 : 1;
    const hours = Number(match[2]);
    const minutes = Number(match[3] ?? '0');
    return sign * (hours * 60 + minutes);
  }

}

