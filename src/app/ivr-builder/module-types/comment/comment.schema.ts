import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const commentFields: ReadonlyArray<FieldSchema> = [
  { key: 'comment', label: 'Comment', kind: 'string' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const commentInferRemainingFields = false;
