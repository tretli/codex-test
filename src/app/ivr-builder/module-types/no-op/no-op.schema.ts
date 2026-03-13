import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const noOpFields: ReadonlyArray<FieldSchema> = [
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const noOpInferRemainingFields = false;
