import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { conferenceFields, conferenceInferRemainingFields } from './conference.schema';

@Component({
  selector: 'app-ivr-module-details-conference',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsConferenceComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = conferenceFields;
  readonly inferRemainingFields = conferenceInferRemainingFields;
}
