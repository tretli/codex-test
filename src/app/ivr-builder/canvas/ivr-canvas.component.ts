import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  BuilderNode,
  CanvasAction,
  CanvasExtent,
  CanvasPointerUpEvent,
  ConnectionDraft,
  ConnectionRouteStyle,
  ConnectionTooltip,
  RenderedConnection,
  UnlinkedZone
} from './ivr-canvas.types';

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
  @Input() zoom = 1;
  @Input({ required: true }) nodeWidth = 320;
  @Input({ required: true }) collapsedNodeHeight = 86;

  @Input({ required: true }) moduleTypeColor!: (serviceModuleTypeId: number) => string;
  @Input({ required: true }) moduleTypeLabel!: (serviceModuleTypeId: number) => string;
  @Input({ required: true }) nodeLinkFields!: (node: BuilderNode) => string[];
  @Input({ required: true }) outputPortLeft!: (node: BuilderNode, field: string) => number;
  @Input({ required: true }) inputPortLeft!: (node: BuilderNode) => number;
  @Input({ required: true }) collapsedOutputPortLeft!: (node: BuilderNode) => number;
  @Input({ required: true }) nodeHeight!: (node: BuilderNode) => number;
  @Input({ required: true }) isHangupExit!: (node: BuilderNode, field: string) => boolean;
  @Input({ required: true }) outputPortTooltip!: (node: BuilderNode, field: string) => string;
  @Input({ required: true }) outputPortLabel!: (node: BuilderNode, field: string) => string;
  @Input({ required: true }) connectionAnchorX!: (connection: RenderedConnection) => number;
  @Input({ required: true }) connectionAnchorY!: (connection: RenderedConnection) => number;

  @Output() canvasAction = new EventEmitter<CanvasAction>();

  private panState: {
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startScrollLeft: number;
    startScrollTop: number;
  } | null = null;

  ngAfterViewInit(): void {
    this.canvasAction.emit({ type: 'canvasReady', element: this.canvasRoot.nativeElement });
  }

  onCanvasPointerEnter(): void {
    this.canvasAction.emit({ type: 'canvasReady', element: this.canvasRoot.nativeElement });
  }

  trackByNode(_index: number, node: BuilderNode): number {
    return node.module.id;
  }

  trackByConnection(_index: number, connection: RenderedConnection): string {
    return connection.id;
  }

  onCanvasPointerDown(event: PointerEvent): void {
    if (event.button === 2) {
      this.startPan(event);
      return;
    }
    if (this.isInteractiveTarget(event.target as HTMLElement | null)) {
      return;
    }
    this.canvasAction.emit({ type: 'backgroundPointerDown', event });
  }

  onCanvasPointerMove(event: PointerEvent): void {
    const pan = this.panState;
    if (pan && pan.pointerId === event.pointerId) {
      const canvas = this.canvasRoot.nativeElement;
      const dx = event.clientX - pan.startClientX;
      const dy = event.clientY - pan.startClientY;
      canvas.scrollLeft = pan.startScrollLeft - dx;
      canvas.scrollTop = pan.startScrollTop - dy;
      event.preventDefault();
      return;
    }
    this.canvasAction.emit({ type: 'canvasPointerMove', event });
  }

  onCanvasPointerUp(event: PointerEvent): void {
    if (this.panState?.pointerId === event.pointerId) {
      this.endPan(event.pointerId);
      event.preventDefault();
      return;
    }
    const payload: CanvasPointerUpEvent = {
      event,
      dropModuleId: this.resolveDropModuleId(event)
    };
    this.canvasAction.emit({ type: 'canvasPointerUp', payload });
  }

  onCanvasPointerCancel(event: PointerEvent): void {
    if (this.panState?.pointerId === event.pointerId) {
      this.endPan(event.pointerId);
      event.preventDefault();
      return;
    }
    this.canvasAction.emit({ type: 'canvasPointerCancel', event });
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const direction = event.deltaY < 0 ? 1 : -1;
    const nextZoom = this.clampZoom(this.zoom * (direction > 0 ? 1.1 : 0.9));
    if (Math.abs(nextZoom - this.zoom) < 0.0001) {
      return;
    }

    const canvas = this.canvasRoot.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const viewportX = event.clientX - rect.left;
    const viewportY = event.clientY - rect.top;
    const scaledX = viewportX + canvas.scrollLeft;
    const scaledY = viewportY + canvas.scrollTop;
    const worldX = scaledX / this.zoom;
    const worldY = scaledY / this.zoom;

    this.canvasAction.emit({ type: 'zoomChange', zoom: nextZoom });

    const targetScrollLeft = worldX * nextZoom - viewportX;
    const targetScrollTop = worldY * nextZoom - viewportY;
    requestAnimationFrame(() => {
      canvas.scrollLeft = Math.max(0, targetScrollLeft);
      canvas.scrollTop = Math.max(0, targetScrollTop);
    });
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  onModuleCardPointerDown(moduleId: number, event: PointerEvent): void {
    if ((event.target as HTMLElement | null)?.closest('.port')) {
      return;
    }
    this.canvasAction.emit({ type: 'modulePointerDown', moduleId, event });
  }

  onOutputPortPointerDown(node: BuilderNode, field: string, event: PointerEvent): void {
    event.stopPropagation();
    this.canvasAction.emit({ type: 'outputPortPointerDown', node, field, event });
  }

  onConnectionHitPointerDown(connection: RenderedConnection, event: PointerEvent): void {
    this.canvasAction.emit({ type: 'connectionHitPointerDown', connection, event });
  }

  onConnectionAnchorPointerDown(connection: RenderedConnection, event: PointerEvent): void {
    this.canvasAction.emit({ type: 'connectionAnchorPointerDown', connection, event });
  }

  onConnectionEnter(connection: RenderedConnection, event: MouseEvent): void {
    this.canvasAction.emit({ type: 'connectionEnter', connection, event });
  }

  onConnectionMove(event: MouseEvent): void {
    this.canvasAction.emit({ type: 'connectionMove', event });
  }

  onConnectionLeave(): void {
    this.canvasAction.emit({ type: 'connectionLeave' });
  }

  onConnectionRemove(connection: RenderedConnection): void {
    this.canvasAction.emit({ type: 'connectionRemove', connection });
  }

  showCollapsedHangup(node: BuilderNode): boolean {
    const fields = this.nodeLinkFields(node);
    if (fields.length === 0) {
      return false;
    }
    return fields.every((field) => this.isHangupExit(node, field));
  }

  private startPan(event: PointerEvent): void {
    const canvas = this.canvasRoot.nativeElement;
    this.panState = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startScrollLeft: canvas.scrollLeft,
      startScrollTop: canvas.scrollTop
    };
    try {
      if (!canvas.hasPointerCapture(event.pointerId)) {
        canvas.setPointerCapture(event.pointerId);
      }
    } catch {
      // Ignore pointer-capture failures on unsupported paths.
    }
    event.preventDefault();
  }

  private endPan(pointerId: number): void {
    const canvas = this.canvasRoot.nativeElement;
    try {
      if (canvas.hasPointerCapture(pointerId)) {
        canvas.releasePointerCapture(pointerId);
      }
    } catch {
      // Ignore pointer-release failures on unsupported paths.
    }
    this.panState = null;
  }

  private clampZoom(value: number): number {
    return Math.min(2.2, Math.max(0.45, value));
  }

  private resolveDropModuleId(event: PointerEvent): number | null {
    const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
    if (!element) {
      return null;
    }
    const inputPort = element.closest('[data-port-input]') as HTMLElement | null;
    const moduleCard = element.closest('[data-module-id]') as HTMLElement | null;
    const candidate = Number(inputPort?.dataset['portInput'] ?? moduleCard?.dataset['moduleId'] ?? '');
    return Number.isFinite(candidate) && candidate > 0 ? candidate : null;
  }

  private isInteractiveTarget(target: HTMLElement | null): boolean {
    if (!target) {
      return false;
    }
    return Boolean(
      target.closest('[data-module-id]') ||
      target.closest('.port') ||
      target.closest('.connection-line') ||
      target.closest('.connection-hitline') ||
      target.closest('.connection-anchor')
    );
  }
}
