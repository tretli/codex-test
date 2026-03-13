import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const surveyQuestionFields: ReadonlyArray<FieldSchema> = [
  { key: 'message', label: 'Message', kind: 'string' },
  { key: 'min', label: 'Min', kind: 'number' },
  { key: 'max', label: 'Max', kind: 'number' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const surveyQuestionInferRemainingFields = false;
