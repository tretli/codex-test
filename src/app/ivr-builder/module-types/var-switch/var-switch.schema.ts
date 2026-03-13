import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const varSwitchFields: ReadonlyArray<FieldSchema> = [
  { key: 'operator', label: 'Operator', kind: 'number' },
  { key: 'value', label: 'Value', kind: 'string' },
  { key: 'variable', label: 'Variable', kind: 'string' },
  { key: 'trueModuleId', label: 'True module', kind: 'link' },
  { key: 'falseModuleId', label: 'False module', kind: 'link' }
];

export const varSwitchInferRemainingFields = false;
