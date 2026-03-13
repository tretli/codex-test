import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsRingingComponent } from './ringing.details.component';

export const ringingModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.Ringing,
  key: 'ringing',
  component: IvrModuleDetailsRingingComponent,
  preferredLinkField: 'nextModuleId'
});
