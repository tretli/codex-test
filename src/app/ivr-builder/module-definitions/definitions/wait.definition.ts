import { CallModuleType, ServiceModuleWait } from '../../../models/models';
import { IvrModuleDetailsWaitComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const waitModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.Wait,
  key: 'wait',
  canvas: {
    label: 'Wait',
    color: '#d946ef',
    creatable: true,
    defaultName: 'Wait',
    preferredLinkField: 'nextModuleId',
    createDefaults: () => ({
      wait: 1000,
      nextModuleId: 0
    })
  },
  model: {
    toServiceModule: (input) => new ServiceModuleWait(input)
  },
  details: {
    component: IvrModuleDetailsWaitComponent,
    supportsBackendLookups: false
  }
};
