import { TestBed } from '@angular/core/testing';
import { IvrModuleRecord, toIvrModuleRecord } from '../../../models/models';
import { BuilderNode } from '../../canvas/ivr-canvas.types';
import { PlaySoundDetailsFacade } from '../../data/facades/play-sound-details.facade';
import { PromptMockRepository } from '../../data/mock/prompt.mock.repository';
import { PromptRepository } from '../../data/repositories/prompt.repository';
import { IvrModuleDetailsPlaySoundComponent } from './play-sound.details.component';

function buildNode(module: IvrModuleRecord): BuilderNode {
  return {
    module,
    x: 0,
    y: 0,
    linkField: 'nextModuleId'
  };
}

describe('IvrModuleDetailsPlaySoundComponent', () => {
  it('loads prompt options and emits sound file patches', async () => {
    await TestBed.configureTestingModule({
      imports: [IvrModuleDetailsPlaySoundComponent],
      providers: [
        PlaySoundDetailsFacade,
        PromptMockRepository,
        { provide: PromptRepository, useExisting: PromptMockRepository }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(IvrModuleDetailsPlaySoundComponent);
    fixture.componentRef.setInput(
      'node',
      buildNode(
        toIvrModuleRecord({
          id: 1,
          serviceModuleTypeId: 2,
          name: 'Playback',
          soundFile: '',
          answer: true,
          background: false,
          nextModuleId: 0
        }) as IvrModuleRecord
      )
    );

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Welcome prompt');

    let emitted: { field: string; kind: string; value: unknown } | undefined;
    fixture.componentInstance.fieldChange.subscribe((event) => {
      emitted = event;
    });

    fixture.componentInstance.updatePromptSelection('welcome');

    expect(emitted).toEqual({
      field: 'soundFile',
      kind: 'string',
      value: 'welcome'
    });
  });
});
