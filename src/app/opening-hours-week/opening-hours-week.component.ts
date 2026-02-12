import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  OpeningHoursSlot,
  RecurringHoliday,
  WEEKDAYS,
  Weekday
} from '../opening-hours-admin/opening-hours.model';
import { OpeningHoursService } from '../opening-hours-admin/opening-hours.service';

type DayView = {
  date: Date;
  isoDate: string;
  label: string;
  weekday: Weekday;
  slots: OpeningHoursSlot[];
  source: string;
};

type MonthDayView = {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  slots: OpeningHoursSlot[];
  source: string;
};

@Component({
  selector: 'app-opening-hours-week',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './opening-hours-week.component.html',
  styleUrl: './opening-hours-week.component.scss'
})
export class OpeningHoursWeekComponent {
  private readonly service = inject(OpeningHoursService);
  private readonly weekStart = signal(this.startOfWeek(new Date()));
  private readonly monthAnchor = signal(this.startOfMonth(new Date()));
  readonly viewMode = signal<'week' | 'month'>('week');

  readonly timezone = computed(() => this.service.schedule().timezone);
  readonly weekDays = computed<DayView[]>(() => {
    const start = this.weekStart();
    const days: DayView[] = [];
    for (let i = 0; i < 7; i += 1) {
      const date = this.addDays(start, i);
      const daily = this.resolveDailySchedule(date);
      days.push({
        date,
        isoDate: this.formatIsoDate(date),
        label: this.formatDisplayDate(date),
        weekday: this.weekdayFromDate(date),
        slots: daily.slots,
        source: daily.source
      });
    }
    return days;
  });

  readonly weekRangeLabel = computed(() => {
    const start = this.weekStart();
    const end = this.addDays(start, 6);
    return `${this.formatDisplayDate(start)} - ${this.formatDisplayDate(end)}`;
  });

  readonly monthLabel = computed(() =>
    this.monthAnchor().toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric'
    })
  );

  readonly monthDays = computed<MonthDayView[]>(() => {
    const anchor = this.monthAnchor();
    const firstOfMonth = this.startOfMonth(anchor);
    const gridStart = this.startOfWeek(firstOfMonth);
    const days: MonthDayView[] = [];
    for (let i = 0; i < 42; i += 1) {
      const date = this.addDays(gridStart, i);
      const daily = this.resolveDailySchedule(date);
      days.push({
        date,
        dayNumber: date.getDate(),
        inCurrentMonth: date.getMonth() === anchor.getMonth(),
        slots: daily.slots,
        source: daily.source
      });
    }
    return days;
  });

  readonly monthWeekdayLabels = WEEKDAYS.map((weekday) => weekday.label.slice(0, 3));

  setViewMode(mode: 'week' | 'month'): void {
    this.viewMode.set(mode);
  }

  previousWeek(): void {
    this.weekStart.update((value) => this.addDays(value, -7));
  }

  nextWeek(): void {
    this.weekStart.update((value) => this.addDays(value, 7));
  }

  currentWeek(): void {
    this.weekStart.set(this.startOfWeek(new Date()));
  }

  previousMonth(): void {
    this.monthAnchor.update(
      (value) => new Date(value.getFullYear(), value.getMonth() - 1, 1)
    );
  }

  nextMonth(): void {
    this.monthAnchor.update(
      (value) => new Date(value.getFullYear(), value.getMonth() + 1, 1)
    );
  }

  currentMonth(): void {
    this.monthAnchor.set(this.startOfMonth(new Date()));
  }

  slotStartPercent(slot: OpeningHoursSlot): number {
    const start = this.parseTimeToMinutes(slot.opensAt) ?? 0;
    return (start / (24 * 60)) * 100;
  }

  slotWidthPercent(slot: OpeningHoursSlot): number {
    const start = this.parseTimeToMinutes(slot.opensAt) ?? 0;
    const end = this.parseTimeToMinutes(slot.closesAt) ?? start;
    const width = Math.max(0, end - start);
    return (width / (24 * 60)) * 100;
  }

  private resolveDailySchedule(date: Date): { slots: OpeningHoursSlot[]; source: string } {
    const schedule = this.service.schedule();
    const day = this.weekdayFromDate(date);
    const isoDate = this.formatIsoDate(date);

    const dateRangeMatches = schedule.dateRanges.filter(
      (range) =>
        isoDate >= range.rangeStart &&
        isoDate <= range.rangeEnd &&
        range.weekdays.includes(day)
    );
    if (dateRangeMatches.length > 0) {
      return this.resolveHolidaySlots(dateRangeMatches, 'Date range');
    }

    const recurringMatches = schedule.recurringHolidays.filter((holiday) =>
      this.isRecurringHolidayMatch(holiday, date)
    );
    if (recurringMatches.length > 0) {
      return this.resolveHolidaySlots(recurringMatches, 'Recurring holiday');
    }

    const baseSlots = schedule.days
      .filter((record) => record.days.includes(day))
      .flatMap((record) => record.slots);
    return { slots: baseSlots, source: 'Weekly schedule' };
  }

  private resolveHolidaySlots(
    holidays: RecurringHoliday[],
    sourcePrefix: string
  ): { slots: OpeningHoursSlot[]; source: string } {
    const openSlots = holidays.filter((holiday) => !holiday.closed).flatMap((h) => h.slots);
    if (openSlots.length > 0) {
      return {
        slots: openSlots,
        source: `${sourcePrefix}: ${holidays.map((holiday) => holiday.name).join(', ')}`
      };
    }
    return {
      slots: [],
      source: `${sourcePrefix}: ${holidays.map((holiday) => holiday.name).join(', ')} (closed)`
    };
  }

  private isRecurringHolidayMatch(holiday: RecurringHoliday, date: Date): boolean {
    const start = this.holidayStartDate(holiday, date.getFullYear());
    if (!start) {
      return false;
    }
    const end = this.addDays(start, Math.max(holiday.lengthDays, 1) - 1);
    return date >= this.startOfDay(start) && date <= this.endOfDay(end);
  }

  private holidayStartDate(holiday: RecurringHoliday, year: number): Date | null {
    if (holiday.rule === 'fixed-date') {
      if (!holiday.month || !holiday.day) {
        return null;
      }
      return new Date(year, holiday.month - 1, holiday.day);
    }

    if (holiday.rule === 'easter') {
      const easter = this.getEasterDate(year);
      const offset = holiday.offsetDays ?? 0;
      return this.addDays(easter, offset);
    }

    if (holiday.rule === 'swedish-midsummer-day') {
      return this.getSwedishMidsummerDayDate(year);
    }

    if (holiday.rule === 'swedish-midsummer-eve') {
      return this.getSwedishMidsummerEveDate(year);
    }

    return null;
  }

  private weekdayFromDate(date: Date): Weekday {
    const jsDay = date.getDay();
    const map: Weekday[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ];
    return map[jsDay];
  }

  private startOfWeek(date: Date): Date {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    return this.startOfDay(this.addDays(date, diffToMonday));
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private endOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private formatIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDisplayDate(date: Date): string {
    const weekday = WEEKDAYS.find((item) => item.key === this.weekdayFromDate(date))?.label ?? '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${weekday} ${dd}.${mm}.${date.getFullYear()}`;
  }

  private parseTimeToMinutes(value: string): number | null {
    if (value === '24:00') {
      return 24 * 60;
    }
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
    if (!match) {
      return null;
    }
    return Number(match[1]) * 60 + Number(match[2]);
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
}
