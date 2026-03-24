import { Injectable, signal } from '@angular/core';
import {
  DEFAULT_EXIT_OUTCOMES,
  ExitOutcomeDefinition,
  normalizeExitOutcomes,
  normalizeScheduleV2,
  OpeningHoursScheduleV2,
  OpeningHoursSlot,
  ExitOutcome,
  TimeSlotV2,
  Weekday
} from './opening-hours.model';

@Injectable({ providedIn: 'root' })
export class OpeningHoursService {
  private readonly scheduleV2Signal = signal<OpeningHoursScheduleV2>(
    normalizeScheduleV2(this.createDefaultScheduleV2())
  );

  readonly scheduleV2 = this.scheduleV2Signal.asReadonly();

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
    const matchingRules = this.scheduleV2Signal().rules
      .filter(
        (rule) => rule.scope === 'weekly' && (rule.appliesOn.weekdays ?? []).includes(day)
      )
      .sort((a, b) => {
        const priorityA = a.priority ?? 0;
        const priorityB = b.priority ?? 0;
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        if (a.id && b.id) {
          return a.id.localeCompare(b.id);
        }
        return 0;
      });
    return matchingRules.flatMap((rule) => this.toOpeningHoursSlots(rule.slots));
  }

  private createDefaultScheduleV2(): OpeningHoursScheduleV2 {
    return {
      timezone: 'Europe/London',
      exitOutcomes: [...DEFAULT_EXIT_OUTCOMES],
      rules: [
        {
          id: 'weekly-1',
          name: 'Weekdays',
          scope: 'weekly',
          priority: 1,
          appliesOn: {
            weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          },
          slots: [
            {
              start: '09:00',
              end: '17:00',
              action: ExitOutcome.Allow
            }
          ],
          defaultClosed: {
            action: ExitOutcome.Deny
          }
        },
        {
          id: 'weekly-2',
          name: 'Saturday',
          scope: 'weekly',
          priority: 2,
          appliesOn: {
            weekdays: ['saturday']
          },
          slots: [
            {
              start: '10:00',
              end: '14:00',
              action: ExitOutcome.Allow
            }
          ],
          defaultClosed: {
            action: ExitOutcome.Deny
          }
        }
      ],
    };
  }

  private toOpeningHoursSlots(slots: TimeSlotV2[]): OpeningHoursSlot[] {
    return slots.map((slot) => ({
      opensAt: slot.start,
      closesAt: slot.end,
      openExitType: slot.action
    }));
  }
}

