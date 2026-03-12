import { Injectable } from '@angular/core';
import { TimeRepository } from '../repositories/time.repository';
import { TimeRuleProfileItem, TimezoneItem } from '../contracts/ivr-lookup-contracts';
import { TIME_PROFILE_FIXTURES, TIMEZONE_FIXTURES } from './fixtures/time.fixtures';

@Injectable()
export class TimeMockRepository extends TimeRepository {
  async listTimezones(): Promise<TimezoneItem[]> {
    return TIMEZONE_FIXTURES.map((item) => ({ ...item }));
  }

  async listProfiles(): Promise<TimeRuleProfileItem[]> {
    return TIME_PROFILE_FIXTURES.map((item) => ({ ...item }));
  }
}
