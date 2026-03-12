import { CallModuleType, ServiceModuleSwitch } from '../../../models/models';
import { IvrModuleDetailsSwitchComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const switchModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.Switch,
  key: 'switch',
  canvas: {
    label: 'Switch',
    color: '#ca8a04',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleSwitch(input)
  },
  details: {
    component: IvrModuleDetailsSwitchComponent,
    supportsBackendLookups: false
  }
};
