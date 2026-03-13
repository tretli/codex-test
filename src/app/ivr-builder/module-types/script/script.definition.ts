import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsScriptComponent } from './script.details.component';

export const scriptModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Script,
  key: 'script',
  component: IvrModuleDetailsScriptComponent
});
