import { Component } from '@angular/core';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import {
  contactLookupFields,
  contactLookupInferRemainingFields
} from './contact-lookup.schema';

@Component({
  selector: 'app-ivr-module-details-contact-lookup',
  standalone: true,
  imports: [IvrModuleDetailsSchemaEditorComponent],
  template: `<app-ivr-module-details-schema-editor [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" [inferRemainingFields]="inferRemainingFields" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-schema-editor>`
})
export class IvrModuleDetailsContactLookupComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = contactLookupFields;
  readonly inferRemainingFields = contactLookupInferRemainingFields;
}
