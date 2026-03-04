import { Component, Directive, EventEmitter, Input, Output } from '@angular/core';
import { CallModuleType } from '../../models/models';
import { BuilderNode } from '../canvas/ivr-canvas.types';
import { FieldKind, FieldSchema, MODULE_TYPE_SCHEMAS } from './ivr-module-detail-schemas';
import { IvrModuleDetailsFieldsComponent } from './ivr-module-details-fields.component';

type FieldChangeEvent = { field: string; kind: FieldKind; value: unknown };

@Directive()
abstract class BaseTypeDetailsComponent {
  @Input({ required: true }) node!: BuilderNode;
  @Input() moduleTargets: Array<{ id: number; label: string }> = [];
  @Output() fieldChange = new EventEmitter<FieldChangeEvent>();
  protected fieldsFor(type: CallModuleType): ReadonlyArray<FieldSchema> {
    return MODULE_TYPE_SCHEMAS[type] ?? [];
  }
}

@Component({
  selector: 'app-ivr-module-details-hangup',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsHangupComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.Hangup);
}

@Component({
  selector: 'app-ivr-module-details-info',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsInfoComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.Info);
}

@Component({
  selector: 'app-ivr-module-details-time',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsTimeComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.Time);
}

@Component({
  selector: 'app-ivr-module-details-queue',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsQueueComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.Queue);
}

@Component({
  selector: 'app-ivr-module-details-number-list-match',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsNumberListMatchComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.NumberListMatch);
}

@Component({
  selector: 'app-ivr-module-details-macro',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsMacroComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.Macro);
}

@Component({
  selector: 'app-ivr-module-details-switch',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsSwitchComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.Switch);
}

@Component({
  selector: 'app-ivr-module-details-wait',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsWaitComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.Wait);
}

@Component({
  selector: 'app-ivr-module-details-set-var',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsSetVarComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.SetVar);
}

@Component({
  selector: 'app-ivr-module-details-group',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsGroupComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.Group);
}

@Component({
  selector: 'app-ivr-module-details-read-dtmf',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsReadDtmfComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.ReadDtmf);
}

@Component({
  selector: 'app-ivr-module-details-multi-switch',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsMultiSwitchComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.MultiSwitch);
}

@Component({
  selector: 'app-ivr-module-details-advanced-menu',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsAdvancedMenuComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.AdvancedMenu);
}

@Component({
  selector: 'app-ivr-module-details-session-fields',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsSessionFieldsComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.SessionFields);
}

@Component({
  selector: 'app-ivr-module-details-contact-lookup',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsContactLookupComponent extends BaseTypeDetailsComponent {
  readonly fields = this.fieldsFor(CallModuleType.ContactLookup);
}

@Component({
  selector: 'app-ivr-module-details-generic',
  standalone: true,
  imports: [IvrModuleDetailsFieldsComponent],
  template: `<app-ivr-module-details-fields [node]="node" [fields]="fields" [moduleTargets]="moduleTargets" (fieldChange)="fieldChange.emit($event)"></app-ivr-module-details-fields>`
})
export class IvrModuleDetailsGenericComponent extends BaseTypeDetailsComponent {
  @Input() fields: ReadonlyArray<FieldSchema> = [];
}
