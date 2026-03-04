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

export type CanvasModuleRecord = {
  id: number;
  serviceModuleTypeId: number;
  name?: string;
  [key: string]: unknown;
};

export type BuilderNode = {
  module: CanvasModuleRecord;
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
