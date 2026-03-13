import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const multiSwitchFields: ReadonlyArray<FieldSchema> = [
  { key: 'guid', label: 'Guid', kind: 'string' },
  { key: 'variable', label: 'Variable', kind: 'string' },
  { key: 'noMatchModuleId', label: 'No match module', kind: 'link' }
];
