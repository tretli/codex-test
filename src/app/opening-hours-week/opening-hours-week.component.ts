import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ActionV2,
  OpeningHoursSlot,
  RuleV2,
  ExitOutcome,
  toExitOutcome,
  WEEKDAYS,
  Weekday
} from '../opening-hours-admin/opening-hours.model';
import { OpeningHoursService } from '../opening-hours-admin/opening-hours.service';
import {
  getEasterDate,
  getSwedishMidsummerDayDate,
  getSwedishMidsummerEveDate
} from '../opening-hours-admin/opening-hours-date.utils';

type DayView = {
  date: Date;
  isoDate: string;
  label: string;
  weekday: Weekday;
  slots: OpeningHoursSlot[];
  source: string;
  ruleType: 'single-date' | 'recurring' | 'date-range' | 'weekly';
  openExitTypeLabel: string;
  closedExitTypeLabel: string;
  inactiveRules: string[];
};

type MonthDayView = {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  slots: OpeningHoursSlot[];
  source: string;
  ruleType: 'single-date' | 'recurring' | 'date-range' | 'weekly';
  openExitTypeLabel: string;
  closedExitTypeLabel: string;
  inactiveRules: string[];
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

  readonly timezone = computed(() => this.service.scheduleV2().timezone);
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
        source: daily.source,
        ruleType: daily.ruleType,
        openExitTypeLabel: this.getOpenExitTypeSummary(daily.slots),
        closedExitTypeLabel: this.getExitTypeLabel(daily.closedExitType),
        inactiveRules: daily.inactiveRules
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
        source: daily.source,
        ruleType: daily.ruleType,
        openExitTypeLabel: this.getOpenExitTypeSummary(daily.slots),
        closedExitTypeLabel: this.getExitTypeLabel(daily.closedExitType),
        inactiveRules: daily.inactiveRules
      });
    }
    return days;
  });

  readonly monthWeekdayLabels = WEEKDAYS.map((weekday) => weekday.label.slice(0, 3));

  setViewMode(mode: 'week' | 'month'): void {
    this.viewMode.set(mode);
  }

  openWeekForDate(date: Date): void {
    this.weekStart.set(this.startOfWeek(date));
    this.viewMode.set('week');
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

  slotExitTypeLabel(slot: OpeningHoursSlot): string {
    return this.getExitTypeLabel(slot.openExitType);
  }

  private resolveDailySchedule(date: Date): {
    slots: OpeningHoursSlot[];
    source: string;
    ruleType: 'single-date' | 'recurring' | 'date-range' | 'weekly';
    closedExitType: ExitOutcome;
    inactiveRules: string[];
  } {
    const schedule = this.service.scheduleV2();
    const day = this.weekdayFromDate(date);
    const isoDate = this.formatIsoDate(date);
    const sortedRules = [...schedule.rules].sort((a, b) => a.priority - b.priority);
    const matchedRules = sortedRules.filter((rule) =>
      this.ruleMatchesDate(rule, date, isoDate, day)
    );

    if (matchedRules.length === 0) {
      return {
        slots: [],
        source: 'No matching rule',
        ruleType: 'weekly',
        closedExitType: ExitOutcome.Deny,
        inactiveRules: []
      };
    }

    const activeRule = matchedRules[0];
    const activeSlots = this.ruleSlotsToLegacySlots(activeRule);
    return {
      slots: activeSlots,
      source: this.formatRuleSource(activeRule),
      ruleType: activeRule.scope,
      closedExitType: this.actionToExitOutcome(activeRule.defaultClosed.action),
      inactiveRules: matchedRules.slice(1).map((rule) => this.formatRuleSource(rule))
    };
  }

  private getOpenExitTypeSummary(slots: OpeningHoursSlot[]): string {
    if (slots.length === 0) {
      return this.getExitTypeLabel(ExitOutcome.Deny);
    }

    const labels = [
      ...new Set(slots.map((slot) => this.getExitTypeLabel(slot.openExitType)))
    ];
    return labels.length === 1 ? labels[0] : 'Mixed by slot';
  }

  private formatRuleSource(rule: RuleV2): string {
    const prefix: Record<RuleV2['scope'], string> = {
      'single-date': 'Single date',
      recurring: 'Recurring holiday',
      'date-range': 'Date range',
      weekly: 'Weekly schedule'
    };
    return `${prefix[rule.scope]}: ${rule.name}`;
  }

  private actionToExitOutcome(action: ActionV2): ExitOutcome {
    return toExitOutcome(action);
  }

  private ruleSlotsToLegacySlots(rule: RuleV2): OpeningHoursSlot[] {
    return rule.slots.map((slot) => ({
      opensAt: slot.start,
      closesAt: slot.end,
      openExitType: this.actionToExitOutcome(slot.action)
    }));
  }

  private ruleMatchesDate(
    rule: RuleV2,
    date: Date,
    isoDate: string,
    weekday: Weekday
  ): boolean {
    if (rule.scope === 'single-date') {
      return rule.appliesOn.date === isoDate;
    }

    if (rule.scope === 'date-range') {
      if (!rule.appliesOn.dateFrom || !rule.appliesOn.dateTo) {
        return false;
      }
      // Safe with ISO dates (YYYY-MM-DD): lexicographic order matches chronological order.
      const inRange = isoDate >= rule.appliesOn.dateFrom && isoDate <= rule.appliesOn.dateTo;
      if (!inRange) {
        return false;
      }
      if (rule.appliesOn.weekdays && rule.appliesOn.weekdays.length > 0) {
        return rule.appliesOn.weekdays.includes(weekday);
      }
      return true;
    }

    if (rule.scope === 'weekly') {
      return (rule.appliesOn.weekdays ?? []).includes(weekday);
    }

    const recurring = rule.appliesOn.recurring;
    if (!recurring) {
      return false;
    }
    const start = this.recurringStartDate(recurring, date.getFullYear());
    if (!start) {
      return false;
    }
    const lengthDays = Math.max(recurring.lengthDays ?? 1, 1);
    const end = this.addDays(start, lengthDays - 1);
    return date >= this.startOfDay(start) && date <= this.endOfDay(end);
  }

  private recurringStartDate(
    recurring: NonNullable<RuleV2['appliesOn']['recurring']>,
    year: number
  ): Date | null {
    if (recurring.kind === 'fixed-date') {
      if (!recurring.month || !recurring.day) {
        return null;
      }
      return new Date(year, recurring.month - 1, recurring.day);
    }

    if (recurring.kind === 'easter-offset') {
      const easter = getEasterDate(year);
      return this.addDays(easter, recurring.offsetDays ?? 0);
    }

    if (recurring.kind === 'swedish-midsummer-day') {
      return getSwedishMidsummerDayDate(year);
    }

    if (recurring.kind === 'swedish-midsummer-eve') {
      return getSwedishMidsummerEveDate(year);
    }

    return null;
  }

  private getExitTypeLabel(exitType: ExitOutcome): string {
    const labels: Record<ExitOutcome, string> = {
      [ExitOutcome.Allow]: 'Allow',
      [ExitOutcome.AllowWithMessage]: 'Allow with message',
      [ExitOutcome.Defer]: 'Defer',
      [ExitOutcome.Escalate]: 'Escalate',
      [ExitOutcome.Review]: 'Review',
      [ExitOutcome.DenyWithMessage]: 'Deny with message',
      [ExitOutcome.Deny]: 'Deny'
    };
    return labels[exitType];
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

}
