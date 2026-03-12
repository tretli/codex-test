import { Injectable } from '@angular/core';
import { QUEUE_FIXTURES } from './fixtures/queue.fixtures';
import { QueueRepository } from '../repositories/queue.repository';
import { QueueLookupItem } from '../contracts/ivr-lookup-contracts';

@Injectable()
export class QueueMockRepository extends QueueRepository {
  async listQueues(): Promise<QueueLookupItem[]> {
    return QUEUE_FIXTURES.map((item) => ({ ...item }));
  }
}
