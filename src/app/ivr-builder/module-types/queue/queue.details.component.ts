import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QueueDetailsFacade } from '../../data/facades/queue-details.facade';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { queueFields } from './queue.schema';

@Component({
  selector: 'app-ivr-module-details-queue',
  standalone: true,
  imports: [CommonModule, FormsModule, IvrModuleDetailsSchemaEditorComponent],
  templateUrl: './queue.details.component.html',
  styleUrl: './queue.details.component.scss'
})
export class IvrModuleDetailsQueueComponent extends IvrModuleDetailsBaseDirective implements OnInit {
  readonly fields = queueFields;
  readonly state = inject(QueueDetailsFacade).state;

  private readonly facade = inject(QueueDetailsFacade);

  ngOnInit(): void {
    void this.facade.ensureLoaded();
  }

  queueIdValue(): number {
    const value = this.node.module['queueId'];
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  selectedQueueId(): number | '' {
    const queueId = this.queueIdValue();
    if (queueId === 0) {
      return 0;
    }
    return this.state().data.some((queue) => queue.id === queueId) ? queueId : '';
  }

  updateQueueSelection(value: number | ''): void {
    if (value === '') {
      return;
    }
    this.emitFieldChange('queueId', 'number', value);
  }

  updateQueueId(value: unknown): void {
    this.emitFieldChange('queueId', 'number', value);
  }
}
