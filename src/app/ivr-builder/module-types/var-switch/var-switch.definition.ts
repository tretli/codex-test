import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsVarSwitchComponent } from './var-switch.details.component';

export const varSwitchModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.VarSwitch,
  key: 'var-switch',
  component: IvrModuleDetailsVarSwitchComponent,
  preferredLinkField: 'trueModuleId'
});
