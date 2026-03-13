import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { hangupFields, hangupInferRemainingFields } from './hangup.schema';

@Component({
  selector: 'app-ivr-module-details-hangup',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsHangupComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = hangupFields;
  readonly inferRemainingFields = hangupInferRemainingFields;
}
