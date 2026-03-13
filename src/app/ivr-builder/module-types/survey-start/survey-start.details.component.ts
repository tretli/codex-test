import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { surveyStartFields, surveyStartInferRemainingFields } from './survey-start.schema';

@Component({
  selector: 'app-ivr-module-details-survey-start',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsSurveyStartComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = surveyStartFields;
  readonly inferRemainingFields = surveyStartInferRemainingFields;
}
