import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const advancedMenuFields: ReadonlyArray<FieldSchema> = [
  { key: 'answer', label: 'Answer', kind: 'boolean' },
  { key: 'background', label: 'Background', kind: 'boolean' },
  { key: 'interval', label: 'Interval', kind: 'number' },
  { key: 'count', label: 'Count', kind: 'number' },
  { key: 'surveyModule', label: 'Survey module', kind: 'boolean' },
  { key: 'key0ModuleId', label: 'Key 0', kind: 'link' },
  { key: 'key1ModuleId', label: 'Key 1', kind: 'link' },
  { key: 'key2ModuleId', label: 'Key 2', kind: 'link' },
  { key: 'key3ModuleId', label: 'Key 3', kind: 'link' },
  { key: 'key4ModuleId', label: 'Key 4', kind: 'link' },
  { key: 'key5ModuleId', label: 'Key 5', kind: 'link' },
  { key: 'key6ModuleId', label: 'Key 6', kind: 'link' },
  { key: 'key7ModuleId', label: 'Key 7', kind: 'link' },
  { key: 'key8ModuleId', label: 'Key 8', kind: 'link' },
  { key: 'key9ModuleId', label: 'Key 9', kind: 'link' },
  { key: 'keyStarModuleId', label: 'Key *', kind: 'link' },
  { key: 'keyHashModuleId', label: 'Key #', kind: 'link' },
  { key: 'loopExhaustedModuleId', label: 'Loop exhausted', kind: 'link' }
];
