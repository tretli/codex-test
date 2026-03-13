import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { ivrMacroFields, ivrMacroInferRemainingFields } from './ivr-macro.schema';

@Component({
  selector: 'app-ivr-module-details-ivr-macro',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsIvrMacroComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = ivrMacroFields;
  readonly inferRemainingFields = ivrMacroInferRemainingFields;
}
