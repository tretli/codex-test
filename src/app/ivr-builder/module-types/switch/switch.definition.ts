import { CallModuleType, ServiceModuleSwitch } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsSwitchComponent } from './switch.details.component';

export const switchModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Switch,
  key: 'switch',
  label: 'Switch',
  color: '#ca8a04',
  component: IvrModuleDetailsSwitchComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleSwitch(input)
  }
});
