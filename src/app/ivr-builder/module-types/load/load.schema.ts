import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const loadFields: ReadonlyArray<FieldSchema> = [
  { key: 'aCount', label: 'A count', kind: 'number' },
  { key: 'bCount', label: 'B count', kind: 'number' },
  { key: 'aModuleId', label: 'A module', kind: 'link' },
  { key: 'bModuleId', label: 'B module', kind: 'link' }
];

export const loadInferRemainingFields = false;
