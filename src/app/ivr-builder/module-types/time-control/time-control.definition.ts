import { CallModuleType, ServiceModuleTime } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsTimeControlComponent } from './time-control.details.component';

export const timeControlModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Time,
  key: 'time-control',
  label: 'TimeControll',
  color: '#22c55e',
  component: IvrModuleDetailsTimeControlComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleTime(input)
  },
  supportsBackendLookups: true
});
