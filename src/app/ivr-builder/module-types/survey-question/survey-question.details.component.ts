import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import {
  surveyQuestionFields,
  surveyQuestionInferRemainingFields
} from './survey-question.schema';

@Component({
  selector: 'app-ivr-module-details-survey-question',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsSurveyQuestionComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = surveyQuestionFields;
  readonly inferRemainingFields = surveyQuestionInferRemainingFields;
}
