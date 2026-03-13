import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const macroFields: ReadonlyArray<FieldSchema> = [
  { key: 'macro', label: 'Macro', kind: 'string' },
  { key: 'macroArgs', label: 'Macro args', kind: 'string' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const macroInferRemainingFields = false;
