import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const dialFields: ReadonlyArray<FieldSchema> = [
  { key: 'callerIdNum', label: 'Caller ID number', kind: 'string' },
  { key: 'callerIdName', label: 'Caller ID name', kind: 'string' },
  { key: 'diversionNum', label: 'Diversion number', kind: 'string' },
  { key: 'number', label: 'Number', kind: 'string' },
  { key: 'timeout', label: 'Timeout', kind: 'number' },
  { key: 'dialOptions', label: 'Dial options', kind: 'string' },
  { key: 'successModuleId', label: 'Success module', kind: 'link' },
  { key: 'failureModuleId', label: 'Failure module', kind: 'link' }
];

export const dialInferRemainingFields = false;
