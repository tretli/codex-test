import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsGroupGotoComponent } from './group-goto.details.component';

export const groupGotoModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.GroupGoto,
  key: 'group-goto',
  component: IvrModuleDetailsGroupGotoComponent
});
