import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { routingApiFields, routingApiInferRemainingFields } from './routing-api.schema';

@Component({
  selector: 'app-ivr-module-details-routing-api',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsRoutingApiComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = routingApiFields;
  readonly inferRemainingFields = routingApiInferRemainingFields;
}
