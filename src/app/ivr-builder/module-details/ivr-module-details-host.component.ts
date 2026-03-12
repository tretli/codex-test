import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { BuilderNode } from '../canvas/ivr-canvas.types';
import { IVR_MODULE_REGISTRY } from '../module-definitions/ivr-module-registry';
import { ModuleFieldPatchEvent } from './common/detail-field-patch.model';
import { IvrModuleDetailsDynamicHostComponent } from './dynamic/ivr-module-details-dynamic-host.component';
import { IvrModuleDetailsFallbackComponent } from './fallback/ivr-module-details-fallback.component';
import { FieldKind, FieldSchema, MODULE_TYPE_SCHEMAS } from './ivr-module-detail-schemas';

const LINK_FIELD_PATTERN = /(moduleid$|^exits\d+$)/i;

@Component({
  selector: 'app-ivr-module-details-host',
  standalone: true,
  imports: [
    CommonModule,
    IvrModuleDetailsDynamicHostComponent,
    IvrModuleDetailsFallbackComponent
  ],
  templateUrl: './ivr-module-details-host.component.html',
  styleUrl: './ivr-module-details-host.component.scss'
})
export class IvrModuleDetailsHostComponent {
  @Input() selectedNode: BuilderNode | null = null;
  @Input() nodes: BuilderNode[] = [];
  @Input({ required: true }) moduleTypeLabel!: (serviceModuleTypeId: number) => string;

  @Output() nameChange = new EventEmitter<{ moduleId: number; value: string }>();
  @Output() fieldChange = new EventEmitter<ModuleFieldPatchEvent>();
  @Output() removeModule = new EventEmitter<number>();

  selectedDetailsComponent(): Type<unknown> | null {
    const typeId = this.selectedNode?.module.serviceModuleTypeId;
    if (typeof typeId !== 'number') {
      return null;
    }
    return this.registry.get(typeId)?.details.component ?? null;
  }

  fallbackWarning(): string {
    const typeId = this.selectedNode?.module.serviceModuleTypeId;
    if (typeof typeId !== 'number') {
      return '';
    }
    if (this.registry.get(typeId)) {
      return '';
    }
    return `Unknown module type ${typeId}. Showing fallback editor.`;
  }

  moduleTargets(): Array<{ id: number; label: string }> {
    const selected = this.selectedNode;
    if (!selected) {
      return [];
    }
    return this.nodes
      .filter((node) => node.module.id !== selected.module.id)
      .map((node) => ({
        id: node.module.id,
        label: `${node.module.id} - ${node.module.name || 'Unnamed module'}`
      }));
  }

  fallbackFields(): FieldSchema[] {
    const selected = this.selectedNode;
    if (!selected) {
      return [];
    }
    const schemas: FieldSchema[] = [...(MODULE_TYPE_SCHEMAS[selected.module.serviceModuleTypeId] ?? [])];
    const existingKeys = new Set(schemas.map((schema) => schema.key));
    Object.keys(selected.module).forEach((key) => {
      if (existingKeys.has(key)) {
        return;
      }
      if (LINK_FIELD_PATTERN.test(key)) {
        schemas.push({ key, label: this.toLabel(key), kind: 'link' });
      } else if (typeof selected.module[key] === 'boolean') {
        schemas.push({ key, label: this.toLabel(key), kind: 'boolean' });
      } else if (typeof selected.module[key] === 'number') {
        schemas.push({ key, label: this.toLabel(key), kind: 'number' });
      } else if (typeof selected.module[key] === 'string') {
        schemas.push({ key, label: this.toLabel(key), kind: 'string' });
      }
    });
    return schemas;
  }

  onFieldChange(field: string, kind: FieldKind, value: unknown): void {
    const selected = this.selectedNode;
    if (!selected) {
      return;
    }
    this.fieldChange.emit({ moduleId: selected.module.id, field, kind, value, source: 'user' });
  }

  private toLabel(key: string): string {
    const exitMatch = /^exits(\d+)$/i.exec(key);
    if (exitMatch) {
      return `Exit ${exitMatch[1]}`;
    }
    return key.replace(/ModuleId$/, ' module').replace(/([A-Z])/g, ' $1').replace(/^./, (text) => text.toUpperCase()).trim();
  }

  private readonly registry = IVR_MODULE_REGISTRY;
}
