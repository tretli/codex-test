import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { absenceInfoFields, absenceInfoInferRemainingFields } from './absence-info.schema';

@Component({
  selector: 'app-ivr-module-details-absence-info',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsAbsenceInfoComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = absenceInfoFields;
  readonly inferRemainingFields = absenceInfoInferRemainingFields;
}
