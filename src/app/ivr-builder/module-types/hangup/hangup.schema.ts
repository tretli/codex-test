import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const hangupFields: ReadonlyArray<FieldSchema> = [
  { key: 'cause', label: 'Cause', kind: 'string' }
];

export const hangupInferRemainingFields = false;
