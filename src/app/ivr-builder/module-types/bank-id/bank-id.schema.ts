import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const bankIdFields: ReadonlyArray<FieldSchema> = [
  { key: 'successModuleId', label: 'Success module', kind: 'link' },
  { key: 'failureModuleId', label: 'Failure module', kind: 'link' }
];

export const bankIdInferRemainingFields = false;
