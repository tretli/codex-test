import { CallModuleType } from '../../../models/models';
import { createModuleDefinition } from '../shared/module-type-definition.helpers';
import { IvrModuleDetailsReturnOutboundComponent } from './return-outbound.details.component';

export const returnOutboundModuleDefinition = createModuleDefinition({
  typeId: CallModuleType.ReturnOutbound,
  key: 'return-outbound',
  component: IvrModuleDetailsReturnOutboundComponent
});
