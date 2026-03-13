import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const voicemailFields: ReadonlyArray<FieldSchema> = [
  { key: 'voicemailId', label: 'Voicemail ID', kind: 'number' },
  { key: 'voicemailOptions', label: 'Voicemail options', kind: 'string' }
];

export const voicemailInferRemainingFields = false;
