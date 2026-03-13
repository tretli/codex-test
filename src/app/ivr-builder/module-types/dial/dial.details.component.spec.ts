import { TestBed } from '@angular/core/testing';
import { IvrModuleRecord, toIvrModuleRecord } from '../../../models/models';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { IvrModuleDetailsDialComponent } from './dial.details.component';

function buildNode(module: IvrModuleRecord): BuilderNode {
  return {
    module,
    x: 0,
    y: 0,
    linkField: 'successModuleId'
  };
}

describe('IvrModuleDetailsDialComponent', () => {
  it('renders the typed dial fields', async () => {
    await TestBed.configureTestingModule({
      imports: [IvrModuleDetailsDialComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(IvrModuleDetailsDialComponent);
    fixture.componentRef.setInput(
      'node',
      buildNode(
        toIvrModuleRecord({
          id: 3,
          serviceModuleTypeId: 3,
          name: 'Dial',
          callerIdNum: '1000',
          callerIdName: 'Support',
          diversionNum: '',
          number: '5551234',
          timeout: 30,
          dialOptions: 'T',
          successModuleId: 0,
          failureModuleId: 0
        }) as IvrModuleRecord
      )
    );

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Caller ID number');
    expect(fixture.nativeElement.textContent).toContain('Success module');
  });
});
