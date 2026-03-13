import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { bankIdFields, bankIdInferRemainingFields } from './bank-id.schema';

@Component({
  selector: 'app-ivr-module-details-bank-id',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsBankIdComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = bankIdFields;
  readonly inferRemainingFields = bankIdInferRemainingFields;
}
