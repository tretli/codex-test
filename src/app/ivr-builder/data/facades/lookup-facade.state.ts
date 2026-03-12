import { Signal } from '@angular/core';
import { IvrDataError } from '../contracts/ivr-data-errors';

export type LookupStateStatus = 'idle' | 'loading' | 'ready' | 'error';

export type LookupState<TItem> = {
  status: LookupStateStatus;
  data: TItem[];
  error: IvrDataError | null;
};

export type LookupFacade<TItem> = {
  readonly state: Signal<LookupState<TItem>>;
  ensureLoaded(): Promise<void>;
  reload(): Promise<void>;
};
