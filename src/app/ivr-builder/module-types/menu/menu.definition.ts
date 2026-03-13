import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsMenuComponent } from './menu.details.component';

export const menuModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Menu,
  key: 'menu',
  component: IvrModuleDetailsMenuComponent
});
