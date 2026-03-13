import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { groupGotoFields, groupGotoInferRemainingFields } from './group-goto.schema';

@Component({
  selector: 'app-ivr-module-details-group-goto',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsGroupGotoComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = groupGotoFields;
  readonly inferRemainingFields = groupGotoInferRemainingFields;
}
