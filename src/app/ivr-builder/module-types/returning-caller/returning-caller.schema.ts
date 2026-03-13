import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const returningCallerFields: ReadonlyArray<FieldSchema> = [
  { key: 'threshold', label: 'Threshold', kind: 'number' },
  { key: 'timeSpan', label: 'Time span', kind: 'number' },
  { key: 'serviceNumberUnique', label: 'Service number unique', kind: 'boolean' },
  { key: 'answeredOnly', label: 'Answered only', kind: 'boolean' },
  { key: 'setSessionFields', label: 'Set session fields', kind: 'boolean' },
  { key: 'aboveThresholdModuleId', label: 'Above threshold module', kind: 'link' },
  { key: 'belowThresholdModuleId', label: 'Below threshold module', kind: 'link' }
];

export const returningCallerInferRemainingFields = false;
