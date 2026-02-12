import { Injectable, signal } from '@angular/core';
import {
  DayOpeningHours,
  OpeningHoursSchedule,
  WEEKDAYS,
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

  getDay(day: Weekday): DayOpeningHours | undefined {
    return this.schedule().days.find((d) => d.day === day);
  }

  private createDefaultSchedule(): OpeningHoursSchedule {
    return {
      timezone: 'Europe/London',
      effectiveFrom: new Date().toISOString().slice(0, 10),
      days: WEEKDAYS.map(({ key }) => ({
        day: key,
        enabled: key !== 'sunday',
        slots: key === 'sunday' ? [] : [{ opensAt: '09:00', closesAt: '17:00' }]
      })),
      recurringHolidays: []
    };
  }
}
