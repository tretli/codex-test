import { InjectionToken } from '@angular/core';

export type IvrDataMode = 'mock' | 'http';

export const IVR_DATA_MODE = new InjectionToken<IvrDataMode>('IVR_DATA_MODE', {
  factory: () => 'mock'
});
