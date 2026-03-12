import { Provider, inject } from '@angular/core';
import { IvrApiClient } from '../http/ivr-api-client';
import { PromptHttpRepository } from '../http/prompt.http.repository';
import { QueueHttpRepository } from '../http/queue.http.repository';
import { TimeHttpRepository } from '../http/time.http.repository';
import { PromptMockRepository } from '../mock/prompt.mock.repository';
import { QueueMockRepository } from '../mock/queue.mock.repository';
import { TimeMockRepository } from '../mock/time.mock.repository';
import { PromptRepository } from '../repositories/prompt.repository';
import { QueueRepository } from '../repositories/queue.repository';
import { TimeRepository } from '../repositories/time.repository';
import { IVR_DATA_MODE, IvrDataMode } from './ivr-data.tokens';

export const IVR_DATA_PROVIDERS: Provider[] = [
  { provide: IVR_DATA_MODE, useValue: 'mock' as IvrDataMode },
  IvrApiClient,
  QueueMockRepository,
  PromptMockRepository,
  TimeMockRepository,
  QueueHttpRepository,
  PromptHttpRepository,
  TimeHttpRepository,
  {
    provide: QueueRepository,
    useFactory: () => {
      const mode = inject(IVR_DATA_MODE);
      return mode === 'http' ? inject(QueueHttpRepository) : inject(QueueMockRepository);
    }
  },
  {
    provide: PromptRepository,
    useFactory: () => {
      const mode = inject(IVR_DATA_MODE);
      return mode === 'http' ? inject(PromptHttpRepository) : inject(PromptMockRepository);
    }
  },
  {
    provide: TimeRepository,
    useFactory: () => {
      const mode = inject(IVR_DATA_MODE);
      return mode === 'http' ? inject(TimeHttpRepository) : inject(TimeMockRepository);
    }
  }
];
