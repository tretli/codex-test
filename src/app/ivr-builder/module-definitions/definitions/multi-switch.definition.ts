import { CallModuleType, ServiceModuleMultiSwitch } from '../../../models/models';
import { IvrModuleDetailsMultiSwitchComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const multiSwitchModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.MultiSwitch,
  key: 'multi-switch',
  canvas: {
    label: 'Multi switch',
    color: '#14b8a6',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleMultiSwitch(input)
  },
  details: {
    component: IvrModuleDetailsMultiSwitchComponent,
    supportsBackendLookups: false
  }
};
