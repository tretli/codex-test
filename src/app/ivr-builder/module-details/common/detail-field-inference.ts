import { FieldKind, FieldSchema } from './detail-field-schema.model';

const LINK_FIELD_PATTERN = /(moduleid$|^exits\d+$)/i;
const RESERVED_FIELD_KEYS = new Set([
  'id',
  'customerId',
  'locationId',
  'serviceModuleTypeId',
  'name',
  'propertyBase',
  'toServiceModuleCanvasElement',
  'getExitFields'
]);

export function inferModuleFields(
  module: Record<string, unknown>,
  explicitFields: ReadonlyArray<FieldSchema>,
  inferRemainingFields = false
): FieldSchema[] {
  const fields = [...explicitFields];
  if (!inferRemainingFields) {
    return fields;
  }

  const existingKeys = new Set(fields.map((field) => field.key));
  Object.keys(module).forEach((key) => {
    if (existingKeys.has(key) || RESERVED_FIELD_KEYS.has(key)) {
      return;
    }
    const kind = inferFieldKind(key, module[key]);
    if (!kind) {
      return;
    }
    fields.push({
      key,
      label: toFieldLabel(key),
      kind
    });
  });

  return fields;
}

export function inferFieldKind(key: string, value: unknown): FieldKind | null {
  if (LINK_FIELD_PATTERN.test(key)) {
    return 'link';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return 'number';
  }
  if (typeof value === 'string') {
    return 'string';
  }
  return null;
}

export function toFieldLabel(key: string): string {
  const multiSwitchExitMatch = /^exits(\d+)$/i.exec(key);
  if (multiSwitchExitMatch) {
    return `Exit ${multiSwitchExitMatch[1]}`;
  }
  if (/^keyStarModuleId$/i.test(key)) {
    return 'Key *';
  }
  if (/^keyHashModuleId$/i.test(key)) {
    return 'Key #';
  }
  return key
    .replace(/ModuleId$/, ' module')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (text) => text.toUpperCase())
    .trim();
}
