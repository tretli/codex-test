import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const readDtmfFields: ReadonlyArray<FieldSchema> = [
  { key: 'soundFile', label: 'Sound file', kind: 'string' },
  { key: 'variable', label: 'Variable', kind: 'string' },
  { key: 'maxDigits', label: 'Max digits', kind: 'number' },
  { key: 'timeout', label: 'Timeout', kind: 'number' },
  { key: 'acceptableDigits', label: 'Acceptable digits', kind: 'string' },
  { key: 'terminateDigits', label: 'Terminate digits', kind: 'string' },
  { key: 'terminateStartDigits', label: 'Terminate start digits', kind: 'string' },
  { key: 'keepTerminateDigit', label: 'Keep terminate digit', kind: 'boolean' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' },
  { key: 'timeoutModuleId', label: 'Timeout module', kind: 'link' }
];

export const readDtmfInferRemainingFields = false;
