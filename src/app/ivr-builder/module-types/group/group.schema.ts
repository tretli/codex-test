import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const groupFields: ReadonlyArray<FieldSchema> = [
  { key: 'targetServiceGroupId', label: 'Target service group ID', kind: 'number' }
];

export const groupInferRemainingFields = false;
