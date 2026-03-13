import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const switchFields: ReadonlyArray<FieldSchema> = [
  { key: 'variable', label: 'Variable', kind: 'string' },
  { key: 'onModuleId', label: 'On module', kind: 'link' },
  { key: 'offModuleId', label: 'Off module', kind: 'link' }
];

export const switchInferRemainingFields = false;
