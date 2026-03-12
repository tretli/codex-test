import { CallModuleType, ServiceModuleTime } from '../../../models/models';
import { IvrModuleDetailsTimeComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const timeControlModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.Time,
  key: 'time-control',
  canvas: {
    label: 'TimeControll',
    color: '#22c55e',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleTime(input)
  },
  details: {
    component: IvrModuleDetailsTimeComponent,
    supportsBackendLookups: true
  }
};
