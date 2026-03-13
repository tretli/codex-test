import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { FieldKind, FieldSchema } from './detail-field-schema.model';

@Component({
  selector: 'app-ivr-module-details-fields',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ivr-module-details-fields.component.html',
  styleUrl: './ivr-module-details-fields.component.scss'
})
export class IvrModuleDetailsFieldsComponent {
  @Input({ required: true }) node!: BuilderNode;
  @Input({ required: true }) fields: ReadonlyArray<FieldSchema> = [];
  @Input() moduleTargets: Array<{ id: number; label: string }> = [];

  @Output() fieldChange = new EventEmitter<{ field: string; kind: FieldKind; value: unknown }>();

  fieldStringValue(field: string): string {
    const value = this.node.module[field];
    return typeof value === 'string' ? value : '';
  }

  fieldNumberValue(field: string): number {
    const value = this.node.module[field];
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  fieldBooleanValue(field: string): boolean {
    return Boolean(this.node.module[field]);
  }

  linkFieldValue(field: string): number {
    const raw = this.node.module[field];
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return raw;
    }
    if (typeof raw === 'string') {
      const parsed = Number(raw.trim());
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }
}
