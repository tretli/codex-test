import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const randomFields: ReadonlyArray<FieldSchema> = [
  { key: 'variable', label: 'Variable', kind: 'string' },
  { key: 'percent', label: 'Percent', kind: 'number' },
  { key: 'aModuleId', label: 'A module', kind: 'link' },
  { key: 'bModuleId', label: 'B module', kind: 'link' }
];

export const randomInferRemainingFields = false;
