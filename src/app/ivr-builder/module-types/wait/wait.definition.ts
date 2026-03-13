import { CallModuleType, ServiceModuleWait } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsWaitComponent } from './wait.details.component';

export const waitModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Wait,
  key: 'wait',
  label: 'Wait',
  color: '#d946ef',
  component: IvrModuleDetailsWaitComponent,
  creatable: true,
  defaultName: 'Wait',
  preferredLinkField: 'nextModuleId',
  createDefaults: () => ({
    wait: 1000,
    nextModuleId: 0
  }),
  model: {
    toServiceModule: (input) => new ServiceModuleWait(input)
  }
});
