import { CallModuleType, ServiceModuleMacro } from '../../../models/models';
import { IvrModuleDetailsMacroComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const macroModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.Macro,
  key: 'macro',
  canvas: {
    label: 'Macro',
    color: '#facc15',
    creatable: false
  },
  model: {
    toServiceModule: (input) => new ServiceModuleMacro(input)
  },
  details: {
    component: IvrModuleDetailsMacroComponent,
    supportsBackendLookups: false
  }
};
