import { Injectable, computed, signal } from '@angular/core';
import {
  DEFAULT_EXIT_OUTCOMES,
  ExitOutcomeDefinition,
  fromOpeningHoursScheduleV2,
  normalizeExitOutcomes,
  normalizeScheduleV2,
  OpeningHoursSchedule,
  OpeningHoursScheduleV2,
  OpeningHoursSlot,
  ExitOutcome,
  toOpeningHoursScheduleV2,
  Weekday
} from './opening-hours.model';

@Injectable({ providedIn: 'root' })
export class OpeningHoursService {
  private readonly scheduleV2Signal = signal<OpeningHoursScheduleV2>(
    normalizeScheduleV2(
      toOpeningHoursScheduleV2(this.createDefaultSchedule(), [...DEFAULT_EXIT_OUTCOMES])
    )
  );

  readonly scheduleV2 = this.scheduleV2Signal.asReadonly();
  readonly schedule = computed(() => fromOpeningHoursScheduleV2(this.scheduleV2Signal()));

  updateSchedule(schedule: OpeningHoursSchedule): void {
    const currentOutcomes = this.scheduleV2Signal().exitOutcomes;
    this.scheduleV2Signal.set(
      normalizeScheduleV2(toOpeningHoursScheduleV2(schedule, currentOutcomes))
    );
  }

  updateScheduleV2(schedule: OpeningHoursScheduleV2): void {
    this.scheduleV2Signal.set(normalizeScheduleV2(schedule));
  }

  updateExitOutcomes(exitOutcomes: ExitOutcomeDefinition[]): void {
    this.scheduleV2Signal.update((current) => ({
      ...current,
      exitOutcomes: normalizeExitOutcomes(exitOutcomes)
    }));
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
          name: 'Weekdays',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          slots: [
            {
              opensAt: '09:00',
              closesAt: '17:00',
              openExitType: ExitOutcome.Allow
            }
          ],
          closedExitType: ExitOutcome.Deny
        },
        {
          name: 'Saturday',
          days: ['saturday'],
          slots: [
            {
              opensAt: '10:00',
              closesAt: '14:00',
              openExitType: ExitOutcome.Allow
            }
          ],
          closedExitType: ExitOutcome.Deny
        }
      ],
      recurringHolidays: [],
      dateRanges: [],
      singleDates: []
    };
  }
}

