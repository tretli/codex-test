import { CallModuleType, ServiceModuleAdvancedMenu } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsAdvancedMenuComponent } from './advanced-menu.details.component';

export const advancedMenuModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.AdvancedMenu,
  key: 'advanced-menu',
  label: 'Menu',
  color: '#0ea5e9',
  component: IvrModuleDetailsAdvancedMenuComponent,
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
  }),
  model: {
    toServiceModule: (input) => new ServiceModuleAdvancedMenu(input)
  },
  supportsBackendLookups: true
});
