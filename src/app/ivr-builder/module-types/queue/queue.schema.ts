import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const queueFields: ReadonlyArray<FieldSchema> = [
  { key: 'queuePriority', label: 'Queue priority', kind: 'number' },
  { key: 'queueTimeout', label: 'Queue timeout', kind: 'number' },
  { key: 'queueOptions', label: 'Queue options', kind: 'string' },
  { key: 'answer', label: 'Answer', kind: 'boolean' },
  { key: 'extraTime', label: 'Extra time', kind: 'number' },
  { key: 'timeoutModuleId', label: 'Timeout module', kind: 'link' },
  { key: 'joinEmptyModuleId', label: 'Join empty module', kind: 'link' },
  { key: 'leaveEmptyModuleId', label: 'Leave empty module', kind: 'link' },
  { key: 'joinUnavailModuleId', label: 'Join unavailable module', kind: 'link' },
  { key: 'leaveUnavailModuleId', label: 'Leave unavailable module', kind: 'link' },
  { key: 'fullModuleId', label: 'Full module', kind: 'link' },
  { key: 'continueModuleId', label: 'Continue module', kind: 'link' },
  { key: 'surveyModuleId', label: 'Survey module', kind: 'link' }
];
