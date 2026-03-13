import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const ringingFields: ReadonlyArray<FieldSchema> = [
  { key: 'mode', label: 'Mode', kind: 'string' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const ringingInferRemainingFields = false;
