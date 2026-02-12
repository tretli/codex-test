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
}>;

type HolidayFormValue = {
  name: string;
  rule: RecurringHolidayRule;
  month: number | null;
  day: number | null;
  offsetDays: number | null;
  closed: boolean;
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

  readonly weekdays = WEEKDAYS;
  readonly holidayTemplates: ReadonlyArray<HolidayTemplate> = [
    {
      id: 'easter-sunday',
      label: 'Easter Sunday',
      holiday: {
        name: 'Easter Sunday',
        rule: 'easter',
        offsetDays: 0,
        closed: true
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
        closed: true
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
        closed: true
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
    JSON.stringify(this.buildScheduleFromForm(), null, 2)
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

  holidaySummary(holidayForm: HolidayForm): string {
    if (holidayForm.controls.rule.value === 'easter') {
      return 'Easter Sunday';
    }

    const month = holidayForm.controls.month.value ?? 1;
    const day = holidayForm.controls.day.value ?? 1;
    return `${month}/${day}`;
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
      closed: this.fb.nonNullable.control(holiday.closed)
    });
  }

  private normalizeHoliday(holiday: HolidayFormValue): RecurringHoliday {
    if (holiday.rule === 'fixed-date') {
      return {
        name: holiday.name,
        rule: holiday.rule,
        month: holiday.month ?? 1,
        day: holiday.day ?? 1,
        closed: holiday.closed
      };
    }

    return {
      name: holiday.name,
      rule: holiday.rule,
      offsetDays: holiday.offsetDays ?? 0,
      closed: holiday.closed
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
}
