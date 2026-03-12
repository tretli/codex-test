import { Injectable } from '@angular/core';
import { TimeRepository } from '../repositories/time.repository';
import { TimeRuleProfileItem, TimezoneItem } from '../contracts/ivr-lookup-contracts';
import { IvrApiClient } from './ivr-api-client';

@Injectable()
export class TimeHttpRepository extends TimeRepository {
  constructor(private readonly apiClient: IvrApiClient) {
    super();
  }

  listTimezones(): Promise<TimezoneItem[]> {
    return this.apiClient.get<TimezoneItem[]>('/api/ivr/timezones');
  }

  listProfiles(): Promise<TimeRuleProfileItem[]> {
    return this.apiClient.get<TimeRuleProfileItem[]>('/api/ivr/time-profiles');
  }
}
