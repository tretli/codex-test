import { Injectable, signal } from '@angular/core';
import {
  OpeningHoursSchedule,
  OpeningHoursSlot,
  RuleExitType,
  Weekday
} from './opening-hours.model';

@Injectable({ providedIn: 'root' })
export class OpeningHoursService {
  private readonly scheduleSignal = signal<OpeningHoursSchedule>(
    this.createDefaultSchedule()
  );

  readonly schedule = this.scheduleSignal.asReadonly();

  updateSchedule(schedule: OpeningHoursSchedule): void {
    this.scheduleSignal.set(schedule);
  }

  getDaySlots(day: Weekday): OpeningHoursSlot[] {
    const matchingRecords = this.schedule().days.filter((record) =>
      record.days.includes(day)
    );
    return matchingRecords.flatMap((record) => record.slots);
  }

  private createDefaultSchedule(): OpeningHoursSchedule {
    return {
      timezone: 'Europe/London',
      days: [
        {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          slots: [{ opensAt: '09:00', closesAt: '17:00' }],
          openExitType: RuleExitType.Proceed,
          closedExitType: RuleExitType.Reject
        },
        {
          days: ['saturday'],
          slots: [{ opensAt: '10:00', closesAt: '14:00' }],
          openExitType: RuleExitType.Proceed,
          closedExitType: RuleExitType.Reject
        }
      ],
      recurringHolidays: [],
      dateRanges: [],
      singleDates: []
    };
  }
}
