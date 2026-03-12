import { QueueLookupItem } from '../contracts/ivr-lookup-contracts';

export abstract class QueueRepository {
  abstract listQueues(): Promise<QueueLookupItem[]>;
}
