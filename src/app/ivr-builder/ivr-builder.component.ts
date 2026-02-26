import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DEFAULT_IVR_SAMPLE_MODULES } from './ivr-sample-data';

type IvrModuleRecord = {
  id: number;
  serviceModuleTypeId: number;
  name?: string;
  order?: number;
  [key: string]: unknown;
};

type ModuleTemplate = {
  serviceModuleTypeId: number;
  label: string;
  defaultName: string;
  defaults: Record<string, unknown>;
  preferredLinkField: string;
};

type BuilderNode = {
  module: IvrModuleRecord;
  x: number;
  y: number;
  linkField: string;
};

type DragState = {
  moduleId: number;
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

type ConnectionDraft = {
  fromId: number;
  field: string;
  pointerId: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

type RenderedConnection = {
  id: string;
  fromId: number;
  toId: number;
  field: string;
  path: string;
};

type GraphEdge = {
  fromId: number;
  toId: number;
};

type ModuleLink = {
  field: string;
  toId: number;
};

type UnlinkedZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  count: number;
};

type CanvasExtent = {
  width: number;
  height: number;
};

type FieldKind = 'string' | 'number' | 'boolean' | 'link';
type FieldSchema = {
  key: string;
  label: string;
  kind: FieldKind;
};

const LINK_FIELD_PATTERN = /moduleid$/i;
const BASE_FIELD_SCHEMAS: ReadonlyArray<FieldSchema> = [
  { key: 'order', label: 'Order', kind: 'number' },
  { key: 'serviceGroupId', label: 'Service group ID', kind: 'number' },
  { key: 'callLogVisible', label: 'Call log visible', kind: 'boolean' }
];

const TYPE_SCHEMAS: Record<number, ReadonlyArray<FieldSchema>> = {
  1: [{ key: 'cause', label: 'Cause', kind: 'string' }],
  2: [
    { key: 'soundFile', label: 'Sound file', kind: 'string' },
    { key: 'answer', label: 'Answer', kind: 'boolean' },
    { key: 'background', label: 'Background', kind: 'boolean' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ],
  5: [
    { key: 'timeZone', label: 'Time zone', kind: 'string' },
    { key: 'closedModuleId', label: 'Closed module', kind: 'link' }
  ],
  7: [
    { key: 'queueId', label: 'Queue ID', kind: 'number' },
    { key: 'queuePriority', label: 'Queue priority', kind: 'number' },
    { key: 'queueTimeout', label: 'Queue timeout', kind: 'number' },
    { key: 'answer', label: 'Answer', kind: 'boolean' },
    { key: 'extraTime', label: 'Extra time', kind: 'number' },
    { key: 'timeoutModuleId', label: 'Timeout module', kind: 'link' },
    { key: 'joinEmptyModuleId', label: 'Join empty module', kind: 'link' },
    { key: 'leaveEmptyModuleId', label: 'Leave empty module', kind: 'link' },
    { key: 'joinUnavailModuleId', label: 'Join unavailable module', kind: 'link' },
    { key: 'leaveUnavailModuleId', label: 'Leave unavailable module', kind: 'link' },
    { key: 'fullModuleId', label: 'Full module', kind: 'link' },
    { key: 'continueModuleId', label: 'Continue module', kind: 'link' },
    { key: 'surveyModuleId', label: 'Survey module', kind: 'link' }
  ],
  11: [
    { key: 'numberListId', label: 'Number list ID', kind: 'number' },
    { key: 'matchModuleId', label: 'Match module', kind: 'link' },
    { key: 'noMatchModuleId', label: 'No match module', kind: 'link' }
  ],
  13: [
    { key: 'macro', label: 'Macro', kind: 'string' },
    { key: 'macroArgs', label: 'Macro args', kind: 'string' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ],
  14: [
    { key: 'variable', label: 'Variable', kind: 'string' },
    { key: 'onModuleId', label: 'On module', kind: 'link' },
    { key: 'offModuleId', label: 'Off module', kind: 'link' }
  ],
  17: [
    { key: 'wait', label: 'Wait (ms)', kind: 'number' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ],
  19: [
    { key: 'variable', label: 'Variable', kind: 'string' },
    { key: 'value', label: 'Value', kind: 'string' },
    { key: 'permanent', label: 'Permanent', kind: 'boolean' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ],
  21: [{ key: 'targetServiceGroupId', label: 'Target service group ID', kind: 'number' }],
  23: [
    { key: 'soundFile', label: 'Sound file', kind: 'string' },
    { key: 'variable', label: 'Variable', kind: 'string' },
    { key: 'maxDigits', label: 'Max digits', kind: 'number' },
    { key: 'timeout', label: 'Timeout', kind: 'number' },
    { key: 'acceptableDigits', label: 'Acceptable digits', kind: 'string' },
    { key: 'terminateDigits', label: 'Terminate digits', kind: 'string' },
    { key: 'terminateStartDigits', label: 'Terminate start digits', kind: 'string' },
    { key: 'keepTerminateDigit', label: 'Keep terminate digit', kind: 'boolean' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' },
    { key: 'timeoutModuleId', label: 'Timeout module', kind: 'link' }
  ],
  24: [
    { key: 'variable', label: 'Variable', kind: 'string' },
    { key: 'noMatchModuleId', label: 'No match module', kind: 'link' }
  ],
  30: [
    { key: 'soundFile', label: 'Sound file', kind: 'string' },
    { key: 'answer', label: 'Answer', kind: 'boolean' },
    { key: 'background', label: 'Background', kind: 'boolean' },
    { key: 'interval', label: 'Interval', kind: 'number' },
    { key: 'count', label: 'Count', kind: 'number' },
    { key: 'surveyModule', label: 'Survey module', kind: 'boolean' },
    { key: 'key0ModuleId', label: 'Key 0', kind: 'link' },
    { key: 'key1ModuleId', label: 'Key 1', kind: 'link' },
    { key: 'key2ModuleId', label: 'Key 2', kind: 'link' },
    { key: 'key3ModuleId', label: 'Key 3', kind: 'link' },
    { key: 'key4ModuleId', label: 'Key 4', kind: 'link' },
    { key: 'key5ModuleId', label: 'Key 5', kind: 'link' },
    { key: 'key6ModuleId', label: 'Key 6', kind: 'link' },
    { key: 'key7ModuleId', label: 'Key 7', kind: 'link' },
    { key: 'key8ModuleId', label: 'Key 8', kind: 'link' },
    { key: 'key9ModuleId', label: 'Key 9', kind: 'link' },
    { key: 'keyStarModuleId', label: 'Key *', kind: 'link' },
    { key: 'keyHashModuleId', label: 'Key #', kind: 'link' },
    { key: 'loopExhaustedModuleId', label: 'Loop exhausted', kind: 'link' }
  ],
  34: [{ key: 'nextModuleId', label: 'Next module', kind: 'link' }],
  39: [
    { key: 'internalLookup', label: 'Internal lookup', kind: 'boolean' },
    { key: 'yellowPagesLookup', label: 'Yellow pages lookup', kind: 'boolean' },
    { key: 'nextModuleId', label: 'Next module', kind: 'link' }
  ]
};

@Component({
  selector: 'app-ivr-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ivr-builder.component.html',
  styleUrl: './ivr-builder.component.scss'
})
export class IvrBuilderComponent {
  private readonly nodeWidth = 320;
  private readonly portOffsetY = 56;
  private readonly moduleTypeColors: Record<number, string> = {
    1: '#64748b',
    2: '#ef4444',
    5: '#22c55e',
    7: '#eab308',
    11: '#86efac',
    13: '#facc15',
    14: '#ca8a04',
    17: '#d946ef',
    19: '#06b6d4',
    21: '#c084fc',
    23: '#fb923c',
    24: '#14b8a6',
    30: '#0ea5e9',
    34: '#a3e635',
    39: '#4338ca'
  };

  readonly templates: ModuleTemplate[] = [
    {
      serviceModuleTypeId: 30,
      label: 'Menu',
      defaultName: 'Menu',
      defaults: {
        answer: true,
        background: true,
        interval: 3,
        count: 3,
        surveyModule: false,
        key1ModuleId: 0,
        key2ModuleId: 0,
        keyStarModuleId: 0,
        keyHashModuleId: 0,
        loopExhaustedModuleId: 0
      },
      preferredLinkField: 'key1ModuleId'
    },
    {
      serviceModuleTypeId: 2,
      label: 'Playback',
      defaultName: 'Playback',
      defaults: { answer: true, background: false, soundFile: '', nextModuleId: 0 },
      preferredLinkField: 'nextModuleId'
    },
    {
      serviceModuleTypeId: 7,
      label: 'Queue',
      defaultName: 'Queue',
      defaults: {
        answer: true,
        queueId: 0,
        queuePriority: 0,
        queueTimeout: 0,
        timeoutModuleId: 0,
        continueModuleId: 0,
        fullModuleId: 0
      },
      preferredLinkField: 'continueModuleId'
    },
    {
      serviceModuleTypeId: 17,
      label: 'Wait',
      defaultName: 'Wait',
      defaults: { wait: 1000, nextModuleId: 0 },
      preferredLinkField: 'nextModuleId'
    },
    {
      serviceModuleTypeId: 1,
      label: 'Hangup',
      defaultName: 'Hangup',
      defaults: { cause: 'normal' },
      preferredLinkField: 'nextModuleId'
    }
  ];

  readonly selectedTypeId = signal<number>(30);
  readonly jsonInput = signal<string>(JSON.stringify(DEFAULT_IVR_SAMPLE_MODULES, null, 2));
  readonly parseError = signal<string | null>(null);
  readonly nodes = signal<BuilderNode[]>([]);
  readonly selectedModuleId = signal<number | null>(null);
  readonly dragState = signal<DragState | null>(null);
  readonly connectionDraft = signal<ConnectionDraft | null>(null);
  readonly canvasRef = signal<HTMLDivElement | null>(null);

  readonly renderedConnections = computed<RenderedConnection[]>(() => {
    const nodes = this.nodes();
    const moduleById = new Map(nodes.map((node) => [node.module.id, node]));
    const connections: RenderedConnection[] = [];
    nodes.forEach((node) => {
      this.getModuleLinks(node.module).forEach((link) => {
        const targetId = link.toId;
        const target = moduleById.get(targetId);
        if (!target) {
          return;
        }
        const startX = node.x + this.nodeWidth;
        const startY = node.y + this.portOffsetY;
        const endX = target.x;
        const endY = target.y + this.portOffsetY;
        connections.push({
          id: `${node.module.id}:${link.field}:${targetId}`,
          fromId: node.module.id,
          toId: targetId,
          field: link.field,
          path: this.buildPath(startX, startY, endX, endY)
        });
      });
    });
    return connections;
  });
  readonly unlinkedZone = computed<UnlinkedZone | null>(() => {
    const nodes = this.nodes();
    if (nodes.length === 0) {
      return null;
    }
    const nodeById = new Map(nodes.map((node) => [node.module.id, node]));
    const edges = this.collectGraphEdges(nodes, nodeById);
    const isolatedIds = this.getIsolatedNodeIds(nodes, edges);
    if (isolatedIds.length === 0) {
      return null;
    }
    return this.buildUnlinkedZone(isolatedIds, nodeById);
  });
  readonly canvasExtent = computed<CanvasExtent>(() => {
    const minWidth = 1400;
    const minHeight = 1000;
    const padding = 140;
    let maxX = 0;
    let maxY = 0;

    this.nodes().forEach((node) => {
      maxX = Math.max(maxX, node.x + this.nodeWidth + padding);
      maxY = Math.max(maxY, node.y + this.nodeHeight(node) + padding);
    });

    const zone = this.unlinkedZone();
    if (zone) {
      maxX = Math.max(maxX, zone.x + zone.width + padding);
      maxY = Math.max(maxY, zone.y + zone.height + padding);
    }

    const draft = this.connectionDraft();
    if (draft) {
      maxX = Math.max(maxX, draft.startX + padding, draft.currentX + padding);
      maxY = Math.max(maxY, draft.startY + padding, draft.currentY + padding);
    }

    return {
      width: Math.max(minWidth, Math.ceil(maxX)),
      height: Math.max(minHeight, Math.ceil(maxY))
    };
  });

  readonly draftPath = computed(() => {
    const draft = this.connectionDraft();
    if (!draft) {
      return '';
    }
    return this.buildPath(draft.startX, draft.startY, draft.currentX, draft.currentY);
  });
  readonly serializedModules = computed(() => JSON.stringify(this.exportModules(), null, 2));
  readonly moduleCount = computed(() => this.nodes().length);
  readonly connectionCount = computed(() => this.renderedConnections().length);

  constructor() {
    this.importFromJson();
  }

  setCanvasRef(element: HTMLDivElement): void {
    this.canvasRef.set(element);
  }

  resetToSample(): void {
    this.jsonInput.set(JSON.stringify(DEFAULT_IVR_SAMPLE_MODULES, null, 2));
    this.importFromJson();
  }

  importFromJson(): void {
    this.parseError.set(null);
    try {
      const parsed = JSON.parse(this.jsonInput());
      if (!Array.isArray(parsed)) {
        this.parseError.set('JSON root must be an array.');
        return;
      }
      const modules = parsed.filter(
        (item): item is IvrModuleRecord =>
          !!item &&
          typeof item === 'object' &&
          typeof (item as { id?: unknown }).id === 'number' &&
          typeof (item as { serviceModuleTypeId?: unknown }).serviceModuleTypeId === 'number'
      );
      if (modules.length !== parsed.length) {
        this.parseError.set('Each item must contain numeric id and serviceModuleTypeId.');
        return;
      }
      this.nodes.set(this.modulesToNodes(modules));
      this.selectedModuleId.set(null);
    } catch {
      this.parseError.set('Invalid JSON.');
    }
  }

  addModule(): void {
    const template = this.templates.find((item) => item.serviceModuleTypeId === this.selectedTypeId());
    if (!template) {
      return;
    }
    const modules = this.exportModules();
    const maxId = modules.reduce((max, item) => Math.max(max, item.id), 0);
    const maxOrder = modules.reduce((max, item) => Math.max(max, typeof item.order === 'number' ? item.order : 0), 0);
    const id = maxId + 1;
    const count = this.nodes().length;
    const module: IvrModuleRecord = {
      id,
      name: `${template.defaultName} ${id}`,
      serviceModuleTypeId: template.serviceModuleTypeId,
      order: maxOrder + 1,
      ...template.defaults
    };
    this.nodes.update((current) => [
      ...current,
      { module, x: 80 + (count % 3) * 360, y: 120 + Math.floor(count / 3) * 250, linkField: this.defaultLinkField(module) }
    ]);
  }

  removeModule(moduleId: number): void {
    this.nodes.update((current) =>
      current
        .filter((node) => node.module.id !== moduleId)
        .map((node) => this.clearLinksTo(node, moduleId))
    );
    if (this.selectedModuleId() === moduleId) {
      this.selectedModuleId.set(null);
    }
  }

  updateName(moduleId: number, value: string): void {
    this.updateNodeModule(moduleId, (module) => ({ ...module, name: value }));
  }

  updateFieldValue(moduleId: number, field: string, kind: FieldKind, rawValue: unknown): void {
    this.updateNodeModule(moduleId, (module) => {
      if (kind === 'boolean') {
        return { ...module, [field]: Boolean(rawValue) };
      }
      if (kind === 'number' || kind === 'link') {
        const parsed = Number(rawValue);
        return { ...module, [field]: Number.isFinite(parsed) ? parsed : 0 };
      }
      return { ...module, [field]: String(rawValue ?? '') };
    });
  }

  nodeLinkFields(node: BuilderNode): string[] {
    return this.getLinkFields(node.module);
  }

  updateLinkField(moduleId: number, field: string): void {
    this.nodes.update((current) =>
      current.map((node) => (node.module.id === moduleId ? { ...node, linkField: field } : node))
    );
  }

  moduleTypeLabel(serviceModuleTypeId: number): string {
    const template = this.templates.find((item) => item.serviceModuleTypeId === serviceModuleTypeId);
    return template ? template.label : `Type ${serviceModuleTypeId}`;
  }

  moduleTypeColor(serviceModuleTypeId: number): string {
    return this.moduleTypeColors[serviceModuleTypeId] ?? '#475569';
  }

  moduleTargets(node: BuilderNode): Array<{ id: number; label: string }> {
    return this.nodes()
      .filter((item) => item.module.id !== node.module.id)
      .map((item) => ({ id: item.module.id, label: `${item.module.id} - ${item.module.name || 'Unnamed'}` }))
      .sort((a, b) => a.id - b.id);
  }

  editableFields(node: BuilderNode): FieldSchema[] {
    const schemas = [...BASE_FIELD_SCHEMAS, ...(TYPE_SCHEMAS[node.module.serviceModuleTypeId] ?? [])];
    const known = new Set(schemas.map((item) => item.key));
    Object.keys(node.module).forEach((key) => {
      if (known.has(key) || ['id', 'serviceModuleTypeId', 'name', 'guid', 'customerId'].includes(key)) {
        return;
      }
      if (LINK_FIELD_PATTERN.test(key)) {
        schemas.push({ key, label: this.toLabel(key), kind: 'link' });
      } else if (typeof node.module[key] === 'boolean') {
        schemas.push({ key, label: this.toLabel(key), kind: 'boolean' });
      } else if (typeof node.module[key] === 'number') {
        schemas.push({ key, label: this.toLabel(key), kind: 'number' });
      } else if (typeof node.module[key] === 'string') {
        schemas.push({ key, label: this.toLabel(key), kind: 'string' });
      }
    });
    return schemas;
  }

  fieldNumberValue(node: BuilderNode, field: string): number {
    return typeof node.module[field] === 'number' ? (node.module[field] as number) : 0;
  }

  fieldStringValue(node: BuilderNode, field: string): string {
    return typeof node.module[field] === 'string' ? (node.module[field] as string) : '';
  }

  fieldBooleanValue(node: BuilderNode, field: string): boolean {
    return Boolean(node.module[field]);
  }

  linkFieldValue(node: BuilderNode, field: string): number {
    return this.asPositiveId(node.module[field]) ?? 0;
  }

  startModuleDrag(moduleId: number, event: PointerEvent): void {
    if (event.button !== 0 || this.connectionDraft()) {
      return;
    }
    if ((event.target as HTMLElement | null)?.closest('.port')) {
      return;
    }
    const pointer = this.toCanvasPoint(event);
    if (!pointer) {
      return;
    }
    const node = this.nodes().find((item) => item.module.id === moduleId);
    if (!node) {
      return;
    }
    this.dragState.set({
      moduleId,
      pointerId: event.pointerId,
      offsetX: pointer.x - node.x,
      offsetY: pointer.y - node.y
    });
  }

  startConnectionDrag(node: BuilderNode, event: PointerEvent): void {
    if (event.button !== 0 || !node.linkField) {
      return;
    }
    event.stopPropagation();
    const start = this.getPortPoint(node.module.id, 'out');
    if (!start) {
      return;
    }
    this.connectionDraft.set({
      fromId: node.module.id,
      field: node.linkField,
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
      this.nodes.update((current) =>
        current.map((node) =>
          node.module.id === drag.moduleId
            ? { ...node, x: Math.max(24, point.x - drag.offsetX), y: Math.max(24, point.y - drag.offsetY) }
            : node
        )
      );
      return;
    }
    const draft = this.connectionDraft();
    if (draft && draft.pointerId === event.pointerId) {
      this.connectionDraft.set({ ...draft, currentX: point.x, currentY: point.y });
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
    const toId = Number(inputPort?.dataset['portInput'] ?? '');
    if (Number.isFinite(toId) && toId > 0 && toId !== draft.fromId) {
      this.updateNodeModule(draft.fromId, (module) => ({ ...module, [draft.field]: toId }));
    }
    this.connectionDraft.set(null);
  }

  removeConnection(connection: RenderedConnection): void {
    this.updateNodeModule(connection.fromId, (module) => {
      if (!(connection.field in module) || connection.field.includes('.') || connection.field.includes('[')) {
        return module;
      }
      return { ...module, [connection.field]: 0 };
    });
  }

  autoLayoutModules(): void {
    const currentNodes = this.nodes();
    if (currentNodes.length < 2) {
      return;
    }

    const measuredHeights = this.measureNodeHeights();
    const nodeById = new Map(currentNodes.map((node) => [node.module.id, node]));
    const edges = this.collectGraphEdges(currentNodes, nodeById);
    const isolatedIdSet = new Set(this.getIsolatedNodeIds(currentNodes, edges));
    const linkedNodes = currentNodes.filter((node) => !isolatedIdSet.has(node.module.id));
    const outgoing = new Map<number, number[]>();
    const incoming = new Map<number, number[]>();
    linkedNodes.forEach((node) => {
      outgoing.set(node.module.id, []);
      incoming.set(node.module.id, []);
    });
    edges.forEach((edge) => {
      if (isolatedIdSet.has(edge.fromId) || isolatedIdSet.has(edge.toId)) {
        return;
      }
      outgoing.get(edge.fromId)?.push(edge.toId);
      incoming.get(edge.toId)?.push(edge.fromId);
    });

    const positioned = new Map<number, { x: number; y: number }>();
    if (linkedNodes.length > 0) {
      const layerById = this.assignLayers(linkedNodes, outgoing, incoming);
      const orderedLayers = this.orderLayersToReduceCrossings(linkedNodes, layerById, outgoing, incoming);
      this.positionOrderedLayers(orderedLayers, nodeById, measuredHeights).forEach((value, id) => positioned.set(id, value));
    }

    this.positionIsolatedNodes(
      currentNodes.filter((node) => isolatedIdSet.has(node.module.id)),
      positioned,
      measuredHeights
    ).forEach((value, id) => positioned.set(id, value));

    this.nodes.update((nodes) =>
      nodes.map((node) => {
        const next = positioned.get(node.module.id);
        return next ? { ...node, x: next.x, y: next.y } : node;
      })
    );
  }

  trackByNode(_index: number, node: BuilderNode): number {
    return node.module.id;
  }

  selectModule(moduleId: number): void {
    this.selectedModuleId.set(moduleId);
  }

  clearSelectionIfCanvasBackground(event: PointerEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    if (target.closest('.module-card') || target.closest('.port') || target.closest('.connection-line')) {
      return;
    }
    this.selectedModuleId.set(null);
  }

  private modulesToNodes(modules: IvrModuleRecord[]): BuilderNode[] {
    const sorted = [...modules].sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
      const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
      return orderA === orderB ? a.id - b.id : orderA - orderB;
    });
    return sorted.map((module, index) => ({
      module: { ...module },
      x: 80 + (index % 3) * 360,
      y: 120 + Math.floor(index / 3) * 250,
      linkField: this.defaultLinkField(module)
    }));
  }

  private exportModules(): IvrModuleRecord[] {
    return this.nodes().map((node) => ({ ...node.module })).sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : Number.MAX_SAFE_INTEGER;
      const orderB = typeof b.order === 'number' ? b.order : Number.MAX_SAFE_INTEGER;
      return orderA === orderB ? a.id - b.id : orderA - orderB;
    });
  }

  private getLinkFields(module: IvrModuleRecord): string[] {
    const existing = Object.keys(module).filter((key) => LINK_FIELD_PATTERN.test(key));
    const typed = (TYPE_SCHEMAS[module.serviceModuleTypeId] ?? []).filter((item) => item.kind === 'link').map((item) => item.key);
    return [...new Set([...typed, ...existing])];
  }

  private getModuleLinks(module: IvrModuleRecord): ModuleLink[] {
    const links: ModuleLink[] = [];
    const seen = new Set<string>();

    const addLink = (field: string, rawValue: unknown): void => {
      const toId = this.asPositiveId(rawValue);
      if (toId === null) {
        return;
      }
      const key = `${field}:${toId}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      links.push({ field, toId });
    };

    Object.keys(module).forEach((field) => {
      if (LINK_FIELD_PATTERN.test(field)) {
        addLink(field, module[field]);
      }
    });

    const visit = (value: unknown, path: string, depth: number): void => {
      if (depth > 4 || value === null || value === undefined) {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item, index) => visit(item, `${path}[${index}]`, depth + 1));
        return;
      }
      if (typeof value !== 'object') {
        return;
      }
      Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
        const nextPath = path ? `${path}.${key}` : key;
        if (LINK_FIELD_PATTERN.test(key)) {
          addLink(nextPath, nested);
        }
        visit(nested, nextPath, depth + 1);
      });
    };

    Object.entries(module).forEach(([key, value]) => {
      if (!LINK_FIELD_PATTERN.test(key)) {
        visit(value, key, 1);
      }
    });

    return links;
  }

  private defaultLinkField(module: IvrModuleRecord): string {
    const links = this.getLinkFields(module);
    return links[0] ?? '';
  }

  private clearLinksTo(node: BuilderNode, targetId: number): BuilderNode {
    const nextModule = { ...node.module };
    this.getLinkFields(node.module).forEach((field) => {
      if (this.asPositiveId(nextModule[field]) === targetId) {
        nextModule[field] = 0;
      }
    });
    return { ...node, module: nextModule };
  }

  private updateNodeModule(moduleId: number, updater: (module: IvrModuleRecord) => IvrModuleRecord): void {
    this.nodes.update((current) => current.map((node) => (node.module.id === moduleId ? { ...node, module: updater(node.module) } : node)));
  }

  private asPositiveId(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      return value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return null;
      }
      const parsed = Number(trimmed);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    return null;
  }

  private toLabel(key: string): string {
    return key.replace(/ModuleId$/, ' module').replace(/([A-Z])/g, ' $1').replace(/^./, (text) => text.toUpperCase()).trim();
  }

  private toCanvasPoint(event: PointerEvent): { x: number; y: number } | null {
    const canvas = this.canvasRef();
    if (!canvas) {
      return null;
    }
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left + canvas.scrollLeft,
      y: event.clientY - rect.top + canvas.scrollTop
    };
  }

  private getPortPoint(moduleId: number, kind: 'in' | 'out'): { x: number; y: number } | null {
    const node = this.nodes().find((item) => item.module.id === moduleId);
    if (!node) {
      return null;
    }
    return { x: kind === 'out' ? node.x + this.nodeWidth : node.x, y: node.y + this.portOffsetY };
  }

  private buildPath(startX: number, startY: number, endX: number, endY: number): string {
    const delta = Math.max(80, Math.abs(endX - startX) * 0.45);
    const c1x = startX + delta;
    const c2x = endX - delta;
    return `M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}`;
  }

  private collectGraphEdges(nodes: BuilderNode[], nodeById: Map<number, BuilderNode>): GraphEdge[] {
    const edges: GraphEdge[] = [];
    const seen = new Set<string>();
    nodes.forEach((node) => {
      this.getModuleLinks(node.module).forEach((link) => {
        const targetId = link.toId;
        if (!nodeById.has(targetId) || targetId === node.module.id) {
          return;
        }
        const key = `${node.module.id}:${link.field}:${targetId}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        edges.push({ fromId: node.module.id, toId: targetId });
      });
    });
    return edges;
  }

  private getIsolatedNodeIds(nodes: BuilderNode[], edges: GraphEdge[]): number[] {
    const degree = new Map<number, number>();
    nodes.forEach((node) => degree.set(node.module.id, 0));
    edges.forEach((edge) => {
      degree.set(edge.fromId, (degree.get(edge.fromId) ?? 0) + 1);
      degree.set(edge.toId, (degree.get(edge.toId) ?? 0) + 1);
    });
    return nodes
      .filter((node) => (degree.get(node.module.id) ?? 0) === 0)
      .map((node) => node.module.id);
  }

  private assignLayers(
    nodes: BuilderNode[],
    outgoing: Map<number, number[]>,
    incoming: Map<number, number[]>
  ): Map<number, number> {
    const layerById = new Map<number, number>();
    const indegree = new Map<number, number>();
    nodes.forEach((node) => {
      indegree.set(node.module.id, incoming.get(node.module.id)?.length ?? 0);
      layerById.set(node.module.id, 0);
    });

    const queue = nodes
      .filter((node) => (indegree.get(node.module.id) ?? 0) === 0)
      .sort((a, b) => a.y - b.y || a.module.id - b.module.id)
      .map((node) => node.module.id);

    while (queue.length > 0) {
      const id = queue.shift() as number;
      const baseLayer = layerById.get(id) ?? 0;
      (outgoing.get(id) ?? []).forEach((nextId) => {
        layerById.set(nextId, Math.max(layerById.get(nextId) ?? 0, baseLayer + 1));
        indegree.set(nextId, (indegree.get(nextId) ?? 0) - 1);
        if ((indegree.get(nextId) ?? 0) === 0) {
          queue.push(nextId);
        }
      });
    }

    nodes
      .filter((node) => (indegree.get(node.module.id) ?? 0) > 0)
      .sort((a, b) => a.x - b.x || a.module.id - b.module.id)
      .forEach((node) => {
        const fromLayers = (incoming.get(node.module.id) ?? []).map((id) => layerById.get(id) ?? 0);
        const fallback = fromLayers.length > 0 ? Math.max(...fromLayers) + 1 : 0;
        layerById.set(node.module.id, Math.max(layerById.get(node.module.id) ?? 0, fallback));
      });

    return layerById;
  }

  private orderLayersToReduceCrossings(
    nodes: BuilderNode[],
    layerById: Map<number, number>,
    outgoing: Map<number, number[]>,
    incoming: Map<number, number[]>
  ): number[][] {
    const maxLayer = Math.max(...nodes.map((node) => layerById.get(node.module.id) ?? 0));
    const layers: number[][] = Array.from({ length: maxLayer + 1 }, () => []);
    nodes
      .slice()
      .sort((a, b) => a.y - b.y || a.module.id - b.module.id)
      .forEach((node) => {
        layers[layerById.get(node.module.id) ?? 0].push(node.module.id);
      });

    for (let i = 0; i < 6; i += 1) {
      for (let layer = 1; layer < layers.length; layer += 1) {
        this.sortLayerByNeighbors(layers[layer], layers[layer - 1], incoming);
      }
      for (let layer = layers.length - 2; layer >= 0; layer -= 1) {
        this.sortLayerByNeighbors(layers[layer], layers[layer + 1], outgoing);
      }
    }

    return layers;
  }

  private sortLayerByNeighbors(layer: number[], neighborLayer: number[], neighbors: Map<number, number[]>): void {
    const neighborRank = new Map<number, number>();
    neighborLayer.forEach((id, index) => neighborRank.set(id, index));

    const score = (id: number): number => {
      const ranked = (neighbors.get(id) ?? [])
        .map((neighborId) => neighborRank.get(neighborId))
        .filter((value): value is number => value !== undefined)
        .sort((a, b) => a - b);
      if (ranked.length === 0) {
        return Number.POSITIVE_INFINITY;
      }
      const mid = Math.floor(ranked.length / 2);
      return ranked.length % 2 === 0 ? (ranked[mid - 1] + ranked[mid]) / 2 : ranked[mid];
    };

    layer.sort((a, b) => {
      const scoreA = score(a);
      const scoreB = score(b);
      const finiteA = Number.isFinite(scoreA);
      const finiteB = Number.isFinite(scoreB);
      if (finiteA && finiteB) {
        const delta = scoreA - scoreB;
        return delta === 0 ? a - b : delta;
      }
      if (finiteA) {
        return -1;
      }
      if (finiteB) {
        return 1;
      }
      return a - b;
    });
  }

  private positionOrderedLayers(
    layers: number[][],
    nodeById: Map<number, BuilderNode>,
    measuredHeights: Map<number, number>
  ): Map<number, { x: number; y: number }> {
    const left = 64;
    const top = 64;
    const horizontalGap = 180;
    const verticalGap = 40;
    const positions = new Map<number, { x: number; y: number }>();

    layers.forEach((layer, layerIndex) => {
      let y = top;
      const x = left + layerIndex * (this.nodeWidth + horizontalGap);
      layer.forEach((id) => {
        const node = nodeById.get(id);
        if (!node) {
          return;
        }
        positions.set(id, { x, y });
        y += this.nodeHeight(node, measuredHeights) + verticalGap;
      });
    });

    return positions;
  }

  private positionIsolatedNodes(
    isolatedNodes: BuilderNode[],
    positionedLinkedNodes: Map<number, { x: number; y: number }>,
    measuredHeights: Map<number, number>
  ): Map<number, { x: number; y: number }> {
    const positions = new Map<number, { x: number; y: number }>();
    if (isolatedNodes.length === 0) {
      return positions;
    }
    const top = 64;
    const verticalGap = 40;
    const linkedMaxX =
      positionedLinkedNodes.size === 0
        ? 64
        : Math.max(...Array.from(positionedLinkedNodes.values()).map((value) => value.x));
    const x = linkedMaxX + this.nodeWidth + 220;
    let y = top;
    isolatedNodes
      .slice()
      .sort((a, b) => a.y - b.y || a.module.id - b.module.id)
      .forEach((node) => {
        positions.set(node.module.id, { x, y });
        y += this.nodeHeight(node, measuredHeights) + verticalGap;
      });
    return positions;
  }

  private buildUnlinkedZone(isolatedIds: number[], nodeById: Map<number, BuilderNode>): UnlinkedZone | null {
    const zonePadding = 20;
    const zoneHeader = 26;
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    isolatedIds.forEach((id) => {
      const node = nodeById.get(id);
      if (!node) {
        return;
      }
      const nodeBottom = node.y + this.nodeHeight(node);
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
      maxX = Math.max(maxX, node.x + this.nodeWidth);
      maxY = Math.max(maxY, nodeBottom);
    });

    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return null;
    }

    return {
      x: minX - zonePadding,
      y: Math.max(12, minY - zonePadding - zoneHeader),
      width: Math.max(this.nodeWidth + zonePadding * 2, maxX - minX + zonePadding * 2),
      height: maxY - minY + zonePadding * 2 + zoneHeader,
      count: isolatedIds.length
    };
  }

  private measureNodeHeights(): Map<number, number> {
    const heights = new Map<number, number>();
    const canvas = this.canvasRef() ?? (document.querySelector('.canvas') as HTMLDivElement | null);
    if (!canvas) {
      return heights;
    }
    canvas.querySelectorAll<HTMLElement>('.module-card[data-module-id]').forEach((element) => {
      const id = Number(element.dataset['moduleId'] ?? '');
      if (!Number.isFinite(id) || id <= 0) {
        return;
      }
      const height = element.getBoundingClientRect().height;
      if (height > 0) {
        heights.set(id, Math.ceil(height));
      }
    });
    return heights;
  }

  private nodeHeight(node: BuilderNode, measuredHeights?: Map<number, number>): number {
    const measured = measuredHeights?.get(node.module.id);
    if (measured && measured > 0) {
      return measured;
    }
    const baseHeight = 260;
    const rowHeight = 62;
    return baseHeight + this.editableFields(node).length * rowHeight;
  }
}
