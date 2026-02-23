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
  enabled: boolean;
  x: number;
  y: number;
};

type ModuleTemplate = {
  type: IvrModuleType;
  label: string;
  defaultName: string;
  defaultPrompt: string;
};

type FlowConnection = {
  id: string;
  fromId: string;
  toId: string;
};

type DragState = {
  moduleId: string;
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

type ConnectionDraft = {
  fromId: string;
  pointerId: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

type RenderedConnection = {
  id: string;
  fromId: string;
  toId: string;
  path: string;
};

@Component({
  selector: 'app-ivr-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ivr-builder.component.html',
  styleUrl: './ivr-builder.component.scss'
})
export class IvrBuilderComponent {
  private readonly nodeWidth = 280;
  private readonly portOffsetY = 44;

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
      enabled: true,
      x: 100,
      y: 120
    },
    {
      id: 'm2',
      type: 'menu',
      name: 'Main Menu',
      prompt: 'Press 1 for sales, 2 for support.',
      enabled: true,
      x: 480,
      y: 120
    }
  ]);
  readonly connections = signal<FlowConnection[]>([
    { id: 'c1', fromId: 'm1', toId: 'm2' }
  ]);
  readonly dragState = signal<DragState | null>(null);
  readonly connectionDraft = signal<ConnectionDraft | null>(null);
  readonly canvasRef = signal<HTMLDivElement | null>(null);

  readonly enabledCount = computed(
    () => this.modules().filter((module) => module.enabled).length
  );
  readonly renderedConnections = computed<RenderedConnection[]>(() => {
    const modules = this.modules();
    return this.connections()
      .map((connection) => {
        const from = modules.find((item) => item.id === connection.fromId);
        const to = modules.find((item) => item.id === connection.toId);
        if (!from || !to) {
          return null;
        }
        const startX = from.x + this.nodeWidth;
        const startY = from.y + this.portOffsetY;
        const endX = to.x;
        const endY = to.y + this.portOffsetY;
        return {
          id: connection.id,
          fromId: connection.fromId,
          toId: connection.toId,
          path: this.buildPath(startX, startY, endX, endY)
        };
      })
      .filter((item): item is RenderedConnection => item !== null);
  });
  readonly draftPath = computed(() => {
    const draft = this.connectionDraft();
    if (!draft) {
      return '';
    }
    return this.buildPath(
      draft.startX,
      draft.startY,
      draft.currentX,
      draft.currentY
    );
  });

  addModule(): void {
    const template = this.templates.find(
      (item) => item.type === this.selectedTemplate()
    );
    if (!template) {
      return;
    }

    const id = `m${Date.now()}`;
    const count = this.modules().length;
    this.modules.update((current) => [
      ...current,
      {
        id,
        type: template.type,
        name: template.defaultName,
        prompt: template.defaultPrompt,
        enabled: true,
        x: 120 + (count % 3) * 320,
        y: 280 + Math.floor(count / 3) * 220
      }
    ]);
  }

  removeModule(moduleId: string): void {
    this.modules.update((current) => current.filter((module) => module.id !== moduleId));
    this.connections.update((current) =>
      current.filter((connection) => connection.fromId !== moduleId && connection.toId !== moduleId)
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

  toggleEnabled(moduleId: string): void {
    this.modules.update((current) =>
      current.map((module) =>
        module.id === moduleId ? { ...module, enabled: !module.enabled } : module
      )
    );
  }

  setCanvasRef(element: HTMLDivElement): void {
    this.canvasRef.set(element);
  }

  startModuleDrag(moduleId: string, event: PointerEvent): void {
    if (event.button !== 0 || this.connectionDraft()) {
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest('.port')) {
      return;
    }
    const pointer = this.toCanvasPoint(event);
    if (!pointer) {
      return;
    }
    const module = this.modules().find((item) => item.id === moduleId);
    if (!module) {
      return;
    }
    this.dragState.set({
      moduleId,
      pointerId: event.pointerId,
      offsetX: pointer.x - module.x,
      offsetY: pointer.y - module.y
    });
  }

  startConnectionDrag(moduleId: string, event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    const start = this.getPortPoint(moduleId, 'out');
    if (!start) {
      return;
    }
    this.connectionDraft.set({
      fromId: moduleId,
      pointerId: event.pointerId,
      startX: start.x,
      startY: start.y,
      currentX: start.x,
      currentY: start.y
    });
  }

  onCanvasPointerMove(event: PointerEvent): void {
    const point = this.toCanvasPoint(event);
    if (!point) {
      return;
    }

    const drag = this.dragState();
    if (drag && drag.pointerId === event.pointerId) {
      this.modules.update((current) =>
        current.map((module) =>
          module.id === drag.moduleId
            ? {
                ...module,
                x: Math.max(24, point.x - drag.offsetX),
                y: Math.max(24, point.y - drag.offsetY)
              }
            : module
        )
      );
      return;
    }

    const draft = this.connectionDraft();
    if (draft && draft.pointerId === event.pointerId) {
      this.connectionDraft.set({
        ...draft,
        currentX: point.x,
        currentY: point.y
      });
    }
  }

  onCanvasPointerUp(event: PointerEvent): void {
    const drag = this.dragState();
    if (drag && drag.pointerId === event.pointerId) {
      this.dragState.set(null);
    }

    const draft = this.connectionDraft();
    if (!draft || draft.pointerId !== event.pointerId) {
      return;
    }

    const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    const inputPort = element?.closest('[data-port-input]') as HTMLElement | null;
    const toId = inputPort?.dataset['portInput'] ?? null;

    if (toId && toId !== draft.fromId) {
      this.connections.update((current) => {
        const exists = current.some(
          (connection) => connection.fromId === draft.fromId && connection.toId === toId
        );
        if (exists) {
          return current;
        }
        return [
          ...current,
          { id: `c${Date.now()}`, fromId: draft.fromId, toId }
        ];
      });
    }

    this.connectionDraft.set(null);
  }

  removeConnection(connectionId: string): void {
    this.connections.update((current) =>
      current.filter((connection) => connection.id !== connectionId)
    );
  }

  private toCanvasPoint(event: PointerEvent): { x: number; y: number } | null {
    const canvas = this.canvasRef();
    if (!canvas) {
      return null;
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  private getPortPoint(moduleId: string, kind: 'in' | 'out'): { x: number; y: number } | null {
    const module = this.modules().find((item) => item.id === moduleId);
    if (!module) {
      return null;
    }
    return {
      x: kind === 'out' ? module.x + this.nodeWidth : module.x,
      y: module.y + this.portOffsetY
    };
  }

  private buildPath(startX: number, startY: number, endX: number, endY: number): string {
    const delta = Math.max(80, Math.abs(endX - startX) * 0.45);
    const c1x = startX + delta;
    const c2x = endX - delta;
    return `M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}`;
  }
}
