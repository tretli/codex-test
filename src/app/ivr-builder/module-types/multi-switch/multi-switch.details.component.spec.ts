import { TestBed } from '@angular/core/testing';
import { IvrModuleRecord, toIvrModuleRecord } from '../../../models/models';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { IvrModuleDetailsMultiSwitchComponent } from './multi-switch.details.component';

function buildNode(module: IvrModuleRecord): BuilderNode {
  return {
    module,
    x: 0,
    y: 0,
    linkField: 'noMatchModuleId'
  };
}

describe('IvrModuleDetailsMultiSwitchComponent', () => {
  it('emits nested patch paths for exit edits', async () => {
    await TestBed.configureTestingModule({
      imports: [IvrModuleDetailsMultiSwitchComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(IvrModuleDetailsMultiSwitchComponent);
    fixture.componentRef.setInput(
      'node',
      buildNode(
        toIvrModuleRecord({
          id: 24,
          serviceModuleTypeId: 24,
          name: 'Switch',
          variable: 'key',
          noMatchModuleId: 0,
          exits: [{ id: 1, rule: 'A', nextModuleId: 10 }]
        }) as IvrModuleRecord
      )
    );

    fixture.detectChanges();

    const events: Array<{ field: string; kind: string; value: unknown }> = [];
    fixture.componentInstance.fieldChange.subscribe((event) => {
      events.push(event);
    });

    fixture.componentInstance.addExit();
    fixture.componentInstance.updateExitRule(0, 'B');
    fixture.componentInstance.updateExitNextModuleId(0, 11);
    fixture.componentInstance.removeExit(0);

    expect(events[0].field).toBe('exits');
    expect(events[1]).toEqual({ field: 'exits[0].rule', kind: 'string', value: 'B' });
    expect(events[2]).toEqual({ field: 'exits[0].nextModuleId', kind: 'link', value: 11 });
    expect(events[3].field).toBe('exits');
  });
});
