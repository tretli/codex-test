import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import {
  returningCallerFields,
  returningCallerInferRemainingFields
} from './returning-caller.schema';

@Component({
  selector: 'app-ivr-module-details-returning-caller',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsReturningCallerComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = returningCallerFields;
  readonly inferRemainingFields = returningCallerInferRemainingFields;
}
