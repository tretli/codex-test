import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const routingApiFields: ReadonlyArray<FieldSchema> = [
  { key: 'url', label: 'URL', kind: 'string' },
  { key: 'apiVersion', label: 'API version', kind: 'string' },
  { key: 'authToken', label: 'Auth token', kind: 'string' },
  { key: 'successModuleId', label: 'Success module', kind: 'link' },
  { key: 'failureModuleId', label: 'Failure module', kind: 'link' }
];

export const routingApiInferRemainingFields = false;
