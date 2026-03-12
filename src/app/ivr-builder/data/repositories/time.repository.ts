import { TimeRuleProfileItem, TimezoneItem } from '../contracts/ivr-lookup-contracts';

export abstract class TimeRepository {
  abstract listTimezones(): Promise<TimezoneItem[]>;
  abstract listProfiles(): Promise<TimeRuleProfileItem[]>;
}
