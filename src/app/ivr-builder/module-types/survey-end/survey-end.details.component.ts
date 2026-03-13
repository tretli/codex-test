import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { surveyEndFields, surveyEndInferRemainingFields } from './survey-end.schema';

@Component({
  selector: 'app-ivr-module-details-survey-end',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsSurveyEndComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = surveyEndFields;
  readonly inferRemainingFields = surveyEndInferRemainingFields;
}
