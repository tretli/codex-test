import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsNoOpComponent } from './no-op.details.component';

export const noOpModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.NoOp,
  key: 'no-op',
  component: IvrModuleDetailsNoOpComponent,
  preferredLinkField: 'nextModuleId'
});
