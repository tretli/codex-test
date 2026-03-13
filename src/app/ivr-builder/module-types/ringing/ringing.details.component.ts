import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { ringingFields, ringingInferRemainingFields } from './ringing.schema';

@Component({
  selector: 'app-ivr-module-details-ringing',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsRingingComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = ringingFields;
  readonly inferRemainingFields = ringingInferRemainingFields;
}
