import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { setVarFields, setVarInferRemainingFields } from './set-var.schema';

@Component({
  selector: 'app-ivr-module-details-set-var',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsSetVarComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = setVarFields;
  readonly inferRemainingFields = setVarInferRemainingFields;
}
