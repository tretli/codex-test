import { Injectable, signal } from '@angular/core';
import { QueueLookupItem } from '../contracts/ivr-lookup-contracts';
import { toIvrDataError } from '../contracts/ivr-data-errors';
import { QueueRepository } from '../repositories/queue.repository';
import { LookupFacade, LookupState } from './lookup-facade.state';

@Injectable()
export class QueueDetailsFacade implements LookupFacade<QueueLookupItem> {
  private readonly stateSignal = signal<LookupState<QueueLookupItem>>({
    status: 'idle',
    data: [],
    error: null
  });
  readonly state = this.stateSignal.asReadonly();

  private loaded = false;

  constructor(private readonly repository: QueueRepository) {}

  async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      await this.reload();
    }
  }

  async reload(): Promise<void> {
    this.stateSignal.update((state) => ({ ...state, status: 'loading', error: null }));
    try {
      const items = await this.repository.listQueues();
      this.stateSignal.set({ status: 'ready', data: items, error: null });
      this.loaded = true;
    } catch (error) {
      this.stateSignal.update((state) => ({
        status: 'error',
        data: state.data,
        error: toIvrDataError(error, 'Unable to load queues')
      }));
    }
  }
}
