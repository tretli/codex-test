import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const loopFields: ReadonlyArray<FieldSchema> = [
  { key: 'count', label: 'Count', kind: 'number' },
  { key: 'loopModuleId', label: 'Loop module', kind: 'link' },
  { key: 'outModuleId', label: 'Out module', kind: 'link' }
];

export const loopInferRemainingFields = false;
