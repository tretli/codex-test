import { Injectable, signal } from '@angular/core';
import { IvrDataError, toIvrDataError } from '../contracts/ivr-data-errors';
import { TimeRuleProfileItem, TimezoneItem } from '../contracts/ivr-lookup-contracts';
import { TimeRepository } from '../repositories/time.repository';

export type TimeControlLookupData = {
  timezones: TimezoneItem[];
  profiles: TimeRuleProfileItem[];
};

export type TimeControlLookupState = {
  status: 'idle' | 'loading' | 'ready' | 'error';
  data: TimeControlLookupData;
  error: IvrDataError | null;
};

@Injectable()
export class TimeControlDetailsFacade {
  private readonly stateSignal = signal<TimeControlLookupState>({
    status: 'idle',
    data: { timezones: [], profiles: [] },
    error: null
  });
  readonly state = this.stateSignal.asReadonly();

  private loaded = false;

  constructor(private readonly repository: TimeRepository) {}

  async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      await this.reload();
    }
  }

  async reload(): Promise<void> {
    this.stateSignal.update((state) => ({ ...state, status: 'loading', error: null }));
    try {
      const [timezones, profiles] = await Promise.all([
        this.repository.listTimezones(),
        this.repository.listProfiles()
      ]);
      this.stateSignal.set({
        status: 'ready',
        data: { timezones, profiles },
        error: null
      });
      this.loaded = true;
    } catch (error) {
      this.stateSignal.update((state) => ({
        status: 'error',
        data: state.data,
        error: toIvrDataError(error, 'Unable to load time-control lookups')
      }));
    }
  }
}
