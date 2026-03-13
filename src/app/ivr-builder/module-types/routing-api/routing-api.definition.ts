import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsRoutingApiComponent } from './routing-api.details.component';

export const routingApiModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.RoutingApi,
  key: 'routing-api',
  component: IvrModuleDetailsRoutingApiComponent,
  preferredLinkField: 'successModuleId'
});
