import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type IvrModuleType =
  | 'greeting'
  | 'menu'
  | 'transfer'
  | 'voicemail'
  | 'business-hours'
  | 'hangup';

type IvrModule = {
  id: string;
  name: string;
  type: IvrModuleType;
  prompt: string;
  nextModuleId: string | null;
  enabled: boolean;
};

type ModuleTemplate = {
  type: IvrModuleType;
  label: string;
  defaultName: string;
  defaultPrompt: string;
};

@Component({
  selector: 'app-ivr-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ivr-builder.component.html',
  styleUrl: './ivr-builder.component.scss'
})
export class IvrBuilderComponent {
  readonly templates: ModuleTemplate[] = [
    {
      type: 'greeting',
      label: 'Greeting',
      defaultName: 'Welcome Greeting',
      defaultPrompt: 'Welcome to our company.'
    },
    {
      type: 'menu',
      label: 'Menu',
      defaultName: 'Main Menu',
      defaultPrompt: 'Press 1 for sales, 2 for support.'
    },
    {
      type: 'transfer',
      label: 'Transfer',
      defaultName: 'Transfer to Agent',
      defaultPrompt: 'Please wait while we transfer your call.'
    },
    {
      type: 'voicemail',
      label: 'Voicemail',
      defaultName: 'Voicemail',
      defaultPrompt: 'Please leave a message after the tone.'
    },
    {
      type: 'business-hours',
      label: 'Business Hours',
      defaultName: 'Business Hours Check',
      defaultPrompt: 'Our office is open Monday to Friday.'
    },
    {
      type: 'hangup',
      label: 'Hang Up',
      defaultName: 'End Call',
      defaultPrompt: 'Thank you for calling. Goodbye.'
    }
  ];

  readonly selectedTemplate = signal<IvrModuleType>('menu');
  readonly modules = signal<IvrModule[]>([
    {
      id: 'm1',
      type: 'greeting',
      name: 'Welcome Greeting',
      prompt: 'Welcome to our company.',
      nextModuleId: 'm2',
      enabled: true
    },
    {
      id: 'm2',
      type: 'menu',
      name: 'Main Menu',
      prompt: 'Press 1 for sales, 2 for support.',
      nextModuleId: null,
      enabled: true
    }
  ]);

  readonly enabledCount = computed(
    () => this.modules().filter((module) => module.enabled).length
  );

  addModule(): void {
    const template = this.templates.find(
      (item) => item.type === this.selectedTemplate()
    );
    if (!template) {
      return;
    }

    const id = `m${Date.now()}`;
    this.modules.update((current) => [
      ...current,
      {
        id,
        type: template.type,
        name: template.defaultName,
        prompt: template.defaultPrompt,
        nextModuleId: null,
        enabled: true
      }
    ]);
  }

  removeModule(moduleId: string): void {
    this.modules.update((current) =>
      current
        .filter((module) => module.id !== moduleId)
        .map((module) => ({
          ...module,
          nextModuleId: module.nextModuleId === moduleId ? null : module.nextModuleId
        }))
    );
  }

  moveUp(moduleId: string): void {
    this.modules.update((current) => {
      const index = current.findIndex((item) => item.id === moduleId);
      if (index <= 0) {
        return current;
      }
      const next = [...current];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  moveDown(moduleId: string): void {
    this.modules.update((current) => {
      const index = current.findIndex((item) => item.id === moduleId);
      if (index === -1 || index >= current.length - 1) {
        return current;
      }
      const next = [...current];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }

  updateName(moduleId: string, value: string): void {
    this.modules.update((current) =>
      current.map((module) =>
        module.id === moduleId ? { ...module, name: value } : module
      )
    );
  }

  updatePrompt(moduleId: string, value: string): void {
    this.modules.update((current) =>
      current.map((module) =>
        module.id === moduleId ? { ...module, prompt: value } : module
      )
    );
  }

  updateNextModule(moduleId: string, value: string): void {
    this.modules.update((current) =>
      current.map((module) =>
        module.id === moduleId
          ? { ...module, nextModuleId: value || null }
          : module
      )
    );
  }

  toggleEnabled(moduleId: string): void {
    this.modules.update((current) =>
      current.map((module) =>
        module.id === moduleId ? { ...module, enabled: !module.enabled } : module
      )
    );
  }
}
