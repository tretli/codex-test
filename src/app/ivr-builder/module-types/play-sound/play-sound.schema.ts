import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const playSoundFields: ReadonlyArray<FieldSchema> = [
  { key: 'answer', label: 'Answer', kind: 'boolean' },
  { key: 'background', label: 'Background', kind: 'boolean' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];
