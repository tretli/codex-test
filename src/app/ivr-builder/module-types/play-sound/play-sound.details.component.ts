import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlaySoundDetailsFacade } from '../../data/facades/play-sound-details.facade';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { playSoundFields } from './play-sound.schema';

@Component({
  selector: 'app-ivr-module-details-play-sound',
  standalone: true,
  imports: [CommonModule, FormsModule, IvrModuleDetailsSchemaEditorComponent],
  templateUrl: './play-sound.details.component.html',
  styleUrl: './play-sound.details.component.scss'
})
export class IvrModuleDetailsPlaySoundComponent extends IvrModuleDetailsBaseDirective implements OnInit {
  readonly fields = playSoundFields;
  readonly state = inject(PlaySoundDetailsFacade).state;

  private readonly facade = inject(PlaySoundDetailsFacade);

  ngOnInit(): void {
    void this.facade.ensureLoaded();
  }

  prompts(): Array<{ key: string; displayName: string }> {
    return this.state().data;
  }

  soundFileValue(): string {
    const value = this.node.module['soundFile'];
    return typeof value === 'string' ? value : '';
  }

  selectedPromptKey(): string {
    const soundFile = this.soundFileValue();
    return this.prompts().some((prompt) => prompt.key === soundFile) ? soundFile : '';
  }

  updatePromptSelection(value: string): void {
    this.emitFieldChange('soundFile', 'string', value);
  }

  updateSoundFile(value: string): void {
    this.emitFieldChange('soundFile', 'string', value);
  }
}
