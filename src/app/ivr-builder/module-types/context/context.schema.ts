import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const contextFields: ReadonlyArray<FieldSchema> = [
  { key: 'context', label: 'Context', kind: 'string' }
];

export const contextInferRemainingFields = false;
