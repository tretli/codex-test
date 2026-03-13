export type FieldKind = 'string' | 'number' | 'boolean' | 'link';

export type FieldSchema = {
  key: string;
  label: string;
  kind: FieldKind;
};
