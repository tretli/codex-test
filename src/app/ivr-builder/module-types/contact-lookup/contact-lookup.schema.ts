import { FieldSchema } from '../../module-details/common/detail-field-schema.model';

export const contactLookupFields: ReadonlyArray<FieldSchema> = [
  { key: 'internalLookup', label: 'Internal lookup', kind: 'boolean' },
  { key: 'yellowPagesLookup', label: 'Yellow pages lookup', kind: 'boolean' },
  { key: 'nextModuleId', label: 'Next module', kind: 'link' }
];

export const contactLookupInferRemainingFields = false;
