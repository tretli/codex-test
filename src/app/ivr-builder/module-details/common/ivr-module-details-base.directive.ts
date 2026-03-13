import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { FieldKind } from './detail-field-schema.model';

export type DetailFieldChangeEvent = { field: string; kind: FieldKind; value: unknown };

@Directive()
export abstract class IvrModuleDetailsBaseDirective {
  @Input({ required: true }) node!: BuilderNode;
  @Input() moduleTargets: Array<{ id: number; label: string }> = [];
  @Output() fieldChange = new EventEmitter<DetailFieldChangeEvent>();

  protected emitFieldChange(field: string, kind: FieldKind, value: unknown): void {
    this.fieldChange.emit({ field, kind, value });
  }
}
