import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsDialComponent } from './dial.details.component';

export const dialModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Dial,
  key: 'dial',
  component: IvrModuleDetailsDialComponent,
  preferredLinkField: 'successModuleId'
});
