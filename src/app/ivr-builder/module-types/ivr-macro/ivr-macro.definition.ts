import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsIvrMacroComponent } from './ivr-macro.details.component';

export const ivrMacroModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.IvrMacro,
  key: 'ivr-macro',
  component: IvrModuleDetailsIvrMacroComponent,
  preferredLinkField: 'successModuleId'
});
