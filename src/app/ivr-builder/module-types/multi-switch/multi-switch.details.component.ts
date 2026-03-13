import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { multiSwitchFields } from './multi-switch.schema';

@Component({
  selector: 'app-ivr-module-details-multi-switch',
  standalone: true,
  imports: [CommonModule, FormsModule, IvrModuleDetailsSchemaEditorComponent],
  templateUrl: './multi-switch.details.component.html',
  styleUrl: './multi-switch.details.component.scss'
})
export class IvrModuleDetailsMultiSwitchComponent extends IvrModuleDetailsBaseDirective {
  readonly fields = multiSwitchFields;

  exits(): Array<{ id: number; rule: string; nextModuleId: number }> {
    const raw = this.node.module['exits'];
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw as Array<{ id: number; rule: string; nextModuleId: number }>;
  }

  addExit(): void {
    const current = this.exits();
    const nextId = current.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    this.emitFieldChange('exits', 'string', [...current, { id: nextId, rule: '', nextModuleId: 0 }]);
  }

  removeExit(index: number): void {
    const current = this.exits();
    this.emitFieldChange(
      'exits',
      'string',
      current.filter((_item, itemIndex) => itemIndex !== index)
    );
  }

  updateExitRule(index: number, value: string): void {
    this.emitFieldChange(`exits[${index}].rule`, 'string', value);
  }

  updateExitNextModuleId(index: number, value: unknown): void {
    this.emitFieldChange(`exits[${index}].nextModuleId`, 'link', value);
  }

  trackByExitId(index: number, exit: { id: number; rule: string; nextModuleId: number }): number | string {
    return exit.id || index;
  }
}
