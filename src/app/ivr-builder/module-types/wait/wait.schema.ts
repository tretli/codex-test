import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const waitFields: ReadonlyArray<FieldSchema> = [
  { key: 'wait', label: 'Wait (ms)', kind: 'number' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const waitInferRemainingFields = false;
