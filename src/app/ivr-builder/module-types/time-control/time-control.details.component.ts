import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeControlDetailsFacade } from '../../data/facades/time-control-details.facade';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { timeControlFields } from './time-control.schema';

@Component({
  selector: 'app-ivr-module-details-time-control',
  standalone: true,
  imports: [CommonModule, FormsModule, IvrModuleDetailsSchemaEditorComponent],
  templateUrl: './time-control.details.component.html',
  styleUrl: './time-control.details.component.scss'
})
export class IvrModuleDetailsTimeControlComponent extends IvrModuleDetailsBaseDirective implements OnInit {
  readonly fields = timeControlFields;
  readonly state = inject(TimeControlDetailsFacade).state;

  private readonly facade = inject(TimeControlDetailsFacade);

  ngOnInit(): void {
    void this.facade.ensureLoaded();
  }

  timeZoneValue(): string {
    const value = this.node.module['timeZone'];
    return typeof value === 'string' ? value : '';
  }

  selectedTimezoneId(): string {
    const timeZone = this.timeZoneValue();
    return this.state().data.timezones.some((item) => item.id === timeZone) ? timeZone : '';
  }

  updateTimezoneSelection(value: string): void {
    this.emitFieldChange('timeZone', 'string', value);
  }

  updateTimeZone(value: string): void {
    this.emitFieldChange('timeZone', 'string', value);
  }

  hasTimeRule(): boolean {
    return Object.prototype.hasOwnProperty.call(this.node.module, 'timeRule');
  }

  timeRuleValue(): number | '' {
    const value = this.node.module['timeRule'];
    return typeof value === 'number' && Number.isFinite(value) ? value : '';
  }

  selectedTimeRuleId(): number | '' {
    const timeRule = this.timeRuleValue();
    if (timeRule === '') {
      return '';
    }
    return this.state().data.profiles.some((profile) => profile.id === timeRule) ? timeRule : '';
  }

  updateTimeRule(value: number | ''): void {
    this.emitFieldChange('timeRule', 'number', value === '' ? 0 : value);
  }
}
