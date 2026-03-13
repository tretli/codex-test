import { CallModuleType, ServiceModuleSetVar } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsSetVarComponent } from './set-var.details.component';

export const setVarModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.SetVar,
  key: 'set-var',
  label: 'Set variable',
  color: '#06b6d4',
  component: IvrModuleDetailsSetVarComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleSetVar(input)
  }
});
