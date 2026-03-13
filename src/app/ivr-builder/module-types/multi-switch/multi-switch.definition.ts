import { CallModuleType, ServiceModuleMultiSwitch } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsMultiSwitchComponent } from './multi-switch.details.component';

export const multiSwitchModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.MultiSwitch,
  key: 'multi-switch',
  label: 'Multi switch',
  color: '#14b8a6',
  component: IvrModuleDetailsMultiSwitchComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleMultiSwitch(input)
  }
});
