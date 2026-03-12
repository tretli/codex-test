import { FieldKind } from '../ivr-module-detail-schemas';

export type ModuleFieldPatchEvent = {
  moduleId: number;
  field: string;
  kind: FieldKind;
  value: unknown;
  source?: 'user' | 'lookup-default';
};
