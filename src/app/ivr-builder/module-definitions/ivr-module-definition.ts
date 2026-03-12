import { Type } from '@angular/core';
import { IvrModuleRecord, ServiceModule, ServiceModuleLike } from '../../models/models';

export type IvrModuleCanvasMetadata = {
  label: string;
  color: string;
  creatable: boolean;
  defaultName?: string;
  preferredLinkField?: string;
  createDefaults?: () => Record<string, unknown>;
};

export type IvrModuleModelAdapter = {
  toServiceModule?: (input: Record<string, unknown>) => ServiceModule;
  getExitFields?: (module: ServiceModuleLike) => string[];
  getExitLinks?: (module: ServiceModuleLike) => Array<{ field: string; toId: number }>;
};

export type IvrModuleDetailsMetadata = {
  component: Type<unknown>;
  supportsBackendLookups: boolean;
};

export type IvrModuleDefinition = {
  typeId: number;
  key: string;
  canvas: IvrModuleCanvasMetadata;
  model?: IvrModuleModelAdapter;
  details: IvrModuleDetailsMetadata;
};

export type IvrCreatableModuleDefinition = IvrModuleDefinition & {
  canvas: IvrModuleCanvasMetadata & {
    creatable: true;
    defaultName: string;
    createDefaults: () => Record<string, unknown>;
  };
};

export type IvrUnknownModuleFallback = {
  typeId: number;
  label: string;
  color: string;
  preferredLinkField?: string;
};

export function isCreatableDefinition(definition: IvrModuleDefinition): definition is IvrCreatableModuleDefinition {
  return Boolean(
    definition.canvas.creatable &&
    definition.canvas.defaultName &&
    typeof definition.canvas.createDefaults === 'function'
  );
}

export function sanitizeModuleDefaults(record: IvrModuleRecord): IvrModuleRecord {
  return { ...record };
}
