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

  readonly form = this.fb.nonNullable.group({
    timezone: ['Europe/London', Validators.required],
    effectiveFrom: [new Date().toISOString().slice(0, 10), Validators.required],
    days: this.fb.array<DayForm>([])
  });

  readonly serializedSchedule = computed(() =>
    JSON.stringify(this.form.getRawValue(), null, 2)
  );

  constructor() {
    this.hydrate(this.service.schedule());
  }

  get dayForms(): FormArray<DayForm> {
    return this.form.controls.days;
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

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const schedule = this.form.getRawValue() as OpeningHoursSchedule;
    this.service.updateSchedule(schedule);
  }

  trackByDay(_index: number, dayForm: DayForm): Weekday {
    return dayForm.controls.day.value;
  }

  private hydrate(schedule: OpeningHoursSchedule): void {
    this.dayForms.clear();
    schedule.days.forEach((day) => this.dayForms.push(this.createDayForm(day)));
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
}
