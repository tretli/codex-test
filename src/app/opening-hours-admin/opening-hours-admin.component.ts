import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ExitOutcomeId,
  OpeningHoursScheduleV2,
  RecurringHoliday,
  RuleV2,
  ExitOutcome,
  WeeklyOpeningHoursRecord,
  WEEKDAYS,
  Weekday
} from './opening-hours.model';
import { OpeningHoursService } from './opening-hours.service';
import { getEasterDate } from './opening-hours-date.utils';
import { getDateForSupportedRRule } from './opening-hours-rrule.utils';
import {
  dateRangeOverlapValidator,
  holidayFormValidator,
  slotFormValidator,
  weeklyRecordValidator,
  weekdaysOverlapValidator
} from './opening-hours.validators';
import {
  DayForm,
  ExitTypeOption,
  HolidayForm,
  HolidayFormValue,
  HolidayTemplate,
  SlotForm,
  TimezoneOption
} from './opening-hours-admin.types';
import { createDefaultHolidayTemplates } from './opening-hours-admin.holiday-templates';
import {
  mapRecurringToV2,
  mapRuleToHoliday,
  mapSlotsFromV2,
  mapSlotsToV2
} from './opening-hours-admin.mappers';

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
  readonly exitTypeOptions = computed<ReadonlyArray<ExitTypeOption>>(() =>
    this.service.scheduleV2().exitOutcomes.map((outcome) => ({
      value: outcome.id,
      label: outcome.name,
      color: outcome.color
    }))
  );
  readonly timezoneOptions = this.buildTimezoneOptions();
  readonly openTimeOptions = this.buildTimeOptions(15, false);
  readonly closeTimeOptions = this.buildTimeOptions(15, true);
  readonly holidayTemplates: ReadonlyArray<HolidayTemplate> =
    [...createDefaultHolidayTemplates()].sort((a, b) =>
      this.compareHolidaysByDate(a.holiday, b.holiday)
    );
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
  readonly serializedScheduleV2 = computed(() =>
    JSON.stringify(this.service.scheduleV2(), null, 2)
  );

  constructor() {
    this.hydrate(this.service.scheduleV2());
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
        name: `Weekly rule ${this.dayForms.length + 1}`,
        days: [],
        slots: [
          {
            opensAt: '09:00',
            closesAt: '17:00',
            openExitType: ExitOutcome.Allow
          }
        ],
        closedExitType: ExitOutcome.Deny
      })
    );
  }

  removeDayRecord(dayIndex: number): void {
    this.dayForms.removeAt(dayIndex);
  }

  addSlot(dayIndex: number): void {
    this.slotForms(dayIndex).push(
      this.createSlotForm('09:00', '17:00', ExitOutcome.Allow)
    );
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
    this.holidaySlotForms(holidayIndex).push(
      this.createSlotForm('09:00', '17:00', ExitOutcome.Allow)
    );
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
        rrule: holidayForm.controls.rrule.value ?? undefined,
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

    this.service.updateScheduleV2(this.buildScheduleFromForm());
  }

  trackByDay(_index: number, dayForm: DayForm): string {
    return (
      dayForm.controls.name.value ||
      dayForm.controls.days.value.join('|') ||
      `record-${_index}`
    );
  }

  private hydrate(schedule: OpeningHoursScheduleV2): void {
    this.dayForms.clear();
    this.holidayForms.clear();
    const sortedRules = [...schedule.rules].sort((a, b) => a.priority - b.priority);
    sortedRules.forEach((rule, index) => {
      if (rule.scope === 'weekly') {
        this.dayForms.push(
          this.createDayForm({
            name: rule.name || `Weekly ${index + 1}`,
            days: rule.appliesOn.weekdays ?? [],
            slots: mapSlotsFromV2(rule.slots),
            closedExitType: rule.defaultClosed.action
          })
        );
        return;
      }

      const holiday = mapRuleToHoliday(
        rule,
        (rangeStart, rangeEnd) => this.calculateDateRangeLength(rangeStart, rangeEnd)
      );
      if (holiday) {
        this.holidayForms.push(this.createHolidayForm(holiday));
      }
    });
    this.form.patchValue({
      timezone: schedule.timezone
    });
  }

  private createDayForm(day: WeeklyOpeningHoursRecord): DayForm {
    return this.fb.nonNullable.group({
      name: [day.name ?? 'Weekly rule'],
      days: [day.days],
      slots: this.fb.array(
        day.slots.map((slot) =>
          this.createSlotForm(
            slot.opensAt,
            slot.closesAt,
            slot.openExitType ?? ExitOutcome.Allow
          )
        )
      ),
      closedExitType: [day.closedExitType]
    }, { validators: weeklyRecordValidator() });
  }

  private createSlotForm(
    opensAt: string,
    closesAt: string,
    openExitType: ExitOutcomeId
  ): SlotForm {
    return this.fb.nonNullable.group({
      opensAt: [opensAt, Validators.required],
      closesAt: [closesAt, Validators.required],
      openExitType: [openExitType, Validators.required]
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
      rrule: this.fb.control(holiday.rrule ?? null),
      rangeStart: this.fb.control(rangeStartValue),
      rangeEnd: this.fb.control(rangeEndValue),
      singleDate: this.fb.control(singleDateValue),
      weekdays: this.fb.nonNullable.control(holiday.weekdays ?? []),
      lengthDays: this.fb.nonNullable.control(holiday.lengthDays, [
        Validators.min(1)
      ]),
      closed: this.fb.nonNullable.control(holiday.closed),
      slots: this.fb.array(
        holiday.slots.map((slot) =>
          this.createSlotForm(
            slot.opensAt,
            slot.closesAt,
            slot.openExitType ?? ExitOutcome.Allow
          )
        )
      ),
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
        closedExitType: holiday.closedExitType
      };
    }

    if (holiday.rule === 'rrule') {
      return {
        name: holiday.name,
        rule: holiday.rule,
        rrule: holiday.rrule ?? '',
        lengthDays: holiday.lengthDays,
        closed: holiday.closed,
        slots: holiday.closed ? [] : holiday.slots,
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
        closedExitType: holiday.closedExitType
      };
    }

    return {
      name: holiday.name,
      rule: holiday.rule,
      lengthDays: holiday.lengthDays,
      closed: holiday.closed,
      slots: holiday.closed ? [] : holiday.slots,
      closedExitType: holiday.closedExitType
    };
  }

  private buildScheduleFromForm(): OpeningHoursScheduleV2 {
    const raw = this.form.getRawValue();
    const normalizedHolidays = raw.recurringHolidays.map((holiday) =>
      this.normalizeHoliday(holiday)
    );
    const rules: RuleV2[] = [];
    let priority = 1;

    normalizedHolidays
      .filter((holiday) => holiday.rule === 'single-date')
      .forEach((holiday, index) => {
        rules.push({
          id: `single-date-${index + 1}`,
          name: holiday.name,
          scope: 'single-date',
          priority: priority++,
          appliesOn: {
            date: holiday.singleDate ?? ''
          },
          slots: mapSlotsToV2(holiday.slots),
          defaultClosed: {
            action: holiday.closedExitType
          }
        });
      });

    normalizedHolidays
      .filter(
        (holiday) => holiday.rule !== 'single-date' && holiday.rule !== 'date-range'
      )
      .forEach((holiday, index) => {
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
            action: holiday.closedExitType
          }
        });
      });

    normalizedHolidays
      .filter((holiday) => holiday.rule === 'date-range')
      .forEach((holiday, index) => {
        rules.push({
          id: `date-range-${index + 1}`,
          name: holiday.name,
          scope: 'date-range',
          priority: priority++,
          appliesOn: {
            dateFrom: holiday.rangeStart ?? '',
            dateTo: holiday.rangeEnd ?? '',
            weekdays: holiday.weekdays ?? []
          },
          slots: mapSlotsToV2(holiday.slots),
          defaultClosed: {
            action: holiday.closedExitType
          }
        });
      });

    raw.days.forEach((day, index) => {
      rules.push({
        id: `weekly-${index + 1}`,
        name: day.name || `Weekly ${index + 1}`,
        scope: 'weekly',
        priority: priority++,
        appliesOn: {
          weekdays: day.days
        },
        slots: day.slots.map((slot) => ({
          start: slot.opensAt,
          end: slot.closesAt,
          action: slot.openExitType
        })),
        defaultClosed: {
          action: day.closedExitType
        }
      });
    });

    return {
      timezone: raw.timezone,
      exitOutcomes: this.service.scheduleV2().exitOutcomes,
      rules
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
      'rule' | 'month' | 'day' | 'offsetDays' | 'rrule' | 'rangeStart' | 'singleDate'
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
      date = getEasterDate(year);
      const offsetDays = holiday.offsetDays ?? 0;
      date.setDate(date.getDate() + offsetDays);
    } else if (holiday.rule === 'rrule') {
      date = getDateForSupportedRRule(holiday.rrule, year);
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
    const sortedControls = [...this.holidayForms.controls].sort((aForm, bForm) => {
      const aHoliday = this.normalizeHoliday(aForm.getRawValue());
      const bHoliday = this.normalizeHoliday(bForm.getRawValue());
      return this.compareHolidaysByDate(aHoliday, bHoliday);
    });

    this.holidayForms.clear();
    sortedControls.forEach(control => this.holidayForms.push(control));
    this.holidayForms.updateValueAndValidity();
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

