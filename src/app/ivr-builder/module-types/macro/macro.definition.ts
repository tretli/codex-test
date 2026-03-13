import { CallModuleType, ServiceModuleMacro } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsMacroComponent } from './macro.details.component';

export const macroModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Macro,
  key: 'macro',
  label: 'Macro',
  color: '#facc15',
  component: IvrModuleDetailsMacroComponent,
  model: {
    toServiceModule: (input) => new ServiceModuleMacro(input)
  }
});
