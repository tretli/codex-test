import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import {
  numberListMatchFields,
  numberListMatchInferRemainingFields
} from './number-list-match.schema';

@Component({
  selector: 'app-ivr-module-details-number-list-match',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsNumberListMatchComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = numberListMatchFields;
  readonly inferRemainingFields = numberListMatchInferRemainingFields;
}
