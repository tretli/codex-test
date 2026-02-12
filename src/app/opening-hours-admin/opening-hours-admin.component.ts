import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  DayOpeningHours,
  OpeningHoursSchedule,
  RecurringHoliday,
  RecurringHolidayRule,
  WEEKDAYS,
  Weekday
} from './opening-hours.model';
import { OpeningHoursService } from './opening-hours.service';

type SlotForm = FormGroup<{
  opensAt: import('@angular/forms').FormControl<string>;
  closesAt: import('@angular/forms').FormControl<string>;
}>;

type DayForm = FormGroup<{
  day: import('@angular/forms').FormControl<Weekday>;
  enabled: import('@angular/forms').FormControl<boolean>;
  slots: FormArray<SlotForm>;
}>;

type HolidayForm = FormGroup<{
  name: import('@angular/forms').FormControl<string>;
  rule: import('@angular/forms').FormControl<RecurringHolidayRule>;
  month: import('@angular/forms').FormControl<number | null>;
  day: import('@angular/forms').FormControl<number | null>;
  offsetDays: import('@angular/forms').FormControl<number | null>;
  closed: import('@angular/forms').FormControl<boolean>;
  slots: FormArray<SlotForm>;
}>;

type HolidayFormValue = {
  name: string;
  rule: RecurringHolidayRule;
  month: number | null;
  day: number | null;
  offsetDays: number | null;
  closed: boolean;
  slots: { opensAt: string; closesAt: string }[];
};

type HolidayTemplate = {
  id: string;
  label: string;
  holiday: RecurringHoliday;
};

@Component({
  selector: 'app-opening-hours-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './opening-hours-admin.component.html',
  styleUrl: './opening-hours-admin.component.scss'
})
export class OpeningHoursAdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(OpeningHoursService);

  readonly currentYear = new Date().getFullYear();
  readonly weekdays = WEEKDAYS;
  readonly timeOptions = this.buildTimeOptions(15);
  readonly holidayTemplates: ReadonlyArray<HolidayTemplate> = [
    {
      id: 'easter-sunday',
      label: 'Easter Sunday',
      holiday: {
        name: 'Easter Sunday',
        rule: 'easter',
        offsetDays: 0,
        closed: true,
        slots: []
      }
    },
    {
      id: 'christmas-day',
      label: 'Christmas Day',
      holiday: {
        name: 'Christmas Day',
        rule: 'fixed-date',
        month: 12,
        day: 25,
        closed: true,
        slots: []
      }
    },
    {
      id: 'national-holiday',
      label: 'National Holiday (July 4)',
      holiday: {
        name: 'National Holiday',
        rule: 'fixed-date',
        month: 7,
        day: 4,
        closed: true,
        slots: []
      }
    },
    {
      id: 'swedish-midsummer-day',
      label: 'Midsummer Day (Sweden)',
      holiday: {
        name: 'Midsummer Day',
        rule: 'swedish-midsummer-day',
        closed: true,
        slots: []
      }
    }
  ];
  readonly defaultHolidayTemplateId = this.holidayTemplates[0].id;

  readonly form = this.fb.nonNullable.group({
    timezone: ['Europe/London', Validators.required],
    effectiveFrom: [new Date().toISOString().slice(0, 10), Validators.required],
    days: this.fb.array<DayForm>([]),
    recurringHolidays: this.fb.array<HolidayForm>([])
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
  }

  removeHoliday(index: number): void {
    this.holidayForms.removeAt(index);
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

  holidaySummary(holidayForm: HolidayForm): string {
    const dateLabel = this.getHolidayExampleDateForYear(
      {
        rule: holidayForm.controls.rule.value,
        month: holidayForm.controls.month.value ?? undefined,
        day: holidayForm.controls.day.value ?? undefined,
        offsetDays: holidayForm.controls.offsetDays.value ?? undefined
      },
      this.currentYear
    );

    return dateLabel ? `Example ${this.currentYear}: ${dateLabel}` : 'No date example';
  }

  holidayTemplateLabel(template: HolidayTemplate): string {
    const dateLabel = this.getHolidayExampleDateForYear(
      template.holiday,
      this.currentYear
    );

    return dateLabel
      ? `${template.label} (${this.currentYear}: ${dateLabel})`
      : template.label;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.service.updateSchedule(this.buildScheduleFromForm());
  }

  trackByDay(_index: number, dayForm: DayForm): Weekday {
    return dayForm.controls.day.value;
  }

  private hydrate(schedule: OpeningHoursSchedule): void {
    this.dayForms.clear();
    this.holidayForms.clear();
    schedule.days.forEach((day) => this.dayForms.push(this.createDayForm(day)));
    schedule.recurringHolidays.forEach((holiday) =>
      this.holidayForms.push(this.createHolidayForm(holiday))
    );
    this.form.patchValue({
      timezone: schedule.timezone,
      effectiveFrom: schedule.effectiveFrom
    });
  }

  private createDayForm(day: DayOpeningHours): DayForm {
    return this.fb.nonNullable.group({
      day: [day.day],
      enabled: [day.enabled],
      slots: this.fb.array(day.slots.map((slot) => this.createSlotForm(slot.opensAt, slot.closesAt)))
    });
  }

  private createSlotForm(opensAt: string, closesAt: string): SlotForm {
    return this.fb.nonNullable.group({
      opensAt: [opensAt, Validators.required],
      closesAt: [closesAt, Validators.required]
    });
  }

  private createHolidayForm(holiday: RecurringHoliday): HolidayForm {
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
      closed: this.fb.nonNullable.control(holiday.closed),
      slots: this.fb.array(
        holiday.slots.map((slot) => this.createSlotForm(slot.opensAt, slot.closesAt))
      )
    });
  }

  private normalizeHoliday(holiday: HolidayFormValue): RecurringHoliday {
    if (holiday.rule === 'fixed-date') {
      return {
        name: holiday.name,
        rule: holiday.rule,
        month: holiday.month ?? 1,
        day: holiday.day ?? 1,
        closed: holiday.closed,
        slots: holiday.closed ? [] : holiday.slots
      };
    }

    if (holiday.rule === 'easter') {
      return {
        name: holiday.name,
        rule: holiday.rule,
        offsetDays: holiday.offsetDays ?? 0,
        closed: holiday.closed,
        slots: holiday.closed ? [] : holiday.slots
      };
    }

    return {
      name: holiday.name,
      rule: holiday.rule,
      closed: holiday.closed,
      slots: holiday.closed ? [] : holiday.slots
    };
  }

  private buildScheduleFromForm(): OpeningHoursSchedule {
    const raw = this.form.getRawValue();
    return {
      timezone: raw.timezone,
      effectiveFrom: raw.effectiveFrom,
      days: raw.days,
      recurringHolidays: raw.recurringHolidays.map((holiday) =>
        this.normalizeHoliday(holiday)
      )
    };
  }

  private buildTimeOptions(stepMinutes: number): string[] {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour += 1) {
      for (let minute = 0; minute < 60; minute += stepMinutes) {
        const hh = String(hour).padStart(2, '0');
        const mm = String(minute).padStart(2, '0');
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  }

  private getHolidayExampleDateForYear(
    holiday: Pick<RecurringHoliday, 'rule' | 'month' | 'day' | 'offsetDays'>,
    year: number
  ): string | null {
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
    }

    return date ? this.formatDate(date) : null;
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
