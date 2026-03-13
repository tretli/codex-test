import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const surveyStartFields: ReadonlyArray<FieldSchema> = [
  { key: 'number', label: 'Number', kind: 'string' },
  { key: 'force', label: 'Force', kind: 'boolean' },
  { key: 'surveyModule', label: 'Survey module', kind: 'boolean' },
  { key: 'quarantineTime', label: 'Quarantine time', kind: 'number' },
  { key: 'languageId', label: 'Language ID', kind: 'number' },
  { key: 'allowedRegions', label: 'Allowed regions', kind: 'string' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const surveyStartInferRemainingFields = false;
