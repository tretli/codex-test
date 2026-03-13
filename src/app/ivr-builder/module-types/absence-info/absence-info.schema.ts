import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const absenceInfoFields: ReadonlyArray<FieldSchema> = [
  { key: 'number', label: 'Number', kind: 'string' },
  { key: 'variable', label: 'Variable', kind: 'string' },
  { key: 'timezone', label: 'Timezone', kind: 'string' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const absenceInfoInferRemainingFields = false;
