import { FieldKind } from './detail-field-schema.model';

export type ModuleFieldPatchEvent = {
  moduleId: number;
  field: string;
  kind: FieldKind;
  value: unknown;
  source?: 'user' | 'lookup-default';
};
