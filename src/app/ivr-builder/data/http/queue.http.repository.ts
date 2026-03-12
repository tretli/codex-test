import { Injectable } from '@angular/core';
import { QueueLookupItem } from '../contracts/ivr-lookup-contracts';
import { QueueRepository } from '../repositories/queue.repository';
import { IvrApiClient } from './ivr-api-client';

@Injectable()
export class QueueHttpRepository extends QueueRepository {
  constructor(private readonly apiClient: IvrApiClient) {
    super();
  }

  listQueues(): Promise<QueueLookupItem[]> {
    return this.apiClient.get<QueueLookupItem[]>('/api/ivr/queues');
  }
}
