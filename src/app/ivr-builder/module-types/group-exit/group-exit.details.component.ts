import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { groupExitFields, groupExitInferRemainingFields } from './group-exit.schema';

@Component({
  selector: 'app-ivr-module-details-group-exit',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsGroupExitComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = groupExitFields;
  readonly inferRemainingFields = groupExitInferRemainingFields;
}
