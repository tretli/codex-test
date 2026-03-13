import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { voicemailFields, voicemailInferRemainingFields } from './voicemail.schema';

@Component({
  selector: 'app-ivr-module-details-voicemail',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsVoicemailComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = voicemailFields;
  readonly inferRemainingFields = voicemailInferRemainingFields;
}
