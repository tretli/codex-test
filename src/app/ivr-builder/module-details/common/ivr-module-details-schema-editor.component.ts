import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { inferModuleFields } from './detail-field-inference';
import { FieldKind, FieldSchema } from './detail-field-schema.model';
import { IvrModuleDetailsFieldsComponent } from './ivr-module-details-fields.component';

@Component({
  selector: 'app-ivr-module-details-schema-editor',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  templateUrl: './ivr-module-details-schema-editor.component.html',
  styleUrl: './ivr-module-details-schema-editor.component.scss'
})
export class IvrModuleDetailsSchemaEditorComponent {
  @Input({ required: true }) node!: BuilderNode;
  @Input({ required: true }) fields: ReadonlyArray<FieldSchema> = [];
  @Input() moduleTargets: Array<{ id: number; label: string }> = [];
  @Input() inferRemainingFields = false;

  @Output() fieldChange = new EventEmitter<{ field: string; kind: FieldKind; value: unknown }>();

  resolvedFields(): ReadonlyArray<FieldSchema> {
    if (!this.node) {
      return [...this.fields];
    }
    return inferModuleFields(this.node.module, this.fields, this.inferRemainingFields);
  }
}
