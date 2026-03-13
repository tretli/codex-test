import { TestBed } from '@angular/core/testing';
import { IvrModuleRecord, toIvrModuleRecord } from '../../../models/models';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { QueueDetailsFacade } from '../../data/facades/queue-details.facade';
import { QueueMockRepository } from '../../data/mock/queue.mock.repository';
import { QueueRepository } from '../../data/repositories/queue.repository';
import { IvrModuleDetailsQueueComponent } from './queue.details.component';

function buildNode(module: IvrModuleRecord): BuilderNode {
  return {
    module,
    x: 0,
    y: 0,
    linkField: 'continueModuleId'
  };
}

describe('IvrModuleDetailsQueueComponent', () => {
  it('loads queue options and emits queue ID patches', async () => {
    await TestBed.configureTestingModule({
      imports: [IvrModuleDetailsQueueComponent],
      providers: [
        QueueDetailsFacade,
        QueueMockRepository,
        { provide: QueueRepository, useExisting: QueueMockRepository }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(IvrModuleDetailsQueueComponent);
    fixture.componentRef.setInput(
      'node',
      buildNode(
        toIvrModuleRecord({
          id: 7,
          serviceModuleTypeId: 7,
          name: 'Queue',
          queueId: 0,
          continueModuleId: 0
        }) as IvrModuleRecord
      )
    );

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Support');

    let emitted: { field: string; kind: string; value: unknown } | undefined;
    fixture.componentInstance.fieldChange.subscribe((event) => {
      emitted = event;
    });

    fixture.componentInstance.updateQueueSelection(2);

    expect(emitted).toEqual({
      field: 'queueId',
      kind: 'number',
      value: 2
    });
  });
});
