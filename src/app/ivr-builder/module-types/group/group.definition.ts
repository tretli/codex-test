import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsGroupComponent } from './group.details.component';

export const groupModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Group,
  key: 'group',
  label: 'Group',
  color: '#c084fc',
  component: IvrModuleDetailsGroupComponent
});
