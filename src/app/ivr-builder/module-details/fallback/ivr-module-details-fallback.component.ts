import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { FieldKind, FieldSchema } from '../common/detail-field-schema.model';
import { IvrModuleDetailsSchemaEditorComponent } from '../common/ivr-module-details-schema-editor.component';

@Component({
  selector: 'app-ivr-module-details-fallback',
  standalone: true,
  imports: [CommonModule, IvrModuleDetailsSchemaEditorComponent],
  templateUrl: './ivr-module-details-fallback.component.html',
  styleUrl: './ivr-module-details-fallback.component.scss'
})
export class IvrModuleDetailsFallbackComponent {
  @Input({ required: true }) node!: BuilderNode;
  @Input({ required: true }) fields: ReadonlyArray<FieldSchema> = [];
  @Input() moduleTargets: Array<{ id: number; label: string }> = [];
  @Input() warning = '';

  @Output() fieldChange = new EventEmitter<{ field: string; kind: FieldKind; value: unknown }>();
}
