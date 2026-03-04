import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

type CanvasExtent = {
  width: number;
  height: number;
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

type ConnectionTooltip = {
  text: string;
  x: number;
  y: number;
};

type Point = {
  x: number;
  y: number;
};

type RenderedConnection = {
  id: string;
  fromId: number;
  toId: number;
  field: string;
  path: string;
  start: Point;
  end: Point;
  color: string;
  tooltip: string;
};

type BuilderNode = {
  module: {
    id: number;
    serviceModuleTypeId: number;
    name?: string;
    [key: string]: unknown;
  };
  x: number;
  y: number;
  linkField: string;
};

type UnlinkedZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  count: number;
};

type ConnectionRouteStyle = 'straight' | 'curved';

@Component({
  selector: 'app-ivr-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ivr-canvas.component.html',
  styleUrl: './ivr-canvas.component.scss'
})
export class IvrCanvasComponent implements AfterViewInit {
  @ViewChild('canvasRoot', { static: true }) canvasRoot!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) canvasExtent!: CanvasExtent;
  @Input() unlinkedZone: UnlinkedZone | null = null;
  @Input({ required: true }) renderedConnections!: RenderedConnection[];
  @Input() connectionDraft: ConnectionDraft | null = null;
  @Input({ required: true }) draftPath = '';
  @Input({ required: true }) draftColor = '#1d4ed8';
  @Input() connectionTooltip: ConnectionTooltip | null = null;
  @Input({ required: true }) nodes!: BuilderNode[];
  @Input() selectedModuleId: number | null = null;
  @Input() selectedConnectionId: string | null = null;
  @Input({ required: true }) routeStyle: ConnectionRouteStyle = 'curved';
  @Input({ required: true }) nodeWidth = 320;
  @Input({ required: true }) collapsedNodeHeight = 86;

  @Input({ required: true }) moduleTypeColor!: (serviceModuleTypeId: number) => string;
  @Input({ required: true }) moduleTypeLabel!: (serviceModuleTypeId: number) => string;
  @Input({ required: true }) nodeLinkFields!: (node: BuilderNode) => string[];
  @Input({ required: true }) outputPortLeft!: (node: BuilderNode, field: string) => number;
  @Input({ required: true }) inputPortLeft!: (node: BuilderNode) => number;
  @Input({ required: true }) collapsedOutputPortLeft!: (node: BuilderNode) => number;
  @Input({ required: true }) isHangupExit!: (node: BuilderNode, field: string) => boolean;
  @Input({ required: true }) outputPortTooltip!: (node: BuilderNode, field: string) => string;
  @Input({ required: true }) connectionAnchorX!: (connection: RenderedConnection) => number;
  @Input({ required: true }) connectionAnchorY!: (connection: RenderedConnection) => number;

  @Output() canvasReady = new EventEmitter<HTMLDivElement>();
  @Output() backgroundPointerDown = new EventEmitter<PointerEvent>();
  @Output() canvasPointerMove = new EventEmitter<PointerEvent>();
  @Output() canvasPointerUp = new EventEmitter<PointerEvent>();
  @Output() canvasPointerCancel = new EventEmitter<PointerEvent>();
  @Output() modulePointerDown = new EventEmitter<{ moduleId: number; event: PointerEvent }>();
  @Output() outputPortPointerDown = new EventEmitter<{ node: BuilderNode; field: string; event: PointerEvent }>();
  @Output() connectionHitPointerDown = new EventEmitter<{ connection: RenderedConnection; event: PointerEvent }>();
  @Output() connectionAnchorPointerDown = new EventEmitter<{ connection: RenderedConnection; event: PointerEvent }>();
  @Output() connectionEnter = new EventEmitter<{ connection: RenderedConnection; event: MouseEvent }>();
  @Output() connectionMove = new EventEmitter<MouseEvent>();
  @Output() connectionLeave = new EventEmitter<void>();
  @Output() connectionRemove = new EventEmitter<RenderedConnection>();

  ngAfterViewInit(): void {
    this.canvasReady.emit(this.canvasRoot.nativeElement);
  }

  onCanvasPointerEnter(): void {
    this.canvasReady.emit(this.canvasRoot.nativeElement);
  }

  trackByNode(_index: number, node: BuilderNode): number {
    return node.module.id;
  }

  trackByConnection(_index: number, connection: RenderedConnection): string {
    return connection.id;
  }
}
