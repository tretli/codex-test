import {
  IvrModuleRecord,
  ServiceModuleLike,
  getServiceModuleExitFields,
  getServiceModuleExitLinks,
  toIvrModuleRecord
} from '../../models/models';
import {
  IvrCreatableModuleDefinition,
  IvrModuleDefinition,
  IvrUnknownModuleFallback,
  isCreatableDefinition
} from './ivr-module-definition';
import { IVR_MODULE_DEFINITIONS } from './ivr-module-definitions.providers';

const DEFAULT_UNKNOWN_COLOR = '#475569';

export class IvrModuleRegistry {
  private readonly definitionsByTypeId = new Map<number, IvrModuleDefinition>();

  constructor(definitions: ReadonlyArray<IvrModuleDefinition>) {
    definitions.forEach((definition) => {
      if (this.definitionsByTypeId.has(definition.typeId)) {
        throw new Error(`Duplicate module definition for type ${definition.typeId}`);
      }
      this.definitionsByTypeId.set(definition.typeId, definition);
    });
  }

  get(typeId: number): IvrModuleDefinition | undefined {
    return this.definitionsByTypeId.get(typeId);
  }

  getCanvasMeta(typeId: number): IvrUnknownModuleFallback {
    const definition = this.get(typeId);
    if (!definition) {
      return {
        typeId,
        label: `Type ${typeId}`,
        color: DEFAULT_UNKNOWN_COLOR
      };
    }
    return {
      typeId,
      label: definition.canvas.label,
      color: definition.canvas.color,
      preferredLinkField: definition.canvas.preferredLinkField
    };
  }

  getCreatableDefinitions(): IvrCreatableModuleDefinition[] {
    return Array.from(this.definitionsByTypeId.values()).filter(isCreatableDefinition);
  }

  toIvrModuleRecord(input: unknown): IvrModuleRecord | null {
    return toIvrModuleRecord(input);
  }

  createModuleRecord(typeId: number, id: number, order: number): IvrModuleRecord | null {
    const definition = this.get(typeId);
    if (!definition || !isCreatableDefinition(definition)) {
      return null;
    }
    const payload = {
      id,
      serviceModuleTypeId: typeId,
      order,
      name: `${definition.canvas.defaultName} ${id}`,
      ...definition.canvas.createDefaults()
    };
    return this.toIvrModuleRecord(payload);
  }

  getExitFields(module: ServiceModuleLike): string[] {
    const typeId = typeof module.serviceModuleTypeId === 'number' ? module.serviceModuleTypeId : NaN;
    const definition = this.get(typeId);
    if (definition?.model?.getExitFields) {
      const fields = definition.model.getExitFields(module);
      return [...new Set(fields)];
    }
    return getServiceModuleExitFields(module);
  }

  getExitLinks(module: ServiceModuleLike): Array<{ field: string; toId: number }> {
    const typeId = typeof module.serviceModuleTypeId === 'number' ? module.serviceModuleTypeId : NaN;
    const definition = this.get(typeId);
    if (definition?.model?.getExitLinks) {
      const links = definition.model.getExitLinks(module);
      const unique = new Map<string, { field: string; toId: number }>();
      links.forEach((link) => {
        if (typeof link.field !== 'string') {
          return;
        }
        const toId = Number(link.toId);
        if (!Number.isFinite(toId) || toId <= 0) {
          return;
        }
        const key = `${link.field}:${toId}`;
        unique.set(key, { field: link.field, toId });
      });
      return Array.from(unique.values());
    }
    return getServiceModuleExitLinks(module);
  }

  getPreferredLinkField(module: ServiceModuleLike): string {
    const meta = this.getCanvasMeta(module.serviceModuleTypeId);
    if (meta.preferredLinkField) {
      return meta.preferredLinkField;
    }
    return this.getExitFields(module)[0] ?? '';
  }
}

export const IVR_MODULE_REGISTRY = new IvrModuleRegistry(IVR_MODULE_DEFINITIONS);
