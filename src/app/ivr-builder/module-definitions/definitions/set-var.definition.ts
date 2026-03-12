import { CallModuleType, ServiceModuleSetVar } from '../../../models/models';
import { IvrModuleDetailsSetVarComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const setVarModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.SetVar,
  key: 'set-var',
  canvas: {
    label: 'Set variable',
    color: '#06b6d4',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleSetVar(input)
  },
  details: {
    component: IvrModuleDetailsSetVarComponent,
    supportsBackendLookups: false
  }
};
