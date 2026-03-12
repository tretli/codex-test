import { CallModuleType, ServiceModuleReadDtmf } from '../../../models/models';
import { IvrModuleDetailsReadDtmfComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const readDtmfModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.ReadDtmf,
  key: 'read-dtmf',
  canvas: {
    label: 'Read DTMF',
    color: '#fb923c',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleReadDtmf(input)
  },
  details: {
    component: IvrModuleDetailsReadDtmfComponent,
    supportsBackendLookups: false
  }
};
