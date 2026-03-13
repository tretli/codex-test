import { TestBed } from '@angular/core/testing';
import { IvrModuleRecord, toIvrModuleRecord } from '../../models/models';
import { BuilderNode } from '../canvas/ivr-canvas.types';
import { IvrModuleDetailsHostComponent } from './ivr-module-details-host.component';

function buildNode(module: IvrModuleRecord): BuilderNode {
  return {
    module,
    x: 0,
    y: 0,
    linkField: 'nextModuleId'
  };
}

describe('IvrModuleDetailsHostComponent', () => {
  it('mounts a dedicated component for known module types', async () => {
    await TestBed.configureTestingModule({
      imports: [IvrModuleDetailsHostComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(IvrModuleDetailsHostComponent);
    const selectedNode = buildNode(
      toIvrModuleRecord({
        id: 1,
        serviceModuleTypeId: 2,
        name: 'Playback',
        soundFile: 'welcome',
        nextModuleId: 0
      }) as IvrModuleRecord
    );

    fixture.componentRef.setInput('selectedNode', selectedNode);
    fixture.componentRef.setInput('nodes', [selectedNode]);
    fixture.componentRef.setInput('moduleTypeLabel', () => 'PlaySound');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-ivr-module-details-play-sound')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-ivr-module-details-fallback')).toBeNull();
  });

  it('renders the fallback editor for unknown module types', async () => {
    await TestBed.configureTestingModule({
      imports: [IvrModuleDetailsHostComponent]
    }).compileComponents();

    const fixture = TestBed.createComponent(IvrModuleDetailsHostComponent);
    const selectedNode = buildNode(
      toIvrModuleRecord({
        id: 99,
        serviceModuleTypeId: 999,
        name: 'Unknown',
        nextModuleId: 1,
        active: true
      }) as IvrModuleRecord
    );

    fixture.componentRef.setInput('selectedNode', selectedNode);
    fixture.componentRef.setInput('nodes', [selectedNode]);
    fixture.componentRef.setInput('moduleTypeLabel', () => 'Unknown');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-ivr-module-details-fallback')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Unknown module type 999. Showing fallback editor.');
  });
});
