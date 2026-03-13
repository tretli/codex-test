import { TestBed } from '@angular/core/testing';
import { IvrModuleRecord, toIvrModuleRecord } from '../../../models/models';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { IvrModuleDetailsTransferComponent } from './transfer.details.component';

function buildNode(module: IvrModuleRecord): BuilderNode {
  return {
    module,
    x: 0,
    y: 0,
    linkField: 'nextModuleId'
  };
}

describe('IvrModuleDetailsTransferComponent', () => {
  it('infers fields for legacy transfer modules', async () => {
    await TestBed.configureTestingModule({
      imports: [IvrModuleDetailsTransferComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(IvrModuleDetailsTransferComponent);
    fixture.componentRef.setInput(
      'node',
      buildNode(
        toIvrModuleRecord({
          id: 4,
          serviceModuleTypeId: 4,
          name: 'Transfer',
          nextModuleId: 8,
          customFlag: true
        }) as IvrModuleRecord
      )
    );

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Next module');
    expect(fixture.nativeElement.textContent).toContain('Custom Flag');
  });
});
