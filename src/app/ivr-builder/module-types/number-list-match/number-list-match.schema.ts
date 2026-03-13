import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const numberListMatchFields: ReadonlyArray<FieldSchema> = [
  { key: 'numberListId', label: 'Number list ID', kind: 'number' },
  { key: 'matchModuleId', label: 'Match module', kind: 'link' },
  { key: 'noMatchModuleId', label: 'No match module', kind: 'link' }
];

export const numberListMatchInferRemainingFields = false;
