import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdvancedMenuDetailsFacade } from '../../data/facades/advanced-menu-details.facade';
import { IvrModuleDetailsBaseDirective } from '../../module-details/common/ivr-module-details-base.directive';
import { IvrModuleDetailsSchemaEditorComponent } from '../../module-details/common/ivr-module-details-schema-editor.component';
import { advancedMenuFields } from './advanced-menu.schema';

@Component({
  selector: 'app-ivr-module-details-advanced-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, IvrModuleDetailsSchemaEditorComponent],
  templateUrl: './advanced-menu.details.component.html',
  styleUrl: './advanced-menu.details.component.scss'
})
export class IvrModuleDetailsAdvancedMenuComponent extends IvrModuleDetailsBaseDirective implements OnInit {
  readonly fields = advancedMenuFields;
  readonly state = inject(AdvancedMenuDetailsFacade).state;

  private readonly facade = inject(AdvancedMenuDetailsFacade);

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
