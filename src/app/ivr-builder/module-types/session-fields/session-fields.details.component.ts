import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import {
  sessionFieldsFields,
  sessionFieldsInferRemainingFields
} from './session-fields.schema';

@Component({
  selector: 'app-ivr-module-details-session-fields',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsSessionFieldsComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = sessionFieldsFields;
  readonly inferRemainingFields = sessionFieldsInferRemainingFields;
}
