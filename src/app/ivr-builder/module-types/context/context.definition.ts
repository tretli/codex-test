import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsContextComponent } from './context.details.component';

export const contextModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Context,
  key: 'context',
  component: IvrModuleDetailsContextComponent
});
