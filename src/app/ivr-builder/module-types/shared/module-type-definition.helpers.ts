import { Type } from '@angular/core';
import { IvrModuleModelAdapter, IvrModuleDefinition } from '../../module-definitions/ivr-module-definition';

type CreateModuleDefinitionOptions = {
  typeId: number;
  key: string;
  component: Type<unknown>;
  label?: string;
  color?: string;
  creatable?: boolean;
  defaultName?: string;
  preferredLinkField?: string;
  createDefaults?: () => Record<string, unknown>;
  model?: IvrModuleModelAdapter;
  supportsBackendLookups?: boolean;
};

export const DEFAULT_MODULE_COLOR = '#475569';

export function createModuleDefinition(options: CreateModuleDefinitionOptions): IvrModuleDefinition {
  const {
    typeId,
    key,
    component,
    label = toModuleLabel(key),
    color = DEFAULT_MODULE_COLOR,
    creatable = false,
    defaultName,
    preferredLinkField,
    createDefaults,
    model,
    supportsBackendLookups = false
  } = options;

  return {
    typeId,
    key,
    canvas: {
      label,
      color,
      creatable,
      ...(defaultName ? { defaultName } : {}),
      ...(preferredLinkField ? { preferredLinkField } : {}),
      ...(createDefaults ? { createDefaults } : {})
    },
    ...(model ? { model } : {}),
    details: {
      component,
      supportsBackendLookups
    }
  };
}

function toModuleLabel(key: string): string {
  return key
    .split('-')
    .filter((part) => part)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}
