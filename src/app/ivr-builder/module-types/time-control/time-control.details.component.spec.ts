import { TestBed } from '@angular/core/testing';
import { IvrModuleRecord, toIvrModuleRecord } from '../../../models/models';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { TimeControlDetailsFacade } from '../../data/facades/time-control-details.facade';
import { TimeMockRepository } from '../../data/mock/time.mock.repository';
import { TimeRepository } from '../../data/repositories/time.repository';
import { IvrModuleDetailsTimeControlComponent } from './time-control.details.component';

function buildNode(module: IvrModuleRecord): BuilderNode {
  return {
    module,
    x: 0,
    y: 0,
    linkField: 'closedModuleId'
  };
}

describe('IvrModuleDetailsTimeControlComponent', () => {
  it('loads timezone and profile options and preserves timeRule editing', async () => {
    await TestBed.configureTestingModule({
      imports: [IvrModuleDetailsTimeControlComponent],
      providers: [
        TimeControlDetailsFacade,
        TimeMockRepository,
        { provide: TimeRepository, useExisting: TimeMockRepository }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(IvrModuleDetailsTimeControlComponent);
    fixture.componentRef.setInput(
      'node',
      buildNode(
        toIvrModuleRecord({
          id: 13,
          serviceModuleTypeId: 5,
          name: 'Time control',
          timeZone: 'UTC',
          timeRule: 10,
          closedModuleId: 0
        }) as IvrModuleRecord
      )
    );

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Europe/Oslo');
    expect(fixture.nativeElement.textContent).toContain('Weekdays 08-16');
    expect(fixture.componentInstance.hasTimeRule()).toBeTrue();

    let emitted: { field: string; kind: string; value: unknown } | undefined;
    fixture.componentInstance.fieldChange.subscribe((event) => {
      emitted = event;
    });

    fixture.componentInstance.updateTimeRule(11);

    expect(emitted).toEqual({
      field: 'timeRule',
      kind: 'number',
      value: 11
    });
  });
});
