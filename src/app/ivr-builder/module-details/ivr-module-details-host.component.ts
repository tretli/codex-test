import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Type } from '@angular/core';
import { BuilderNode } from '../canvas/ivr-canvas.types';
import { AdvancedMenuDetailsFacade } from '../data/facades/advanced-menu-details.facade';
import { PlaySoundDetailsFacade } from '../data/facades/play-sound-details.facade';
import { QueueDetailsFacade } from '../data/facades/queue-details.facade';
import { TimeControlDetailsFacade } from '../data/facades/time-control-details.facade';
import { IVR_DATA_PROVIDERS } from '../data/providers/ivr-data.providers';
import { IVR_MODULE_REGISTRY } from '../module-definitions/ivr-module-registry';
import { ModuleFieldPatchEvent } from './common/detail-field-patch.model';
import { FieldKind, FieldSchema } from './common/detail-field-schema.model';
import { IvrModuleDetailsDynamicHostComponent } from './dynamic/ivr-module-details-dynamic-host.component';
import { IvrModuleDetailsFallbackComponent } from './fallback/ivr-module-details-fallback.component';

@Component({
  selector: 'app-ivr-module-details-host',
  standalone: true,
  imports: [
    CommonModule,
    IvrModuleDetailsDynamicHostComponent,
    IvrModuleDetailsFallbackComponent
  ],
  providers: [
    ...IVR_DATA_PROVIDERS,
    PlaySoundDetailsFacade,
    QueueDetailsFacade,
    TimeControlDetailsFacade,
    AdvancedMenuDetailsFacade
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
    return [];
  }

  onFieldChange(field: string, kind: FieldKind, value: unknown): void {
    const selected = this.selectedNode;
    if (!selected) {
      return;
    }
    this.fieldChange.emit({ moduleId: selected.module.id, field, kind, value, source: 'user' });
  }
  private readonly registry = IVR_MODULE_REGISTRY;
}
