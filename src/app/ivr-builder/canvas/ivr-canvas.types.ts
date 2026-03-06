import { IvrModuleRecord } from '../../models/models';

export type Point = {
  x: number;
  y: number;
};

export type CanvasExtent = {
  width: number;
  height: number;
};

export type UnlinkedZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  count: number;
};

export type ConnectionRouteStyle = 'straight' | 'curved';

export type ConnectionDraft = {
  fromId: number;
  field: string;
  pointerId: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
};

export type ConnectionTooltip = {
  text: string;
  x: number;
  y: number;
};

export type BuilderNode = {
  module: IvrModuleRecord;
  x: number;
  y: number;
  linkField: string;
};

export type RenderedConnection = {
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

export type CanvasPointerUpEvent = {
  event: PointerEvent;
  dropModuleId: number | null;
};

export type CanvasAction =
  | { type: 'canvasReady'; element: HTMLDivElement }
  | { type: 'zoomChange'; zoom: number }
  | { type: 'backgroundPointerDown'; event: PointerEvent }
  | { type: 'canvasPointerMove'; event: PointerEvent }
  | { type: 'canvasPointerUp'; payload: CanvasPointerUpEvent }
  | { type: 'canvasPointerCancel'; event: PointerEvent }
  | { type: 'modulePointerDown'; moduleId: number; event: PointerEvent }
  | { type: 'outputPortPointerDown'; node: BuilderNode; field: string; event: PointerEvent }
  | { type: 'connectionHitPointerDown'; connection: RenderedConnection; event: PointerEvent }
  | { type: 'connectionAnchorPointerDown'; connection: RenderedConnection; event: PointerEvent }
  | { type: 'connectionEnter'; connection: RenderedConnection; event: MouseEvent }
  | { type: 'connectionMove'; event: MouseEvent }
  | { type: 'connectionLeave' }
  | { type: 'connectionRemove'; connection: RenderedConnection };
