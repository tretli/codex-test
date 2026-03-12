import { CallModuleType, ServiceModuleAdvancedMenu } from '../../../models/models';
import { IvrModuleDetailsAdvancedMenuComponent } from '../../module-details/ivr-module-type-details.component';
import { IvrModuleDefinition } from '../ivr-module-definition';

export const advancedMenuModuleDefinition: IvrModuleDefinition = {
  typeId: CallModuleType.AdvancedMenu,
  key: 'advanced-menu',
  canvas: {
    label: 'Menu',
    color: '#0ea5e9',
    creatable: true,
    defaultName: 'Menu',
    preferredLinkField: 'key1ModuleId',
    createDefaults: () => ({
      answer: true,
      background: true,
      interval: 3,
      count: 3,
      surveyModule: false,
      key1ModuleId: 0,
      key2ModuleId: 0,
      keyStarModuleId: 0,
      keyHashModuleId: 0,
      loopExhaustedModuleId: 0
    })
  },
  model: {
    toServiceModule: (input) => new ServiceModuleAdvancedMenu(input)
  },
  details: {
    component: IvrModuleDetailsAdvancedMenuComponent,
    supportsBackendLookups: true
  }
};
