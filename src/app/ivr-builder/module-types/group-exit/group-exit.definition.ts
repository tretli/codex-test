import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsGroupExitComponent } from './group-exit.details.component';

export const groupExitModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.GroupExit,
  key: 'group-exit',
  component: IvrModuleDetailsGroupExitComponent
});
