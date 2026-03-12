import { Injectable, signal } from '@angular/core';
import { PromptAssetItem } from '../contracts/ivr-lookup-contracts';
import { toIvrDataError } from '../contracts/ivr-data-errors';
import { PromptRepository } from '../repositories/prompt.repository';
import { LookupFacade, LookupState } from './lookup-facade.state';

@Injectable()
export class PlaySoundDetailsFacade implements LookupFacade<PromptAssetItem> {
  private readonly stateSignal = signal<LookupState<PromptAssetItem>>({
    status: 'idle',
    data: [],
    error: null
  });
  readonly state = this.stateSignal.asReadonly();

  private loaded = false;

  constructor(private readonly repository: PromptRepository) {}

  async ensureLoaded(): Promise<void> {
    if (!this.loaded) {
      await this.reload();
    }
  }

  async reload(): Promise<void> {
    this.stateSignal.update((state) => ({ ...state, status: 'loading', error: null }));
    try {
      const items = await this.repository.listPrompts();
      this.stateSignal.set({ status: 'ready', data: items, error: null });
      this.loaded = true;
    } catch (error) {
      this.stateSignal.update((state) => ({
        status: 'error',
        data: state.data,
        error: toIvrDataError(error, 'Unable to load play-sound prompts')
      }));
    }
  }
}
