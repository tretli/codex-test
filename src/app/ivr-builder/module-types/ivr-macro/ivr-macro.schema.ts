import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const ivrMacroFields: ReadonlyArray<FieldSchema> = [
  { key: 'macro', label: 'Macro', kind: 'string' },
  { key: 'args', label: 'Args', kind: 'string' },
  { key: 'successModuleId', label: 'Success module', kind: 'link' },
  { key: 'failureModuleId', label: 'Failure module', kind: 'link' }
];

export const ivrMacroInferRemainingFields = false;
