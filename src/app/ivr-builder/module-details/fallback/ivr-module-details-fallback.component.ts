import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { FieldKind, FieldSchema } from '../ivr-module-detail-schemas';
import { IvrModuleDetailsFieldsComponent } from '../ivr-module-details-fields.component';

@Component({
  selector: 'app-ivr-module-details-fallback',
  standalone: true,
  imports: [CommonModule, IvrModuleDetailsFieldsComponent],
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
