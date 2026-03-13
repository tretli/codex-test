import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const setVarFields: ReadonlyArray<FieldSchema> = [
  { key: 'variable', label: 'Variable', kind: 'string' },
  { key: 'value', label: 'Value', kind: 'string' },
  { key: 'permanent', label: 'Permanent', kind: 'boolean' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const setVarInferRemainingFields = false;
